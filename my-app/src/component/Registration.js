import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser({ username, password, email });
      if (response.status === 201) {
        navigate('/login');
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">
          <span className="highlight">Re</span>gister
        </h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="submit-button">Register Now</button>
          <p className="login-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f2f5;
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
        .error-message {
          color: red;
          font-size: 14px;
          margin-bottom: 15px;
          text-align: center;
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
        .login-text {
          text-align: center;
          font-size: 16px;
          margin-top: 20px;
        }
        .login-text a {
          color: #007bff;
          text-decoration: none;
        }
        .login-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Registration;
