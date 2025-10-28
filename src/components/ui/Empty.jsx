import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No properties found", 
  description = "Try adjusting your search filters or explore different areas",
  onReset,
  showSearchSuggestions = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="Home" className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
            Clear Filters
          </button>
        )}
        
        <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105">
          <ApperIcon name="Search" className="w-4 h-4" />
          Browse All Properties
        </button>
      </div>

      {showSearchSuggestions && (
        <div className="mt-12 p-6 bg-gradient-to-r from-background to-gray-50 rounded-xl border border-gray-200 max-w-md">
          <h4 className="font-display font-semibold text-gray-900 mb-3">Try searching for:</h4>
          <div className="flex flex-wrap gap-2">
            {["Downtown", "Suburbia", "Luxury", "Condos", "Houses", "Apartments"].map((suggestion) => (
              <span 
                key={suggestion}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary cursor-pointer transition-colors duration-200"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Empty;