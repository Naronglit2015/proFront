import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [confirmbooking, setConfirmbooking] = useState([]);
  const [startIndexRes, setStartIndexRes] = useState(0);
  const [startIndexPur, setStartIndexPur] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8889/auth/tableReser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);

        const confirmedBookings = response.data.filter(reservation => reservation.status === '1');
        setConfirmbooking(confirmedBookings);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:', error);
      }
    };

    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8889/auth/getpurchase', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPurchases(response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการสั่งซื้อ:', error);
      }
    };

    fetchReservations();
    fetchPurchases();
  }, []);

  const reservationsWithTableNumber = reservations.filter(reservation => reservation.tableNumber);

  const totalPurchaseAmount = purchases.reduce((total, purchase) => total + (purchase.price * purchase.quantity), 0);

  const handlePrevPageRes = () => {
    if (startIndexRes > 0) {
      setStartIndexRes(startIndexRes - itemsPerPage);
    }
  };

  const handleNextPageRes = () => {
    if (startIndexRes + itemsPerPage < reservationsWithTableNumber.length) {
      setStartIndexRes(startIndexRes + itemsPerPage);
    }
  };

  const handlePrevPagePur = () => {
    if (startIndexPur > 0) {
      setStartIndexPur(startIndexPur - itemsPerPage);
    }
  };

  const handleNextPagePur = () => {
    if (startIndexPur + itemsPerPage < purchases.length) {
      setStartIndexPur(startIndexPur + itemsPerPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
    <div className="container mx-auto">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">
        สรุปการจองโต๊ะ & การสั่งซื้อ
      </h1>
      
      <div className="flex justify-center space-x-6 mb-12">
        <div className="card w-80 bg-white shadow-xl rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">การจองทั้งหมด</h2>
            <img
              alt="reservations"
              className="h-12 w-12 mx-auto mb-4"
              src="https://e7.pngegg.com/pngimages/447/933/png-clipart-computer-icons-computer-software-reservation-text-rectangle-thumbnail.png"
            />
            <h2 className="text-4xl font-extrabold text-indigo-600">{reservationsWithTableNumber.length}</h2>
          </div>
        </div>
  
        <div className="card w-80 bg-white shadow-xl rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">โต๊ะที่เคยจอง</h2>
            <img
              alt="reservations"
              className="h-12 w-12 mx-auto mb-4"
              src="https://cdn.pixabay.com/photo/2021/02/05/02/00/calendar-5983133_1280.png"
            />
            <h2 className="text-4xl font-extrabold text-indigo-600">{confirmbooking.length}</h2>
          </div>
        </div>
  
        <div className="card w-80 bg-white shadow-xl rounded-lg p-6 transition-transform transform hover:scale-105">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">ยอดการสั่งซื้อทั้งหมด</h2>
            <img
              alt="purchases"
              className="h-12 w-12 mx-auto mb-4"
              src="/payment-method.png"
            />
            <h2 className="text-4xl font-extrabold text-indigo-600">{totalPurchaseAmount.toFixed(2)} ฿</h2>
          </div>
        </div>
      </div>
  
      <div className="mt-12">
        <div className="card bg-white shadow-xl rounded-lg p-8 overflow-x-auto mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">รายละเอียดการจอง</h2>
          {reservationsWithTableNumber.length > 0 ? (
            <table className="min-w-full table-auto text-gray-700">
              <thead>
                <tr className="bg-indigo-100 text-gray-800">
                  <th className="px-4 py-2 text-lg">หมายเลขโต๊ะ</th>
                  <th className="px-4 py-2 text-lg">ชื่อผู้จอง</th>
                  <th className="px-4 py-2 text-lg">วันที่จอง</th>
                  <th className="px-4 py-2 text-lg">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {reservationsWithTableNumber.slice(startIndexRes, startIndexRes + itemsPerPage).map((reservation) => (
                  <tr key={reservation.id} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">{reservation.tableNumber}</td>
                    <td className="px-4 py-2 text-center">{reservation.username}</td>
                    <td className="px-4 py-2 text-center">
                      {new Date(reservation.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {reservation.status === '1' ? 'รอยืนยันการจอง' :
                       reservation.status === '2' ? 'จองเสร็จสิ้น' :
                       'รอดำเนินการ'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">ไม่พบการจอง.</p>
          )}
          <div className="flex justify-between mt-4">
            <button 
              onClick={handlePrevPageRes} 
              disabled={startIndexRes === 0} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ก่อนหน้า
            </button>
            <button 
              onClick={handleNextPageRes} 
              disabled={startIndexRes + itemsPerPage >= reservationsWithTableNumber.length} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
  
      <div className="mt-12">
        <div className="card bg-white shadow-xl rounded-lg p-8 overflow-x-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">รายละเอียดการสั่งซื้อ</h2>
          {purchases.length > 0 ? (
            <table className="min-w-full table-auto text-gray-700">
              <thead>
                <tr className="bg-indigo-100 text-gray-800 text-lg">
                  <th className="px-4 py-2">ชื่อสินค้า</th>
                  <th className="px-4 py-2">หมายเลขโต๊ะ</th>
                  <th className="px-4 py-2">ราคา</th>
                  <th className="px-4 py-2">จำนวน</th>
                  <th className="px-4 py-2">รวม</th>
                  <th className="px-4 py-2">สถานะ</th>
                </tr>
              </thead>
              <tbody>
  {purchases.slice(startIndexPur, startIndexPur + itemsPerPage).map((purchase) => (
    <tr key={purchase.id} className="border-t border-gray-300 hover:bg-gray-50">
      <td className="px-4 py-3 text-center text-lg font-semibold text-gray-800">
        {purchase.name}
      </td>
      <td className="px-4 py-3 text-center text-lg font-semibold text-gray-800">
        {purchase.table}
      </td>
      <td className="px-4 py-3 text-center text-lg font-semibold text-gray-800">
        {purchase.price.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-center text-lg font-semibold text-gray-800">
        {purchase.quantity}
      </td>
      <td className="px-4 py-3 text-center text-lg font-semibold text-gray-800">
        {(purchase.price * purchase.quantity).toFixed(2)}
      </td>
      <td className="px-4 py-3 text-center text-lg font-semibold text-gray-800">
        {purchase.status}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          ) : (
            <p className="text-center text-gray-500">ไม่พบการสั่งซื้อ.</p>
          )}
          <div className="flex justify-between mt-4">
            <button 
              onClick={handlePrevPagePur} 
              disabled={startIndexPur === 0} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ก่อนหน้า
            </button>
            <button 
              onClick={handleNextPagePur} 
              disabled={startIndexPur + itemsPerPage >= purchases.length} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default TableReservationPage;
