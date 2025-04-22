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
  const [activePage, setActivePage] = useState('dashboard');

  const handleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  }

  const handleVMap = () => {
    navigate('/mapscreen');
  }
  
  const handleTour = () => {
    navigate('/tourscreen');
  }
  
  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
    setIsSideBarOpen(false);
  }

  return (
    <div className="bg-primWhite min-h-screen w-full flex flex-col pb-28">
      <div className="h-[95vh] overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col w-full">

        <div className="flex flex-col w-full items-center justify-between mt-10 mb-4 px-6">
          <div className="flex items-center w-full justify-between">
            <h1 className="text-xl font-semibold">Hello there!</h1>
            <button onClick={handleSideBar} className="fixed right-6 flex items-center rounded-lg p-2 z-40 bg-white shadow-gray-500 shadow-md">
              <CgMenuRight size={20} />
            </button>
            <SideBar isOpen={isSideBarOpen} onClose={handleSideBar} activePage={activePage} handleNavigation={handleNavigation} />
          </div>
        </div>

        <div className="pb-16 flex flex-col gap-4">
          <div className="flex flex-col gap-4 px-6">
            <h1 className="flex flex-col text-3xl font-black">Navigate To <span>Your Destination</span></h1>
            <div className="flex flex-col gap-4">
              <div className="flex p-3 items-center text-gray-500 font-semibold bg-white rounded-lg shadow-gray-500 shadow-md">
                <input type="text" placeholder="Search" className="w-full text-lg outline-none bg-transparent text-black font-normal" />
                <PiMagnifyingGlassBold size={22} />
              </div>
              <div className="flex w-full gap-2 justify-between items-center"> 
              <button onClick={handleVMap} className="flex w-full bg-[url('/src/assets/map-btn.png')] bg-cover p-3 items-center justify-between rounded-lg shadow-gray-500 shadow-md text-white text-sm font-medium">
                <p>CSU 3D Virtual Map</p>
              </button>
              <button onClick={handleTour} className="flex w-full bg-[url('/src/assets/map-btn.png')] bg-cover p-3 items-center justify-between rounded-lg shadow-gray-500 shadow-md text-white text-sm font-medium">
                <p>CSU 360 Tour</p>
              </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="px-6 text-xl font-semibold">Recommended</h1>
            <Carousel />
          </div>

          <div className="flex flex-col gap-4 pt-2 pb-14 mt-4">
            <h1 className="px-6 text-xl font-semibold">Upcoming CSU - Main Events</h1>
            <EventCarousel />
          </div>

        </div>

        <div className="fixed bottom-6 w-full flex justify-center">
          <div className="bg-white rounded-full shadow-black shadow-2xl w-full max-w-[90%]">
            <NavBar />
          </div>
        </div>
      </div>
    </div>
  )
}
