import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicineTable from "../../components/Medicine/MedicineTable";
import MedicineForm from "../../components/Medicine/MedicineForm";
import Modal from "../../components/Medicine/Modal";

function Medicine() {
  // const [profileData, setProfileData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log(token);

    if (token) {
      axios
        .get("http://localhost:3001/medicine", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Successful !", response.data);
          setMedicines(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!medicines) {
    return <div>Loading...</div>;
  }

  // Thêm thuốc
  const handleAddMedicine = async (medicine) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("http://localhost:3001/medicine", medicine, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Cập nhật danh sách thuốc ngay sau khi thêm
      setMedicines((prevMedicines) => {
        const updatedMedicines = [...prevMedicines, response.data];
        console.log("Updated medicines:", updatedMedicines);
        return updatedMedicines;
      });
  
      console.log("response", response.data);
      setOpenForm(false);
    } catch (error) {
      console.error("There was an error adding the medicine!", error);
    }
  };
  

  // Chỉnh sửa thuốc
  const handleEditMedicine = async (updatedMedicine) => {
    const token = localStorage.getItem("token");
    console.log("updated medicine:", updatedMedicine);
    try {
      await axios.put(`http://localhost:3001/medicine/`, updatedMedicine, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMedicines(
        medicines.map((med) =>
          med.id === updatedMedicine.id ? updatedMedicine : med
        )
      );
      setOpenForm(false);
      setEditMedicine(null);
    } catch (error) {
      console.error("There was an error updating the medicine!", error);
    }
  };

  const handleDeleteMedicine = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this medicine?");
    if (confirmed) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:3001/medicine/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMedicines(medicines.filter((medicine) => medicine.id !== id));
      } catch (error) {
        console.error("There was an error deleting the medicine!", error);
      }
    }
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
            console.log("medicine2", medicine);
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

export default Medicine;
