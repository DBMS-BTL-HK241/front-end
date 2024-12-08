import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import MedicineTable from "./components/MedicineTable";
import MedicineForm from "./components/MedicineForm";

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [editMedicine, setEditMedicine] = useState(null);
  

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios
                .get('http://localhost:3001/medicine', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => {
                    setProfileData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error);
                });
        } else {
            window.location.href = '/login';
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
        <Container>
        <Typography variant="h4" gutterBottom sx={{ marginTop: 2 }}>
          Quản Lý Thuốc
        </Typography>
        <Button variant="contained" color="primary" onClick={openAddForm}>
          Thêm Thuốc
        </Button>
        <MedicineTable
          medicines={medicines}
          onEdit={(medicine) => {
            setEditMedicine(medicine);
            setOpenForm(true);
          }}
          onDelete={handleDeleteMedicine}
        />
        <Dialog open={openForm} onClose={() => setOpenForm(false)}>
          <DialogTitle>{editMedicine ? "Chỉnh Sửa Thuốc" : "Thêm Thuốc"}</DialogTitle>
          <DialogContent>
            <MedicineForm
              onSubmit={editMedicine ? handleEditMedicine : handleAddMedicine}
              initialData={editMedicine}
            />
          </DialogContent>
        </Dialog>
      </Container>
    );
}

export default Profile;
