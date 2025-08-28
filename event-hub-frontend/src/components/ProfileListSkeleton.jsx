const ProfileListSkeleton = () => (
    <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
);