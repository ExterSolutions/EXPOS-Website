import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchProducts } from '../../../../services';

export const useSearch = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get initial query from URL (supports both ?q= and ?search=)
    const getInitialQuery = () => {
        const params = new URLSearchParams(location.search);
        return params.get('q') || params.get('search') || '';
    };

    // Search state
    const [searchQuery, setSearchQuery] = useState(getInitialQuery());
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    
    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);

    // Sync state with URL changes (back/forward navigation)
    useEffect(() => {
        const q = getInitialQuery();
        setSearchQuery(q);
    }, [location.search]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                fetchSearchResults(searchQuery);
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch search results
    const fetchSearchResults = async (query) => {
        try {
            const res = await searchProducts(query);
            setSearchResults(res.data || []);
            setShowSearchDropdown(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setShowSearchDropdown(false);
        }
    };

    // Close dropdown on outside click for desktop
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile search on outside click
    useEffect(() => {
        const handleClickOutsideMobile = (event) => {
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
                setShowMobileSearch(false);
                setShowSearchDropdown(false);
            }
        };
        if (showMobileSearch) {
            document.addEventListener('mousedown', handleClickOutsideMobile);
        }
        return () => document.removeEventListener('mousedown', handleClickOutsideMobile);
    }, [showMobileSearch]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearchDropdown(false);
            setShowMobileSearch(false);
        }
    };

    // Handle search clear
    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchDropdown(false);
        
        // Clear all relevant URL params to restore full data view
        const params = new URLSearchParams(location.search);
        params.delete('q');
        params.delete('search');
        params.delete('code');
        
        const newSearch = params.toString();
        navigate({
            pathname: location.pathname,
                search: newSearch ? `?${newSearch}` : ''
        }, { replace: true });
    };

    // Handle mobile search open
    const handleMobileSearchOpen = () => {
        setShowMobileSearch(true);
    };

    // Handle mobile search close
    const handleMobileSearchClose = () => {
        setShowMobileSearch(false);
        setShowSearchDropdown(false);
        setSearchQuery('');
    };

    // Handle search dropdown close
    const handleSearchDropdownClose = () => {
        setShowSearchDropdown(false);
        setSearchQuery('');
    };

    // Handle search item click (for both desktop and mobile)
    const handleSearchItemClick = (item) => {
        setShowSearchDropdown(false);
        setShowMobileSearch(false);
        // If item provided, set its name in the search bar
        if (item?.name) {
            setSearchQuery(item.name);
        }
    };

    return {
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
    };
};