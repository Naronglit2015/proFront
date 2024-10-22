import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Confirm() {
  const [purchases, setPurchases] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:8889/auth/getpurchase', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data !== undefined) {
          setPurchases(response.data);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }

      const role = localStorage.getItem('userRole');
      if (role) {
        setUserRole(role);
      }
    };

    fetchPurchases();
  }, []);

  const handleEditPurchase = (purchaseId) => {
    console.log(`Editing purchase with ID ${purchaseId}`);
    // Implement editing functionality if needed
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`http://localhost:8889/auth/purchase/${purchaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPurchases(prevPurchases => prevPurchases.filter(purchase => purchase.id !== purchaseId));
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const handleFinishDelivery = async (purchaseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        `http://localhost:8889/auth/Finish2`,
        { id: purchaseId }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPurchases(prevPurchases =>
        prevPurchases.map(purchase =>
          purchase.id === purchaseId ? { ...purchase, status: '1' } : purchase
        )
      );
    } catch (error) {
      console.error('Error finishing delivery:', error);
    }
  };

  const handleViewSlip = (imgcredit) => {
    setSelectedSlip(imgcredit);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black min-h-screen p-8" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      <div className="grid gap-6 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex-shrink-0">
              <img className="w-full h-48 object-cover rounded-lg mb-4" src={purchase.img} alt={purchase.name} />
            </div>
            <div className="flex-grow">
              <p className="font-extrabold text-2xl text-white mb-2">{purchase.name}</p>
              <p className="font-semibold text-gray-400 mb-1">{purchase.description}</p>
              <p className="text-lg font-semibold text-gray-300 mb-1">ราคา : {purchase.price} ฿</p>
              <p className="text-lg font-semibold text-gray-300 mb-1">โต๊ะ : {purchase.table}</p>
              <p className="text-lg font-semibold text-gray-300 mb-1">จำนวน : {purchase.quantity}</p>
              <p className="text-lg font-semibold text-gray-300 mb-1">การชำระเงิน : {purchase.payment}</p>
              
              {purchase.status === '1' && <p className="text-yellow-400 font-bold mt-3">กำลังดำเนินการ</p>}
              {purchase.status === '2' && <p className="text-green-400 font-bold mt-3">เสร็จสิ้น</p>}
              {purchase.status === '3' && <p className="text-blue-400 font-bold mt-3">จ่ายแล้ว</p>}
              
              {purchase.payment === 'โอนจ่าย' && purchase.imgcredit && (
                <button 
                  onClick={() => handleViewSlip(purchase.imgcredit)}
                  className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                >
                  ดูสลิป
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg">
            <img src={selectedSlip} alt="Payment Slip" className="max-w-full max-h-[80vh] rounded" />
            <button 
              onClick={() => setSelectedSlip(null)}
              className="mt-4 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
