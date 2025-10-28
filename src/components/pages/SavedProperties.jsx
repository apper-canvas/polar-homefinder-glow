import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropertyCard from "@/components/organisms/PropertyCard";
import PropertyModal from "@/components/organisms/PropertyModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { propertyService } from "@/services/api/propertyService";
import ApperIcon from "@/components/ApperIcon";

const SavedProperties = () => {
  const navigate = useNavigate();
  
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Load saved properties on mount
  useEffect(() => {
    loadSavedProperties();
  }, []);

  // Listen for saved properties changes
  useEffect(() => {
    const handleSavedChange = () => {
      loadSavedProperties();
    };

    window.addEventListener("savedPropertiesChanged", handleSavedChange);
    return () => window.removeEventListener("savedPropertiesChanged", handleSavedChange);
  }, []);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get saved property IDs from localStorage
      const savedIds = localStorage.getItem("savedProperties");
      if (!savedIds) {
        setSavedProperties([]);
        setProperties([]);
        setLoading(false);
        return;
      }

      const parsedIds = JSON.parse(savedIds);
      setSavedProperties(parsedIds);
      
      if (parsedIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      // Fetch all properties and filter saved ones
      const allProperties = await propertyService.getAll();
      const savedPropertyData = allProperties.filter(property => 
        parsedIds.includes(property.Id)
      );
      
      // Sort properties
      const sortedProperties = sortProperties(savedPropertyData, sortBy);
      setProperties(sortedProperties);
      
    } catch (err) {
      setError(err.message || "Failed to load saved properties");
      toast.error("Failed to load saved properties");
    } finally {
      setLoading(false);
    }
  };

  const sortProperties = (properties, sortType) => {
    const sorted = [...properties];
    
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      case "sqft":
        return sorted.sort((a, b) => b.squareFeet - a.squareFeet);
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sortedProperties = sortProperties(properties, newSortBy);
    setProperties(sortedProperties);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleToggleSaved = (propertyId) => {
    const currentSaved = [...savedProperties];
    const isCurrentlySaved = currentSaved.includes(propertyId);
    
    let updatedSaved;
    if (isCurrentlySaved) {
      updatedSaved = currentSaved.filter(id => id !== propertyId);
      setProperties(prev => prev.filter(p => p.Id !== propertyId));
      toast.success("Property removed from saved list");
    } else {
      updatedSaved = [...currentSaved, propertyId];
      toast.success("Property saved to your list");
    }
    
setSavedProperties(updatedSaved);
    localStorage.setItem("savedProperties", JSON.stringify(updatedSaved));
    
    // Dispatch custom event to notify header and other components
    window.dispatchEvent(new window.CustomEvent("savedPropertiesChanged"));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all saved properties?")) {
setSavedProperties([]);
      setProperties([]);
      localStorage.removeItem("savedProperties");
      window.dispatchEvent(new window.CustomEvent("savedPropertiesChanged"));
      toast.success("All saved properties cleared");
    }
  };

  const handleBrowseMore = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadSavedProperties} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-red-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Heart" className="w-5 h-5 text-white fill-current" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Saved Properties
          </h1>
        </div>
        <p className="text-gray-600">
          Keep track of your favorite properties and compare them easily
        </p>
      </div>

      {properties.length === 0 ? (
        <Empty
          title="No saved properties yet"
          description="Start browsing properties and save the ones you love by clicking the heart icon. They'll appear here for easy access."
          onReset={handleBrowseMore}
          showSearchSuggestions={false}
        />
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-900">
                {properties.length} {properties.length === 1 ? "property" : "properties"} saved
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-auto min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sqft">Square Footage</option>
                <option value="title">Name A-Z</option>
              </Select>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.Id}
                property={property}
                onViewDetails={handlePropertyClick}
                isSaved={true} // All properties here are saved
                onToggleSaved={handleToggleSaved}
              />
            ))}
          </div>

          {/* Browse More Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
                Looking for more options?
              </h3>
              <p className="text-gray-600 mb-6">
                Discover thousands more properties that match your preferences
              </p>
              <Button
                onClick={handleBrowseMore}
                className="inline-flex items-center gap-2"
              >
                <ApperIcon name="Search" className="w-4 h-4" />
                Browse All Properties
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
        isSaved={selectedProperty ? savedProperties.includes(selectedProperty.Id) : false}
        onToggleSaved={handleToggleSaved}
      />
    </div>
  );
};

export default SavedProperties;