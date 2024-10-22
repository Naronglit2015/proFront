import axios from 'axios';
import { useState } from "react";
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { setUser } = useAuth();
  const [input, setInput] = useState({
    username: '', 
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setInput(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => { 
    e.preventDefault();
    if (!input.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'กรุณาใส่รหัสผ่าน!',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8889/auth/login', input);
      localStorage.setItem('token', response.data.token);

      const userResponse = await axios.get('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setUser(userResponse.data);
      navigate('/'); // Redirect to a dashboard or main page after successful login
    } catch(err) {
      if (err.response && err.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเข้าสู่ระบบได้',
          text: 'ชื่อผู้ใช้งานหรือรหัสผ่านผิดพลาด!',
        });
      } else if (err.response && err.response.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'รหัสผ่านไม่ถูกต้อง',
          text: 'รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'An unexpected error occurred',
        });
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")' }}>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-yellow-400 text-4xl mb-6 text-center font-bold">เข้าสู่ระบบ</div>
        <form className="login-form space-y-6" onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-yellow-400 font-bold">ชื่อผู้ใช้งาน</span>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้งาน"
              className="block w-full mt-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              name="username"
              value={input.username}
              onChange={handleChange}
            />
          </label>

          <label className="block mb-4">
            <span className="text-yellow-400 font-bold">รหัสผ่าน</span>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="block w-full mt-1 p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="w-full bg-yellow-600 text-black py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700 transition duration-300 font-bold">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
