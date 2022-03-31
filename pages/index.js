import styles from "../styles.module.css";

function HomePage() {
  return (
    <div>
      <p className={styles.description}>
        <strong>Danny Ohana</strong> is currently the Director of Design at a
        fantasy data startup called SportAI. After graduating with a Computer
        Science degree, he moved to D.C. to become a Full Stack Engineer at
        GEICO. He was born and raised in South Florida, is passionate about
        foolproof software, and loves a good joke.
      </p>
      <a
        target="_blank"
        href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
      >
        <p className={styles.portfolioButton}>
          View his portfolio <span>{"->"}</span>
        </p>
      </a>
    </div>
  );
}

export default HomePage;
