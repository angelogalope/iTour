import React, { useEffect } from 'react';
import { IoExitOutline } from "react-icons/io5";

const SideBar = ({ isOpen, onClose }) => {
  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && event.target.closest('#drawer-navigation') === null) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
        ></div>
      )}

      {/* Drawer */}
      <div
        id="drawer-navigation"
        className={`fixed top-0 right-0 z-40 w-64 h-screen p-4 pt-16 overflow-y-auto transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-white`}
        aria-labelledby="drawer-navigation-label"
      >
        <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-400 uppercase">
          Menu
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 left-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        {/* Drawer content */}
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <a href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                {/* Icon */}
                <span className="ms-3">Home</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                {/* Icon */}
                <span className="ms-3">Settings</span>
              </a>
            </li>
            <li>
              <a href="#" className="absolute bottom-10 flex items-center p-2 text-red-500 rounded-lg hover:bg-gray-100">
                {/* Icon */}
                <span className="mx-3">Exit</span>
                <IoExitOutline />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
