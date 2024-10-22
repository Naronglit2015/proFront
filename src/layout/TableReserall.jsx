import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const TableReservationPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Fetch reservations without a token
        const response = await axios.get('http://localhost:8889/auth/tableReser01');

        console.log('Fetched reservations:', response.data); // Check the data
        setReservations(response.data); // Store the reservations
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  // Function to check if a table is reserved
  const isTableReserved = (tableNum) => {
    return reservations.some(reservation => reservation.tableNumber && reservation.tableNumber === String(tableNum));
  };

  // Function to handle click on a vacant table
  const handleVacantTableClick = () => {
    Swal.fire({
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'กรุณาเข้าสู่ระบบก่อนจึงจะสามารถจองโต๊ะได้',
      icon: 'warning',
      confirmButtonText: 'เข้าสู่ระบบ',
      confirmButtonColor: '#3085d6',
      showCancelButton: false,
      preConfirm: () => {
        window.location.href = '/'; // Redirect to login page
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div
        className="bg-gradient-to-br from-gray-800 to-black min-h-screen p-8 relative"
        style={{
          backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")',

        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-lg bg-gray-800 rounded-md shadow-lg relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">
            สถานะการจองโต๊ะ
          </h1>
          <div className="space-y-6">
            <div>
              <label className="block font-bold text-white mb-4 text-lg">
                หมายเลขโต๊ะ :
              </label>
              <div className="grid grid-cols-4 gap-4">
                {/* Loop over table numbers 1 to 20 */}
                {[...Array(20).keys()].map((num) => {
                  const tableNum = num + 1; // Convert index to table number starting from 1
                  const isReserved = isTableReserved(tableNum); // Check if the table is reserved

                  // Always render the table number, but show "จองแล้ว" if it's reserved
                  const buttonClasses = `flex items-center justify-center border border-gray-600 rounded-lg py-3 px-4 font-semibold text-lg focus:outline-none ${
                    isReserved
                      ? 'bg-red-600 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-500'
                  } transition-all duration-300`;

                  return (
                    <button
                      key={tableNum}
                      className={buttonClasses}
                      disabled={isReserved}
                      onClick={() => {
                        if (!isReserved) {
                          handleVacantTableClick(); // Trigger SweetAlert when the table is not reserved
                        }
                      }}
                    >
                      {tableNum} <br /> {isReserved ? 'จองแล้ว' : 'ว่าง'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableReservationPage;
