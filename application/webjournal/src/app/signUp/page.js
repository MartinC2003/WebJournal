'use client';
import React from 'react';
import { AuthSignUp } from './auth-signup';
export default function SignUp(){

    const gridContainerStyle = {
        display: 'grid',
        height: '100vh',
        backgroundColor: '#ebdfbc',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        padding: '10px',
        columnGap: '10px',
        rowGap: '10px'
      };

    const SignUpContainerStyle = {
        gridArea: '2 / 2 / 6 / 5',
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gridTemplateRows: 'repeat(4,1fr)',

    }
    const SignUpInputStyle = {
        gridArea: '1 / 3 / 5 / 5',
        backgroundColor:"red",

    }
    const SignUpDisplayStyle = {
        gridArea: '1 / 1 / 5 / 3',
        backgroundColor:"yellow",

    }
    return (
    <div style={gridContainerStyle}>
        <div style={SignUpContainerStyle}>
            <div style={SignUpInputStyle}>
                <AuthSignUp/>
            </div>
            <div style={SignUpDisplayStyle}>
            </div>
        </div>
        
    </div>
    );
}