import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

const UserProfiles = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8889/auth/getUser', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('การดึงข้อมูลผู้ใช้ล้มเหลว');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('การดึงข้อมูลผู้ใช้ล้มเหลว');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณจะไม่สามารถย้อนกลับได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8889/auth/deleteUser/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('การลบผู้ใช้ล้มเหลว');
        }

        // ลบผู้ใช้ออกจาก state
        setUsers(users.filter(user => user.id !== userId));

        // แสดงการแจ้งเตือนว่าลบสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'ลบแล้ว!',
          text: 'ผู้ใช้ถูกลบเรียบร้อยแล้ว',
          confirmButtonText: 'ตกลง'
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);

      // แสดงการแจ้งเตือนว่าลบไม่สำเร็จ
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด...',
        text: 'การลบผู้ใช้ล้มเหลว กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <div className="p-8 flex flex-col items-center bg-gradient-to-br from-gray-800 to-black min-h-screen relative" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")' }}>
      <div className="max-w-5xl mx-auto bg-gray-800 shadow-xl rounded-lg overflow-hidden"> {/* ขยายความกว้างของ container */}
        <div className="bg-gray-700 px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-bold text-white">โปรไฟล์ผู้ใช้</h1>
        </div>
        {error && (
          <div className="bg-red-700 border border-red-600 text-red-100 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="px-6 py-5 sm:p-8">
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-6 p-4 border-b border-gray-700"> {/* เพิ่มช่องว่างเพื่อความสวยงาม */}
                <div className="flex items-center justify-between space-x-8"> {/* ขยายระยะห่างระหว่างกลุ่ม */}
                  <div className="flex items-center space-x-6"> {/* เพิ่มระยะห่าง */}
                    {user.imgprofile ? (
                      <img
                        src={user.imgprofile}
                        alt="รูปโปรไฟล์"
                        className="w-20 h-20 rounded-full object-cover border-4 border-yellow-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-gray-400">
                        ไม่มีรูปภาพ
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{user.username}</h2>
                      <p className="text-gray-300 font-bold">อีเมล: {user.email}</p>
                      <p className="text-gray-300 font-bold">เบอร์โทร: {user.phoneNumber || 'ไม่ได้ระบุ'}</p>
                      <p className="text-gray-300 font-bold">
                        สถานะ: <span className="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-600 text-yellow-100">{user.role}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-6"> {/* เพิ่มระยะห่างระหว่างปุ่ม */}
                    <Link
                      to={`/EditUserProfile/${user.id}`}
                      className="text-yellow-400 hover:text-yellow-300 font-bold mt-2"
                    >
                      แก้ไขโปรไฟล์
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-400 font-bold mt-2"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfiles;
