import Image from "next/image";
import { encode } from "qss";
import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "../../lib/utils";

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  layout = "fixed",
  isStatic = false,
  imageSrc = "",
}) => {
  let src;
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 3,
      "viewport.height": height * 3,
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }

  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const triggerRef = React.useRef(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = { stiffness: 300, damping: 30 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const spacing = 8; // Reduced spacing to bring it closer
    let top = rect.top - height - spacing;
    let left = rect.left + rect.width / 2 - width / 2;
    
    // Keep card within viewport bounds
    const viewportWidth = window.innerWidth;
    
    // Adjust horizontal position if it goes off screen
    if (left < spacing) {
      left = spacing;
    } else if (left + width > viewportWidth - spacing) {
      left = viewportWidth - width - spacing;
    }
    
    // If card would go above viewport, show it below instead
    if (top < spacing) {
      top = rect.bottom + spacing;
    }
    
    setPosition({ top, left });
  }, [width, height]);

  const handleMouseMove = (event) => {
    if (!isOpen && triggerRef.current) {
      updatePosition();
    }
    if (!isOpen) return;
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  const handleMouseEnter = () => {
    updatePosition();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    x.set(0); // Reset horizontal offset
  };

  return (
    <>
      {isMounted ? (
        <div style={{ display: "none" }}>
          <Image
            src={src}
            width={width}
            height={height}
            quality={quality}
            layout={layout}
            priority={true}
            alt="hidden image"
          />
        </div>
      ) : null}
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ position: "relative", display: "inline" }}
      >
        <a
          href={url}
          className={cn(className)}
          style={{ display: "inline" }}
        >
          {children}
        </a>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
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
                y: 10,
                scale: 0.95,
                transition: {
                  duration: 0.15,
                },
              }}
              style={{
                position: "fixed",
                top: `${position.top}px`,
                left: `${position.left}px`,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: "12px",
                zIndex: 50,
                pointerEvents: "none",
                x: translateX,
              }}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "4px",
                  backgroundColor: "white",
                  border: "2px solid transparent",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  borderRadius: "12px",
                  fontSize: 0,
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <Image
                  src={isStatic ? imageSrc : src}
                  width={width}
                  height={height}
                  quality={quality}
                  layout={layout}
                  priority={true}
                  style={{ borderRadius: "8px", display: "block" }}
                  alt="preview image"
                />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </>
  );
};
