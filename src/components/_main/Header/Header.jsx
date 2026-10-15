// components/Header.js
import { useContext, useEffect, useState } from 'react';
import { FaBars, FaEdit, FaEnvelope, FaGlassCheers, FaHome, FaMapMarkerAlt, FaPhoneAlt, FaPizzaSlice, FaSearch, FaStore, FaTag, FaTimes, FaUser, FaUserCircle } from 'react-icons/fa';
import { FaCartShopping } from "react-icons/fa6";
import { GiPizzaSlice } from 'react-icons/gi';
import { IoColorPalette } from 'react-icons/io5';
import { MdRestaurantMenu } from 'react-icons/md';
import { PiHamburgerFill } from 'react-icons/pi';
import { SiCoffeescript } from 'react-icons/si';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { GlobalContext } from '../../../context/GlobalContext';
import SearchDropdown from './SearchDropdown';
import StoreSelectModal from '../StoreSelectModal';
import OrderTypeModal from '../OrderTypeModal';
import { GiFullPizza } from "react-icons/gi";
import './modern-navbar.css';
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
    const [selectedStore] = globalCtx.selectedStore ?? [null];
    const [logoError, setLogoError] = useState(false);
    // ── Order-type gate ──────────────────────────────────────────────────────────────
    const [selectedType, setSelectedType] = globalCtx.selectedType;
    const [showOrderTypeModal, setShowOrderTypeModal] = globalCtx.showOrderTypeModal;
    const [pendingStoreForOrderType] = globalCtx.pendingStoreForOrderType;

    // Listen for cart-revalidation custom events and show toasts
    useEffect(() => {
        const handler = (e) => toast.warn(e.detail, { autoClose: 5000 });
        window.addEventListener('cart-revalidation-toast', handler);
        return () => window.removeEventListener('cart-revalidation-toast', handler);
    }, []);

    // Handle order-type selection from the modal
    const handleOrderTypeSelect = (type) => {
        setSelectedType(type);
        localStorage.setItem('selectedType', type);
        setShowOrderTypeModal(false);
        setShowStorePopup(false); // close the underlying store popup too
        toast.success(type === 'pickup' ? '🏪 Pickup selected!' : '🚚 Delivery selected!');
    };

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
        handleClearSearch,
        handleMobileSearchOpen,
        handleMobileSearchClose,
        handleSearchItemClick
    } = useSearch();
    const { showStorePopup, setShowStorePopup } = useStorePopup();
    const location = useLocation();
    const { handleOrderNowClick } = useOrderNow();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    // Hide 'Order Now' when user is already on a product/customisation page
    const HIDE_ORDER_NOW_PATHS = [
        '/signaturepizza', '/specialoffer',
        '/sides', '/dips', '/drinks', '/create-your-own',
    ];
    const hideOrderNow = HIDE_ORDER_NOW_PATHS.some(p => location.pathname.startsWith(p));

    const circleMenuItems = [
        { id: "flex-deals",     name: "Flex Deals",     icon: <FaTag className="w-4 h-4" /> },
        { id: "signaturepizza", name: "Signature Pizza", icon: <FaPizzaSlice className="w-4 h-4" /> },
        { id: "sides",         name: "Sides",          icon: <PiHamburgerFill className="w-4 h-4" /> },
        { id: "dips",          name: "Dips",           icon: <SiCoffeescript className="w-4 h-4" /> },
        { id: "drinks",        name: "Drinks",         icon: <FaGlassCheers className="w-4 h-4" /> },
        { id: "menu",          name: "All Menu",       icon: <MdRestaurantMenu className="w-4 h-4" /> },
        { id: "create-your-own", name: "Create Your Own", icon: <IoColorPalette className="w-4 h-4" /> },
    ];

    const toggleMobileMenu = () => {
        setOpenMobileMenu(prev => !prev);
    };


    
    return (
        <header className="header shadow-sm">

            <div className="top-bar d-none d-md-flex">
                <div className="top-bar__contact">
                    <a href={`mailto:${siteData.contact_email}`} className="top-bar__link" aria-label="Email us">
                        <FaEnvelope className="top-bar__icon" />
                        <span>{siteData.contact_email}</span>
                    </a>
                    <span className="top-bar__divider" aria-hidden="true"></span>
                    <a href={`tel:${siteData.contact_phone}`} className="top-bar__link" aria-label="Call us">
                        <FaPhoneAlt className="top-bar__icon" />
                        <span>{siteData.contact_phone}</span>
                    </a>
                </div>
                <div className="top-bar__tagline">
                    <span>🍕 {siteData.tagline || 'Fresh. Hot. Delivered.'}</span>
                </div>
            </div>

            {/* MIDDLE SECTION */}
            <div className={`middle-section bg-white ${isSticky ? "fixed-top-middle-mobile" : ""}`}>
                <div className="middle-section-inner">
                    {/* Mobile small row - hidden on md and above */}
                    <div className="middle-small d-md-none w-100">

                        {/* ── LEFT: Brand group (hamburger + logo) ── */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                                className="navbar-toggler border-0"
                                type="button"
                                onClick={toggleMobileMenu}
                                aria-label={`${openMobileMenu ? 'Close' : 'Open'} mobile menu`}
                                aria-expanded={openMobileMenu}
                            >
                                <FaBars size={20} className="text-primary" />
                            </button>
                            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                {loading || logoError ? (
                                    <div className="logo-placeholder placeholder-glow">
                                        <span className="placeholder w-100 h-100 rounded-circle" style={{ backgroundColor: "#e0e0e0", display: 'block', width: '45px', height: '45px' }}></span>
                                    </div>
                                ) : (
                                    <img
                                        src={siteData.logo}
                                        alt={`${siteData.site_name} Logo`}
                                        className='logo'
                                        onError={() => setLogoError(true)}
                                    />
                                )}
                            </Link>
                        </div>

                        {/* ── RIGHT: Action icons (search, location, profile) ── */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                className='btn-search'
                                aria-label="Search"
                                onClick={handleMobileSearchOpen}
                                style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FaSearch size={20} className="text-secondary" />
                            </button>

                            {selectedStore && (
                                <button
                                    className='btn-search'
                                    aria-label="Change store"
                                    onClick={() => setShowStorePopup && setShowStorePopup(true)}
                                    style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <FaMapMarkerAlt size={20} className="text-primary" />
                                </button>
                            )}

                            {/* Cart is in the BottomNav on mobile — no need to duplicate it here */}

                            {isAuthenticated && (
                                <button
                                    type="button"
                                    className="btn-search d-flex align-items-center"
                                    onClick={() => navigate('/my-account')}
                                    aria-label="My Account"
                                    style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <FaUserCircle className="text-primary" size={22} />
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Desktop Search - shown from md (tablet) and above */}
                    <div className='d-none d-md-block desktop-search-wrapper' ref={searchRef}>
                        <form onSubmit={handleSearchSubmit}>
                            <div className="modern-search-input-wrap">
                                <FaSearch className="modern-search-icon" size={15} />
                                <input
                                    type="text"
                                    className="modern-search-input"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => {
                                        if (searchResults.length > 0 && searchQuery.length >= 2) {
                                            setShowSearchDropdown(true);
                                        }
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="modern-search-clear"
                                        onClick={handleClearSearch}
                                        aria-label="Clear search"
                                    >
                                        <FaTimes size={13} />
                                    </button>
                                )}
                            </div>

                            {/* Search Dropdown */}
                            {showSearchDropdown && (
                                <div className="position-absolute w-100 mt-2 search-dropdown-container" style={{ zIndex: 1060 }}>
                                    <SearchDropdown
                                        results={searchResults}
                                        onClose={handleSearchItemClick}
                                    />
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Logo and Site Name */}
                    <Link to="/" className="d-none d-md-flex align-items-center justify-content-center desktop-brand-link">
                        {loading || logoError ? (
                            <div className="d-flex align-items-center">
                                <div className="logo-placeholder placeholder-glow me-2">
                                    <span className="placeholder rounded-circle" style={{ backgroundColor: "#e0e0e0", display: 'block', width: '52px', height: '52px' }}></span>
                                </div>
                                <span className="desktop-brand-text">
                                    {loading ? "Loading..." : siteData.site_name}
                                </span>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={siteData.logo}
                                    alt={`${siteData.site_name} Logo`}
                                    className='desktop-brand-logo'
                                    onError={() => setLogoError(true)}
                                />
                                <span className="desktop-brand-text ms-2">
                                    {siteData.site_name}
                                </span>
                            </>
                        )}
                    </Link>

                    {/* Right Side Actions — desktop only (mobile has its own row above) */}
                    <div className="d-none d-md-flex desktop-actions-wrapper">
                        {/* Store badge — desktop only */}
                        {selectedStore && (
                            <div
                                className="desktop-store-card"
                                onClick={() => setShowStorePopup && setShowStorePopup(true)}
                                title="Click to change store"
                            >
                                <div className="store-card-icon-chip">
                                    <FaMapMarkerAlt size={14} />
                                </div>

                                <div className="store-card-info">
                                    <div className="store-card-title">
                                        {selectedStore.storeLocation || selectedStore.city}
                                    </div>
                                    {selectedStore.storeAddress && (
                                        <div className="store-card-sub">
                                            {selectedStore.storeAddress}
                                        </div>
                                    )}
                                </div>

                                {/* Order-type pill */}
                                <button
                                    type="button"
                                    className={`otm-pill otm-pill--${selectedType || 'pickup'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowOrderTypeModal(true);
                                    }}
                                    title={`Switch order type (currently ${selectedType || 'pickup'})`}
                                >
                                    {selectedType === 'delivery' ? '🚚' : '🏪'}
                                    {' '}{selectedType === 'delivery' ? 'Delivery' : 'Pickup'}
                                </button>

                                <div className="store-card-edit-btn" title="Change store">
                                    <FaEdit size={13} />
                                </div>
                            </div>
                        )}

                        {!hideOrderNow && cart && cart?.product?.length <= 0 && (
                            <button
                                type='button'
                                onClick={handleOrderNowClick}
                                className="desktop-order-now-btn"
                            >
                                Order Now
                            </button>
                        )}

                        <button
                            type='button'
                            onClick={() => navigate('/cart')}
                            className="desktop-action-icon-btn"
                            aria-label="View Cart"
                        >
                            <FaCartShopping size={18} />
                            {Boolean(cart?.product?.length) && (
                                <span className="desktop-cart-counter">
                                    {cart?.product.length > 9 ? "9+" : cart?.product.length}
                                </span>
                            )}
                        </button>

                        {isAuthenticated && (
                            <button
                                type='button'
                                onClick={() => navigate("/my-account")}
                                className="desktop-action-icon-btn"
                                aria-label="My Account"
                            >
                                <FaUserCircle size={22} />
                            </button>
                        )}
                    </div>
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
                                    className="form-control rounded-pill pe-4"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    autoFocus
                                />
                                <button
                                    type={searchQuery ? "button" : "submit"}
                                    className="btn position-absolute end-0 top-0 bottom-0 me-2"
                                    aria-label={searchQuery ? "Clear search" : "Search"}
                                    onClick={searchQuery ? handleClearSearch : undefined}
                                    style={{ color: searchQuery ? '#888' : (colors?.primary || 'var(--primary)') }}
                                >
                                    {searchQuery ? (
                                        <FaTimes size={18} />
                                    ) : (
                                        <FaSearch size={20} />
                                    )}
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

            {/* MODERN DESKTOP NAVBAR */}
            <nav
                ref={navbarRef}
                className={`modern-desktop-navbar d-none d-md-block ${isSticky ? "fixed-top animate-navbar" : ""}`}
            >
                <div className="container-fluid container-md">
                    <ul className="modern-nav-list">
                        <li className="modern-nav-item">
                            <Link
                                to="/"
                                className={`modern-nav-link ${isActive('/') ? 'active' : ''}`}
                                onClick={() => { setMenuOpen(false); setIsOpen(false); }}
                            >
                                <span className="modern-nav-icon"><FaHome size={15} /></span>
                                <span>Home</span>
                            </Link>
                        </li>
                        <li className="modern-nav-item">
                            <Link
                                to="/menu"
                                className={`modern-nav-link ${isActive('/menu') ? 'active' : ''}`}
                                onClick={() => { setMenuOpen(false); setIsOpen(false); }}
                            >
                                <span className="modern-nav-icon"><GiPizzaSlice size={16} /></span>
                                <span>Menu</span>
                            </Link>
                        </li>
                        <li className="modern-nav-item">
                            <Link
                                to="/flex-deals"
                                className={`modern-nav-link ${isActive('/flex-deals') ? 'active' : ''}`}
                                onClick={() => { setMenuOpen(false); setIsOpen(false); }}
                            >
                                <span className="modern-nav-icon"><FaTag size={14} /></span>
                                <span>Flex Deals</span>
                                <span className="modern-nav-badge">Hot</span>
                            </Link>
                        </li>
                        <li className="modern-nav-item">
                            <Link
                                to="/stores"
                                className={`modern-nav-link ${isActive('/stores') ? 'active' : ''}`}
                                onClick={() => { setMenuOpen(false); setIsOpen(false); }}
                            >
                                <span className="modern-nav-icon"><FaStore size={15} /></span>
                                <span>Stores</span>
                            </Link>
                        </li>
                        <li className="modern-nav-item">
                            <Link
                                to="/contact-us"
                                className={`modern-nav-link ${isActive('/contact-us') ? 'active' : ''}`}
                                onClick={() => { setMenuOpen(false); setIsOpen(false); }}
                            >
                                <span className="modern-nav-icon"><FaPhoneAlt size={14} /></span>
                                <span>Contact Us</span>
                            </Link>
                        </li>
                        {!isAuthenticated && (
                            <li className="modern-nav-item">
                                <Link
                                    to="/login"
                                    className="modern-nav-login"
                                    onClick={() => { setMenuOpen(false); setIsOpen(false); }}
                                >
                                    <FaUser size={12} />
                                    <span>Login</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            {/* Store Change Modal */}
            {showStorePopup && (
                <StoreSelectModal
                    onClose={() => setShowStorePopup(false)}
                    required={!selectedStore}
                />
            )}
            {/* Order-type gate modal */}
            <OrderTypeModal
                isOpen={showOrderTypeModal}
                storeName={
                    pendingStoreForOrderType?.storeLocation ||
                    selectedStore?.storeLocation ||
                    selectedStore?.city ||
                    ''
                }
                currentType={selectedType}
                dismissible={!!selectedStore} // non-dismissible on first pick; dismissible when re-opening from pill
                onSelect={handleOrderTypeSelect}
                onDismiss={() => setShowOrderTypeModal(false)}
            />
        </header>
    );
};

export default Header;