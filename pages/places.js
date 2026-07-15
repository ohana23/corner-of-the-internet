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
const PIN_COLOR = [0.12, 0.68, 1];
const PIN_SHADOW_COLOR = [0.08, 0.08, 0.08];
const PIN_STEM_OFFSET = 0.18;
// Preserve a sharp canvas on high-density displays and at browser zoom, without
// allowing the continuously animated WebGL surface to become unreasonably large.
const MAX_GLOBE_PIXEL_RATIO = 3;
const GLOBE_MAP_SAMPLES = 32000;

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

function mixColor(from, to, amount) {
  return from.map((value, index) => value + (to[index] - value) * amount);
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
  onPinHover,
  onPinLeave,
  onPinSelect,
  onPanStart,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const focusRef = useRef(focus);
  const highlightedPlaceRef = useRef(highlightedPlace);
  const priorityPlaceRef = useRef(priorityPlace);
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
  const handledPointerClickRef = useRef(false);
  const onPinHoverRef = useRef(onPinHover);
  const onPinLeaveRef = useRef(onPinLeave);
  const onPinSelectRef = useRef(onPinSelect);
  const onPanStartRef = useRef(onPanStart);
  const [isDragging, setIsDragging] = useState(false);
  const [isPinHovered, setIsPinHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    onPinHoverRef.current = onPinHover;
    onPinLeaveRef.current = onPinLeave;
    onPinSelectRef.current = onPinSelect;
    onPanStartRef.current = onPanStart;
  }, [onPanStart, onPinHover, onPinLeave, onPinSelect]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => setIsDarkMode(mediaQuery.matches);
    syncTheme();
    mediaQuery.addEventListener("change", syncTheme);
    return () => mediaQuery.removeEventListener("change", syncTheme);
  }, []);

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
    const baseColor = isDarkMode ? [0.12, 0.14, 0.15] : [0.32, 0.33, 0.34];
    const createMarkers = (phi, theta) => {
      const priorityId = priorityPlaceRef.current?.id;
      const orderedMarkers = priorityId
        ? [
            ...markerDefinitions.filter((marker) => marker.id !== priorityId),
            ...markerDefinitions.filter((marker) => marker.id === priorityId),
          ]
        : markerDefinitions;

      return orderedMarkers.flatMap((marker) => {
        const visibility = markerVisibility(marker.vector, phi, theta);
        const isDimmed =
          highlightedPlaceRef.current &&
          highlightedPlaceRef.current.id !== marker.id;
        const opacity = visibility * (isDimmed ? 0.05 : 1);
        const shadowOpacity = opacity * 0.1;

        return [
          {
            location: marker.location,
            size: 0.07 * visibility,
            color: mixColor(baseColor, PIN_SHADOW_COLOR, shadowOpacity),
          },
          {
            location: marker.location,
            size: 0.052 * visibility,
            color: mixColor(baseColor, PIN_COLOR, opacity),
            id: marker.id,
          },
        ];
      });
    };
    const createPinStems = () =>
      markerDefinitions.map((marker) => {
        const isDimmed =
          highlightedPlaceRef.current &&
          highlightedPlaceRef.current.id !== marker.id;
        const opacity = isDimmed ? 0.05 : 1;

        return {
          from: marker.location,
          to: [marker.location[0] - PIN_STEM_OFFSET, marker.location[1]],
          color: mixColor(baseColor, PIN_COLOR, opacity),
        };
      });
    let animationFrame;

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
      dark: isDarkMode ? 1 : 0,
      diffuse: isDarkMode ? 1.15 : 1.35,
      scale: scaleRef.current,
      mapSamples: GLOBE_MAP_SAMPLES,
      mapBrightness: isDarkMode ? 4.5 : 2.7,
      baseColor,
      markerColor: PIN_COLOR,
      glowColor: isDarkMode ? [0.105, 0.098, 0.071] : [0.949, 0.945, 0.925],
      markers: createMarkers(phiRef.current, thetaRef.current),
      arcs: createPinStems(),
      arcWidth: 0.14,
      arcHeight: 0.04,
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
        hoveredPinIdRef.current === null
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
        markers: createMarkers(framePhi, thetaRef.current),
        arcs: createPinStems(),
      });
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
  }, [getPlaceAtPosition, isDarkMode, markerDefinitions, updateHoveredPin]);

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
          <p className={styles.placeSummary}>{place.summary}</p>
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
  const [scrollCategoryKey, setScrollCategoryKey] = useState(null);
  const scrollTimeoutRef = useRef(null);
  const placeListRef = useRef(null);
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
  const globeFocus = focusedCategory
    ? {
        coordinates: focusedCategory.coordinates,
        zoom: focusedCategory.zoom,
      }
    : null;

  useEffect(() => {
    document.body.classList.add("loaded");
    return () => window.clearTimeout(scrollTimeoutRef.current);
  }, []);

  const handleToggle = (place) => {
    setOpenPlaceId((currentId) =>
      currentId === place.id ? null : place.id,
    );
  };

  const handlePinSelect = useCallback((place) => {
    setOpenPlaceId(place.id);

    window.requestAnimationFrame(() => {
      const list = placeListRef.current;
      const placeNode = placeNodesRef.current.get(place.id);
      if (!list || !placeNode) return;

      list.scrollTo({
        top: Math.max(placeNode.offsetTop - list.clientHeight * 0.22, 0),
        behavior: "smooth",
      });
    });
  }, []);

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
            <Link href="/">
              <a className={styles.backLink} aria-label="Back to home">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10.5 3L5.5 8l5 5" />
                </svg>
                Danny Ohana
              </a>
            </Link>
            <div className={styles.titleRow}>
              <div>
                <h1>Places I&apos;ve been</h1>
              </div>
              <span className={styles.placeCount}>{places.length}</span>
            </div>
            <p className={styles.intro}>
              A growing log of places, impressions, and the details I want to
              remember.
            </p>
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
                    onHover={setHoveredPlace}
                    onLeave={() => setHoveredPlace(null)}
                    ref={(node) => {
                      if (node) placeNodesRef.current.set(place.id, node);
                    }}
                  />
                ))}
              </section>
            ))}
          </div>

        </aside>

        <section className={styles.globeStage}>
          <TravelGlobe
            focus={globeFocus}
            highlightedPlace={hoveredPlace || openPlace}
            priorityPlace={hoveredPlace || openPlace}
            onPinHover={setHoveredPlace}
          onPinLeave={() => setHoveredPlace(null)}
          onPinSelect={handlePinSelect}
          onPanStart={() => setOpenPlaceId(null)}
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
