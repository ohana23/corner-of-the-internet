import { SearchCommand } from "./SearchCommand";
import styles from "./styles/Navbar.module.css";

const Navbar = (props) => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logoText}>Danny Ohana</div>
      <SearchCommand onSearchCommandExecute={props.onSearchCommandExecute} />
    </div>
  );
};

export default Navbar;