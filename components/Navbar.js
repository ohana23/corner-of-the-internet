import styles from "./styles/Navbar.module.css";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = (props) => {
  const { isActive } = props;

  const collapsedVariants = {
    opacity: 0,
    transform: "translateY(20px)",
  };

  const openVariants = {
    opacity: 1,
    transform: "translateY(0px)",
  };

  const collapsedVariants2 = {
    opacity: 0,
  };

  return (
    <div className={styles.navbar}>
      <AnimatePresence initial={false}>
        {!isActive ? (
          <motion.div
            className={styles.logoText}
            variants={{
              collapsed: collapsedVariants,
              open: openVariants,
            }}
            animate="open"
            initial="collapsed"
            exit="collapsed"
            transition={{ duration: 0.33, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            Danny Ohana
          </motion.div>
        ) : (
          <motion.input
            autoFocus
            className={styles.navInput}
            type="text"
            placeholder="Search"
            variants={{
              collapsed: collapsedVariants2,
              open: openVariants,
            }}
            animate="open"
            initial="collapsed"
            exit="collapsed"
            transition={{ duration: 0.33, ease: [0.04, 0.62, 0.23, 0.98] }}
          ></motion.input>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
