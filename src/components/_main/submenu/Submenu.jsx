//import React from "react";
import { Link } from "react-router-dom";
import { FaPizzaSlice, FaTag, FaGlassCheers } from "react-icons/fa";
import { IoColorPalette } from "react-icons/io5";
import { MdRestaurantMenu } from "react-icons/md";
import { SiCoffeescript } from "react-icons/si";
import { PiHamburgerFill } from "react-icons/pi";
import { GiPizzaSlice } from "react-icons/gi";
import "./sabmenu.css"; 

const Submenu = ({ isOpen, items, onLinkClick }) => {
  // Default items if none provided
  const menuItems = items || [
    { 
      id: "create-your-own", 
      name: "Create Your Own", 
      icon: <IoColorPalette className="submenu-icon" />
    },
    { 
      id: "specialoffer", 
      name: "Deals", 
      icon: <FaTag className="submenu-icon" />
    },
    { 
      id: "signaturepizza", 
      name: "Signature Pizza", 
      icon: <FaPizzaSlice className="submenu-icon" />
    },
    { 
      id: "otherpizza", 
      name: "Other Pizza", 
      icon: <GiPizzaSlice className="submenu-icon" />
    },
    { 
      id: "sides", 
      name: "Sides", 
      icon: <PiHamburgerFill className="submenu-icon" />
    },
    { 
      id: "dips", 
      name: "Dips", 
      icon: <SiCoffeescript className="submenu-icon" />
    },
    { 
      id: "drinks", 
      name: "Drinks", 
      icon: <FaGlassCheers className="submenu-icon" />
    },
    { 
      id: "menu", 
      name: "All Menu", 
      icon: <MdRestaurantMenu className="submenu-icon" />
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="circle-submenu-container">
      {/* Basic Grid Layout - 4 columns for all items (will wrap to 2 rows for 8 items) */}
      <div className="circle-submenu-grid">
        {menuItems.map((cItem) => (
          <div key={cItem.id} className="circle-submenu-item">
            <Link
              to={`/${cItem.id}`}
              className="circle-submenu-link"
              onClick={onLinkClick}
            >
              {/* Circular Button Container */}
              <div className="circle-button-container">
                {/* Main Circle */}
                <div className={`circle-main`}>
                  {/* Icon Container */}
                  <div className={`circle-icon`}>
                    {cItem.icon}
                  </div>
                </div> 
              </div>
              {/* Name always shown below icon */}
              <span className="submenu-item-name">{cItem.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submenu;