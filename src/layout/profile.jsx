import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8889/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      console.log("Fetched profile data:", data); // เพิ่ม log เพื่อตรวจสอบข้อมูล
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div
      className="bg-brown-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")',
        backgroundSize: "cover",
      }}
    >
  <div className="max-w-3xl mx-auto bg-brown-800 shadow-lg rounded-lg overflow-hidden bg-gray-800">
  <div className="bg-brown-700 px-4 py-5 sm:px-6">
    <h1 className="text-2xl font-bold text-yellow-400">โปรไฟล์</h1>
  </div>
  <div className="flex px-4 py-5 sm:p-6">
    {/* Profile Picture Section */}
    <div className="w-1/3 flex justify-center items-center">
      {profileData.imgprofile ? (
        <div className="relative w-32 h-32">
          <img
            src={profileData.imgprofile}
            alt="Profile Picture"
            className="w-full h-full rounded-full object-cover shadow-lg"
          />
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
          No Image
        </div>
      )}
    </div>

    {/* Profile Information Section */}
    <div className="w-2/3 pl-6">
      <h2 className="text-2xl font-bold text-yellow-300 bg-brown-800 rounded p-2 mb-4">
        {profileData.username}
      </h2>
      <p className="text-gray-400 bg-brown-800 rounded p-2 mb-4 font-bold">
        Email: {profileData.email}
      </p>
      <p className="text-gray-400 bg-brown-800 rounded p-2 mb-4 font-bold">
        Phone Number: {profileData.phoneNumber || "Not provided"}
      </p>
      <p className="text-gray-400 bg-brown-800 rounded p-2 mb-4 font-bold">
        Role:{" "}
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {profileData.role}
        </span>
      </p>
    </div>
  </div>
  <div className="px-4 py-4 sm:px-6 bg-brown-700 flex justify-center">
    <Link
      to="/EditProfile"
      className="bg-yellow-500 text-white rounded px-4 py-2 hover:bg-yellow-600 transition duration-300"
    >
      แก้ไขบัญชี
    </Link>
  </div>
</div>

    </div>
  );
};

export default UserProfile;
