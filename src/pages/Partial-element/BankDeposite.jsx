import React, { useState } from "react";
import "../../assets/styles/BankDEposite-style.css";

const SecurityDeposit = ({ rentTitle }) => {
    const [depositeCard, setdepositeCard] = useState(false)
    const payNow = () => {
        setdepositeCard(true)

    }
    return (
        <div className="deposit-card">

            {rentTitle === "Security Deposit" && (
                <h3>Security Deposit</h3>
            )}

            {rentTitle === "Rent Deposit" && (
                <h3>Rent Deposit</h3>
            )}
            <div className="bank-details">

                <div className="row">
                    <b>Bank</b>
                    <span>Your Bank Name</span>
                </div>

                <div className="row">
                    <b>Account Name</b>
                    <span>Your Company Name</span>
                </div>

                <div className="row">
                    <b>Account Number</b>
                    <span>XXXXXXXXXX</span>
                </div>

                <div className="row">
                    <b>IFSC</b>
                    <span>YOUR0001234</span>
                </div>

                <div className="row">
                    <b>Security Deposit Amount</b>
                    <span>N/A</span>
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
                            <input placeholder="Enter deposit amount" />
                        </div>

                        <div className="input-group">
                            <label>UTR / Transaction ID</label>
                            <input placeholder="Enter UTR" />
                        </div>


                        <div className="input-group">
                            <label>Account Number</label>
                            <input placeholder="Enter Account Number" />
                        </div>


                    </div>
                    <button className="submit-btn">
                        Submit Deposit Payment
                    </button>

                </>
            )}



        </div>
    );
};

export default SecurityDeposit;