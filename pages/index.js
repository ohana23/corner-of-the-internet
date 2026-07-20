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

const formatWritingDate = (publishedAt) => {
  const [, month, day] = publishedAt.split("-");
  return `${month}/${day}`;
};

const hometownTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
});

const workByCompany = [
  {
    company: "Procore",
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
      // {
      //   src: "/artifacts/procore-camera-redesign.webp",
      //   alt: "Procore camera redesign",
      // },
      // {
      //   src: "/artifacts/procore-media-bento.webp",
      //   alt: "A collection of Procore media product designs",
      // },
      // {
      //   src: "/artifacts/action-row.webp",
      //   alt: "Procore action row component announcement",
      // },
      // {
      //   src: "/artifacts/create-item-snap-photo.webp",
      //   alt: "Create an item from a photo feature for Procore",
      // },
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
      // {
      //   src: "/artifacts/toast-behavior.webp",
      //   alt: "Toast behavior design for Procore",
      // },
    ],
  },
  {
    company: "Snippets",
    images: [
      {
        src: "/artifacts/snippet-prototype.gif",
        alt: "Snippets app feed prototype",
      },
      {
        src: "/artifacts/snippets-timer.gif",
        alt: "Auto-scrolling posts in Snippets",
      },
      {
        src: "/artifacts/snippets-app-icon.webp",
        alt: "Snippets app icon on an iPhone home screen",
      },
      {
        src: "/artifacts/snippets-splash-screen.webp",
        alt: "Snippets app splash screen",
      },
      {
        src: "/artifacts/snippets-start-screen.webp",
        alt: "Snippets onboarding start screen",
      },
      {
        src: "/artifacts/snippets-profile.webp",
        alt: "Snippets profile and shared memory screen",
      },
      {
        src: "/artifacts/snippets-montage.webp",
        alt: "Animated Snippets memory montage",
      },
    ],
  },
  {
    company: "SportAI",
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

function WorkCarousel({ company, images, onImageSelect }) {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const carouselItems = Array.from(carousel.querySelectorAll("img, video"));
    const firstItem = carouselItems[0];
    const lastItem = carouselItems[carouselItems.length - 1];
    if (!firstItem || !lastItem) return;

    const resetCarousel = () => {
      carousel.scrollLeft = 0;
      carousel.scrollTop = 0;
    };

    const updateEdgeSpacing = () => {
      const carouselWidth = carousel.clientWidth;
      const leadingSpace = Math.max(
        0,
        (carouselWidth - firstItem.getBoundingClientRect().width) / 2,
      );
      const trailingSpace = Math.max(
        0,
        (carouselWidth - lastItem.getBoundingClientRect().width) / 2,
      );

      carousel.style.setProperty(
        "--carousel-leading-space",
        `${leadingSpace}px`,
      );
      carousel.style.setProperty(
        "--carousel-trailing-space",
        `${trailingSpace}px`,
      );
    };

    const resizeObserver = new ResizeObserver(updateEdgeSpacing);
    resizeObserver.observe(carousel);
    resizeObserver.observe(firstItem);
    resizeObserver.observe(lastItem);

    firstItem.addEventListener("load", updateEdgeSpacing);
    firstItem.addEventListener("loadedmetadata", updateEdgeSpacing);
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
      firstItem.removeEventListener("load", updateEdgeSpacing);
      firstItem.removeEventListener("loadedmetadata", updateEdgeSpacing);
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
    const itemPositions = items.map((item) =>
      Math.min(
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
      <h2 id={`work-${company}`} className={styles.writingHeading}>
        Work for {company}
      </h2>
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
  const [showSocials, setShowSocials] = useState(false);
  const [hasShownSocials, setHasShownSocials] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isReviewsClosing, setIsReviewsClosing] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [nextArtifact, setNextArtifact] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstReviewRef = useRef(null);
  const minSwipeDistance = 50;

  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedArtifact(null);
      setIsClosing(false);
    }, 300);
  };

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

    if (selectedArtifact !== null) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.height = "100dvh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [selectedArtifact, navigateToPrevious, navigateToNext]);

  const handleArtifactClick = (artifact) => {
    setIsClosing(false);
    setSelectedArtifact(artifact);
    setNextArtifact(null);
    setSlideDirection(null);
    setIsTransitioning(false);
  };

  const onTouchStart = (event) => {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0].clientX);
  };

  const onTouchMove = (event) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      navigateToNext();
    } else if (distance < -minSwipeDistance) {
      navigateToPrevious();
    }
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
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);

    // Add loaded class to body to allow scrolling after animation
    document.body.classList.add("loaded");

    // Trigger animation after component mounts
    setIsLoaded(true);

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
      <div className={styles.textContainer}>
        <div className={styles.avatarContainer}>
          <div
            className={styles.avatar}
            data-cuelume-toggle="release"
            onClick={() => {
              if (!showSocials && !hasShownSocials) {
                setHasShownSocials(true);
              }
              setShowSocials(!showSocials);
            }}
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
          </div>
          <svg
            className={`${styles.avatarChevron} ${showSocials ? styles.avatarChevronHidden : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <div
            className={`${styles.socialIcons} ${showSocials ? styles.socialIconsVisible : ""} ${hasShownSocials && !showSocials ? styles.socialIconsHiding : ""}`}
          >
            <a
              href="https://x.com/ohanaspeaking"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/ohana23"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/danielohana/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
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
              className={styles.linkButton}
            >
              Procore
            </a>,{" "} where I lead design for the media team, helping to build the best camera and photo suite for construction teams in the
            world. I was previously the
            Founding Design Engineer at a sports analytics startup called{" "}
            <a
              href="https://dannyohana.notion.site/SportAI-e57904b4f6c84fe4b02f778ce0d403c4"
              className={styles.linkButton}
            >
              SportAI
            </a>
            . Before that, I was a Full Stack Engineer at{" "}
            <a
              href="https://dannyohana.notion.site/GEICO-9fc723017a614085ab810cdfaee10ab7"
              className={styles.linkButton}
            >
              GEICO
            </a>
            . I'm a self-teacher and comedian at heart. Where others search for
            truth, I search for laughs.
          </div>
          <p className={styles.updatedAt}>Updated July 2026</p>
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
              target="_blank"
              rel="noopener noreferrer"
              href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
              className={styles.navButton}
              data-cuelume-hover="tick"
            >
              <span>Work</span>
            </a>
            <a
              href="/artifacts"
              className={styles.navButton}
              data-cuelume-hover="tick"
            >
              <span>Artifacts</span>
            </a>
            <a
              target="_blank"
              href="https://dannyohana.substack.com/"
              className={styles.navButton}
              data-cuelume-hover="tick"
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
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className={styles.writingCopy}>
                            <span className={styles.writingTitle}>
                              {article.title}
                            </span>
                            <span className={styles.writingSubtitle}>
                              {article.subtitle}
                            </span>
                          </span>
                          <time
                            className={styles.writingDate}
                            dateTime={article.publishedAt}
                          >
                            {formatWritingDate(article.publishedAt)}
                          </time>
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
          </footer>
        </div>
      </div>
      {selectedArtifact && (
        <div
          className={`${artifactStyles.lightbox} ${isClosing ? artifactStyles.lightboxClosing : ""}`}
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={artifactStyles.lightboxBackdrop} />
          <div className={artifactStyles.counter}>
            {carouselMedia.findIndex((artifact) => artifact.id === selectedArtifact.id) + 1}/{carouselMedia.length}
          </div>
          <button className={artifactStyles.closeButton} onClick={closeLightbox} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className={artifactStyles.navButton} style={{ left: "20px" }} onClick={(event) => { event.stopPropagation(); navigateToPrevious(); }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className={artifactStyles.navButton} style={{ right: "20px" }} onClick={(event) => { event.stopPropagation(); navigateToNext(); }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className={`${artifactStyles.lightboxContent} ${isClosing ? artifactStyles.lightboxContentClosing : ""}`} onClick={(event) => event.stopPropagation()}>
            <div className={artifactStyles.lightboxImageWrapper} onClick={closeLightbox}>
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
            <p className={artifactStyles.lightboxCaption}>
              {(nextArtifact || selectedArtifact)?.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
