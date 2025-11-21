import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles.module.css";
import monthlyPhoto from "../public/monthly-photo-4.jpeg";

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);
    
    // Add loaded class to body to allow scrolling after animation
    document.body.classList.add('loaded');
    
    // Trigger animation after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <div className={`${styles.container} ${isLoaded ? styles.loaded : ""}`}>
      <div className={styles.textContainer}>
        <p className={styles.description}>
          Hey, I'm <strong>Danny Ohana</strong>. You can find me on my laptop in one of many Orlando coffee shops helping <a href="https://www.procore.com" className={styles.linkButton}>Procore</a> build the best construction camera software in the world.
          I design and code thoughtful products.
          I was previously the Director of Design at a fantasy sports startup called <a href="https://www.sportai.com" className={styles.linkButton}>SportAI</a>.
          Before that, I was a Full Stack Engineer at <a href="https://www.geico.com" className={styles.linkButton}>GEICO</a>. I'm a self-teacher and comedian at heart. Where others search for truth, I just search for laughs.
          <div className={styles.lineheight15}>
            <a
              target="_blank"
              href="mailto: danny.ohana@gmail.com"
              className={styles.linkButton}
            >
              <p>Email me</p>
            </a>
          </div>
        </p>
        <a
          target="_blank"
          href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
          className={styles.portfolioButton}
        >
          <p>
            View his work <span>{"->"}</span>
          </p>
        </a>
      </div>

      <figure className={styles.figureContainer}>
        <Image
          alt={"Monthly photo"}
          src={monthlyPhoto}
          width={1080}
          height={600}
          layout="intrinsic"
          priority
          objectFit="contain"
          quality={100}
        />
        <figcaption className={styles.figureText}>
          Monthly Photo #4. Prep after sunrise at Cocoa Beach Pier, Florida.
          (June 2022)
        </figcaption>
      </figure>
    </div>
  );
}

export default HomePage;
