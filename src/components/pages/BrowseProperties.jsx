import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import PropertyCard from "@/components/organisms/PropertyCard";
import PropertyModal from "@/components/organisms/PropertyModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import { propertyService } from "@/services/api/propertyService";
import ApperIcon from "@/components/ApperIcon";

const BrowseProperties = () => {
  const { searchTerm } = useOutletContext() || {};
  
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    propertyTypes: [],
    bedrooms: 0,
    bathrooms: 0,
    location: "",
    sortBy: "newest"
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);

  // Load properties on mount
  useEffect(() => {
    loadProperties();
    loadSavedProperties();
  }, []);

  // Listen for search term changes from header
  useEffect(() => {
    const handleSearchChange = (event) => {
      setFilters(prev => ({ ...prev, location: event.detail }));
    };

    window.addEventListener("searchTermChanged", handleSearchChange);
    return () => window.removeEventListener("searchTermChanged", handleSearchChange);
  }, []);

  // Update location filter when searchTerm changes
  useEffect(() => {
    if (searchTerm !== undefined) {
      setFilters(prev => ({ ...prev, location: searchTerm }));
    }
  }, [searchTerm]);

  // Apply filters whenever filters or properties change
  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError(err.message || "Failed to load properties");
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = () => {
    const saved = localStorage.getItem("savedProperties");
    if (saved) {
      try {
        setSavedProperties(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved properties:", error);
        setSavedProperties([]);
      }
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError("");
      const filtered = await propertyService.search(filters);
      setFilteredProperties(filtered);
    } catch (err) {
      setError(err.message || "Failed to filter properties");
      toast.error("Failed to filter properties");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      bedrooms: 0,
      bathrooms: 0,
      location: "",
      sortBy: "newest"
    });
    toast.success("Filters cleared");
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
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
      toast.success("Property removed from saved list");
    } else {
      updatedSaved = [...currentSaved, propertyId];
      toast.success("Property saved to your list");
    }
    
setSavedProperties(updatedSaved);
    localStorage.setItem("savedProperties", JSON.stringify(updatedSaved));
    
    // Dispatch custom event to notify header
    const event = new Event("savedPropertiesChanged");
    window.dispatchEvent(event);
  };
  const getResultsText = () => {
    const count = filteredProperties.length;
    const hasFilters = filters.priceMin || filters.priceMax || 
                     (filters.propertyTypes && filters.propertyTypes.length > 0) ||
                     filters.bedrooms > 0 || filters.bathrooms > 0 || 
                     filters.location?.trim();
    
    if (hasFilters) {
      return `${count} ${count === 1 ? "property" : "properties"} found`;
    } else {
      return `${count} ${count === 1 ? "property" : "properties"} available`;
    }
  };

  if (loading && properties.length === 0) {
    return <Loading />;
  }

  if (error && properties.length === 0) {
    return <Error message={error} onRetry={loadProperties} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {getResultsText()}
              </h2>
              {filters.location?.trim() && (
                <p className="text-sm text-gray-600 mt-1">
                  in "{filters.location}"
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-auto min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sqft">Square Footage</option>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-gray-600">Filtering properties...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Error message={error} onRetry={loadProperties} />
          )}

          {/* Empty State */}
          {!loading && !error && filteredProperties.length === 0 && (
            <Empty
              title="No properties found"
              description="Try adjusting your search filters or explore different areas to find your perfect home."
              onReset={handleResetFilters}
            />
          )}

          {/* Properties Grid */}
          {!loading && !error && filteredProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.Id}
                  property={property}
                  onViewDetails={handlePropertyClick}
                  isSaved={savedProperties.includes(property.Id)}
                  onToggleSaved={handleToggleSaved}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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

export default BrowseProperties;