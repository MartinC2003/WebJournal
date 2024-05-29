'use client'
import React from 'react';
import { AuthSignUp } from './auth-signup';
import styles from '../styles/signup.module.css'
import { Container } from '@mui/material';
import Image from 'next/image'; 
export default function SignUp(){

    return (
        <Container>
            <div className={styles.App}>
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
                            src='/login/SIGNUPimg-plc.png' 
                            alt="Log in image" 
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
            </div>
        </Container>

    );
}
