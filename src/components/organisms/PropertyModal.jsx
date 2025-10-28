import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PropertySpecItem from "@/components/molecules/PropertySpecItem";
import ApperIcon from "@/components/ApperIcon";

const PropertyModal = ({ property, isOpen, onClose, isSaved, onToggleSaved }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  if (!isOpen || !property) return null;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
    setImageLoading(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300">
          {/* Header */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={() => onToggleSaved(property.Id)}
              className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg backdrop-blur-sm ${
                isSaved 
                  ? "bg-gradient-to-r from-accent to-red-500 text-white" 
                  : "bg-white/90 text-gray-600 hover:text-accent"
              }`}
            >
              <ApperIcon 
                name="Heart" 
                className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} 
              />
            </button>
            
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-white/90 text-gray-600 hover:text-gray-900 transition-all duration-200 transform hover:scale-110 shadow-lg backdrop-blur-sm"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
            {/* Image Gallery */}
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-[4/3] lg:h-full overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                )}
                
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={handleImageLoad}
                />

                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
                    >
                      <ApperIcon name="ChevronLeft" className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
                    >
                      <ApperIcon name="ChevronRight" className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="default" className="bg-black/60 text-white backdrop-blur-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setImageLoading(true);
                      }}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                        index === currentImageIndex 
                          ? "ring-2 ring-primary scale-105" 
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="lg:w-1/2 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Price and Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                      {formatPrice(property.price)}
                    </h1>
                    <h2 className="text-xl font-display font-semibold text-gray-800">
                      {property.title}
                    </h2>
                  </div>
                  <Badge 
                    variant={property.status === "Available" ? "success" : property.status === "Sold" ? "default" : "warning"}
                    className="text-sm font-semibold"
                  >
                    {property.status}
                  </Badge>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-gray-600">
                  <ApperIcon name="MapPin" className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{property.address}</p>
                    <p>{property.city}, {property.state} {property.zipCode}</p>
                  </div>
                </div>

                {/* Property Type and Year */}
                <div className="flex items-center gap-4">
                  <Badge variant="primary" className="text-sm">
                    {property.propertyType}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Built in {property.yearBuilt}
                  </span>
                </div>

                {/* Key Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-background to-gray-50 rounded-xl border border-gray-200">
                  <PropertySpecItem
                    icon="Bed"
                    label="Bedrooms"
                    value={property.bedrooms}
                    className="flex-col items-center text-center gap-2"
                  />
                  <PropertySpecItem
                    icon="Bath"
                    label="Bathrooms"
                    value={property.bathrooms}
                    className="flex-col items-center text-center gap-2"
                  />
                  <PropertySpecItem
                    icon="Square"
                    label="Sq Ft"
                    value={formatSquareFeet(property.squareFeet)}
                    className="flex-col items-center text-center gap-2"
                  />
                  <PropertySpecItem
                    icon="Car"
                    label="Parking"
                    value={property.parking || "None"}
                    className="flex-col items-center text-center gap-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                      Key Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="default" className="text-sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <ApperIcon name="Check" className="w-4 h-4 text-success" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agent Contact */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                    Contact Agent
                  </h3>
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20">
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">
                        {property.agentContact.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <ApperIcon name="Phone" className="w-4 h-4" />
                        {property.agentContact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <ApperIcon name="Mail" className="w-4 h-4" />
                        {property.agentContact.email}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Listing Info */}
                <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                  Listed on {formatDate(property.listingDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;