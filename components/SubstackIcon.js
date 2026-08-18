import { useId } from "react";
import Tooltip from "./Tooltip";

export function isSubstackUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname === "substack.com" || hostname.endsWith(".substack.com");
  } catch {
    return false;
  }
}

export default function SubstackIcon({ className }) {
  const tooltipId = useId();

  return (
    <Tooltip
      className={className}
      content="This link takes you to Substack."
      id={tooltipId}
    >
      <svg viewBox="0 0 20 20" role="img" aria-label="Substack">
        <circle cx="10" cy="10" r="10" fill="#fff0e8" />
        <path
          fill="#ff6719"
          d="M5.5 5.25h9v1.2h-9v-1.2Zm0 2.15h9v1.2h-9V7.4Zm0 2.15h9v5.2L10 12.22 5.5 14.75v-5.2Z"
        />
      </svg>
    </Tooltip>
  );
}
