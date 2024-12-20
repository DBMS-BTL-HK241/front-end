import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionHeader from "../../components/Prescription/PrescriptionHeader";
import PrescriptionTable from "../../components/Prescription/PrescriptionTable";
import TotalPrice from "../../components/Prescription/TotalPrice";
import AddPrescriptionModal from "../../components/Prescription/AddPrescriptionModal";

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableMedicines, setAvailableMedicines] = useState([]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/prescriptions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        }
      );
      setPrescriptions(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAvailableMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/medicines", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setAvailableMedicines(response.data);
    } catch (err) {
      console.error("Failed to fetch available medicines:", err.message);
    }
  }

  const handleAddPrescription = async (newPrescription) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/prescriptions",
        newPrescription
      );
      setPrescriptions([...prescriptions, response.data]);
      setIsModalOpen(false); // Close modal after adding prescription
    } catch (err) {
      console.error("Failed to add prescription:", err.message);
    }
  };

  useEffect(() => {
    console.log("Fetching prescriptions...");
    fetchPrescriptions();
    fetchAvailableMedicines();
  }, []);

  // if (loading) return <div className="text-center mt-10">Loading...</div>;
  // if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      {/* <PrescriptionHeader prescriptions={prescriptions} /> */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create Prescription
      </button>
      <PrescriptionTable prescriptions={prescriptions} />
      {isModalOpen && (
        <AddPrescriptionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPrescription}
          availableMedicines={availableMedicines}
        />
      )}
    </div>
  );
};

export default Prescription;
