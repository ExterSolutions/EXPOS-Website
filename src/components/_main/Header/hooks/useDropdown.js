import { useState, useEffect, useRef } from 'react';

export const useDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Dropdown behavior
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        
        const handleResize = () => {
            setMenuOpen(false);
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("resize", handleResize);
        
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // keyboard: close on Escape
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Additional click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    const toggleNavbar = () => {
        setIsOpen(prev => !prev);
    };

    return {
        isOpen,
        setIsOpen,
        menuOpen,
        setMenuOpen,
        dropdownRef,
        toggleNavbar
    };
};