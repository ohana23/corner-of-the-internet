import * as React from "react";
import styles from "./styles/BiteItem.module.css";

export const BiteItem = (props) => {
  const { primaryText, regularText } = props;

  return (
    <>
      <li className={styles.li}>
        <b>{primaryText}</b> {regularText}
      </li>
    </>
  );
};
