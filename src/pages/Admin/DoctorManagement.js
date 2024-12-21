// DoctorManagement.js

import { getDoctorsWithPagination, fetchDoctorsByName, createDoctor, updateDoctor, deleteDoctor } from '../../services/apiService';
import { useEffect, useState } from 'react';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchNameMode, setSearchNameMode] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false); // Trạng thái để điều khiển hiển thị modal
    const [doctorForm, setDoctorForm] = useState({
        Name: '',
        Specialty: '',
        PhoneNumber: '',
        ClinicAddress: '',
        WorkingHours: {
            startTime: '',
            endTime: '',
            startDay: '',
            endDay: ''
        }
    });
    const [errors, setErrors] = useState({}); // Lưu các lỗi của form

    const [currentPage, setCurrentPage] = useState(1);  // Current page
    const [totalPages, setTotalPages] = useState(1);  // Total pages
    const numRecordOfPage = 3

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        fetchDoctorsData(currentPage);
    }, [currentPage]);

    const fetchDoctorsData = async (page) => {
        try {
            const response = await getDoctorsWithPagination(page, numRecordOfPage);
            setDoctors(response.data.doctors);
            setTotalPages(response.data.totalPages); // Giả sử API trả về tổng số trang
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearch = async () => {
        if (!searchName) {
            setSearchNameMode(false);
        } else {
            try {
                const response = await fetchDoctorsByName(searchName);
                setDoctors(response.data);
                setSearchNameMode(true);
            } catch (error) {
                console.error('Error searching doctor:', error);
            }
        }

    };

    // Handle form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctorForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Handle working hours change
    const handleWorkingHoursChange = (e) => {
        const { name, value } = e.target;
        setDoctorForm((prevForm) => ({
            ...prevForm,
            WorkingHours: {
                ...prevForm.WorkingHours,
                [name]: value
            }
        }));
    };

    // Format Working Hours to the required format
    const formatWorkingHours = () => {
        const { startTime, endTime, startDay, endDay } = doctorForm.WorkingHours;
        if (!startTime || !endTime || !startDay) return ''; // If missing start time, end time, or start day, return empty string

        if (!endDay) {
            // If no end day, format as one day
            return `${startDay}, ${startTime} - ${endTime}`;
        }

        if (startDay === endDay) {
            // If start day and end day are the same, format as one day
            return `${startDay}, ${startTime} - ${endTime}`;
        }

        // If the range covers multiple days, format as a range (e.g., Mon-Fri)
        const dayMap = {
            'Mon': 'Mon',
            'Tue': 'Tue',
            'Wed': 'Wed',
            'Thu': 'Thu',
            'Fri': 'Fri',
            'Sat': 'Sat',
            'Sun': 'Sun'
        };

        const startDayAbbr = dayMap[startDay];
        const endDayAbbr = dayMap[endDay];

        return `${startDayAbbr} - ${endDayAbbr}, ${startTime} - ${endTime}`;
    };

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        if (!doctorForm.Name) newErrors.Name = 'Name is required';
        if (!doctorForm.Specialty) newErrors.Specialty = 'Specialty is required';
        if (!doctorForm.PhoneNumber) newErrors.PhoneNumber = 'Phone Number is required';
        if (!doctorForm.ClinicAddress) newErrors.ClinicAddress = 'Clinic Address is required';
        if (!doctorForm.WorkingHours.startTime) newErrors.startTime = 'Start Time is required';
        if (!doctorForm.WorkingHours.endTime) newErrors.endTime = 'End Time is required';
        if (!doctorForm.WorkingHours.startDay) newErrors.startDay = 'Start Day is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle adding a new doctor
    const handleAddDoctor = async (e) => {
        e.preventDefault();
        const formattedWorkingHours = formatWorkingHours();
        if (!validateForm()) return; // If form validation fails, do not submit

        try {
            await createDoctor({ ...doctorForm, WorkingHours: formattedWorkingHours });
            handlePageChange(1); // Refresh the doctor list after adding
            setShowModal(false); // Hide the modal after submitting
            setDoctorForm({
                Name: '',
                Specialty: '',
                PhoneNumber: '',
                ClinicAddress: '',
                WorkingHours: {
                    startTime: '',
                    endTime: '',
                    startDay: '',
                    endDay: ''
                }
            });
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };

    // Handle updating doctor information
    const handleUpdateDoctor = async (e) => {
        e.preventDefault();
        const formattedWorkingHours = formatWorkingHours();
        if (!validateForm()) return; // If form validation fails, do not submit

        if (editingDoctor) {
            try {
                await updateDoctor(editingDoctor.DoctorID, { ...doctorForm, WorkingHours: formattedWorkingHours });
                fetchDoctorsData(currentPage); // Refresh the doctor list after updating
                setEditingDoctor(null);
                setShowModal(false); // Hide the modal after submitting
                setDoctorForm({
                    Name: '',
                    Specialty: '',
                    PhoneNumber: '',
                    ClinicAddress: '',
                    WorkingHours: {
                        startTime: '',
                        endTime: '',
                        startDay: '',
                        endDay: ''
                    }
                });
            } catch (error) {
                console.error('Error updating doctor:', error);
            }
        }
    };

    // Handle deleting a doctor
    const handleDeleteDoctor = async (doctorId) => {
        try {
            await deleteDoctor(doctorId);
            handlePageChange(1); // Refresh the doctor list after deletion
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    // Pre-fill form for editing doctor
    const handleEditDoctor = (doctor) => {
        setEditingDoctor(doctor);
        setDoctorForm({
            Name: doctor.Name,
            Specialty: doctor.Specialty,
            PhoneNumber: doctor.PhoneNumber,
            ClinicAddress: doctor.ClinicAddress,
            WorkingHours: {
                ...parseWorkingHours(doctor.WorkingHours)
            }
        });
        setShowModal(true); // Show the modal when editing
    };


    const isValidDay = (day) => daysOfWeek.includes(day);
    // const isValidTime = (time) => /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time); // Kiểm tra giờ theo định dạng HH:MM
    const isValidTime = (time) => /^([0-9]|[0-1]?[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/.test(time); // HH:MM format


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

    const parseWorkingHours = (workingHours) => {
        const [days, timeRange] = workingHours.split(',').map(part => part.trim()); // Tách ngày và giờ

        let startDay = '';
        let endDay = '';
        let startTime = '';
        let endTime = '';

        // Kiểm tra ngày
        const dayParts = days.split('-').map(part => part.trim());
        if (dayParts.length === 1 && isValidDay(dayParts[0])) {
            startDay = dayParts[0];
            endDay = ''; // Không có ngày kết thúc
        } else if (dayParts.length === 2 && isValidDay(dayParts[0]) && isValidDay(dayParts[1])) {
            startDay = dayParts[0];
            endDay = dayParts[1];
        }

        // Kiểm tra giờ
        const [startTimeString, endTimeString] = timeRange.split('-').map(part => part.trim());
        if (isValidTime(startTimeString) && isValidTime(endTimeString)) {
            startTime = convertHourFormat(startTimeString);
            endTime = convertHourFormat(endTimeString);
        }

        return {
            startDay,
            endDay,
            startTime,
            endTime,
        };
    };


    // Filter available end days based on selected start day
    const getAvailableEndDays = () => {
        const startIndex = daysOfWeek.indexOf(doctorForm.WorkingHours.startDay);
        return daysOfWeek.slice(startIndex + 1); // Only days after the start day
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold text-center mb-4">Doctor List</h1>

            <div className='flex justify-between'>

                {/* Search bar */}
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Enter doctor's name"
                        className="p-2 border border-gray-300 rounded mr-2"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Search
                    </button>
                </div>

                {/* Button to show the modal */}
                <button
                    onClick={() => setShowModal(true)} // Show the modal when clicking 'Add Doctor'
                    className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
                >
                    Add Doctor
                </button>
            </div>

            <div className={`${!searchNameMode ? "hidden" : ""}`}>
                Result of search: <span className='text-xl font-bold'>{searchName}</span> 
                <button
                    onClick={() => {
                        setSearchNameMode(false);
                        if (currentPage === 1){
                            fetchDoctorsData(1);
                        }else{
                            handlePageChange(1);
                        }
                    }}
                    className='ml-1 p-1 bg-red-500 text-white rounded mb-4'>
                    Remove search
                </button>
            </div>

            {/* Modal to Add / Edit Doctor */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-2xl mb-2">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                        <form onSubmit={editingDoctor ? handleUpdateDoctor : handleAddDoctor}>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="Name"
                                    value={doctorForm.Name}
                                    onChange={handleInputChange}
                                    placeholder="Doctor's Name"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                {errors.Name && <p className="text-red-500 text-sm">{errors.Name}</p>}

                                <input
                                    type="text"
                                    name="Specialty"
                                    value={doctorForm.Specialty}
                                    onChange={handleInputChange}
                                    placeholder="Specialty"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                {errors.Specialty && <p className="text-red-500 text-sm">{errors.Specialty}</p>}

                                <input
                                    type="text"
                                    name="PhoneNumber"
                                    value={doctorForm.PhoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                {errors.PhoneNumber && <p className="text-red-500 text-sm">{errors.PhoneNumber}</p>}

                                <input
                                    type="text"
                                    name="ClinicAddress"
                                    value={doctorForm.ClinicAddress}
                                    onChange={handleInputChange}
                                    placeholder="Clinic Address"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                {errors.ClinicAddress && <p className="text-red-500 text-sm">{errors.ClinicAddress}</p>}

                                {/* Working Hours */}
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        name="startDay"
                                        value={doctorForm.WorkingHours.startDay}
                                        onChange={handleWorkingHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                    >
                                        <option value="">Start Day</option>
                                        {daysOfWeek.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    {errors.startDay && <p className="text-red-500 text-sm">{errors.startDay}</p>}

                                    <select
                                        name="endDay"
                                        value={doctorForm.WorkingHours.endDay}
                                        onChange={handleWorkingHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                        disabled={!doctorForm.WorkingHours.startDay}
                                    >
                                        <option value="">End Day</option>
                                        {getAvailableEndDays().map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={doctorForm.WorkingHours.startTime}
                                        onChange={handleWorkingHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                    />
                                    {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}

                                    <input
                                        type="time"
                                        name="endTime"
                                        value={doctorForm.WorkingHours.endTime}
                                        onChange={handleWorkingHoursChange}
                                        className="p-2 border border-gray-300 rounded"
                                    />
                                    {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingDoctor(null);
                                            setDoctorForm({
                                                Name: '',
                                                Specialty: '',
                                                PhoneNumber: '',
                                                ClinicAddress: '',
                                                WorkingHours: {
                                                    startTime: '',
                                                    endTime: '',
                                                    startDay: '',
                                                    endDay: ''
                                                }
                                            });
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded"
                                    >
                                        {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table to display doctors */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left w-16">Doctor ID</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Specialty</th>
                            <th className="px-4 py-2 text-left">Phone Number</th>
                            <th className="px-4 py-2 text-left">Clinic Address</th>
                            <th className="px-4 py-2 text-left">Working Hours</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor.DoctorID} className="border-t">
                                <td className="px-4 py-2">{doctor.DoctorID}</td>
                                <td className="px-4 py-2">{doctor.Name}</td>
                                <td className="px-4 py-2">{doctor.Specialty}</td>
                                <td className="px-4 py-2">{doctor.PhoneNumber}</td>
                                <td className="px-4 py-2">{doctor.ClinicAddress}</td>
                                <td className="px-4 py-2">{doctor.WorkingHours}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleEditDoctor(doctor)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDoctor(doctor.DoctorID)}
                                        className="px-4 py-2 bg-red-500 text-white rounded ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className={`${searchNameMode ? "hidden" : "flex"} justify-center mt-4`}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                >
                    Previous
                </button>
                <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DoctorManagement;
