import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onSearch, savedCount = 0 }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleSavedClick = () => {
    navigate("/saved");
    setIsMobileMenuOpen(false);
  };

  const isActivePage = (path) => {
    if (path === "/" && location.pathname === "") return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
              <ApperIcon name="Home" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HomeFinder
            </h1>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar onSearch={onSearch} className="w-full" />
          </div>

          {/* Desktop Navigation */}
<nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                isActivePage("/") || isActivePage("")
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-700 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Browse Properties
            </button>
            
            <button
              onClick={handleSavedClick}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                isActivePage("/saved")
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-700 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <ApperIcon name="Heart" className="w-4 h-4" />
              Saved Homes
              {savedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {savedCount > 99 ? "99+" : savedCount}
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 text-gray-700 hover:text-primary hover:bg-primary/5"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={onSearch} className="w-full" />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => navigate("/")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 ${
                isActivePage("/") || isActivePage("")
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name="Search" className="w-5 h-5" />
              Browse Properties
            </button>
            
<button
              onClick={handleSavedClick}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between ${
                isActivePage("/saved")
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <ApperIcon name="Heart" className="w-5 h-5" />
                Saved Homes
              </div>
              {savedCount > 0 && (
                <span className="bg-gradient-to-r from-accent to-red-500 text-white text-xs rounded-full px-2 py-1 font-bold shadow-md">
                  {savedCount > 99 ? "99+" : savedCount}
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 text-gray-700 hover:bg-gray-50"
            >
              <ApperIcon name="LogOut" className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;