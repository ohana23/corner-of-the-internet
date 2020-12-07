// Modal with search results.

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./styles/SearchModal.module.css";

const SearchModal = (props) => {
  const { isActive } = props;

  const collapsedVariants = {
    // height: 0,
    opacity: 0,
  };

  const openVariants = {
    // height: "50vh",
    opacity: 1,
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            variants={{
              collapsed: collapsedVariants,
              open: openVariants,
            }}
            className={styles.searchModal}
            animate="open"
            initial="collapsed"
            exit="collapsed"
            transition={{ duration: 0.33, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className={styles.section}>
              <div className={styles.title}>Projects</div>
              <div className={styles.result}>SportAI</div>
              <div className={styles.result}>ABB</div>
            </div>
            <div className={styles.section}>
              <div className={styles.title}>Writing</div>
              <div className={styles.result}>To be or not to be</div>
              <div className={styles.result}>Moving to Orlando</div>
              <div className={styles.result}>Leaving D.C.</div>
            </div>
            <div className={styles.section}>
              <div className={styles.title}>Socials</div>
              <div className={styles.result}>Instagram</div>
              <div className={styles.result}>Twitter</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchModal;
