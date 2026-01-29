// components/LogoSearch.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaTimes, FaPhoneAlt, FaFire } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../../assets/images/logo.png";
import '../../../assets/styles/new/header/logo-search.css';

const LogoSearch = ({ compact = false, onOpenCart }) => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Close search when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSearchOpen && window.innerWidth < 768) {
                const searchElement = document.getElementById('mobile-search-container');
                if (searchElement && !searchElement.contains(event.target)) {
                    setIsSearchOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSearchOpen]);

    return (
        <div className={`
      flex items-center justify-between 
      px-2 sm:px-4 py-2 sm:py-4 max-w-7xl mx-auto 
      relative
      ${compact ? 'py-2' : ''}
    `}>

            {/* Left Side: Logo and Name */}
            <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => navigate('/')}
            >
                <motion.img
                    src={logo}
                    alt="panjab Pizza Logo"
                    className={`
            ${compact ? 'h-10 w-10 md:h-12 md:w-12' : 'h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20'}
            flex-shrink-0 transition-transform duration-300 group-hover:scale-105
          `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                />
                <div className="flex flex-col">
                    <span className={`
            font-extrabold text-[#f16623] leading-tight
            ${compact ? 'hidden md:block text-xl lg:text-2xl' : 'hidden sm:block md:text-3xl text-xl'}
          `}>
                        Panjab Pizza
                    </span>
                    <span className={`
            font-bold text-[#f16623] leading-tight
            ${compact ? 'md:hidden text-sm' : 'sm:hidden text-lg'}
          `}>
                        Panjab Pizza
                    </span>
                    {!compact && (
                        <span className="hidden sm:block text-xs text-gray-600 font-medium mt-1">
                            Taste of Tradition
                        </span>
                    )}
                </div>
            </div>

            {/* Center: Search Bar - Desktop */}
            <div className={`hidden md:flex flex-1 justify-center px-4 ${compact ? 'lg:block' : ''}`}>
                <motion.form
                    onSubmit={handleSearchSubmit}
                    className="relative w-full max-w-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="relative group">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search pizzas, deals, and more..."
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full 
                       focus:outline-none focus:border-[#f16623] focus:ring-4 focus:ring-orange-100 
                       bg-white shadow-sm hover:shadow-md transition-all duration-300
                       text-gray-700 placeholder-gray-400 font-medium"
                        />

                        {/* Search Icon with Gradient */}
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <div className="relative">
                                <FaSearch className="h-5 w-5 text-gray-400 group-hover:text-[#f16623] transition-colors duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Animated Border Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f16623] to-[#e55b1e] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 -z-10"></div>

                        {/* Search Suggestions Badge */}
                        {!searchQuery && (
                            <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                                <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <FaFire className="h-2 w-2" />
                                    <span>Try "Margherita"</span>
                                </div>
                            </div>
                        )}

                        {/* Clear Button when text exists */}
                        {searchQuery && (
                            <motion.button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes className="h-4 w-4" />
                            </motion.button>
                        )}

                        {/* Search Button */}
                        <motion.button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                       bg-gradient-to-r from-[#f16623] to-[#e55b1e] text-white 
                       p-2 rounded-full hover:shadow-lg hover:scale-105 
                       focus:outline-none focus:ring-4 focus:ring-orange-200 
                       transition-all duration-300 group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSearch className="h-4 w-4" />
                            <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </motion.button>
                    </div>
                </motion.form>
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">

                {/* Mobile Search Toggle */}
                <motion.button
                    onClick={toggleSearch}
                    className="p-2 text-gray-500 hover:text-[#f16623] focus:outline-none md:hidden relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaSearch className="h-5 w-5" />
                    <div className="absolute inset-0 bg-orange-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </motion.button>

                {/* Mobile Search Overlay */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            id="mobile-search-container"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50 md:hidden p-4"
                        >
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="What are you craving today?"
                                    className="w-full pl-4 pr-12 py-4 border-2 border-gray-200 rounded-xl 
                           focus:outline-none focus:border-[#f16623] focus:ring-4 focus:ring-orange-100 
                           bg-white text-lg font-medium placeholder-gray-400"
                                    autoFocus
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    {searchQuery && (
                                        <motion.button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaTimes className="h-5 w-5" />
                                        </motion.button>
                                    )}
                                    <motion.button
                                        type="submit"
                                        className="bg-gradient-to-r from-[#f16623] to-[#e55b1e] text-white p-2 rounded-lg hover:shadow-lg transition-all duration-300"
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaSearch className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            </form>

                            {/* Quick Search Suggestions */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {['Margherita', 'Pepperoni', 'Veg Supreme', 'Chicken Tikka'].map((suggestion) => (
                                    <motion.button
                                        key={suggestion}
                                        onClick={() => {
                                            setSearchQuery(suggestion);
                                            setTimeout(() => searchInputRef.current?.focus(), 100);
                                        }}
                                        className="px-3 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium 
                             hover:bg-orange-100 hover:scale-105 transition-all duration-200 
                             border border-orange-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Call Info */}
                {!compact && (
                    <div className="hidden sm:flex items-center space-x-2 text-gray-700 font-semibold">
                        <motion.div
                            className="relative p-2 bg-orange-50 rounded-full"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaPhoneAlt className="text-[#f16623] h-4 w-4" />
                        </motion.div>
                        <div className="text-left">
                            <span className="block text-xs sm:text-sm text-gray-600">Call And Order</span>
                            <span className="block text-[#f16623] font-bold text-xs sm:text-sm">+1 403 492 5500</span>
                        </div>
                    </div>
                )}

                {compact && (
                    <div className="hidden lg:flex items-center space-x-2 text-gray-700 font-semibold">
                        <div className="relative p-2 bg-orange-50 rounded-full">
                            <FaPhoneAlt className="text-[#f16623] h-4 w-4" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xs text-gray-600">Call To Order</span>
                            <span className="block text-[#f16623] font-bold text-xs">+1 403 492 5500</span>
                        </div>
                    </div>
                )}

                {/* Profile Button */}
                <motion.button
                    className="relative p-2 text-gray-500 hover:text-[#f16623] focus:outline-none group"
                    onClick={() => navigate('/profile')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaUser className="h-5 w-5 sm:h-6 sm:w-6" />
                    <div className="absolute inset-0 bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </motion.button>

                {/* Cart Button */}
                <motion.button
                    className="relative p-2 text-gray-500 hover:text-[#f16623] focus:outline-none group"
                    onClick={onOpenCart}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                    <div className="absolute inset-0 bg-orange-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </motion.button>
            </div>
        </div>
    );
};

export default LogoSearch;
