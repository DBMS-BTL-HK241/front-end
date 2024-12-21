import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { fetchClinicById, fetchDoctorsByClinic, fetchDoctorsNotInClinic, addDoctorToClinic, removeDoctorFromClinic } from '../../services/apiService';

const ClinicDetail = () => {
    const { clinicId } = useParams(); 
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [availableDoctors, setAvailableDoctors] = useState([]); // Bác sĩ chưa thuộc phòng khám
    const [selectedDoctorId, setSelectedDoctorId] = useState(""); // Doctor ID cho select
    const [error, setError] = useState("");

    useEffect(() => {
        const loadClinicDetails = async () => {
            try {
                const clinicResponse = await fetchClinicById(clinicId);
                setClinic(clinicResponse.data);

                const doctorsResponse = await fetchDoctorsByClinic(clinicId);
                setDoctors(doctorsResponse.data);

                // Lấy bác sĩ chưa thuộc phòng khám
                const availableDoctorsResponse = await fetchDoctorsNotInClinic();
                setAvailableDoctors(availableDoctorsResponse.data);
            } catch (error) {
                console.error("Error fetching clinic details:", error);
            }
        };

        loadClinicDetails();
    }, [clinicId]);

    const handleAddDoctor = async () => {
        if (!selectedDoctorId) {
            setError("Please select a doctor to add.");
            return;
        }

        try {
            await addDoctorToClinic({ clinicID: clinicId, doctorID: selectedDoctorId });
            setError("");
            setSelectedDoctorId(""); // Clear the select field after adding the doctor
            const updatedDoctors = await fetchDoctorsByClinic(clinicId);
            setDoctors(updatedDoctors.data);
            // Cập nhật lại danh sách bác sĩ chưa thuộc phòng khám
            const availableDoctorsResponse = await fetchDoctorsNotInClinic(clinicId);
            setAvailableDoctors(availableDoctorsResponse.data);
        } catch (error) {
            setError("Error adding doctor.");
        }
    };

    const handleRemoveDoctor = async (doctorId) => {
        try {
            await removeDoctorFromClinic(clinicId, doctorId);
            const updatedDoctors = await fetchDoctorsByClinic(clinicId);
            setDoctors(updatedDoctors.data);
            // Cập nhật lại danh sách bác sĩ chưa thuộc phòng khám
            const availableDoctorsResponse = await fetchDoctorsNotInClinic();
            setAvailableDoctors(availableDoctorsResponse.data);
        } catch (error) {
            setError("Error removing doctor.");
        }
    };

    if (!clinic) {
        return <p>Loading clinic details...</p>;
    }

    return (
        <div className="clinic-detail container mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6">{clinic.Name} - Details</h2>
            
            <div className="mb-6">
                <strong className="block text-lg">Address:</strong>
                <p>{clinic.Address}</p>
            </div>
            <div className="mb-6">
                <strong className="block text-lg">Phone Number:</strong>
                <p>{clinic.PhoneNumber}</p>
            </div>
            <div className="mb-6">
                <strong className="block text-lg">Opening Hours:</strong>
                <p>{clinic.OpeningHours}</p>
            </div>
            
            <h3 className="text-2xl font-semibold mb-4">Doctors at this Clinic</h3>
            
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left w-16">Doctor ID</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Specialty</th>
                            <th className="px-4 py-2 text-left">Phone Number</th>
                            <th className="px-4 py-2 text-left">Working Hours</th>
                            <th className="px-4 py-2 text-left">Start Work Date</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => (
                                <tr key={doctor.DoctorID} className="border-t">
                                    <td className="px-4 py-2">{doctor.DoctorID}</td>
                                    <td className="px-4 py-2">{doctor.Name}</td>
                                    <td className="px-4 py-2">{doctor.Specialty}</td>
                                    <td className="px-4 py-2">{doctor.PhoneNumber}</td>
                                    <td className="px-4 py-2">{doctor.WorkingHours}</td>
                                    <td className="px-4 py-2">{doctor.StartWorkDate}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleRemoveDoctor(doctor.DoctorID)}
                                            className="px-4 py-2 bg-red-500 text-white rounded ml-2"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-lg px-4 py-2 text-center">No doctors work in this clinic.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <h4 className="text-xl font-semibold mb-2">Add Doctor to Clinic</h4>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded mb-4"
                >
                    <option value="">Select a Doctor</option>
                    {availableDoctors.map((doctor) => (
                        <option key={doctor.DoctorID} value={doctor.DoctorID}>
                            {doctor.Name} - {doctor.Specialty}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleAddDoctor}
                    className="px-4 py-2 ml-2 bg-green-500 text-white rounded"
                >
                    Add Doctor Into Clinic
                </button>
            </div>
        </div>
    );
};

export default ClinicDetail;
