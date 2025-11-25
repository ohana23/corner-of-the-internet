import { useEffect, useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import styles from "../styles.module.css";
import artifactStyles from "../artifacts.module.css";
import { artifacts } from "../data/artifacts";

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [logoProgress, setLogoProgress] = useState(0);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);
    
    // Add loaded class to body to allow scrolling after animation
    document.body.classList.add('loaded');
    
    // Trigger animation after component mounts
    setIsLoaded(true);
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

    const handleScroll = () => {
      if (selectedArtifact !== null) {
        closeLightbox();
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
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
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
        <p className={styles.description}>
          Hey, I'm <strong>Danny Ohana</strong>. You can find me on my laptop in one of many Orlando coffee shops helping <a href="https://www.procore.com" className={styles.linkButton}>Procore</a> build the best construction camera software in the world.
          I design and code thoughtful products.
          I was previously the Founding Designer at a fantasy sports startup called <a href="https://www.sportai.com" className={styles.linkButton}>SportAI</a>.
          Before that, I was a Full Stack Engineer at <a href="https://www.geico.com" className={styles.linkButton}>GEICO</a>. I'm a self-teacher and comedian at heart. Where others search for truth, I search for laughs.
          <div className={styles.lineheight15}>
            <a
              target="_blank"
              href="mailto: danny.ohana@gmail.com"
              className={styles.linkButton}
            >
              <p>Email me</p>
            </a>
          </div>
          {/* <div className={styles.lineheight15}>
            <a
              target="_blank"
              href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
              className={styles.linkButton}
            >
              <p>
                View my work
              </p>
            </a>
          </div> */}
        </p>
      </div>

      {/* Portfolio Button */}
      <div className={styles.portfolioButtonWrapper}>
        <a 
          href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
          target="_blank"
          className={styles.portfolioImageButton}
        >
          <div className={styles.portfolioImageOverlay}>
            <span className={styles.portfolioImageText}>View Portfolio</span>
          </div>
          <Image 
            src="/notion-screenshot.webp" 
            alt="Portfolio" 
            layout="fill"
            objectFit="cover"
            className={styles.portfolioImage}
            priority
          />
        </a>
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
        <img
          src="/safari-pinned-tab.svg"
          alt="Logo"
          className={styles.logo}
          style={{
            opacity: logoProgress,
            filter: `blur(${10 - (logoProgress * 10)}px) brightness(0) saturate(100%) invert(29%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(92%)`,
            transform: `rotate(${-15 + (logoProgress * 15)}deg)`,
          }}
        />
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
