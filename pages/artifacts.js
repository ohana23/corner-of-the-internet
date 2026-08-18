import { useEffect, useState, useCallback, useRef } from "react";
import Masonry from "react-masonry-css";
import artifactStyles from "../artifacts.module.css";
import { artifacts } from "../data/artifacts";
import { isViewerMediaReady, preloadViewerMedia } from "../utils/viewerMedia";
import { useViewerZoom } from "../utils/useViewerZoom";

function ArtifactsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const navigationArtifactRef = useRef(null);
  const navigationRequestRef = useRef(0);
  const {
    imageRef,
    imageStyle,
    isPanning,
    isZoomAnimating,
    isZoomed,
    onImageClick,
    onImagePointerCancel,
    onImagePointerDown,
    onImagePointerMove,
    onImagePointerUp,
  } = useViewerZoom(selectedArtifact?.id);

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
    navigationRequestRef.current += 1;
    navigationArtifactRef.current = null;
    setIsClosing(true);
    setTimeout(() => {
      setSelectedArtifact(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const showArtifact = useCallback((artifact) => {
    navigationArtifactRef.current = artifact;
    const request = navigationRequestRef.current + 1;
    navigationRequestRef.current = request;

    if (isViewerMediaReady(artifact)) {
      setSelectedArtifact(artifact);
      return;
    }

    preloadViewerMedia(artifact).then((isReady) => {
      if (!isReady || navigationRequestRef.current !== request) return;
      setSelectedArtifact(artifact);
    });
  }, []);

  const navigateToPrevious = useCallback(() => {
    if (selectedArtifact === null) return;
    const navigationArtifact = navigationArtifactRef.current || selectedArtifact;
    const currentIndex = artifacts.findIndex(a => a.id === navigationArtifact.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : artifacts.length - 1;
    showArtifact(artifacts[prevIndex]);
  }, [selectedArtifact, showArtifact]);

  const navigateToNext = useCallback(() => {
    if (selectedArtifact === null) return;
    const navigationArtifact = navigationArtifactRef.current || selectedArtifact;
    const currentIndex = artifacts.findIndex(a => a.id === navigationArtifact.id);
    const nextIndex = currentIndex < artifacts.length - 1 ? currentIndex + 1 : 0;
    showArtifact(artifacts[nextIndex]);
  }, [selectedArtifact, showArtifact]);

  useEffect(() => {
    if (selectedArtifact === null) return;

    navigationArtifactRef.current = selectedArtifact;
    const currentIndex = artifacts.findIndex(a => a.id === selectedArtifact.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : artifacts.length - 1;
    const nextIndex = currentIndex < artifacts.length - 1 ? currentIndex + 1 : 0;

    preloadViewerMedia(artifacts[previousIndex]);
    preloadViewerMedia(artifacts[nextIndex]);
  }, [selectedArtifact]);

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
    navigationRequestRef.current += 1;
    navigationArtifactRef.current = artifact;
    setSelectedArtifact(artifact);
  };

  const onTouchStart = (e) => {
    if (isZoomed) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (isZoomed) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (isZoomed) return;
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
      <div className={artifactStyles.header}>
        <nav className={artifactStyles.pageNav} aria-label="Primary">
          <a href="/" className={`${artifactStyles.pageNavLink} ${artifactStyles.pageNavBack}`} aria-label="Back to home">
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
              <polyline points="9 14 4 9 9 4"></polyline>
              <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
            </svg>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://dannyohana.substack.com/"
            className={artifactStyles.pageNavLink}
          >
            Writing
          </a>
          <a href="/stack" className={artifactStyles.pageNavLink}>Tools I Use</a>
        </nav>
      </div>

      {/* Artifacts Section */}
      <div className={artifactStyles.artifactsSection}>

      <h1 className={artifactStyles.pageTitle}>Artifacts</h1>

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
          <button className={`${artifactStyles.navButton} ${artifactStyles.navPrevious}`} onClick={(e) => { e.stopPropagation(); navigateToPrevious(); }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className={`${artifactStyles.navButton} ${artifactStyles.navNext}`} onClick={(e) => { e.stopPropagation(); navigateToNext(); }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <div className={`${artifactStyles.lightboxContent} ${isClosing ? artifactStyles.lightboxContentClosing : ''}`}>
            <div className={artifactStyles.lightboxImageWrapper}>
              {selectedArtifact && (
                <div className={artifactStyles.lightboxImageContainer}>
                  <img
                    ref={imageRef}
                    src={selectedArtifact.image}
                    alt={selectedArtifact.caption}
                    className={`${artifactStyles.lightboxImage} ${isZoomed ? artifactStyles.lightboxImageZoomed : ''} ${isZoomAnimating ? artifactStyles.lightboxImageZoomAnimating : ''} ${isPanning ? artifactStyles.lightboxImagePanning : ''}`}
                    decoding="sync"
                    draggable="false"
                    style={imageStyle}
                    onClick={onImageClick}
                    onPointerDown={onImagePointerDown}
                    onPointerMove={onImagePointerMove}
                    onPointerUp={onImagePointerUp}
                    onPointerCancel={onImagePointerCancel}
                  />
                </div>
              )}
            </div>
            <p className={artifactStyles.lightboxCaption}>
              {selectedArtifact?.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtifactsPage;
