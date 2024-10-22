import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const UserProfile = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8889/auth/products01');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSelect = (productId) => {
    Swal.fire({
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'กรุณาเข้าสู่ระบบก่อนจึงจะสามารถเพิ่มสินค้าได้',
      icon: 'warning',
      confirmButtonText: 'เข้าสู่ระบบ',
      confirmButtonColor: '#3085d6',
      showCancelButton: false,
      preConfirm: () => {
        window.location.href = '/';
      }
    });
  };

  return (
    <div className="bg-gray-800 p-8 min-h-screen relative">
      <div
        className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md"
        style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")' }}
      >
        {/* เพิ่มเนื้อหาที่นี่เพื่อให้สอดคล้องกับพื้นหลังเบลอ */}
      </div>
      <div className="relative z-10">
      <div className="container mx-auto p-4">

<div className="carousel w-full h-96 rounded-lg shadow-lg overflow-hidden">
  <div id="slide1" className="carousel-item relative w-full flex justify-center">
    <img
      src="https://res.theconcert.com/w_1200,h_630,c_crop/81ac6622e7b46454764abb91cff5ca07b/cover_blog.jpg"
      className="object-cover w-full h-full"
      alt="Slide 1"
    />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide4" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❮
      </a>
      <a href="#slide2" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❯
      </a>
    </div>
  </div>
  <div id="slide2" className="carousel-item relative w-full flex justify-center">
    <img
      src="https://res.theconcert.com/w_1200,h_630,c_crop/81ac6622e7b46454764abb91cff5ca07b/cover_blog.jpg"
      className="object-cover w-full h-full"
      alt="Slide 2"
    />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❮
      </a>
      <a href="#slide3" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❯
      </a>
    </div>
  </div>
  <div id="slide3" className="carousel-item relative w-full flex justify-center">
    <img
      src="https://thethaiger.com/th/wp-content/uploads/2022/11/%E0%B9%81%E0%B8%84%E0%B8%9B%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%8C-%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%AB%E0%B8%A5%E0%B9%89%E0%B8%B2.jpg"
      className="object-cover w-full h-full"
      alt="Slide 3"
    />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide2" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❮
      </a>
      <a href="#slide4" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❯
      </a>
    </div>
  </div>
  <div id="slide4" className="carousel-item relative w-full flex justify-center">
    <img
      src="https://thethaiger.com/th/wp-content/uploads/2022/11/%E0%B9%81%E0%B8%84%E0%B8%9B%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%8C-%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%AB%E0%B8%A5%E0%B9%89%E0%B8%B2-2022-%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99-%E0%B8%AA%E0%B8%B5%E0%B8%A1%E0%B9%88%E0%B8%A7%E0%B8%87.jpg"
      className="object-cover w-full h-full"
      alt="Slide 4"
    />
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide3" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❮
      </a>
      <a href="#slide1" className="btn btn-circle bg-gray-800 text-white hover:bg-gray-700">
        ❯
      </a>
    </div>
  </div>
</div>
</div>

        <div className="relative text-center mt-8 mb-12">
          <h1 className="text-4xl font-bold mb-8 text-yellow-300 relative z-10 bg-black bg-opacity-60 p-4 rounded">
            รายการสินค้า
          </h1>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-screen-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-900 rounded-lg shadow-md p-6 flex flex-col justify-between text-white hover:shadow-lg transition-shadow duration-300"
                >
               <img
  className="w-full h-48 rounded-lg mx-auto mb-4 border border-yellow-500 shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl object-contain"
  src={product.img}
  alt={product.name}
/>



                  <div>
                    <h2 className="font-bold text-white text-xl mb-2 text-center">{product.name}</h2>
                    <p className="text-gray-300 mb-3 text-center">{product.description}</p>
                    <p className="text-yellow-400 text-center mb-3">฿{product.price}</p>
                    <div className="flex justify-center">
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-all"
                        onClick={() => handleProductSelect(product.id)}
                      >
                        ใส่ตะกร้า
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
