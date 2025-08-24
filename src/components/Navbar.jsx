import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.user?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">AutoConnect</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FontAwesomeIcon icon="home" className="me-1" /> Accueil
              </Link>
            </li>
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FontAwesomeIcon icon="sign-in-alt" className="me-1" /> Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    <FontAwesomeIcon icon="user-plus" className="me-1" /> S'inscrire
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <FontAwesomeIcon icon="user" className="me-1" /> Profil
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>
                    <FontAwesomeIcon icon="sign-out-alt" className="me-1" /> Déconnexion
                  </button>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={userRole === 'mechanic' ? "/mechanic-dashboard" : "/client-dashboard"}>
                    <FontAwesomeIcon icon="dashboard" className="me-1" /> Tableau de bord
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
