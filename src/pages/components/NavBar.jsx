import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoMapOutline, IoHeartOutline, IoExitOutline } from "react-icons/io5";
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
    <div className="flex justify-between items-center mb-2 p-6">
      <button
        onClick={handleHomeBtn}
        className={`p-4 ${activeButton === 'home' ? 'rounded-2xl shadow-slate-400 shadow-md bg-secGreen text-white' : ''}`}
      >
        <IoHomeOutline size={28} />
      </button>
      <button
        onClick={handleMapBtn}
        className={`p-4 ${activeButton === 'map' ? 'rounded-2xl shadow-slate-400 shadow-md bg-secGreen text-white' : ''}`}
      >
        <IoMapOutline size={28} />
      </button>
      <button
        onClick={handleFavBtn}
        className={`p-4 ${activeButton === 'favorites' ? 'rounded-2xl shadow-slate-400 shadow-md bg-secGreen text-white' : ''}`}
      >
        <IoHeartOutline size={28} />
      </button>
      <button onClick={handleExitBtn} className="p-4">
        <IoExitOutline size={28} />
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
