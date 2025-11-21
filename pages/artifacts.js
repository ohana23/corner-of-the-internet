import { useEffect, useState } from "react";
import styles from "../artifacts.module.css";
import { artifacts } from "../data/artifacts";

function ArtifactsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('loaded');
    setIsLoaded(true);
  }, []);

  return (
    <div className={`${styles.container} ${isLoaded ? styles.loaded : ""}`}>
      {/* <header className={styles.header}>
        <h1 className={styles.title}>Artifacts</h1>
        <p className={styles.subtitle}>
          Experiments, designs, and creative explorations
        </p>
      </header> */}

      <div className={styles.grid}>
        {artifacts.map((artifact, index) => (
          <div 
            key={artifact.id} 
            className={styles.artifactItem}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.imageWrapper}>
              <img
                src={artifact.image}
                alt={artifact.caption}
                className={styles.artifactImage}
              />
            </div>
            <p className={styles.caption}>
              {artifact.caption}
            </p>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <a href="/" className={styles.backLink}>
          ← Back to home
        </a>
      </footer>
    </div>
  );
}

export default ArtifactsPage;

