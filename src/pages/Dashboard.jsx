import React from 'react';
import { CgMenuRight } from "react-icons/cg";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import Carousel from './components/Carousel';
import { useNavigate } from 'react-router';
import NavBar from './components/NavBar';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleVMap = () => {
    navigate('/mapscreen');
  }

  return (
    <div className="bg-primWhite h-screen w-full flex items-center justify-center pb-18 overflow-y-hidden">
      <div className="flex flex-col w-full">

        <div className="flex flex-row w-full items-center justify-between mb-8 px-6">
          <h1 className="text-2xl font-semibold">Hello there!</h1>
          <div className="flex items-center rounded-2xl p-4 shadow-slate-400 shadow-md">
            <CgMenuRight size={24} />
          </div>
        </div>

        <div className="flex flex-col gap-8 mb-8  px-6">
          <h1 className="text-5xl font-black">
            Find Your Destination
          </h1>
          <div className="flex flex-col gap-4">
            <div className="flex p-4 items-center text-gray-500 font-semibold bg-white rounded-lg shadow-slate-400 shadow-md">
              <input type="text" placeholder="Search" className="w-full text-lg outline-none bg-transparent text-black font-normal" />
              <PiMagnifyingGlassBold size={22} />
            </div>
            <button onClick={handleVMap} className="flex bg-[url('/src/assets/map-btn.png')] bg-cover p-4 items-center justify-between rounded-lg shadow-slate-400 shadow-md text-white text-lg font-black">
              <p className="">
                Go to CSU Virtual Map
              </p>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="px-6 text-2xl font-semibold">Recommended</h1>
          <Carousel />
        </div>

        <div className="fixed bottom-0 w-full bg-white rounded-t-[40px] shadow-black shadow-2xl">
          <NavBar />
        </div>

      </div>
    </div>
  )
}
