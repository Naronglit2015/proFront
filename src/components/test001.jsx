import React, { useState } from 'react';

const TestPage = () => {
  const [showImage, setShowImage] = useState(false);

  const handleButtonClick = () => {
    setShowImage(true);
  };

  return (
    <div className="bg-pink-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-800">This is a Test Page</h1>
        <p className="font-bold text-lg text-center text-gray-600">รักเธอไปแล้ววววววววววววววววววววววววววววววววววววววววววววววววววววววว</p>
        <div className="flex justify-center mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full" onClick={handleButtonClick}>Click Me</button>
        </div>
        {showImage && (
          <div className="mt-6 flex justify-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSftDFVTuwfXcuM1A2fTle2dFsI9UOq8Ri8Iw&usqp=CAU" alt="Your Image" className="max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
