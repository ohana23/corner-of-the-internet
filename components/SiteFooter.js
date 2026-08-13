import { useEffect, useState } from "react";
import styles from "../styles.module.css";

const hometownTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
});

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://x.com/ohanaspeaking",
  },
  {
    label: "GitHub",
    href: "https://github.com/ohana23",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/danielohana/",
  },
];

export default function SiteFooter() {
  const [hometownTime, setHometownTime] = useState(null);

  useEffect(() => {
    const updateHometownTime = () => setHometownTime(new Date());

    updateHometownTime();
    const interval = window.setInterval(updateHometownTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <footer className={styles.hometownTime} aria-label="Local time">
      {hometownTime && (
        <span>
          <time dateTime={hometownTime.toISOString()}>
            {hometownTimeFormatter.format(hometownTime)}
          </time>{" "}
          in Ft. Lauderdale, Florida
        </span>
      )}
      <a href="mailto:danny.ohana@gmail.com">Send a message</a>
      <nav className={styles.onlineLinks} aria-label="Social profiles">
        {socialLinks.map((link) => (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            key={link.label}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
