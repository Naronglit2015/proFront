import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditUserProfile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    imgprofile: '',
    role: 'USER',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8889/auth/getUser01/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setUserData(prevData => ({ ...prevData, imgprofile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(userData).forEach(key => {
        if (userData[key] !== '') {
          if (key === 'imgprofile' && userData[key] instanceof File) {
            formData.append('imgprofile', userData[key]);
          } else if (key !== 'imgprofile') {
            formData.append(key, userData[key]);
          }
        }
      });

      const response = await axios.put(`http://localhost:8889/auth/updateUser/${userId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User profile updated successfully!',
      });
      navigate('/UserProfile');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update user profile');
    }
  };
  return (
    <div className="bg-cover bg-center min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")' }}>
      <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-80 shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-700 px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-yellow-400">Edit User Profile</h1>
        </div>
        {error && (
          <div className="bg-red-800 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
       <form className="px-4 py-5 sm:p-6" onSubmit={handleSubmit} encType="multipart/form-data">
       <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center space-x-6 mb-4">
              {userData.imgprofile ? (
                typeof userData.imgprofile === 'string' ? (
                  <img
                    src={userData.imgprofile}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                    Image Ready to Upload
                  </div>
                )
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Profile Image</label>
              <input
                type="file"
                name="imgprofile"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full mt-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
      <div>
  <label className="block text-sm font-medium text-yellow-300">Role</label>
  <select
    name="role"
    value={userData.role}
    onChange={handleChange}
    className="block w-full mt-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
  >
    <option value="USER">USER</option>
    <option value="STAFF">STAFF</option>
    <option value="ADMIN">ADMIN</option>
  </select>
</div>

      {/* Optional: Add a password field if needed */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-300">Password</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          className="mt-1 p-3 block w-full shadow-sm sm:text-sm bg-gray-700 border-2 border-gray-600 rounded-md focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
        />
      </div> */}
    </div>
    <div className="mt-6 flex items-center justify-between">
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        Save Changes
      </button>
      <Link
        to="/UserProfile"
        className="text-sm font-medium text-yellow-400 hover:text-yellow-300"
      >
        Cancel
      </Link>
    </div>
  </form>
</div>

    </div>
  );
};

export default EditUserProfile;
