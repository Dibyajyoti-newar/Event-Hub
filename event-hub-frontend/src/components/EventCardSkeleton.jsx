import React from 'react';

const EventCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="animate-pulse">
                {/* Image/Icon Placeholder */}
                <div className="w-full h-32 bg-gray-200"></div>
                <div className="p-6">
                    {/* College Name Placeholder */}
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    {/* Title Placeholder */}
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    {/* Date Placeholder */}
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    );
};

export default EventCardSkeleton;