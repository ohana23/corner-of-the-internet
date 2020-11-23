import { SearchCommand } from './SearchCommand'
import styles from './Navbar.module.css'

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.logoText}>Danny Ohana</div>
            <SearchCommand />
        </div>
    )
}

export default Navbar