import { writing } from "../data/writing";
import SubstackIcon, { isSubstackUrl } from "./SubstackIcon";
import styles from "./ReadNext.module.css";

export function getReadNextArticles(currentUrl, limit = 4) {
  const currentIndex = writing.findIndex((article) => article.url === currentUrl);

  if (currentIndex === -1) {
    return writing.slice(0, limit);
  }

  const articlesAfter = writing.slice(currentIndex + 1, currentIndex + 1 + limit);
  const remainingCount = limit - articlesAfter.length;

  if (remainingCount === 0) {
    return articlesAfter;
  }

  const articlesBefore = writing
    .slice(Math.max(0, currentIndex - remainingCount), currentIndex)
    .reverse();

  return [...articlesAfter, ...articlesBefore];
}

export default function ReadNext({ currentUrl }) {
  const articles = getReadNextArticles(currentUrl);

  if (articles.length === 0) return null;

  return (
    <aside className={styles.readNext} aria-labelledby="read-next-heading">
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.inner}>
        <h2 id="read-next-heading" className={styles.heading}>
          Read next
        </h2>
        <ul className={styles.list}>
          {articles.map((article) => {
            const isExternal = article.external !== false;

            return (
              <li className={styles.item} key={article.url}>
                <a
                  className={styles.link}
                  href={article.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <span className={styles.title}>
                    {article.title}
                    {isSubstackUrl(article.url) && (
                      <SubstackIcon className={styles.substackIcon} />
                    )}
                  </span>
                  {article.subtitle && (
                    <span className={styles.subtitle}>{article.subtitle}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
