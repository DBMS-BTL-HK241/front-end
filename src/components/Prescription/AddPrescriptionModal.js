import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const AddPrescriptionModal = ({ onClose, onSubmit, availableMedicines }) => {
  const [formData, setFormData] = useState({
    doctorName: "",
    patientName: "",
    medicines: [],
    totalPrice: 0,
  });

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.medicines]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { id: "", quantity: 1, price: 0 }],
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    if (field === "id") {
      const selectedMedicine = availableMedicines.find((med) => med.id === value);
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        id: value,
        name: selectedMedicine?.name || "",
        price: selectedMedicine?.price || 0,
      };
    } else {
      updatedMedicines[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, medicines: updatedMedicines }));
  };

  const calculateTotalPrice = () => {
    const total = formData.medicines.reduce(
      (sum, medicine) => sum + medicine.price * medicine.quantity,
      0
    );
    setFormData((prev) => ({ ...prev, totalPrice: total }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    generatePDF(); // Tạo PDF sau khi submit
  };

  // Tạo file PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Tiêu đề đơn thuốc
    doc.setFontSize(16);
    doc.text("Prescription", 10, 10);
    doc.setFontSize(12);
    doc.text(`Doctor: ${formData.doctorName}`, 10, 20);
    doc.text(`Patient: ${formData.patientName}`, 10, 30);
    doc.text(`Total Price: ${formData.totalPrice} VND`, 10, 40);

    // Danh sách thuốc
    let yPosition = 50;
    doc.text("Medicines:", 10, yPosition);
    yPosition += 10;

    formData.medicines.forEach((medicine, index) => {
      doc.text(
        `${index + 1}. ${medicine.name} - ${medicine.quantity} x ${medicine.price} = ${
          medicine.quantity * medicine.price
        } VND`,
        10,
        yPosition
      );
      yPosition += 10;
    });

    // Tải xuống file PDF
    doc.save("prescription.pdf");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Prescription</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Doctor
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="block w-full border rounded px-2 py-1"
              required
            />
          </label>
          <label className="block mb-2">
            Patient
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              className="block w-full border rounded px-2 py-1"
              required
            />
          </label>
          <label className="block mb-2">
            Medicines
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="flex items-center mb-2">
                <select
                  value={medicine.id}
                  onChange={(e) =>
                    handleMedicineChange(index, "id", e.target.value)
                  }
                  className="flex-1 border rounded px-2 py-1 mr-2"
                  required
                >
                  <option value="" disabled>
                    Select Medicine
                  </option>
                  {availableMedicines.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name} - {med.price} VND
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={medicine.quantity}
                  onChange={(e) =>
                    handleMedicineChange(index, "quantity", Number(e.target.value))
                  }
                  className="w-20 border rounded px-2 py-1 mr-2"
                  required
                />
                <span>{medicine.price * medicine.quantity || 0} VND</span>
              </div>
            ))}
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded mt-2"
              onClick={handleAddMedicine}
            >
              + Add Medicine
            </button>
          </label>
          <label className="block mb-4">
            Total price
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              readOnly
              className="block w-full border rounded px-2 py-1 bg-gray-100"
            />
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;
