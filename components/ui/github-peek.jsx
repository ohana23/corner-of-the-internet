import React, { useMemo, useCallback, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ROWS = 11;
const COLS = 20;
const CARD_PADDING = 24;
const GAP_RATIO = 0.2; // gap as a fraction of square size

const PALETTE = [
  "#b5ad9e",
  "#a8a08e",
  "#9c9680",
  "#8f8972",
  "#c2b9a8",
  "#a09a88",
  "#8a8470",
  "#7d7862",
  "#b0a890",
  "#978f7a",
  "#6e6b58",
  "#bcb49e",
  "#ada68e",
  "#c8c0ae",
  "#9a9480",
  "#85806c",
  "#767058",
  "#a39c86",
  "#bab2a0",
  "#706a56",
];

export const GitHubPeek = ({ isOpen }) => {
  const [layout, setLayout] = useState({
    top: 0,
    left: 0,
    squareSize: 14,
    gap: 3,
  });

  const squares = useMemo(() => {
    return Array.from({ length: ROWS * COLS }, () => ({
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    }));
  }, []);

  const calculateLayout = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 60;

    const textContainerRight = Math.min(450 + 40, viewportWidth * 0.4);
    const spacing = 40;
    const left = textContainerRight + spacing;

    const availableWidth =
      viewportWidth - left - edgePadding - CARD_PADDING * 2;
    const availableHeight = viewportHeight - edgePadding * 2 - CARD_PADDING * 2;

    // Solve for square size: availableWidth = COLS * size + (COLS - 1) * size * GAP_RATIO
    const sizeFromWidth = availableWidth / (COLS + (COLS - 1) * GAP_RATIO);
    const sizeFromHeight = availableHeight / (ROWS + (ROWS - 1) * GAP_RATIO);
    const squareSize = Math.floor(Math.min(sizeFromWidth, sizeFromHeight));
    const gap = Math.max(2, Math.round(squareSize * GAP_RATIO));

    const gridWidth = COLS * squareSize + (COLS - 1) * gap;
    const gridHeight = ROWS * squareSize + (ROWS - 1) * gap;
    const totalHeight = gridHeight + CARD_PADDING * 2;
    const top = Math.max(edgePadding, (viewportHeight - totalHeight) / 2);

    return { top, left, squareSize, gap };
  }, []);

  useEffect(() => {
    setLayout(calculateLayout());

    const handleResize = () => setLayout(calculateLayout());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateLayout]);

  return (
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
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: `${CARD_PADDING}px`,
              backgroundColor: "var(--background-color, #f2f1ed)",
              borderRadius: "16px",
              boxShadow: "0 4px 40px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${COLS}, ${layout.squareSize}px)`,
                gap: `${layout.gap}px`,
              }}
            >
              {squares.map((sq, i) => (
                <div
                  key={i}
                  style={{
                    width: layout.squareSize,
                    height: layout.squareSize,
                    borderRadius: Math.max(
                      2,
                      Math.round(layout.squareSize * 0.15),
                    ),
                    backgroundColor: sq.color,
                    animation: `twinkle ${sq.duration}s ease-in-out ${sq.delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
