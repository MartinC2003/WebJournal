'use client'
import React from 'react';
import { AuthSignUp } from './auth-signup';
import styles from '../styles/signup.module.css'

export default function SignUp(){

    return (
    <div className={styles.gridContainer}>
        <div className={styles.signupContainer}>
            <div className={styles.signupInput}>
                <AuthSignUp/>
            </div>
            <div className={styles.signupDisplay}>
            </div>
        </div>
    </div>
    );
}
