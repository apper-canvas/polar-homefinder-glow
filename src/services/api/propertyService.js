import propertiesData from "@/services/mockData/properties.json";

let properties = [...propertiesData];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  getAll: async () => {
    await delay(300);
    return [...properties];
  },

  getById: async (id) => {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  create: async (propertyData) => {
    await delay(400);
    const newId = Math.max(...properties.map(p => p.Id)) + 1;
    const newProperty = {
      ...propertyData,
      Id: newId,
      listingDate: new Date().toISOString().split('T')[0],
      status: "Available"
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  update: async (id, propertyData) => {
    await delay(400);
    const index = properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Property not found");
    }
    properties[index] = { ...properties[index], ...propertyData };
    return { ...properties[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Property not found");
    }
    const deletedProperty = properties.splice(index, 1)[0];
    return { ...deletedProperty };
  },

  search: async (filters = {}) => {
    await delay(350);
    let filtered = [...properties];

    // Price filter
    if (filters.priceMin !== undefined && filters.priceMin !== null) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax !== undefined && filters.priceMax !== null) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }

    // Property type filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }

    // Bedrooms filter
    if (filters.bedrooms !== undefined && filters.bedrooms !== null && filters.bedrooms > 0) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms);
    }

    // Bathrooms filter
    if (filters.bathrooms !== undefined && filters.bathrooms !== null && filters.bathrooms > 0) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathrooms);
    }

    // Location filter (search in city, state, address)
    if (filters.location && filters.location.trim()) {
      const searchTerm = filters.location.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(searchTerm) ||
        p.state.toLowerCase().includes(searchTerm) ||
        p.address.toLowerCase().includes(searchTerm) ||
        p.zipCode.includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
          break;
        case "sqft":
          filtered.sort((a, b) => b.squareFeet - a.squareFeet);
          break;
        default:
          // Default to newest
          filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      }
    }

    return filtered;
  }
};