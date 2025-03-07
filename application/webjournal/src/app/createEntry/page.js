'use client';
import { motion } from 'framer-motion';
import { UserAuth } from '../../api/AuthContext';
import styles from '../styles/createentry.module.css';
import NewEntry from './create-entry';

const CreateEntryPage = () => {
    const { user } = UserAuth();

    if (!user) {
        return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}  
        className={styles.app}
        >                
            <p>Please log in to create an entry.</p>
        </motion.div>
        );
    }

    return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}  
    className={styles.app}
    >
        <NewEntry />
    </motion.div>
    );
}

export default CreateEntryPage;
