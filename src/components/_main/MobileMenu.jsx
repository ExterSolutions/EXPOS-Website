// src/components/_main/MobileMenu.jsx
import { useContext, useEffect, useState } from 'react';
import {
    FaGlassCheers,
    FaHome,
    FaInfo,
    FaMapPin,
    FaPhone,
    FaPizzaSlice,
    FaTag,
    FaTimes,
    FaUser,
    FaUserPlus,
} from 'react-icons/fa';
import { GiPizzaSlice } from 'react-icons/gi';
import { IoColorPalette } from 'react-icons/io5';
import { MdRestaurantMenu } from 'react-icons/md';
import { PiHamburgerFill } from 'react-icons/pi';
import { SiCoffeescript } from 'react-icons/si';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import '../../assets/styles/mobilemenu.css';
import { GlobalContext } from '../../context/GlobalContext';

const MobileMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const globalCtx = useContext(GlobalContext);

    // Safely access context with default values
    const mobileMenuContext = globalCtx?.mobileMenu || [false, () => console.warn('setOpenMobileMenu not available')];
    const [openMobileMenu, setOpenMobileMenu] = mobileMenuContext;

    // Optional: Access auth context if needed
    const [isAuthenticated] = globalCtx?.auth || [false];

    const toggleSidebar = () => {
        if (setOpenMobileMenu) {
            setOpenMobileMenu((prev) => !prev);
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && openMobileMenu && setOpenMobileMenu) {
                setOpenMobileMenu(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [openMobileMenu, setOpenMobileMenu]);

    useEffect(() => {
        if (openMobileMenu) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }

        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [openMobileMenu]);

    const handleLinkClick = (link) => {
        if (setOpenMobileMenu) {
            setOpenMobileMenu(false);
        }
        if (link.startsWith('http')) {
            window.location.href = link;
        } else {
            navigate(link);
        }
    };

    const handleAuthClick = (path) => {
        if (setOpenMobileMenu) {
            setOpenMobileMenu(false);
        }
        navigate(path);
    };

    // Close menu when clicking outside (handled by overlay)
    const handleOverlayClick = () => {
        if (setOpenMobileMenu) {
            setOpenMobileMenu(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="mobile-menu-wrapper">
            {/* Overlay */}
            {openMobileMenu && (
                <div
                    className="overlay visible"
                    onClick={handleOverlayClick}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`mobile-menu ${openMobileMenu ? 'open' : ''}`} style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        {/* Add your logo here if needed */}
                    </div>
                    <button
                        className="close-btn"
                        onClick={toggleSidebar}
                        aria-label="Close menu"
                    >
                        <FaTimes />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="nav-item">
                            <a
                                href="https://web.exter.ca/"
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick('https://web.exter.ca/');
                                }}
                            >
                                <FaHome />
                                <span className="nav-text">Home</span>
                            </a>
                        </li>


                        {/* MENU Items Directly */}
                        <li className="nav-item">
                            <Link to="/specialoffer" className={`nav-link ${isActive('/specialoffer') ? 'active' : ''}`} onClick={() => handleLinkClick('/specialoffer')}>
                                <FaTag />
                                <span className="nav-text">Special Deals</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/signaturepizza" className={`nav-link ${isActive('/signaturepizza') ? 'active' : ''}`} onClick={() => handleLinkClick('/signaturepizza')}>
                                <FaPizzaSlice />
                                <span className="nav-text">Signature Pizzas</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/otherpizza" className={`nav-link ${isActive('/otherpizza') ? 'active' : ''}`} onClick={() => handleLinkClick('/otherpizza')}>
                                <GiPizzaSlice />
                                <span className="nav-text">Other Pizzas</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/sides" className={`nav-link ${isActive('/sides') ? 'active' : ''}`} onClick={() => handleLinkClick('/sides')}>
                                <PiHamburgerFill />
                                <span className="nav-text">Sides</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dips" className={`nav-link ${isActive('/dips') ? 'active' : ''}`} onClick={() => handleLinkClick('/dips')}>
                                <SiCoffeescript />
                                <span className="nav-text">Dips</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/drinks" className={`nav-link ${isActive('/drinks') ? 'active' : ''}`} onClick={() => handleLinkClick('/drinks')}>
                                <FaGlassCheers />
                                <span className="nav-text">Drinks</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/create-your-own" className={`nav-link ${isActive('/create-your-own') ? 'active' : ''}`} onClick={() => handleLinkClick('/create-your-own')}>
                                <IoColorPalette />
                                <span className="nav-text">Create Your Own</span>
                            </Link>
                        </li>

                        {/* <li>
                            <Link
                                to="/contact-us"
                                className={activeLink === 'contact' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick('/contact-us');
                                }}
                            >
                                <FaPhone />
                                <span className="nav-text">Contact</span>
                            </Link>
                        </li> */}
                    </ul>
                </nav>

                {/* Authentication Buttons */}
                <div className="auth-buttons">
                    <div className="auth-buttons-row">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    className={`auth-btn signin-btn ${isActive('/login') ? 'active' : ''}`}
                                    onClick={() => handleAuthClick('/login')}
                                >
                                    <FaUser />
                                    <span>Sign In</span>
                                </button>
                                <button
                                    className={`auth-btn signup-btn ${isActive('/registration') ? 'active' : ''}`}
                                    onClick={() => handleAuthClick('/registration')}
                                >
                                    <FaUserPlus />
                                    <span>Sign Up</span>
                                </button>
                            </>
                        ) : (
                            <button
                                className={`auth-btn account-btn ${isActive('/my-account') ? 'active' : ''}`}
                                onClick={() => handleAuthClick('/my-account')}
                            >
                                <FaUser />
                                <span>My Account</span>
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default MobileMenu;