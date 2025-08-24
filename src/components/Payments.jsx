import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPayment } from '../store/slices/paymentsSlice';
import { payInvoice } from '../store/slices/invoicesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Payments() {
  const dispatch = useDispatch();
  const payments = useSelector(state => state.payments);
  const invoices = useSelector(state => state.invoices.filter(invoice => invoice.status === 'unpaid'));

  const handlePayment = (invoiceId, amount) => {
    dispatch(addPayment({ invoiceId, amount, date: new Date().toISOString() }));
    dispatch(payInvoice(invoiceId));
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title">Payments</h3>
        <h4>Unpaid Invoices</h4>
        {invoices.length === 0 ? (
          <p>No unpaid invoices.</p>
        ) : (
          invoices.map(invoice => (
            <div key={invoice.id} className="mb-3">
              <p>Invoice #{invoice.id} - ${invoice.amount}</p>
              <button className="btn btn-primary" onClick={() => handlePayment(invoice.id, invoice.amount)}>
                <FontAwesomeIcon icon="credit-card" className="me-2" />Pay Now
              </button>
            </div>
          ))
        )}
        <h4>Payment History</h4>
        {payments.length === 0 ? (
          <p>No payment history.</p>
        ) : (
          payments.map(payment => (
            <div key={payment.id} className="mb-2">
              <p>Payment of ${payment.amount} on {new Date(payment.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}