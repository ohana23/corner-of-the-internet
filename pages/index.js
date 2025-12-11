import { useEffect, useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import styles from "../styles.module.css";
import artifactStyles from "../artifacts.module.css";
import { artifacts } from "../data/artifacts";
import { LinkPreview } from "../components/ui/link-preview";

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [logoProgress, setLogoProgress] = useState(0);
  const [showSocials, setShowSocials] = useState(false);
  const [hasShownSocials, setHasShownSocials] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);
    
    // Add loaded class to body to allow scrolling after animation
    document.body.classList.add('loaded');
    
    // Trigger animation after component mounts
    setIsLoaded(true);
    
    // Detect color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleColorSchemeChange = (e) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleColorSchemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  // Logo scroll animation effect
  useEffect(() => {
    const handleLogoScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate distance from bottom
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      
      // Start animation when within 500px of bottom
      const triggerDistance = 500;
      
      if (distanceFromBottom <= triggerDistance) {
        // Calculate progress (0 to 1)
        const progress = Math.min(1, 1 - (distanceFromBottom / triggerDistance));
        setLogoProgress(progress);
      } else {
        setLogoProgress(0);
      }
    };

    window.addEventListener('scroll', handleLogoScroll);
    // Call once on mount to set initial state
    handleLogoScroll();
    
    return () => {
      window.removeEventListener('scroll', handleLogoScroll);
    };
  }, []);

  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedArtifact(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedArtifact === null) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateToPrevious();
      } else if (e.key === 'ArrowRight') {
        navigateToNext();
      }
    };

    // Prevent body scroll when lightbox is open
    if (selectedArtifact !== null) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.height = '100dvh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Clean up body styles
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [selectedArtifact]);

  const navigateToPrevious = () => {
    if (selectedArtifact === null) return;
    const currentIndex = artifacts.findIndex(a => a.id === selectedArtifact.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : artifacts.length - 1;
    setSelectedArtifact(artifacts[prevIndex]);
  };

  const navigateToNext = () => {
    if (selectedArtifact === null) return;
    const currentIndex = artifacts.findIndex(a => a.id === selectedArtifact.id);
    const nextIndex = currentIndex < artifacts.length - 1 ? currentIndex + 1 : 0;
    setSelectedArtifact(artifacts[nextIndex]);
  };

  const handleArtifactClick = (artifact) => {
    setIsClosing(false);
    setSelectedArtifact(artifact);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      navigateToNext();
    } else if (isRightSwipe) {
      navigateToPrevious();
    }
  };

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
          >
            <Image 
              src="/avatar.webp" 
              alt="Danny Ohana" 
              width={60} 
              height={60}
              priority
            />
          </div>
          <svg 
            className={`${styles.avatarChevron} ${showSocials ? styles.avatarChevronHidden : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <div className={`${styles.socialIcons} ${showSocials ? styles.socialIconsVisible : ''} ${hasShownSocials && !showSocials ? styles.socialIconsHiding : ''}`}>
            <a 
              href="https://x.com/ohanaspeaking" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/danny.ohana/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
        <p className={styles.description}>
          Hey, I'm <strong>Danny Ohana</strong>. You can find me on my laptop in one of many Orlando coffee shops helping <LinkPreview url="https://dannyohana.notion.site/Procore-236d2490fd738038898eccd6204620ea" className={styles.linkButton} isStatic imageSrc="/artifacts/procore-camera-redesign.webp">Procore</LinkPreview> build the best construction camera software in the world.
          I design and code thoughtful products.
          I was previously the Founding Designer at a fantasy sports startup called <LinkPreview url="https://dannyohana.notion.site/SportAI-e57904b4f6c84fe4b02f778ce0d403c4" className={styles.linkButton} isStatic imageSrc="/artifacts/sportai-three-designs.webp">SportAI</LinkPreview>.
          Before that, I was a Full Stack Engineer at <LinkPreview url="https://dannyohana.notion.site/GEICO-9fc723017a614085ab810cdfaee10ab7" className={styles.linkButton} isStatic imageSrc="/artifacts/geico.webp">GEICO</LinkPreview>. I'm a self-teacher and comedian at heart. Where others search for truth, I search for laughs.
          {/* <div className={styles.lineheight15}>
            <a
              target="_blank"
              href="mailto: danny.ohana@gmail.com"
              className={styles.linkButton}
            >
              <p>Email me</p>
            </a>
          </div> */}
          <div className={styles.lineheight15}>
            <a
              target="_blank"
              href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
              className={styles.linkButton}
            >
              <p>
                View my work
              </p>
            </a>
          </div>
        </p>
      </div>

      {/* Artifacts Section */}
      <div className={artifactStyles.artifactsSection}>
        {(() => {
          const sections = [];
          let currentGrid = [];
          let animationIndex = 0;

          const breakpointColumnsObj = {
            default: 3,
            1200: 3,
            768: 2,
            500: 1
          };

          artifacts.forEach((artifact, index) => {
            if (artifact.featured) {
              // Render accumulated grid section if it has items
              if (currentGrid.length > 0) {
                sections.push(
                  <Masonry
                    key={`grid-${index}`}
                    breakpointCols={breakpointColumnsObj}
                    className={artifactStyles.masonryGrid}
                    columnClassName={artifactStyles.masonryGridColumn}
                  >
                    {currentGrid.map((item) => (
                      <div 
                        key={item.artifact.id} 
                        className={artifactStyles.artifactItem}
                        style={{ animationDelay: `${item.animationIndex * 0.05}s` }}
                      >
                        <div 
                          className={artifactStyles.imageWrapper}
                          onClick={() => handleArtifactClick(item.artifact)}
                        >
                          <img
                            src={item.artifact.image}
                            alt={item.artifact.caption}
                            className={artifactStyles.artifactImage}
                            loading="lazy"
                          />
                        </div>
                        <p className={artifactStyles.caption}>
                          {item.artifact.caption}
                        </p>
                      </div>
                    ))}
                  </Masonry>
                );
                currentGrid = [];
              }

              // Render featured artifact
              sections.push(
                <div 
                  key={`featured-${artifact.id}`} 
                  className={artifactStyles.featuredArtifact}
                  style={{ animationDelay: `${animationIndex * 0.05}s` }}
                >
                  <div 
                    className={artifactStyles.featuredImageWrapper}
                    onClick={() => handleArtifactClick(artifact)}
                  >
                    <img
                      src={artifact.image}
                      alt={artifact.caption}
                      className={artifactStyles.featuredImage}
                      loading="lazy"
                    />
                  </div>
                  <p className={artifactStyles.featuredCaption}>
                    {artifact.caption}
                  </p>
                </div>
              );
              animationIndex++;
            } else {
              // Add to current grid section
              currentGrid.push({ artifact, animationIndex });
              animationIndex++;
            }
          });

          // Render any remaining grid items
          if (currentGrid.length > 0) {
            sections.push(
              <Masonry
                key={`grid-final`}
                breakpointCols={breakpointColumnsObj}
                className={artifactStyles.masonryGrid}
                columnClassName={artifactStyles.masonryGridColumn}
              >
                {currentGrid.map((item) => (
                  <div 
                    key={item.artifact.id} 
                    className={artifactStyles.artifactItem}
                    style={{ animationDelay: `${item.animationIndex * 0.05}s` }}
                  >
                    <div 
                      className={artifactStyles.imageWrapper}
                      onClick={() => handleArtifactClick(item.artifact)}
                    >
                      <img
                        src={item.artifact.image}
                        alt={item.artifact.caption}
                        className={artifactStyles.artifactImage}
                        loading="lazy"
                      />
                    </div>
                    <p className={artifactStyles.caption}>
                      {item.artifact.caption}
                    </p>
                  </div>
                ))}
              </Masonry>
            );
          }

          return sections;
        })()}
      </div>

      {/* Bottom Logo */}
      <div className={styles.logoWrapper}>
        <div className={styles.logoGlowContainer}>
          <div className={styles.logoGlow}></div>
          <img
            src="/safari-pinned-tab.svg"
            alt="Logo"
            className={styles.logo}
            style={{
              opacity: logoProgress,
              filter: `blur(${10 - (logoProgress * 10)}px) ${isDarkMode 
                ? 'brightness(0) saturate(100%) invert(29%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(92%)'
                : 'brightness(0) saturate(100%) invert(60%) sepia(1%) saturate(0%) hue-rotate(0deg) brightness(105%) contrast(92%)'
              }`,
              transform: `rotate(${-15 + (logoProgress * 15)}deg)`,
            }}
          />
        </div>
      </div>

      {/* Lightbox */}
      {selectedArtifact && (
        <div 
          className={`${artifactStyles.lightbox} ${isClosing ? artifactStyles.lightboxClosing : ''}`} 
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={artifactStyles.lightboxBackdrop}></div>
          <div className={artifactStyles.counter}>
            {artifacts.findIndex(a => a.id === selectedArtifact.id) + 1}/{artifacts.length}
          </div>
          <button className={artifactStyles.closeButton} onClick={closeLightbox} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button className={artifactStyles.navButton} style={{ left: '20px' }} onClick={(e) => { e.stopPropagation(); navigateToPrevious(); }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className={artifactStyles.navButton} style={{ right: '20px' }} onClick={(e) => { e.stopPropagation(); navigateToNext(); }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <div className={`${artifactStyles.lightboxContent} ${isClosing ? artifactStyles.lightboxContentClosing : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className={artifactStyles.lightboxImageWrapper} onClick={closeLightbox}>
              <Image
                src={selectedArtifact.image}
                alt={selectedArtifact.caption}
                layout="fill"
                objectFit="contain"
                className={artifactStyles.lightboxImage}
                quality={90}
                priority
              />
            </div>
            <p className={artifactStyles.lightboxCaption}>
              {selectedArtifact.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
