import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedProperties, setSavedProperties] = useState([]);

  // Load saved properties from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedProperties");
    if (saved) {
      try {
        setSavedProperties(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved properties:", error);
        setSavedProperties([]);
      }
    }
  }, []);

  // Listen for storage changes to update saved count
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("savedProperties");
      if (saved) {
        try {
          setSavedProperties(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading saved properties:", error);
          setSavedProperties([]);
        }
      } else {
        setSavedProperties([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event from within the same tab
    window.addEventListener("savedPropertiesChanged", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("savedPropertiesChanged", handleStorageChange);
    };
  }, []);

const handleSearch = (term) => {
    setSearchTerm(term);
    // Dispatch custom event to notify other components
    // CustomEvent is a standard browser API
    window.dispatchEvent(new CustomEvent("searchTermChanged", { detail: term }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-gray-50">
      <Header 
        onSearch={handleSearch} 
        savedCount={savedProperties.length}
      />
      <main className="relative">
        <Outlet context={{ searchTerm }} />
      </main>
    </div>
  );
};

export default Layout;