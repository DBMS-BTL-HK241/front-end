import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function HeaderDoctor() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-green-500 to-green-300 text-white py-4 shadow-md fixed top-0 left-0 w-full z-50 mb-8">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center space-x-4">
          <img
            src="/logo192.png"
            alt="Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-bold">
            <Link
              to="/profile"
              className="hover:text-blue-300 transition-colors"
            >
              Doctor Dashboard
            </Link>
          </h1>
        </div>

                <div className="flex items-center space-x-12">
                    <nav>
                        <ul className="flex space-x-12">
                            <li>
                                <Link
                                    to="/AppointmentsCalendar"
                                    className="relative text-lg font-medium transition-all hover:text-blue-300 group"
                                >
                                    Appointments Calendar
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/payments"
                                    className="relative text-lg font-medium transition-all hover:text-blue-300 group"
                                >
                                    Payments
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/prescription"
                                    className="relative text-lg font-medium transition-all hover:text-blue-300 group"
                                >
                                    Prescriptions
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="relative text-lg font-medium transition-all hover:text-blue-300 group"
                                >
                                    Profile
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderDoctor;
