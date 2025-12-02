import React from 'react';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import useAuthStore from '../context/authStore';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🚗 Travel Assist
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/bookings" className="text-gray-700 hover:text-blue-600">
                  Bookings
                </Link>
                {user.role === 'mechanic' && (
                  <Link to="/mechanic-dashboard" className="text-gray-700 hover:text-blue-600">
                    Mechanic Hub
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin-panel" className="text-gray-700 hover:text-blue-600">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-700" />
                  <span className="text-gray-700">{user.firstName}</span>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/bookings" className="block py-2 text-gray-700 hover:text-blue-600">
                  Bookings
                </Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600 hover:text-red-800">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-gray-700 hover:text-blue-600">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
