import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser({ username, password });
      localStorage.setItem('access_token', response.data.access);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error); // Log error for debugging
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">
          <span className="highlight">Lo</span>gin
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="additional-options">
            <div className="remember-me">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe"> Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>
          <button type="submit" className="submit-button">Login Now</button>
          <p className="register-text">
            Don’t have an account? <a href="/register">Sign up now</a>
          </p>
        </form>
      </div>

      <style jsx>{`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color:#f0f2f5;
  }
  .form-container {
    width: 350px;
    padding: 30px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  .form-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .highlight {
    border-bottom: 2px solid #007bff;
    padding-bottom: 2px;
  }
  .input-group {
    position: relative;
    margin-bottom: 20px;
  }
  .icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
  }
  input {
    width: 100%;
    padding: 10px 10px 10px 35px;
    border: none;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    font-size: 16px; /* Increased font size */
    outline: none;
  }
  input:focus {
    border-bottom: 1px solid #007bff;
  }
  .additional-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
  }
  .remember-me {
    display: flex;
    align-items: center;
  }
  .remember-me input {
    margin-right: 5px;
  }
  .forgot-password {
    color: #007bff;
    text-decoration: none;
  }
  .submit-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .submit-button:hover {
    background-color: #0056b3;
  }
  .register-text {
    text-align: center;
    font-size: 16px;
    margin-top: 20px;
  }
  .register-text a {
    color: #007bff;
    text-decoration: none;
  }
  .register-text a:hover {
    text-decoration: underline;
  }
`}</style>


    </div>
  );
};

export default Login;
