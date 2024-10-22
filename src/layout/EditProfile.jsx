import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    phoneNumber: '',
    imgprofile: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const [file, setFile] = useState(null); // State to manage the selected file
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProfileData(data);
      setOriginalData(data);
    } catch (error) {
      setError('Failed to fetch profile data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update file state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('username', profileData.username);
    formData.append('phoneNumber', profileData.phoneNumber);
    if (file) {
      formData.append('imgprofile', file);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8889/auth/updateProfile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.msg || 'Failed to update profile');
      }

      navigate('/profile');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  if (!profileData.username) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-cover bg-center bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")' }}>
      <div className="flex justify-center items-center h-full ">
        <div className="bg-brown-600 max-w-md w-full mx-auto shadow-lg rounded-lg overflow-hidden p-6 bg-gray-800">
          <div className="bg-brown-700 px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-yellow-400">แก้ไขบัญชี</h1>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="px-4 py-5 sm:p-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex justify-center mb-4">
                {profileData.imgprofile ? (
                  <img
                    src={profileData.imgprofile}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-yellow-200">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-yellow-200">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-yellow-200">Profile Image</label>
                <input
                  type="file"
                  name="imgprofile"
                  onChange={handleFileChange}
                  className="block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              >
                Save
              </button>
              <Link
                to="/profile"
                className="text-sm font-medium text-yellow-400 hover:text-yellow-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
