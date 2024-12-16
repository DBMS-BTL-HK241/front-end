import React, { useState, useEffect } from 'react';
import {
    fetchAppointments,
    fetchPatients,
    fetchDoctors,
    fetchClinics,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from '../../services/apiService';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [formData, setFormData] = useState({
        AppointmentID: 0,
        PatientID: 0,
        DoctorID: 0,
        ClinicID: 0,
        AppointmentDate: '',
        Status: 'Scheduled',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAppointmentsData();
        fetchPatientsData();
        fetchDoctorsData();
        fetchClinicsData();
    }, []);

    const fetchAppointmentsData = async () => {
        try {
            const response = await fetchAppointments();
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchPatientsData = async () => {
        try {
            const response = await fetchPatients();
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchDoctorsData = async () => {
        try {
            const response = await fetchDoctors();
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchClinicsData = async () => {
        try {
            const response = await fetchClinics();
            setClinics(response.data);
        } catch (error) {
            console.error('Error fetching clinics:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                let AppointmentID = formData.AppointmentID;
                delete formData.AppointmentID;
                await updateAppointment(AppointmentID, { AppointmentDate: formData.AppointmentDate, Status: formData.Status });
            } else {
                if ('AppointmentID' in formData) {
                    delete formData.AppointmentID;
                }
                await createAppointment(formData);
            }
            fetchAppointmentsData();
            setFormData({ AppointmentID: '', PatientID: '', DoctorID: '', ClinicID: '', AppointmentDate: '', Status: 'Scheduled' });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving appointment:', error);
        }
    };

    const handleEdit = (appointment) => {
        setFormData(appointment);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAppointment(id);
            fetchAppointmentsData();
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Appointments</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PatientID">
                        Patient
                    </label>
                    <select
                        name="PatientID"
                        id="PatientID"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.PatientID}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Patient</option>
                        {patients.map((patient) => (
                            <option key={patient.PatientID} value={patient.PatientID}>
                                {patient.Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DoctorID">
                        Doctor
                    </label>
                    <select
                        name="DoctorID"
                        id="DoctorID"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.DoctorID}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.DoctorID} value={doctor.DoctorID}>
                                {doctor.Name} - {doctor.Specialty}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ClinicID">
                        Clinic
                    </label>
                    <select
                        name="ClinicID"
                        id="ClinicID"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.ClinicID}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Clinic</option>
                        {clinics.map((clinic) => (
                            <option key={clinic.ClinicID} value={clinic.ClinicID}>
                                {clinic.Name} - {clinic.Address}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AppointmentDate">
                        Appointment Date
                    </label>
                    <input
                        type="datetime-local"
                        name="AppointmentDate"
                        id="AppointmentDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.AppointmentDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Status">
                        Status
                    </label>
                    <select
                        name="Status"
                        id="Status"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.Status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {isEditing ? 'Update' : 'Add'}
                </button>
            </form>

            <table className="table-auto w-full bg-white shadow-md rounded">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">Appointment ID</th>
                        <th className="px-4 py-2">Patient</th>
                        <th className="px-4 py-2">Doctor</th>
                        <th className="px-4 py-2">Clinic</th>
                        <th className="px-4 py-2">Appointment Date</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.AppointmentID} className="border-t">
                            <td className="px-4 py-2">{appointment.AppointmentID}</td>
                            <td className="px-4 py-2">{appointment.PatientName}</td>
                            <td className="px-4 py-2">{appointment.DoctorName}</td>
                            <td className="px-4 py-2">{appointment.ClinicName}</td>
                            <td className="px-4 py-2">{appointment.AppointmentDate}</td>
                            <td className="px-4 py-2">{appointment.Status}</td>
                            <td className="px-4 py-2 flex space-x-2">
                                <button
                                    onClick={() => handleEdit({
                                        AppointmentID: appointment.AppointmentID,
                                        PatientID: appointment.PatientID,
                                        DoctorID: appointment.DoctorID,
                                        ClinicID: appointment.ClinicID,
                                        AppointmentDate: appointment.AppointmentDate,
                                        Status: appointment.Status
                                    })}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(appointment.AppointmentID)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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
};

export default Appointments;
