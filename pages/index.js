import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles.module.css";
import artifactStyles from "../artifacts.module.css";
import monthlyPhoto from "../public/monthly-photo-4.jpeg";
import { artifacts } from "../data/artifacts";

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
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
          <div className={styles.lineheight15}>
            <a
              target="_blank"
              href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
              className={styles.linkButton}
            >
              <p>
                View my work <span>{"->"}</span>
              </p>
            </a>
          </div>
        </p>
      </div>



      {/* Artifacts Section */}
      <div className={artifactStyles.artifactsSection}>
        <div className={artifactStyles.grid}>
          {artifacts.map((artifact, index) => (
            <div 
              key={artifact.id} 
              className={artifactStyles.artifactItem}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleArtifactClick(artifact)}
            >
              <div className={artifactStyles.imageWrapper}>
                <img
                  src={artifact.image}
                  alt={artifact.caption}
                  className={artifactStyles.artifactImage}
                />
              </div>
              <p className={artifactStyles.caption}>
                {artifact.caption}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedArtifact && (
        <div className={`${artifactStyles.lightbox} ${isClosing ? artifactStyles.lightboxClosing : ''}`} onClick={closeLightbox}>
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
              <img
                src={selectedArtifact.image}
                alt={selectedArtifact.caption}
                className={artifactStyles.lightboxImage}
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
