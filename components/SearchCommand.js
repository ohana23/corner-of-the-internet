// Button to toggle the search modal dropdown.

import * as React from "react";
import { motion } from "framer-motion";
import styles from "./styles/SearchCommand.module.css";
import searchIcon from "../pages/assets/icons/search.svg";

const button = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
  pressed: { scale: 0.95 },
};

export const SearchCommand = (props) => {
  return (
    <motion.div
      className={styles.searchCommand}
      onClick={props.onSearchCommandExecute}
      variants={button}
      initial="rest"
      whileHover="hover"
      whileTap="pressed"
      transition={{ duration: 0.04 }}
    >
      <img draggable="false" src={searchIcon} />
    </motion.div>
  );
};
