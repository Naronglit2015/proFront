import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    img: null // Change from '' to null for file handling
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = name === 'price' ? parseFloat(value) : name === 'img' ? files[0] : value; // Handle file input
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if formData fields are filled
    if (formData.name === '' || formData.description === '' || formData.price === 0 || !formData.img) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData(); // Create a FormData object
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('img', formData.img); // Append the file

      const response = await axios.post('http://localhost:8889/auth/postproduct', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'สินค้าถูกเพิ่มเรียบร้อยแล้ว',
        text: response.data.message,
        confirmButtonText: 'ตกลง'
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-500 min-h-screen p-8" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>

    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl" style={{ marginTop: '50px' }}>
      <h2 className="font-bold text-black text-2xl font-bold mb-4">เพิ่มสินค้า</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-bold block text-black mb-1">ชื่อสินค้า</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 font-bold"
            style={{ width: '100%' }}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="ชื่อสินค้า"
          />
        </div>
        <div>
          <label className="font-bold block text-black mb-1">คำอธิบาย</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 font-bold"
            style={{ width: '100%' }}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="คำอธิบาย"
          />
        </div>
        <div>
          <label className="font-bold block text-black mb-1">ราคา</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 font-bold"
            style={{ width: '100%' }}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="ราคา"
          />
        </div>
        <div>
          <label className="font-bold block text-black mb-1">รูปภาพ</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 font-bold"
            style={{ width: '100%' }}
            type="file"
            name="img"
            onChange={handleChange} // File change should be handled separately
          />
        </div>
        <div className="text-right">
          <button
            className="font-bold bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            type="submit"
          >
            เพิ่มสินค้า
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
