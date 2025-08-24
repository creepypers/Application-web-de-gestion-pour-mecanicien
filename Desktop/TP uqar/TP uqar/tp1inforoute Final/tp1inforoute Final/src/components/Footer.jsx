import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  return (
    <footer className="py-4 mt-5" style={{backgroundColor: '#181C14', color: '#ECDFCC'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h5 className="mb-3">Connectez-vous avec nous</h5>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" className="mx-2" style={{color: '#ECDFCC'}}>
                <FontAwesomeIcon icon={['fab', 'facebook']} size="2x" />
              </a>
              <a href="https://twitter.com" className="mx-2" style={{color: '#ECDFCC'}}>
                <FontAwesomeIcon icon={['fab', 'twitter']} size="2x" />
              </a>
              <a href="https://instagram.com" className="mx-2" style={{color: '#ECDFCC'}}>
                <FontAwesomeIcon icon={['fab', 'instagram']} size="2x" />
              </a>
              <a href="https://linkedin.com" className="mx-2" style={{color: '#ECDFCC'}}>
                <FontAwesomeIcon icon={['fab', 'linkedin']} size="2x" />
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4" style={{backgroundColor: '#697565', opacity: '0.5'}} />
        <div className="text-center">
          <p className="mb-0" style={{color: '#ECDFCC'}}>&copy; 2024 AutoConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
