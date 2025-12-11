import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../utils/AuthContext';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true); 
  const navigate = useNavigate();
  const {login}=useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (isLoginView) {
        
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

       console.log(`Mock Login Success for: ${email}`);
        
        login({ email }); 
        
        navigate('/dashboard'); 

    } else {
        
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill all fields to register.");
            return;
        }
        
        if (password !== confirmPassword) {
            alert("Passwords do not match. Fix your logic.");
            return;
        }
        
        console.log(`Mock Registration Success for: ${email}`);
        login({ email });
        
        navigate('/dashboard');
    }
};
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '450px' }}>
        <h3 className="text-center mb-4">
            {isLoginView ? 'Student Login' : 'New User Registration'}
        </h3>
        
        <form onSubmit={handleAuthSubmit}>
          {!isLoginView && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@college.edu" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {!isLoginView && (
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}
          
          <button type="submit" className="btn btn-primary w-100 mt-2">
            {isLoginView ? 'Login' : 'Register Account'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          <a href="#" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Need an account? Register Here.' : 'Already have an account? Login.'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;