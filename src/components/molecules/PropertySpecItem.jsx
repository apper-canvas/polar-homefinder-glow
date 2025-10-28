import React from "react";
import ApperIcon from "@/components/ApperIcon";

const PropertySpecItem = ({ icon, label, value, className = "" }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <ApperIcon 
        name={icon} 
        className="w-4 h-4 text-gray-500 flex-shrink-0" 
      />
      <span className="text-sm text-gray-700 font-medium">
        {value} {label}
      </span>
    </div>
  );
};

export default PropertySpecItem;