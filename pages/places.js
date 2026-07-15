import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import Link from "next/link";
import createGlobe from "cobe";
import { places } from "../data/places";
import styles from "../places.module.css";

const TAU = Math.PI * 2;
const AUTO_ROTATION_SPEED = 0.0014;
const GLOBE_BASE_COLOR = [0.12, 0.14, 0.15];
const LABEL_VISIBILITY_THRESHOLD = 0.08;
const SELECTED_LABEL_SCALE = 1.5;
const LABEL_SCALE_EASING = 0.14;
// Preserve a sharp canvas on high-density displays and at browser zoom, without
// allowing the continuously animated WebGL surface to become unreasonably large.
const MAX_GLOBE_PIXEL_RATIO = 3;
const GLOBE_MAP_SAMPLES = 32000;
const PLACE_DETAILS_TRANSITION_MS = 360;

function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function ShootingStar({ initialDelay = 0 }) {
  const starRef = useRef(null);

  useEffect(() => {
    const star = starRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (!star || reducedMotion.matches) return undefined;

    let animation;
    let timeout;
    let isCancelled = false;

    const scheduleNextPass = (delay) => {
      timeout = window.setTimeout(launch, delay);
    };

    const launch = () => {
      const directionRanges = [
        [-42, -16],
        [16, 42],
        [138, 164],
        [196, 222],
      ];
      const [minimumAngle, maximumAngle] =
        directionRanges[Math.floor(Math.random() * directionRanges.length)];
      const angle = randomBetween(minimumAngle, maximumAngle);
      const travelDistance = randomBetween(180, 380);

      Object.assign(star.style, {
        top: `${randomBetween(8, 78)}%`,
        left: `${randomBetween(6, 82)}%`,
        width: `${randomBetween(48, 112)}px`,
      });

      animation = star.animate(
        [
          {
            opacity: 0,
            transform: `rotate(${angle}deg) translate3d(${-travelDistance * 0.12}px, 0, 0) scaleX(0.55)`,
          },
          { opacity: randomBetween(0.55, 0.88), offset: 0.16 },
          {
            opacity: 0,
            transform: `rotate(${angle}deg) translate3d(${travelDistance}px, 0, 0) scaleX(1)`,
          },
        ],
        {
          duration: randomBetween(520, 1250),
          easing: "cubic-bezier(0.2, 0.55, 0.35, 1)",
        },
      );

      animation.onfinish = () => {
        if (!isCancelled) scheduleNextPass(randomBetween(3500, 10500));
      };
    };

    scheduleNextPass(initialDelay + randomBetween(300, 1800));

    return () => {
      isCancelled = true;
      window.clearTimeout(timeout);
      animation?.cancel();
    };
  }, [initialDelay]);

  return <span ref={starRef} className={styles.shootingStar} />;
}

function locationToAngles(latitude, longitude) {
  return [
    Math.PI - ((longitude * Math.PI) / 180 - Math.PI / 2),
    (latitude * Math.PI) / 180,
  ];
}

function shortestAngleDistance(from, to) {
  return (((to - from + Math.PI) % TAU + TAU) % TAU) - Math.PI;
}

function coordinateToVector([latitude, longitude]) {
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeRadians = (longitude * Math.PI) / 180 - Math.PI;
  const latitudeCosine = Math.cos(latitudeRadians);

  return [
    -latitudeCosine * Math.cos(longitudeRadians),
    Math.sin(latitudeRadians),
    latitudeCosine * Math.sin(longitudeRadians),
  ];
}

function smoothstep(minimum, maximum, value) {
  const progress = Math.max(
    0,
    Math.min(1, (value - minimum) / (maximum - minimum)),
  );
  return progress * progress * (3 - 2 * progress);
}

function markerVisibility(vector, phi, theta) {
  const depth =
    -Math.sin(phi) * Math.cos(theta) * vector[0] +
    Math.sin(theta) * vector[1] +
    Math.cos(phi) * Math.cos(theta) * vector[2];

  return smoothstep(0.02, 0.28, depth);
}

function categoryForPlace(place) {
  const label =
    place.country === "United States" ? place.region : place.country;
  return {
    key: `${place.country}-${label}`,
    label,
    zoom: place.country === "United States" ? 1.82 : 1.58,
  };
}

function averageCoordinates(groupPlaces) {
  const totals = groupPlaces.reduce(
    (total, place) => [
      total[0] + place.coordinates[0],
      total[1] + place.coordinates[1],
    ],
    [0, 0],
  );
  return [totals[0] / groupPlaces.length, totals[1] / groupPlaces.length];
}

function getCanvasSize(container) {
  const isPhone = window.matchMedia("(max-width: 520px)").matches;
  const isTablet = window.matchMedia("(max-width: 860px)").matches;
  const horizontalInset = isPhone ? 28 : isTablet ? 48 : 104;
  const verticalInset = isPhone ? 100 : isTablet ? 98 : 88;

  return Math.min(
    Math.max(container.clientWidth - horizontalInset, 1),
    Math.max(container.clientHeight - verticalInset, 1),
  );
}

function TravelGlobe({
  focus,
  highlightedPlace,
  priorityPlace,
  selectedPlace,
  onPinHover,
  onPinLeave,
  onPinSelect,
  onPanStart,
  onNavigatePlace,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const focusRef = useRef(focus);
  const highlightedPlaceRef = useRef(highlightedPlace);
  const priorityPlaceRef = useRef(priorityPlace);
  const selectedPlaceRef = useRef(selectedPlace);
  const globeRef = useRef(null);
  const phiRef = useRef(0.55);
  const thetaRef = useRef(0.08);
  const scaleRef = useRef(0.94);
  const renderMetricsRef = useRef({ size: 1, scaleFactor: 1 });
  const pointerStartRef = useRef(null);
  const pointerDeltaRef = useRef(0);
  const hasPannedRef = useRef(false);
  const pointerPositionRef = useRef(null);
  const hoveredPinIdRef = useRef(null);
  const labelNodesRef = useRef(new Map());
  const labelMetricsRef = useRef(new Map());
  const labelScalesRef = useRef(new Map());
  const visibleLabelIdsRef = useRef(new Set());
  const handledPointerClickRef = useRef(false);
  const onPinHoverRef = useRef(onPinHover);
  const onPinLeaveRef = useRef(onPinLeave);
  const onPinSelectRef = useRef(onPinSelect);
  const onPanStartRef = useRef(onPanStart);
  const [isDragging, setIsDragging] = useState(false);
  const [isPinHovered, setIsPinHovered] = useState(false);

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useEffect(() => {
    highlightedPlaceRef.current = highlightedPlace;
  }, [highlightedPlace]);

  useEffect(() => {
    priorityPlaceRef.current = priorityPlace;
  }, [priorityPlace]);

  useEffect(() => {
    selectedPlaceRef.current = selectedPlace;
  }, [selectedPlace]);

  useEffect(() => {
    onPinHoverRef.current = onPinHover;
    onPinLeaveRef.current = onPinLeave;
    onPinSelectRef.current = onPinSelect;
    onPanStartRef.current = onPanStart;
  }, [onPanStart, onPinHover, onPinLeave, onPinSelect]);

  const markerDefinitions = useMemo(
    () =>
      places.map((place) => ({
        id: place.id,
        place,
        location: place.coordinates,
        vector: coordinateToVector(place.coordinates),
      })),
    [],
  );

  const getPlaceAtPosition = useCallback(
    (clientX, clientY) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const bounds = canvas.getBoundingClientRect();
      const phi = phiRef.current + pointerDeltaRef.current;
      const theta = thetaRef.current;
      const cosinePhi = Math.cos(phi);
      const sinePhi = Math.sin(phi);
      const cosineTheta = Math.cos(theta);
      const sineTheta = Math.sin(theta);
      const hitRadius = Math.max(12, Math.min(bounds.width, bounds.height) * 0.028);
      let closestPlace = null;
      let closestDistance = hitRadius;

      markerDefinitions.forEach((marker) => {
        const [x, y, z] = marker.vector;
        const projectedX = cosinePhi * x + sinePhi * z;
        const projectedY =
          sinePhi * sineTheta * x +
          cosineTheta * y -
          cosinePhi * sineTheta * z;
        const depth =
          -sinePhi * cosineTheta * x +
          sineTheta * y +
          cosinePhi * cosineTheta * z;

        if (depth < 0) return;

        const markerAnchor = canvas.parentElement?.querySelector(
          `[style*="--cobe-${marker.id}"]`,
        );
        const screenX = markerAnchor
          ? bounds.left +
            (parseFloat(markerAnchor.style.left) / 100) * bounds.width
          : bounds.left +
            ((projectedX * 0.8 * scaleRef.current + 1) / 2) * bounds.width;
        const screenY = markerAnchor
          ? bounds.top +
            (parseFloat(markerAnchor.style.top) / 100) * bounds.height
          : bounds.top +
            ((-projectedY * 0.8 * scaleRef.current + 1) / 2) * bounds.height;
        const distance = Math.hypot(clientX - screenX, clientY - screenY);

        if (distance < closestDistance) {
          closestPlace = marker.place;
          closestDistance = distance;
        }
      });

      return closestPlace;
    },
    [markerDefinitions],
  );

  const updateHoveredPin = useCallback((place) => {
    const nextId = place?.id || null;
    if (hoveredPinIdRef.current === nextId) return;

    hoveredPinIdRef.current = nextId;
    setIsPinHovered(Boolean(place));
    if (place) {
      onPinHoverRef.current?.(place);
    } else {
      onPinLeaveRef.current?.();
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return undefined;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const markers = markerDefinitions.map((marker) => ({
      location: marker.location,
      size: 0,
      id: marker.id,
    }));
    let animationFrame;

    const updateLabels = (phi, theta) => {
      const canvasBounds = canvas.getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();
      const cosinePhi = Math.cos(phi);
      const sinePhi = Math.sin(phi);
      const cosineTheta = Math.cos(theta);
      const sineTheta = Math.sin(theta);
      const highlightedId = highlightedPlaceRef.current?.id;
      const priorityId = priorityPlaceRef.current?.id;
      const selectedId = selectedPlaceRef.current?.id;
      const previousVisibleIds = visibleLabelIdsRef.current;
      const candidates = [];

      markerDefinitions.forEach((marker) => {
        const node = labelNodesRef.current.get(marker.id);
        if (!node) return;

        const [x, y, z] = marker.vector;
        const projectedX = cosinePhi * x + sinePhi * z;
        const projectedY =
          sinePhi * sineTheta * x +
          cosineTheta * y -
          cosinePhi * sineTheta * z;
        const depth =
          -sinePhi * cosineTheta * x +
          sineTheta * y +
          cosinePhi * cosineTheta * z;
        const visibility = markerVisibility(marker.vector, phi, theta);
        const targetLabelScale =
          marker.id === selectedId ? SELECTED_LABEL_SCALE : 1;
        const currentLabelScale =
          labelScalesRef.current.get(marker.id) ?? 1;
        const easedLabelScale = reducedMotion
          ? targetLabelScale
          : currentLabelScale +
            (targetLabelScale - currentLabelScale) * LABEL_SCALE_EASING;
        const labelScale =
          Math.abs(targetLabelScale - easedLabelScale) < 0.001
            ? targetLabelScale
            : easedLabelScale;

        labelScalesRef.current.set(marker.id, labelScale);

        if (depth < 0 || visibility < LABEL_VISIBILITY_THRESHOLD) {
          node.style.opacity = "0";
          return;
        }

        let metrics = labelMetricsRef.current.get(marker.id);
        if (!metrics) {
          metrics = { width: node.offsetWidth, height: node.offsetHeight };
          labelMetricsRef.current.set(marker.id, metrics);
        }

        const screenX =
          canvasBounds.left -
          containerBounds.left +
          ((projectedX * 0.8 * scaleRef.current + 1) / 2) *
            canvasBounds.width;
        const screenY =
          canvasBounds.top -
          containerBounds.top +
          ((-projectedY * 0.8 * scaleRef.current + 1) / 2) *
            canvasBounds.height;
        const isPriority = marker.id === priorityId;

        candidates.push({
          id: marker.id,
          node,
          visibility,
          isDimmed: Boolean(highlightedId && highlightedId !== marker.id),
          isPriority,
          score:
            (isPriority ? 10 : 0) +
            depth +
            (previousVisibleIds.has(marker.id) ? 0.035 : 0),
          rect: {
            top: screenY - (metrics.height * labelScale) / 2,
            right: screenX + (metrics.width * labelScale) / 2,
            bottom: screenY + (metrics.height * labelScale) / 2,
            left: screenX - (metrics.width * labelScale) / 2,
          },
          transform: `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${labelScale})`,
        });
      });

      candidates.sort((first, second) => second.score - first.score);

      const occupiedRects = [];
      const nextVisibleIds = new Set();
      const collisionPadding = containerBounds.width <= 520 ? 4 : 6;

      candidates.forEach((candidate) => {
        const collides = occupiedRects.some(
          (occupied) =>
            candidate.rect.left < occupied.right + collisionPadding &&
            candidate.rect.right > occupied.left - collisionPadding &&
            candidate.rect.top < occupied.bottom + collisionPadding &&
            candidate.rect.bottom > occupied.top - collisionPadding,
        );
        const isVisible = candidate.isPriority || !collides;

        candidate.node.style.transform = candidate.transform;
        candidate.node.style.opacity = isVisible
          ? String(candidate.visibility * (candidate.isDimmed ? 0.2 : 1))
          : "0";

        if (isVisible) {
          occupiedRects.push(candidate.rect);
          nextVisibleIds.add(candidate.id);
        }
      });

      visibleLabelIdsRef.current = nextVisibleIds;
    };

    const resize = () => {
      const visualSize = getCanvasSize(container);
      const renderSize = Math.max(
        container.clientWidth,
        container.clientHeight,
      );

      renderMetricsRef.current = {
        size: renderSize,
        scaleFactor: visualSize / renderSize,
      };
      labelMetricsRef.current.clear();
      canvas.style.width = `${renderSize}px`;
      canvas.style.height = `${renderSize}px`;
      globeRef.current?.update({ width: renderSize, height: renderSize });
    };

    resize();
    const initialSize = renderMetricsRef.current.size;
    scaleRef.current =
      (focusRef.current?.zoom || 0.94) *
      renderMetricsRef.current.scaleFactor;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(
        window.devicePixelRatio || 1,
        MAX_GLOBE_PIXEL_RATIO,
      ),
      width: initialSize,
      height: initialSize,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.15,
      scale: scaleRef.current,
      mapSamples: GLOBE_MAP_SAMPLES,
      mapBrightness: 4.5,
      baseColor: GLOBE_BASE_COLOR,
      markerColor: GLOBE_BASE_COLOR,
      glowColor: [0.02, 0.36, 1],
      markers,
      markerElevation: 0,
    });

    globeRef.current = globe;
    if (canvas.parentElement !== container) {
      Object.assign(canvas.parentElement.style, {
        display: "grid",
        placeItems: "center",
      });
    }
    resize();

    const render = () => {
      const focusedRegion = focusRef.current;

      if (
        pointerStartRef.current === null &&
        (hoveredPinIdRef.current === null || focusedRegion?.isPinFocus)
      ) {
        if (focusedRegion) {
          const [targetPhi, targetTheta] = locationToAngles(
            focusedRegion.coordinates[0],
            focusedRegion.coordinates[1],
          );
          phiRef.current +=
            shortestAngleDistance(phiRef.current, targetPhi) * 0.075;
          thetaRef.current += (targetTheta - thetaRef.current) * 0.075;
        } else if (!reducedMotion) {
          phiRef.current += AUTO_ROTATION_SPEED;
          thetaRef.current += (0.08 - thetaRef.current) * 0.025;
        }
      }

      const targetScale =
        (focusedRegion?.zoom || 0.94) *
        renderMetricsRef.current.scaleFactor;
      scaleRef.current += (targetScale - scaleRef.current) * 0.075;

      const framePhi = phiRef.current + pointerDeltaRef.current;

      if (pointerPositionRef.current && pointerStartRef.current === null) {
        updateHoveredPin(
          getPlaceAtPosition(
            pointerPositionRef.current.x,
            pointerPositionRef.current.y,
          ),
        );
      }

      globe.update({
        phi: framePhi,
        theta: thetaRef.current,
        scale: scaleRef.current,
      });
      updateLabels(framePhi, thetaRef.current);
      animationFrame = window.requestAnimationFrame(render);
    };

    animationFrame = window.requestAnimationFrame(render);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      globe.destroy();
      globeRef.current = null;
    };
  }, [getPlaceAtPosition, markerDefinitions, updateHoveredPin]);

  const handlePointerDown = useCallback((event) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    pointerDeltaRef.current = 0;
    hasPannedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      pointerPositionRef.current = { x: event.clientX, y: event.clientY };
      if (pointerStartRef.current === null) {
        updateHoveredPin(getPlaceAtPosition(event.clientX, event.clientY));
        return;
      }

      const horizontalDistance = event.clientX - pointerStartRef.current.x;
      const verticalDistance = event.clientY - pointerStartRef.current.y;
      pointerDeltaRef.current = horizontalDistance / 180;
      if (Math.hypot(horizontalDistance, verticalDistance) > 4) {
        if (!hasPannedRef.current) {
          hasPannedRef.current = true;
          onPanStartRef.current?.();
        }
        setIsDragging(true);
      }
    },
    [getPlaceAtPosition, updateHoveredPin],
  );

  const handlePointerUp = useCallback((event) => {
    if (pointerStartRef.current === null) return;
    const horizontalDistance = event.clientX - pointerStartRef.current.x;
    const verticalDistance = event.clientY - pointerStartRef.current.y;
    const isClick = Math.hypot(horizontalDistance, verticalDistance) <= 4;
    phiRef.current += pointerDeltaRef.current;
    pointerStartRef.current = null;
    pointerDeltaRef.current = 0;
    hasPannedRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (isClick) {
      const place = getPlaceAtPosition(event.clientX, event.clientY);
      if (place) {
        handledPointerClickRef.current = true;
        onPinSelectRef.current?.(place);
      }
    }
  }, [getPlaceAtPosition]);

  const handlePointerCancel = useCallback((event) => {
    pointerStartRef.current = null;
    pointerDeltaRef.current = 0;
    hasPannedRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleClick = useCallback(
    (event) => {
      if (handledPointerClickRef.current) {
        handledPointerClickRef.current = false;
        return;
      }

      const place = getPlaceAtPosition(event.clientX, event.clientY);
      if (place) onPinSelectRef.current?.(place);
    },
    [getPlaceAtPosition],
  );

  const handlePointerLeave = useCallback(() => {
    pointerPositionRef.current = null;
    if (pointerStartRef.current === null) updateHoveredPin(null);
  }, [updateHoveredPin]);

  return (
    <div ref={containerRef} className={styles.globeContainer}>
      <div className={styles.globeHalo} aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className={`${styles.globeCanvas} ${isDragging ? styles.dragging : ""} ${isPinHovered ? styles.pinHovered : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        aria-label="Interactive globe showing the places Danny has visited"
        role="img"
      />
      <div
        className={styles.globeControls}
        role="group"
        aria-label="Place navigation controls"
      >
        <button
          className={styles.globeNavButton}
          type="button"
          onClick={() => onNavigatePlace(-1)}
          aria-label="Previous place"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button
          className={styles.globeNavButton}
          type="button"
          onClick={() => onNavigatePlace(1)}
          aria-label="Next place"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
      <div className={styles.globeLabels} aria-hidden="true">
        {markerDefinitions.map((marker) => (
          <span
            key={marker.id}
            ref={(node) => {
              if (node) {
                labelNodesRef.current.set(marker.id, node);
              } else {
                labelNodesRef.current.delete(marker.id);
                labelMetricsRef.current.delete(marker.id);
              }
            }}
            className={styles.globeLabel}
          >
            {marker.place.city}
          </span>
        ))}
      </div>
    </div>
  );
}

const PlaceItem = forwardRef(function PlaceItem(
  { place, isOpen, onToggle, onHover, onLeave },
  ref,
) {
  return (
    <article
      ref={ref}
      className={`${styles.placeItem} ${isOpen ? styles.placeItemOpen : ""}`}
      onMouseEnter={() => onHover(place)}
      onMouseLeave={onLeave}
    >
      <button
        className={styles.placeButton}
        onClick={() => onToggle(place)}
        onFocus={() => onHover(place)}
        onBlur={onLeave}
        aria-expanded={isOpen}
        aria-controls={`${place.id}-details`}
      >
        <span className={styles.placeIdentity}>
          <span className={styles.placeName}>{place.city}</span>
          <span className={styles.placeLocation}>
            {place.region} · {place.country}
          </span>
        </span>
        <svg
          className={styles.placeChevron}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      <div
        id={`${place.id}-details`}
        className={styles.placeDetails}
        aria-hidden={!isOpen}
      >
        <div className={styles.placeDetailsInner}>
          <p className={styles.placeReview}>{place.review}</p>
          <div className={styles.coordinates}>
            {Math.abs(place.coordinates[0]).toFixed(2)}°
            {place.coordinates[0] >= 0 ? "N" : "S"} / {" "}
            {Math.abs(place.coordinates[1]).toFixed(2)}°
            {place.coordinates[1] >= 0 ? "E" : "W"}
          </div>
        </div>
      </div>
    </article>
  );
});

export default function PlacesPage() {
  const [openPlaceId, setOpenPlaceId] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [scrollCategoryKey, setScrollCategoryKey] = useState(null);
  const scrollTimeoutRef = useRef(null);
  const scrollAlignmentTimeoutRef = useRef(null);
  const placeListRef = useRef(null);
  const placeListSpacerRef = useRef(null);
  const categoryNodesRef = useRef(new Map());
  const placeNodesRef = useRef(new Map());
  const categories = useMemo(() => {
    const groups = new Map();

    places.forEach((place) => {
      const category = categoryForPlace(place);
      const existing = groups.get(category.key);
      if (existing) {
        existing.places.push(place);
      } else {
        groups.set(category.key, { ...category, places: [place] });
      }
    });

    return Array.from(groups.values()).map((category) => ({
      ...category,
      coordinates: averageCoordinates(category.places),
    }));
  }, []);
  const categoriesByKey = useMemo(
    () => new Map(categories.map((category) => [category.key, category])),
    [categories],
  );
  const visitedCountryCount = new Set(places.map((place) => place.country)).size;
  const visitedStateCount = new Set(
    places
      .filter(
        (place) =>
          place.country === "United States" &&
          place.region !== "Washington, D.C.",
      )
      .map((place) => place.region),
  ).size;
  const openPlace = places.find((place) => place.id === openPlaceId) || null;
  const activePlace = hoveredPlace || openPlace;
  const activeCategory = activePlace
    ? categoriesByKey.get(categoryForPlace(activePlace).key)
    : null;
  const scrollCategory = scrollCategoryKey
    ? categoriesByKey.get(scrollCategoryKey)
    : null;
  const focusedCategory = scrollCategory || activeCategory || null;
  const globeFocus = selectedPin
    ? {
        coordinates: selectedPin.coordinates,
        zoom: categoryForPlace(selectedPin).zoom,
        isPinFocus: true,
      }
    : focusedCategory
    ? {
        coordinates: focusedCategory.coordinates,
        zoom: focusedCategory.zoom,
      }
    : null;

  useEffect(() => {
    document.body.classList.add("loaded");
    return () => {
      window.clearTimeout(scrollTimeoutRef.current);
      window.clearTimeout(scrollAlignmentTimeoutRef.current);
    };
  }, []);

  const handleToggle = (place) => {
    setSelectedPin(null);
    setOpenPlaceId((currentId) =>
      currentId === place.id ? null : place.id,
    );
  };

  const alignPlaceWithListTop = useCallback((place) => {
    const list = placeListRef.current;
    const spacer = placeListSpacerRef.current;
    const placeNode = placeNodesRef.current.get(place.id);
    const category = categoryForPlace(place);
    const categoryNode = categoryNodesRef.current.get(category.key);
    const headingNode = categoryNode?.querySelector(`.${styles.groupHeading}`);
    if (!list || !spacer || !placeNode) return;

    const headingHeight = headingNode?.getBoundingClientRect().height || 0;

    // Give the final cell enough scroll range to reach the same alignment as
    // every other cell instead of being clamped against the end of the list.
    spacer.style.height = `${Math.max(
      list.clientHeight - headingHeight - placeNode.offsetHeight,
      0,
    )}px`;

    const listBounds = list.getBoundingClientRect();
    const placeBounds = placeNode.getBoundingClientRect();
    list.scrollTo({
      top: Math.max(
        list.scrollTop + placeBounds.top - listBounds.top - headingHeight,
        0,
      ),
      behavior: "smooth",
    });
  }, []);

  const handlePinSelect = useCallback(
    (place, { deferScrollUntilSettled = false } = {}) => {
      setSelectedPin(place);
      setScrollCategoryKey(null);
      setOpenPlaceId(place.id);
      window.clearTimeout(scrollAlignmentTimeoutRef.current);

      if (!deferScrollUntilSettled) {
        window.requestAnimationFrame(() => alignPlaceWithListTop(place));
      }

      // A previously open cell can collapse above the target while the new
      // cell expands. Re-measure once those transitions have settled.
      scrollAlignmentTimeoutRef.current = window.setTimeout(() => {
        window.requestAnimationFrame(() => alignPlaceWithListTop(place));
      }, PLACE_DETAILS_TRANSITION_MS);
    },
    [alignPlaceWithListTop],
  );

  const handleNavigatePlace = useCallback(
    (direction) => {
      const currentPlace = selectedPin || openPlace;
      const currentIndex = currentPlace
        ? places.findIndex((place) => place.id === currentPlace.id)
        : -1;
      const nextIndex =
        currentIndex === -1
          ? direction > 0
            ? 0
            : places.length - 1
          : (currentIndex + direction + places.length) % places.length;

      handlePinSelect(places[nextIndex], { deferScrollUntilSettled: true });
    },
    [handlePinSelect, openPlace, selectedPin],
  );

  const handlePlaceHover = (place) => {
    setHoveredPlace(place);
  };

  const handleListScroll = (event) => {
    const list = event.currentTarget;
    const targetPosition = list.scrollTop + list.clientHeight * 0.2;
    let visibleCategory = categories[0];

    categories.forEach((category) => {
      const node = categoryNodesRef.current.get(category.key);
      if (node && node.offsetTop <= targetPosition) {
        visibleCategory = category;
      }
    });

    setScrollCategoryKey(visibleCategory?.key || null);
    window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      setScrollCategoryKey(null);
    }, 900);
  };

  return (
    <>
      <Head>
        <title>Places — Danny Ohana</title>
        <meta
          name="description"
          content="A living map of the cities and towns Danny Ohana has visited."
        />
      </Head>
      <main className={styles.page}>
        <aside className={styles.sidebar}>
          <header className={styles.sidebarHeader}>
            <div className={styles.titleRow}>
              <Link href="/">
                <a className={styles.backLink} aria-label="Back to home">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 14 4 9 9 4" />
                    <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                  </svg>
                </a>
              </Link>
              <h1>Places I&apos;ve Been</h1>
            </div>
          </header>

          <div
            ref={placeListRef}
            className={styles.placeList}
            onScroll={handleListScroll}
          >
            {categories.map((category) => (
              <section
                key={category.key}
                className={styles.placeGroup}
                ref={(node) => {
                  if (node) categoryNodesRef.current.set(category.key, node);
                }}
              >
                <div className={styles.groupHeading}>
                  <span>{category.label}</span>
                  <span>{category.places.length}</span>
                </div>
                {category.places.map((place) => (
                  <PlaceItem
                    key={place.id}
                    place={place}
                    isOpen={openPlaceId === place.id}
                    onToggle={handleToggle}
                    onHover={handlePlaceHover}
                    onLeave={() => setHoveredPlace(null)}
                    ref={(node) => {
                      if (node) placeNodesRef.current.set(place.id, node);
                    }}
                  />
                ))}
              </section>
            ))}
            <div
              ref={placeListSpacerRef}
              className={styles.placeListSpacer}
              aria-hidden="true"
            />
          </div>

        </aside>

        <section className={styles.globeStage}>
          <div className={styles.spaceBackground} aria-hidden="true">
            <div className={`${styles.galaxy} ${styles.galaxyOne}`} />
            <div className={`${styles.galaxy} ${styles.galaxyTwo}`} />
            <div className={`${styles.starField} ${styles.starsDistant}`} />
            <div className={`${styles.starField} ${styles.starsNear}`} />
            <ShootingStar />
            <ShootingStar initialDelay={1600} />
            <ShootingStar initialDelay={3400} />
          </div>
          <TravelGlobe
            focus={globeFocus}
            highlightedPlace={hoveredPin || hoveredPlace || openPlace}
            priorityPlace={hoveredPin || hoveredPlace || openPlace}
            selectedPlace={selectedPin || openPlace}
            onPinHover={setHoveredPin}
            onPinLeave={() => setHoveredPin(null)}
            onPinSelect={handlePinSelect}
            onPanStart={() => {
              setSelectedPin(null);
              setOpenPlaceId(null);
            }}
            onNavigatePlace={handleNavigatePlace}
          />
          <div className={styles.stageCoordinates} aria-live="polite">
            {focusedCategory ? (
              <>
                <span>{focusedCategory.label}</span>
                <span>
                  {focusedCategory.places.length} {" "}
                  {focusedCategory.places.length === 1 ? "place" : "places"}
                </span>
              </>
            ) : (
              <>
                <span>{places.length} places explored</span>
                <span>
                  {visitedCountryCount} countries · {visitedStateCount} states
                </span>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
