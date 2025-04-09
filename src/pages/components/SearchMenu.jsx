import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import buildingCoords from "../../data/buildingCoords"; // Import the buildingCoords data

export default function SearchMenu({ onBuildingSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Define animation for height expansion
  const [{ height }, api] = useSpring(() => ({
    height: 12, // Initial collapsed height (in percentage)
    config: { tension: 200, friction: 30 }, // Smooth spring animation
  }));

  // Toggle expansion state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    api.start({
      height: isExpanded ? 12 : 90, // Expand to almost full screen height
    });
  };

  // Drag handler
  const bind = useDrag(
    ({ movement: [, my], last, memo = height.get(), event }) => {
      // Prevent dragging when interacting with input
      if (event.target.tagName === "INPUT") return;

      if (last) {
        // Determine whether to expand or collapse based on drag distance
        if (my > 50) {
          setIsExpanded(false);
          api.start({ height: 12 });
        } else if (my < -50) {
          setIsExpanded(true);
          api.start({ height: 90 });
        } else {
          // Snap back to the current state if drag is insignificant
          api.start({ height: isExpanded ? 90 : 12 });
        }
      } else {
        // Update height dynamically during drag
        api.start({ height: Math.max(12, Math.min(90, memo - my / 10)) });
      }
      return memo;
    }
  );

  // Filter buildings based on search query
  const filteredBuildings = buildingCoords.filter((building) =>
    building.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle building selection
  const handleBuildingClick = (building) => {
    console.log("Building selected:", building); // Debugging log
    setIsExpanded(false); // Explicitly collapse the menu
    api.start({ height: 12 }); // Animate to collapsed height
    onBuildingSelect(building); // Pass the selected building's coordinates to the parent
  };

  return (
    <animated.div
      {...bind()}
      style={{
        height: height.to((h) => `${h}%`), // Convert height to percentage
        touchAction: "none",
      }}
      className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl w-full"
    >
      <div className="flex flex-col items-center gap-2 p-4">
        {/* Drag handle */}
        <hr className="border-4 rounded-full w-28 border-gray-300 cursor-pointer" />

        {/* Search input */}
        <div className="flex items-center w-full bg-gray-200 rounded-xl p-4 mb-6">
          <FaMagnifyingGlass className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent text-lg text-black placeholder-gray-400 outline-none"
            onFocus={() => {
              if (!isExpanded) toggleExpand(); // Expand only if collapsed
            }}
          />
        </div>

        {/* Content area for search results */}
        <div className="w-full flex-grow overflow-y-auto">
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