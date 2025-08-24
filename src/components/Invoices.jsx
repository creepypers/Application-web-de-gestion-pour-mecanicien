import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteInvoice } from '../store/slices/invoicesSlice'; 

export default function Invoices({ isMechanic = false, mechanicInvoices = [] }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const invoices = isMechanic ? 
    mechanicInvoices : 
    useSelector(state => state.invoices.filter(invoice => invoice.userId === user.id));

  const handleDelete = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  return (
    <div className={isMechanic ? '' : 'card mb-4'}>
      <div className={isMechanic ? '' : 'card-body'}>
        {!isMechanic && <h3 className="card-title text-center mb-4" style={{color: '#181C14'}}>Factures</h3>}
        {invoices.length === 0 ? (
          <p className="text-center" style={{color: '#3C3D37'}}>Aucune facture disponible.</p>
        ) : (
          <div className="d-flex flex-wrap">
            {invoices.map(invoice => (
              <div key={invoice.id} className="card m-2" style={{width: '18rem', borderColor: '#697565'}}>
                <div className="card-body">
                  <h5 className="card-title" style={{color: '#181C14'}}>Facture #{invoice.id}</h5>
                  <p className="card-text" style={{color: '#3C3D37'}}>
                    <FontAwesomeIcon icon="calendar-alt" className="me-2" />
                    Date: {new Date(invoice.date).toLocaleDateString()}
                  </p>
                  <p className="card-text" style={{color: '#3C3D37'}}>
                    <FontAwesomeIcon icon="car" className="me-2" />
                    Véhicule: {invoice.vehicleName || 'Inconnu'}
                  </p>
                  <p className="card-text" style={{color: '#3C3D37'}}>
                    <FontAwesomeIcon icon="dollar-sign" className="me-2" />
                    Montant: {invoice.amount}€
                  </p>
                  <p className="card-text" style={{color: '#3C3D37'}}>
                    <FontAwesomeIcon icon="info-circle" className="me-2" />
                    Statut: {invoice.status === 'paid' ? 'Payée' : 'Non payée'}
                  </p>
                    <button 
                      className="btn btn-link text-danger"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <FontAwesomeIcon icon="trash-alt" />
                    </button>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
