import { cloneElement } from "react";
import styles from "./Tooltip.module.css";

export default function Tooltip({
  children,
  content,
  id,
  className = "",
  shake = false,
  tooltipKey,
}) {
  return (
    <span className={`${styles.tooltipWrap} ${className}`.trim()}>
      {cloneElement(children, { "aria-describedby": id })}
      <span
        key={tooltipKey}
        className={`${styles.tooltip} ${shake ? styles.tooltipShake : ""}`.trim()}
        id={id}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
