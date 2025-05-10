import React from 'react';
import { useNavigate } from 'react-router';

export default function Welcome() {
  const navigate = useNavigate();

  const handleBtn = () => { 
    navigate("/mapscreen");
  };

  return (
    <div className="bg-primGreen p-4 md:p-6 bg-[url('/assets/Welcome-BGLogo.png')] bg-contain bg-no-repeat bg-center relative h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-2 mb-32">
        <img src="/assets/Welcome-Logo.png" alt="Caraga State University Logo" className="max-w-[80%] md:max-w-[60%]" />
      </div>
      <div className="absolute bottom-28 w-full flex justify-center px-4 md:px-6">
        <button
          className="bg-primYellow w-full max-w-md py-3 rounded-full font-bold text-lg md:text-xl text-black"
          onClick={handleBtn}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
