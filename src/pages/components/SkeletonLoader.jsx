import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="animate-pulse flex flex-col gap-4">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
            <div className="bg-gray-200 h-6 rounded"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
    );
};

export default SkeletonLoader;
