import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Interceptor to include token in every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication APIs
export const login = (credentials) => API.post('/auth/login', credentials);
export const logout = () => {
    localStorage.removeItem('token');
};

// User-related APIs
export const fetchProfile = () => API.get('/profile');

// Appointment-related APIs
export const fetchAppointments = () => API.get('api/appointments');
export const createAppointment = (data) => API.post('api/appointments', data);
export const updateAppointment = (AppointmentID, data) => API.put(`api/appointments/${AppointmentID}`, data);
export const deleteAppointment = (AppointmentID) => API.delete(`api/appointments/${AppointmentID}`);

// Patient-related APIs
export const fetchPatients = () => API.get('api/patients');

// Doctor-related APIs
export const fetchDoctors = () => API.get('api/doctors');

// Clinic-related APIs
export const fetchClinics = () => API.get('api/clinics');

export default API;