import React, { useState, useEffect } from "react";
import axios from "axios";

function Payments() {
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3001/payments/invoices",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvoices(response.data);
      response.data.sort(
        (a, b) => new Date(b.dateOfVisit) - new Date(a.dateOfVisit)
      );
      console.log(response.data);
      // alert("Invoices loaded!");
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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
  const [editableInvoice, setEditableInvoice] = useState(null);

  const handlePayment = (id) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "Paid" } : invoice
      )
    );
    alert("Payment confirmed!");
  };

  const handleAddBill = async (e) => {
    if (
      !newBill.patientName ||
      !newBill.phoneNumber ||
      !newBill.dateOfVisit ||
      !newBill.doctorName ||
      !newBill.symptoms
    ) {
      alert("Please fill in all required fields");
      return;
    }
    const newInvoice = {
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
        fetchInvoices();
        alert("New bill added!");
      } catch (err) {
        console.error("Bill Creation error:", err);
      }
    } else {
      alert("Token is missing. Please log in to continue.");
    }
  };

  const handleUpdateInvoice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token is missing. Please log in to continue.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3001/payments/update_invoice/${editableInvoice.id}`,
        editableInvoice,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInvoices();
      setEditableInvoice(null);
      closeModal();
      alert("Invoice updated successfully!");
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token is missing. Please log in to continue.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3001/payments/delete_all_bills`,
        editableInvoice,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInvoices();
      alert("Delete All Successfully!");
    } catch (error) {
      console.error("Error Delete Them All", error);
    }
  };

  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleEditClick = (invoice) => {
    setEditableInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
    setEditableInvoice(null);
  };

  return (
    <div className="container mx-auto p-4 mt-[100px]">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Payments and Insurance</h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Invoice Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Bill
        </button>
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Visit Date</th>
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-left">Doctor Name</th>
              <th className="px-4 py-2 text-left">Disease Name</th>
              <th className="px-4 py-2 text-left">Total Bill</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                onClick={() => handleRowClick(invoice)}
                className="hover:bg-gray-100"
              >
                <td className="px-4 py-2">{invoice.dateOfVisit}</td>
                <td className="px-4 py-2">{invoice.patientName}</td>
                <td className="px-4 py-2">{invoice.doctorName}</td>
                <td className="px-4 py-2">{invoice.disease}</td>
                <td className="px-4 py-2">{invoice.amount} VND</td>
                <td className="px-4 py-2">{invoice.status}</td>
                <td className="px-4 py-2">
                  {invoice.status === "Unpaid" && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePayment(invoice.id);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Payment and Confirmation</h2>
        <p>
          Patients can complete payments online or at the counter. The status of
          each payment is tracked to ensure accuracy.
        </p>
      </section>

      {/* Modal for Creating New Bill */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Create New Bill</h3>
            <form>
              {/* Patient Info */}
              <h4 className="text-xl font-semibold">Patient Information</h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={newBill.patientName || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, patientName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newBill.phoneNumber || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, phoneNumber: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Address"
                  value={newBill.address || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, address: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="date"
                  value={newBill.dateOfVisit || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, dateOfVisit: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Doctor Info */}
              <h4 className="text-xl font-semibold">Doctor Information</h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Doctor Name"
                  value={newBill.doctorName || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, doctorName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={newBill.specialization || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, specialization: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Medical Details */}
              <h4 className="text-xl font-semibold">Medical Details</h4>
              <textarea
                rows="2"
                placeholder="Describe Symptoms"
                value={newBill.symptoms || ""}
                onChange={(e) =>
                  setNewBill({ ...newBill, symptoms: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Disease Name"
                  value={newBill.disease || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, disease: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Medicines"
                  value={newBill.medicines || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, medicines: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Bill Details */}
              <h4 className="text-xl font-semibold">Bill Details</h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="number"
                  placeholder="Total Amount (VND)"
                  value={newBill.amount || ""}
                  onChange={(e) =>
                    setNewBill({ ...newBill, amount: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleAddBill}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Bill
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Invoice Details */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-2xl font-semibold mb-4">Invoice Details</h3>

            <table className="w-full mb-6 border-collapse">
              <tbody>
                {/* Patient Info */}
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">
                    Patient Name
                  </th>
                  <td className="px-4 py-2">{selectedInvoice.patientName}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">
                    Phone Number
                  </th>
                  <td className="px-4 py-2">{selectedInvoice.phoneNumber}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">Address</th>
                  <td className="px-4 py-2">{selectedInvoice.address}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">
                    Date of Visit
                  </th>
                  <td className="px-4 py-2">{selectedInvoice.dateOfVisit}</td>
                </tr>

                {/* Doctor Info */}
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">
                    Doctor Name
                  </th>
                  <td className="px-4 py-2">{selectedInvoice.doctorName}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">
                    Specialization
                  </th>
                  <td className="px-4 py-2">
                    {selectedInvoice.specialization}
                  </td>
                </tr>

                {/* Medical Details */}
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">Symptoms</th>
                  <td className="px-4 py-2">{selectedInvoice.symptoms}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">
                    Disease Name
                  </th>
                  <td className="px-4 py-2">{selectedInvoice.disease}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">Medicines</th>
                  <td className="px-4 py-2">{selectedInvoice.medicines}</td>
                </tr>

                {/* Bill Details */}
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">
                    Total Amount (VND)
                  </th>
                  <td className="px-4 py-2">{selectedInvoice.amount} VND</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">Status</th>
                  <td className="px-4 py-2">{selectedInvoice.status}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
              <button
                onClick={() => handleEditClick(selectedInvoice)}
                className="px-4 py-2 ml-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Invoice */}
      {editableInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Edit Invoice</h3>
            <form>
              {/* Patient Info */}
              <h4 className="text-xl font-semibold">Patient Information</h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={editableInvoice.patientName || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      patientName: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={editableInvoice.phoneNumber || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Address"
                  value={editableInvoice.address || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="date"
                  value={editableInvoice.dateOfVisit || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      dateOfVisit: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Doctor Info */}
              <h4 className="text-xl font-semibold">Doctor Information</h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Doctor Name"
                  value={editableInvoice.doctorName || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      doctorName: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={editableInvoice.specialization || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Medical Details */}
              <h4 className="text-xl font-semibold">Medical Details</h4>
              <textarea
                rows="2"
                placeholder="Describe Symptoms"
                value={editableInvoice.symptoms || ""}
                onChange={(e) =>
                  setEditableInvoice({
                    ...editableInvoice,
                    symptoms: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Disease Name"
                  value={editableInvoice.disease || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      disease: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Medicines"
                  value={editableInvoice.medicines || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      medicines: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Bill Details */}
              <h4 className="text-xl font-semibold">Bill Details</h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="number"
                  placeholder="Total Amount (VND)"
                  value={editableInvoice.amount || ""}
                  onChange={(e) =>
                    setEditableInvoice({
                      ...editableInvoice,
                      amount: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleUpdateInvoice}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    <button
      onClick={() => handleDelete()}
      className="px-4 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Delete All
    </button>
    </div>
  );
}

export default Payments;
