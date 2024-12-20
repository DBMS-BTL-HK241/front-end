import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function MedicineForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { name: "", manufacturer: "", quantity: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
      <TextField
        label="Tên Thuốc"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Hãng Sản Xuất"
        name="manufacturer"
        value={formData.manufacturer}
        onChange={handleChange}
        required
      />
      <TextField
        label="Số Lượng"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        {initialData ? "Cập Nhật" : "Thêm"}
      </Button>
    </Box>
  );
}

export default MedicineForm;
