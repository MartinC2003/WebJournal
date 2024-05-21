
import { useState } from 'react';
import { UserAuth } from '../../api/AuthContext';
import { useRouter } from 'next/navigation';  

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
    color: 'black',
    padding: '8px',
    marginBottom: '10px',
    width: '200px', 
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <form onSubmit={handleSubmit}>
        <input
          style={inputStyle}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          style={inputStyle}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button
          type="submit"
          style={{ padding: '10px 15px', cursor: 'pointer' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};
