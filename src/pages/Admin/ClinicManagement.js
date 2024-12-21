import React, { useState, useEffect } from 'react';
import { fetchClinics, createClinic, updateClinic, deleteClinic } from '../../services/apiService';

import { Link } from 'react-router-dom'; // Import Link for navigation

const ClinicManagement = () => {
    const [clinics, setClinics] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingClinic, setEditingClinic] = useState(null);
    const [clinicForm, setClinicForm] = useState({
        Name: '',
        Address: '',
        PhoneNumber: '',
        OpeningHours: {
            startDay: '',
            endDay: '',
            startTime: '',
            endTime: ''
        }
    });
    const [errors, setErrors] = useState({});
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        const loadClinics = async () => {
            try {
                const response = await fetchClinics();
                setClinics(response.data);
            } catch (error) {
                console.error("Error fetching clinics:", error);
            }
        };
        loadClinics();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClinicForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleOpeningHoursChange = (e) => {
        const { name, value } = e.target;
        setClinicForm((prevForm) => ({
            ...prevForm,
            OpeningHours: {
                ...prevForm.OpeningHours,
                [name]: value
            }
        }));
    };

    const formatOpeningHours = () => {
        const { startTime, endTime, startDay, endDay } = clinicForm.OpeningHours;
        if (!startTime || !endTime || !startDay) return '';

        if (!endDay) {
            return `${startDay}, ${startTime} - ${endTime}`;
        }

        if (startDay === endDay) {
            return `${startDay}, ${startTime} - ${endTime}`;
        }

        return `${startDay} - ${endDay}, ${startTime} - ${endTime}`;
    };

    const convertHourFormat = (hour) => {
        let [part1, part2] = hour.split(':');
    
        if (part1.length === 1) {
          part1 = `0${part1}`;
        }
    
        if (part2.length === 1) {
          part2 = `0${part2}`;
        }
    
        return `${part1}:${part2}`
      }

    const parseOpeningHours = (openingHours) => {
        const [days, timeRange] = openingHours.split(',').map(part => part.trim());
        let startDay = '';
        let endDay = '';
        let startTime = '';
        let endTime = '';

        const dayParts = days.split('-').map(part => part.trim());
        if (dayParts.length === 1 && isValidDay(dayParts[0])) {
            startDay = dayParts[0];
            endDay = ''; // No end day
        } else if (dayParts.length === 2 && isValidDay(dayParts[0]) && isValidDay(dayParts[1])) {
            startDay = dayParts[0];
            endDay = dayParts[1];
        }

        const [startTimeString, endTimeString] = timeRange.split('-').map(part => part.trim());
        if (isValidTime(startTimeString) && isValidTime(endTimeString)) {
            startTime = convertHourFormat(startTimeString);

            endTime = convertHourFormat(endTimeString);

        }

        return { startDay, endDay, startTime, endTime };
    };

    const isValidDay = (day) => daysOfWeek.includes(day);
    const isValidTime = (time) => /^([0-9]|[0-1]?[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/.test(time); // HH:MM format

    const getAvailableEndDays = () => {
        const startIndex = daysOfWeek.indexOf(clinicForm.OpeningHours.startDay);
        return daysOfWeek.slice(startIndex + 1); // Only days after the start day
    };

    const validateForm = () => {
        const newErrors = {};
        if (!clinicForm.Name) newErrors.Name = 'Name is required';
        if (!clinicForm.Address) newErrors.Address = 'Address is required';
        if (!clinicForm.PhoneNumber) newErrors.PhoneNumber = 'Phone Number is required';
        if (!clinicForm.OpeningHours.startTime) newErrors.startTime = 'Start Time is required';
        if (!clinicForm.OpeningHours.endTime) newErrors.endTime = 'End Time is required';
        if (!clinicForm.OpeningHours.startDay) newErrors.startDay = 'Start Day is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddClinic = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formattedOpeningHours = formatOpeningHours();
            const clinicToAdd = { ...clinicForm, OpeningHours: formattedOpeningHours };
            await createClinic(clinicToAdd);
            setClinics((prevClinics) => [...prevClinics, clinicToAdd]);
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error adding clinic:', error);
        }
    };

    const handleUpdateClinic = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formattedOpeningHours = formatOpeningHours();
            const clinicToUpdate = { ...clinicForm, OpeningHours: formattedOpeningHours };
            await updateClinic(editingClinic.ClinicID, clinicToUpdate);
            setClinics((prevClinics) =>
                prevClinics.map((clinic) =>
                    clinic.ClinicID === editingClinic.ClinicID ? { ...clinic, ...clinicToUpdate } : clinic
                )
            );
            setEditingClinic(null);
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error updating clinic:', error);
        }
    };

    const handleEditClinic = (clinic) => {
        setEditingClinic(clinic);
        setClinicForm({
            Name: clinic.Name,
            Address: clinic.Address,
            PhoneNumber: clinic.PhoneNumber,
            OpeningHours: {
                ...parseOpeningHours(clinic.OpeningHours)
            }
        });
        setShowModal(true); // Show the modal when editing
    };

    const handleDeleteClinic = async (clinicId) => {
        try {
            await deleteClinic(clinicId);
            setClinics((prevClinics) => prevClinics.filter((clinic) => clinic.ClinicID !== clinicId));
        } catch (error) {
            console.error('Error deleting clinic:', error);
        }
    };

    const resetForm = () => {
        setClinicForm({
            Name: '',
            Address: '',
            PhoneNumber: '',
            OpeningHours: {
                startDay: '',
                endDay: '',
                startTime: '',
                endTime: ''
            }
        });
        setErrors({});
    };

    return (
        <div className="clinic-management">
            <h2 className="text-2xl font-semibold mb-4">Clinic List</h2>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            >
                Add Clinic
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Clinic Name</th>
                            <th className="px-4 py-2 text-left">Address</th>
                            <th className="px-4 py-2 text-left">Phone Number</th>
                            <th className="px-4 py-2 text-left">Opening Hours</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinics.map((clinic) => (
                            <tr key={clinic.ClinicID} className="border-t">
                                <td className="px-4 py-2">{clinic.Name}</td>
                                <td className="px-4 py-2">{clinic.Address}</td>
                                <td className="px-4 py-2">{clinic.PhoneNumber}</td>
                                <td className="px-4 py-2">{clinic.OpeningHours}</td>
                                <div className="px-4 py-2">
                                    <button className="px-4 py-2 bg-green-500 text-white rounded">
                                        <Link to={`/clinic-detail/${clinic.ClinicID}`} className="block hover:no-underline hover:text-white">
                                            View
                                        </Link>
                                    </button>

                                    <button
                                        onClick={() => handleEditClinic(clinic)}
                                        className="px-4 py-2 ml-2 bg-yellow-500 text-white rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDeleteClinic(clinic.ClinicID)}
                                        className="px-4 py-2 ml-2 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal to Add / Edit Clinic */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-2xl mb-2">{editingClinic ? 'Edit Clinic' : 'Add New Clinic'}</h2>
                        <form onSubmit={editingClinic ? handleUpdateClinic : handleAddClinic}>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="Name"
                                    value={clinicForm.Name}
                                    onChange={handleInputChange}
                                    placeholder="Clinic Name"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                {errors.Name && <p className="text-red-500 text-sm">{errors.Name}</p>}

                                <input
                                    type="text"
                                    name="Address"
                                    value={clinicForm.Address}
                                    onChange={handleInputChange}
                                    placeholder="Address"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                {errors.Address && <p className="text-red-500 text-sm">{errors.Address}</p>}

                                <input
                                    type="text"
                                    name="PhoneNumber"
                                    value={clinicForm.PhoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                {errors.PhoneNumber && <p className="text-red-500 text-sm">{errors.PhoneNumber}</p>}

                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        name="startDay"
                                        value={clinicForm.OpeningHours.startDay}
                                        onChange={handleOpeningHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                    >
                                        <option value="">Start Day</option>
                                        {daysOfWeek.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.startDay && <p className="text-red-500 text-sm">{errors.startDay}</p>}

                                    <select
                                        name="endDay"
                                        value={clinicForm.OpeningHours.endDay}
                                        onChange={handleOpeningHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                        disabled={!clinicForm.OpeningHours.startDay}
                                    >
                                        <option value="">End Day</option>
                                        {getAvailableEndDays().map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="time"
                                        name="startTime"
                                        value={clinicForm.OpeningHours.startTime}
                                        onChange={handleOpeningHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                    />
                                    {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}

                                    <input
                                        type="time"
                                        name="endTime"
                                        value={clinicForm.OpeningHours.endTime}
                                        onChange={handleOpeningHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                    />
                                    {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingClinic(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    {editingClinic ? 'Update Clinic' : 'Add Clinic'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicManagement;
