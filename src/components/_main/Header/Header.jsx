// components/Header.js
import { useContext, useEffect, useState } from 'react';
import { FaBars, FaEdit, FaGlassCheers, FaMapMarkerAlt, FaPizzaSlice, FaSearch, FaTag, FaTimes, FaUserCircle } from 'react-icons/fa';
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

    // ── Generic initials avatar ──────────────────────────────────────────────
    // Always show a branded initials circle — never a user-uploaded photo.
    const initial = (
        user?.data?.firstname?.[0] ||
        user?.data?.email?.[0] ||
        '?'
    ).toUpperCase();

    const UserAvatar = () => (
        <div
            aria-hidden="true"
            style={{
                width: 30, height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary, #E63946), #ff6b35)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.82rem',
                flexShrink: 0,
                lineHeight: 1,
                userSelect: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            }}
        >
            {initial}
        </div>
    );


    return (
        <header className="header shadow-sm">

            <div className="top-bar d-none d-md-flex">
                <div className="top-bar__contact">
                    <a href={`mailto:${siteData.contact_email}`} className="top-bar__link" aria-label="Email us">
                        <i className="bi bi-envelope-fill top-bar__icon"></i>
                        <span>{siteData.contact_email}</span>
                    </a>
                    <span className="top-bar__divider" aria-hidden="true"></span>
                    <a href={`tel:${siteData.contact_phone}`} className="top-bar__link" aria-label="Call us">
                        <i className="bi bi-telephone-fill top-bar__icon"></i>
                        <span>{siteData.contact_phone}</span>
                    </a>
                </div>
                <div className="top-bar__tagline">
                    <span>🍕 Fresh. Hot. Delivered.</span>
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
                    </div>
                    <button className='btn-search' aria-label="Search" onClick={handleMobileSearchOpen}>
                        <FaSearch size={20} className="text-secondary" />
                    </button>
                    {/* Location icon — opens store select modal on mobile */}
                    {selectedStore && (
                        <button
                            className='btn-search'
                            aria-label="Change store"
                            onClick={() => setShowStorePopup && setShowStorePopup(true)}
                        >
                            <FaMapMarkerAlt size={20} className="text-primary" />
                        </button>
                    )}

                    {/* Cart icon — mobile only */}
                    <button
                        type="button"
                        className="btn-search position-relative"
                        onClick={() => navigate('/cart')}
                        aria-label="View Cart"
                        style={{ padding: '0.6rem' }}
                    >
                        <span
                            className="position-absolute top-0 start-100 translate-middle cart-count"
                            style={{ fontSize: '0.55rem', minWidth: '16px', height: '16px', lineHeight: '16px', padding: '0 3px', borderRadius: '8px' }}
                        >
                            {cart?.product?.length ? (cart.product.length > 9 ? '9+' : cart.product.length) : 0}
                        </span>
                        <FaCartShopping className="text-primary" size={20} />
                    </button>

                    {/* Profile avatar — mobile only, shown when logged in */}
                    {isAuthenticated && (
                        <button
                            type="button"
                            className="btn p-0 d-flex align-items-center"
                            onClick={() => navigate('/my-account')}
                            aria-label="My Account"
                            style={{ background: 'transparent', border: 'none', flexShrink: 0 }}
                        >
                            <UserAvatar />
                        </button>
                    )}
                </div>


                {/* Desktop Search - shown from md (tablet) and above */}
                <div className='d-none d-md-block position-relative' ref={searchRef} style={{ minWidth: "250px", maxWidth: "300px", flex: "1" }}>
                    <form onSubmit={handleSearchSubmit}>
                        <div className="search-box flex-grow-1 position-relative">
                            <div className="input-group shadow-sm rounded-pill">
                                <input
                                    type="text"
                                    className="form-control border-0 rounded-pill ps-3 pe-4"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => {
                                        if (searchResults.length > 0 && searchQuery.length >= 2) {
                                            setShowSearchDropdown(true);
                                        }
                                    }}
                                />
                                <button
                                    type={searchQuery ? "button" : "submit"}
                                    className="btn rounded-circle position-absolute end-0 top-0 bottom-0 me-2"
                                    onClick={searchQuery ? handleClearSearch : undefined}
                                    aria-label={searchQuery ? "Clear search" : "Search"}
                                >
                                    {searchQuery ? (
                                        <FaTimes size={18} className="text-muted" />
                                    ) : (
                                        <FaSearch size={20} className='text-primary' />
                                    )}
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
                    {loading || logoError ? (
                        <div className="d-flex align-items-center">
                            <div className="logo-placeholder placeholder-glow me-2">
                                <span className="placeholder rounded-circle" style={{ backgroundColor: "#e0e0e0", display: 'block', width: '58px', height: '58px' }}></span>
                            </div>
                            <span className="fw-bold fs-5 text-primary align-middle">
                                {loading ? "Loading..." : siteData.site_name}
                            </span>
                        </div>
                    ) : (
                        <>
                            <img
                                src={siteData.logo}
                                alt={`${siteData.site_name} Logo`}
                                className='logo'
                                onError={() => setLogoError(true)}
                            />
                            <span className="fw-bold fs-5 text-primary ms-2 align-middle">
                                {siteData.site_name}
                            </span>
                        </>
                    )}
                </div>

                {/* Right Side Actions — desktop only (mobile has its own row above) */}
                <div className="d-none d-md-flex align-items-center justify-content-end gap-2 my-md-0">
                    {/* Store badge — desktop only */}
                    {selectedStore && (
                        <div
                            className="d-none d-md-flex align-items-center gap-2 px-3 py-2"
                            style={{
                                border: '1.5px solid var(--primary, #E63946)',
                                borderRadius: '14px',
                                fontSize: '0.72rem',
                                color: 'var(--primary, #E63946)',
                                background: 'rgba(230,57,70,0.04)',
                                minWidth: 0,
                                maxWidth: 300,
                            }}
                        >
                            <FaMapMarkerAlt size={13} className="flex-shrink-0" />

                            {/* Text block */}
                            <div style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>
                                <div className="fw-bold text-truncate">
                                    {selectedStore.storeLocation || selectedStore.city}
                                </div>
                                {selectedStore.storeAddress && (
                                    <div className="text-truncate" style={{ opacity: 0.6 }}>
                                        {selectedStore.storeAddress}
                                    </div>
                                )}
                            </div>

                            {/* ── Order-type pill ──────────────────────────────── */}
                            <button
                                type="button"
                                className={`otm-pill otm-pill--${selectedType || 'pickup'}`}
                                onClick={() => setShowOrderTypeModal(true)}
                                title={`Switch order type (currently ${selectedType || 'pickup'})`}
                            >
                                {selectedType === 'delivery' ? '🚚' : '🏪'}
                                {' '}{selectedType === 'delivery' ? 'Delivery' : 'Pickup'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowStorePopup && setShowStorePopup(true)}
                                className="btn btn-sm p-1 flex-shrink-0"
                                style={{ color: 'var(--primary, #E63946)', lineHeight: 1 }}
                                title="Change store"
                            >
                                <FaEdit size={13} />
                            </button>
                        </div>
                    )}

                    {
                        !hideOrderNow && cart && cart?.product?.length <= 0 && (
                            <button
                                type='button'
                                onClick={handleOrderNowClick}
                                className="btn btn-primary rounded-pill fw-semibold shadow-md order-now-mobile-btn bg-primary text-white d-none d-md-inline-block"
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
                        onClick={() => navigate('/cart')}
                        className="btn fw-semibold d-flex position-relative"
                        aria-label="View Cart"
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
                            className="btn fw-semibold d-flex align-items-center"
                            aria-label="My Account"
                        >
                            <UserAvatar />
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
                                <a href="https://web.exter.ca/" className="nav-link active">Home</a>
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