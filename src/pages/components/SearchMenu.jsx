import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import buildingCoords from "../../data/buildingCoords";

export default function SearchMenu({ onBuildingSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [{ height }, api] = useSpring(() => ({
    height: 20,
    config: { tension: 200, friction: 30 },
  }));

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    api.start({
      height: isExpanded ? 20 : 80,
    });
  };

  const bind = useDrag(
    ({ movement: [, my], last, memo = height.get(), event }) => {
      
      if (event.target.tagName === "INPUT") return;

      if (last) {
        
        if (my > 50) {
          setIsExpanded(false);
          api.start({ height: 20 });
        } else if (my < -50) {
          setIsExpanded(true);
          api.start({ height: 80 });
        } else {
          api.start({ height: isExpanded ? 80 : 20 });
        }
      } else {
        api.start({ height: Math.max(20, Math.min(80, memo - my / 10)) });
      }
      return memo;
    }
  );

  const filteredBuildings = buildingCoords.filter((building) =>
    building.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuildingClick = (building) => {
    console.log("Building selected:", building);
    setIsExpanded(false);
    api.start({ height: 20 });
    onBuildingSelect(building);
  };

  return (
    <animated.div
      {...bind()}
      style={{
        height: height.to((h) => `${h}%`),
        touchAction: "none",
      }}
      className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl w-full"
    >
      <div className="flex flex-col items-center gap-t-2 p-4">
        <hr className="border-4 rounded-full w-28 border-gray-300 cursor-pointer" />
        <div className="flex items-center w-full bg-gray-200 rounded-xl p-4 mt-4">
          <FaMagnifyingGlass className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent text-lg text-black placeholder-gray-400 outline-none"
            onFocus={() => {
              if (!isExpanded) toggleExpand();
            }}
          />
        </div>
        <div className="w-full flex-grow overflow-y-auto h-[473px] pt-2">
          {filteredBuildings.length > 0 ? (
            filteredBuildings.map((building) => (
              <div
                key={building.id}
                onClick={() => handleBuildingClick(building)}
                className="p-4 bg-gray-100 rounded-lg mb-2 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                {building.building}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">No results found</div>
          )}
        </div>
      </div>
    </animated.div>
  );
}