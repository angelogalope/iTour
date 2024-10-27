import React, { useEffect, useRef, useState } from 'react';

const Pagination = ({ data, scrollX, index }) => {
  const [dotStyles, setDotStyles] = useState([]);

  useEffect(() => {
    // Simulate scrollX interpolation with dynamic styling based on index
    const newDotStyles = data.map((_, idx) => {
      const isActive = idx === index;
      return {
        width: isActive ? '30px' : '12px',
        opacity: isActive ? 1 : 0.2,
        backgroundColor: isActive ? '#F9DE06' : '#ccc',
      };
    });
    setDotStyles(newDotStyles);
  }, [index, data]);

  return (
    <div className="flex w-full justify-center">
      {data.map((_, idx) => (
        <div
          key={idx}
          className="h-3 rounded-full mx-1 transition-all"
          style={{
            width: dotStyles[idx]?.width,
            opacity: dotStyles[idx]?.opacity,
            backgroundColor: dotStyles[idx]?.backgroundColor,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Pagination;
