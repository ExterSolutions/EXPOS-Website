// components/MobileMenu.jsx (Updated with CSS import)
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  FaChevronDown, 
  FaTimes, 
  FaHome, 
  FaPizzaSlice, 
  FaStore, 
  FaInfoCircle, 
  FaPhone, 
  FaUser,
  FaShoppingBag,
  FaFire
} from "react-icons/fa";
import Submenu from "./Submenu";
import { useModal } from "../../../contexts/ModalContext";
import './mobile-menu.css'; // Import MobileMenu CSS

const MobileMenu = ({ isOpen, onClose }) => {
  const { openOrder } = useModal();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { id: "home", label: "Home", path: "/", icon: FaHome },
    { id: "menu", label: "Menu", path: "", icon: FaPizzaSlice },
    { id: "stores", label: "Stores", path: "/stores", icon: FaStore },
    { id: "about", label: "About", path: "/about", icon: FaInfoCircle },
    { id: "contact", label: "Contact", path: "/contact", icon: FaPhone },
    { id: "login", label: "Login", path: "/login", icon: FaUser },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const menuVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 200 
      }
    },
    exit: { 
      x: "100%",
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 200 
      }
    }
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-113 max-w-[110vw] bg-gradient-to-b from-white to-orange-50 shadow-2xl border-l border-orange-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="flex justify-between items-center mb-4">
                  <motion.h2 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold flex items-center space-x-2"
                  >
                    <FaPizzaSlice className="text-yellow-300" />
                    <span>panjab Pizza</span>
                  </motion.h2>
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="w-5 h-5" />
                  </motion.button>
                </div>
                
                Quick Info
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm bg-white/20 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Hot & Fresh!</span>
                    <FaFire className="text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-xs mt-1 text-white/90">20% Off on First Order</p>
                </motion.div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-3">
                  {navItems.map((item, index) => {
                    if (item.id === "menu") {
                      return (
                        <motion.div
                          key={item.id}
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="relative"
                        >
                          <button
                            onClick={() => setSubmenuOpen(!submenuOpen)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-300 bg-white shadow-sm hover:shadow-md border border-orange-100 hover:border-orange-300 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <item.icon className="text-orange-600 w-5 h-5" />
                              </div>
                              <span className="text-gray-800 font-semibold text-base">
                                {item.label}
                              </span>
                            </div>
                            <FaChevronDown
                              className={`text-orange-500 w-4 h-4 transition-transform duration-300 ${
                                submenuOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          
                          {/* Mobile Submenu */}
                          <AnimatePresence>
                            {submenuOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <Submenu 
                                  isOpen={true} 
                                  className="relative w-full bg-white border border-orange-100 rounded-2xl shadow-lg mt-2 p-4"
                                  onItemClick={onClose}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={item.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:text-orange-600 hover:bg-white transition-all duration-300 font-semibold border border-transparent hover:border-orange-200 hover:shadow-md group"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <item.icon className="text-gray-600 group-hover:text-orange-600 w-5 h-5" />
                          </div>
                          <span className="text-base">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Special Offers Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <FaFire className="w-4 h-4" />
                    <span className="font-bold text-sm">SPECIAL OFFER</span>
                  </div>
                  <p className="text-sm">Get 20% off your first order! Use code: WELCOME20</p>
                </motion.div>
              </div>

              {/* Order Now Button */}
              <div className="p-6 border-t border-orange-200 bg-white">
                <motion.button
                  onClick={() => {
                    openOrder();
                    onClose();
                  }}
                  className="w-full group relative flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-base transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-orange-600 hover:to-red-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaShoppingBag className="w-4 h-4" />
                  <span className="relative z-10">Order Now</span>
                  
                  {/* Animated effects */}
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-ping opacity-0 group-hover:opacity-100"></div>
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
                  </div>
                </motion.button>
                
                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mt-4"
                >
                  <p className="text-xs text-gray-600">Need help? Call us</p>
                  <a 
                    href="tel:+911234567890" 
                    className="text-orange-600 font-bold text-sm hover:underline"
                  >
                    (+91) 0123-456-789
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;