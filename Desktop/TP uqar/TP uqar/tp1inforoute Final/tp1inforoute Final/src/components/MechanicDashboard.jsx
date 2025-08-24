import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppointmentList from './AppointmentList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { completeAppointment } from '../store/slices/appointmentsSlice';
import { addEarning } from '../store/slices/earningsSlice';
import Invoices from './Invoices'; 

export default function MechanicDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const appointments = useSelector(state => state.appointments.appointments);
  const mechanicInvoices = useSelector(state => 
    state.invoices.filter(invoice => 
      state.appointments.appointments.some(app => 
        app.mechanicId === user.id && 
        app.vehicleInfo.id === invoice.vehicleId
      )
    )
  );
  const earnings = useSelector(state => 
    state.earnings.filter(earning => earning.mechanicId === user.id)
  );

  const handleComplete = (appointment) => {
    dispatch(completeAppointment(appointment));
  };

  const calculateEarnings = () => {
    return earnings.reduce((total, earning) => total + earning.amount, 0);
  };

  const formatAmount = (amount) => {
    const num = amount;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <div className="container mt-4" style={{color: '#3C3D37'}}>
      <h2 className="text-center mb-4" style={{color: '#181C14'}}>Tableau de bord mécanicien</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3" style={{color: '#181C14'}}>Rendez-vous</h3>
              <AppointmentList 
                appointments={appointments}
                userRole="mechanic" 
                onComplete={handleComplete}
                showDateTime={true}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3" style={{color: '#181C14'}}>Gains</h3>
              <h5 className="card-subtitle mb-2 text-muted">Gains totaux</h5>
              <p className="card-text fs-4" style={{color: '#697565'}}>
                <FontAwesomeIcon icon="dollar-sign" className="me-2" />
                ${formatAmount(calculateEarnings())}
              </p>
              <div className="mt-3">
                <h6>Historique des gains</h6>
                <div style={{
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.25rem',
                  padding: '0.5rem'
                }}>
                  {earnings.length === 0 ? (
                    <p className="text-muted text-center mb-0">Aucun gain enregistré</p>
                  ) : (
                    earnings.map(earning => (
                      <div key={earning.id} className="card mb-2">
                        <div className="card-body py-2">
                          <small className="text-muted d-block">
                            {new Date(earning.date).toLocaleDateString()}
                          </small>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{earning.serviceDescription}</span>
                            <span className="fw-bold">${formatAmount(earning.amount)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3" style={{color: '#181C14'}}>Factures des rendez-vous</h3>
              <Invoices isMechanic={true} mechanicInvoices={mechanicInvoices} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
