import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

function HeaderAdmin() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
                <ul className="space-y-4">
                    <li>
                        <Link to="/appointmentschart" className="block hover:underline text-lg">
                            Appointments
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="block hover:underline text-lg">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                        >
                            Logout
                        </button>
                    </li>
                    {/* Add more menu items here as needed */}
                </ul>
            </div>

            {/* Right Side (Content Area) */}
            <div className="w-3/4 p-6 overflow-auto">
                <Outlet /> {/* Render the dynamic content here */}
            </div>
        </div>
    );
}

export default HeaderAdmin;
