import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchProducts } from '../../../../services';
import { GlobalContext } from '../../../../context/GlobalContext';

export const useSearch = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const globalCtx = useContext(GlobalContext);
    const [selectedStore] = globalCtx?.selectedStore || [null];
    const cityCode = selectedStore?.cityCode || '';
    
    // Get initial query from URL or navigation state
    const getInitialQuery = () => {
        const params = new URLSearchParams(location.search);
        return params.get('q') || params.get('search') || location.state?.q || '';
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
                fetchSearchResults(searchQuery, cityCode);
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, cityCode]);

    // Fetch search results
    const fetchSearchResults = async (query, code) => {
        try {
            const res = await searchProducts(query, code);
            
            // Log for debugging (user can check browser console)
            console.log(`[Search] Query: "${query}", City: "${code || 'Default'}"`, res);
            
            // Highly resilient response parsing
            let results = [];
            
            // 1. Direct array or res.data is array
            if (Array.isArray(res)) {
                results = res;
            } else if (res && Array.isArray(res.data)) {
                results = res.data;
            } 
            // 2. Double-nested in data.data or similar (e.g. { data: { data: [...] } })
            else if (res?.data?.data && Array.isArray(res.data.data)) {
                results = res.data.data;
            }
            // 3. Fallback for objects with results or products keys
            else if (res?.results && Array.isArray(res.results)) {
                results = res.results;
            } else if (res?.products && Array.isArray(res.products)) {
                results = res.products;
            }
            // 4. Case where data contains the list directly but res is axios object
            else if (res?.data && Array.isArray(res.data)) {
                results = res.data;
            }

            setSearchResults(results);
            setShowSearchDropdown(true); // Always show so dropdown can render results or "No results found"
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

    // Handle search submit - Navigate to first result's detail page if available
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() && searchResults.length > 0) {
            const item = searchResults[0];
            const type = item?.productType || '';
            const searchParam = `?search=${encodeURIComponent(item.name)}&code=${item.code}`;
            let basePath;

            switch (type.toLowerCase()) {
                case 'signature':
                    basePath = `/signaturepizza/${item?.code}`;
                    break;
                case 'other':
                    basePath = `/otherpizza/${item?.code}`;
                    break;
                case 'dips':
                    basePath = `/dips${searchParam}`;
                    break;
                case 'drinks':
                    basePath = `/drinks${searchParam}`;
                    break;
                case 'sides':
                    basePath = `/sides${searchParam}`;
                    break;
                default:
                    basePath = '/menu';
            }

            navigate(basePath, { state: { q: searchQuery.trim() } });
            setShowSearchDropdown(false);
            setShowMobileSearch(false);
        } else if (searchQuery.trim()) {
            navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`, {
                state: { results: searchResults, q: searchQuery.trim() }
            });
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