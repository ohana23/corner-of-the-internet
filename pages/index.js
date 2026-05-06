import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles.module.css";
import { LinkPreview } from "../components/ui/link-preview";
import { GitHubPeek } from "../components/ui/github-peek";
import { XPeek } from "../components/ui/x-peek";
import { WorkPeek } from "../components/ui/work-peek";
import { reviews } from "../data/reviews";
import { artifacts } from "../data/artifacts";

const LiquidMetal = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.LiquidMetal),
  { ssr: false },
);

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [hasShownSocials, setHasShownSocials] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isReviewsClosing, setIsReviewsClosing] = useState(false);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [isArtifactsClosing, setIsArtifactsClosing] = useState(false);
  const [artifactsKey, setArtifactsKey] = useState(0);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [artifactsPosition, setArtifactsPosition] = useState({
    top: 0,
    left: 0,
  });
  const [artifactsDimensions, setArtifactsDimensions] = useState({
    columns: 3,
    itemSize: 120,
  });
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const artifactsPreviewItems = artifacts
    .filter((a) => !a.featured)
    .slice(0, 12);

  const calculateArtifactsLayout = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 60;
    const gap = 8;

    // Text container is max-width 450px + 20px body padding on each side
    const textContainerRight = Math.min(450 + 40, viewportWidth * 0.4);
    const spacing = 40;

    const left = textContainerRight + spacing;
    const availableWidth = viewportWidth - left - edgePadding;
    const availableHeight = viewportHeight - edgePadding * 2;

    // Calculate optimal columns and item size
    const minItemSize = 80;
    const maxItemSize = 200;
    let columns = Math.floor((availableWidth + gap) / (minItemSize + gap));
    columns = Math.max(2, Math.min(columns, 4));

    let itemSize = Math.floor((availableWidth - (columns - 1) * gap) / columns);
    itemSize = Math.max(minItemSize, Math.min(itemSize, maxItemSize));

    // Recalculate columns based on actual item size
    const totalGridWidth = columns * itemSize + (columns - 1) * gap;
    const rows = Math.ceil(artifactsPreviewItems.length / columns);
    const totalGridHeight = rows * itemSize + (rows - 1) * gap;

    // Center vertically
    const top = Math.max(edgePadding, (viewportHeight - totalGridHeight) / 2);

    return {
      position: { top, left },
      dimensions: { columns, itemSize, totalGridWidth },
    };
  }, [artifactsPreviewItems.length]);

  const updateArtifactsLayout = useCallback(() => {
    const layout = calculateArtifactsLayout();
    setArtifactsPosition(layout.position);
    setArtifactsDimensions(layout.dimensions);
  }, [calculateArtifactsLayout]);

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

  const handleArtifactsMouseEnter = () => {
    if (isMobile) return;
    if (isArtifactsClosing) {
      setIsArtifactsClosing(false);
    }
    updateArtifactsLayout();
    setArtifactsKey((prev) => prev + 1);
    setShowArtifacts(true);
  };

  const handleArtifactsMouseLeave = () => {
    setIsArtifactsClosing(true);
    setTimeout(() => {
      setShowArtifacts(false);
      setIsArtifactsClosing(false);
    }, 300);
  };

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

    // Mobile detection and layout updates
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    updateArtifactsLayout();

    // Preload artifact images for smooth animation
    const preloadImages = async () => {
      const imagePromises = artifactsPreviewItems.map((artifact) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = artifact.image;
        });
      });
      await Promise.all(imagePromises);
      setImagesPreloaded(true);
    };
    preloadImages();

    const handleResize = () => {
      checkMobile();
      updateArtifactsLayout();
    };

    mediaQuery.addEventListener("change", handleColorSchemeChange);
    window.addEventListener("resize", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleColorSchemeChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateArtifactsLayout]);

  return (
    <div className={`${styles.container} ${isLoaded ? styles.loaded : ""}`}>
      {/* Preload artifact images for smooth hover animation */}
      <div style={{ display: "none" }} aria-hidden="true">
        {artifactsPreviewItems.map((artifact) => (
          <Image
            key={`preload-${artifact.id}`}
            src={artifact.image}
            alt=""
            width={140}
            height={140}
            priority
          />
        ))}
      </div>
      <div className={styles.textContainer}>
        <div className={styles.avatarContainer}>
          <div
            className={styles.avatar}
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
              onMouseEnter={() => setHoveredSocial("x")}
              onMouseLeave={() => setHoveredSocial(null)}
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
              onMouseEnter={() => setHoveredSocial("github")}
              onMouseLeave={() => setHoveredSocial(null)}
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
        <p className={styles.description}>
          You can find me on my laptop in one of many Orlando coffee shops
          helping{" "}
          <LinkPreview
            url="https://dannyohana.notion.site/Procore-236d2490fd738038898eccd6204620ea"
            className={styles.linkButton}
            isStatic
            imageSrc="/artifacts/procore-camera-redesign.webp"
          >
            Procore
          </LinkPreview>{" "}
          build the best construction camera software in the world. I design and
          code thoughtful products. I was previously the Founding Designer at a
          fantasy sports startup called{" "}
          <LinkPreview
            url="https://dannyohana.notion.site/SportAI-e57904b4f6c84fe4b02f778ce0d403c4"
            className={styles.linkButton}
            isStatic
            imageSrc="/artifacts/sportai-three-designs.webp"
          >
            SportAI
          </LinkPreview>
          . Before that, I was a Full Stack Engineer at{" "}
          <LinkPreview
            url="https://dannyohana.notion.site/GEICO-9fc723017a614085ab810cdfaee10ab7"
            className={styles.linkButton}
            isStatic
            imageSrc="/artifacts/geico.webp"
          >
            GEICO
          </LinkPreview>
          . I'm a self-teacher and comedian at heart. Where others search for
          truth, I search for laughs.
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
            <div
              onMouseEnter={() => !isMobile && setHoveredNav("work")}
              onMouseLeave={() => setHoveredNav(null)}
              style={{ display: "inline-block" }}
            >
              <a
                target="_blank"
                href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
                className={`${styles.navButton} ${hoveredNav === "work" ? styles.artifactsButtonActive : ""}`}
              >
                <span>Work</span>
                <svg
                  className={styles.navButtonIcon}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
            <div
              className={styles.artifactsButtonWrapper}
              onMouseEnter={handleArtifactsMouseEnter}
              onMouseLeave={handleArtifactsMouseLeave}
            >
              <a
                href="/artifacts"
                className={`${styles.navButton} ${showArtifacts && !isArtifactsClosing ? styles.artifactsButtonActive : ""}`}
              >
                <span>Artifacts</span>
                <svg
                  className={styles.navButtonIcon}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
              {showArtifacts && !isMobile && (
                <div
                  key={artifactsKey}
                  className={styles.artifactsPreview}
                  style={{
                    position: "fixed",
                    top: `${artifactsPosition.top}px`,
                    left: `${artifactsPosition.left}px`,
                    zIndex: 50,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    className={styles.artifactsMasonry}
                    style={{
                      gridTemplateColumns: `repeat(${artifactsDimensions.columns}, ${artifactsDimensions.itemSize}px)`,
                      width: `${artifactsDimensions.totalGridWidth}px`,
                    }}
                  >
                    {artifactsPreviewItems.map((artifact, index) => (
                      <a
                        key={artifact.id}
                        href="/artifacts"
                        className={`${styles.artifactItem} ${isArtifactsClosing ? styles.artifactItemClosing : ""}`}
                        style={{
                          width: `${artifactsDimensions.itemSize}px`,
                          height: `${artifactsDimensions.itemSize}px`,
                          pointerEvents: "auto",
                          animationDelay: isArtifactsClosing
                            ? `${(artifactsPreviewItems.length - 1 - index) * 15}ms`
                            : `${index * 25}ms`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={artifact.image}
                          alt={artifact.caption}
                          className={styles.artifactImage}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a
              target="_blank"
              href="https://dannyohana.substack.com/"
              className={styles.navButton}
            >
              <span>Writing</span>
              <svg
                className={styles.navButtonIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
            <a href="/stack" className={styles.navButton}>
              <span>Stack</span>
              <svg
                className={styles.navButtonIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>
          <div className={styles.reviewsButtonWrapper}>
            <button
              onClick={handleReviewsToggle}
              className={`${styles.navButton} ${styles.reviewsButton} ${showReviews && !isReviewsClosing ? styles.reviewsButtonActive : ""}`}
            >
              <span>Reviews</span>
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
        </p>
      </div>
      {!isMobile && <GitHubPeek isOpen={hoveredSocial === "github"} />}
      {!isMobile && <XPeek isOpen={hoveredSocial === "x"} />}
      {!isMobile && <WorkPeek isOpen={hoveredNav === "work"} />}
    </div>
  );
}

export default HomePage;
