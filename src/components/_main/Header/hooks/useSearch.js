import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../../../../services';

export const useSearch = () => {
    const navigate = useNavigate();
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    
    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);

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
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSearchDropdown(false);
            setShowMobileSearch(false);
            setSearchQuery('');
        }
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
    const handleSearchItemClick = () => {
        setShowSearchDropdown(false);
        setShowMobileSearch(false);
        setSearchQuery('');
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
        handleMobileSearchOpen,
        handleMobileSearchClose,
        handleSearchItemClick
    };
};