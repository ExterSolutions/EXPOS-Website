// components/Header.js
import { useContext } from 'react';
import { FaBars, FaGlassCheers, FaPizzaSlice, FaSearch, FaTag, FaTimes, FaUserCircle } from 'react-icons/fa';
import { FaCartShopping } from "react-icons/fa6";
import { GiPizzaSlice } from 'react-icons/gi';
import { IoColorPalette } from 'react-icons/io5';
import { MdRestaurantMenu } from 'react-icons/md';
import { PiHamburgerFill } from 'react-icons/pi';
import { SiCoffeescript } from 'react-icons/si';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
// import '../../../assets/styles/new/header/search-dropdown.css';
// import '../../../assets/styles/ultimateheader.css';
import { GlobalContext } from '../../../context/GlobalContext';
// import DeliveryPickupModalPopup from '../DeliveryPickupModalPopup';
import SearchDropdown from './SearchDropdown';
import { GiFullPizza } from "react-icons/gi";
// Import custom hooks
import { useStickyHeader } from './hooks/useStickyHeader';
import { useDropdown } from './hooks/useDropdown';
import { useSearch } from './hooks/useSearch';
import { useStorePopup } from './hooks/useStorePopup';
import { useOrderNow } from './hooks/useOrderNow';
import { useSiteData } from './hooks/useSiteData';
import { useTheme } from '../../../context/ThemeContext';

const Header = () => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const { theme, colors } = useTheme();

    // Get site data from API
    const { siteData, loading } = useSiteData();

    // Get context values
    const [isAuthenticated] = globalCtx.auth;
    const [cart] = globalCtx.cart;
    const [currentStore] = globalCtx.currentStore;
    const [cartSidebar, setCartSidebar] = globalCtx.sidebar;
    const [openMobileMenu, setOpenMobileMenu] = globalCtx.mobileMenu;

    const { user } = useSelector((state) => state);

    // Use custom hooks
    const { isSticky, navbarRef } = useStickyHeader();
    const {
        isOpen,
        menuOpen,
        dropdownRef,
        toggleNavbar,
        setMenuOpen,
        setIsOpen
    } = useDropdown();
    const {
        searchQuery,
        searchResults,
        showSearchDropdown,
        showMobileSearch,
        searchRef,
        mobileSearchRef,
        setShowSearchDropdown,
        setShowMobileSearch,
        setSearchQuery,
        handleSearchChange,
        handleSearchSubmit,
        handleMobileSearchOpen,
        handleMobileSearchClose,
        handleSearchItemClick
    } = useSearch();
    const { showStorePopup, setShowStorePopup } = useStorePopup();
    const { handleOrderNowClick } = useOrderNow();

    const circleMenuItems = [
        { id: "specialoffer", name: "Special Deals", icon: <FaTag className="w-4 h-4" /> },
        { id: "special-offers-with-toppings", name: "SpecialPizza + Toppings", icon: <GiFullPizza className="w-4 h-4" /> },
        { id: "signaturepizza", name: "Signature Pizza", icon: <FaPizzaSlice className="w-4 h-4" /> },
        { id: "otherpizza", name: "Other Pizza", icon: <GiPizzaSlice className="w-4 h-4" /> },
        { id: "sides", name: "Sides", icon: <PiHamburgerFill className="w-4 h-4" /> },
        { id: "dips", name: "Dips", icon: <SiCoffeescript className="w-4 h-4" /> },
        { id: "drinks", name: "Drinks", icon: <FaGlassCheers className="w-4 h-4" /> },
        { id: "menu", name: "All Menu", icon: <MdRestaurantMenu className="w-4 h-4" /> },
        { id: "create-your-own", name: "Create Your Own", icon: <IoColorPalette className="w-4 h-4" /> },
    ];

    const toggleMobileMenu = () => {
        setOpenMobileMenu(prev => !prev);
    };

    const handleCartBarToggle = () => setCartSidebar(prev => !prev);

    // Fallback logo
    const defaultLogo = '../../../assets/images/logo.png';

    return (
        <header className="header shadow-sm">

            <div className="top-bar">
                <div className="">
                    <a href={`mailto:${siteData.contact_email}`} className="top-link">
                        <i className="bi bi-envelope-fill me-1"></i> {siteData.contact_email}
                    </a>
                </div>
                <div>
                    <a href={`tel:${siteData.contact_phone}`} className="top-link">
                        <i className="bi bi-telephone-fill me-1"></i> {siteData.contact_phone}
                    </a>
                </div>
            </div>

            {/* MIDDLE SECTION */}
            <div className={`middle-section bg-white ${isSticky ? "fixed-top-middle-mobile" : ""}`}>
                {/* Mobile small row - hidden on md and above */}
                <div className="middle-small d-md-none">
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        onClick={toggleMobileMenu}
                        aria-label={`${openMobileMenu ? 'Close' : 'Open'} mobile menu`}
                        aria-expanded={openMobileMenu}
                    >
                        <FaBars size={20} className="text-primary" />
                    </button>
                    <div onClick={() => { navigate("/") }}>
                        {loading ? (
                            <div className="logo-placeholder"></div>
                        ) : (
                            <img
                                src={siteData.logo || defaultLogo}
                                alt={`${siteData.site_name} Logo`}
                                className='logo'
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultLogo;
                                }}
                            />
                        )}
                    </div>
                    <button className='btn-search' aria-label="Search" onClick={handleMobileSearchOpen}>
                        <FaSearch size={20} className="text-secondary" />
                    </button>
                </div>

                {/* Desktop Search - shown from md (tablet) and above */}
                <div className='d-none d-md-block position-relative' ref={searchRef} style={{ width: "200px" }}>
                    <form onSubmit={handleSearchSubmit}>
                        <div className="search-box flex-grow-1 position-relative">
                            <div className="input-group shadow-sm rounded-pill">
                                <input
                                    type="text"
                                    className="form-control border-0 rounded-pill ps-3"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => {
                                        if (searchResults.length > 0 && searchQuery.length >= 2) {
                                            setShowSearchDropdown(true);
                                        }
                                    }}
                                />
                                <button type="submit" className="btn rounded-circle position-absolute end-0 top-0 bottom-0 me-2" aria-label="Search">
                                    <FaSearch size={20} className='text-primary' />
                                </button>
                            </div>

                            {/* Search Dropdown */}
                            {showSearchDropdown && (
                                <div className="position-absolute w-100 mt-1 search-dropdown-container" style={{ zIndex: 1060 }}>
                                    <SearchDropdown
                                        results={searchResults}
                                        onClose={handleSearchItemClick}
                                    />
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Logo and Site Name */}
                <div className="d-none d-md-flex align-items-center justify-content-center flex-fill" onClick={() => { navigate("/") }}>
                    {loading ? (
                        <div className="d-flex align-items-center">
                            <div className="logo-placeholder"></div>
                            <span className="fw-bold fs-5 text-primary ms-2 align-middle">Loading...</span>
                        </div>
                    ) : (
                        <>
                            <img
                                src={siteData.logo || defaultLogo}
                                alt={`${siteData.site_name} Logo`}
                                className='logo'
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultLogo;
                                }}
                            />
                            <span className="fw-bold fs-5 text-primary ms-2 align-middle">
                                {siteData.site_name}
                            </span>
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="d-flex align-items-center justify-content-end my-2 my-md-0" style={{ width: "200px" }}>
                    {
                        cart && cart?.product?.length <= 0 && (
                            <button
                                type='button'
                                onClick={handleOrderNowClick}
                                className="btn btn-primary rounded-pill fw-semibold shadow-md order-now-mobile-btn bg-primary text-white"
                                style={{
                                    backgroundColor: 'var(--primary)',
                                    borderColor: 'var(--primary)'
                                }}
                            >
                                Order Now
                            </button>
                        )
                    }

                    <button
                        type='button'
                        onClick={handleCartBarToggle}
                        className="btn fw-semibold d-flex position-relative"
                    >
                        <span className="position-absolute top-0 start-100 translate-middle cart-count">
                            {cart?.product.length ? cart?.product.length > 9 ? "9+" : cart?.product.length : (0)}
                        </span>
                        <FaCartShopping className="text-primary" size={20} />
                    </button>

                    {isAuthenticated && (
                        <button
                            type='button'
                            onClick={() => navigate("/my-account")}
                            className="btn fw-semibold d-flex"
                            aria-label="My Account"
                        >
                            <FaUserCircle className="text-primary" size={24} />
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div className="mobile-search-overlay">
                    <div className="mobile-search-container" ref={mobileSearchRef}>
                        <div className="mobile-search-header">
                            <button className="mobile-search-close" onClick={handleMobileSearchClose} aria-label="Close search">
                                <FaTimes size={24} className="text-secondary" />
                            </button>
                        </div>
                        <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                            <div className="input-group position-relative">
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="btn position-absolute end-0 top-0 bottom-0 me-2"
                                    aria-label="Search"
                                    style={{ color: colors.primary }} // Direct from theme
                                >
                                    <FaSearch size={20} />
                                </button>
                            </div>
                        </form>
                        {/* Search Dropdown for mobile */}
                        {showSearchDropdown && (
                            <div className="mobile-search-results">
                                <SearchDropdown
                                    results={searchResults}
                                    onClose={handleSearchItemClick}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* NAVBAR - uses bg-primary (will be RED) */}
            <nav
                ref={navbarRef}
                className={`navbar navbar-expand-md navbar-dark ${isSticky ? "fixed-top animate-navbar" : ""}`}
            >
                <div className="container-fluid container-md justify-content-center">
                    <div
                        className={`collapse navbar-collapse justify-content-center ${isOpen ? "show animate-x" : ""}`}
                        id="navbarContent"
                    >
                        <ul className="navbar-nav gap-4 fs-6 fw-semibold align-items-center">
                            <li className="nav-item">
                                <a href="https://chandigarhpizza.ca/" className="nav-link active">Home</a>
                            </li>
                            <li className="nav-item dropdown position-static" ref={dropdownRef}>
                                <button
                                    className="nav-link btn bg-transparent border-0"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setMenuOpen((prev) => !prev);
                                    }}
                                >
                                    Menu
                                </button>
                                <ul
                                    className={`dropdown-menu category-dropdown ${menuOpen ? "show" : ""}`}
                                    style={{ display: menuOpen ? "block" : "none" }}
                                >
                                    <div className="dropdown-grid">
                                        {circleMenuItems.map((item) => (
                                            <div key={item.id} className="dropdown-card">
                                                <Link
                                                    to={`/${item.id}`}
                                                    className="dropdown-item-grid"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <div className="icon-circle">{item.icon}</div>
                                                    <span className="item-name">{item.name}</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </ul>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/stores" className="nav-link">Stores</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/franchise" className="nav-link">Franchise</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about-us" className="nav-link">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact-us" className="nav-link">Contact</Link>
                            </li> */}
                            <li className="nav-item">
                                {!isAuthenticated && (
                                    <Link to="/login" className="nav-link border border-white rounded-pill px-3">Login</Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* 
            {showStorePopup && (
                <DeliveryPickupModalPopup
                    show={showStorePopup}
                    setShow={setShowStorePopup}
                />
            )} */}
        </header>
    );
};

export default Header;