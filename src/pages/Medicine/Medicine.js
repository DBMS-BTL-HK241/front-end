import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicineTable from "../../components/Medicine/MedicineTable";
import MedicineForm from "../../components/Medicine/MedicineForm";
import Modal from "../../components/Medicine/Modal";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      axios
        .get("http://localhost:3001/medicine", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProfileData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  // Thêm thuốc
  const handleAddMedicine = (medicine) => {
    setMedicines([...medicines, { id: Date.now(), ...medicine }]);
    setOpenForm(false);
  };

  // Chỉnh sửa thuốc
  const handleEditMedicine = (updatedMedicine) => {
    setMedicines(
      medicines.map((med) =>
        med.id === updatedMedicine.id ? updatedMedicine : med
      )
    );
    setOpenForm(false);
    setEditMedicine(null);
  };

  // Xóa thuốc
  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  // Mở biểu mẫu
  const openAddForm = () => {
    setEditMedicine(null);
    setOpenForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Medicine Management</h1>
        <button
          onClick={openAddForm}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm Thuốc
        </button>
        <MedicineTable
          medicines={medicines}
          onEdit={(medicine) => {
            setEditMedicine(medicine);
            setOpenForm(true);
          }}
          onDelete={handleDeleteMedicine}
        />
        <Modal isOpen={openForm} onClose={() => setOpenForm(false)}>
          <h2 className="text-lg font-bold mb-4">
            {editMedicine ? "Chỉnh Sửa Thuốc" : "Thêm Thuốc"}
          </h2>
          <MedicineForm
            onSubmit={editMedicine ? handleEditMedicine : handleAddMedicine}
            initialData={editMedicine}
            onClose={() => setOpenForm(false)}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Profile;
