import styles from "../styles.module.css";

function HomePage() {
  return (
    <body className={styles.body}>
      <p className={styles.description}>
        <strong>Danny Ohana</strong> is the Director of Design at SportAI. After
        graduating with a Computer Science degree, he moved to Washington D.C.
        to become a Frontend Engineer at GEICO. Now he’s back in Orlando and is
        open to design and engineering jobs.
      </p>
      <a
        target="_blank"
        href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
      >
        <p className={styles.portfolioButton}>
          View his portfolio <span>{"->"}</span>
        </p>
      </a>
    </body>
  );
}

export default HomePage;
