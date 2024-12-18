import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, logout } from '../services/apiService';

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile()
            .then((response) => {
                setProfileData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching profile:', error);
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('./hospital.png')",
                backgroundSize: '60%',
            }}
        >
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-80 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Profile</h2>
                <p className="text-lg text-gray-700">Username: {profileData.username}</p>
                <p className="text-lg text-gray-700">Role: {profileData.role}</p>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Profile;
