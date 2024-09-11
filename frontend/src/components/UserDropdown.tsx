
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'


export const  UserDropdown=()=> {
  return (
    <Menu as="div" className="relative inline-block text-left">
    <div>
            <MenuButton 
            className=" inline-flex text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                    focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 mr-5">
            Options
            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </MenuButton>
    </div>

    <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
            <div className="py-1 bg-gray-800">
            <MenuItem>
            <Link to="/profile" className="block text-white text-md hover:bg-gray-900  
            font-medium text-sm px-10 py-2 ">
                    Profile
            </Link>
            </MenuItem>
            <MenuItem>
            <Link to="/myads" className="block text-white text-md hover:bg-gray-900  
            font-medium text-sm px-10 py-2">
                    My Ads
            </Link>
            </MenuItem>
            <MenuItem>
            <Link to="/liked" className="block text-white text-md hover:bg-gray-900  
            font-medium text-sm px-10 py-2">
                    Liked Ads
            </Link>
            </MenuItem>
            <MenuItem>
            <Link to="/setting" className="block text-white text-md hover:bg-gray-900  
            font-medium text-sm px-10 py-2">
                    Settings
            </Link>
            </MenuItem>
            </div>
    </MenuItems>
    </Menu>
  )
}

