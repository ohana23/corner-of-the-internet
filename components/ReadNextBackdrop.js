import { useEffect, useRef } from "react";
import styles from "./ReadNext.module.css";

const GRID_SPACING = 22;
const TEXT_CLEARANCE = 20;
const EDGE_FADE = 36;
const BLUES = ["0, 85, 255", "8, 98, 244", "26, 112, 255", "4, 72, 230", "46, 143, 255"];
const TAU = Math.PI * 2;
const mix = (from, to, progress) => from + (to - from) * progress;

function randomForCell(column, row, salt) {
  const value = Math.sin(column * 127.1 + row * 311.7 + salt * 74.7) * 43758.5453;
  return value - Math.floor(value);
}

function smoothFade(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

const FLIGHT_EASINGS = [
  smoothFade,
  (t) => 1 - Math.pow(1 - t, 3),
  (t) => 0.5 - Math.cos(Math.PI * t) / 2,
  (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
];

function curvePoint(start, firstControl, secondControl, end, t) {
  const inverse = 1 - t;
  return inverse ** 3 * start + 3 * inverse ** 2 * t * firstControl
    + 3 * inverse * t ** 2 * secondControl + t ** 3 * end;
}

// Sample a shaft and two wings. The arrow itself is made entirely of grid dots.
function arrowPoint(dot, arrow) {
  const part = dot.shape;
  let x;
  let y;
  if (part < 0.46) {
    x = mix(-0.5, 0.5, part / 0.46);
    y = 0;
  } else {
    const upper = part < 0.73;
    const progress = (part - (upper ? 0.46 : 0.73)) / 0.27;
    x = mix(0.04, 0.5, progress);
    y = mix(upper ? -0.5 : 0.5, 0, progress);
  }
  const spread = Math.min(1.1, arrow.width * 0.04);
  return {
    x: arrow.x + x * arrow.width * arrow.direction + Math.cos(dot.phase) * spread,
    y: arrow.y + y * arrow.height + Math.sin(dot.phase) * spread,
  };
}

export default function ReadNextBackdrop({ contentRef, activeLink }) {
  const canvasRef = useRef(null);
  const activeLinkRef = useRef(activeLink);
  const retargetRef = useRef(null);

  useEffect(() => {
    activeLinkRef.current = activeLink;
    retargetRef.current?.();
  }, [activeLink]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    const context = canvas.getContext("2d");
    if (!context || !content) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let dots = [];
    let protectedRects = [];
    let contentBounds;
    let visible = false;
    let disposed = false;
    let animationFrame = null;
    let lastFrame = null;
    let elapsed = 13000;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const seconds = motionPreference.matches ? 13 : elapsed / 1000;
      const breath = 0.3 + 0.7 * smoothFade(0.5 + 0.5 * Math.sin(seconds * TAU / 7.5));

      dots.forEach((dot) => {
        if (dot.flight) {
          const flight = dot.flight;
          const progress = Math.max(0, Math.min(1, (elapsed - flight.start) / flight.duration));
          const eased = FLIGHT_EASINGS[dot.easing](progress);
          dot.x = curvePoint(flight.x, flight.firstX, flight.secondX, dot.targetX, eased);
          dot.y = curvePoint(flight.y, flight.firstY, flight.secondY, dot.targetY, eased);
          dot.formation = mix(flight.formation, flight.targetFormation, smoothFade(progress));
          if (progress === 1) dot.flight = null;
        } else {
          dot.x = dot.targetX;
          dot.y = dot.targetY;
        }

        const pulse = Math.pow(0.5 + 0.5 * Math.sin(seconds * TAU / dot.period + dot.phase), 1.6);
        const gridOpacity = dot.fade * dot.opacity * breath * pulse;
        const flockOpacity = 0.42 + 0.1 * Math.sin(seconds * 1.4 + dot.phase);
        const opacity = mix(gridOpacity, flockOpacity, dot.formation);
        const radius = mix(dot.radius, dot.flockRadius, dot.formation);
        const floating = motionPreference.matches ? 0 : dot.formation;
        const floatX = floating * (Math.sin(seconds * 1.2 + dot.side) * 0.7
          + Math.sin(seconds * 1.7 + dot.phase) * 0.4) * dot.floatScale;
        const floatY = floating * (Math.sin(seconds * 1.5 + dot.side) * 1.1
          + Math.cos(seconds * 1.9 + dot.phase) * 0.5) * dot.floatScale;
        context.fillStyle = `rgba(${dot.color}, ${opacity})`;
        context.beginPath();
        context.arc(dot.x + floatX, dot.y + floatY, radius, 0, TAU);
        context.fill();
      });

      // Dots may travel behind the reading area, but never paint over any text.
      protectedRects.forEach((rect) => context.clearRect(rect.x, rect.y, rect.width, rect.height));
    };

    const retarget = () => {
      const link = activeLinkRef.current;
      const title = link?.querySelector(`.${styles.title}`);
      const canvasBounds = canvas.getBoundingClientRect();
      const titleBounds = title?.getBoundingClientRect();
      let arrows;
      if (titleBounds) {
        const left = titleBounds.left - canvasBounds.left;
        const right = titleBounds.right - canvasBounds.left;
        const y = titleBounds.top - canvasBounds.top + titleBounds.height / 2;
        // Shrink the arrows in narrow gutters so wrapped mobile titles stay clear.
        const makeArrow = (edge, space, direction) => {
          const arrowWidth = Math.min(30, Math.max(6, space - 14));
          const gap = Math.min(16, Math.max(7, space * 0.2));
          return {
            x: edge - direction * (gap + arrowWidth / 2),
            y,
            width: arrowWidth,
            height: Math.min(22, arrowWidth * 1.15),
            direction,
          };
        };
        arrows = [makeArrow(left, left, 1), makeArrow(right, width - right, -1)];
      }

      dots.forEach((dot) => {
        const arrow = arrows?.[dot.side];
        const target = arrow ? arrowPoint(dot, arrow) : { x: dot.homeX, y: dot.homeY };
        dot.targetX = target.x;
        dot.targetY = target.y;
        dot.floatScale = arrow ? Math.min(1, arrow.width / 24) : dot.floatScale;
        if (motionPreference.matches) {
          dot.x = target.x;
          dot.y = target.y;
          dot.formation = arrow ? 1 : 0;
          dot.flight = null;
          return;
        }

        const lane = dot.side === 0
          ? Math.max(5, Math.min(contentBounds.left - 42, target.x - 28))
          : Math.min(width - 5, Math.max(contentBounds.right + 42, target.x + 28));
        const distance = Math.hypot(target.x - dot.x, target.y - dot.y);
        const bend = Math.sin(dot.phase) * Math.min(65, distance * 0.2);
        dot.flight = {
          x: dot.x,
          y: dot.y,
          firstX: arrow ? mix(dot.x, lane, 0.65) : lane,
          firstY: arrow ? mix(dot.y, target.y, 0.12) + bend : dot.y + bend,
          secondX: arrow ? lane : mix(target.x, lane, 0.5),
          secondY: arrow ? target.y : mix(target.y, dot.y, 0.15) - bend,
          formation: dot.formation,
          targetFormation: arrow ? 1 : 0,
          start: elapsed + dot.delay / 2,
          duration: ((arrow ? 700 : 850) + dot.duration + Math.min(distance * 0.2, 220)) / 2,
        };
      });
      draw();
    };
    retargetRef.current = retarget;

    const measure = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const readingBounds = content.getBoundingClientRect();
      contentBounds = { left: readingBounds.left - bounds.left, right: readingBounds.right - bounds.left };

      const textBounds = Array.from(content.children, (child) => child.getBoundingClientRect());
      const clearArea = {
        left: Math.min(...textBounds.map((rect) => rect.left)) - bounds.left - TEXT_CLEARANCE,
        right: Math.max(...textBounds.map((rect) => rect.right)) - bounds.left + TEXT_CLEARANCE,
        top: Math.min(...textBounds.map((rect) => rect.top)) - bounds.top - TEXT_CLEARANCE,
        bottom: Math.max(...textBounds.map((rect) => rect.bottom)) - bounds.top + TEXT_CLEARANCE,
      };
      protectedRects = Array.from(content.querySelectorAll(`h2, .${styles.title}, .${styles.subtitle}`), (element) => {
        const rect = element.getBoundingClientRect();
        return { x: rect.left - bounds.left - 5, y: rect.top - bounds.top - 5, width: rect.width + 10, height: rect.height + 10 };
      });

      dots = [];
      const offsetX = (width % GRID_SPACING) / 2;
      const offsetY = (height % GRID_SPACING) / 2;
      for (let row = 0, y = offsetY; y < height; row++, y += GRID_SPACING) {
        for (let column = 0, x = offsetX; x < width; column++, x += GRID_SPACING) {
          const random = (salt) => randomForCell(column, row, salt);
          const radius = 0.8 + random(1) * 0.85;
          const distance = Math.hypot(
            Math.max(clearArea.left - x, 0, x - clearArea.right),
            Math.max(clearArea.top - y, 0, y - clearArea.bottom),
          );
          if (distance <= radius + 1) continue;
          const fade = smoothFade((distance - radius - 1) / EDGE_FADE)
            * smoothFade(Math.min(y, height - y) / 28);
          dots.push({
            x, y, radius, fade,
            homeX: x, homeY: y, targetX: x, targetY: y,
            color: BLUES[Math.floor(random(2) * BLUES.length)],
            opacity: 0.8 + random(3) * 0.2,
            phase: random(4) * TAU,
            period: 3.8 + random(5) * 2.6,
            side: x < width / 2 ? 0 : 1,
            shape: random(6),
            delay: random(7) * 160,
            duration: random(8) * 420,
            easing: Math.floor(random(9) * FLIGHT_EASINGS.length),
            flockRadius: 0.45 + random(10) * 0.35,
            formation: 0,
            floatScale: 1,
            flight: null,
          });
        }
      }
      if (activeLinkRef.current) retarget();
      else draw();
    };

    const animate = (now) => {
      if (!visible || document.hidden || motionPreference.matches) {
        animationFrame = null;
        lastFrame = null;
        return;
      }
      if (lastFrame === null) lastFrame = now;
      const delta = now - lastFrame;
      // Smooth flight at display rate; the idle dot matrix only needs 30 fps.
      if (delta >= (activeLinkRef.current || dots.some((dot) => dot.flight) ? 0 : 1000 / 30)) {
        elapsed += Math.min(delta, 100);
        lastFrame = now;
        draw();
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      lastFrame = null;
      if (motionPreference.matches) retarget();
      if (visible && !document.hidden && !motionPreference.matches) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        draw();
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(canvas);
    resizeObserver.observe(content);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateAnimation();
    });
    intersectionObserver.observe(canvas);
    motionPreference.addEventListener("change", updateAnimation);
    document.addEventListener("visibilitychange", updateAnimation);
    window.addEventListener("resize", measure);
    document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    measure();

    return () => {
      disposed = true;
      retargetRef.current = null;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionPreference.removeEventListener("change", updateAnimation);
      document.removeEventListener("visibilitychange", updateAnimation);
      window.removeEventListener("resize", measure);
    };
  }, [contentRef]);

  return <canvas ref={canvasRef} className={styles.backdrop} aria-hidden="true" />;
}
