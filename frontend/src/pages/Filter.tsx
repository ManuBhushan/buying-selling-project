import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { category, customAds, validUser } from "../hooks/CustomAds";
import { DATABASE_URL } from "../config";
import axios from "axios";
import {
  ChevronDown,
  TagIcon,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUpZA,
  Calendar,
} from "lucide-react";

export const Filter: React.FC = () => {
  const navigate = useNavigate();
  const setAds = useSetRecoilState(customAds);
  const [cat, setCat] = useRecoilState(category);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const isValid = useRecoilValue(validUser).isValid;

  const categoryData = [
    { id: "Electronic", label: "Electronics", icon: "💻" },
    { id: "Mobile", label: "Mobiles", icon: "📱" },
    { id: "Laptop", label: "Laptops", icon: "💻" },
    { id: "Earphone", label: "Earphones", icon: "🎧" },
    { id: "Sport", label: "Sports", icon: "🏆" },
    { id: "Cycle", label: "Cycles", icon: "🚲" },
    { id: "Cooler", label: "Coolers", icon: "❄️" },
  ];

  const sortData = [
    {
      id: "desc",
      label: "Price: High to Low",
      icon: <ArrowDownAZ size={16} />,
    },
    { id: "asc", label: "Price: Low to High", icon: <ArrowUpZA size={16} /> },
    { id: "createdAt", label: "Date Published", icon: <Calendar size={16} /> },
  ];

  const handleCategorySelect = async (categoryId: string) => {
    try {
      setCategoryOpen(false);
      setCat(categoryId);

      let res;
      if (!isValid) {
        res = await axios.get(
          `${DATABASE_URL}/api/v1/ads/search?category=${categoryId}`,
        );
      } else {
        res = await axios.get(
          `${DATABASE_URL}/api/v1/ads/search/withlike?category=${categoryId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          },
        );
      }

      setAds(res.data);
      navigate(`/search?category=${categoryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortSelect = async (sortId: string) => {
    try {
      setSortOpen(false);

      const res = await axios.get(
        `${DATABASE_URL}/api/v1/ads/search?category=${cat}&sort=${sortId}`,
      );
      setAds(res.data);
      navigate(`/search?category=${cat}&sort=${sortId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 space-y-6 text-gray-800 dark:text-white h-screen">
      {/* Filter title */}
      <div className="flex items-center gap-2 font-medium border-b border-gray-200 dark:border-gray-700 pb-3">
        <SlidersHorizontal size={20} />
        <h2 className="text-lg">Filter Products</h2>
      </div>

      {/* Categories Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Categories
        </h3>

        <div className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TagIcon size={18} className="text-blue-600" />
              <span>
                {categoryData.find((c) => c.id === cat)?.label ||
                  "All Categories"}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-500 dark:text-gray-300 transition-transform ${categoryOpen ? "transform rotate-180" : ""}`}
            />
          </button>

          {categoryOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto py-1">
                {categoryData.map((category) => (
                  <button
                    key={category.id}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sort Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Sort By
        </h3>

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-blue-600" />
              <span>Sort Options</span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-500 dark:text-gray-300 transition-transform ${sortOpen ? "transform rotate-180" : ""}`}
            />
          </button>

          {sortOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
              <div className="py-1">
                {sortData.map((sort) => (
                  <button
                    key={sort.id}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSortSelect(sort.id)}
                  >
                    <span className="text-blue-600">{sort.icon}</span>
                    <span>{sort.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
