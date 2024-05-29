'use client';
import React from 'react';
import { AuthLogin } from './auth-login';
import styles from '../styles/login.module.css'
export default function LogIn(){

    return (
    <div className={styles.gridContainer}>
        <div className={styles.loginContainer}>
            <div className={styles.loginInput}>
                <AuthLogin/>
            </div>
            <div className={styles.loginDisplay}>
            </div>
        </div>
    </div>
    );
}
