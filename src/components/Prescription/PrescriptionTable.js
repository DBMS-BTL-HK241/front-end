import React, { useState } from "react";

const PrescriptionTable = ({ prescriptions }) => {
  const [expandedRows, setExpandedRows] = useState({});

  // Tính tổng giá dựa trên số lượng và giá của từng thuốc
  const calculateTotalPrice = (medicines) => {
    return medicines.reduce((total, med) => {
      const quantity = med.quantity?.low || 0; // Lấy giá trị từ `low` của `quantity`
      const price = med.price || 0;
      return total + quantity * price;
    }, 0);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prescriptions</h2>
      <div className="border rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2 text-left text-gray-600">Doctor</th>
              <th className="px-4 py-2 text-left text-gray-600">Patient</th>
              <th className="px-4 py-2 text-left text-gray-600">Date</th>
              <th className="px-4 py-2 text-right text-gray-600">Total Price</th>
              <th className="px-4 py-2 text-center text-gray-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions?.map((prescription) => (
              <React.Fragment key={prescription.id}>
                <tr className="border-b">
                  <td className="px-4 py-2">{prescription.doctor?.name || "Unknown"}</td>
                  <td className="px-4 py-2">{prescription.patient?.name || "Unknown"}</td>
                  <td className="px-4 py-2">{new Date(prescription.date).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">
                    {calculateTotalPrice(prescription.medicines)} VND
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleRow(prescription.id)}
                      className="text-blue-500 hover:underline"
                    >
                      {expandedRows[prescription.id] ? "▲" : "▼"}
                    </button>
                  </td>
                </tr>
                {expandedRows[prescription.id] && (
                  <tr className="bg-gray-50">
                    <td colSpan="5">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Medicines</h3>
                        <table className="min-w-full border rounded-md">
                          <thead>
                            <tr className="border-b bg-gray-100">
                              <th className="px-4 py-2 text-left text-gray-600">Medicine</th>
                              <th className="px-4 py-2 text-right text-gray-600">Quantity</th>
                              <th className="px-4 py-2 text-right text-gray-600">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescription.medicines?.map((med, index) => (
                              <tr key={index} className="border-b">
                                <td className="px-4 py-2">{med.medicineName}</td>
                                <td className="px-4 py-2 text-right">{med.quantity.low}</td>
                                <td className="px-4 py-2 text-right">
                                  {med.price || "Unknown"} VND
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionTable;
