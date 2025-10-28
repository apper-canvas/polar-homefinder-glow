import React, { useState } from "react";
import PropertySpecItem from "@/components/molecules/PropertySpecItem";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PropertyCard = ({ property, onViewDetails, isSaved, onToggleSaved }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onToggleSaved(property.Id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 group"
      onClick={() => onViewDetails(property)}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        )}
        
        {!imageError ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ApperIcon name="Home" className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="price" className="text-sm font-bold px-3 py-1">
            {formatPrice(property.price)}
          </Badge>
        </div>

        {/* Status Badge */}
        {property.status !== "Available" && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant={property.status === "Sold" ? "default" : "warning"} 
              className="text-xs font-semibold"
            >
              {property.status}
            </Badge>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm ${
            isSaved 
              ? "bg-gradient-to-r from-accent to-red-500 text-white" 
              : "bg-white/90 text-gray-600 hover:text-accent"
          }`}
        >
          <ApperIcon 
            name={isSaved ? "Heart" : "Heart"} 
            className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Property Title */}
        <h3 className="text-lg font-display font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {property.title}
        </h3>

        {/* Address */}
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <ApperIcon name="MapPin" className="w-4 h-4 flex-shrink-0" />
          {property.address}, {property.city}, {property.state} {property.zipCode}
        </p>

        {/* Property Type */}
        <div className="flex items-center justify-between">
          <Badge variant="default" className="text-xs">
            {property.propertyType}
          </Badge>
          <span className="text-xs text-gray-500">
            Built in {property.yearBuilt}
          </span>
        </div>

        {/* Specifications */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <PropertySpecItem
              icon="Bed"
              label="bed"
              value={property.bedrooms}
            />
            <PropertySpecItem
              icon="Bath"
              label="bath"
              value={property.bathrooms}
            />
          </div>
          <PropertySpecItem
            icon="Square"
            label="sqft"
            value={formatSquareFeet(property.squareFeet)}
            className="text-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;