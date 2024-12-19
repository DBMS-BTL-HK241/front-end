import React, { useEffect, useState } from "react";
import PrescriptionHeader from "../../components/Prescription/PrescriptionHeader";
import PrescriptionTable from "../../components/Prescription/PrescriptionTable";
import TotalPrice from "../../components/Prescription/TotalPrice";

const Prescription = ({ prescriptionId }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.example.com/prescriptions/${prescriptionId}`);
        if (!response.ok) throw new Error("Failed to fetch prescription details");
        const data = await response.json();
        setPrescription(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Prescription Details</h1>
      <PrescriptionHeader
        doctor={prescription.doctor}
        patient={prescription.patient}
        date={prescription.date}
      />
      <PrescriptionTable medicines={prescription.medicines} />
      <TotalPrice totalPrice={prescription.totalPrice} />
    </div>
  );
};

export default Prescription;
