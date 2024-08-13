// src/components/PaymentsTable.js
import React from 'react';

const PaymentsTable = ({ payments, propertyType }) => {
    return (
        <div className="payments-table">
            <h2 className="payments-title">Payments</h2>
            <table>
                <thead>
                    <tr>
                        {propertyType === 'rent' ? (
                            <>
                                <th>Month</th>
                                <th>Amount Paid</th>
                                <th>MPesa Code</th>
                                <th>Payment Date</th>
                                <th>Status</th>
                            </>
                        ) : (
                            <>
                                <th>Amount</th>
                                <th>MPesa Code</th>
                                <th>Purchased At</th>
                                <th>User</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index}>
                            {propertyType === 'rent' ? (
                                <>
                                    <td>{payment.month}</td>
                                    <td>{payment.amountPaid}</td>
                                    <td>{payment.mpesaCode}</td>
                                    <td>{payment.paymentDate}</td>
                                    <td>{payment.status}</td>
                                </>
                            ) : (
                                <>
                                    <td>{payment.amount}</td>
                                    <td>{payment.mpesaCode}</td>
                                    <td>{payment.purchasedAt}</td>
                                    <td>{payment.user}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsTable;
