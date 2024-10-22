import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const guestNav = [
  { to: '/UserHome', text: 'หน้าหลัก' },
  { to: '/tbResrall', text: 'จองโต๊ะ' },
  { to: '/', text: 'เข้าสู่ระบบ' },
  { to: '/register', text: 'สมัครสมาชิก' },
];

const userNav = [
  { to: '/', text: 'หน้าหลัก' },
  { to: '/table-reservations', text: 'จองโต๊ะ' },
  { to: '/confirm', text: 'คำสั่งซื้อ' },
];

const staffNav = [
  { to: '/', text: 'จองโต๊ะ' },
  { to: '/AdminOrder', text: 'คำสั่งซื้อ' },
  // { to: '/Adproduct', text: 'เพิ่มสินค้า' },
];

const AdminNav = [
  { to: '/products', text: 'สินค้า' },
  { to: '/table-reservations', text: 'จัดการจองโต๊ะ' },
  { to: '/AdminOrder', text: 'คำสั่งซื้อ' },
  { to: '/Adproduct', text: 'เพิ่มสินค้า' },
  { to: '/UserProfile', text: 'จัดการบัญชีผู้ใช้งาน' },
  { to: '/Dashborad', text: 'สรุปข้อมูลทุกอย่าง' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const finalNav = user?.id
    ? user.role === 'ADMIN'
      ? AdminNav
      : user.role === 'STAFF'
      ? staffNav
      : userNav
    : guestNav;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-r from-brown-900 to-brown-800 p-4 shadow-lg border-b-4 border-yellow-600">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={user?.imgprofile || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKG3NYPSNCVwyicMNQPkiIy5FsXp5RYDQp9w&usqp=CAU'}
            alt="Profile"
            className="w-14 h-14 rounded-full border-4 border-yellow-500 shadow-lg object-cover mr-4"
          />
          <div className="flex flex-col">
            <span className="text-yellow-300 text-sm">สวัสดี,</span>
            <span className="text-yellow-50 text-lg font-semibold">{user?.username || 'Guest'}</span>
          </div>
        </div>

        <ul className="flex space-x-6">
          {finalNav.map((el, index) => (
            <li key={index}>
              <Link
                to={el.to}
                className="font-bold text-yellow-50 transition duration-300 py-2 px-5 rounded-full bg-yellow-700 shadow-lg hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}
              >
                {el.text}
              </Link>
            </li>
          ))}
        </ul>

        {user?.id && (
          <div className="flex space-x-4">
            <Link
              to="/profile"
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-5 rounded-full transition duration-300 shadow-lg"
            >
              โปรไฟล์
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-yellow-50 py-2 px-5 rounded-full transition duration-300 shadow-lg"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
