import { useEffect, useMemo, useRef, useState } from "react";
import artifactStyles from "../artifacts.module.css";
import styles from "../styles.module.css";
import stackStyles from "../stack.module.css";
import { stack } from "../data/stack";

function StackPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const tableWrapRef = useRef(null);
  const sortedStack = useMemo(
    () => [...stack].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("loaded");
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const updateStickyState = () => {
      const tableWrap = tableWrapRef.current;
      if (!tableWrap) return;
      const { top, bottom } = tableWrap.getBoundingClientRect();
      const sticky = top <= 0 && bottom > 0;
      setIsHeaderSticky((prev) => (prev === sticky ? prev : sticky));
    };

    updateStickyState();
    window.addEventListener("scroll", updateStickyState, { passive: true });
    window.addEventListener("resize", updateStickyState);

    return () => {
      window.removeEventListener("scroll", updateStickyState);
      window.removeEventListener("resize", updateStickyState);
    };
  }, []);

  return (
    <div className={isLoaded ? stackStyles.loaded : ""}>
      <div className={artifactStyles.header}>
        <a href="/" className={artifactStyles.backButton} aria-label="Back to home">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 14 4 9 9 4"></polyline>
            <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
          </svg>
        </a>
      </div>

      <div className={stackStyles.stackSection}>
        <h1 className={styles.name}>Stack</h1>

        <div
          ref={tableWrapRef}
          className={`${stackStyles.tableWrap} ${
            isHeaderSticky ? stackStyles.headerSticky : ""
          }`}
        >
          <table className={stackStyles.table}>
            <thead>
              <tr>
                <th>name</th>
                <th>description</th>
                <th>platforms</th>
              </tr>
            </thead>
            <tbody>
              {sortedStack.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td>
                    <span className={stackStyles.nameCell}>
                      <span className={stackStyles.logoSquare} aria-hidden="true">
                        <img
                          src={item.appIcon || item.logo}
                          alt=""
                          className={stackStyles.logoImage}
                          loading="lazy"
                          onError={(e) => {
                            const img = e.currentTarget;
                            const currentSrc = img.getAttribute("src");
                            const fallbackChain = [
                              item.appIcon,
                              item.logo,
                              item.logoFallback,
                            ].filter(Boolean);
                            const currentIndex = fallbackChain.indexOf(currentSrc);
                            const nextSrc = fallbackChain[currentIndex + 1];

                            if (nextSrc) {
                              img.src = nextSrc;
                              return;
                            }
                            img.style.display = "none";
                            const fallback = img.nextElementSibling;
                            if (fallback) fallback.style.display = "inline-flex";
                          }}
                        />
                        <span className={stackStyles.logoFallback}>
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      </span>
                      <span>{item.name}</span>
                    </span>
                  </td>
                  <td>{item.description}</td>
                  <td>{item.platforms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StackPage;
