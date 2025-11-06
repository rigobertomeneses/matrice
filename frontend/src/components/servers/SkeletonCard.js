import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md animate-pulse">
      <div className="flex items-center gap-4 p-4">
        {/* Número de orden skeleton */}
        <div className="bg-gray-200 rounded-lg p-3 min-w-[60px] h-24"></div>

        {/* Imagen skeleton */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>

        {/* Información skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Botones skeleton */}
        <div className="flex gap-2 flex-shrink-0">
          <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
