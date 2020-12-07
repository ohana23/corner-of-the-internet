// Content

import * as React from "react";
import { BitesList } from "./BitesList";
import styles from "./styles/Content.module.css";

export const Content = (props) => {
  return (
    <>
      <section className={styles.fit}>
        <BitesList />
      </section>
    </>
  );
};
