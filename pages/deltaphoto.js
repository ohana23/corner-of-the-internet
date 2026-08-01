import Head from "next/head";
import { useEffect } from "react";
import { Deltaphoto } from "deltaphoto";
import ProfileHomeButton from "../components/ProfileHomeButton";
import SiteFooter from "../components/SiteFooter";
import ArticleHeader from "../components/ArticleHeader";
import ArticleTable from "../components/ArticleTable";
import styles from "../deltaphoto.module.css";

const basicExample = `import { Deltaphoto } from "deltaphoto";
import "deltaphoto/styles.css";

<Deltaphoto
  before="/room-before.jpg"
  after="/room-after.jpg"
/>`;

const customizedExample = `<Deltaphoto
  before="/kitchen-old.jpg"
  after="/kitchen-new.jpg"
  beforeLabel="Original"
  afterLabel="Renovated"
  initialPosition={38}
  aspectRatio="16 / 10"
  foregroundColor="#f7f3ea"
  backgroundColor="#1b1a18"
/>`;

const props = [
  ["before", "string", "required", "URL for the image shown on the left."],
  ["after", "string", "required", "URL for the image shown on the right."],
  ["beforeAlt", "string", '"Before"', "Alternative text for the before image."],
  ["afterAlt", "string", '"After"', "Alternative text for the after image."],
  ["beforeLabel", "string", '"Before"', "Label shown over the before image."],
  ["afterLabel", "string", '"After"', "Label shown over the after image."],
  ["showLabels", "boolean", "true", "Show or hide both image labels."],
  ["initialPosition", "number", "50", "Initial divider position from 0 to 100."],
  ["position", "number", "—", "Controlled divider position from 0 to 100."],
  ["onPositionChange", "function", "—", "Runs whenever the divider moves."],
  ["aspectRatio", "CSS value", '"3 / 2"', "Aspect ratio of the comparison surface."],
  ["objectFit", "CSS value", '"cover"', "How both images fit inside the surface."],
  ["foregroundColor", "CSS color", '"#000"', "Color used for the grip and component text."],
  ["backgroundColor", "CSS color", '"#fff"', "Color used for labels, the divider, and the handle."],
  ["ariaLabel", "string", "comparison description", "Accessible name for the range control."],
  ["className", "string", '""', "Class applied to the root element."],
];

function CodeBlock({ children, label }) {
  return (
    <figure className={styles.codeBlock}>
      {label && <figcaption>{label}</figcaption>}
      <pre>
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export default function DeltaphotoPage() {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <title>Deltaphoto — Danny Ohana</title>
        <meta
          name="description"
          content="A small, accessible image comparison component for React."
        />
        <link rel="canonical" href="https://www.dannyohana.com/deltaphoto" />
      </Head>

      <main className={styles.page}>
        <header className={styles.siteHeader}>
          <ProfileHomeButton />
        </header>

        <div className={styles.layout}>
          <article className={styles.article}>
            <section id="introduction" className={styles.hero}>
              <ArticleHeader
                eyebrow="July 31, 2026"
                title="Deltaphoto"
                summary="A small image comparison component for React. Give it two photos and it handles the rest."
              />

              <figure className={styles.demo}>
                <Deltaphoto
                  before="/deltaphoto/miami-night.png"
                  after="/deltaphoto/miami-day.png"
                  beforeAlt="Miami skyline at night"
                  afterAlt="Miami skyline during the day"
                  beforeLabel="Night"
                  afterLabel="Day"
                  ariaLabel="Compare the Miami skyline at night and during the day"
                />
                <figcaption>Drag the divider, or use Toggle to switch views.</figcaption>
              </figure>

              <p>
                I kept needing the same interaction: compare a redesign, show a
                restoration, explain an edit, or make a visual change obvious
                without asking someone to flip between two images. The available
                components worked, but most of them felt like unfinished
                plumbing rather than something I wanted to put on a page.
              </p>
              <p>
                So I made the version I wanted to reach for: deliberately small,
                already designed, and useful without a setup screen full of
                decisions.
              </p>
            </section>

            <hr />

            <section id="getting-started">
              <h2>Getting started</h2>
              <p>
                The finished API is only two required props. Everything else is
                an optional refinement for a particular comparison.
              </p>
              <div className={styles.statusCard}>
                <span className={styles.statusDot} aria-hidden="true" />
                <div>
                  <strong>Deltaphoto</strong>
                  <span>The package is bundled locally while its npm release is prepared.</span>
                </div>
              </div>
              <CodeBlock label="Example.tsx">{basicExample}</CodeBlock>
              <p>
                It fills the width of its parent and keeps a 3:2 aspect ratio by
                default. The component ships with its interaction styles, so the
                surrounding layout is entirely yours.
              </p>
            </section>

            <hr />

            <section id="interaction">
              <h2>The interaction</h2>
              <p>
                The divider is built on a native range input, with a quick Toggle
                control for switching between the two images. That means the same
                comparison works with a mouse, a finger, a trackpad, and a keyboard
                instead of maintaining a separate path for each one.
              </p>
              <div className={styles.detailGrid}>
                <div>
                  <h3>Drag anywhere</h3>
                  <p>The full image is the target, not just the small handle.</p>
                </div>
                <div>
                  <h3>Scroll naturally</h3>
                  <p>Vertical page movement stays available on touch screens.</p>
                </div>
                <div>
                  <h3>Keyboard stops</h3>
                  <p>Arrow keys jump cleanly between the start, middle, and end.</p>
                </div>
                <div>
                  <h3>Smooth drag</h3>
                  <p>The divider eases toward the pointer without lagging behind it.</p>
                </div>
                <div>
                  <h3>Quick toggle</h3>
                  <p>Jump between the two images when you only need the difference.</p>
                </div>
              </div>
            </section>

            <hr />

            <section id="making-it-yours">
              <h2>Making it yours</h2>
              <p>
                The defaults are meant to be the version you ship. The options
                are there for real content differences—labels, framing, and
                controlled state—not for rebuilding the component piece by piece.
              </p>
              <CodeBlock label="Custom labels and framing">
                {customizedExample}
              </CodeBlock>
              <p>
                Pass a class name or normal inline styles to the root when the
                comparison needs a different radius or surrounding treatment.
                Both images always share the same crop, which keeps the comparison
                visually honest.
              </p>
            </section>

            <hr />

            <section id="props">
              <h2>Props</h2>
              <ArticleTable ariaLabel="Deltaphoto component props">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {props.map(([name, type, defaultValue, description]) => (
                    <tr key={name}>
                      <th scope="row"><code>{name}</code></th>
                      <td><code>{type}</code></td>
                      <td><code>{defaultValue}</code></td>
                      <td>{description}</td>
                    </tr>
                  ))}
                </tbody>
              </ArticleTable>
              <p className={styles.tableNote}>
                Standard div attributes, including data attributes and event
                handlers, are passed to the root element.
              </p>
            </section>

            <hr />

            <section id="package-status" className={styles.finalSection}>
              <h2>Package status</h2>
              <p>
                The component is working and packaged locally. I am using it on
                this page before publishing it more broadly—the best way to find
                the awkward edges is to depend on it yourself.
              </p>
              <p>
                The npm release is still to come. Until then, this page is the
                source of truth for what the component is meant to do.
              </p>
            </section>
          </article>
        </div>

        <div className={styles.footerWrap}>
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
