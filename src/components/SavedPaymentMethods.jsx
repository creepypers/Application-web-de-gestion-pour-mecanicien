import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { removePaymentMethod } from '../store/slices/authSlice';

export default function SavedPaymentMethods() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const paymentMethods = user.paymentMethods || [];

  const handleRemovePaymentMethod = (id) => {
    dispatch(removePaymentMethod(id));
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h3 className="card-title text-center mb-4" style={{color: '#181C14'}}>
          <FontAwesomeIcon icon="credit-card" className="me-2" />
          Méthodes de paiement sauvegardées
        </h3>
        {paymentMethods.length === 0 ? (
          <p>Aucune méthode de paiement sauvegardée.</p>
        ) : (
          <div className="overflow-auto" style={{ maxWidth: '100%', whiteSpace: 'nowrap' }}>
            <div className="d-flex">
              {paymentMethods.map(method => (
                <div key={method.id} className="card me-3" style={{minWidth: '200px', borderColor: '#697565'}}>
                  <div className="card-body">
                    <h6 className="card-title" style={{color: '#181C14'}}>*********** {method.cardNumber}</h6>
                    <p className="card-text" style={{color: '#3C3D37'}}>
                      <FontAwesomeIcon icon="calendar-alt" className="me-2" />
                      {method.expiryDate.slice(0, 2)}/{method.expiryDate.slice(2)}
                      {method.cvv}
                    </p>
                    <button 
                      className="btn btn-link text-danger p-0" 
                      onClick={() => handleRemovePaymentMethod(method.id)}
                    >
                      <FontAwesomeIcon icon="trash-alt"  />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
