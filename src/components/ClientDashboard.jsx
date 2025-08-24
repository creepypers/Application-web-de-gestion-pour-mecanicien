import React from 'react';
import { useSelector } from 'react-redux';
import VehicleManagement from './VehicleManagement';
import BookAppointment from './BookAppointment';
import AppointmentList from './AppointmentList';
import SavedPaymentMethods from './SavedPaymentMethods';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Invoices from './Invoices'; 

export default function ClientDashboard() {
  const appointments = useSelector(state => state.appointments.appointments);


  return (
    <div className="container mt-4" style={{color: '#3C3D37'}}>
      <h2 className="text-center mb-4" style={{color: '#181C14'}}>Tableau de bord client</h2>
      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4" style={{color: '#181C14'}}>
                <FontAwesomeIcon icon="car" className="me-2" />
                Gestion des véhicules
              </h3>
              <VehicleManagement />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <BookAppointment />
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title text-center mb-4" style={{color: '#181C14'}}>
                <FontAwesomeIcon icon="calendar-alt" className="me-2" />
                Rendez-vous
              </h3>
              <AppointmentList 
                userRole="client" 
                appointments={appointments} 
                showDateTime={true}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mb-4">
          <Invoices /> 
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mb-4">
          <SavedPaymentMethods />
        </div>
      </div>
    </div>
  );
}
