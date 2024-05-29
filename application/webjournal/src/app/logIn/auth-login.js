import { useState } from 'react';
import { UserAuth } from '../../api/AuthContext';
import { useRouter } from 'next/navigation';  
import { Input } from '@mui/material';
import styles from '../styles/login.module.css';

export const AuthLogin = () => {
  const { onLogin } = UserAuth();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
      router.push('/');
    } catch (error) {
      console.error('Login failed', error);
      window.alert(`Login failed: ${error.message}`);
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
      <form onSubmit={handleSubmit}>
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
        <button
          className={styles.button}
          type="submit"
          style={{ cursor: 'pointer', borderRadius: '50px' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};
