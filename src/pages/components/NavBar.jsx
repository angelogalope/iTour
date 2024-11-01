import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoMapOutline, IoHeartOutline, IoExitOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router';

export default function NavBar() {
  const [activeButton, setActiveButton] = useState('');
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
      <button className="p-4">
        <IoExitOutline size={28} />
      </button>
    </div>
  );
}
