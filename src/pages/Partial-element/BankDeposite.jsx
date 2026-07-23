import React, { useState } from "react";
import "../../assets/styles/BankDEposite-style.css";
import { submitAchPayment } from "../../services/api";
import { toast } from "react-toastify";

const SecurityDeposit = ({ rentTitle, client }) => {
    const [depositeCard, setdepositeCard] = useState(false);
    const [submitting, setSubmitting]     = useState(false);
    const [txnId, setTxnId]               = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [submitted, setSubmitted]       = useState(false);

    const isDeposit = rentTitle === "Security Deposit";
    const paymentType = isDeposit ? 'deposit' : 'rent';

    const amount = isDeposit
        ? (client?.security_deposit || '')
        : (client?.rent_amount || '');

    const payNow = () => setdepositeCard(true);

    const handleSubmit = async () => {
        if (!txnId.trim()) {
            toast.error('Please enter a Transaction ID / UTR.');
            return;
        }
        if (!amount) {
            toast.error('Amount not available. Please contact support.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await submitAchPayment({
                type:           paymentType,
                amount:         parseFloat(amount),
                txn_id:         txnId.trim(),
                account_number: accountNumber.trim(),
            });

            if (res.success) {
                toast.success('Payment recorded! Pending verification.');
                setSubmitted(true);
                setdepositeCard(false);
            } else {
                toast.error(res.message || 'Payment failed. Please try again.');
            }
        } catch (e) {
            toast.error(e.message || 'Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="deposit-card">
                <h3>{rentTitle}</h3>
                <p style={{ color: 'green' }}>
                    ✓ Payment submitted successfully. Status: Pending Verification.
                </p>
            </div>
        );
    }

    return (
        <div className="deposit-card">
            {isDeposit ? <h3>Security Deposit</h3> : <h3>Rent Deposit</h3>}

            <div className="bank-details">
                <div className="row">
                    <b>Bank</b>
                    <span>JPMorgan Chase</span>
                </div>
                <div className="row">
                    <b>Account Name</b>
                    <span>Journey Realty Group LLC</span>
                </div>
                <div className="row">
                    <b>Account Number</b>
                    <span>909503879</span>
                </div>
                <div className="row">
                    <b>Routing Number</b>
                    <span>021000021</span>
                </div>
                <div className="row">
                    <b>{isDeposit ? 'Security Deposit Amount' : 'Rent Amount'}</b>
                    <span>{amount ? `$${amount}` : 'N/A'}</span>
                </div>
                <p className="note">
                    Use your registered name while transferring.
                </p>
            </div>

            {!depositeCard && (
                <button className="submit-btn" onClick={payNow}>
                    Pay
                </button>
            )}

            {depositeCard && (
                <>
                    <div className="payment-form">
                        <div className="input-group">
                            <label>Amount</label>
                            <input
                                value={amount ? `$${amount}` : ''}
                                readOnly
                                placeholder="Amount"
                            />
                        </div>
                        <div className="input-group">
                            <label>UTR / Transaction ID</label>
                            <input
                                placeholder="Enter UTR"
                                value={txnId}
                                onChange={e => setTxnId(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Account Number</label>
                            <input
                                placeholder="Enter Account Number"
                                value={accountNumber}
                                onChange={e => setAccountNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : `Submit ${isDeposit ? 'Deposit' : 'Rent'} Payment`}
                    </button>
                </>
            )}
        </div>
    );
};

export default SecurityDeposit;
