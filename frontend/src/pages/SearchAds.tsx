import { PrintSearchAds } from "../components/PrintSearchAds";
import { Filter } from "./Filter";
import { SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";

export const SearchAds = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Mobile Filter Button */}
      <div
        className={`lg:hidden sticky top-0 z-10 shadow-md p-3 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <button
          onClick={toggleMobileFilter}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-blue-700 hover:bg-blue-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20">
          <div
            className={`h-full w-4/5 max-w-xs p-4 shadow-lg animate-slide-in ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={toggleMobileFilter}
                className={`p-1 rounded-full transition-colors ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-3rem)]">
              <Filter />
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="lg:grid lg:grid-cols-[250px_1fr] container mx-auto">
        {/* Desktop Filter */}
        <div
          className={`hidden lg:block shadow-md rounded-lg m-4 p-4 h-min sticky top-4 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-4 border-b pb-2 ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            Filters
          </h2>
          <Filter />
        </div>

        {/* AllAds */}
        <div className="p-4">
          <div
            className={`shadow-md rounded-lg p-4 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h1 className="text-2xl font-bold mb-4">Explore Products</h1>
            <PrintSearchAds />
          </div>
        </div>
      </div>
    </div>
  );
};
