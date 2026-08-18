import { useCallback, useEffect, useRef, useState } from "react";

const VIEWER_ZOOM_SCALE = 1.55;
const DRAG_THRESHOLD = 3;

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

export function useViewerZoom(mediaId) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isZoomAnimating, setIsZoomAnimating] = useState(false);
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 });
  const imageRef = useRef(null);
  const originRef = useRef(origin);
  const panRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef(null);
  const didPanRef = useRef(false);
  const zoomAnimationTimerRef = useRef(null);
  const zoomAnimationFrameRef = useRef(null);

  const clearZoomAnimation = useCallback(() => {
    if (zoomAnimationTimerRef.current !== null) {
      window.clearTimeout(zoomAnimationTimerRef.current);
      zoomAnimationTimerRef.current = null;
    }
    if (zoomAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(zoomAnimationFrameRef.current);
      zoomAnimationFrameRef.current = null;
    }
  }, []);

  const applyPan = useCallback((nextPan) => {
    panRef.current = nextPan;
    imageRef.current?.style.setProperty("--viewer-pan-x", `${nextPan.x}px`);
    imageRef.current?.style.setProperty("--viewer-pan-y", `${nextPan.y}px`);
  }, []);

  const resetZoom = useCallback((animate = false) => {
    clearZoomAnimation();
    setIsPanning(false);
    pointerRef.current = null;
    didPanRef.current = false;

    if (animate && isZoomed) {
      setIsZoomAnimating(true);
      zoomAnimationFrameRef.current = window.requestAnimationFrame(() => {
        applyPan({ x: 0, y: 0 });
        setIsZoomed(false);
        zoomAnimationFrameRef.current = null;
      });
      zoomAnimationTimerRef.current = window.setTimeout(() => {
        const centeredOrigin = { x: 0.5, y: 0.5 };
        originRef.current = centeredOrigin;
        setOrigin(centeredOrigin);
        setIsZoomAnimating(false);
        zoomAnimationTimerRef.current = null;
      }, 240);
      return;
    }

    applyPan({ x: 0, y: 0 });
    setIsZoomed(false);
    setIsZoomAnimating(false);
    const centeredOrigin = { x: 0.5, y: 0.5 };
    originRef.current = centeredOrigin;
    setOrigin(centeredOrigin);
  }, [applyPan, clearZoomAnimation, isZoomed]);

  useEffect(() => {
    resetZoom(false);
  }, [mediaId]);

  useEffect(() => () => {
    clearZoomAnimation();
  }, [clearZoomAnimation]);

  const clampPan = useCallback((x, y) => {
    const image = imageRef.current;
    if (!image) return { x: 0, y: 0 };

    const overflowX = (VIEWER_ZOOM_SCALE - 1) * image.offsetWidth;
    const overflowY = (VIEWER_ZOOM_SCALE - 1) * image.offsetHeight;
    const currentOrigin = originRef.current;

    return {
      x: clamp(x, -overflowX * (1 - currentOrigin.x), overflowX * currentOrigin.x),
      y: clamp(y, -overflowY * (1 - currentOrigin.y), overflowY * currentOrigin.y),
    };
  }, []);

  const panBy = useCallback((deltaX, deltaY) => {
    clearZoomAnimation();
    setIsZoomAnimating(false);
    const currentPan = panRef.current;
    applyPan(clampPan(currentPan.x + deltaX, currentPan.y + deltaY));
  }, [applyPan, clampPan, clearZoomAnimation]);

  const onImageClick = useCallback((event) => {
    event.stopPropagation();

    if (didPanRef.current) {
      didPanRef.current = false;
      return;
    }

    if (isZoomed) {
      resetZoom(true);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextOrigin = {
      x: clamp((event.clientX - bounds.left) / bounds.width, 0, 1),
      y: clamp((event.clientY - bounds.top) / bounds.height, 0, 1),
    };

    originRef.current = nextOrigin;
    clearZoomAnimation();
    applyPan({ x: 0, y: 0 });
    setOrigin(nextOrigin);
    setIsZoomAnimating(true);
    setIsZoomed(true);
    zoomAnimationTimerRef.current = window.setTimeout(() => {
      setIsZoomAnimating(false);
      zoomAnimationTimerRef.current = null;
    }, 220);
  }, [applyPan, clearZoomAnimation, isZoomed, resetZoom]);

  const onImagePointerDown = useCallback((event) => {
    if (!isZoomed || (event.pointerType === "mouse" && event.button !== 0)) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    clearZoomAnimation();
    setIsZoomAnimating(false);
    const currentPan = panRef.current;
    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: currentPan.x,
      panY: currentPan.y,
    };
    didPanRef.current = false;
    setIsPanning(true);
  }, [clearZoomAnimation, isZoomed]);

  const onImagePointerMove = useCallback((event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;

    if (Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) {
      didPanRef.current = true;
    }

    applyPan(clampPan(pointer.panX + deltaX, pointer.panY + deltaY));
  }, [applyPan, clampPan]);

  const endImagePan = useCallback((event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    pointerRef.current = null;
    setIsPanning(false);
  }, []);

  return {
    imageRef,
    imageStyle: {
      transformOrigin: `${origin.x * 100}% ${origin.y * 100}%`,
    },
    isPanning,
    isZoomAnimating,
    isZoomed,
    onImageClick,
    onImagePointerCancel: endImagePan,
    onImagePointerDown,
    onImagePointerMove,
    onImagePointerUp: endImagePan,
    panBy,
  };
}
