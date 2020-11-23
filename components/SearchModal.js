import * as React from 'react'
import { motion } from 'framer-motion'
import styles from './SearchModal.module.css'

export const SearchModal = () => {
    const active = false;

    return (
        <motion.div
            className={styles.searchModal}
        >
            hello
        </motion.div>
    )
}