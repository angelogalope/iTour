import React from 'react';

const EventListSkeleton = () => {
    return (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="bg-gray-200 h-10 rounded"></div>
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
    );
};

export default EventListSkeleton;
