import React, { useEffect, useState } from 'react';
import { fetchAppointmentsCalendar, updateAppointment } from '../../services/apiService';
import { Calendar, Badge, Stack } from 'rsuite';

// Fetch appointments for a selected date
const getAppointmentsForDate = (appointments, date) => {
    if (!date) return []; // Ensure date is valid
    const dateString = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    return appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.AppointmentDate);
        return appointmentDate.toISOString().split('T')[0] === dateString; // Compare only the date part
    });
};

function renderCell(date, appointments) {
    if (!date) return null; // Ensure date is valid
    const list = getAppointmentsForDate(appointments, date);

    if (list.length) {
        return <Badge className="calendar-todo-item-badge" content={list.length} />;
    }

    return null;
}

const AppointmentsCalendar = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    // Fetch appointments data from the API
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetchAppointmentsCalendar(); // Assuming this function returns appointment data
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
    }, []);

    const handleSelect = date => {
        setSelectedDate(date);
    };

    const list = selectedDate ? getAppointmentsForDate(appointments, selectedDate) : [];

    return (
        <div className="mt-[100px] ml-10 mr-10">
            <h1 className="text-2xl font-bold mb-4 text-center">Appointments Calendar</h1>
            <Stack direction="row" spacing={10} alignItems="flex-start" wrap>
                <Calendar
                    compact
                    renderCell={(date) => renderCell(date, appointments)}
                    onSelect={handleSelect}
                />
            </Stack>
            <TodoList date={selectedDate} appointments={appointments} setAppointments={setAppointments} />
        </div>
    );
};

const TodoList = ({ date, appointments, setAppointments }) => {
    const updateStatus = async (appointmentID, status) => {
        try {
            // Update the appointment status via API
            const updatedAppointment = await updateAppointment(appointmentID, { Status: status });

            // Update the local state with the updated appointment
            setAppointments(prevAppointments =>
                prevAppointments.map(appointment =>
                    appointment.AppointmentID === appointmentID
                        ? { ...appointment, Status: status } // Update only the status of the selected appointment
                        : appointment
                )
            );
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };

    if (!date) return null; // Ensure date is valid

    const list = getAppointmentsForDate(appointments, date);

    if (!list.length) {
        return <div>No appointments for this day.</div>;
    }

    return (
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
                {list.map((appointment) => (
                    <tr key={appointment.AppointmentID} className="border-t">
                        <td className="px-4 py-2">{appointment.AppointmentID}</td>
                        <td className="px-4 py-2">{appointment.PatientName}</td>
                        <td className="px-4 py-2">{appointment.DoctorName}</td>
                        <td className="px-4 py-2">{appointment.ClinicName}</td>
                        <td className="px-4 py-2">{appointment.AppointmentDate}</td>
                        <td className="px-4 py-2">{appointment.Status}</td>
                        <td className="px-4 py-2 flex space-x-2">
                            <button
                                onClick={() => updateStatus(appointment.AppointmentID, 'Completed')}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Completed
                            </button>
                            <button
                                onClick={() => updateStatus(appointment.AppointmentID, 'Cancelled')}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Cancelled
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AppointmentsCalendar;
