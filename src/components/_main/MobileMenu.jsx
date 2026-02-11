// src/components/_main/MobileMenu.jsx
import { useContext, useEffect, useState } from 'react';
import {
    FaChevronDown,
    FaChevronUp,
    FaHome,
    FaInfo,
    FaMapPin,
    FaPhone,
    FaTimes,
    FaUser,
    FaUserPlus,
} from 'react-icons/fa';
import { MdRestaurantMenu } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
// import '../../assets/styles/mobilemenu.css';
import { GlobalContext } from '../../context/GlobalContext';

const MobileMenu = () => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('home');
    const [openSubmenu, setOpenSubmenu] = useState(false);
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
        setActiveLink(link);
        if (setOpenMobileMenu) {
            setOpenMobileMenu(false);
        }
        navigate(link);
    };

    const handleSubmenuToggle = () => {
        setOpenSubmenu((prev) => !prev);
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
            <aside className={`mobile-menu ${openMobileMenu ? 'open' : ''}`}>
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
                        <li>
                            <Link
                                to="/"
                                className={activeLink === 'home' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick('/');
                                }}
                            >
                                <FaHome />
                                <span className="nav-text">Home</span>
                            </Link>
                        </li>






                        {/* MENU with Submenu */}
                        <li className={`has-submenu ${openSubmenu ? 'open' : ''}`}>
                            <button
                                className="submenu-toggle"
                                onClick={handleSubmenuToggle}
                                aria-expanded={openSubmenu}
                            >
                                <MdRestaurantMenu />
                                <span className="nav-text">Menu</span>
                                {openSubmenu ? <FaChevronUp /> : <FaChevronDown />}
                            </button>

                            <ul className={`submenu ${openSubmenu ? 'show' : ''}`}>
                                <li key="mmenu-offers">
                                    <Link
                                        to="/specialoffer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/specialoffer');
                                        }}
                                    >
                                        Special Deals
                                    </Link>
                                </li>
                                <li key="mmenu-signaturepizza">
                                    <Link
                                        to="/signaturepizza"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/signaturepizza');
                                        }}
                                    >
                                        Signature
                                    </Link>
                                </li>
                                <li key="mmenu-other">
                                    <Link
                                        to="/otherpizza"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/otherpizza');
                                        }}
                                    >
                                        Other
                                    </Link>
                                </li>
                                <li key="mmenu-sides">
                                    <Link
                                        to="/sides"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/sides');
                                        }}
                                    >
                                        Sides
                                    </Link>
                                </li>
                                <li key="mmenu-dips">
                                    <Link
                                        to="/dips"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/dips');
                                        }}
                                    >
                                        Dips
                                    </Link>
                                </li>
                                <li key="mmenu-drinks">
                                    <Link
                                        to="/drinks"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/drinks');
                                        }}
                                    >
                                        Drinks
                                    </Link>
                                </li>

                                <li key="mmenu-drinks">
                                    <Link
                                        to="/create-your-own"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/menu');
                                        }}
                                    >
                                        All Menu
                                    </Link>
                                </li>

                                <li key="mmenu-drinks">
                                    <Link
                                        to="/create-your-own"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick('/create-your-own');
                                        }}
                                    >
                                        Create Your Own
                                    </Link>
                                </li>
                            </ul>
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
                                    className="auth-btn signin-btn"
                                    onClick={() => handleAuthClick('/login')}
                                >
                                    <FaUser />
                                    <span>Sign In</span>
                                </button>
                                <button
                                    className="auth-btn signup-btn"
                                    onClick={() => handleAuthClick('/registration')}
                                >
                                    <FaUserPlus />
                                    <span>Sign Up</span>
                                </button>
                            </>
                        ) : (
                            <button
                                className="auth-btn account-btn"
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