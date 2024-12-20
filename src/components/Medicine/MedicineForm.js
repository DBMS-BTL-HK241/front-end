import React, { useState } from "react";
import axios from "axios";

function MedicineForm({ onSubmit, onClose, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    dosage: initialData?.dosage || "",
    administration: initialData?.administration || "",
    sideEffects: initialData?.sideEffects || "",
    quantity: initialData?.quantity || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post('http://localhost:3001/medicines', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("There was an error adding the medicine!", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Dosage</label>
        <input
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Administration</label>
        <input
          type="text"
          name="administration"
          value={formData.administration}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Side Effects</label>
        <input
          type="text"
          name="sideEffects"
          value={formData.sideEffects}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </form>
  );
}

export default MedicineForm;