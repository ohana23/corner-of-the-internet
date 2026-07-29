import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./ProfileHomeButton.module.css";

const LiquidMetal = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.LiquidMetal),
  { ssr: false },
);

export default function ProfileHomeButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateColorScheme = (event) => setIsDarkMode(event.matches);

    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateColorScheme);
    return () => mediaQuery.removeEventListener("change", updateColorScheme);
  }, []);

  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Go to home"
      onClick={() => {
        window.location.assign("/");
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src="/avatar.webp"
        alt=""
        width={60}
        height={60}
        priority
      />
      <span
        className={`${styles.shader} ${
          isHovered ? styles.shaderVisible : ""
        }`}
        aria-hidden="true"
      >
        <LiquidMetal
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          image="/safari-pinned-tab.svg"
          colorBack={isDarkMode ? "#D0D0D0" : "#E1E1E1"}
          colorTint="#00C2FF"
          repetition={4}
          softness={2}
          shiftRed={0}
          shiftBlue={0}
          distortion={2}
          contour={0.3}
          angle={120}
          speed={0.6}
          scale={0.9}
          fit="contain"
        />
      </span>
    </button>
  );
}
