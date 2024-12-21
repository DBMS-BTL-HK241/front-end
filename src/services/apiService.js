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
export const register = (credentials) => API.post('/auth/register', credentials);
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
export const fetchAppointmentsChart = () => API.get(`api/appointments/statistics/monthly`);
export const fetchAppointmentsCalendar = (start, end) => {
    return API.get('api/appointments/calendar', {
        params: {
            start,
            end,
        },
    });
};

// Patient-related APIs
export const fetchPatients = () => API.get('/api/patients');

// Doctor-related APIs
export const fetchDoctors = () => API.get('/api/doctors');
export const fetchDoctorById = (DoctorId) => API.get(`/api/doctors/${DoctorId}`);

// Thêm bác sĩ
/*
{
    Name: 'Dr. John Smith',
    Specialty: 'Cardiology',
    PhoneNumber: '1234567890',
    ClinicAddress: '123 Heart Ave',
    WorkingHours: 'Mon-Fri 9:00 AM - 5:00 PM',
}
*/
export const createDoctor = (data) => API.post('/api/doctors', data);

// sửa thông tin bác sĩ
/*
{
    Name: 'Dr. John Smith',
    Specialty: 'Cardiology',
    PhoneNumber: '1234567890',
    ClinicAddress: '123 Heart Ave',
    WorkingHours: 'Mon-Fri 9:00 AM - 5:00 PM',
}
*/
export const updateDoctor = (DoctorId, data) => API.put(`/api/doctors/${DoctorId}`, data);
export const deleteDoctor = (DoctorId) => API.delete(`/api/doctors/${DoctorId}`);


// Lấy danh sách bác sĩ với phân trang
export const getDoctorsWithPagination = (page = 1, limit = 2) => {
    return API.get('api/doctors/pagination', {
        params: {
            page,
            limit
        }
    });
};

export const fetchDoctorByName = (name) => {
    return API.get('api/doctors/search', {
        params: {
            name
        },
    });
};

// Clinic-related APIs
/*
output
{
    ClinicID: uuidv4,
    Name: 'Brain Health Center',
    Address: '654 Brain Rd',
    PhoneNumber: '9998887777',
    OpeningHours: 'Mon-Fri, 7:00 - 15:00',
}
*/
export const fetchClinics = () => API.get('api/clinics');

// Lấy thông tin một phòng khám theo ID
export const fetchClinicById = (clinicId) => API.get(`/api/clinics/${clinicId}`);

// Thêm mới một phòng khám
/*
{
    Name: 'Brain Health Center',c
    Address: '654 Brain Rd',
    PhoneNumber: '9998887777',
    OpeningHours: 'Mon-Fri, 7:00 - 15:00',
}
*/
export const createClinic = (data) => API.post('/api/clinics', data);

// Chỉnh sửa thông tin phòng khám
/*
{
    Name: 'Brain Health Center',
    Address: '654 Brain Rd',
    PhoneNumber: '9998887777',
    OpeningHours: 'Mon-Fri, 7:00 - 15:00',
}
*/
export const updateClinic = (clinicId, data) => API.put(`/api/clinics/${clinicId}`, data);

// Xóa một phòng khám
export const deleteClinic = (clinicId) => API.delete(`/api/clinics/${clinicId}`);

// Thêm bác sĩ vào phòng khám
/*
{
    clinicID: 'clinic123',
    doctorID: 'doctor456'
}
*/
export const addDoctorToClinic = (data) => API.post('/api/clinics/add-doctor', data);

// Xóa bác sĩ khỏi phòng khám
/*
{
    clinicID: 'clinic123',
    doctorID: 'doctor456'

    clinicID, doctorID
}
*/
export const removeDoctorFromClinic = (clinicId, doctorId) => API.delete(`/api/clinics/${clinicId}/remove-doctor/${doctorId}`);

// Lấy danh sách bác sĩ của một phòng khám
/*
output
[{
    DoctorID: uuidv4,
    Name: 'Brain',
    Specialty: 'Heart',
    startWorkDate: date,
}]
*/
export const fetchDoctorsByClinic = (clinicId) => API.get(`/api/clinics/${clinicId}/doctors`);

// Lấy danh sách bác sĩ không thuộc phòng khám nào
export const fetchDoctorsNotInClinic = () => API.get('/api/clinics/doctors/not-in-clinic');


// Lấy danh sách bác sĩ theo khoảng thời gian
/*
output
[{
    DoctorID: uuidv4,
    Name: 'Brain',
    Specialty: 'Heart',
    startWorkDate: date,
}]
*/
export const fetchDoctorsByDateRange = (clinicId, startDate, endDate) => {
    return API.get(`/api/clinics/${clinicId}/doctors/date-range`, {
        params: {
            startDate,
            endDate
        }
    });
};


export default API;