import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signUp } from '../store/slices/authSlice'; // Make sure to create this action in your authSlice

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("client");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      dispatch(signUp({ error: "Les mots de passe ne correspondent pas" }));
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      role: userType
    };

    const resultAction = await dispatch(signUp(userData));
    if (signUp.fulfilled.match(resultAction)) {
      navigate(userType === 'mechanic' ? '/mechanic-dashboard' : '/client-dashboard');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card p-4 mt-5">
          <h2 className="text-center mb-4">Inscription</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Prénom:</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Nom:</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
              <label htmlFor="dateOfBirth" className="form-label">Date de naissance:</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
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
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe:</label>
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon="lock" /></span>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="userType" className="form-label">Type d'utilisateur:</label>
              <select
                className="form-select"
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="client">Client</option>
                <option value="mechanic">Mécanicien</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isLoading}>
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
