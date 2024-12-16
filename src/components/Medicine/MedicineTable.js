import React from "react";

function MedicineTable({ medicines, onEdit, onDelete }) {
  return (
    <div className="mt-6">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Dosage</th>
            <th className="border border-gray-300 px-4 py-2">Administration</th>
            <th className="border border-gray-300 px-4 py-2">Side Effects</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{medicine.name}</td>
              <td className="border border-gray-300 px-4 py-2">{medicine.dosage}</td>
              <td className="border border-gray-300 px-4 py-2">{medicine.administration}</td>
              <td className="border border-gray-300 px-4 py-2">{medicine.sideEffects}</td>
              <td className="border border-gray-300 px-4 py-2">{medicine.quantity}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => onEdit(medicine)}
                  className="text-blue-500 mr-2 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(medicine.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicineTable;