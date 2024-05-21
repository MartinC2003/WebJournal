
import { auth } from "../../api/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import { useRouter } from 'next/navigation';  

export const AuthSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) =>{
        const user = userCredential.user;
        window.alert('User signed up successfully!'); 
        console.log(user);
      });
    } catch (error) {
      window.alert(` Sign up failed: ${error.message}`); 
      console.error("Sign up failed:", error.message);
    }
  };

  const buttonStyle = {
    padding: '10px 15px', 
    cursor: 'pointer' 
  };
  
  
  
  const inputStyle = {
    color: 'black',
    marginBottom: '10px',
    padding: '8px',
  };
    
  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <form>
        <div>
          <input
            style={inputStyle}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            style={inputStyle}
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button onClick={signUp} style={buttonStyle}>Sign Up</button>
        </div>
      </form>
    </div>
  );
  
};
