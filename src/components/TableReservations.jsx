import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const TableReservationPage = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchUserDataAndReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // ดึงข้อมูลผู้ใช้
        const userResponse = await axios.get("http://localhost:8889/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserId(userResponse.data.id);
        setUsername(userResponse.data.username);
        setUserRole(userResponse.data.role);

        // ดึงข้อมูลการจอง
        const reservationResponse = await axios.get(
          "http://localhost:8889/auth/tableReser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReservations(reservationResponse.data);
        
      } catch (error) {
        console.error("Error fetching user data and reservations:", error);
      }
    };

    fetchUserDataAndReservations();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem("token");
  
    try {
      const tableNumberString = tableNumber.toString();
      const isTableAlreadyReserved = reservations.some(
        (reservation) => reservation.tableNumber === tableNumberString
      );
  
      if (isTableAlreadyReserved) {
        Swal.fire({
          icon: "error",
          title: "Table Already Reserved!",
          text: "This table has already been reserved by another user.",
          confirmButtonColor: "#b83b5e",
          confirmButtonText: "OK",
        });
        return;
      }
  
      const response = await axios.post(
        "http://localhost:8889/auth/TableReservation",
        {
          userId,
          username,
          tableNumber: tableNumberString,
          status,
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log(response.data);
  
      setReservations([...reservations, { userId, username, tableNumber: tableNumberString, status, date }]);
      setTableNumber("");
  
      Swal.fire({
        icon: "success",
        title: "การจองสำเร็จ!",
        text: "คุณได้จองโต๊ะสำเร็จแล้ว.",
        confirmButtonColor: "#b83b5e",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (reservationId) => {
    const token = localStorage.getItem("token");

    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่ที่จะลบ?",
        text: "คุณจะไม่สามารถเปลี่ยนกลับสิ่งนี้ได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b83b5e",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:8889/auth/deleteTableReservation/${reservationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReservations(
          reservations.filter((reservation) => reservation.id !== reservationId)
        );

        Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ!",
          text: "คุณทำการลบสำเร็จ",
          confirmButtonColor: "#b83b5e",
        });
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error deleting the reservation.",
        confirmButtonColor: "#b83b5e",
      });
    }
  };

  const handlebackhome = async (reservationId) => {
    const token = localStorage.getItem("token");
  
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณจะไม่สามารถเปลี่ยนกลับสิ่งนี้ได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b83b5e",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, เปลี่ยนสถานะกลับ!",
      });
  
      if (result.isConfirmed) {
        await axios.put(
          `http://localhost:8889/auth/UpdateTableStatus01`,
          { id: reservationId },  // ส่ง id ไปใน body ของคำขอ
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        setReservations(
          reservations.filter((reservation) => reservation.id !== reservationId)
        );
  
        Swal.fire({
          icon: "success",
          title: "ยกเลิก!",
          text: "คุณทำการยกเลิกสำเร็จ",
          confirmButtonColor: "#b83b5e",
        });
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error deleting the reservation.",
        confirmButtonColor: "#b83b5e",
      });
    }
  };
  

  const handleUpdateStatus = async (reservationId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:8889/auth/UpdateTableStatus`,
        { id: reservationId, status: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        setReservations(
          reservations.map((reservation) =>
            reservation.id === reservationId
              ? { ...reservation, status: status }
              : reservation
          )
        );
  
        Swal.fire({
          icon: "success",
          title: "แก้ไขสถานะสำเร็จ!",
          text: `สถานะการจองได้รับการอัปเดตสถานะเรียบร้อย.`,
          confirmButtonColor: "#b83b5e",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update the reservation status.",
          confirmButtonColor: "#b83b5e",
        });
      }
    } catch (error) {
      console.error("Error updating reservation status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error updating the reservation status.",
        confirmButtonColor: "#b83b5e",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  };

  const isTableReserved = (tableNum) => {
    const tableNumString = tableNum.toString();
    return reservations.some(
      (reservation) => reservation.tableNumber === tableNumString
    );
  };

  const isDuplicateSelection = (tableNum) => {
    const tableNumString = tableNum.toString();
    return (
      tableNumber === tableNumString &&
      reservations.some((reservation) => reservation.tableNumber === tableNumString)
    );
  };

  return (
    <div
      className="bg-gradient-to-br from-gray-800 to-black min-h-screen p-8 relative"
      style={{
        backgroundImage:
          'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")',
      }}
    >
      <div className="min-h-screen p-8 relative text-white">
        <div className="container mx-auto px-4 py-8 max-w-lg bg-gray-800 rounded-md shadow-lg relative z-10 border border-gray-600">
          <h1 className="text-4xl font-bold mb-6 text-center">
            การจองโต๊ะ
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div>
  <label className="block font-bold mb-2 text-lg">หมายเลขโต๊ะ:</label>
  <div className="grid grid-cols-4 gap-4"> {/* ใช้ grid แทน flex เพื่อจัดปุ่มให้ขนาดเท่ากัน */}
    {[...Array(20).keys()].map((num) => {
      const tableNum = num + 1;
      const isCurrentTable = (tableNumber) === tableNum;
      const isReserved = isTableReserved(tableNum);
      const isDuplicate = isDuplicateSelection(tableNum);

      const buttonClasses = `flex items-center justify-center border border-gray-600 rounded-lg py-3 px-4 font-semibold text-lg focus:outline-none w-full h-20 ${
        isDuplicate || isReserved
          ? "bg-red-600 text-white cursor-not-allowed"
          : isCurrentTable
          ? "bg-yellow-600 text-black"
          : "bg-gray-700 text-white"
      }`;

      return (
        <button
          key={tableNum}
          onClick={() => {
            if (!isReserved && !isDuplicate) {
              setTableNumber(tableNum);
            }
          }}
          className={buttonClasses}
          disabled={isReserved || isDuplicate}
        >
          {tableNum} - {isReserved || isDuplicate ? "จองแล้ว" : "ว่าง"}
        </button>
      );
    })}
  </div>
</div>



<div>
  <label className="block font-bold mb-2 text-lg">Date:</label>
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // กำหนดวันที่ต่ำสุดเป็นวันที่ปัจจุบัน
    className="border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 font-semibold w-full focus:outline-none"
  />
</div>


            <div className="text-center">
              <button
                type="submit"
                className="bg-yellow-600 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Reserve Table
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ส่วนที่แสดงรายการการจอง */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
  <h2 className="text-3xl font-bold mb-6 text-center text-white">
    Reservation List
  </h2>
  <table className="w-full border border-gray-600 bg-gray-800 rounded-md shadow-lg">
    <thead>
      <tr>
        <th className="border border-gray-600 px-4 py-2 text-white font-bold">เลขโต๊ะ</th>
        {(userRole === "ADMIN" || userRole === "STAFF") && (
          <>
            <th className="border border-gray-600 px-4 py-2 text-white font-bold">ชื่อผู้ใช้</th>
            <th className="border border-gray-600 px-4 py-2 font-bold">วันเดือนปี</th>
            <th className="border border-gray-600 px-4 py-2 text-white font-bold">สถานะ</th>
            <th className="border border-gray-600 px-4 py-2 text-white font-bold">แก้ไขสถานะ</th>

          </>
        )}
        {userRole === "USER" && (
          <>
            <th className="border border-gray-600 px-4 py-2 text-white font-bold">ชื่อผู้ใช้</th>
            <th className="border border-gray-600 px-4 py-2 text-white font-bold">สถานะ</th>
          </>
        )}
      </tr>
    </thead>
    <tbody>
      {reservations
        .filter(reservation => reservation.tableNumber && (userRole !== "USER" || reservation.userId === userId))  // กรองตาม tableNumber และ userId
        .map((reservation) => (
          <tr key={reservation.id}>
            <td className="border border-gray-600 px-4 py-2 text-white font-bold">
              {reservation.tableNumber}
            </td>

            {(userRole === "ADMIN" || userRole === "STAFF") && (
              <>
                <td className="border border-gray-600 px-4 py-2 font-bold">
                  {reservation.username}
                </td>
                <td className="border border-gray-600 px-4 py-2 font-bold">
                  {formatDate(reservation.date)}
                </td>
                <td className="border border-gray-600 px-4 py-2 ">
                  {reservation.status === "1" ? (
                    <p className="text-yellow-500 font-bold text-m mt-2">
                      รอยืนยันการจอง
                    </p>
                  ) : (
                    reservation.status === "2" && (
                      <p className="text-green-500 font-bold text-m mt-2">
                        จองเสร็จสิ้น
                      </p>
                    )
                  )}
                </td>
              </>
            )}
            {userRole === "USER" && reservation.userId === userId && (
              <>
                <td className="border border-gray-600 px-4 py-2 font-bold">
                  {reservation.username}
                </td>
                <td className="border border-gray-600 px-4 py-2 ">
                  {reservation.status === "1" ? (
                    <p className="text-yellow-500 font-bold text-m mt-2">
                      รอยืนยันการจอง
                    </p>
                  ) : (
                    reservation.status === "2" && (
                      <p className="text-green-500 font-bold text-m mt-2">
                        จองเสร็จสิ้น
                      </p>
                    )
                  )}
                </td>
              </>
            )}
            {(userRole === "ADMIN" || userRole === "STAFF") && (
              <td className="border border-gray-600 px-4 py-2 text-center ">
                <select
                  id={`status-${reservation.id}`}
                  value={reservation.status}
                  onChange={(e) =>
                    handleUpdateStatus(reservation.id, e.target.value)
                  }
                  className="bg-gray-600 border border-gray-500 rounded p-2 text-white w-full font-bold"
                >
                  <option value="0">Select Status</option>
                  <option value="1">รอยืนยันการจอง</option>
                  <option value="2">จองเสร็จสิ้น</option>
                </select>
                <button
                  onClick={() => handlebackhome(reservation.id)}
                  className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-2"
                >
                  ลูกค้ากลับแล้ว
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-2"
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
    </tbody>
  </table>
</div>


    </div>
  );
};

export default TableReservationPage;
