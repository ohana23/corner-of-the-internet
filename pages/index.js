import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles.module.css";
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

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hometownTime, setHometownTime] = useState(null);
  const [showSocials, setShowSocials] = useState(false);
  const [hasShownSocials, setHasShownSocials] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isReviewsClosing, setIsReviewsClosing] = useState(false);
  const firstReviewRef = useRef(null);
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
            >
              <span>Work</span>
            </a>
            <a
              href="/artifacts"
              className={styles.navButton}
            >
              <span>Artifacts</span>
            </a>
            <a
              target="_blank"
              href="https://dannyohana.substack.com/"
              className={styles.navButton}
            >
              <span>Writing</span>
            </a>
            <a href="/places" className={styles.navButton}>
              <span>Places I&apos;ve Been</span>
            </a>
            <a href="/stack" className={styles.navButton}>
              <span>Tools I Use</span>
            </a>
          </div>
          <div
            className={`${styles.reviewsButtonWrapper} ${showReviews && !isReviewsClosing ? styles.reviewsButtonWrapperSticky : ""}`}
          >
            <button
              onClick={handleReviewsToggle}
              className={`${styles.navButton} ${styles.reviewsButton} ${showReviews && !isReviewsClosing ? styles.reviewsButtonActive : ""}`}
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
              <>
                <time dateTime={hometownTime.toISOString()}>
                  {hometownTimeFormatter.format(hometownTime)}
                </time>{" "}
                in Ft. Lauderdale, Florida
              </>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
