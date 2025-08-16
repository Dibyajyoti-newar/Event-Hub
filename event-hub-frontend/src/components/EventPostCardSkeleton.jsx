import React from 'react';

const EventPostCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200">
            <div className="p-6 animate-pulse">
                {/* College Name Placeholder */}
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                
                {/* Title Placeholder */}
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-3"></div>
                
                {/* Category Placeholder */}
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>

                {/* Date Placeholder */}
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    {/* Like Button Placeholder */}
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    
                    {/* Likes Count Placeholder */}
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
};

export default EventPostCardSkeleton;