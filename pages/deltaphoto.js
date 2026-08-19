import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Deltaphoto } from "deltaphoto";
import ProfileHomeButton from "../components/ProfileHomeButton";
import ReadNext from "../components/ReadNext";
import ArticleHeader from "../components/ArticleHeader";
import styles from "../deltaphoto.module.css";

const basicExample = `import { Deltaphoto } from "deltaphoto";
import "deltaphoto/styles.css";

<Deltaphoto
  before="/room-before.jpg"
  after="/room-after.jpg"
/>`;

const installExample = "npm install deltaphoto";

const initialPlaygroundValues = {
  beforeAlt: "Miami skyline at night",
  afterAlt: "Miami skyline during the day",
  beforeLabel: "Night",
  afterLabel: "Day",
  showLabels: true,
  initialPosition: 50,
  aspectRatio: "3 / 2",
  objectFit: "cover",
  foregroundColor: "#373737",
  backgroundColor: "#e6e6e6",
  ariaLabel: "Compare the Miami skyline at night and during the day",
};

function escapeProp(value) {
  return JSON.stringify(value);
}

function makePlaygroundExample(values) {
  const lines = [
    'import { Deltaphoto } from "deltaphoto";',
    'import "deltaphoto/styles.css";',
    "",
    "<Deltaphoto",
    '  before="https://www.dannyohana.com/deltaphoto/miami-night.png"',
    '  after="https://www.dannyohana.com/deltaphoto/miami-day.png"',
    `  beforeAlt=${escapeProp(values.beforeAlt)}`,
    `  afterAlt=${escapeProp(values.afterAlt)}`,
    `  beforeLabel=${escapeProp(values.beforeLabel)}`,
    `  afterLabel=${escapeProp(values.afterLabel)}`,
    `  ariaLabel=${escapeProp(values.ariaLabel)}`,
  ];

  if (!values.showLabels) lines.push("  showLabels={false}");
  if (values.initialPosition !== 50) lines.push(`  initialPosition={${values.initialPosition}}`);
  if (values.aspectRatio !== "3 / 2") lines.push(`  aspectRatio=${escapeProp(values.aspectRatio)}`);
  if (values.objectFit !== "cover") lines.push(`  objectFit=${escapeProp(values.objectFit)}`);
  if (
    values.foregroundColor !== initialPlaygroundValues.foregroundColor ||
    values.backgroundColor !== initialPlaygroundValues.backgroundColor
  ) {
    lines.push(`  foregroundColor=${escapeProp(values.foregroundColor)}`);
    lines.push(`  backgroundColor=${escapeProp(values.backgroundColor)}`);
  }
  lines.push("/>");
  return lines.join("\n");
}

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

const propGroups = [
  {
    name: "Images",
    props: ["before", "after"],
  },
  {
    name: "Labels & accessibility",
    props: ["beforeAlt", "afterAlt", "beforeLabel", "afterLabel", "showLabels", "ariaLabel"],
  },
  {
    name: "Position & state",
    props: ["initialPosition", "position", "onPositionChange"],
  },
  {
    name: "Appearance",
    props: ["aspectRatio", "objectFit", "foregroundColor", "backgroundColor"],
  },
  {
    name: "Integration",
    props: ["className"],
  },
].map((group) => ({
  ...group,
  props: group.props.map((name) => props.find((prop) => prop[0] === name)),
}));

const interactionDetails = [
  {
    title: "Drag anywhere",
    description: "The full image is the target, not just the small handle.",
    icon: "drag",
  },
  {
    title: "Scroll naturally",
    description: "It's mobile friendly, so it doesn't get in the way of touch screens when trying to scroll.",
    icon: "scroll",
  },
  {
    title: "Keyboard stops",
    description: "Arrow keys jump cleanly between the start, middle, and end.",
    icon: "keyboard",
  },
  {
    title: "Smooth drag",
    description: "The divider beautifully eases toward where you dragged it.",
    icon: "smooth",
  },
  {
    title: "Quick toggle",
    description: "Instantly swap between the two images to quickly see the differences.",
    icon: "toggle",
  },
];

function PhotoFrame({ className = styles.iconPanel, x = 13, y = 9 }) {
  return <rect className={className} x={x} y={y} width="62" height="42" rx="8" />;
}

function InteractionIcon({ type }) {
  return (
    <div className={`${styles.interactionIcon} ${styles[type]}`} aria-hidden="true">
      {type === "drag" && (
        <svg viewBox="0 0 88 72">
          <PhotoFrame />
          <path className={styles.iconScene} d="M18 43 28 33l8 7 10-12 23 19H18Z" />
          <g className={styles.dragDivider}>
            <line className={styles.iconDivider} x1="44" y1="11" x2="44" y2="49" />
            <circle className={styles.iconHandle} cx="44" cy="30" r="5" />
          </g>
          <path className={styles.dragPointer} d="m49 35 3 17 4-5 5 8 4-3-5-8 7-1Z" />
        </svg>
      )}
      {type === "scroll" && (
        <svg viewBox="0 0 88 72">
          <defs>
            <clipPath id="scroll-icon-window">
              <rect x="15" y="11" width="58" height="38" rx="6" />
            </clipPath>
          </defs>
          <PhotoFrame />
          <g clipPath="url(#scroll-icon-window)">
            <g className={styles.scrollContent}>
              <rect className={styles.iconSceneBlock} x="18" y="13" width="22" height="12" rx="3" />
              <line className={styles.iconSoftLine} x1="18" y1="31" x2="68" y2="31" />
              <line className={styles.iconSoftLine} x1="18" y1="38" x2="58" y2="38" />
              <rect className={styles.iconSceneBlock} x="18" y="44" width="50" height="12" rx="3" />
            </g>
          </g>
          <line className={styles.iconDivider} x1="44" y1="11" x2="44" y2="49" />
          <g className={styles.scrollIndicator}>
            <line className={styles.iconStrongLine} x1="84" y1="15" x2="84" y2="45" />
            <path className={styles.iconStrongLine} d="m79 20 5-6 5 6M79 41l5 6 5-6" />
          </g>
        </svg>
      )}
      {type === "keyboard" && (
        <svg viewBox="0 0 88 72">
          <PhotoFrame />
          <line className={styles.iconSoftLine} x1="20" y1="30" x2="68" y2="30" />
          <circle className={styles.iconStop} cx="20" cy="30" r="3" />
          <circle className={styles.iconStop} cx="44" cy="30" r="3" />
          <circle className={styles.iconStop} cx="68" cy="30" r="3" />
          <g className={styles.keyboardDivider}>
            <line className={styles.iconDivider} x1="44" y1="11" x2="44" y2="49" />
            <circle className={styles.iconHandle} cx="44" cy="30" r="5" />
          </g>
          <g className={styles.keyLeft}>
            <rect className={styles.iconKey} x="24" y="55" width="18" height="14" rx="4" />
            <path className={styles.iconKeyMark} d="m35 59-4 3 4 3" />
          </g>
          <g className={styles.keyRight}>
            <rect className={styles.iconKey} x="47" y="55" width="18" height="14" rx="4" />
            <path className={styles.iconKeyMark} d="m54 59 4 3-4 3" />
          </g>
        </svg>
      )}
      {type === "smooth" && (
        <svg viewBox="0 0 88 72">
          <PhotoFrame />
          <path className={styles.smoothTrail} d="M18 38c12-25 30 18 52-14" />
          <g className={styles.smoothDivider}>
            <line className={styles.iconDivider} x1="44" y1="11" x2="44" y2="49" />
            <circle className={styles.iconHandle} cx="44" cy="30" r="5" />
          </g>
          <path className={styles.smoothPointer} d="m48 19 3 17 4-5 5 8 4-3-5-8 7-1Z" />
        </svg>
      )}
      {type === "toggle" && (
        <svg viewBox="0 0 88 72">
          <g className={styles.toggleBefore}>
            <PhotoFrame className={styles.iconPanelRear} x={7} y={13} />
            <circle className={styles.iconSun} cx="23" cy="27" r="5" />
            <path className={styles.iconSceneLine} d="m13 46 12-11 9 7 10-12 19 18" />
          </g>
          <g className={styles.toggleAfter}>
            <PhotoFrame x={19} y={7} />
            <circle className={styles.iconMoon} cx="61" cy="20" r="7" />
            <path className={styles.iconSceneLine} d="m25 40 11-9 9 7 10-11 20 15" />
          </g>
          <rect className={styles.toggleTrack} x="33" y="59" width="24" height="11" rx="5.5" />
          <circle className={styles.toggleKnob} cx="39" cy="64.5" r="4" />
        </svg>
      )}
    </div>
  );
}

function highlightLine(line, language) {
  const tokens = [];
  const pattern = language === "shell"
    ? /(\bnpm\b)|(\binstall\b)|(\bdeltaphoto\b)/g
    : /("[^"]*"|'[^']*')|\b(import|from|export|const|let|return)\b|(<\/?)([A-Z][\w.]*)|(\b[A-Za-z_][\w-]*)(?==)|(\b[A-Z][A-Za-z0-9_]*\b)|(\b\d+\b)|([{}[\]();=<>/])/g;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push(line.slice(cursor, match.index));
    }

    if (language === "shell") {
      const className = match[1]
        ? styles.tokenCommand
        : match[2]
          ? styles.tokenKeyword
          : styles.tokenString;
      tokens.push(<span className={className} key={match.index}>{match[0]}</span>);
    } else if (match[1]) {
      tokens.push(<span className={styles.tokenString} key={match.index}>{match[0]}</span>);
    } else if (match[2]) {
      tokens.push(<span className={styles.tokenKeyword} key={match.index}>{match[0]}</span>);
    } else if (match[3] && match[4]) {
      tokens.push(
        <span className={styles.tokenPunctuation} key={`${match.index}-punctuation`}>{match[3]}</span>,
        <span className={styles.tokenTag} key={`${match.index}-tag`}>{match[4]}</span>
      );
    } else if (match[5]) {
      tokens.push(<span className={styles.tokenProperty} key={match.index}>{match[0]}</span>);
    } else if (match[6]) {
      tokens.push(<span className={styles.tokenTag} key={match.index}>{match[0]}</span>);
    } else if (match[7]) {
      tokens.push(<span className={styles.tokenNumber} key={match.index}>{match[0]}</span>);
    } else {
      tokens.push(<span className={styles.tokenPunctuation} key={match.index}>{match[0]}</span>);
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < line.length) {
    tokens.push(line.slice(cursor));
  }

  return tokens;
}

function CodeBlock({ children, label }) {
  const [copied, setCopied] = useState(false);
  const code = String(children);
  const language = label === "Terminal" ? "shell" : "jsx";
  const lines = code.split("\n");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <figure className={styles.codeBlock}>
      <figcaption>
        <span>{label || "Code"}</span>
        <button type="button" onClick={copyCode} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre>
        <code>
          {lines.map((line, index) => (
            <span className={styles.codeLine} key={index}>
              <span className={styles.lineNumber} aria-hidden="true">{index + 1}</span>
              <span className={styles.lineContent}>{highlightLine(line, language)}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

function SegmentedControl({ label, ariaLabel = label, value, options, onChange, className = "" }) {
  return (
    <div className={`${styles.segmentedField} ${className}`.trim()}>
      {label && <span className={styles.fieldLabel}>{label}</span>}
      <div className={styles.segmentedControl} role="group" aria-label={ariaLabel}>
        {options.map((option) => (
          <button
            type="button"
            className={value === option.value ? styles.segmentedSelected : ""}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DeltaphotoPlayground() {
  const [values, setValues] = useState(initialPlaygroundValues);
  const [pictureInPicturePhase, setPictureInPicturePhase] = useState("idle");
  const previewSlotRef = useRef(null);
  const pictureInPicturePhaseRef = useRef("idle");
  const pictureInPictureExitTimerRef = useRef(null);

  useEffect(() => {
    let frame = null;
    const desktop = window.matchMedia("(min-width: 841px)");

    function setPictureInPictureVisible(shouldBeVisible) {
      const currentPhase = pictureInPicturePhaseRef.current;

      if (shouldBeVisible) {
        if (pictureInPictureExitTimerRef.current !== null) {
          window.clearTimeout(pictureInPictureExitTimerRef.current);
          pictureInPictureExitTimerRef.current = null;
        }

        if (currentPhase !== "visible") {
          pictureInPicturePhaseRef.current = "visible";
          setPictureInPicturePhase("visible");
        }
        return;
      }

      if (currentPhase === "visible") {
        pictureInPicturePhaseRef.current = "exiting";
        setPictureInPicturePhase("exiting");
        pictureInPictureExitTimerRef.current = window.setTimeout(() => {
          pictureInPicturePhaseRef.current = "idle";
          pictureInPictureExitTimerRef.current = null;
          setPictureInPicturePhase("idle");
        }, 180);
      }
    }

    function updatePictureInPicture() {
      frame = null;
      const previewSlot = previewSlotRef.current;
      const section = previewSlot?.closest("section");

      if (!desktop.matches || !previewSlot || !section) {
        setPictureInPictureVisible(false);
        return;
      }

      const previewRect = previewSlot.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const previewHasPassed = previewRect.bottom <= 16;
      const sectionStillContainsPreview = sectionRect.bottom > window.innerHeight - 24;

      setPictureInPictureVisible(previewHasPassed && sectionStillContainsPreview);
    }

    function requestUpdate() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updatePictureInPicture);
    }

    updatePictureInPicture();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    desktop.addEventListener("change", requestUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      if (pictureInPictureExitTimerRef.current !== null) {
        window.clearTimeout(pictureInPictureExitTimerRef.current);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      desktop.removeEventListener("change", requestUpdate);
    };
  }, []);

  function setValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function changeColor(name, value) {
    setValue(name, value);
  }

  const example = makePlaygroundExample(values);
  const pictureInPictureClassName = pictureInPicturePhase === "idle"
    ? ""
    : ` ${styles.playgroundPreviewPip} ${
        pictureInPicturePhase === "exiting"
          ? styles.playgroundPreviewPipExiting
          : styles.playgroundPreviewPipVisible
      }`;

  function renderDeltaphotoPreview() {
    return (
      <Deltaphoto
        before="/deltaphoto/miami-night.png"
        after="/deltaphoto/miami-day.png"
        position={values.initialPosition}
        onPositionChange={(position) => setValue("initialPosition", Math.round(position))}
        beforeAlt={values.beforeAlt}
        afterAlt={values.afterAlt}
        beforeLabel={values.beforeLabel}
        afterLabel={values.afterLabel}
        showLabels={values.showLabels}
        aspectRatio={values.aspectRatio}
        objectFit={values.objectFit}
        foregroundColor={values.foregroundColor}
        backgroundColor={values.backgroundColor}
        ariaLabel={values.ariaLabel}
      />
    );
  }

  return (
    <div className={styles.playground}>
      <div className={styles.playgroundPreviewSlot} ref={previewSlotRef} style={{ aspectRatio: values.aspectRatio }}>
        <div
          className={`${styles.playgroundPreview} ${styles.playgroundPreviewInline}${
            pictureInPicturePhase === "visible" ? ` ${styles.playgroundPreviewInlineHidden}` : ""
          }`}
          aria-hidden={pictureInPicturePhase !== "idle"}
          inert={pictureInPicturePhase !== "idle" ? "" : undefined}
        >
          {renderDeltaphotoPreview()}
        </div>
        {pictureInPicturePhase !== "idle" && (
          <div className={`${styles.playgroundPreview}${pictureInPictureClassName}`}>
            <span className={styles.pictureInPictureLabel}>Live preview</span>
            {renderDeltaphotoPreview()}
          </div>
        )}
      </div>

      <aside className={styles.propertyMenu} aria-label="Deltaphoto properties">
        <div className={styles.propertyMenuHeader}>
          <div>
            <h3>Customize the example</h3>
            <p>Changes update the preview and code.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setValues(initialPlaygroundValues);
            }}
          >
            Reset
          </button>
        </div>

        <div className={styles.propertyMenuBody}>
          <div className={styles.propertySection}>
            <h4>Colors</h4>
            <div className={styles.colorFields}>
              {["foregroundColor", "backgroundColor"].map((name) => (
                <label className={styles.colorField} key={name}>
                  <span className={styles.fieldLabel}>{name === "foregroundColor" ? "Foreground" : "Background"}</span>
                  <span className={styles.colorInputGroup}>
                    <input aria-label={`${name} color picker`} type="color" value={values[name]} onChange={(event) => changeColor(name, event.target.value)} />
                    <input aria-label={`${name} value`} value={values[name]} onChange={(event) => changeColor(name, event.target.value)} />
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.propertySection}>
            <h4>Labels</h4>
            {["beforeLabel", "afterLabel"].map((name) => (
              <label className={styles.textField} key={name}>
                <span className={styles.fieldLabel}>{name === "beforeLabel" ? "Before label" : "After label"}</span>
                <input value={values[name]} onChange={(event) => setValue(name, event.target.value)} />
              </label>
            ))}
            <label className={styles.switchField}>
              <span>Show labels <code>showLabels</code></span>
              <input type="checkbox" checked={values.showLabels} onChange={(event) => setValue("showLabels", event.target.checked)} />
              <span className={styles.switchTrack} aria-hidden="true" />
            </label>
          </div>

          <div className={`${styles.propertySection} ${styles.layoutSection}`}>
            <h4>Layout</h4>
            <div className={styles.layoutControls}>
              <SegmentedControl
                label="Aspect ratio"
                value={values.aspectRatio}
                options={[
                  { value: "1 / 1", label: "1:1" },
                  { value: "4 / 3", label: "4:3" },
                  { value: "3 / 2", label: "3:2" },
                  { value: "16 / 9", label: "16:9" },
                ]}
                onChange={(value) => setValue("aspectRatio", value)}
              />
              <SegmentedControl
                label="Image fit"
                value={values.objectFit}
                options={[
                  { value: "cover", label: "Cover" },
                  { value: "contain", label: "Contain" },
                  { value: "fill", label: "Fill" },
                ]}
                onChange={(value) => setValue("objectFit", value)}
              />
              <label className={styles.positionField}>
                <span className={styles.fieldLabel}>
                  Starting position
                  <output>{values.initialPosition}%</output>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={values.initialPosition}
                  aria-label="Starting position"
                  onChange={(event) => setValue("initialPosition", Number(event.target.value))}
                />
              </label>
            </div>
          </div>

          <details className={styles.advancedSection}>
            <summary>Accessibility <span>Advanced</span></summary>
            <div className={styles.advancedFields}>
              {[
                ["beforeAlt", "Before image description"],
                ["afterAlt", "After image description"],
                ["ariaLabel", "Component accessible description"],
              ].map(([name, label]) => (
                <label className={styles.textField} key={name}>
                  <span className={styles.fieldLabel}>{label} <code>{name}</code></span>
                  <input value={values[name]} onChange={(event) => setValue(name, event.target.value)} />
                </label>
              ))}
            </div>
          </details>
        </div>
      </aside>

      <div className={styles.playgroundCode}>
        <CodeBlock label="Your Deltaphoto.tsx">{example}</CodeBlock>
      </div>
    </div>
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
                <figcaption>Drag the divider or use "Toggle" to switch views.</figcaption>
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
                  <span>Available now on <a href="https://www.npmjs.com/package/deltaphoto">npm</a>.</span>
                </div>
              </div>
              <CodeBlock label="Terminal">{installExample}</CodeBlock>
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
                The divider is built on a native range input, with a quick toggle
                control for switching between the two images. That means the same
                comparison works with a mouse, a finger, a trackpad, and a keyboard
                instead of maintaining a separate path for each one.
              </p>
              <div className={styles.interactionRail}>
                {interactionDetails.map((detail) => (
                  <div className={styles.interactionDetail} key={detail.title}>
                    <InteractionIcon type={detail.icon} />
                    <h3>{detail.title}</h3>
                    <p>{detail.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr />

            <section id="making-it-yours">
              <h2>Making it yours</h2>
              <p>
                The defaults are meant to be the version you ship. The options
                are there for real content differences (labels, framing, and
                controlled state). Not for rebuilding the component piece by piece.
              </p>
              <p>
                Try this playground to fill in the details you want to ship with.
                The codeblock below will update accordingly, so you can copy and
                paste that into your project.
              </p>
              <DeltaphotoPlayground />
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
              <div className={styles.propGroups}>
                {propGroups.map((group) => (
                  <div className={styles.propGroup} key={group.name}>
                    <h3>{group.name}</h3>
                    <dl className={styles.propList}>
                      {group.props.map(([name, type, defaultValue, description]) => (
                        <div className={styles.propRow} key={name}>
                          <dt className={styles.propName}><code>{name}</code></dt>
                          <dd className={styles.propMeta}><code>{type}</code></dd>
                          <dd className={styles.propMeta}><code>{defaultValue}</code></dd>
                          <dd className={styles.propDescription}>{description}</dd>
                        </div>
                      ))}
                    </dl>
                    {group.name === "Integration" && (
                      <p className={styles.propGroupNote}>
                        Standard div attributes, including data attributes and event
                        handlers, are passed to the root element.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <hr />

            <section id="package-status" className={styles.finalSection}>
              <h2>Package status</h2>
              <p>
                Deltaphoto is available as a public npm package for React. Install
                it with <code>npm install deltaphoto</code>, then import the
                component and its stylesheet into your app.
              </p>
              <p>
                This page remains the source of truth for how the component is
                meant to work.
              </p>
            </section>
          </article>
        </div>

      </main>

      <ReadNext currentUrl="/deltaphoto" />
    </>
  );
}
