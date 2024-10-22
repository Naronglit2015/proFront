import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('เงินสด');
  const [showAlert, setShowAlert] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentSlide, setShowPaymentSlide] = useState(false);
  const [showTransferSlide, setShowTransferSlide] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [imgcredit, setImgcredit] = useState(null);
  const [file, setFile] = useState(null);
  const [tableReservations, setTableReservations] = useState([]);

  // const [tableNumber, setTableNumber] = useState(""); // state for the selected or entered table number
const [customTableNumber, setCustomTableNumber] = useState(""); // state for custom table number input
const [isCustom, setIsCustom] = useState(false); // state to determine if "Other" is selected

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/product', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const fetchTableReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/tableReser02', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTableReservations(response.data);
        // Automatically set the first table number if available
        if (response.data.length > 0) {
          setTableNumber(response.data[0].tableNumber);
        }
      } catch (error) {
        console.error('Error fetching TableReser:', error);
      }
    };

    fetchTableReservations();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = selectedProducts.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [selectedProducts]);

  const handleProductSelect = (productId) => {
    const selectedProduct = products.find(product => product.id === productId);
    setSelectedProducts(prevState => [...prevState, { ...selectedProduct, quantity: 1 }]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prevState => prevState.filter(product => product.id !== productId));
  };

  const handleBuyClick = async () => {
    try {
      if (!tableNumber) {
        Swal.fire({
          icon: 'error',
          title: 'กรุณากรอกหมายเลขโต๊ะ',
          confirmButtonText: 'ตกลง'
        });
        return;
      }

      if (selectedProducts.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'กรุณาเลือกสินค้าก่อนทำการซื้อ',
          confirmButtonText: 'ตกลง'
        });
        return;
      }

      const totalAmount = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
      const confirmationMessage = `คุณกำลังจะซื้อสินค้าทั้งหมด ${selectedProducts.length} รายการ รวมราคา ${totalAmount.toFixed(2)} บาท วิธีการชำระเงิน: ${paymentMethod} หมายเลขโต๊ะ: ${tableNumber}`;

      const confirmPurchase = await Swal.fire({
        title: 'ยืนยันการสั่งซื้อ',
        text: confirmationMessage,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      });

      if (!confirmPurchase.isConfirmed) {
        return;
      }

      if (paymentMethod === 'โอนจ่าย') {
        setShowTransferSlide(true);
      } else {
        await handlePurchase();
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดขณะทำการซื้อสินค้า กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await Promise.all(selectedProducts.map(async (product) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('productId', product.id);
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('paymentMethod', paymentMethod);
        formData.append('table', tableNumber);
        formData.append('img', product.img);
        formData.append('status', product.status || "default_status_value");

        if (file) {
          formData.append('image', file);
        }

        try {
          await axios.post('http://localhost:8889/auth/purchase', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error("Error submitting product purchase:", error.response ? error.response.data : error.message);
        }
      }));

      Swal.fire({
        icon: 'success',
        title: 'สั่งซื้อสำเร็จ',
        text: 'คุณได้สั่งซื้อสินค้าเรียบร้อยแล้ว',
        confirmButtonText: 'ตกลง'
      });
    } catch (err) {
      console.error('error', err);
    }
  };

  const handleFileChange01 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleTransferSubmit = async () => {
    await handlePurchase();
    console.log('Transfer submitted', receipt);
    setShowTransferSlide(false);
  };

  const validTableReservations = tableReservations.filter(reservation => reservation.tableNumber);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "other") {
      setIsCustom(true);
      setTableNumber("");
    } else {
      setIsCustom(false);
      setTableNumber(value);
    }
  };
  return (
    <div className="bg-gradient-to-br from-gray-800 to-black min-h-screen p-8 relative" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")' }}>
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

<div className="relative text-center">
        <h1 className="text-3xl font-bold mb-8 text-white relative z-10 bg-black bg-opacity-50 p-4 rounded">
         รายการสินค้า
        </h1>
      </div>
    <div className="flex">
      <div className={`${selectedProducts.length > 0 ? 'w-2/3' : 'w-full'} transition-all duration-300 ease-in-out`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900 rounded-lg shadow-md p-6 flex flex-col justify-between">
              <img className="w-48 h-48 rounded-lg mx-auto mb-4 border border-yellow-500" src={product.img} alt={product.name} />
              <div>
                <h2 className="font-bold text-yellow-300 text-xl mb-2 text-center">{product.name}</h2>
                <p className="font-bold text-gray-400 mb-3 text-center">{product.description}</p>
                <p className="font-bold text-yellow-300 mb-2 text-center">ราคา: ${product.price}</p>
              </div>
              <button 
                onClick={() => handleProductSelect(product.id)} 
                className="bg-yellow-500 text-white rounded px-4 py-2 hover:bg-yellow-600 transition duration-300 self-center"
              >
                ใส่ตะกร้า
              </button>
            </div>
          ))}
        </div>
      </div>
  
      {selectedProducts.length > 0 && (
        <div className="w-1/3 pl-4 transition-all duration-300 ease-in-out">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-2xl font-semibold mb-4 text-center text-yellow-300">เลือกสินค้า</h2>
            <ul className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {selectedProducts.map(product => (
                <li key={product.id} className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between items-center">
                  <div>
  <h3 className="font-semibold text-yellow-300">{product.name}</h3>
  <p className="text-white font-bold">Price: ${product.price * product.quantity}</p>
  <div className="flex items-center mt-2">
    <label htmlFor={`quantity_${product.id}`} className="block text-white font-bold mr-2">จำนวน:</label>
    <input 
      type="number" 
      id={`quantity_${product.id}`}
      value={product.quantity} 
      onChange={(e) => {
        const newQuantity = parseInt(e.target.value);
        setSelectedProducts(prevState => prevState.map(p => {
          if (p.id === product.id) {
            return { ...p, quantity: newQuantity };
          }
          return p;
        }));
      }} 
      min="1" 
      step="1"
      className="font-bold border border-gray-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-white"
    />
  </div>
</div>

                    <button 
                      onClick={() => handleRemoveProduct(product.id)} 
                      className="text-red-400 hover:text-red-600  font-bold"
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
           
              <div className="mt-4">
              <label className="block text-white font-bold mr-2">เลขโต๊ะของท่าน</label>
              {validTableReservations.length > 0 ? (
        <div>
          <select 
            value={isCustom ? "other" : tableNumber} 
            onChange={handleSelectChange} 
            className="w-full border text-white font-bold border-gray-600 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700"
          >
            <option className="w-full text-white font-bold" value="" disabled>เลือกหมายเลขโต๊ะ</option>
            {validTableReservations.map((tableReservation) => (
              <option key={tableReservation.id} value={tableReservation.tableNumber}>
                โต๊ะ {tableReservation.tableNumber}
              </option>
            ))}
            <option value="other">หมายเลขโต๊ะอื่น</option>
          </select>
          {isCustom && (
            <input 
              type="text" 
              value={tableNumber} 
              onChange={(e) => setTableNumber(e.target.value)} 
              placeholder="กรุณากรอกหมายเลขโต๊ะ" 
              className="w-full border text-white font-bold border-gray-600 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700"
            />
          )}
        </div>
      ) : (
        <input 
          type="text" 
          value={tableNumber} 
          onChange={(e) => setTableNumber(e.target.value)} 
          placeholder="กรุณากรอกหมายเลขโต๊ะ" 
          className="w-full border text-white font-bold border-gray-600 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700"
        />
      )}
</div>


            <label className="block text-white font-bold mr-2">เลือกวิธีการจ่าย</label>
              <select 
                value={paymentMethod} 
                onChange={handlePaymentMethodChange}
                className="w-full border font-bold border-gray-600 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-white"
              >
                <option value="เงินสด">เงินสด</option>
                {/* <option value="card">Credit Card</option> */}
                <option value="โอนจ่าย">โอนจ่าย</option>
              </select>
              <button 
                onClick={handleBuyClick} 
                className="w-full bg-yellow-500 text-white rounded px-4 py-2 hover:bg-yellow-600 transition duration-300 font-bold"
              >
                ซื้อ
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-yellow-300">ราคาทั้งหมด : ${totalPrice.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  
    <div className={`fixed bottom-0 left-0 w-full bg-gray-800 rounded-t-3xl shadow-lg transition-transform duration-300 ease-in-out transform ${showTransferSlide ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">โอนจ่าย</h2>
        <div className="mb-4">
          <img src="https://png.pngtree.com/element_our/20200610/ourmid/pngtree-creative-cartoon-qr-code-image_2243895.jpg" alt="QR Code" className="w-48 h-48 mx-auto mb-4"/>
        </div>
        <div className="mb-4">
          <label htmlFor="imgcredit" className="block text-sm font-medium text-gray-400">Upload Image</label>
          <input
            type="file"
            id="imgcredit"
            onChange={handleFileChange01}
            className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-700 text-white"
          />
        </div>
        <button 
          className="w-full bg-yellow-500 text-white rounded px-4 py-2 hover:bg-yellow-600 transition duration-300"
          onClick={handleTransferSubmit}
        >
          ยืนยันการซื้อ
        </button>
        <button 
          className="w-full mt-2 bg-gray-700 text-gray-300 rounded px-4 py-2 hover:bg-gray-600 transition duration-300"
          onClick={() => setShowTransferSlide(false)}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
  
  
  );
}

export default ProductList;