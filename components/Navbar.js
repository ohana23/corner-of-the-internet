import { SearchCommand } from "./SearchCommand";
import styles from "./styles/Navbar.module.css";
import { motion } from "framer-motion";

const Navbar = (props) => {
  const { isActive } = props;

  return (
    <div className={styles.navbar}>
      {!isActive ? (
        <div className={styles.logoText}>Danny Ohana</div>
      ) : (
        <input
          autoFocus
          className={styles.navInput}
          type="text"
          placeholder="Filter"
        />
      )}
      <SearchCommand onSearchCommandExecute={props.onSearchCommandExecute} />
    </div>
  );
};

export default Navbar;
