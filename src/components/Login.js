import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    console.log('Backend response:', res.data);
    auth.setToken(res.data.token);
    console.log('Saved token:', auth.getToken());
    navigate('/dashboard');
  } catch (err) {
  console.error('Login error:', err.response?.data || err.message);
  setError(err.response?.data?.message || 'Login failed');
}

};


  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">Login</button>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
