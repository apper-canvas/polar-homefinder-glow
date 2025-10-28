import React from "react";

const Loading = () => {
  return (
    <div className="space-y-8">
      {/* Filter skeleton */}
      <div className="lg:hidden">
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
      </div>
      
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Property cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Image skeleton */}
            <div className="aspect-[16/9] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Price */}
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              
              {/* Title */}
              <div className="h-5 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              
              {/* Address */}
              <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              
              {/* Specs */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;