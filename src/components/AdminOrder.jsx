import axios from "axios";
import { useEffect, useState } from "react";

export default function Confirm() {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState({});
  const [userRole, setUserRole] = useState("ADMIN");
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch purchases
        const purchaseResponse = await axios.get(
          "http://localhost:8889/auth/getpurchase",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (purchaseResponse.data !== undefined) {
          setPurchases(purchaseResponse.data);
        }

        // Fetch user data
        const userResponse = await axios.get(
          "http://localhost:8889/auth/getUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.data !== undefined) {
          const userMap = userResponse.data.reduce((acc, user) => {
            acc[user.id] = user.username;
            return acc;
          }, {});
          setUsers(userMap);
        }

        // Fetch user role
        const role = localStorage.getItem("userRole");
        if (role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPurchases();
  }, []);

  const handleUpdateStatus = async (purchaseId, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put(
        "http://localhost:8889/auth/Finish2",
        { id: purchaseId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase.id === purchaseId
            ? { ...purchase, status: status }
            : purchase
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleViewSlip = (imgcredit) => {
    setSelectedSlip(imgcredit);
  };

  const groupedPurchases = purchases.reduce((groups, purchase) => {
    const { userId } = purchase;
    if (!groups[userId]) {
      groups[userId] = [];
    }
    groups[userId].push(purchase);
    return groups;
  }, {});

  return (
    <div
      className="bg-gradient-to-br from-gray-800 to-black min-h-screen p-8"
      style={{
        backgroundImage:
          'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")',
      }}
    >
<div className="flex justify-center py-6 min-h-screen">
  <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mx-auto">
    {Object.entries(groupedPurchases).map(([userId, userPurchases]) => (
      <div key={userId} className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">
          User ID: {userId}
        </h2>
        <h3 className="text-xl font-semibold text-yellow-300 mb-4">
          User Name: {users[userId]}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userPurchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-gray-700 text-white p-4 rounded-lg shadow-md flex flex-col"
            >
              <div className="flex-shrink-0 w-full h-32 flex items-center justify-center mb-4">
                <img
                  className="w-full h-full object-cover rounded-md"
                  src={purchase.img}
                  alt={purchase.name}
                />
              </div>
              <div className="flex-1 mb-4">
                <p className="font-bold text-lg">{purchase.name}</p>
                <p className="text-white text-m mt-1">
                  คำอธิยาย: {purchase.description}
                </p>
                <p className="text-white text-m mt-1">
                  ราคา: ${purchase.price}
                </p>
                <p className="text-white text-m mt-1">
                  หมายเลขโต๊ธ: {purchase.table}
                </p>
                <p className="text-white text-m mt-1">
                  จำนวน: {purchase.quantity}
                </p>
                <p className="text-white text-m mt-1">
                  ช่องทางการชำระเงิน: {purchase.payment}
                </p>
              </div>
              {(userRole === "ADMIN" || userRole === "STAFF") && (
                <div className="flex flex-col items-center">
                  <label
                    htmlFor={`status-${purchase.id}`}
                    className="block text-gray-400 text-sm mb-1"
                  >
                    เปลี่ยนสถานะ:
                  </label>
                  <select
                    id={`status-${purchase.id}`}
                    value={purchase.status}
                    onChange={(e) =>
                      handleUpdateStatus(purchase.id, e.target.value)
                    }
                    className="bg-gray-600 border border-gray-500 rounded p-1 text-sm w-full mb-2"
                  >
                    <option value="0">เลือกสถานะ</option>
                    <option value="1">กำลังดำเนินการ</option>
                    <option value="2">เสร็จสิ้น</option>
                    <option value="3">จ่ายแล้ว</option>
                  </select>
                  {purchase.status === "1" && (
                    <p className="text-yellow-500 font-bold text-sm mt-1">
                      กำลังดำเนินการ
                    </p>
                  )}
                  {purchase.status === "2" && (
                    <p className="text-green-500 font-bold text-sm mt-1">
                      เสร็จสิ้น
                    </p>
                  )}
                  {purchase.status === "3" && (
                    <p className="text-blue-500 font-bold text-sm mt-1">
                      จ่ายแล้ว
                    </p>
                  )}
                  {purchase.payment !== "เงินสด" && (
                    <button
                      onClick={() => handleViewSlip(purchase.imgcredit)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white mt-2 p-2 rounded-lg shadow-md w-full text-sm"
                    >
                      ดูสลิป
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>



      {selectedSlip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-gray-900 p-4 rounded-lg max-w-sm w-full">
            <img
              src={selectedSlip}
              alt="Selected Slip"
              className="w-full h-auto rounded-md mb-4"
            />
            <button
              onClick={() => setSelectedSlip(null)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md w-32 mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
