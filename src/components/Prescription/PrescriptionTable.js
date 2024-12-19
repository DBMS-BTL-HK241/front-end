import React from "react";

const PrescriptionTable = ({ medicines }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Medicines</h2>
      <div className="border rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2 text-left text-gray-600">Medicine</th>
              <th className="px-4 py-2 text-right text-gray-600">Quantity</th>
              <th className="px-4 py-2 text-right text-gray-600">Price</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{med.name}</td>
                <td className="px-4 py-2 text-right">{med.quantity}</td>
                <td className="px-4 py-2 text-right">{med.price} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionTable;
