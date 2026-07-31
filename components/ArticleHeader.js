import styles from "./ArticleHeader.module.css";

export default function ArticleHeader({ eyebrow, title, summary, children }) {
  return (
    <div className={styles.header}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {summary && <p className={styles.summary}>{summary}</p>}
      {children}
    </div>
  );
}
