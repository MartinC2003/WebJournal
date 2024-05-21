'use client';
import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '../components/navbar';
import { AuthContextProvider } from "../api/AuthContext";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={inter.href} />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <AuthContextProvider>
=            <Navbar />
            {children}
=        </AuthContextProvider>
      </body>
    </html>
  );
}
