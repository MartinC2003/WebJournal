import { auth } from "../../api/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import { useRouter } from 'next/navigation';  
import { Input } from "@mui/material";
import styles from '../styles/signup.module.css';

export const AuthSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          window.alert('User signed up successfully!'); 
          console.log(user);
          router.push('/');
        });
    } catch (error) {
      window.alert(`Sign up failed: ${error.message}`); 
      console.error("Sign up failed:", error.message);
    }
  };

  const inputStyle = {
    color: 'white',
    padding: '8px',
    marginBottom: '10px',
    width: '244px',
    borderRadius: '50px', 
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <form onSubmit={signUp}>
        <div className={styles.authInput}>
          <Input
            sx={inputStyle}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            sx={inputStyle}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className={styles.button}
            style={{ borderRadius: '50px' }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};
