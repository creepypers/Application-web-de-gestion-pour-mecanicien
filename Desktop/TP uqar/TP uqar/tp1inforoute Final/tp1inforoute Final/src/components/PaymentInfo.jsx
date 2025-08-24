import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateUser, addPaymentMethod } from '../store/slices/authSlice';
import { updatePaymentStatus } from '../store/slices/appointmentsSlice';
import { addInvoice } from '../store/slices/invoicesSlice';
import { addEarning } from '../store/slices/earningsSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaymentInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = location.state?.appointmentId;
  const user = useSelector(state => state.auth.user);
  const savedCards = user.paymentMethods || [];
  const appointment = useSelector(state => 
    state.appointments.appointments.find(app => app.id === appointmentId)
  );

  const [paymentMethod, setPaymentMethod] = useState('new'); 
  const [selectedCard, setSelectedCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'new' && saveCard) {
      dispatch(addPaymentMethod({
        id: Date.now(),
        cardNumber: cardNumber.slice(-4),
        expiryDate,
      }));
    }

    dispatch(updateUser({
      ...user,
      hasPaymentInfo: true
    }));

    if (appointmentId && appointment) {
      dispatch(updatePaymentStatus({ appointmentId, isPaid: true }));
      
      const vehicle = appointment.vehicleInfo;
      const invoice = {
        date: new Date().toISOString(),
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
        amount: appointment.estimatedCost,
        status: 'paid',
        items: [{ description: appointment.service, amount: appointment.estimatedCost }],
        userId: user.id
      };
      dispatch(addInvoice(invoice));

      dispatch(addEarning({
        mechanicId: appointment.mechanicId,
        amount: appointment.estimatedCost * 0.15,
        date: new Date().toISOString(),
        appointmentId: appointment.id,
        serviceDescription: appointment.service
      }));
    }
    navigate('/client-dashboard');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Saisir les informations de paiement</h3>
              
              {savedCards.length > 0 && (
                <div className="mb-4">
                  <div className="form-check mb-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="newCard"
                      name="paymentMethod"
                      value="new"
                      checked={paymentMethod === 'new'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="newCard">
                      Utiliser une nouvelle carte
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="savedCard"
                      name="paymentMethod"
                      value="saved"
                      checked={paymentMethod === 'saved'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="savedCard">
                      Utiliser une carte enregistrée
                    </label>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {paymentMethod === 'saved' ? (
                  <div className="mb-3">
                    <label htmlFor="savedCards" className="form-label">Sélectionner une carte</label>
                    <select
                      className="form-select"
                      id="savedCards"
                      value={selectedCard}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      required
                    >
                      <option value="">Choisir une carte...</option>
                      {savedCards.map(card => (
                        <option key={card.id} value={card.id}>
                          Carte se terminant par {card.cardNumber} (Exp: {card.expiryDate.slice(0, 2)}/{card.expiryDate.slice(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="cardNumber" className="form-label">
                        <FontAwesomeIcon icon="credit-card" className="me-2" />
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength="16"
                        required={paymentMethod === 'new'}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="expiryDate" className="form-label">
                        <FontAwesomeIcon icon="calendar-alt" className="me-2" />
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MMAA"
                        maxLength="4"
                        required={paymentMethod === 'new'}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="cvv" className="form-label">
                        <FontAwesomeIcon icon="lock" className="me-2" />
                        CVV
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cvv"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength="3"
                        required={paymentMethod === 'new'}
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="saveCard"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="saveCard">
                        Sauvegarder cette carte pour de futurs paiements
                      </label>
                    </div>
                  </>
                )}
                <button type="submit" className="btn btn-primary w-100">
                  <FontAwesomeIcon icon="check-circle" className="me-2" />
                  Valider le paiement
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
