import React, { useState } from "react";
import axios from "axios";

function Payments() {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      patientName: "John Doe",
      phoneNumber: "123456789",
      address: "123 Main St",
      dateOfVisit: "2024-11-29",
      doctorName: "Dr. Smith",
      specialization: "Cardiology",
      symptoms: "Chest pain",
      disease: "Heart Disease",
      medicines: "Aspirin",
      amount: 500,
      status: "Unpaid",
    },
    {
      id: 2,
      patientName: "Jane Roe",
      phoneNumber: "987654321",
      address: "456 Elm St",
      dateOfVisit: "2024-11-28",
      doctorName: "Dr. Brown",
      specialization: "Pediatrics",
      symptoms: "Fever and Cough",
      disease: "Flu",
      medicines: "Paracetamol",
      amount: 1200,
      status: "Unpaid",
    },
    {
      id: 3,
      patientName: "Alice Green",
      phoneNumber: "456789123",
      address: "789 Oak St",
      dateOfVisit: "2024-11-27",
      doctorName: "Dr. White",
      specialization: "Orthopedics",
      symptoms: "Knee pain",
      disease: "Arthritis",
      medicines: "Ibuprofen",
      amount: 800,
      status: "Paid",
    },
  ]);
  const [newBill, setNewBill] = useState({
    patientName: "",
    phoneNumber: "",
    address: "",
    dateOfVisit: "",
    doctorName: "",
    specialization: "",
    symptoms: "",
    disease: "",
    medicines: "",
    amount: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePayment = (id) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "Paid" } : invoice
      )
    );
    alert("Payment confirmed!");
  };

  const handleAddBill = async (e) => {
    if (!newBill.amount || !newBill.patientName || !newBill.dateOfVisit) {
      alert("Please fill in all required fields");
      return;
    }
    const newInvoice = {
      id: invoices.length + 1,
      ...newBill,
      amount: parseFloat(newBill.amount),
      status: "Unpaid",
    };
    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
    setNewBill({
      patientName: "",
      phoneNumber: "",
      address: "",
      dateOfVisit: "",
      doctorName: "",
      specialization: "",
      symptoms: "",
      disease: "",
      medicines: "",
      amount: "",
    });
    setIsModalOpen(false);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post(
          "http://localhost:3001/payments/create_bill",
          newInvoice, // This is the request body
          { headers: { Authorization: `Bearer ${token}` } } // Headers go in the config object
        );
        alert("New bill added!");
      } catch (err) {
        console.error("Bill Creation error:", err);
      }
    } else {
      alert("Token is missing. Please log in to continue.");
    }
  };

  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Manage Payments and Insurance</h1>

      <section>
        <h2>Invoice Management</h2>
        <button onClick={() => setIsModalOpen(true)}>Create New Bill</button>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Visit Date</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Disease Name</th>
              <th>Total Bill</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} onClick={() => handleRowClick(invoice)}>
                <td>{invoice.id}</td>
                <td>{invoice.dateOfVisit}</td>
                <td>{invoice.patientName}</td>
                <td>{invoice.doctorName}</td>
                <td>{invoice.disease}</td>
                <td>{invoice.amount} VND</td>
                <td>{invoice.status}</td>
                <td>
                  {invoice.status === "Unpaid" && (
                    <button onClick={() => handlePayment(invoice.id)}>
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Payment and Confirmation</h2>
        <p>
          Patients can complete payments online or at the counter. The status of
          each payment is tracked to ensure accuracy.
        </p>
      </section>

      {/* Modal for Creating New Bill */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Bill</h3>
            <form>
              {/* Patient Info */}
              <h4>Patient Information</h4>
              <div className="row">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={newBill.patientName || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, patientName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newBill.phoneNumber || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <input
                  type="text"
                  placeholder="Address"
                  value={newBill.address || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, address: e.target.value })
                  }
                />
                <input
                  type="date"
                  placeholder="Date of Visit"
                  value={newBill.dateOfVisit || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, dateOfVisit: e.target.value })
                  }
                />
              </div>

              {/* Doctor Info */}
              <h4>Doctor Information</h4>
              <div className="row">
                <input
                  type="text"
                  placeholder="Doctor Name"
                  value={newBill.doctorName || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, doctorName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={newBill.specialization || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, specialization: e.target.value })
                  }
                />
              </div>

              {/* Medical Details */}
              <h4>Medical Details</h4>
              <div>
                <textarea
                  rows="2"
                  placeholder="Describe Symptoms"
                  value={newBill.symptoms || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, symptoms: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <input
                  type="text"
                  placeholder="Disease Name"
                  value={newBill.disease || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, disease: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Medicines"
                  value={newBill.medicines || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, medicines: e.target.value })
                  }
                />
              </div>

              {/* Bill Details */}
              <h4>Bill Details</h4>
              <div className="row">
                <input
                  type="number"
                  placeholder="Total Amount (VND)"
                  value={newBill.amount || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, amount: e.target.value })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="actions">
                <button type="button" onClick={handleAddBill}>
                  Add Bill
                </button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <style jsx>{``}</style>
        </div>
      )}

      {/* Modal for Invoice Details */}
      {selectedInvoice && (
        <div className="modal">
          <div className="modal-content">
            <h3>Invoice Details</h3>

            <table className="details-table">
              <tbody>
                {/* Patient Info */}
                <tr>
                  <th>Patient Name</th>
                  <td>{selectedInvoice.patientName}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>{selectedInvoice.phoneNumber}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{selectedInvoice.address}</td>
                </tr>
                <tr>
                  <th>Date of Visit</th>
                  <td>{selectedInvoice.dateOfVisit}</td>
                </tr>

                {/* Doctor Info */}
                <tr>
                  <th>Doctor Name</th>
                  <td>{selectedInvoice.doctorName}</td>
                </tr>
                <tr>
                  <th>Specialization</th>
                  <td>{selectedInvoice.specialization}</td>
                </tr>

                {/* Medical Details */}
                <tr>
                  <th>Symptoms</th>
                  <td>{selectedInvoice.symptoms}</td>
                </tr>
                <tr>
                  <th>Disease Name</th>
                  <td>{selectedInvoice.disease}</td>
                </tr>
                <tr>
                  <th>Medicines</th>
                  <td>{selectedInvoice.medicines}</td>
                </tr>

                {/* Bill Details */}
                <tr>
                  <th>Total Amount (VND)</th>
                  <td>{selectedInvoice.amount} VND</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{selectedInvoice.status}</td>
                </tr>
              </tbody>
            </table>

            <div className="actions">
              <button type="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>

          <style jsx>{`
            .modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
            }
            .modal-content {
              background: white;
              padding: 20px;
              border-radius: 8px;
              max-width: 600px;
              width: 100%;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .details-table th,
            .details-table td {
              padding: 10px;
              text-align: left;
              vertical-align: top;
              border-bottom: 1px solid #ddd;
            }
            .details-table th {
              background-color: #f9f9f9;
              font-weight: bold;
              width: 30%;
            }
            .details-table td {
              width: 70%;
            }
            .actions {
              text-align: center;
              margin-top: 20px;
            }
            .actions button {
              padding: 10px 20px;
              border: none;
              background-color: #007bff;
              color: white;
              cursor: pointer;
              border-radius: 4px;
            }
            .actions button:hover {
              background-color: #0056b3;
            }
          `}</style>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        .modal-content input {
          margin: 10px 0;
          width: calc(100% - 20px);
          padding: 10px;
        }
        .modal-content button {
          margin: 10px 5px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .invoice-table th,
        .invoice-table td {
          padding: 15px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .invoice-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }

        .invoice-table tr:hover {
          background-color: #f1f1f1;
        }

        .invoice-table button {
          padding: 5px 10px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 4px;
        }

        .invoice-table button:hover {
          background-color: #0056b3;
        }

        .row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        input,
        textarea {
          width: 100%;
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: none;
          box-sizing: border-box; /* Ensures padding and border are included in the width */
        }
        .actions {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        button {
          padding: 10px 15px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 4px;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default Payments;
