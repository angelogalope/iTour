import React, { useState } from 'react';
import { CgMenuRight } from "react-icons/cg";
import { PiMagnifyingGlassBold, PiGlobeFill, PiGreaterThan, PiBellFill, PiCameraFill } from "react-icons/pi";
import { FaMapMarkerAlt, FaQuestionCircle } from 'react-icons/fa';
import { IoMdArrowRoundBack } from "react-icons/io";
import Carousel from './components/Carousel';
import { useNavigate } from 'react-router';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import EventCarousel from './components/EventCarousel';

export default function Settings() {
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [activePage, setActivePage] = useState('settings');

  const handleBack = () => {
    navigate(-1);
  }

  const handleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  }

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
    setIsSideBarOpen(false);
  }

  return (
    <div className="bg-primWhite min-h-screen w-full flex flex-col pb-28">
      <div className="h-[95vh] overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col w-full px-6">

        <div className="flex flex-col w-full items-center justify-between mt-10 ">
          <div className="flex flex-col items-start w-full mb-8 gap-6">
            <button onClick={handleBack}>
              <IoMdArrowRoundBack size={32} /> 
            </button>
            <h1 className="text-3xl font-semibold">Settings</h1>
            {/* <button onClick={handleSideBar} className="fixed right-6 flex items-center rounded-2xl p-4 z-40 bg-white shadow-gray-500 shadow-md">
              <CgMenuRight size={24} />
            </button>
            <SideBar isOpen={isSideBarOpen} onClose={handleSideBar} activePage={activePage} handleNavigation={handleNavigation} /> */}
          </div>
        </div>

        <div className="pb-16 px-6 flex flex-col gap-8">
          <div className="flex flex-col gap-6">

            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-orange-200 p-2 rounded-full">
                  <PiGlobeFill size={28} className="text-orange-400" />
                </div>
                <h1 className="text-xl font-semibold">Languages</h1>
              </div>
              <button className="flex items-center gap-4">
                <p1 className="text-gray-400">English</p1>
                <button className="bg-gray-300 p-2 rounded-md">
                  <PiGreaterThan className="text-white" />
                </button>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-blue-200 p-2 rounded-full">
                  <PiBellFill size={28} className="text-blue-700" />
                </div>
                <h1 className="text-xl font-semibold">Notifications</h1>
              </div>
              <div className="flex items-center gap-4">
                <label class="inline-flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer"/>
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-green-300 p-2 rounded-full">
                  <PiCameraFill size={28} className="text-green-700" />
                </div>
                <h1 className="text-xl font-semibold">Camera</h1>
              </div>
              <div className="flex items-center gap-4">
                <label class="inline-flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer"/>
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-red-300 p-2 rounded-full">
                  <FaMapMarkerAlt size={28} className="text-red-700" />
                </div>
                <h1 className="text-xl font-semibold">Location</h1>
              </div>
              <div className="flex items-center gap-4">
                <label class="inline-flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer"/>
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-red-200 p-3 rounded-full">
                  <FaQuestionCircle size={22} className="text-red-400" />
                </div>
                <h1 className="text-xl font-semibold">Help</h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="bg-gray-300 p-2 rounded-md">
                  <PiGreaterThan className="text-white" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
