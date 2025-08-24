import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateUser } from '../store/slices/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(editedUser));
    setIsEditing(false);
  };

  if (!user) {
    return <div>Chargement des données utilisateur...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Profil Utilisateur</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={editedUser.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={editedUser.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary me-2">Enregistrer les modifications</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Annuler</button>
                </form>
              ) : (
                <>
                  <h5 className="card-title">{user.firstName} {user.lastName}</h5>
                  <p className="card-text"><FontAwesomeIcon icon="envelope" className="me-2" />Email: {user.email}</p>
                  <p className="card-text"><FontAwesomeIcon icon="user" className="me-2" />Rôle: {user.role === 'mechanic' ? 'Mécanicien' : 'Client'}</p>
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    <FontAwesomeIcon icon="edit" className="me-2" />Modifier le profil
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
