import React, { useState, useEffect } from 'react';
import { CgMenuRight } from "react-icons/cg";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import Carousel from './components/Carousel';
import { useNavigate } from 'react-router';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import EventCarousel from './components/EventCarousel';
import buildingCoords from '../data/buildingCoords'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWarning, setShowWarning] = useState(
    () => !sessionStorage.getItem('hasSeenWarning')
  );

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem('hasSeenWarning');
    if (!hasSeenWarning) {
      const warningTimeout = setTimeout(() => {
        setShowWarning(true);
      }, 5000);

      return () => clearTimeout(warningTimeout);
    }
  }, []);

  const handleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  }

  const handleVMap = () => {
    handleMapRedirectWithPrompt();
  }
  
  const handleTour = () => {
    navigate('/tourscreen');
  }
  
  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
    setIsSideBarOpen(false);
  }

  const filteredBuildings = buildingCoords.filter(building =>
    building.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuildingSelect = (building) => {
    handleMapRedirectWithPrompt(building.waypointId);
  };

  const closeWarning = () => {
    sessionStorage.setItem('hasSeenWarning', 'true');
    setShowWarning(false);
  };

  const handleMapRedirectWithPrompt = (selectedBuildingId = null) => {
    if (window.confirm("In order to accurately calibrate the AR 3D model, face South first.")) {
      navigate('/mapscreen', selectedBuildingId ? { state: { selectedBuilding: selectedBuildingId } } : {});
    }
  };

  return (
    <div className="bg-primWhite min-h-screen w-full flex flex-col pb-28">
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/80 p-6 rounded-lg shadow-lg text-center text-sm max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-orange-500">AR/VR Caution</h2>
            <p className="mb-4">
              Please be aware that using AR and VR features may cause motion sickness, dizziness, or eye strain.
              Ensure you are in a safe environment and take breaks if needed.
            </p>
            <button
              onClick={closeWarning}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
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
              <div className="relative">
                <div className="flex p-3 items-center text-gray-500 font-semibold bg-white rounded-lg shadow-gray-500 shadow-md">
                  <input 
                    type="text" 
                    placeholder="Search Destination" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-md outline-none bg-transparent text-black font-normal"
                  />
                  <PiMagnifyingGlassBold size={22} />
                </div>

                {/* Show dropdown only if there are results and input is not empty */}
                {searchQuery && filteredBuildings.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {filteredBuildings.map((building) => (
                      <div
                        key={building.id}
                        onClick={() => {
                          setSearchQuery('');
                          handleBuildingSelect(building);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                      >
                        {building.building}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex w-full gap-2 justify-between items-center"> 
                <button onClick={handleVMap} className="flex w-full bg-[url('/assets/map-btn.png')] bg-cover p-3 items-center justify-between rounded-lg shadow-gray-500 shadow-md text-white text-sm font-medium">
                  <p>CSU AR Map</p>
                </button>
                {/* <button onClick={handleTour} className="flex w-full bg-[url('/assets/map-btn.png')] bg-cover p-3 items-center justify-between rounded-lg shadow-gray-500 shadow-md text-white text-sm font-medium">
                  <p>CSU 360 Tour</p>
                </button> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-2">
            <h1 className="px-6 text-lg font-semibold">Interior 360 Virtual Tour</h1>
            <Carousel />
          </div>

          <div className="flex flex-col gap-4 pt-2 pb-36 mt-4">
            <h1 className="px-6 text-lg font-semibold">Upcoming CSU - Main Events</h1>
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
