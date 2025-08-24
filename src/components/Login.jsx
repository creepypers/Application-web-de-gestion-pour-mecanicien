import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login } from '../store/slices/authSlice';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

library.add(faEnvelope, faLock);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/client-dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.get('https://dummyjson.com/c/945f-407b-4cc5-82e3');
      const { users } = response.data;

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        dispatch(login({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.userType,
          dateOfBirth: user.dateOfBirth
        }));
        navigate(user.userType === 'mechanic' ? '/mechanic-dashboard' : '/client-dashboard');
      } else {
        setError("Email ou mot de passe invalide");
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card p-4 mt-5">
          <h2 className="text-center mb-4">Connexion</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon="envelope" /></span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe:</label>
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon="lock" /></span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
}
