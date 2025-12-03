import React, { useState, useEffect } from 'react';
import useAuthStore from '../context/authStore';
import { serviceAPI } from '../services/api';
import { FaMapMarkerAlt, FaPhone, FaStar } from 'react-icons/fa';
import ServiceRequestModal from '../components/ServiceRequestModal';

const DashboardPage = () => {
  const { user, token } = useAuthStore();
  const [nearbyMechanics, setNearbyMechanics] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNearbyMechanics();
    fetchUserRequests();
  }, []);

  const fetchNearbyMechanics = async () => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams({
        latitude: 28.7041,
        longitude: 77.1025,
        maxDistance: 10,
      });
      const response = await serviceAPI.getNearbyMechanics(query.toString(), token);
      if (response.success) {
        setNearbyMechanics(response.data);
      }
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRequests = async () => {
    try {
      const response = await serviceAPI.getUserRequests(token);
      if (response.success) {
        setUserRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-2">Find the best mechanics near you</p>
        </div>

        {/* Create Service Request */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Need assistance?</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Create Service Request
          </button>
        </div>

        {/* Service Request Modal */}
        <ServiceRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchUserRequests();
            alert('Service request created successfully!');
          }}
        />

        {/* Nearby Mechanics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Mechanics</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyMechanics.map((mechanic) => (
                <div key={mechanic.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{mechanic.name}</h3>
                      <p className="text-gray-600 text-sm">{mechanic.shopName}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaStar className="text-yellow-400" />
                      <span>{mechanic.rating} ({mechanic.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPhone />
                      <span>{mechanic.phone}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {mechanic.skills.map((skill) => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Booking feature coming soon! You can contact ${mechanic.name} at ${mechanic.phone}`)}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Requests */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Service Requests</h2>
          {userRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
              No service requests yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {userRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{request.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
