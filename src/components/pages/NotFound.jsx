/* global CustomEvent */
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Home" className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-display font-semibold text-gray-800 mb-3">
            Property Not Found
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            Sorry, the property you're looking for seems to have moved or doesn't exist. 
            Let's help you find your perfect home instead.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            Browse Properties
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-background to-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-display font-semibold text-gray-900 mb-3">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Seattle", "San Diego", "Portland", "Austin", "Miami", "Boston"].map((city) => (
              <button
                key={city}
                onClick={() => {
                  navigate("/");
                  // Trigger a search for this city
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("searchTermChanged", { detail: city }));
                  }, 100);
                }}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary cursor-pointer transition-colors duration-200"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;