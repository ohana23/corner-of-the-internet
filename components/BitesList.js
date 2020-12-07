import * as React from "react";
import { BiteItem } from "./BiteItem";
import styles from "./styles/BitesList.module.css";

export const BitesList = () => {
  return (
    <div className={styles.center}>
      <div className={styles.title}>Bites</div>
      <div className={styles.subtitle}>
        Short version of the thoughts I'm having right now.
      </div>
      <ul className={styles.ul}>
        <BiteItem
          primaryText={
            "Steve Jobs helped brainstorm name ideas for the first Mac browser."
          }
          regularText={
            "Instead of Safari, he came up with Thunder and Freedom."
          }
        />
        <BiteItem
          primaryText={
            "Currently stranded behind 7 in. of flooded water in the drivethrough."
          }
          regularText={"How often is this going to happen in the future?"}
        />
        <BiteItem
          primaryText={"I need good iOS app design tutorials!"}
          regularText={
            "There are plenty of web design tutorials, but I’m stranded on apps."
          }
        />
      </ul>
    </div>
  );
};
