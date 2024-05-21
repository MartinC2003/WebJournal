'use client';
import React from 'react';
import { AuthLogin } from './auth-login';
export default function LogIn(){

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

    const LogInContainerStyle = {
        gridArea: '2 / 2 / 6 / 5',
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gridTemplateRows: 'repeat(4,1fr)',

    }
    const LogInInputStyle = {
        gridArea: '1 / 3 / 5 / 5',
        backgroundColor:"red",

    }
    const LogInDisplayStyle = {
        gridArea: '1 / 1 / 5 / 3',
        backgroundColor:"yellow",

    }
    return (
    <div style={gridContainerStyle}>
        <div style={LogInContainerStyle}>
            <div style={LogInInputStyle}>
                <AuthLogin/>
            </div>
            <div style={LogInDisplayStyle}>
            </div>
        </div>
        
    </div>
    );
}