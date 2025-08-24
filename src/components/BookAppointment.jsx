import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { bookAppointment, updateAppointment } from '../store/slices/appointmentsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mechanics = useSelector(state => state.mechanics) || [];
  const user = useSelector(state => state.auth.user);
  const vehicles = useSelector(state => 
    state.vehicles.vehicles.filter(v => v.userId === user.id)
  ) || [];
  const existingAppointment = useSelector(state => 
    state.appointments.appointments.find(app => app.id === parseInt(id))
  );

  const [appointment, setAppointment] = useState({
    mechanicId: '',
    vehicleId: '',
    date: '',
    timeSlot: '',
    symptoms: '',
    service: ''
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    if (existingAppointment) {
      setAppointment({
        mechanicId: existingAppointment.mechanicInfo?.id || '',
        vehicleId: existingAppointment.vehicleInfo?.id || '',
        date: existingAppointment.date || '',
        timeSlot: existingAppointment.timeSlot || '',
        symptoms: existingAppointment.symptoms || '',
        service: existingAppointment.service || ''
      });
    }
  }, [existingAppointment]);

  const handleInputChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (appointment.mechanicId && appointment.date) {
      const dummyTimeSlots = generateDummyTimeSlots(appointment.mechanicId, appointment.date);
      setAvailableTimeSlots(dummyTimeSlots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [appointment.mechanicId, appointment.date]);

  const generateDummyTimeSlots = (mechanicId, date) => {
    const slots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    return slots.filter(() => Math.random() > 0.3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedVehicle = vehicles.find(v => v.id === parseInt(appointment.vehicleId));
    const selectedMechanic = mechanics.find(m => m.id === parseInt(appointment.mechanicId));
    const appointmentData = {
      ...appointment,
      userId: user.id,
      clientInfo: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      mechanicId: selectedMechanic.id,
      mechanicInfo: selectedMechanic ? {
        id: selectedMechanic.id,
        name: selectedMechanic.name,
        speciality: selectedMechanic.speciality
      } : null,
      vehicleInfo: {
        id: selectedVehicle.id,
        make: selectedVehicle.make,
        model: selectedVehicle.model,
        year: selectedVehicle.year,
        vin: selectedVehicle.vin,
        userId: user.id
      }
    };

    if (existingAppointment) {
      dispatch(updateAppointment({ ...appointmentData, id: existingAppointment.id }));
    } else {
      dispatch(bookAppointment(appointmentData));
    }

    navigate('/client-dashboard');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card h-100">
      <div className="card-body">
        <h3 className="card-title text-center mb-4">
          <FontAwesomeIcon icon={existingAppointment ? "edit" : "calendar-alt"} className="me-2" />
          {existingAppointment ? 'Modifier le rendez-vous' : 'Prendre un rendez-vous'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="mechanicId" className="form-label">
              <FontAwesomeIcon icon="user-md" className="me-2" />Sélectionner un mécanicien
            </label>
            <select className="form-select" id="mechanicId" name="mechanicId" value={appointment.mechanicId} onChange={handleInputChange} required>
              <option value="">Choisir...</option>
              {mechanics.map(mechanic => (
                <option key={mechanic.id} value={mechanic.id}>{mechanic.name} - {mechanic.speciality}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleId" className="form-label">
              <FontAwesomeIcon icon="car" className="me-2" />Sélectionner un véhicule
            </label>
            <select className="form-select" id="vehicleId" name="vehicleId" value={appointment.vehicleId} onChange={handleInputChange} required>
              <option value="">Choisir...</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} ({vehicle.year})</option>
              ))}
            </select>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">
                <FontAwesomeIcon icon="calendar-alt" className="me-2" />Date
              </label>
              <input 
                type="date" 
                className="form-control" 
                id="date" 
                name="date" 
                value={appointment.date} 
                onChange={handleInputChange} 
                min={today} 
                required 
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="timeSlot" className="form-label">
                <FontAwesomeIcon icon="clock" className="me-2" />Créneau horaire
              </label>
              <select className="form-select" id="timeSlot" name="timeSlot" value={appointment.timeSlot} onChange={handleInputChange} required disabled={!availableTimeSlots.length}>
                <option value="">Choisir...</option>
                {availableTimeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="symptoms" className="form-label">
              <FontAwesomeIcon icon="stethoscope" className="me-2" />Symptômes
            </label>
            <textarea className="form-control" id="symptoms" name="symptoms" rows="3" value={appointment.symptoms} onChange={handleInputChange} required></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="service" className="form-label">
              <FontAwesomeIcon icon="tools" className="me-2" />Service souhaité
            </label>
            <input type="text" className="form-control" id="service" name="service" value={appointment.service} onChange={handleInputChange} required />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <FontAwesomeIcon icon="calendar-check" className="me-2" />
              {existingAppointment ? 'Modifier le rendez-vous' : 'Prendre rendez-vous'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
