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
        {company === "Procore" && (
          <svg
            className={styles.workHeadingIcon}
            viewBox="0 0 600 520"
            aria-hidden="true"
          >
            <path
              d="M0 259.808L150 0H450L600 259.808L450 519.615H150L0 259.808Z"
              fill="#FF5100"
            />
          </svg>
        )}
        {company === "Snippets" && (
          <svg
            className={styles.workHeadingIcon}
            viewBox="0 0 84 83"
            aria-hidden="true"
          >
            <circle cx="15.3881" cy="67.0932" r="15.3881" fill="#FFC700" />
            <circle cx="52.9353" cy="30.4685" r="30.4685" fill="#FFC700" />
          </svg>
        )}
        {company === "SportAI" && (
          <svg
            className={`${styles.workHeadingIcon} ${styles.sportAiIcon}`}
            viewBox="0 0 76 76"
            aria-hidden="true"
          >
            <path
              d="M37.8086 38.6084C42.2873 38.6086 45.9177 42.2391 45.918 46.7178C45.918 50.1046 43.8415 53.0058 40.8926 54.2197V75.2529C39.8382 75.3415 38.7716 75.3887 37.6943 75.3887C36.6171 75.3887 35.5505 75.3415 34.4961 75.2529V54.1211C31.6687 52.854 29.6983 50.0166 29.6982 46.7178C29.6985 42.2389 33.3297 38.6084 37.8086 38.6084ZM0 37.6943C6.73621e-05 20.6906 11.2592 6.31754 26.7285 1.62109V13.6475C28.6261 14.6078 29.9275 16.5748 29.9277 18.8467C29.9277 22.064 27.3189 24.6729 24.1016 24.6729C20.8845 24.6725 18.2764 22.0638 18.2764 18.8467C18.2766 16.6675 19.474 14.7684 21.2461 13.7695V11.333C12.4661 16.823 6.62505 26.5761 6.625 37.6943C6.62503 48.8126 12.4661 58.5657 21.2461 64.0557V61.6182C19.4742 60.6193 18.2767 58.721 18.2764 56.542C18.2764 53.3248 20.8845 50.7161 24.1016 50.7158C27.3189 50.7158 29.9277 53.3247 29.9277 56.542C29.9274 58.8138 28.626 60.7809 26.7285 61.7412V73.7676C11.2592 69.0711 6.73622e-05 54.6981 0 37.6943ZM68.7637 37.6943C68.7636 26.576 62.9226 16.8229 54.1426 11.333V13.6475C56.0402 14.6078 57.3416 16.5748 57.3418 18.8467C57.3418 22.064 54.733 24.6729 51.5156 24.6729C48.2986 24.6725 45.6904 22.0638 45.6904 18.8467C45.6907 16.6675 46.8881 14.7684 48.6602 13.7695V1.62109C64.1295 6.31749 75.3886 20.6905 75.3887 37.6943C75.3886 54.6981 64.1295 69.0712 48.6602 73.7676V61.6182C46.8883 60.6192 45.6907 58.7209 45.6904 56.542C45.6905 53.3249 48.2986 50.7162 51.5156 50.7158C54.7329 50.7158 57.3418 53.3247 57.3418 56.542C57.3415 58.8139 56.0402 60.7809 54.1426 61.7412V64.0557C62.9226 58.5657 68.7636 48.8127 68.7637 37.6943ZM24.1016 54.6006C23.0292 54.6007 22.1592 55.4696 22.1592 56.542C22.1594 57.6142 23.0293 58.4833 24.1016 58.4834C25.1738 58.4833 26.0427 57.6141 26.043 56.542C26.0429 55.4696 25.1739 54.6007 24.1016 54.6006ZM51.5156 54.6006C50.4434 54.6008 49.5743 55.4697 49.5742 56.542C49.5745 57.6141 50.4435 58.4832 51.5156 58.4834C52.5879 58.4834 53.4568 57.6142 53.457 56.542C53.457 55.4696 52.588 54.6006 51.5156 54.6006ZM37.8086 44.0146C36.3157 44.0147 35.1056 45.2249 35.1055 46.7178C35.1055 48.2107 36.3157 49.4208 37.8086 49.4209C39.3016 49.4209 40.5117 48.2107 40.5117 46.7178C40.5116 45.2249 39.3015 44.0147 37.8086 44.0146ZM37.6943 0C38.7719 0 39.8389 0.0471027 40.8936 0.135742V6.79004L40.8926 6.78906V21.1689C43.8415 22.3829 45.918 25.284 45.918 28.6709C45.9177 33.1496 42.2873 36.7801 37.8086 36.7803C33.3298 36.7802 29.6985 33.1497 29.6982 28.6709C29.6982 25.3721 31.6687 22.5347 34.4961 21.2676V0.135742C35.5504 0.0471515 36.6171 5.39354e-06 37.6943 0ZM37.8086 25.9668C36.3157 25.9669 35.1055 27.178 35.1055 28.6709C35.1057 30.1636 36.3159 31.3739 37.8086 31.374C39.3014 31.374 40.5115 30.1637 40.5117 28.6709C40.5117 27.1779 39.3016 25.9668 37.8086 25.9668ZM24.1016 16.9053C23.0294 16.9054 22.1594 17.7745 22.1592 18.8467C22.1592 19.919 23.0292 20.7889 24.1016 20.7891C25.1739 20.7889 26.043 19.919 26.043 18.8467C26.0427 17.7745 25.1737 16.9055 24.1016 16.9053ZM51.5156 16.9053C50.4435 16.9055 49.5745 17.7746 49.5742 18.8467C49.5742 19.919 50.4434 20.7888 51.5156 20.7891C52.5881 20.7891 53.457 19.9191 53.457 18.8467C53.4568 17.7744 52.5879 16.9053 51.5156 16.9053Z"
              fill="currentColor"
            />
          </svg>
        )}
        <span>
          {company === "Procore"
            ? "Building designs at Procore"
            : company === "Snippets"
              ? "Making memorable things for Snippets"
              : company === "SportAI"
                ? <>
                    Crunching numbers and pixels for{" "}
                    <a className={styles.workHeadingLink} href="/sportai">
                      SportAI
                    </a>
                  </>
                : `Work for ${company}`}
        </span>
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
            <div className={styles.onlineLinks}>
            <button
              type="button"
              className={styles.onlineToggle}
              aria-expanded={showSocials}
              aria-controls="footer-social-links"
              onClick={() => {
                if (!showSocials && !hasShownSocials) {
                  setHasShownSocials(true);
                }
                setShowSocials(!showSocials);
              }}
            >
              <span>Find me online</span>
              <svg
                className={`${styles.onlineToggleChevron} ${
                  showSocials ? styles.onlineToggleChevronHidden : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <div
              id="footer-social-links"
              className={`${styles.socialLinksReveal} ${
                showSocials ? styles.socialLinksRevealOpen : ""
              }`}
            >
              <div
                className={`${styles.socialIcons} ${
                  showSocials ? styles.socialIconsVisible : ""
                } ${
                  hasShownSocials && !showSocials
                    ? styles.socialIconsHiding
                    : ""
                }`}
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
            </div>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
