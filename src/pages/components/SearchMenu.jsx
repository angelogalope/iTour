import React from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchMenu() {
  return (
    <div className="absolute bottom-0 z-50 bg-white rounded-t-3xl p-4 w-full">
      <div className="flex flex-col items-center gap-2">
        <hr className="border-4 rounded-full w-28 border-gray-300" />
        <div className="flex items-center w-full bg-primGrey rounded-xl p-4 mb-6">
          <FaMagnifyingGlass className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="flex-grow bg-transparent text-black placeholder-gray-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
