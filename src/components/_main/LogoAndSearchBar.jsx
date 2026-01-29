import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaUtensils, FaShoppingCart, FaBars } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";

import appLogo from "../../assets/images/logo.png";
import "../../assets/styles/new/header/LogoAndSearchBar.css";
import http from "../../services/http";

// Custom hook for product search using axios GET
const useProductSearch = (baseUrl) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchProducts = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return [];
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await http.get(`/search-products?search=${encodeURIComponent(query)}`);
            const products = response.data.data || [];
            setSearchResults(products);
            return products;
        } catch (err) {
            setError(err.message);
            setSearchResults([]);
            console.error("Search error:", err);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { searchResults, setSearchResults, isLoading, error, searchProducts };
};

// Custom debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const LogoAndSearchBar = ({ handleOrderNowClick, handleCartBarToggle, cart, onMenuToggle, location, baseUrl }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const { searchResults, setSearchResults, isLoading, error, searchProducts } = useProductSearch(baseUrl);

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [menuData, setMenuData] = useState(null); // Add state for menu data
    const [menuLoading, setMenuLoading] = useState(true); // Separate loading for menu

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch menu data once for slugs and details
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                setMenuLoading(true);
                // Adjust endpoint to your menu API
                const response = await http.get('/menu');
                setMenuData(response.data.data || response.data || []);
            } catch (err) {
                console.error('Error fetching menu data:', err);
            } finally {
                setMenuLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    // Debounced search value
    const debouncedSearchValue = useDebounce(searchValue, 300);

    // Effect to trigger search on debounced value change
    useEffect(() => {
        if (debouncedSearchValue.length === 0) {
            setSearchResults([]);
            return;
        }
        searchProducts(debouncedSearchValue);
    }, [debouncedSearchValue, searchProducts]);

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        if (isSearchVisible) {
            setSearchValue("");
            setSearchResults([]);
        }
    };

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            const results = await searchProducts(searchValue);
            // Check for exact code match (case-insensitive)
            const exactMatch = results.find(p => p.code && p.code.toLowerCase() === searchValue.trim().toLowerCase());
            if (exactMatch && !menuLoading) {
                // Direct navigation for exact code match to show in main menu view
                const fullProduct = menuData?.find(item => item.code === exactMatch.code || item.id === exactMatch.id);
                if (fullProduct?.slug) {
                    navigate(`/menu/${fullProduct.slug}`);
                } else {
                    // Navigate to /menu and pass the product to highlight/show in main data
                    navigate('/menu', { state: { selectedProduct: exactMatch, highlightExact: true } });
                }
                if (!isDesktop) toggleSearch();
                return;
            }
            // Otherwise, navigate to search results with data
            navigate(`/search-results?q=${encodeURIComponent(searchValue)}`, { state: { results } });
        }
    };

    const handleResultClick = (product) => {
        if (menuLoading) return; // Wait for menu data

        // Find full product from menu data using code or id
        const fullProduct = menuData?.find(item => item.code === product.code || item.id === product.id);
        if (fullProduct?.slug) {
            // Navigate to /menu/:slug for details
            navigate(`/menu/${fullProduct.slug}`);
        } else {
            // Fallback: Navigate to /menu with product in state to show in main data
            navigate('/menu', { state: { selectedProduct: product, highlightExact: true } });
        }
        if (!isDesktop) {
            toggleSearch(); // Close search on mobile
        }
    };

    // Close search when pressing escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isSearchVisible) {
                toggleSearch();
            }
        };

        if (isSearchVisible) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isSearchVisible]);

    return (
        <div className={`logo-search-container ${!isDesktop && isSearchVisible ? 'mobile-search-active' : ''}`}>
            {/* Left Part - Menu, Logo, Search */}
            <div className="left-part">
                {/* Mobile Menu Toggle - Only show on mobile */}
                {!isDesktop && !isSearchVisible && (
                    <button
                        className="mobile-menu-toggle"
                        onClick={onMenuToggle}
                        aria-label="Toggle menu"
                        type="button"
                    >
                        <FaBars size={20} />
                    </button>
                )}

                {/* Mobile Logo - Only show in mobile when search not visible */}
                {!isDesktop && !isSearchVisible && (
                    <Link to="/" className="navbar-brand mobile-only-logo">
                        <img src={appLogo} alt="Panjab Pizza Logo" className="logo" />
                        <span className="brand-text">
                            <span className="brand-line">Panjab</span>
                            <span className="brand-line">Pizza</span>
                        </span>
                    </Link>
                )}

                {/* Desktop Search - Always show on desktop */}
                {isDesktop && (
                    <div className={`search-section desktop-only ${isLoading ? "loading" : ""}`}>
                        <form onSubmit={handleSubmit}>
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchValue}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                                <button
                                    className="search-icon-circle"
                                    type="submit"
                                    aria-label="Search"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        <FaSearch size={16} color="#ffffff" />
                                    )}
                                </button>
                            </div>
                        </form>
                        {/* Desktop Search Results Dropdown */}
                        {searchResults.length > 0 && !isLoading && (
                            <div className="search-results-dropdown">
                                {searchResults.map((product) => (
                                    <div
                                        key={product.code}
                                        className="search-result-item"
                                        onClick={() => handleResultClick(product)}
                                    >
                                        {product.image && (
                                            <img
                                                src={product.image.replace(/\\/g, '')}
                                                alt={product.name}
                                                className="result-image"
                                            />
                                        )}
                                        <div className="result-info">
                                            <h4>{product.name}</h4>
                                            <span className="result-ratings">⭐ {product.ratings || 'N/A'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {error && <div className="search-error">Error: {error}</div>}
                    </div>
                )}

                {/* Mobile Search - Only show when active */}
                {!isDesktop && isSearchVisible && (
                    <div className={`search-section mobile-visible ${isLoading ? "loading" : ""}`}>
                        <form onSubmit={handleSubmit}>
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchValue}
                                    onChange={handleSearch}
                                    className="search-input"
                                    autoFocus
                                    disabled={isLoading}
                                />
                                <button
                                    className="search-icon-circle"
                                    type="submit"
                                    aria-label="Search"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        <FaSearch size={16} color="#ffffff" />
                                    )}
                                </button>
                            </div>
                        </form>
                        {/* Mobile Search Results */}
                        {searchResults.length > 0 && !isLoading && (
                            <div className="search-results mobile-results">
                                {searchResults.map((product) => (
                                    <div
                                        key={product.code}
                                        className="search-result-item"
                                        onClick={() => handleResultClick(product)}
                                    >
                                        <h4>{product.name}</h4>
                                        <span className="result-ratings">⭐ {product.ratings || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {error && <div className="search-error">Error: {error}</div>}
                    </div>
                )}
            </div>

            {/* Center Logo - Only for Desktop */}
            {isDesktop && (
                <div className="center-part">
                    <Link to="/" className="navbar-brand">
                        <img src={appLogo} alt="Panjab Pizza Logo" className="logo" />
                        <span className="brand-text">Panjab Pizza</span>
                    </Link>
                </div>
            )}

            {/* Right Part - Icons */}
            <div className="right-part">
                {/* Close Search Button - Mobile only */}
                {!isDesktop && isSearchVisible && (
                    <button
                        className="close-search-btn"
                        onClick={toggleSearch}
                        aria-label="Close search"
                        type="button"
                        disabled={isLoading}
                    >
                        <FaTimes />
                    </button>
                )}

                {/* Right Icons */}
                {!isSearchVisible && (
                    <div className="right-icons">
                        {/* Mobile Right Icons */}
                        {!isDesktop && (
                            <div className="mobile-right-icons">
                                <button
                                    className="mobile-search-toggle"
                                    onClick={toggleSearch}
                                    aria-label="Toggle search"
                                    type="button"
                                >
                                    <FaSearch size={18} />
                                </button>
                                <button
                                    className="mobile-icon-btn cart-btn"
                                    onClick={handleCartBarToggle}
                                    aria-label="View Cart"
                                    type="button"
                                >
                                    <FaShoppingCart size={18} />
                                    <span className="mobile-cart-price">
                                        ${cart?.grandtotal ? parseFloat(cart.grandtotal || 0).toFixed(2) : '0.00'}
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Desktop Right Icons */}
                        {isDesktop && (
                            <div className="desktop-right-icons">
                                {location?.pathname !== "/checkout" && (
                                    <Link
                                        className="orderButton me-2"
                                        onClick={handleOrderNowClick}
                                        type="button"
                                    >
                                        Order Now
                                    </Link>
                                )}
                                <Link
                                    onClick={handleCartBarToggle}
                                    className="navbar-cart"
                                >
                                    <LuShoppingCart size={20} />
                                    <span className="nav-price">
                                        ${cart?.grandtotal ? parseFloat(cart.grandtotal || 0).toFixed(2) : '0.00'}
                                    </span>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogoAndSearchBar;