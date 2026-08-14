import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles.module.css";
import artifactStyles from "../artifacts.module.css";
import { reviews } from "../data/reviews";
import { writing } from "../data/writing";

const LiquidMetal = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.LiquidMetal),
  { ssr: false },
);

const writingByYear = writing.reduce((groups, article) => {
  const year = article.publishedAt.slice(0, 4);
  const currentGroup = groups[groups.length - 1];

  if (!currentGroup || currentGroup.year !== year) {
    groups.push({ year, articles: [] });
  }

  groups[groups.length - 1].articles.push(article);
  return groups;
}, []);

const hometownTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
});

const workByCompany = [
  {
    company: "Procore",
    dates: "Aug 2022 to Today",
    description:
      "At Procore, I led design for the Media team, turning the needs of construction workers in the field into better camera and photo management tools.",
    images: [
      {
        src: "/artifacts/viewer-concept.webp",
        alt: "Procore media viewer concept identifying equipment in a construction photo",
      },
      {
        src: "/artifacts/camera-redesign-ipad.webp",
        alt: "Procore camera redesign shown on an iPad at a construction site",
      },
      {
        type: "video",
        src: "/artifacts/procore-camera-metadata.mp4",
        poster: "/artifacts/procore-camera-metadata-poster.jpg",
        alt: "Procore camera metadata concepts demonstrated on a rotating iPhone",
      },
      {
        src: "/artifacts/camera-redesign.webp",
        alt: "Procore camera redesign shown on an iPhone",
      },
      {
        src: "/artifacts/insta360-pairing.webp",
        alt: "Procore concept for pairing an Insta360 camera to capture a jobsite",
      },
      {
        src: "/artifacts/timeline-scrubber.webp",
        alt: "Procore timeline scrubber concept for navigating jobsite photos by date",
      },
      {
        src: "/artifacts/groundbreak-24.webp",
        alt: "Procore Photos feature presentation from Groundbreak 2024",
      },
      {
        src: "/artifacts/liquid-glass-icon.webp",
        alt: "Liquid glass design explorations for the Procore app icon",
      },
      {
        src: "/artifacts/procore-icons.webp",
        alt: "Icons designed for Procore's camera tools",
      },
      {
        src: "/artifacts/crop-layers.webp",
        alt: "Crop layers interaction design for Procore",
      },
      {
        src: "/artifacts/workforce-crisis-data.webp",
        alt: "The coming workforce crisis in construction data display",
      },
    ],
  },
  {
    company: "Snippets",
    dates: "2022",
    description:
      "Snippets was my side project: a group journal for creating shared “Memories” from “Snippets,” following friends, and exploring public stories.",
    images: [
      {
        src: "/artifacts/snippets-icon.webp",
        alt: "Snippets app icon and splash screen mockup",
      },
      {
        src: "/artifacts/snippets-start-screen-new.webp",
        alt: "Snippets onboarding start screen",
      },
      {
        src: "/artifacts/snippets-profile-new.webp",
        alt: "Snippets profile and shared memory screen",
      },
      {
        src: "/artifacts/snippet-prototype.gif",
        alt: "Snippets app feed prototype",
      },
      {
        src: "/artifacts/snippets-timer.gif",
        alt: "Auto-scrolling posts in Snippets",
      },
      {
        src: "/artifacts/snippets-montage.webp",
        alt: "Animated Snippets memory montage",
      },
    ],
  },
  {
    company: "SportAI",
    dates: "Jul 2021 to Aug 2022",
    description:
      "At SportAI, I worked across product strategy, design, and engineering. The work below was designed in Figma and built mainly with SwiftUI and UIKit.",
    images: [
      {
        src: "/artifacts/sportai-start-winning.webp",
        alt: "Start winning campaign for SportAI",
      },
      {
        src: "/artifacts/sportai-three-designs.webp",
        alt: "Three product design directions for SportAI",
      },
      {
        src: "/artifacts/sportai-3d-phones.webp",
        alt: "SportAI player analytics shown on two iPhones",
      },
      {
        src: "/artifacts/sportai-appstore.webp",
        alt: "SportAI App Store feature screens",
      },
      {
        src: "/artifacts/sportai-optimize.webp",
        alt: "SportAI lineup optimization start screen",
      },
      {
        src: "/artifacts/sportai-results.webp",
        alt: "SportAI recommended fantasy basketball lineup",
      },
      {
        src: "/artifacts/sportai-total-results.webp",
        alt: "SportAI lineup comparison results",
      },
      {
        src: "/artifacts/sportai-weeks.webp",
        alt: "SportAI weekly fantasy football statistics",
      },
    ],
  },
];

const carouselMedia = workByCompany.flatMap(({ company, images }) =>
  images.map((image) => ({
    ...image,
    id: `${company}-${image.src}`,
    caption: image.alt,
    image: image.src,
  })),
);

function WorkCarousel({ company, dates, description, images, onImageSelect }) {
  const carouselRef = useRef(null);

  const handleMediaKeyDown = (event, image) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onImageSelect({
      ...image,
      id: `${company}-${image.src}`,
      caption: image.alt,
      image: image.src,
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const carouselItems = Array.from(carousel.querySelectorAll("img, video"));
    const lastItem = carouselItems[carouselItems.length - 1];
    if (!lastItem) return;

    const resetCarousel = () => {
      carousel.scrollLeft = 0;
      carousel.scrollTop = 0;
    };

    const updateEdgeSpacing = () => {
      const carouselWidth = carousel.clientWidth;
      const trailingSpace = Math.max(
        0,
        (carouselWidth - lastItem.getBoundingClientRect().width) / 2,
      );

      carousel.style.setProperty(
        "--carousel-trailing-space",
        `${trailingSpace}px`,
      );
    };

    const resizeObserver = new ResizeObserver(updateEdgeSpacing);
    resizeObserver.observe(carousel);
    resizeObserver.observe(lastItem);

    lastItem.addEventListener("load", updateEdgeSpacing);
    lastItem.addEventListener("loadedmetadata", updateEdgeSpacing);

    updateEdgeSpacing();
    resetCarousel();

    const resetFrame = window.requestAnimationFrame(resetCarousel);
    window.addEventListener("load", resetCarousel);
    window.addEventListener("pageshow", resetCarousel);

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.removeEventListener("load", resetCarousel);
      window.removeEventListener("pageshow", resetCarousel);
      resizeObserver.disconnect();
      lastItem.removeEventListener("load", updateEdgeSpacing);
      lastItem.removeEventListener("loadedmetadata", updateEdgeSpacing);
    };
  }, [images]);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const items = Array.from(carousel.querySelectorAll("img, video"));
    if (!items.length) return;

    const carouselRect = carousel.getBoundingClientRect();
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    const itemPositions = items.map((item, index) =>
      index === 0
        ? 0
        : Math.min(
            maxScrollLeft,
            Math.max(
              0,
              carousel.scrollLeft +
                item.getBoundingClientRect().left -
                carouselRect.left +
                item.getBoundingClientRect().width / 2 -
                carousel.clientWidth / 2,
            ),
          ),
    );
    const closestIndex = itemPositions.reduce(
      (closest, position, index) =>
        Math.abs(position - carousel.scrollLeft) <
        Math.abs(itemPositions[closest] - carousel.scrollLeft)
          ? index
          : closest,
      0,
    );
    const targetIndex = Math.min(
      items.length - 1,
      Math.max(0, closestIndex + direction),
    );

    carousel.scrollTo({
      left: itemPositions[targetIndex],
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.workCompany} aria-labelledby={`work-${company}`}>
      <h2
        id={`work-${company}`}
        className={`${styles.writingHeading} ${styles.workHeading}`}
      >
        <span className={styles.workHeadingCopy}>
          <span>
            {company === "SportAI" ? (
              <a className={styles.workHeadingLink} href="/sportai">
                {company}
              </a>
            ) : (
              company
            )}
          </span>
          <span className={styles.workHeadingDates}>{dates}</span>
        </span>
      </h2>
      <p className={styles.workDescription}>{description}</p>
      {images.length > 1 && (
        <div
          className={styles.carouselControls}
          aria-label={`${company} carousel controls`}
        >
          <button
            className={styles.carouselButton}
            type="button"
            onClick={() => scrollCarousel(-1)}
            aria-label={`Show previous ${company} work`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className={styles.carouselButton}
            type="button"
            onClick={() => scrollCarousel(1)}
            aria-label={`Show more ${company} work`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
      <div
        ref={carouselRef}
        className={styles.workCarousel}
        aria-label={`${company} work`}
        tabIndex={images.length > 1 ? 0 : undefined}
      >
        {images.map((image) =>
          image.type === "video" ? (
            <video
              src={image.src}
              poster={image.poster}
              aria-label={image.alt}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              key={image.src}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onKeyDown={(event) => handleMediaKeyDown(event, image)}
              onClick={() => onImageSelect({
                ...image,
                id: `${company}-${image.src}`,
                caption: image.alt,
                image: image.src,
              })}
            />
          ) : (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              key={image.src}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onKeyDown={(event) => handleMediaKeyDown(event, image)}
              onClick={() => onImageSelect({
                ...image,
                id: `${company}-${image.src}`,
                caption: image.alt,
                image: image.src,
              })}
            />
          ),
        )}
      </div>
    </section>
  );
}

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hometownTime, setHometownTime] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isReviewsClosing, setIsReviewsClosing] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [nextArtifact, setNextArtifact] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closingDirection, setClosingDirection] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstReviewRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchCurrentRef = useRef(null);
  const closeTimerRef = useRef(null);
  const isClosingRef = useRef(false);
  const minSwipeDistance = 50;
  const minVerticalDismissDistance = 12;
  const isLightboxOpen = selectedArtifact !== null;

  const closeLightbox = useCallback((direction = null) => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    setClosingDirection(direction);
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedArtifact(null);
      setIsClosing(false);
      setClosingDirection(null);
      isClosingRef.current = false;
    }, direction ? 240 : 300);
  }, []);

  const navigateToPrevious = useCallback(() => {
    if (selectedArtifact === null || isTransitioning) return;
    const currentIndex = carouselMedia.findIndex(
      (artifact) => artifact.id === selectedArtifact.id,
    );
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : carouselMedia.length - 1;
    const prevArtifact = carouselMedia[prevIndex];

    setIsTransitioning(true);
    setSlideDirection("right");
    setNextArtifact(prevArtifact);

    setTimeout(() => {
      setSelectedArtifact(prevArtifact);
      setNextArtifact(null);
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 300);
  }, [selectedArtifact, isTransitioning]);

  const navigateToNext = useCallback(() => {
    if (selectedArtifact === null || isTransitioning) return;
    const currentIndex = carouselMedia.findIndex(
      (artifact) => artifact.id === selectedArtifact.id,
    );
    const nextIndex = currentIndex < carouselMedia.length - 1 ? currentIndex + 1 : 0;
    const nextArtifactItem = carouselMedia[nextIndex];

    setIsTransitioning(true);
    setSlideDirection("left");
    setNextArtifact(nextArtifactItem);

    setTimeout(() => {
      setSelectedArtifact(nextArtifactItem);
      setNextArtifact(null);
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 300);
  }, [selectedArtifact, isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedArtifact === null) return;

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedArtifact, navigateToPrevious, navigateToNext, closeLightbox]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overscrollBehavior =
        previousOverscrollBehavior;
      previousFocusRef.current?.focus?.();
    };
  }, [isLightboxOpen]);

  const handleArtifactClick = (artifact) => {
    previousFocusRef.current = document.activeElement;
    isClosingRef.current = false;
    setIsClosing(false);
    setClosingDirection(null);
    setSelectedArtifact(artifact);
    setNextArtifact(null);
    setSlideDirection(null);
    setIsTransitioning(false);
  };

  const onTouchStart = (event) => {
    const touch = event.targetTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchCurrentRef.current = null;
  };

  const onTouchMove = (event) => {
    const touch = event.targetTouches[0];
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = () => {
    const start = touchStartRef.current;
    const end = touchCurrentRef.current;
    touchStartRef.current = null;
    touchCurrentRef.current = null;

    if (start === null || end === null) return;

    const distanceX = start.x - end.x;
    const distanceY = start.y - end.y;

    if (
      Math.abs(distanceY) > minVerticalDismissDistance &&
      Math.abs(distanceY) > Math.abs(distanceX)
    ) {
      closeLightbox(distanceY > 0 ? "up" : "down");
    } else if (distanceX > minSwipeDistance) {
      navigateToNext();
    } else if (distanceX < -minSwipeDistance) {
      navigateToPrevious();
    }
  };

  const onViewerWheel = (event) => {
    const verticalDelta = Math.abs(event.deltaY);
    const horizontalDelta = Math.abs(event.deltaX);

    if (
      verticalDelta < 2 ||
      verticalDelta <= horizontalDelta ||
      isClosingRef.current
    ) return;

    event.preventDefault();
    closeLightbox(event.deltaY > 0 ? "up" : "down");
  };
  const handleReviewsToggle = () => {
    if (showReviews) {
      setIsReviewsClosing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(
        () => {
          setShowReviews(false);
          setIsReviewsClosing(false);
        },
        reviews.length * 100 + 300,
      );
    } else {
      setShowReviews(true);
    }
  };

  const handleWritingClick = (event) => {
    event.preventDefault();

    const writingSection = document.getElementById("writing");
    if (!writingSection) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.history.pushState(null, "", "#writing");
    writingSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!showReviews || !firstReviewRef.current) return;

    const frame = requestAnimationFrame(() => {
      const top =
        window.scrollY +
        firstReviewRef.current.getBoundingClientRect().top -
        window.innerHeight * 0.5;

      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  }, [showReviews]);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsLoaded(true);

    // Allow normal page scrolling.
    document.body.classList.add("loaded");

    // Detect color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleColorSchemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleColorSchemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleColorSchemeChange);
    };
  }, []);

  useEffect(() => {
    const updateHometownTime = () => setHometownTime(new Date());

    updateHometownTime();
    const interval = window.setInterval(updateHometownTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.container} ${isLoaded ? styles.loaded : ""}`}>
      <div className={styles.linkOrnaments} aria-hidden="true">
        <div
          className={`${styles.linkOrnament} ${styles.jewelBallsOrnament}`}
        >
          <div className={styles.ornamentFloat}>
            <img
              className={styles.ornamentImage}
              src="/balls-jewels.png"
              alt=""
            />
            <img
              className={styles.ornamentShimmer}
              src="/balls-jewels.png"
              alt=""
            />
          </div>
        </div>
        <div className={`${styles.linkOrnament} ${styles.hammerOrnament}`}>
          <div className={styles.ornamentFloat}>
            <img
              className={styles.ornamentImage}
              src="/hammer-jewel.png"
              alt=""
            />
            <img
              className={styles.ornamentShimmer}
              src="/hammer-jewel.png"
              alt=""
            />
          </div>
        </div>
        <div className={`${styles.linkOrnament} ${styles.geicoOrnament}`}>
          <div className={styles.ornamentFloat}>
            <img
              className={styles.ornamentImage}
              src="/geico-jewel.png"
              alt=""
            />
            <img
              className={styles.ornamentShimmer}
              src="/geico-jewel.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.avatarContainer}>
          <button
            type="button"
            className={styles.avatar}
            data-cuelume-toggle="release"
            aria-label="Refresh home page"
            onClick={() => window.location.reload()}
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
          >
            <Image
              src="/avatar.webp"
              alt="Danny Ohana"
              width={60}
              height={60}
              priority
            />
            <div
              className={`${styles.avatarShader} ${isAvatarHovered ? styles.avatarShaderVisible : ""}`}
            >
              <LiquidMetal
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                image="/safari-pinned-tab.svg"
                colorBack={isDarkMode ? "#D0D0D0" : "#E1E1E1"}
                colorTint={isDarkMode ? "#00C2FF" : "#00C2FF"}
                repetition={4}
                softness={2}
                shiftRed={0}
                shiftBlue={0}
                distortion={2}
                contour={0.3}
                angle={120}
                speed={0.6}
                scale={0.9}
                fit="contain"
              />
            </div>
          </button>
        </div>
        <h1 className={styles.name}>Danny Ohana</h1>
        <p className={styles.subtitle}>
          Designer at{" "}
          <a
            href="https://www.procore.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Procore
          </a>
        </p>
        <div className={styles.description}>
          <div className={styles.descriptionText}>
            You can find me on my laptop in a coffee shop near Ft. Lauderdale
            working at {" "}
            <a
              href="https://dannyohana.notion.site/Procore-236d2490fd738038898eccd6204620ea"
              className={`${styles.linkButton} ${styles.procoreLink}`}
            >
              Procore
            </a>,{" "} where I lead design for the media team, helping to build the best camera and photo suite for construction teams in the
            world. I was previously the
            Founding Design Engineer at a sports analytics startup called{" "}
            <a
              href="/sportai"
              className={`${styles.linkButton} ${styles.sportAiLink}`}
            >
              SportAI
            </a>
            . Before that, I was a Full Stack Engineer at{" "}
            <a
              href="/geico"
              className={`${styles.linkButton} ${styles.geicoLink}`}
            >
              GEICO
            </a>
            . I'm a self-teacher and comedian at heart. Where others search for
            truth, I search for laughs.
          </div>
          <p className={styles.updatedAt}>Updated August 2026</p>
          {/* <div className={styles.lineheight15}>
            <a
              target="_blank"
              href="mailto: danny.ohana@gmail.com"
              className={styles.linkButton}
            >
              <p>Email me</p>
            </a>
          </div> */}
          <div className={styles.navButtons}>
            <a
              href="#writing"
              className={styles.navButton}
              data-cuelume-hover="tick"
              onClick={handleWritingClick}
            >
              <span>Writing</span>
            </a>
            <a
              href="/places"
              className={styles.navButton}
              data-cuelume-hover="tick"
            >
              <span>Places I&apos;ve Been</span>
            </a>
            <a
              href="/stack"
              className={styles.navButton}
              data-cuelume-hover="tick"
            >
              <span>Tools I Use</span>
            </a>
          </div>
          <section
            className={styles.recognitionSection}
            aria-label="Recognition"
          >
            <div
              className={`${styles.reviewsButtonWrapper} ${showReviews && !isReviewsClosing ? styles.reviewsButtonWrapperSticky : ""}`}
            >
              <button
                onClick={handleReviewsToggle}
                className={`${styles.navButton} ${styles.reviewsButton} ${showReviews && !isReviewsClosing ? styles.reviewsButtonActive : ""}`}
                data-cuelume-hover="tick"
              >
                <span>Recognition</span>
                <svg
                  className={styles.navButtonIconDown}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            {showReviews && (
              <div className={styles.reviewsSection}>
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    ref={index === 0 ? firstReviewRef : null}
                    className={`${styles.chatBubble} ${isReviewsClosing ? styles.chatBubbleClosing : ""}`}
                    style={{
                      "--open-delay": `${(0.4 * (1 - Math.pow(0.65, index))).toFixed(3)}s`,
                      "--close-delay": `${(0.4 * (1 - Math.pow(0.65, reviews.length - 1 - index))).toFixed(3)}s`,
                    }}
                  >
                    <p className={styles.chatBubbleText}>{review.text}</p>
                    <p className={styles.chatBubbleSubtitle}>— {review.by}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className={styles.workSection} aria-label="Selected work">
            {workByCompany.map((company) => (
              <WorkCarousel
                key={company.company}
                {...company}
                onImageSelect={handleArtifactClick}
              />
            ))}
          </section>
          <section
            id="writing"
            className={styles.writingSection}
            aria-labelledby="writing-heading"
          >
            <h2 id="writing-heading" className={styles.writingHeading}>
              Writing
            </h2>
            <div className={styles.writingGroups}>
              {writingByYear.map(({ year, articles }) => (
                <div className={styles.writingGroup} key={year}>
                  <h3 className={styles.writingYear}>{year}</h3>
                  <ul className={styles.writingList}>
                    {articles.map((article) => (
                      <li className={styles.writingItem} key={article.url}>
                        <a
                          className={styles.writingLink}
                          href={article.url}
                          target={article.external === false ? undefined : "_blank"}
                          rel={article.external === false ? undefined : "noopener noreferrer"}
                        >
                          <span className={styles.writingCopy}>
                            <span className={styles.writingTitle}>
                              {article.title}
                            </span>
                            <span className={styles.writingSubtitle}>
                              {article.subtitle}
                            </span>
                          </span>
                          <span
                            className={styles.writingPreview}
                            aria-hidden="true"
                          >
                            <Image
                              className={styles.writingPreviewImage}
                              src={article.image.src}
                              alt=""
                              width={article.image.width}
                              height={article.image.height}
                              layout="responsive"
                              sizes="144px"
                            />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <footer className={styles.hometownTime} aria-label="Local time">
            {hometownTime && (
              <span>
                <time dateTime={hometownTime.toISOString()}>
                  {hometownTimeFormatter.format(hometownTime)}
                </time>{" "}
                in Ft. Lauderdale, Florida
              </span>
            )}
            <a href="mailto:danny.ohana@gmail.com">Send a message</a>
            <nav className={styles.onlineLinks} aria-label="Social profiles">
              <a
                href="https://x.com/ohanaspeaking"
                target="_blank"
                rel="noopener noreferrer"
              >
                X (Twitter)
              </a>
              <a
                href="https://github.com/ohana23"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/danielohana/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </nav>
          </footer>
        </div>
      </div>
      {selectedArtifact && (
        <div
          className={`${artifactStyles.lightbox} ${isClosing ? artifactStyles.lightboxClosing : ""} ${closingDirection === "up" ? artifactStyles.lightboxScrollClosingUp : closingDirection === "down" ? artifactStyles.lightboxScrollClosingDown : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
          onClick={() => closeLightbox()}
          onWheel={onViewerWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={artifactStyles.lightboxBackdrop} aria-hidden="true" />
          <div className={artifactStyles.counter} aria-live="polite">
            {carouselMedia.findIndex((artifact) => artifact.id === selectedArtifact.id) + 1}/{carouselMedia.length}
          </div>
          <button ref={closeButtonRef} className={artifactStyles.closeButton} onClick={(event) => { event.stopPropagation(); closeLightbox(); }} aria-label="Close media viewer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className={`${artifactStyles.navButton} ${artifactStyles.navPrevious}`} disabled={isTransitioning} onClick={(event) => { event.stopPropagation(); navigateToPrevious(); }} aria-label="Previous media item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className={`${artifactStyles.navButton} ${artifactStyles.navNext}`} disabled={isTransitioning} onClick={(event) => { event.stopPropagation(); navigateToNext(); }} aria-label="Next media item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className={`${artifactStyles.lightboxContent} ${isClosing ? artifactStyles.lightboxContentClosing : ""}`} onClick={(event) => event.stopPropagation()}>
            <div className={artifactStyles.lightboxImageWrapper} onClick={() => closeLightbox()}>
              <div className={`${artifactStyles.lightboxImageContainer} ${isTransitioning && slideDirection === "left" ? artifactStyles.slideOutLeft : isTransitioning && slideDirection === "right" ? artifactStyles.slideOutRight : ""}`}>
                {selectedArtifact.type === "video" ? (
                  <video
                    key={selectedArtifact.id}
                    src={selectedArtifact.image}
                    poster={selectedArtifact.poster}
                    aria-label={selectedArtifact.caption}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={artifactStyles.lightboxImage}
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <Image key={selectedArtifact.id} src={selectedArtifact.image} alt={selectedArtifact.caption} layout="fill" objectFit="contain" className={artifactStyles.lightboxImage} quality={90} priority />
                )}
              </div>
              {nextArtifact && (
                <div className={`${artifactStyles.lightboxImageContainer} ${slideDirection === "left" ? artifactStyles.slideInRight : slideDirection === "right" ? artifactStyles.slideInLeft : ""}`}>
                  {nextArtifact.type === "video" ? (
                    <video
                      key={nextArtifact.id}
                      src={nextArtifact.image}
                      poster={nextArtifact.poster}
                      aria-label={nextArtifact.caption}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className={artifactStyles.lightboxImage}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <Image key={nextArtifact.id} src={nextArtifact.image} alt={nextArtifact.caption} layout="fill" objectFit="contain" className={artifactStyles.lightboxImage} quality={90} priority />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
