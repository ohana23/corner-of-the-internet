import React, { useCallback, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORK_ITEMS = [
  {
    company: "Procore",
    role: "Product Designer",
    period: "Current",
    icon: "/work-icons/procore.png",
  },
  {
    company: "SportAI",
    role: "Founding Design Engineer",
    period: "2021 – 2022",
    icon: "/work-icons/sportai.png",
  },
  {
    company: "GEICO",
    role: "Full-Stack Engineer",
    period: "2019 – 2021",
    icon: "/work-icons/geico.png",
  },
];

export const WorkPeek = ({ isOpen }) => {
  const [layout, setLayout] = useState({ top: 0, left: 0, width: 400 });

  const calculateLayout = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 60;

    const textContainerRight = Math.min(450 + 40, viewportWidth * 0.4);
    const spacing = 40;
    const leftEdge = textContainerRight + spacing;

    const availableWidth = viewportWidth - leftEdge - edgePadding;
    const width = Math.min(420, Math.max(280, availableWidth));

    const left = leftEdge + (availableWidth - width) / 2;

    const estimatedHeight = WORK_ITEMS.length * 56 + 48;
    const top = Math.max(edgePadding, (viewportHeight - estimatedHeight) / 2);

    return { top, left, width };
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
            width: `${layout.width}px`,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: 16,
              backgroundColor: "#ffffff",
              borderRadius: 20,
              boxShadow: "0 4px 40px 0 rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {WORK_ITEMS.map((item, index) => (
              <motion.div
                key={item.company}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.04,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "8px 8px",
                  borderRadius: 12,
                }}
              >
                <img
                  src={item.icon}
                  alt={item.company}
                  style={{
                    width: 36,
                    height: 36,
                    // borderRadius: 8,
                    flexShrink: 0,
                    objectFit: "contain",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        fontSize: 18,
                        display: "block",
                        color: "var(--primary-color, #444445)",
                      }}
                    >
                      {item.company}
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        color: "#787771",
                      }}
                    >
                      {item.role}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#787771",
                      flexShrink: 0,
                    }}
                  >
                    {item.period}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
