import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./SearchModal.module.css";

const SearchModal = (props) => {
  const { isActive } = props;

  return (
    <div>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            variants={{
              hidden: () => ({
                height: 0,
                opacity: 0,
                display: "none", // this needs to be delayed so i may this a function in hopes that that's the right approach
              }),
              visible: {
                height: 100,
                opacity: 1,
                display: "block", // this should be fine as instant
              },
            }}
            className={styles.searchModal}
            animate="visible"
            initial="hidden"
            exit="hidden"
          >
            hello
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchModal;
