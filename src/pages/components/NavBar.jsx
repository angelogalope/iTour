import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoMapOutline, IoHeartOutline, IoExitOutline } from "react-icons/io5";
import { MdOutlineEvent } from "react-icons/md";
import { useNavigate, useLocation } from 'react-router';

// Check if Capacitor is available
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

export default function NavBar() {
  const [activeButton, setActiveButton] = useState('');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active button based on the current path
    switch (location.pathname) {
      case '/dashboard':
        setActiveButton('home');
        break;
      case '/mapscreen':
        setActiveButton('map');
        break;
      case '/favorites':
        setActiveButton('favorites');
        break;
      case '/eventlist':
        setActiveButton('eventlist');
        break;
      default:
        setActiveButton('');
    }
  }, [location.pathname]);

  const handleHomeBtn = () => {
    navigate('/dashboard');
  };

  const handleMapBtn = () => {
    navigate('/mapscreen');
  };

  const handleFavBtn = () => {
    navigate('/favorites');
  };
  
  const handleEventBtn = () => {
    navigate('/eventlist');
  };

  const handleExitBtn = () => {
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    // Check if the platform is Android or iOS
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      CapacitorApp.exitApp(); // Exits the app on native platforms
    } else {
      // Fallback for the web: display an alert or other notification
      alert("Exit is not supported on the web. Close the browser tab to exit.");
    }
  };

  return (
    <div className="flex justify-between items-center mb-2 px-16 md:px-20">
      <button
        onClick={handleHomeBtn}
        className={`p-4 ${activeButton === 'home' ? 'text-secGreen border-b-2 border-secGreen' : ''}`}
      >
        <IoHomeOutline size={28} />
      </button>
      <button
        onClick={handleMapBtn}
        className="relative text-white bottom-10 flex items-center justify-center w-16 h-16 bg-secGreen rounded-full shadow-slate-400 shadow-lg"
      >
        <IoMapOutline size={28} />
      </button>
      {/* <button
        onClick={handleFavBtn}
        className={`p-4 ${activeButton === 'favorites' ? 'rounded-2xl shadow-slate-400 shadow-md bg-secGreen text-white' : ''}`}
      >
        <IoHeartOutline size={28} />
      </button> */}
      <button onClick={handleEventBtn} className={`p-4 ${activeButton === 'eventlist' ? 'text-secGreen border-b-2 border-secGreen' : ''}`}>
        <MdOutlineEvent size={28} />
      </button>

      {/* Confirmation Dialog */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <p>Are you sure you want to exit?</p>
            <div className="flex justify-around mt-4">
              <button onClick={() => setShowExitConfirmation(false)} className="bg-gray-200 p-2 rounded">
                Cancel
              </button>
              <button onClick={confirmExit} className="bg-red-500 text-white p-2 rounded">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import React from 'react';
// import { IoHomeOutline, IoMapOutline, IoHeartOutline, IoExitOutline } from "react-icons/io5";
// import { useNavigate, useLocation } from 'react-router';

// const NavBar = () => {
//   const navigate = useNavigate();

//   const handleMapBtn = navigate('/mapscreen');

//   return (
//     <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center bg-white py-2 px-20 rounded-t-[40px] shadow-black shadow-2xl">
//       {/* Home Icon */}
//       <div className="flex flex-col items-center text-secGreen">
//         <IoHomeOutline size={28} />
//       </div>

//       {/* Center Icon (highlighted) */}
//       <button onClick={handleMapBtn} className="absolute bottom-10 flex items-center justify-center w-20 h-20 bg-secGreen rounded-full shadow-black shadow-lg">
//         <IoMapOutline size={36} className="text-white" />
//       </button>

//       {/* Exit Icon */}
//       <div className="flex flex-col items-center">
//         <IoExitOutline size={28} />
//       </div>
//     </div>
//   );
// };

// export default NavBar;
