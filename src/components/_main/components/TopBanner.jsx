// components/TopBanner.jsx (Updated with CSS import)
import React from "react";
import { FaPhoneAlt,FaPizzaSlice } from "react-icons/fa";
import '../../../assets/styles/new/header/top-banner.css'; // Import TopBanner CSS

const TopBanner = () => {
  return (
    <div className="bg-[#fef0e6] text-black">
      <div className="max-w-7xl mx-auto py-1 px-2 sm:px-4 lg:px-12 flex justify-center items-center">
       
      

        {/* Desktop: Both Message and Phone */}
        <div className="flex sm:hidden items-center justify-center text-center text-xs">
          <a
            href="tel:+1 403 492 5500"
            className="font-bold flex items-center gap-1 hover:underline"
          >
            <FaPhoneAlt className="text-xs" />
            +1 403 492 5500
          </a>
        </div>

        {/* Desktop Full */}
        <div className="hidden sm:flex justify-between items-center w-full">
          {/* Pizza Message */}
          <p className="text-xs sm:text-sm font-semibold flex items-center gap-1">
            <FaPizzaSlice className="text-xs sm:text-sm" />
            Hot & Fresh Pizzas – Order Now and Get 20% Off!
          </p>

          {/* Contact Number */}
          <a
            href="tel:+911234567890"
            className="text-xs sm:text-sm font-bold flex items-center gap-1 hover:underline"
          >
            <FaPhoneAlt className="text-xs sm:text-sm" />
           +1 403 492 5500
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;