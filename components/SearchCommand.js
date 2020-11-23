import * as React from 'react'
import { motion } from 'framer-motion'
import styles from './SearchCommand.module.css'

const button = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    pressed: { scale: 0.95 }
};

export const SearchCommand = () => {
    return (
        <motion.div
            className={styles.searchCommand}
            onClick={() => console.log("hello")} // requires a callback to SearchModal to toggle active/inactive
            variants={button}
            initial="rest"
            whileHover="hover"
            whileTap="pressed"
        >
        </motion.div>
    );
}