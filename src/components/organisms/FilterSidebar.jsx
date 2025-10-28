import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import PriceRange from "@/components/molecules/PriceRange";
import FilterBadge from "@/components/molecules/FilterBadge";
import ApperIcon from "@/components/ApperIcon";

const FilterSidebar = ({ filters, onFiltersChange, onResetFilters, isOpen, onToggle }) => {
  const [showAllTypes, setShowAllTypes] = useState(false);

  const propertyTypes = ["House", "Apartment", "Condo"];
  const bedOptions = [1, 2, 3, 4, 5];
  const bathOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4];

  const handlePropertyTypeChange = (type, isChecked) => {
    const currentTypes = filters.propertyTypes || [];
    const updatedTypes = isChecked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    onFiltersChange({ ...filters, propertyTypes: updatedTypes });
  };

  const handlePriceRangeChange = (min, max) => {
    onFiltersChange({ 
      ...filters, 
      priceMin: min, 
      priceMax: max 
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.propertyTypes?.length > 0) count++;
    if (filters.bedrooms > 0) count++;
    if (filters.bathrooms > 0) count++;
    if (filters.location?.trim()) count++;
    return count;
  };

  const getFilterLabels = () => {
    const labels = [];
    
    if (filters.priceMin || filters.priceMax) {
      const min = filters.priceMin ? `$${(filters.priceMin / 1000)}k` : "$0";
      const max = filters.priceMax ? `$${(filters.priceMax / 1000)}k` : "∞";
      labels.push(`Price: ${min} - ${max}`);
    }
    
    if (filters.propertyTypes?.length > 0) {
      labels.push(`Type: ${filters.propertyTypes.join(", ")}`);
    }
    
    if (filters.bedrooms > 0) {
      labels.push(`${filters.bedrooms}+ beds`);
    }
    
    if (filters.bathrooms > 0) {
      labels.push(`${filters.bathrooms}+ baths`);
    }
    
    if (filters.location?.trim()) {
      labels.push(`Location: ${filters.location}`);
    }
    
    return labels;
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="SlidersHorizontal" className="w-5 h-5 text-primary" />
          Filters
        </h3>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-sm text-gray-500 hover:text-primary"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {getFilterLabels().map((label, index) => (
              <FilterBadge
                key={index}
                label={label}
                onRemove={() => {
                  // Handle individual filter removal
                  if (label.startsWith("Price:")) {
                    onFiltersChange({ ...filters, priceMin: null, priceMax: null });
                  } else if (label.startsWith("Type:")) {
                    onFiltersChange({ ...filters, propertyTypes: [] });
                  } else if (label.includes("beds")) {
                    onFiltersChange({ ...filters, bedrooms: 0 });
                  } else if (label.includes("baths")) {
                    onFiltersChange({ ...filters, bathrooms: 0 });
                  } else if (label.startsWith("Location:")) {
                    onFiltersChange({ ...filters, location: "" });
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <ApperIcon name="DollarSign" className="w-4 h-4 text-primary" />
          Price Range
        </h4>
        <PriceRange
          min={filters.priceMin}
          max={filters.priceMax}
          onRangeChange={handlePriceRangeChange}
        />
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <ApperIcon name="Home" className="w-4 h-4 text-primary" />
          Property Type
        </h4>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.propertyTypes?.includes(type) || false}
                onChange={(e) => handlePropertyTypeChange(type, e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 group-hover:border-primary transition-colors duration-200"
              />
              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors duration-200">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <ApperIcon name="Bed" className="w-4 h-4 text-primary" />
          Bedrooms
        </h4>
        <Select
          value={filters.bedrooms || ""}
          onChange={(e) => onFiltersChange({ ...filters, bedrooms: parseInt(e.target.value) || 0 })}
        >
          <option value="">Any</option>
          {bedOptions.map((bed) => (
            <option key={bed} value={bed}>
              {bed}+ Bedrooms
            </option>
          ))}
        </Select>
      </div>

      {/* Bathrooms */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <ApperIcon name="Bath" className="w-4 h-4 text-primary" />
          Bathrooms
        </h4>
        <Select
          value={filters.bathrooms || ""}
          onChange={(e) => onFiltersChange({ ...filters, bathrooms: parseFloat(e.target.value) || 0 })}
        >
          <option value="">Any</option>
          {bathOptions.map((bath) => (
            <option key={bath} value={bath}>
              {bath}+ Bathrooms
            </option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={onToggle}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <ApperIcon name="SlidersHorizontal" className="w-4 h-4" />
          Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 h-fit">
        {filterContent}
      </div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen px-4 pt-4">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={onToggle}
            />
            
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-semibold text-gray-900">
                  Property Filters
                </h3>
                <button
                  onClick={onToggle}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filterContent}
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={onToggle}
                  variant="primary"
                  className="flex-1"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={() => {
                    onResetFilters();
                    onToggle();
                  }}
                  variant="outline"
                  className="px-4"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;