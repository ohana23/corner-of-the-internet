import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import artifactStyles from "../artifacts.module.css";
import { artifacts } from "../data/artifacts";

function ArtifactsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [nextArtifact, setNextArtifact] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null); // 'left' or 'right'
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedArtifact(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const navigateToPrevious = useCallback(() => {
    if (selectedArtifact === null || isTransitioning) return;
    const currentIndex = artifacts.findIndex(a => a.id === selectedArtifact.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : artifacts.length - 1;
    const prevArtifact = artifacts[prevIndex];

    setIsTransitioning(true);
    setSlideDirection('right'); // Current slides out right, new slides in from left
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
    const currentIndex = artifacts.findIndex(a => a.id === selectedArtifact.id);
    const nextIndex = currentIndex < artifacts.length - 1 ? currentIndex + 1 : 0;
    const nextArtifactItem = artifacts[nextIndex];

    setIsTransitioning(true);
    setSlideDirection('left'); // Current slides out left, new slides in from right
    setNextArtifact(nextArtifactItem);

    setTimeout(() => {
      setSelectedArtifact(nextArtifactItem);
      setNextArtifact(null);
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 300);
  }, [selectedArtifact, isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedArtifact === null) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
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
  }, [selectedArtifact, navigateToPrevious, navigateToNext]);

  const handleArtifactClick = (artifact) => {
    setIsClosing(false);
    setSelectedArtifact(artifact);
    setNextArtifact(null);
    setSlideDirection(null);
    setIsTransitioning(false);
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

  const breakpointColumnsObj = {
    default: 3,
    1200: 3,
    768: 2,
    500: 1
  };

  return (
    <div className={`${artifactStyles.container} ${isLoaded ? artifactStyles.loaded : ""}`}>
      {/* Back to home link */}
      <div className={artifactStyles.header}>
        <a href="/" className={artifactStyles.backButton} aria-label="Back to home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4"></polyline>
            <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
          </svg>
        </a>
      </div>

      {/* Artifacts Section */}
      <div className={artifactStyles.artifactsSection}>
        {(() => {
          const sections = [];
          let currentGrid = [];
          let animationIndex = 0;

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
              {/* Current image - slides out */}
              {selectedArtifact && (
                <div
                  className={`${artifactStyles.lightboxImageContainer} ${
                    isTransitioning && slideDirection === 'left'
                      ? artifactStyles.slideOutLeft
                      : isTransitioning && slideDirection === 'right'
                      ? artifactStyles.slideOutRight
                      : ''
                  }`}
                >
                  <Image
                    key={selectedArtifact.id}
                    src={selectedArtifact.image}
                    alt={selectedArtifact.caption}
                    layout="fill"
                    objectFit="contain"
                    className={artifactStyles.lightboxImage}
                    quality={90}
                    priority
                  />
                </div>
              )}
              {/* Next image - slides in */}
              {nextArtifact && (
                <div
                  className={`${artifactStyles.lightboxImageContainer} ${
                    slideDirection === 'left'
                      ? artifactStyles.slideInRight
                      : slideDirection === 'right'
                      ? artifactStyles.slideInLeft
                      : ''
                  }`}
                >
                  <Image
                    key={nextArtifact.id}
                    src={nextArtifact.image}
                    alt={nextArtifact.caption}
                    layout="fill"
                    objectFit="contain"
                    className={artifactStyles.lightboxImage}
                    quality={90}
                    priority
                  />
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

export default ArtifactsPage;
