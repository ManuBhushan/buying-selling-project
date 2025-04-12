import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

export const UserDropdown = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex items-center justify-center gap-2 text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 font-medium rounded-full text-sm px-5 py-2.5 mt-2 mb-2 transition">
          Options
          <ChevronDownIcon
            aria-hidden="true"
            className="h-5 w-5 text-gray-300"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl bg-gray-900 text-white shadow-xl ring-1 ring-gray-700 focus:outline-none">
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <Link
                to="/myads"
                className={`block px-5 py-2.5 text-sm rounded-md transition ${
                  active ? "bg-gray-800 text-white" : "text-gray-200"
                }`}
              >
                My Ads
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                to="/liked"
                className={`block px-5 py-2.5 text-sm rounded-md transition ${
                  active ? "bg-gray-800 text-white" : "text-gray-200"
                }`}
              >
                Liked Ads
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                to="/additem"
                className={`block px-5 py-2.5 text-sm rounded-md transition ${
                  active ? "bg-gray-800 text-white" : "text-gray-200"
                }`}
              >
                Create Ad
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                to="/setting"
                className={`block px-5 py-2.5 text-sm rounded-md transition ${
                  active ? "bg-gray-800 text-white" : "text-gray-200"
                }`}
              >
                Settings
              </Link>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};
