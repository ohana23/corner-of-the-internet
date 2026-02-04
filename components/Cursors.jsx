import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePartySocket from "partysocket/react";
import { generateIdentity } from "../lib/nameGenerator";

// Configuration - update this after deploying your PartyKit server
const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "corner-cursors.ohana23.partykit.dev";
const ROOM_NAME = "main";

// Throttle helper for performance
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function Cursors() {
  const [cursors, setCursors] = useState({});
  const [identity, setIdentity] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Generate identity on mount (client-side only)
  useEffect(() => {
    const stored = sessionStorage.getItem("cursor-identity");
    if (stored) {
      setIdentity(JSON.parse(stored));
    } else {
      const newIdentity = generateIdentity();
      sessionStorage.setItem("cursor-identity", JSON.stringify(newIdentity));
      setIdentity(newIdentity);
    }
  }, []);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: ROOM_NAME,
    onOpen() {
      setIsConnected(true);
    },
    onClose() {
      setIsConnected(false);
    },
    onMessage(event) {
      const data = JSON.parse(event.data);

      if (data.type === "sync") {
        setCursors(data.cursors);
      } else if (data.type === "update") {
        setCursors((prev) => ({
          ...prev,
          [data.id]: data.cursor,
        }));
      } else if (data.type === "remove") {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[data.id];
          return next;
        });
      }
    },
  });

  // Track mouse movement
  const sendCursorUpdate = useCallback(
    throttle((x, y) => {
      if (socket && identity) {
        socket.send(
          JSON.stringify({
            type: "cursor",
            cursor: {
              x: x / window.innerWidth,
              y: y / window.innerHeight,
              name: identity.name,
              color: identity.color,
            },
          })
        );
      }
    }, 50), // Throttle to 20fps for network efficiency
    [socket, identity]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      sendCursorUpdate(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      if (socket) {
        socket.send(JSON.stringify({ type: "remove" }));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [sendCursorUpdate, socket]);

  if (!isConnected) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {Object.entries(cursors).map(([id, cursor]) => (
          <Cursor key={id} cursor={cursor} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Cursor({ cursor }) {
  const x = cursor.x * window.innerWidth;
  const y = cursor.y * window.innerHeight;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: x,
        y: y,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale: { type: "spring", stiffness: 500, damping: 30 },
        opacity: { duration: 0.2 },
        x: { type: "spring", stiffness: 200, damping: 25 },
        y: { type: "spring", stiffness: 200, damping: 25 },
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`,
        }}
      >
        <path
          d="M5.65376 3.35376L19.2538 11.8538C19.8538 12.2538 19.6538 13.1538 18.9538 13.2538L12.6538 14.0538L9.85376 19.8538C9.55376 20.4538 8.65376 20.3538 8.55376 19.6538L5.05376 4.25376C4.95376 3.55376 5.25376 3.05376 5.65376 3.35376Z"
          fill={cursor.color}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>

      {/* Name label */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          backgroundColor: cursor.color,
          color: getContrastColor(cursor.color),
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontFamily:
            'GT Pressura, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {cursor.name}
      </motion.div>
    </motion.div>
  );
}

// Helper to determine text color based on background
function getContrastColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
