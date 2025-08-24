import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  cancelAppointment, 
  confirmAppointment, 
  rejectAppointment, 
  approveModification, 
  rejectModification,
  updateAppointment,
  completeAppointment,
  deleteAppointment
} from '../store/slices/appointmentsSlice';

export default function AppointmentList({ userRole, appointments = [], showDateTime }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingAppointmentId, setRejectingAppointmentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const user = useSelector(state => state.auth.user);
  const filteredAppointments = useSelector(state => {
    if (userRole === 'mechanic') {
      return state.appointments.appointments.filter(app => app.mechanicId === user.id);
    } else {
      return state.appointments.appointments.filter(app => app.userId === user.id);
    }
  });

  const handleCancelAppointment = (id) => {
    dispatch(cancelAppointment(id));
  };

  const handleConfirm = (id) => {
    if (!estimatedDuration || !estimatedCost) {
      setErrorMessage("Veuillez fournir la durée estimée et le coût avant de confirmer le rendez-vous.");
      return;
    }
    dispatch(confirmAppointment({ id, estimatedDuration, estimatedCost }));
    setEstimatedDuration('');
    setEstimatedCost('');
    setErrorMessage('');
  };

  const handleReject = (id) => {
    if (rejectingAppointmentId === id) {
      if (rejectionReason.trim()) {
        dispatch(rejectAppointment({ id, rejectionReason }));
        setRejectionReason('');
        setRejectingAppointmentId(null);
        setErrorMessage('');
      } else {
        setErrorMessage("Veuillez fournir une raison pour le rejet.");
      }
    } else {
      setRejectingAppointmentId(id);
    }
  };

  const handleApproveModification = (appointment) => {
    if (!estimatedDuration || !estimatedCost) {
      setErrorMessage("Veuillez fournir la durée estimée et le coût avant d'approuver la modification.");
      return;
    }
    dispatch(approveModification({ 
      id: appointment.id, 
      updatedData: {
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        service: appointment.service,
        estimatedDuration: estimatedDuration,
        estimatedCost: estimatedCost
      }
    }));
    setEstimatedDuration('');
    setEstimatedCost('');
    setErrorMessage('');
  };

  const handleRejectModification = (id) => {
    if (rejectingAppointmentId === id) {
      if (rejectionReason.trim()) {
        dispatch(rejectModification({ id, rejectionReason }));
        setRejectionReason('');
        setRejectingAppointmentId(null);
        setEstimatedDuration('');
        setEstimatedCost('');
        setErrorMessage('');
      } else {
        setErrorMessage("Veuillez fournir une raison pour le rejet de la modification.");
      }
    } else {
      setRejectingAppointmentId(id);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment({ ...appointment });
  };

  const handleSaveEdit = () => {
    dispatch(updateAppointment(editingAppointment));
    setEditingAppointment(null);
  };

  const handleInputChange = (e) => {
    setEditingAppointment({ ...editingAppointment, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (appointmentId) => {
    navigate('/payment-info', { state: { appointmentId } });
  };

  const handleComplete = (appointment) => {
    dispatch(completeAppointment(appointment));
  };

  const handleDelete = (id) => {
    const appointment = filteredAppointments.find(app => app.id === id);
    if (appointment && (
      appointment.status === 'cancelled' || 
      appointment.status === 'rejected' || 
      appointment.status === 'completed'
    )) {
      dispatch(deleteAppointment(id));
      if (expandedAppointment === id) setExpandedAppointment(null);
      if (rejectingAppointmentId === id) setRejectingAppointmentId(null);
    }
  };

  const toggleDetails = (appointmentId) => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
  };

  const formatDateTime = (date, timeSlot) => {
    if (!date && !timeSlot) return 'Date et heure non disponibles';
    if (!date) return `Heure : ${timeSlot} (Date non définie)`;
    if (!timeSlot) return `Date : ${date} (Heure non définie)`;
    return `${date} à ${timeSlot}`;
  };

  const renderAppointment = (appointment) => (
    <div key={appointment.id} className={`card mb-3 ${userRole === 'mechanic' ? 'bg-light' : ''}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">
            <FontAwesomeIcon icon="calendar-alt" className="me-2" />
            {showDateTime ? formatDateTime(appointment.date, appointment.timeSlot) : 'Rendez-vous'}
          </h5>
          <button 
            className="btn btn-link" 
            onClick={() => toggleDetails(appointment.id)}
            title={expandedAppointment === appointment.id ? "Masquer les détails" : "Afficher les détails"}
          >
            <FontAwesomeIcon icon={expandedAppointment === appointment.id ? "chevron-up" : "chevron-down"} />
          </button>
        </div>
        <p className="card-text">
          <FontAwesomeIcon icon="info-circle" className="me-2" />
          <strong>Statut :</strong> {appointment.status}
        </p>
        <p className="card-text">
          <FontAwesomeIcon icon="tools" className="me-2" />
          <strong>Service :</strong> {appointment.service || 'Non spécifié'}
        </p>
        
        {appointment.status === 'rejected' && (
          <p className="card-text text-danger">
            <FontAwesomeIcon icon="exclamation-circle" className="me-2" />
            Raison du rejet : {appointment.rejectionReason}
          </p>
        )}
        {expandedAppointment === appointment.id && (
          <>
            <p className="card-text">
              <FontAwesomeIcon icon="user-md" className="me-2" />
              <strong>Mécanicien :</strong> {appointment.mechanicInfo ? `${appointment.mechanicInfo.name} (${appointment.mechanicInfo.speciality})` : 'Non assigné'}
            </p>
            <p className="card-text">
              <FontAwesomeIcon icon="car" className="me-2" />
              <strong>Véhicule :</strong> {appointment.vehicleInfo ? `${appointment.vehicleInfo.make} ${appointment.vehicleInfo.model} (${appointment.vehicleInfo.year})` : 'Non spécifié'}
            </p>
            <p className="card-text">
              <FontAwesomeIcon icon="fingerprint" className="me-2" />
              <strong>VIN :</strong> {appointment.vehicleInfo?.vin || 'Non spécifié'}
            </p>
            {appointment.estimatedDuration && (
              <p className="card-text">
                <FontAwesomeIcon icon="clock" className="me-2" />
                Durée estimée : {appointment.estimatedDuration} heures
              </p>
            )}
            {appointment.estimatedCost && (
              <p className="card-text">
                <FontAwesomeIcon icon="dollar-sign" className="me-2" />
                Coût estimé : {appointment.estimatedCost}$
              </p>
            )}
          </>
        )}
        <div className="d-flex justify-content-end mt-3">
          {userRole === 'client' && (appointment.status === 'pending' || appointment.status === 'confirmed') && (
            <>
              <button className="btn btn-link text-danger me-2" onClick={() => handleCancelAppointment(appointment.id)} title="Annuler le rendez-vous">
                <FontAwesomeIcon icon="trash-alt" />
              </button>
              <button className="btn btn-link text-primary me-2" onClick={() => handleEditAppointment(appointment)} title="Modifier le rendez-vous">
                <FontAwesomeIcon icon="edit" />
              </button>
            </>
          )}
          {(appointment.status === 'cancelled' || 
            appointment.status === 'rejected' || 
            (appointment.status === 'completed' && appointment.isPaid === true )
            
          ) && (
            <button 
              className="btn btn-link text-danger me-2" 
              onClick={() => handleDelete(appointment.id)} 
              title="Supprimer le rendez-vous"
            >
              <FontAwesomeIcon icon="trash-alt" />
            </button>
          )}
          {userRole === 'mechanic' && appointment.status !== 'completed' && (
            <>
              {appointment.status === 'modification_pending' && (
                <>
                  <input
                    type="number"
                    className="form-control form-control-sm me-2"
                    placeholder="Durée estimée (h)"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    style={{maxWidth: '200px'}}
                    required
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm me-2"
                    placeholder="Coût estimé (€)"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    style={{maxWidth: '200px'}}
                    required
                  />
                  <button 
                    className="btn btn-success btn-sm me-2" 
                    onClick={() => handleApproveModification(appointment)}
                    title="Approuver la modification"
                    disabled={!estimatedDuration || !estimatedCost}
                  >
                    <FontAwesomeIcon icon="check" />
                  </button>
                  {rejectingAppointmentId === appointment.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control form-control-sm me-2"
                        placeholder="Raison du rejet"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        style={{maxWidth: '250px'}}
                      />
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleRejectModification(appointment.id)} 
                        title="Confirmer le rejet"
                        disabled={!rejectionReason.trim()}
                      >
                        <FontAwesomeIcon icon="times" />
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-danger btn-sm me-2" 
                      onClick={() => handleRejectModification(appointment.id)}
                      title="Refuser la modification"
                    >
                      <FontAwesomeIcon icon="times" />
                    </button>
                  )}
                </>
              )}
              {(appointment.status === 'pending' || appointment.status === 'modification_requested') && (
                <>
                  <input
                    type="number"
                    className="form-control form-control-sm me-2"
                    placeholder="Durée estimée (h)"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    style={{maxWidth: '200px'}}
                    required
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm me-2"
                    placeholder="Coût estimé ($)"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    style={{maxWidth: '200px'}}
                    required
                  />
                  <button 
                    className="btn btn-success btn-sm me-2" 
                    onClick={() => handleConfirm(appointment.id)} 
                    title="Confirmer"
                    disabled={!estimatedDuration || !estimatedCost}
                  >
                    <FontAwesomeIcon icon="check" />
                  </button>
                  {rejectingAppointmentId === appointment.id ?  (
                    <>
                      <input
                        type="text"
                        className="form-control form-control-sm me-2"
                        placeholder="Raison du rejet"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        style={{maxWidth: '250px'}}
                      />
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleReject(appointment.id)} 
                        title="Confirmer le rejet"
                        disabled={!rejectionReason.trim()}
                      >
                        <FontAwesomeIcon icon="times" />
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(appointment.id)} title="Rejeter">
                      <FontAwesomeIcon icon="times" />
                    </button>
                  )}
                </>
              )}
              {appointment.status === 'confirmed' && (
                <button className="btn btn-primary btn-sm" onClick={() => handleComplete(appointment)}>
                  Terminer
                </button>
              )}
            </>
          )}
          {userRole === 'client' && appointment.status === 'completed' && !appointment.isPaid && (
            <button className="btn btn-warning btn-sm" onClick={() => handleProceedToPayment(appointment.id)}  >
              <FontAwesomeIcon icon="credit-card" />
              Procéder au paiement
            </button>
          )}
        </div>
        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
      </div>
    </div>
  );

  return (
    <div className="appointment-list">
      {editingAppointment && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Modifier le rendez-vous</h5>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={editingAppointment.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="timeSlot" className="form-label">Créneau horaire</label>
                <select 
                  className="form-select"
                  id="timeSlot"
                  name="timeSlot"
                  value={editingAppointment.timeSlot}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choisir...</option>
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="service" className="form-label">Service</label>
                <input
                  type="text"
                  className="form-control"
                  id="service"
                  name="service"
                  value={editingAppointment.service}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon icon="save" className="me-2" />
                Enregistrer
              </button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingAppointment(null)}>
                <FontAwesomeIcon icon="times" className="me-2" />
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
      <h4>Rendez-vous à venir</h4>
      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
        {filteredAppointments.filter(app => !['completed', 'cancelled', 'rejected'].includes(app.status)).length === 0 ? (
          <p>Aucun rendez-vous à venir.</p>
        ) : (
          filteredAppointments.filter(app => !['completed', 'cancelled', 'rejected'].includes(app.status)).map(renderAppointment)
        )}
      </div>

      <h4 className="mt-4">Rendez-vous terminés</h4>
      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
        {filteredAppointments.filter(app => app.status === 'completed').length === 0 ? (
          <p>Aucun rendez-vous terminé.</p>
        ) : (
          filteredAppointments.filter(app => app.status === 'completed').map(renderAppointment)
        )}
      </div>

      <h4 className="mt-4">Rendez-vous annulés ou rejetés</h4>
      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
        {filteredAppointments.filter(app => ['cancelled', 'rejected'].includes(app.status)).length === 0 ? (
          <p>Aucun rendez-vous annulé ou rejeté.</p>
        ) : (
          filteredAppointments.filter(app => ['cancelled', 'rejected'].includes(app.status)).map(renderAppointment)
        )}
      </div>
    </div>
  );
}
