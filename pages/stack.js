import { useEffect, useMemo, useRef, useState } from "react";
import artifactStyles from "../artifacts.module.css";
import stackStyles from "../stack.module.css";
import { stack } from "../data/stack";

function StackPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [platformFilter, setPlatformFilter] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const tableWrapRef = useRef(null);
  const sortedStack = useMemo(
    () => [...stack].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const filteredStack = useMemo(
    () =>
      platformFilter
        ? sortedStack.filter((item) =>
            item.platforms
              .split(", ")
              .some((p) => p.toLowerCase() === platformFilter),
          )
        : sortedStack,
    [sortedStack, platformFilter],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("loaded");
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    const handleClick = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  useEffect(() => {
    const updateStickyState = () => {
      const tableWrap = tableWrapRef.current;
      if (!tableWrap) return;

      const stickyOffsetValue = window
        .getComputedStyle(tableWrap)
        .getPropertyValue("--sticky-offset");
      const stickyOffset = Number.parseFloat(stickyOffsetValue) || 0;
      const thresholdBuffer = 2;
      const { top, bottom } = tableWrap.getBoundingClientRect();
      setIsHeaderSticky((prev) => {
        const activationBottom = stickyOffset + thresholdBuffer;
        const deactivationBottom = stickyOffset - thresholdBuffer;
        const bottomThreshold = prev ? deactivationBottom : activationBottom;
        const sticky = top <= stickyOffset && bottom > bottomThreshold;
        return prev === sticky ? prev : sticky;
      });
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
        <nav className={artifactStyles.pageNav} aria-label="Primary">
          <a
            href="/"
            className={`${artifactStyles.pageNavLink} ${artifactStyles.pageNavBack}`}
            aria-label="Back to home"
          >
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
            href="https://dannyohana.notion.site/1dd82f4365844b1fa4f9f278779715c2?v=308033fb2d8a4f878d0809a901db5c33"
            className={artifactStyles.pageNavLink}
          >
            Work
          </a>
          <a href="/artifacts" className={artifactStyles.pageNavLink}>
            Artifacts
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://dannyohana.substack.com/"
            className={artifactStyles.pageNavLink}
          >
            Writing
          </a>
          <a href="/stack" className={artifactStyles.pageNavLink}>
            Stack
          </a>
        </nav>
      </div>

      <div className={stackStyles.stackSection}>
        <h1 className={stackStyles.pageTitle}>Stack</h1>

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
                <th>
                  <div
                    ref={filterRef}
                    className={stackStyles.platformFilterWrap}
                  >
                    <button
                      className={stackStyles.platformFilterButton}
                      onClick={() => setFilterOpen((prev) => !prev)}
                    >
                      {platformFilter || "platforms"}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: filterOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.15s ease",
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {filterOpen && (
                      <div className={stackStyles.platformDropdown}>
                        {[
                          {
                            label: "macOS",
                            key: "macos",
                            cls: stackStyles.platformMacOS,
                          },
                          {
                            label: "iOS",
                            key: "ios",
                            cls: stackStyles.platformIOS,
                          },
                          {
                            label: "Physical",
                            key: "physical",
                            cls: stackStyles.platformPhysical,
                          },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            className={`${stackStyles.platformPill} ${opt.cls} ${
                              platformFilter === opt.key
                                ? stackStyles.platformPillActive
                                : ""
                            }`}
                            onClick={() => {
                              setPlatformFilter((prev) =>
                                prev === opt.key ? null : opt.key,
                              );
                              setFilterOpen(false);
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStack.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td>
                    <span className={stackStyles.nameCell}>
                      <span
                        className={stackStyles.logoSquare}
                        aria-hidden="true"
                      >
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
                            const currentIndex =
                              fallbackChain.indexOf(currentSrc);
                            const nextSrc = fallbackChain[currentIndex + 1];

                            if (nextSrc) {
                              img.src = nextSrc;
                              return;
                            }
                            img.style.display = "none";
                            const fallback = img.nextElementSibling;
                            if (fallback)
                              fallback.style.display = "inline-flex";
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
                  <td>
                    <span className={stackStyles.platformPills}>
                      {item.platforms.split(", ").map((platform) => {
                        const key = platform.toLowerCase().replace(/\s/g, "");
                        const pillClass =
                          key === "macos"
                            ? stackStyles.platformMacOS
                            : key === "ios"
                              ? stackStyles.platformIOS
                              : key === "physical"
                                ? stackStyles.platformPhysical
                                : "";
                        return (
                          <span
                            key={platform}
                            className={`${stackStyles.platformPill} ${pillClass}`}
                          >
                            {platform}
                          </span>
                        );
                      })}
                    </span>
                  </td>
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
