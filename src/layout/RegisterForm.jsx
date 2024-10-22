import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!input.username || !input.password || !input.confirmPassword || !input.email) {
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด...',
          text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง!',
        });
        return;
      }

      if (input.password !== input.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด...',
          text: 'กรุณายืนยันรหัสผ่านให้ตรงกัน!',
        });
        return;
      }

      const response = await axios.post('http://localhost:8889/auth/register', input);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'สมัครสมาชิกเรียบร้อยแล้ว!',
        });

        setInput({
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
        });

        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.log(err.message);
      Swal.fire({
        icon: 'error',
        title: 'ผิดพลาด...',
        text: 'เกิดข้อผิดพลาดระหว่างการสมัครสมาชิก.',
      });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")' }}>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-yellow-400 text-4xl mb-6 text-center font-bold">สมัครสมาชิก</div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-yellow-400 font-bold">ชื่อผู้ใช้</span>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              className="block w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              name="username"
              value={input.username}
              onChange={handleChange}
            />
          </label>

          <label className="block">
            <span className="text-yellow-400 font-bold">อีเมล</span>
            <input
              type="email"
              placeholder="อีเมล"
              className="block w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              name="email"
              value={input.email}
              onChange={handleChange}
            />
          </label>

          <label className="block">
            <span className="text-yellow-400 font-bold">รหัสผ่าน</span>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="block w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
          </label>

          <label className="block">
            <span className="text-yellow-400 font-bold">ยืนยันรหัสผ่าน</span>
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              className="block w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={handleChange}
            />
          </label>

          <div className="flex justify-between">
            <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
              สมัครสมาชิก
            </button>
            <button type="button" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md ml-4 focus:outline-none focus:ring-2 focus:ring-gray-600" onClick={() => setInput({
              username: '',
              password: '',
              confirmPassword: '',
              email: '',
            })}>
              รีเซ็ต
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
