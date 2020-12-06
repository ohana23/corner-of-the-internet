// Modal with search results.

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./styles/SearchModal.module.css";

const SearchModal = (props) => {
  const { isActive } = props;
  
  const hiddenVariants = {
    height: 0,
    opacity: 0,
    display: "none"
  }
  
  const visibleVariants = {
    height: "50vh",
    opacity: 1,
    display: "block"
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            variants={{
              hidden: hiddenVariants,
              visible: visibleVariants,
            }}
            className={styles.searchModal}
            animate="visible"
            initial="hidden"
            exit="hidden"
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
