'use client'
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from '../styles/signup.module.css';
import { AuthSignUp } from './auth-signup';
export default function SignUp(){

    return (
        <Container>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}  
            className={styles.app}
            >   
                <div className={styles.SignUpContainer}>
                        <div className={styles.SignupTitleContainer}>
                            <p className={styles.SignupTitle}>S</p>
                            <p className={styles.SignupTitle}>I</p>
                            <p className={styles.SignupTitle}>G</p>
                            <p className={styles.SignupTitle}>N</p>
                            <p className={styles.SignupTitle}>U</p>
                            <p className={styles.SignupTitle}>P</p>
                        </div>
                        <div className={styles.imageContainer}>
                            <Image 
                            src='/login/signupimg-plc.png' 
                            alt="Sign up image" 
                            className={styles.image} 
                            width={415} 
                            height={835}
                            />
                        </div>
                        <div className={styles.SignupInput}>
                            <p>
                                Sign in to get started  
                            </p>
                            <AuthSignUp/>
                        </div>
                </div>
            </motion.div>
        </Container>
    );
}
