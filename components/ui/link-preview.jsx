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
  quality = 50,
  isStatic = false,
  imageSrc = "",
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const triggerRef = React.useRef(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [dimensions, setDimensions] = React.useState({ width: 350, height: 220 });

  // Calculate dynamic dimensions based on available space while preserving aspect ratio
  const calculateDimensions = React.useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 60; // Padding from viewport edges
    // Container adds: 8px padding * 2 + 2px border * 2 = 20px to each dimension
    const containerExtra = 20;

    // Text container is max-width 450px + 20px body padding on each side
    const textContainerRight = Math.min(450 + 40, viewportWidth * 0.4);
    const spacing = 40;

    // Available space for the entire container (image + padding + border)
    const totalAvailableWidth = viewportWidth - textContainerRight - spacing - edgePadding;
    const totalAvailableHeight = viewportHeight - (edgePadding * 2);

    // Available space for just the image
    const availableWidth = totalAvailableWidth - containerExtra;
    const availableHeight = totalAvailableHeight - containerExtra;

    // Original aspect ratio is 200:125 = 1.6:1
    const aspectRatio = 1.6;

    // Calculate dimensions that fit within available space while preserving aspect ratio
    let width = availableWidth;
    let height = width / aspectRatio;

    // If height exceeds available height, constrain by height instead
    if (height > availableHeight) {
      height = availableHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.max(Math.floor(width), 200),
      height: Math.max(Math.floor(height), 125),
    };
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const updateDimensions = () => {
      setDimensions(calculateDimensions());
    };

    checkMobile();
    updateDimensions();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [calculateDimensions]);

  // For microlink API (when not using static images)
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
      "viewport.width": dimensions.width * 2,
      "viewport.height": dimensions.height * 2,
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }

  const springConfig = { stiffness: 300, damping: 30 };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const translateX = useSpring(x, springConfig);
  const translateY = useSpring(y, springConfig);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 60;
    const containerExtra = 20; // padding (16) + border (4)

    // Desktop: position on the right side of the page, filling available space
    if (!isMobile) {
      // Text container is max-width 450px + 20px body padding on each side
      const textContainerRight = Math.min(450 + 40, viewportWidth * 0.4);
      const spacing = 40;

      const left = textContainerRight + spacing;
      // Vertically center the container in the viewport
      const totalHeight = dimensions.height + containerExtra;
      const top = Math.max(edgePadding, (viewportHeight - totalHeight) / 2);

      setPosition({ top, left });
    } else {
      // Mobile: fall back to original above/below positioning
      const spacing = 8;
      const mobileWidth = 280;
      const mobileHeight = 175;
      let top = rect.top - mobileHeight - spacing;
      let left = rect.left + rect.width / 2 - mobileWidth / 2;

      if (left < spacing) {
        left = spacing;
      } else if (left + mobileWidth > viewportWidth - spacing) {
        left = viewportWidth - mobileWidth - spacing;
      }

      if (top < spacing) {
        top = rect.bottom + spacing;
      }

      setPosition({ top, left });
    }
  }, [isMobile, dimensions.height]);

  const handleMouseMove = (event) => {
    if (!isOpen && triggerRef.current) {
      updatePosition();
    }
    if (!isOpen) return;
    const targetRect = event.target.getBoundingClientRect();

    if (!isMobile) {
      // Desktop: vertical parallax for right-side positioning
      const eventOffsetY = event.clientY - targetRect.top;
      const offsetFromCenter = (eventOffsetY - targetRect.height / 2) / 4;
      y.set(offsetFromCenter);
    } else {
      // Mobile: horizontal parallax
      const eventOffsetX = event.clientX - targetRect.left;
      const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
      x.set(offsetFromCenter);
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    x.set(0);
    y.set(0);
  };

  const displayWidth = isMobile ? 280 : dimensions.width;
  const displayHeight = isMobile ? 175 : dimensions.height;

  return (
    <>
      {isMounted ? (
        <div style={{ display: "none" }}>
          <Image
            src={src}
            width={displayWidth}
            height={displayHeight}
            quality={quality}
            layout="fixed"
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
              initial={isMobile ? { opacity: 0, y: 10, scale: 0.95 } : { opacity: 0, x: 20, scale: 0.95 }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 0.5,
                },
              }}
              exit={isMobile ? {
                opacity: 0,
                y: 10,
                scale: 0.95,
                transition: {
                  duration: 0.15,
                },
              } : {
                opacity: 0,
                x: 20,
                scale: 0.95,
                transition: {
                  duration: 0.15,
                },
              }}
              style={{
                position: "fixed",
                top: `${position.top}px`,
                left: `${position.left}px`,
                borderRadius: "16px",
                zIndex: 50,
                pointerEvents: "none",
                ...(isMobile ? { x: translateX } : { y: translateY }),
              }}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "8px",
                  backgroundColor: "white",
                  border: "2px solid transparent",
                  boxShadow: "0 4px 40px 0 rgba(0, 0, 0, 0.15)",
                  borderRadius: "16px",
                  fontSize: 0,
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <Image
                  src={isStatic ? imageSrc : src}
                  width={displayWidth}
                  height={displayHeight}
                  quality={quality}
                  layout="fixed"
                  priority={true}
                  style={{ borderRadius: "12px", display: "block", objectFit: "cover" }}
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
