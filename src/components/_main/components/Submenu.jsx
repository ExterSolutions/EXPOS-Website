// components/Submenu.jsx (Updated with CSS import)
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPizzaSlice, FaTag, FaCarrot , FaGlassCheers,  } from "react-icons/fa";
import { IoColorPalette } from "react-icons/io5";
import { MdRestaurantMenu } from "react-icons/md";
import { SiCoffeescript } from "react-icons/si";
import { PiHamburgerFill } from "react-icons/pi";
import { GiPizzaSlice } from "react-icons/gi";
import '../../../assets/styles/new/header/submenu.css'; 

const Submenu = ({ isOpen, className = "" }) => {
  const menuItems = [
    {
      id: "createyourownpizza",
      name: "Create Your Own",
      icon: <IoColorPalette size={32} className="text-purple-500" />,
      color: "purple-500",
    },
    {
      id: "deals",
      name: "Deals",
      icon: <GiPizzaSlice  size={32} className="text-green-500" />, // Changed to FaTag for deals
      color: "green-500",
    },
    {
      id: "signature-pizzas",
      name: "Signature Pizza",
      icon: <FaPizzaSlice size={32} className="text-orange-500" />, // Orange pizza icon
      color: "orange-500",
    },
    {
      id: "otherpizza",
      name: "Other Pizza",
      icon: <FaPizzaSlice size={32} className="text-red-500" />, // Red pizza icon
      color: "red-500",
    },
    {
      id: "sides",
      name: "Sides",
      icon: <PiHamburgerFill  size={32} className="text-lime-500" />, // Changed to FaCarrot for sides
      color: "lime-500",
    },
    {
      id: "dips",
      name: "Dips",
      icon: <SiCoffeescript  size={32} className="text-blue-500" />, // Changed to FaBowlFood for dips
      color: "blue-500",
    },
    {
      id: "drinks",
      name: "Drinks",
      icon: <FaGlassCheers size={32} className="text-sky-500" />,
      color: "sky-500",
    },
    {
      id: "menu",
      name: "All Menu",
      icon: <MdRestaurantMenu size={32} className="text-sky-500" />,
      color: "sky-500",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`absolute top-full left-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-4 sm:p-6 ${className}`}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Menu Categories</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Choose your favorite category</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/${item.id}`} className="flex flex-col items-center group">
                  <div
                    className={`
                      relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white 
                      flex items-center justify-center
                      shadow-lg group-hover:shadow-xl
                      transform group-hover:scale-110 
                      transition-all duration-300 mb-2 sm:mb-3
                      border-2 ${item.id === "signature-pizza" ? "border-orange-500" : "border-gray-200 group-hover:border-orange-500"}
                    `}
                  >
                    {item.icon}
                    <div className="absolute inset-0 rounded-full bg-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center group-hover:text-orange-500 transition-colors duration-200 leading-tight px-1">
                    {item.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Submenu;