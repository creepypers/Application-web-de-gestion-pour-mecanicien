import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ClientDashboard from "./components/ClientDashboard";
import MechanicDashboard from "./components/MechanicDashboard";
import BookAppointment from "./components/BookAppointment";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';
import PaymentInfo from "./components/PaymentInfo";
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faHome, faSignInAlt, faUserPlus, faUser, faEnvelope, faLock, faSignOutAlt, 
  faEdit, faCheck, faPhone, faMapMarkerAlt, faCalendarAlt, faClock, faCar, 
  faFileInvoiceDollar, faDollarSign, faPiggyBank, faChartLine, faTrash, 
  faPlusCircle, faFingerprint, faHistory, faWrench, faCogs, faFlag, 
  faChevronUp, faChevronDown, faUserMd, faStethoscope, faTools, 
  faCalendarCheck, faTimesCircle, faInfoCircle, faDashboard, faSave,
  faTimes, faExclamationCircle, faCreditCard, faCheckCircle, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, faTwitter, faInstagram, faLinkedin 
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faHome, faSignInAlt, faUserPlus, faUser, faEnvelope, faLock, faSignOutAlt, 
  faEdit, faCheck, faPhone, faMapMarkerAlt, faCalendarAlt, faClock, faCar, 
  faFileInvoiceDollar, faDollarSign, faPiggyBank, faChartLine, faTrash, 
  faPlusCircle, faFingerprint, faHistory, faWrench, faCogs, faFlag, 
  faChevronUp, faChevronDown, faUserMd, faStethoscope, faTools, 
  faCalendarCheck, faTimesCircle, faInfoCircle, faDashboard, faSave,
  faTimes, faExclamationCircle, faCreditCard, faCheckCircle, faTrashAlt,
  faFacebook, faTwitter, faInstagram, faLinkedin
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.user?.role);

  if (!isAuthenticated || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.user?.role);

  if (isAuthenticated) {
    return <Navigate to={userRole === 'mechanic' ? '/mechanic-dashboard' : '/client-dashboard'} />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mechanic-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['mechanic']}>
                  <MechanicDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book-appointment" 
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-appointment/:id" 
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Home />} />
            <Route path="/payment-info" element={<PaymentInfo />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
