import React, { useState } from "react";
import Input from "@/components/atoms/Input";

const PriceRange = ({ min, max, onRangeChange, className = "" }) => {
  const [minPrice, setMinPrice] = useState(min || "");
  const [maxPrice, setMaxPrice] = useState(max || "");

  const handleMinChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    onRangeChange(value ? parseInt(value) : null, maxPrice ? parseInt(maxPrice) : null);
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    onRangeChange(minPrice ? parseInt(minPrice) : null, value ? parseInt(value) : null);
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return parseInt(value).toLocaleString();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <Input
            type="number"
            value={minPrice}
            onChange={handleMinChange}
            placeholder="$0"
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <Input
            type="number"
            value={maxPrice}
            onChange={handleMaxChange}
            placeholder="Any"
            className="text-sm"
          />
        </div>
      </div>
      
      {(minPrice || maxPrice) && (
        <div className="text-xs text-gray-500 text-center">
          ${formatNumber(minPrice) || "0"} - ${formatNumber(maxPrice) || "∞"}
        </div>
      )}
    </div>
  );
};

export default PriceRange;