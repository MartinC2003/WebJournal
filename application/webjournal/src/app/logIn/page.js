'use client';
import React from 'react';
import { AuthLogin } from './auth-login';
import styles from '../styles/login.module.css'
import Image from 'next/image'; 
import { Container } from '@mui/material';

export default function LogIn(){

    return (
        <Container>
            <div className={styles.App}>
                <div className={styles.LoginContainer}>
                    <div className={styles.LoginTitleContainer}>
                        <p className={styles.LoginTitle}>L</p>
                        <p className={styles.LoginTitle}>O</p>
                        <p className={styles.LoginTitle}>G</p>
                        <p className={styles.LoginTitle}>I</p>
                        <p className={styles.LoginTitle}>N</p>
                    </div>
                    <div className={styles.imageContainer}>
                        <Image 
                        src='/login/loginimg-plc.png' 
                        alt="Log in image" 
                        className={styles.image} 
                        width={415} 
                        height={835}
                        />
                    </div>
                    <div className={styles.LoginInput}>
                        <p>
                            Please log in to continue
                        </p>
                        <AuthLogin/>
                    </div>
                </div>
            </div>
        </Container>

    );
}
