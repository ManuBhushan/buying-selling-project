import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DATABASE_URL } from "../config";
import { useRecoilState, useSetRecoilState } from "recoil";
import { category, customAds, validUser } from "../hooks/CustomAds";
import { UserDropdown } from "../components/UserDropdown";
import {
  Search,
  LogOut,
  LogIn,
  UserPlus,
  MessageCircle,
  Bell,
  ShoppingBag,
} from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(validUser);
  const [value, setValue] = useState<string>("");
  const setCat = useSetRecoilState(category);
  const setAds = useSetRecoilState(customAds);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${DATABASE_URL}/api/v1/ads`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setUser({
          isValid: true,
          userId: res.data.userId,
          userName: res.data.userName,
        });
      } catch (error) {
        setUser({ isValid: false, userId: 0, userName: "Invalid User" });
        navigate("/");
      }
    };

    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ isValid: false, userId: 0, userName: "Invalid User" });
    navigate("/");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!user.isValid) {
        const res = await axios.get(
          `${DATABASE_URL}/api/v1/ads/search?category=${value}`,
        );
        setAds(res.data);
      } else {
        const res = await axios.get(
          `${DATABASE_URL}/api/v1/ads/search/withlike?category=${value}`,
          {
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          },
        );
        setAds(res.data);
      }

      setValue("");
      setCat(value);
      navigate(`/search?category=${value}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`flex justify-between items-center py-3 px-4 md:px-10 shadow-lg ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      }`}
    >
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold hover:text-blue-200 transition-colors"
        onClick={() => setCat("others")}
      >
        <ShoppingBag size={28} />
        <span className="hidden sm:inline">ReFind</span>
      </Link>

      <form className="flex-grow max-w-xl mx-4" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
              aria-hidden="true"
            />
          </div>
          <input
            type="search"
            className={`w-full p-2.5 ps-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            placeholder="Find Mobiles, Laptops, Electronics..."
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="submit"
            className={`absolute end-2 top-1/2 transform -translate-y-1/2 font-medium rounded-lg text-sm px-3 py-1.5 ${
              isDarkMode
                ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-500"
                : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
            }`}
          >
            Search
          </button>
        </div>
      </form>

      {user.isValid ? (
        <div className="flex items-center gap-4">
          <Link
            to="/chat"
            className={`hover:text-blue-${
              isDarkMode ? "400" : "200"
            } transition-colors`}
          >
            <MessageCircle
              size={24}
              className="hover:scale-110 transition-transform"
            />
          </Link>

          <Link
            to="/query"
            className={`hover:text-blue-${
              isDarkMode ? "400" : "200"
            } transition-colors`}
          >
            <Bell size={24} className="hover:scale-110 transition-transform" />
          </Link>

          <div className="hidden md:block">
            <UserDropdown />
          </div>

          <button
            onClick={logout}
            className={`flex items-center gap-1 font-medium rounded-lg text-sm px-4 py-2 transition-colors ${
              isDarkMode
                ? "text-white bg-gray-700 hover:bg-gray-800 focus:ring-gray-500"
                : "text-white bg-blue-800 hover:bg-blue-900 focus:ring-blue-300"
            }`}
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/signin"
            className={`flex items-center gap-1 font-medium rounded-lg text-sm px-4 py-2 transition-colors ${
              isDarkMode
                ? "text-white bg-gray-700 hover:bg-gray-800 focus:ring-gray-500"
                : "text-white bg-blue-800 hover:bg-blue-900 focus:ring-blue-300"
            }`}
          >
            <LogIn size={18} />
            <span className="hidden md:inline">Sign In</span>
          </Link>

          <Link
            to="/signup"
            className={`flex items-center gap-1 font-medium rounded-lg text-sm px-4 py-2 transition-colors ${
              isDarkMode
                ? "text-gray-900 bg-white border border-gray-600 hover:bg-gray-100 focus:ring-gray-300"
                : "text-white border border-white hover:bg-white hover:text-blue-800 focus:ring-white"
            }`}
          >
            <UserPlus size={18} />
            <span className="hidden md:inline">Sign Up</span>
          </Link>
        </div>
      )}
    </div>
  );
};
