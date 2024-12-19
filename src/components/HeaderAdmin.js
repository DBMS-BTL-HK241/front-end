import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // Import biểu tượng logout

function HeaderAdmin({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-1/6 bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6">
                <div className="flex items-center space-x-4">
                    <img
                        src="/logo192.png"
                        alt="Logo"
                        className="h-10 w-10 object-contain"
                    />
                    <h1 className="text-xl font-bold">
                        <Link to="/profile" className="hover:text-white transition-colors">
                            Admin Dashboard
                        </Link>
                    </h1>
                </div>

                <ul className="space-y-8 mt-10">
                    <li>
                        <Link
                            to="/appointmentschart"
                            className="block text-lg font-medium text-white transition-all hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Appointments Chart
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="block text-lg font-medium text-white transition-all hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Revenue
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="block text-lg font-medium text-white transition-all hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Doctor management
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="block text-lg font-medium text-white transition-all hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Clinic management
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="block text-lg font-medium text-white transition-all hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Medicine management
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="block text-lg font-medium text-white transition-all hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            Profile
                        </Link>
                    </li>
                </ul>

                <button
                    onClick={handleLogout}
                    className="mt-10 flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
                >
                    <FiLogOut className="text-xl" />
                    <span>Logout</span>
                </button>
            </div>

            {/* Right Side (Content Area) */}
            <div className="w-5/6 p-6 overflow-auto">
                {children}
            </div>
        </div>
    );
}

export default HeaderAdmin;
