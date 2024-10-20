import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { category, customAds } from '../hooks/CustomAds';
import { DATABASE_URL } from '../config';
import axios from 'axios';



export const Filter: React.FC = () => {

  const navigate= useNavigate();
  const setAds=useSetRecoilState(customAds);
  
  const [cat,setCat]=useRecoilState(category);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);


  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleButtonClick2 = () => {
    setIsOpen2((prev) => !prev);
  };

  const handleSubmit = async(category: string) => {
    try {
      setIsOpen((c)=>!c);
      setCat(category);
      const res=await axios.get(`${DATABASE_URL}/api/v1/ads/search?category=${category  }`)
      setAds(res.data);
      navigate(`/search?category=${category}`);

  } catch (error) {
        console.log(error);
  }

  };

  const handleSubmit2 = async(sort: string) => {
    try {
      setIsOpen2((c)=>!c);
      const res=await axios.get(`${DATABASE_URL}/api/v1/ads/search?category=${cat}&sort=${sort}`)
      setAds(res.data);
      navigate(`/search?category=${cat}&sort=${sort}`);

} catch (error) {
      console.log(error);
}

  };

  
  return (
    <div className="p-4">
      {/* Categories Button */}
      <div className="mt-4">
        <button
          id="dropdownCategoriesButton"
          onClick={handleButtonClick}
          className="text-white bg-blue-700 w-full lg:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-6 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          All Categories
          <svg
            className="w-3 h-3 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l4 4 4-4"
            />
          </svg>
        </button>

        {/* Dropdown Menu for Categories */}
        <div
          id="dropdownCategories"
          className={`z-10 ${isOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-full lg:w-50 dark:bg-gray-700`}
        >
          <ul className="py-2 text-md text-gray-700 dark:text-gray-200">
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit('Electronic')}
              >
                Electronics
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit('Mobile')}
              >
                Mobiles
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit('Laptop')}
              >
                Laptops
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit('Earphone')}
              >
                Earphones
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit('Sport')}
              >
                Sports
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit('Cycle')}
              >
                Cycle
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit('Cooler')}
              >
                Cooler
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Filters Button */}
      <div className="mt-4">
        <button
          id="dropdownFiltersButton"
          onClick={handleButtonClick2}
          className="text-white bg-blue-700 w-full lg:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-6 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Filters
          <svg
            className="w-3 h-3 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l4 4 4-4"
            />
          </svg>
        </button>

        {/* Dropdown Menu for Filters */}
        <div
          id="dropdownFilters"
          className={`z-10 ${isOpen2 ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-full lg:w-50 dark:bg-gray-700`}
        >
          <ul className="py-2 text-md text-gray-700 dark:text-gray-200">
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit2('desc')}
              >
                High to Low
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit2('asc')}
              >
                Low to High
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                onClick={() => handleSubmit2('createdAt')}
              >
                Date Published
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
