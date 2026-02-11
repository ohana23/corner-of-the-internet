import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUOTES = [
  "if only my personality had as many layers as my figma files",
  "i must not subject myself to low quality software",
  "mediocrity is the result of a thousand shortcuts",
  "There are no ceilings in nature. Limits are invented by man.",
  "Orlando coffee shops should start charging me rent.",
  '"Everything is easy until you start working on it." - Nick Tilden',
  "\"If you don't try to be the best, you won't even be good.\" - Paul Graham",
  '"Adopt beliefs only for what you currently need."',
  '"A whaleship was my Yale College and my Harvard" - Herman Melville',
  '"Make mistakes of ambition; not of sloth." - Machiavelli',
  '"Bring who you are—never who they want—and that, my friend, is when it gets fun." - from Everybody Wants Some!!',
  '"Frontiers are where you find them." - from Everybody Wants Some!!',
  '"Complexity fails." - Tim Ferriss',
  '"Find ways to hack your industry and then the world will gravitate towards you and you won\'t have to gravitate towards it." - Andrew Schulz',
  '"The best lack conviction. The worst are full of passionate intensity." - WB Yates',
  '"Less impressed. More involved." - Matthew McConaughey',
  "\"The Road then raised me up and said 'All things grow and change. That is the magic of being alive. You too will find your wings. You too will bloom. No living thing is meant to stay the same.'\" - Cleo Wade",
];

const TYPEWRITER_DURATION = 3000;
const PAUSE_DURATION = 3000;

export const XPeek = ({ isOpen }) => {
  const [layout, setLayout] = useState({ top: 0, left: 0, width: 400 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);
  const animFrameRef = useRef(null);
  const timeoutRef = useRef(null);

  const shuffledQuotes = useMemo(
    () => [...QUOTES].sort(() => Math.random() - 0.5),
    [],
  );

  const calculateLayout = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 60;

    const textContainerRight = Math.min(450 + 40, viewportWidth * 0.4);
    const spacing = 40;
    const leftEdge = textContainerRight + spacing;

    const availableWidth = viewportWidth - leftEdge - edgePadding;
    const width = Math.min(600, Math.max(300, availableWidth));

    const left = leftEdge + (availableWidth - width) / 2;

    const stackHeight = 200;
    const top = Math.max(edgePadding, (viewportHeight - stackHeight) / 2);

    return { top, left, width };
  }, []);

  useEffect(() => {
    setLayout(calculateLayout());
    const handleResize = () => setLayout(calculateLayout());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateLayout]);

  // Measure content height after each render
  useEffect(() => {
    if (contentRef.current) {
      const h = contentRef.current.scrollHeight;
      if (h !== contentHeight) {
        setContentHeight(h);
      }
    }
  });

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setDisplayedChars(0);
      return;
    }

    const text = shuffledQuotes[currentIndex];
    const totalChars = text.length;
    const charInterval = TYPEWRITER_DURATION / totalChars;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const chars = Math.min(totalChars, Math.floor(elapsed / charInterval));
      setDisplayedChars(chars);

      if (chars < totalChars) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % shuffledQuotes.length);
          setDisplayedChars(0);
        }, PAUSE_DURATION);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [isOpen, currentIndex, shuffledQuotes]);

  const currentText = shuffledQuotes[currentIndex];

  return (
    <>
      <style>{`
        @keyframes charGlow {
          from { text-shadow: 0 0 8px currentColor; }
          to { text-shadow: none; }
        }
        .typewriter-char {
          animation: charGlow 800ms ease-out forwards;
        }
      `}</style>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.5,
              },
            }}
            exit={{
              opacity: 0,
              x: 20,
              scale: 0.95,
              transition: { duration: 0.15 },
            }}
            style={{
              position: "fixed",
              top: `${layout.top}px`,
              left: `${layout.left}px`,
              width: `${layout.width}px`,
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            <motion.div
              animate={{ height: contentHeight || "auto" }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                width: "100%",
                backgroundColor: "var(--card-background, #f2f1ed)",
                borderRadius: 20,
                boxShadow: "0 4px 40px 0 rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div ref={contentRef} style={{ padding: "32px" }}>
                <div
                  style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
                >
                  <img
                    src="/avatar.webp"
                    alt=""
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      flexShrink: 0,
                      objectFit: "cover",
                      objectPosition: "center 30%",
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 20,
                          color: "var(--primary-color, #444445)",
                        }}
                      >
                        Danny
                      </span>
                      <span style={{ fontSize: 18, color: "#787771" }}>
                        @ohanaspeaking
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "12px 0 0",
                        fontSize: 20,
                        lineHeight: "1.5",
                        color: "var(--primary-color, #444445)",
                        minHeight: "1.5em",
                      }}
                    >
                      {currentText
                        .slice(0, displayedChars)
                        .split("")
                        .map((char, i) => (
                          <span
                            key={`${currentIndex}-${i}`}
                            className="typewriter-char"
                          >
                            {char}
                          </span>
                        ))}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
