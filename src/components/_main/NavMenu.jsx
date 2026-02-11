import { useEffect, useRef, useState } from "react";
import { FaGlassCheers, FaPizzaSlice, FaTag } from "react-icons/fa";
import { GiPizzaSlice } from "react-icons/gi";
import { IoColorPalette } from "react-icons/io5";
import { MdRestaurantMenu } from "react-icons/md";
import { PiHamburgerFill } from "react-icons/pi";
import { SiCoffeescript } from "react-icons/si";
import { NavLink, useLocation } from "react-router-dom";
// import "../../assets/styles/new/header/navmenu.css";
import Submenu from "./submenu/Submenu";

const NavMenu = ({
    dropMenu,
    handleDrawerToggle,
    location,
    isAuthenticated,
    handleOrderNowClick,
    cart,
    handleCartBarToggle,
    hideCart = false,
    scrolled = false,
}) => {
    const menuRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const currentLocation = useLocation();

    // Handle window resize for mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle click outside to close drawer and submenus
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close drawer if click is outside
            if (
                dropMenu &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !event.target.closest(".navbar-toggler")
            ) {
                handleDrawerToggle();
                setOpenSubmenus({}); // Close all submenus when drawer closes
            }

            // Close submenus if click is outside (for desktop)
            if (!isMobile && Object.keys(openSubmenus).length > 0) {
                const isClickInsideSubmenu = event.target.closest('.circle-submenu-wrapper') ||
                    event.target.closest('.has-submenu');
                if (!isClickInsideSubmenu) {
                    setOpenSubmenus({});
                }
            }

            // For mobile: Close submenus if click outside sidebar (but keep drawer open)
            if (isMobile && dropMenu && Object.keys(openSubmenus).length > 0) {
                const isClickInsideSidebar = event.target.closest('.mobile-menu-collapse');
                if (!isClickInsideSidebar) {
                    setOpenSubmenus({});
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropMenu, handleDrawerToggle, isMobile, openSubmenus]);

    // Close drawer on link click (mobile)
    const handleLinkClick = () => {
        if (dropMenu) {
            handleDrawerToggle();
            // Also close any open submenus
            setOpenSubmenus({});
        }
    };

    // Toggle submenu - ENHANCED: Toggle current, close others, and ensure auto-close on re-click
    const toggleSubmenu = (index) => {
        setOpenSubmenus((prev) => {
            const newState = {}; // Close all others first

            // If this one is open, close it (toggle off); else open it
            const isCurrentlyOpen = prev[index];
            if (!isCurrentlyOpen) {
                newState[index] = true;
            }
            // If open, newState remains empty, effectively closing it

            return newState;
        });
    };

    // Close all submenus function (for use in submenu item clicks)
    const closeAllSubmenus = () => {
        setOpenSubmenus({});
    };

    // Dynamic class for links
    const linkClass = ({ isActive }) =>
        `nav-link ${scrolled ? "nav-link-scrolled -px-2" : ""} ${isActive ? "active" : ""}`;

    // Dynamic class for ul
    const ulClass = `navbar-nav nav-menu-ul ${scrolled ? "justify-content-center nav-menu-scroll" : "justify-content-center"
        }`;

    // Use passed location or fallback to hook
    const activeLocation = location || currentLocation;


    const menuItems = [
        { to: "/", label: "Home" },
        {
            label: "Menu ", // Added ▼ icon directly to label for always visible
            to: "/menu",
        },
        { to: "/stores", label: "Stores" },
        { // Removed submenu for About to fix the issue
            to: "/about-us",
            label: "About"
        },
        { to: "/contact-us", label: "Contact" },
        {
            label: !isAuthenticated ? "Login" : "My Account",
            to: !isAuthenticated ? "/login" : "/my-account",
        },
    ];

    // Circle submenu items data - UPDATED with proper icons (synced ids without hyphens)
    const circleMenuItems = [
        {
            id: "create-your-own",
            name: "Create Your Own",
            icon: <IoColorPalette className="w-4 h-4" />,
        },
        {
            id: "specialoffer",
            name: "Special Deals",
            icon: <FaTag className="w-4 h-4" />,
        },
        {
            id: "signaturepizza",
            name: "Signature Pizza",
            icon: <FaPizzaSlice className="w-4 h-4" />,
        },
        {
            id: "otherpizza",
            name: "Other Pizza",
            icon: <GiPizzaSlice className="w-4 h-4" />,
        },
        {
            id: "sides",
            name: "Sides",
            icon: <PiHamburgerFill className="w-4 h-4" />,
        },
        {
            id: "dips",
            name: "Dips",
            icon: <SiCoffeescript className="w-4 h-4" />,
        },
        {
            id: "drinks",
            name: "Drinks",
            icon: <FaGlassCheers className="w-4 h-4" />,
        },
        {
            id: "menu",
            name: "All Menu",
            icon: <MdRestaurantMenu className="w-4 h-4 " />, // Changed to more appropriate icon
        },
    ];

    return (
        <ul ref={menuRef} className={ulClass}>
            {menuItems.map((item, index) => (
                <li
                    key={index}
                    className={`nav-item ${item.submenu || item.hasCircleSubmenu ? "has-submenu" : ""
                        } ${openSubmenus[index] ? "show-submenu" : ""}`}
                    // Add hover handler for desktop only
                    onMouseEnter={() => !isMobile && (item.submenu || item.hasCircleSubmenu) && setOpenSubmenus({ [index]: true })}
                    onMouseLeave={() => !isMobile && (item.submenu || item.hasCircleSubmenu) && setOpenSubmenus({})}
                    // For mobile: Ensure entire li is clickable to toggle submenu
                    onClick={() => isMobile && (item.submenu || item.hasCircleSubmenu) && toggleSubmenu(index)}
                >
                    {item.to ? (
                        <NavLink
                            className={linkClass}
                            to={item.to}
                            onClick={(e) => {
                                if (item.submenu || item.hasCircleSubmenu) {
                                    e.preventDefault();
                                    toggleSubmenu(index); // Toggle on click for consistency
                                } else {
                                    handleLinkClick(); // Navigate and close drawer/submenus
                                }
                            }}
                            end={item.to === "/"}
                        >
                            {item.label}
                        </NavLink>
                    ) : (
                        <span
                            className={`nav-link ${scrolled ? "nav-link-scrolled" : ""} cursor-pointer`}
                            onClick={() => {
                                toggleSubmenu(index); // Toggle on click
                                if (dropMenu) {
                                    // If in mobile drawer, don't close drawer on submenu toggle
                                }
                            }}
                        >
                            {item.label}
                        </span>
                    )}

                    {item.submenu && (
                        <ul className={`submenu ${openSubmenus[index] ? "show-submenu" : ""}`}>
                            {item.submenu.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                    <NavLink
                                        className={linkClass}
                                        to={subItem.path}
                                        onClick={() => {
                                            handleLinkClick(); // Close drawer and all submenus on submenu item click
                                            closeAllSubmenus();
                                        }}
                                    >
                                        {subItem.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}

                    {item.hasCircleSubmenu && (
                        <div className="circle-submenu-wrapper">
                            <Submenu
                                isOpen={!!openSubmenus[index]}
                                items={circleMenuItems}
                                onLinkClick={() => {
                                    handleLinkClick(); // Close drawer
                                    closeAllSubmenus(); // Close all submenus
                                }}
                            />
                        </div>
                    )}
                </li>
            ))}

            {!hideCart && (
                <li className="nav-item desktop-flex">

                </li>
            )}

            {isMobile && dropMenu && (
                <li className="nav-item">

                </li>
            )}
        </ul>
    );

};

export default NavMenu;