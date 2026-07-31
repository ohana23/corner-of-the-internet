import styles from "./ArticleTable.module.css";

export default function ArticleTable({ ariaLabel, children }) {
  return (
    <div className={styles.wrap} tabIndex="0" role="region" aria-label={ariaLabel}>
      <table>{children}</table>
    </div>
  );
}
