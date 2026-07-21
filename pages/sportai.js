import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../sportai.module.css";
import {
  sportAiGalleryGroups,
  sportAiMeta,
  sportAiNav,
  sportAiReviews,
  sportAiSections,
} from "../data/sportai";

function ArrowIcon() {
  return (
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
      <polyline points="9 14 4 9 9 4" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

function MediaFigure({ image, layout }) {
  const figureClass = [
    styles.figure,
    styles[`figure_${image.layout || layout || "default"}`],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={figureClass}>
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
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
          {block.segments.map((segment, index) =>
            segment.href ? (
              <a
                href={segment.href}
                target="_blank"
                rel="noopener noreferrer"
                key={`${segment.href}-${index}`}
              >
                {segment.text}
              </a>
            ) : (
              <span key={`${segment.text}-${index}`}>{segment.text}</span>
            ),
          )}
        </p>
      );
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "numberedList":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "pullquote":
      return <p className={styles.pullquote}>{block.text}</p>;
    case "principles":
      return (
        <div className={styles.principles}>
          {block.items.map((item) => (
            <p key={item.title}>
              <strong>{item.title}</strong> {item.text}
            </p>
          ))}
        </div>
      );
    case "note":
      return (
        <aside className={styles.note}>
          <span aria-hidden="true">💡</span>
          <p>
            <strong>{block.title}</strong> {block.text}
          </p>
        </aside>
      );
    case "image":
      return <MediaFigure image={block} />;
    case "imageGroup":
      return (
        <div className={`${styles.imageGroup} ${styles[`imageGroup_${block.layout}`]}`}>
          {block.images.map((image) => (
            <MediaFigure image={image} layout={block.layout} key={image.src} />
          ))}
        </div>
      );
    default:
      return null;
  }
}

function SportAiPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(sportAiNav[0].id);
  const anchorNavRef = useRef(null);
  const pendingSectionRef = useRef(null);

  const handleSectionNavigation = (event, sectionId) => {
    event.preventDefault();

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    pendingSectionRef.current = sectionId;
    setActiveSection(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
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
      }

      const activeId = sportAiNav.reduce((currentId, item) => {
        const section = document.getElementById(item.id);

        return section && section.getBoundingClientRect().top <= activationLine
          ? item.id
          : currentId;
      }, sportAiNav[0].id);

      setActiveSection(activeId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  return (
    <>
      <Head>
        <title>Building SportAI — Danny Ohana</title>
        <meta
          name="description"
          content="How Danny Ohana designed and built SportAI, a direct-to-consumer fantasy sports product powered by Score+."
        />
        <meta property="og:title" content="Building SportAI — Danny Ohana" />
        <meta
          property="og:description"
          content="Designing and building a fantasy sports product around SportAI’s predictive Score+ model."
        />
        <meta property="og:image" content="/sportai/hero.webp" />
      </Head>

      <div className={`${styles.page} ${isLoaded ? styles.loaded : ""}`}>
        <header className={styles.siteHeader}>
          <a href="/" className={styles.backLink} aria-label="Back to home">
            <ArrowIcon />
          </a>
        </header>

        <main>
          <header className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{sportAiMeta.eyebrow}</p>
              <h1>{sportAiMeta.title}</h1>
              <p className={styles.summary}>{sportAiMeta.summary}</p>
              <a
                className={styles.resourceLink}
                href="https://sportai.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                sportai.io <span aria-hidden="true">↗</span>
              </a>
            </div>
            <dl className={styles.metadata}>
              {sportAiMeta.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <figure className={styles.heroMedia}>
            <img
              src="/sportai/hero.webp"
              alt="SportAI logo on a black gradient background"
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
              {sportAiNav.map((item) => (
                <a
                  href={`#${item.id}`}
                  className={
                    activeSection === item.id ? styles.anchorNavActive : undefined
                  }
                  aria-current={activeSection === item.id ? "location" : undefined}
                  onClick={(event) => handleSectionNavigation(event, item.id)}
                  key={item.id}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <article className={styles.article}>
            {sportAiSections.map((section) => (
              <section id={section.id} className={styles.caseSection} key={section.id}>
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

            <section id="more-work" className={styles.moreWork}>
              <section className={styles.reviews} aria-labelledby="reviews-title">
                <h3 id="reviews-title">App Store Reviews</h3>
                <div className={styles.reviewGrid}>
                  {sportAiReviews.map((review) => (
                    <blockquote key={review}>{review}</blockquote>
                  ))}
                </div>
              </section>

              {sportAiGalleryGroups.map((group) => (
                <section className={styles.galleryGroup} key={group.id}>
                  <h3>{group.title}</h3>
                  <div className={styles.galleryGrid}>
                    {group.items.map((item) => (
                      <figure
                        className={item.featured ? styles.galleryFeatured : ""}
                        key={`${group.id}-${item.src}`}
                      >
                        <img
                          src={item.src}
                          alt={item.alt}
                          loading="lazy"
                          decoding="async"
                        />
                        <figcaption>{item.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </section>
          </article>
        </main>

        <footer className={styles.footer}>
          <a href="/">Back to Danny&apos;s corner of the internet</a>
          <a href="mailto:danny.ohana@gmail.com">Send a message</a>
        </footer>
      </div>
    </>
  );
}

export default SportAiPage;
