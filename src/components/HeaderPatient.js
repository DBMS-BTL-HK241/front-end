import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold">
                    <Link to="/profile">Patient Dashboard</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/appointments" className="hover:underline">
                                Appointments
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className="hover:underline">
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
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
