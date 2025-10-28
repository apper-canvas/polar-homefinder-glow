import { getApperClient } from "@/services/apperClient";

// Field name mapping utilities
const toDbFormat = (property) => {
  const dbProperty = {
    Name: property.title || property.Name,
    title_c: property.title,
    price_c: property.price,
    address_c: property.address,
    city_c: property.city,
    state_c: property.state,
    zip_code_c: property.zipCode,
    property_type_c: property.propertyType,
    bedrooms_c: property.bedrooms,
    bathrooms_c: property.bathrooms,
    square_feet_c: property.squareFeet,
    year_built_c: property.yearBuilt,
    description_c: property.description,
    listing_date_c: property.listingDate,
    status_c: property.status,
    parking_c: property.parking?.toString() || "",
    agent_contact_name_c: property.agentContact?.name || "",
    agent_contact_phone_c: property.agentContact?.phone || "",
    agent_contact_email_c: property.agentContact?.email || "",
    coordinates_lat_c: property.coordinates?.lat,
    coordinates_lng_c: property.coordinates?.lng,
    images_c: property.images ? JSON.stringify(property.images) : "",
    features_c: property.features ? JSON.stringify(property.features) : "",
    amenities_c: property.amenities ? JSON.stringify(property.amenities) : ""
  };

  // Remove undefined/null values
  Object.keys(dbProperty).forEach(key => {
    if (dbProperty[key] === undefined || dbProperty[key] === null || dbProperty[key] === "") {
      delete dbProperty[key];
    }
  });

  return dbProperty;
};

const fromDbFormat = (dbProperty) => {
  if (!dbProperty) return null;
  
  return {
    Id: dbProperty.Id,
    title: dbProperty.title_c || "",
    price: dbProperty.price_c || 0,
    address: dbProperty.address_c || "",
    city: dbProperty.city_c || "",
    state: dbProperty.state_c || "",
    zipCode: dbProperty.zip_code_c || "",
    propertyType: dbProperty.property_type_c || "",
    bedrooms: dbProperty.bedrooms_c || 0,
    bathrooms: dbProperty.bathrooms_c || 0,
    squareFeet: dbProperty.square_feet_c || 0,
    yearBuilt: dbProperty.year_built_c || 0,
    description: dbProperty.description_c || "",
    listingDate: dbProperty.listing_date_c || "",
    status: dbProperty.status_c || "Available",
    parking: dbProperty.parking_c || "0",
    agentContact: {
      name: dbProperty.agent_contact_name_c || "",
      phone: dbProperty.agent_contact_phone_c || "",
      email: dbProperty.agent_contact_email_c || ""
    },
    coordinates: {
      lat: dbProperty.coordinates_lat_c || 0,
      lng: dbProperty.coordinates_lng_c || 0
    },
    images: dbProperty.images_c ? JSON.parse(dbProperty.images_c) : [],
    features: dbProperty.features_c ? JSON.parse(dbProperty.features_c) : [],
    amenities: dbProperty.amenities_c ? JSON.parse(dbProperty.amenities_c) : []
  };
};

export const propertyService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("property_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "parking_c" } },
          { field: { Name: "agent_contact_name_c" } },
          { field: { Name: "agent_contact_phone_c" } },
          { field: { Name: "agent_contact_email_c" } },
          { field: { Name: "coordinates_lat_c" } },
          { field: { Name: "coordinates_lng_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "amenities_c" } }
        ],
        orderBy: [{ fieldName: "listing_date_c", sorttype: "DESC" }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(fromDbFormat);
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("property_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "parking_c" } },
          { field: { Name: "agent_contact_name_c" } },
          { field: { Name: "agent_contact_phone_c" } },
          { field: { Name: "agent_contact_email_c" } },
          { field: { Name: "coordinates_lat_c" } },
          { field: { Name: "coordinates_lng_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "amenities_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Property not found");
      }

      return fromDbFormat(response.data);
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },

  create: async (propertyData) => {
    try {
      const apperClient = getApperClient();
      const dbProperty = toDbFormat(propertyData);

      const response = await apperClient.createRecord("property_c", {
        records: [dbProperty]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create property: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create property");
        }
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return fromDbFormat(successful[0].data);
        }
      }

      throw new Error("Failed to create property");
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  update: async (id, propertyData) => {
    try {
      const apperClient = getApperClient();
      const dbProperty = toDbFormat(propertyData);
      dbProperty.Id = parseInt(id);

      const response = await apperClient.updateRecord("property_c", {
        records: [dbProperty]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update property: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update property");
        }
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return fromDbFormat(successful[0].data);
        }
      }

      throw new Error("Failed to update property");
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord("property_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete property: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete property");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },

  search: async (filters = {}) => {
    try {
      const apperClient = getApperClient();
      const where = [];
      const whereGroups = [];

      // Price filters
      if (filters.priceMin !== undefined && filters.priceMin !== null) {
        where.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }
      if (filters.priceMax !== undefined && filters.priceMax !== null) {
        where.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }

      // Property type filter
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        where.push({
          FieldName: "property_type_c",
          Operator: "ExactMatch",
          Values: filters.propertyTypes,
          Include: true
        });
      }

      // Bedrooms filter
      if (filters.bedrooms !== undefined && filters.bedrooms !== null && filters.bedrooms > 0) {
        where.push({
          FieldName: "bedrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedrooms]
        });
      }

      // Bathrooms filter
      if (filters.bathrooms !== undefined && filters.bathrooms !== null && filters.bathrooms > 0) {
        where.push({
          FieldName: "bathrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathrooms]
        });
      }

      // Location filter
      if (filters.location && filters.location.trim()) {
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "city_c",
                  operator: "Contains",
                  values: [filters.location.trim()]
                },
                {
                  fieldName: "state_c",
                  operator: "Contains",
                  values: [filters.location.trim()]
                },
                {
                  fieldName: "address_c",
                  operator: "Contains",
                  values: [filters.location.trim()]
                },
                {
                  fieldName: "zip_code_c",
                  operator: "Contains",
                  values: [filters.location.trim()]
                }
              ],
              operator: "OR"
            }
          ]
        });
      }

      // Status filter
      if (filters.status && filters.status !== "All") {
        where.push({
          FieldName: "status_c",
          Operator: "EqualTo",
          Values: [filters.status]
        });
      }

      // Determine sort order
      let orderBy = [{ fieldName: "listing_date_c", sorttype: "DESC" }];
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            orderBy = [{ fieldName: "price_c", sorttype: "ASC" }];
            break;
          case "price-high":
            orderBy = [{ fieldName: "price_c", sorttype: "DESC" }];
            break;
          case "newest":
            orderBy = [{ fieldName: "listing_date_c", sorttype: "DESC" }];
            break;
          case "sqft":
            orderBy = [{ fieldName: "square_feet_c", sorttype: "DESC" }];
            break;
          default:
            orderBy = [{ fieldName: "listing_date_c", sorttype: "DESC" }];
        }
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "parking_c" } },
          { field: { Name: "agent_contact_name_c" } },
          { field: { Name: "agent_contact_phone_c" } },
          { field: { Name: "agent_contact_email_c" } },
          { field: { Name: "coordinates_lat_c" } },
          { field: { Name: "coordinates_lng_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "amenities_c" } }
        ],
        orderBy
      };

      if (where.length > 0) {
        params.where = where;
      }

      if (whereGroups.length > 0) {
        params.whereGroups = whereGroups;
      }

      const response = await apperClient.fetchRecords("property_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(fromDbFormat);
    } catch (error) {
      console.error("Error searching properties:", error);
      throw error;
    }
  }
};