import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const AuthPage = () => {
  // 1. Define the missing state variables
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between Login/Register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Import hooks
  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  // 3. Handle Form Submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    console.log("1. Submitting form..."); 
    
    const userData = { email, password };
    if (!isLoginView) userData.name = name;

    let response;
    if (isLoginView) {
      response = await loginUser(userData);
    } else {
      response = await registerUser(userData);
    }

    console.log("2. Response received:", response); 

    if (response.success) {
      console.log("3. Login Success! Checking Local Storage..."); 

      const user = JSON.parse(localStorage.getItem('userInfo'));
      console.log("4. User found in storage:", user); 

      if (user.role === 'admin') {
        console.log("5. Redirecting to Admin..."); 
        navigate('/dashboard');
      } else {
        console.log("5. Redirecting to Dashboard..."); 
        navigate('/dashboard');
      }
    } else {
      console.log("❌ Login Failed:", response.error);
      alert(response.error || 'Something went wrong');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">
          {isLoginView ? 'Login' : 'New User Registration'}
        </h3>

        <form onSubmit={handleAuthSubmit}>
          {/* Name Field - Only show if Registering */}
          {!isLoginView && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLoginView}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isLoginView ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? "Don't have an account? Register" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;