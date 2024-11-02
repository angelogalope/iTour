import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function SearchMenu() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define animation for height expansion
  const [{ height }, api] = useSpring(() => ({
    height: '12%', // initial collapsed height, adjust as needed
  }));

  // Toggle expansion state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    api.start({
      height: isExpanded ? '12%' : '90%', // Expand to almost full screen height
    });
  };

  // Drag handler, disabled when interacting with input
  const bind = useDrag(({ movement: [, my], memo = height.get(), last, event }) => {
    // Prevent dragging when interacting with input
    if (event.target.tagName === 'INPUT') return;

    if (last) {
      toggleExpand();
    } else {
      api.start({ height: `calc(${memo} + ${my}px)` });
    }
    return memo;
  });

  return (
    <animated.div
      {...bind()}
      style={{
        height,
        touchAction: 'none',
      }}
      className="absolute bottom-0 z-50 bg-white rounded-t-3xl w-full"
    >
      <div className="flex flex-col items-center gap-2 p-4">
        <hr className="border-4 rounded-full w-28 border-gray-300 cursor-pointer" />
        <div className="flex items-center w-full bg-gray-200 rounded-xl p-4 mb-6">
          <FaMagnifyingGlass className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search"
            className="flex-grow bg-transparent text-lg text-black placeholder-gray-400 outline-none"
            onFocus={() => {
              if (!isExpanded) toggleExpand(); // Expand only if collapsed
            }}
          />
        </div>
        {/* Content area for search results */}
        <div className="w-full flex-grow overflow-y-auto">
          {/* Placeholder for FlatList or other content */}
        </div>
      </div>
    </animated.div>
  );
}
