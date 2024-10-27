import React from 'react';

export default function Preloader() {
  return (
    <div className="bg-[url('assets/CSU-Logo.png')] bg-cover bg-primGreen w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center fade-in">
        <img className="w-[195px]" src="src/assets/iTOUR.png" alt="iTOUR logo" />
        <p className="text-white">Campus Navigation App</p>
      </div>
    </div>
  );
}
