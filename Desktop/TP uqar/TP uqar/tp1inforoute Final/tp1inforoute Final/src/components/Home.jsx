import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow" style={{backgroundColor: '#ECDFCC'}}>
            <div className="card-body text-center p-5">
              <h1 className="card-title display-4 mb-4 fw-bold" style={{color: '#181C14'}}>Bienvenue sur AutoConnect</h1>
              <p className="card-text lead mb-4 fst-italic" style={{color: '#3C3D37'}}>Votre solution tout-en-un pour la réparation et l'entretien automobile.</p>
              <hr className="my-4" style={{backgroundColor: '#697565', height: '2px', opacity: '0.5'}} />
              <p className="card-text mb-4" style={{color: '#3C3D37'}}>
                Rejoignez notre communauté pour :
              </p>
              <ul className="list-unstyled text-start mb-4" style={{color: '#3C3D37'}}>
                <li><FontAwesomeIcon icon="check" className="me-2" style={{color: '#697565'}} /> Gérer l'entretien de votre véhicule</li>
                <li><FontAwesomeIcon icon="check" className="me-2" style={{color: '#697565'}} /> Prendre des rendez-vous facilement</li>
                <li><FontAwesomeIcon icon="check" className="me-2" style={{color: '#697565'}} /> Accéder à votre historique de service</li>
              </ul>
              <div className="d-grid gap-3 d-md-flex justify-content-md-center mt-5">
                <Link to="/login" className="btn btn-lg px-4 py-2 shadow-sm" style={{backgroundColor: '#181C14', color: '#ECDFCC'}}>
                  <FontAwesomeIcon icon="sign-in-alt" className="me-2" />
                  Connexion
                </Link>
                <Link to="/signup" className="btn btn-lg px-4 py-2 shadow-sm" style={{backgroundColor: '#697565', color: '#ECDFCC'}}>
                  <FontAwesomeIcon icon="user-plus" className="me-2" />
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
