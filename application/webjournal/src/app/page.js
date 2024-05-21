'use client'
import React, { useEffect } from 'react';
import { UserAuth } from '@/api/AuthContext';
import { useRouter } from 'next/navigation';  

export default function Home() {
  
  const { user } = UserAuth();
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/signUp');  
  };

  const handleLogin = () => {
    router.push('/logIn');  
  };

  const handleViewProfile = () => {
    router.push('/profile');  
  };
  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const gridContainerStyle = {
    display: 'grid',
    height: '100vh',
    backgroundColor: '#ebdfbc',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    padding: '50px',
    columnGap: '10px',
    rowGap: '10px'
  };
  

  const imageStyle = {
    gridArea: '1 / 1 / 5 / 3',
    backgroundImage: 'url("/HomepageIMG1.jpg")',
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundColor: 'blue', // Fallback background color
    borderRadius: '10px',
  };
  
  
  const descriptionStyle = {
    gridArea: '1 / 3 / 5 / 5',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'repeat(3, 1fr)', 
    color: '#3a6139',
  };
  
  const descriptionTitleStyle = {
    gridArea: '1 / 1 / 2 / 5',
    paddingLeft:"20px",
    paddingBottom: '20px',
    paddingTop: '20px',
    fontSize: '100px'
  }
  const descriptionDescriptionStyle = {
    gridArea: '2 / 1 / 3 / 5',
    fontSize: '25px',
    paddingLeft:"20px",

  }

  const buttonContainerStyle = {
    gridArea: '3 / 1 / 4 / 5',
    display: 'flex',
    gap: '10px',
    paddingLeft:"50px",
  };
  
  const buttonStyle = {
    padding: '10px',
    height: '60px',
    width: '250px',
    fontSize: '20px',
    backgroundColor: '#3a6139',
    justifySelf: 'start',
    color: 'white',
    cursor: 'pointer',
    alignSelf: 'start',   
    margin: 'auto 0', 
    borderRadius: '10px',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',  

  };
  
  const welcomeContainerStyle = {
    gridArea: '1 / 1 / 5 / 5',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  const welcomeTextStyle = {
    fontSize: '36px',
    marginBottom: '20px'
  };
  
  const welcomeButtonContainerStyle = {
    display: 'flex',
    gap: '10px'
  };
  
  const welcomeButtonStyle = {
    padding: '10px',
    fontSize: '20px',
    backgroundColor: '#3a6139',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '10px',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div style={gridContainerStyle}>
      {!user? (
        <>
          <div style={imageStyle}>
          </div>
          <div style={descriptionStyle}>
            <div style={descriptionTitleStyle}>
              WebJournal 
            </div>
            <div style={descriptionDescriptionStyle}>
            WebJournal is your online space to express, reflect, and document your thoughts, experiences, and memories. 
            Whether you want to capture the highlights of your day, explore your dreams, or simply jot down your reflections, 
            WebJournal provides a secure and private platform for you.
            </div>
            <div style={buttonContainerStyle}>
              <button onClick={handleSignUp} style={buttonStyle}>Sign Up</button>
              <button onClick={handleLogin} style={buttonStyle}>Login</button>
            </div>
          </div>
        </>
      ): (
        <div style={welcomeContainerStyle}>
          <p style={welcomeTextStyle}>Welcome, {user.displayName}!</p>
          <div style={welcomeButtonContainerStyle}>
            <button  style={welcomeButtonStyle}>View Profile</button>
            <button style={welcomeButtonStyle}>Sign out</button>
          </div>
        </div>
    )}
    </div>
  );
}
