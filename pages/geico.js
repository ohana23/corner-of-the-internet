import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../sportai.module.css";
import ProfileHomeButton from "../components/ProfileHomeButton";
import SiteFooter from "../components/SiteFooter";
import { geicoMeta, geicoNav, geicoSections } from "../data/geico";

function RichText({ segments }) {
  return segments.map((segment, index) => {
    const content = segment.strong ? (
      <strong>{segment.text}</strong>
    ) : (
      segment.text
    );

    return segment.href ? (
      <a
        href={segment.href}
        target="_blank"
        rel="noopener noreferrer"
        key={`${segment.href}-${index}`}
      >
        {content}
      </a>
    ) : (
      <span key={`${segment.text}-${index}`}>{content}</span>
    );
  });
}

function MediaFigure({ media }) {
  const figureClass = [
    styles.figure,
    styles[`figure_${media.layout || "default"}`],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={figureClass}>
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        decoding="async"
      />
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "richParagraph":
      return (
        <p>
          <RichText segments={block.segments} />
        </p>
      );
    case "richList":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={`list-item-${index}`}>
              <RichText segments={item} />
            </li>
          ))}
        </ul>
      );
    case "nestedRichList":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={`nested-list-item-${index}`}>
              <RichText segments={item.segments} />
              {item.children && (
                <ul>
                  {item.children.map((child, childIndex) => (
                    <li key={`nested-list-item-${index}-${childIndex}`}>
                      <RichText segments={child} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );
    case "richNumberedList":
      return (
        <ol>
          {block.items.map((item, index) => (
            <li key={`numbered-list-item-${index}`}>
              <RichText segments={item} />
            </li>
          ))}
        </ol>
      );
    case "image":
      return <MediaFigure media={block} />;
    default:
      return null;
  }
}

function GeicoPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(geicoNav[0].id);
  const anchorNavRef = useRef(null);
  const pendingSectionRef = useRef(null);
  const sectionAlignmentObserverRef = useRef(null);

  const handleSectionNavigation = (event, sectionId) => {
    event.preventDefault();

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    pendingSectionRef.current = sectionId;
    setActiveSection(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);

    sectionAlignmentObserverRef.current?.disconnect();

    const article = section.closest("article");

    if (article && "ResizeObserver" in window) {
      const observer = new ResizeObserver(() => {
        if (pendingSectionRef.current !== sectionId) {
          return;
        }

        const targetOffset = Number.parseFloat(
          window.getComputedStyle(section).scrollMarginTop,
        );
        const distance = section.getBoundingClientRect().top - targetOffset;

        if (Math.abs(distance) > 24) {
          window.scrollTo({
            top: window.scrollY + distance,
            behavior: "auto",
          });
        }
      });

      observer.observe(article);
      sectionAlignmentObserverRef.current = observer;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    document.body.classList.add("loaded");
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const navigation = anchorNavRef.current;
    const activeLink = navigation?.querySelector(
      `[href="#${activeSection}"]`,
    );

    if (!navigation || !activeLink) {
      return;
    }

    navigation.scrollTo({
      behavior: "smooth",
      left:
        activeLink.offsetLeft -
        (navigation.clientWidth - activeLink.offsetWidth) / 2,
    });
  }, [activeSection]);

  useEffect(() => {
    const updateActiveSection = () => {
      const activationLine = Math.min(
        256,
        Math.max(96, window.innerHeight * 0.3),
      );
      const pendingSection = pendingSectionRef.current;

      if (pendingSection) {
        const target = document.getElementById(pendingSection);
        const targetOffset = target
          ? Number.parseFloat(window.getComputedStyle(target).scrollMarginTop)
          : 0;

        if (
          target &&
          Math.abs(target.getBoundingClientRect().top - targetOffset) > 24
        ) {
          setActiveSection(pendingSection);
          return;
        }

        pendingSectionRef.current = null;
        sectionAlignmentObserverRef.current?.disconnect();
        sectionAlignmentObserverRef.current = null;
      }

      const activeId = geicoNav.reduce((currentId, item) => {
        const section = document.getElementById(item.id);

        return section && section.getBoundingClientRect().top <= activationLine
          ? item.id
          : currentId;
      }, geicoNav[0].id);

      setActiveSection(activeId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  useEffect(
    () => () => sectionAlignmentObserverRef.current?.disconnect(),
    [],
  );

  return (
    <>
      <Head>
        <title>Working at GEICO — Danny Ohana</title>
        <meta
          name="description"
          content="Danny Ohana’s work in full-stack engineering, design advocacy, and team leadership at GEICO."
        />
        <meta property="og:title" content="Working at GEICO — Danny Ohana" />
        <meta
          property="og:description"
          content="Full-stack engineering, design advocacy, and team leadership across GEICO’s customer and employee experiences."
        />
        <meta property="og:image" content="/artifacts/geico.webp" />
      </Head>

      <div className={`${styles.page} ${isLoaded ? styles.loaded : ""}`}>
        <main>
          <header className={styles.hero}>
            <div className={styles.profileHomeButton}>
              <ProfileHomeButton />
            </div>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{geicoMeta.eyebrow}</p>
              <h1>{geicoMeta.title}</h1>
              <p className={styles.summary}>{geicoMeta.summary}</p>
            </div>
            <dl className={styles.metadata}>
              {geicoMeta.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <figure className={styles.heroMedia}>
            <img
              src="/artifacts/geico.webp"
              alt="GEICO report-a-claim experience showing visual answer cards"
              loading="eager"
              decoding="async"
            />
          </figure>

          <nav
            className={styles.anchorNav}
            aria-label="Case study sections"
            ref={anchorNavRef}
          >
            <div>
              {geicoNav.map((item) => (
                <a
                  href={`#${item.id}`}
                  className={
                    activeSection === item.id
                      ? styles.anchorNavActive
                      : undefined
                  }
                  aria-current={
                    activeSection === item.id ? "location" : undefined
                  }
                  onClick={(event) =>
                    handleSectionNavigation(event, item.id)
                  }
                  key={item.id}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <article className={styles.article}>
            {geicoSections.map((section) => (
              <section
                id={section.id}
                className={styles.caseSection}
                key={section.id}
              >
                <div className={styles.sectionHeading}>
                  <h2>{section.title}</h2>
                </div>
                <div className={styles.sectionContent}>
                  {section.blocks.map((block, index) => (
                    <ContentBlock
                      block={block}
                      key={`${section.id}-${block.type}-${index}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </main>

        <div className={styles.siteFooter}>
          <SiteFooter />
        </div>
      </div>
    </>
  );
}

export default GeicoPage;
