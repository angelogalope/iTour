import React, { useState } from 'react';
import { CgMenuRight } from "react-icons/cg";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import Carousel from './components/Carousel';
import { useNavigate } from 'react-router';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import EventCarousel from './components/EventCarousel';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const handleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  }

  const handleVMap = () => {
    navigate('/mapscreen');
  }

  return (
    <div className="bg-primWhite min-h-screen w-full flex flex-col pb-28">
      <div className="flex flex-col w-full">

        <div className="flex flex-col w-full items-center justify-between mt-10 px-6">
          <div className="flex items-center w-full justify-between mb-8">
            <h1 className="text-2xl font-semibold">Hello there!</h1>
            <button onClick={handleSideBar} className="flex items-center rounded-2xl p-4 shadow-slate-400 shadow-md">
              <CgMenuRight size={24} />
            </button>
            <SideBar isOpen={isSideBarOpen} onClose={handleSideBar} />
          </div>
        </div>

        <div className="h-[80vh] overflow-y-auto overflow-x-hidden no-scrollbar pb-16 flex flex-col gap-8">
          <div className="flex flex-col gap-8 px-6">
            <h1 className="text-5xl font-black">Find Your Destination</h1>
            <div className="flex flex-col gap-4">
              <div className="flex p-4 items-center text-gray-500 font-semibold bg-white rounded-lg shadow-slate-400 shadow-md">
                <input type="text" placeholder="Search" className="w-full text-lg outline-none bg-transparent text-black font-normal" />
                <PiMagnifyingGlassBold size={22} />
              </div>
              <button onClick={handleVMap} className="flex bg-[url('/src/assets/map-btn.png')] bg-cover p-4 items-center justify-between rounded-lg shadow-slate-400 shadow-md text-white text-lg font-black">
                <p>Go to CSU Virtual Map</p>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="px-6 text-2xl font-semibold">Upcoming Events</h1>
            <EventCarousel />
          </div>

          <div className="flex flex-col gap-4 py-10">
            <h1 className="px-6 text-2xl font-semibold">Recommended</h1>
            <Carousel />
          </div>
        </div>

        <div className="fixed bottom-0 w-full bg-white rounded-t-[40px] shadow-black shadow-2xl">
          <NavBar />
        </div>
      </div>
    </div>
  )
}
