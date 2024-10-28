import React from 'react';
import { useNavigate } from 'react-router';

export default function Welcome() {
  const navigate = useNavigate();

  const handleBtn = () => {
    navigate("/mapscreen");
  };

  return (
    <div className="bg-primGreen p-6 bg-[url('assets/Welcome-BGLogo.png')] bg-contain bg-no-repeat bg-center relative h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <img src="src/assets/Welcome-Logo.png" alt="Caraga State University Logo"/>
      </div>
      <div className="absolute bottom-10 w-full flex justify-center px-6">
        <button
          className="bg-primYellow w-full max-w-md py-3 rounded-full font-bold text-xl text-black"
          onClick={handleBtn}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
