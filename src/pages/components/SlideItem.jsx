import React, { useEffect, useState } from 'react';

const SlideItem = ({ item }) => {
  const [translateY, setTranslateY] = useState(40);

  useEffect(() => {
    // Simulating the animation behavior on component mount
    const timeout = setTimeout(() => {
      setTranslateY(0); // animate to original position
    }, 100); // starts animation after 100ms

    return () => clearTimeout(timeout); // cleanup
  }, []);

  return (
    <div className="flex flex-col p-8">
      <h1 className="text-white text-center font-bold" style={{ fontSize: window.innerWidth > 400 ? '32px' : '20px' }}>
        {item.title}
      </h1>
      <img
        src={item.img}
        alt={item.title}
        className="w-full transition-transform duration-1000 ease-bounce"
        style={{
          transform: `translateY(${translateY}px)`,
        }}
      />
      <div className="flex flex-col items-center">
        <p className="text-white text-center mt-3" style={{ fontSize: window.innerWidth > 400 ? '18px' : '14px' }}>
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default SlideItem;
