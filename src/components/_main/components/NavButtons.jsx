// components/NavButtons.jsx (Fixed with useLocation hook)
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom"; // Added useLocation
import { FaChevronDown, FaBars } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu"; // Added for cart icon
import Submenu from "./Submenu";
// import '../../../assets/styles/new/header/nav-buttons.css'; 

const NavButtons = ({
    onToggleMobileMenu,
    openOrder,
    isAuthenticated,
    handleOrderNowClick,
    cart,
    handleCartBarToggle,
    compact = false
}) => {
    const location = useLocation(); // Use hook to get location
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [dropMenu, setDropMenu] = useState(false); // For mobile menu toggle

    const navItems = [
        { id: "home", label: "Home", path: "/" },
        { id: "menu", label: "Menu", path: "/menu" },
        { id: "stores", label: "Stores", path: "/stores" },
        { id: "about", label: "About", path: "/about-us" },
        { id: "contact", label: "Contact", path: "/contact-us" },
        {
            id: "account",
            label: isAuthenticated ? "My Account" : "Login",
            path: isAuthenticated ? "/my-account" : "/login"
        },
    ];

    const handleNavClick = (path) => {
        if (onToggleMobileMenu) {
            onToggleMobileMenu(); // Close mobile menu on nav click
        }
        setDropMenu(false); // Close mobile menu
    };

    const toggleMobileMenu = () => {
        setDropMenu(!dropMenu);
    };

    return (
        <div className={`nav-buttons ${compact ? 'py-1' : ''}`}>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
                <div className="flex items-center justify-between">

                    {/* Desktop Navigation */}
                    <ul className="navbar-nav hidden md:flex items-center space-x-4 lg:space-x-8 flex-1 justify-center mb-lg-0">
                        {navItems.map((item) => {
                            if (item.id === "menu") {
                                return (
                                    <li key={item.id} className="nav-item relative">
                                        <div
                                            className="relative"
                                            onMouseEnter={() => setSubmenuOpen(true)}
                                            onMouseLeave={() => setSubmenuOpen(false)}
                                        >
                                            <span
                                                className={`nav-link group relative flex items-center space-x-1 px-2 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${location.pathname === item.path ? 'active' : ''}`}
                                                onClick={() => handleNavClick(item.path)}
                                            >
                                                <span className="text-white font-semibold text-sm lg:text-base tracking-wide">
                                                    {item.label}
                                                </span>
                                                <FaChevronDown
                                                    className={`text-white h-3 w-3 transition-transform duration-300 ${submenuOpen ? "rotate-180" : ""}`}
                                                />
                                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 transform -translate-x-1/2 group-hover:translate-x-0"></span>
                                            </span>
                                            <Submenu isOpen={submenuOpen} />
                                        </div>
                                    </li>
                                );
                            }

                            return (
                                <li key={item.id} className="nav-item">
                                    <Link
                                        to={item.path}
                                        className={`nav-link group relative flex items-center space-x-1 px-2 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${location.pathname === item.path ? 'active' : ''}`}
                                        onClick={() => handleNavClick(item.path)}
                                    >
                                        <span className="text-white font-semibold text-sm lg:text-base tracking-wide">
                                            {item.label}
                                        </span>
                                        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 transform -translate-x-1/2 group-hover:translate-x-0"></span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Order Now Button & Cart - Desktop */}
                    <div className="hidden md:flex items-center ml-auto space-x-4">
                        {location?.pathname !== "/checkout" && (
                            <li className="nav-item">
                                <NavLink
                                    to="#"
                                    onClick={openOrder || handleOrderNowClick}
                                    className="orderButton group relative flex items-center space-x-2 px-4 lg:px-6 py-2 rounded-full border-2 border-yellow-200 bg-gradient-to-r from-white to-[#ffffff] text-[#953c0f] font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-white hover:to-yellow-100 hover:text-[#e55b1e] text-sm lg:text-base"
                                >
                                    <span className="relative z-10">Order Now</span>
                                    <span className="absolute inset-0 rounded-full border-2 border-yellow-200 animate-ping opacity-0 group-hover:opacity-100"></span>
                                </NavLink>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link
                                onClick={handleCartBarToggle}
                                className="navbar-cart cart-link group relative flex items-center space-x-2 px-4 lg:px-6 py-2 rounded-full border-2 border-yellow-200 bg-gradient-to-r from-white to-[#ffffff] text-[#953c0f] font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-white hover:to-yellow-100 hover:text-[#e55b1e] text-sm lg:text-base"
                            >
                                <LuShoppingCart size={18} />
                                <span className="nav-price">${cart?.grandtotal ? cart?.grandtotal : (0.0).toFixed(2)}</span>
                                <span className="absolute inset-0 rounded-full border-2 border-yellow-200 animate-ping opacity-0 group-hover:opacity-100"></span>
                            </Link>
                        </li>
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="flex items-center justify-end md:hidden">
                        {/* Hamburger Menu Button */}
                        {onToggleMobileMenu && (
                            <button
                                onClick={toggleMobileMenu}
                                className="navbar-toggler text-white p-2 rounded-lg hover:bg-white/20 transition-colors duration-300"
                                aria-label="Toggle mobile menu"
                            >
                                <FaBars className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Full screen overlay when open */}
            {dropMenu && (
                <div className="md:hidden fixed inset-0 bg-gradient-to-r from-[#f16623] to-[#e55b1e] z-50">
                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`nav-link text-white font-semibold text-xl tracking-wide py-2 px-4 rounded-lg hover:bg-white/20 transition-colors duration-300 ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.path)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {location?.pathname !== "/checkout" && (
                            <button
                                onClick={openOrder || handleOrderNowClick}
                                className="orderButton text-white font-bold text-lg py-2 px-6 rounded-full border-2 border-white hover:bg-white hover:text-[#f16623] transition-colors duration-300"
                            >
                                Order Now
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavButtons;