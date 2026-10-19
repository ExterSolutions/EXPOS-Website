import React, { useState, useEffect } from 'react';
import {
    FaFire,
    FaStar,
    FaPizzaSlice,
    FaUtensils,
    FaTint,
    FaCoffee,
    FaChevronDown,
    FaCheck,
    FaTimes,
} from 'react-icons/fa';
import FlexDealSelector from './Selector/FlexDealSelector';
import SignatureSelector from './Selector/SignatureSelector';
import OtherPizzaSelector from './Selector/OtherPizzaSelector';
import SidesSelector from './Selector/SidesSelector';
import DipsSelector from './Selector/DipsSelector';
import DrinksSelector from './Selector/DrinksSelector';

function MenuContent({
    flexDeals = [],
    signaturePizzas = [],
    otherPizzas = [],
    sides = [],
    dips = [],
    drinks = [],
    topping = []
}) {
    const [activeCategory, setActiveCategory] = useState('deals');
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

    // Category pills data
    const categories = [
        {
            id: 'deals',
            targetId: 'deals',
            name: 'Deals & Combos',
            icon: <FaFire className="text-danger" />,
            badge: 'HOT',
            count: flexDeals.length,
            show: flexDeals && flexDeals.length > 0,
        },
        {
            id: 'signature',
            targetId: 'signature-pizzas',
            name: 'Signature Pizzas',
            icon: <FaStar className="text-warning" />,
            badge: 'POPULAR',
            count: signaturePizzas.length,
            show: signaturePizzas && signaturePizzas.length > 0,
        },
        {
            id: 'other-pizzas',
            targetId: 'other-pizzas',
            name: 'Classic Pizzas',
            icon: <FaPizzaSlice style={{ color: '#ea580c' }} />,
            count: otherPizzas.length,
            show: otherPizzas && otherPizzas.length > 0,
        },
        {
            id: 'sides',
            targetId: 'sides',
            name: 'Sides',
            icon: <FaUtensils style={{ color: '#d97706' }} />,
            count: sides.length,
            show: sides && sides.length > 0,
        },
        {
            id: 'dips',
            targetId: 'dips',
            name: 'Dips',
            icon: <FaTint style={{ color: '#0284c7' }} />,
            count: dips.length,
            show: dips && dips.length > 0,
        },
        {
            id: 'drinks',
            targetId: 'drinks',
            name: 'Drinks',
            icon: <FaCoffee style={{ color: '#059669' }} />,
            count: drinks.length,
            show: drinks && drinks.length > 0,
        },
    ].filter((cat) => cat.show);

    const activeCatObj = categories.find((c) => c.id === activeCategory) || categories[0];

    const scrollToSection = (targetId, catId) => {
        setActiveCategory(catId);
        setIsMobileDropdownOpen(false);
        const element = document.getElementById(targetId);
        if (element) {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const yOffset = isMobile ? -130 : -85;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Auto update active category pill based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const isMobile = window.innerWidth < 768;
            const scrollPos = window.scrollY + (isMobile ? 140 : 100);
            for (let i = categories.length - 1; i >= 0; i--) {
                const cat = categories[i];
                const el = document.getElementById(cat.targetId);
                if (el && el.offsetTop <= scrollPos) {
                    setActiveCategory(cat.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [categories]);

    // Close mobile dropdown when clicking outside or pressing Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsMobileDropdownOpen(false);
            }
        };
        if (isMobileDropdownOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMobileDropdownOpen]);

    return (
        <div className="menu-container-inner">
            {/* Sticky Category Quick-Filter Navigation */}
            <div className="menu-nav-sticky">
                <div className="container-fluid container-lg px-0">
                    {/* Desktop View (>= 768px): Horizontal Category Pills */}
                    <div className="menu-nav-desktop d-none d-md-flex">
                        <div className="menu-nav-scroll-container">
                            {categories.map((cat) => (
                                <button
                                    key={'cat-pill-' + cat.id}
                                    type="button"
                                    className={`menu-nav-pill ${activeCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(cat.targetId, cat.id)}
                                >
                                    <span className="pill-icon">{cat.icon}</span>
                                    <span>{cat.name}</span>
                                    {cat.badge ? (
                                        <span className="pill-badge">{cat.badge}</span>
                                    ) : (
                                        <span className="pill-count">{cat.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile View (< 768px): Interactive Category Dropdown */}
                    <div className="menu-nav-mobile d-md-none">
                        <div className="menu-mobile-dropdown-wrap">
                            <button
                                type="button"
                                className={`menu-mobile-dropdown-btn ${isMobileDropdownOpen ? 'open' : ''}`}
                                onClick={() => setIsMobileDropdownOpen((prev) => !prev)}
                                aria-label="Select Menu Category"
                                aria-expanded={isMobileDropdownOpen}
                            >
                                <div className="menu-mobile-current">
                                    <span className="menu-mobile-current-prefix">Category:</span>
                                    <span className="menu-mobile-current-icon">{activeCatObj?.icon}</span>
                                    <span className="menu-mobile-current-name">{activeCatObj?.name}</span>
                                    {activeCatObj?.badge ? (
                                        <span className="menu-mobile-current-badge">{activeCatObj.badge}</span>
                                    ) : (
                                        <span className="menu-mobile-current-count">({activeCatObj?.count})</span>
                                    )}
                                </div>
                                <span className={`menu-mobile-dropdown-chevron ${isMobileDropdownOpen ? 'rotate-180' : ''}`}>
                                    <FaChevronDown />
                                </span>
                            </button>

                            {/* Dropdown Menu Popover + Backdrop */}
                            {isMobileDropdownOpen && (
                                <>
                                    <div
                                        className="menu-mobile-dropdown-backdrop"
                                        onClick={() => setIsMobileDropdownOpen(false)}
                                    />
                                    <div className="menu-mobile-dropdown-menu" role="listbox">
                                        <div className="menu-mobile-menu-header">
                                            <span className="menu-mobile-menu-title">Select Menu Category</span>
                                            <button
                                                type="button"
                                                className="menu-mobile-menu-close"
                                                onClick={() => setIsMobileDropdownOpen(false)}
                                                aria-label="Close category menu"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <div className="menu-mobile-menu-list">
                                            {categories.map((cat) => {
                                                const isSelected = activeCategory === cat.id;
                                                return (
                                                    <button
                                                        key={'mobile-cat-' + cat.id}
                                                        type="button"
                                                        className={`menu-mobile-menu-item ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => scrollToSection(cat.targetId, cat.id)}
                                                    >
                                                        <div className="menu-mobile-item-left">
                                                            <span className="menu-mobile-item-icon">{cat.icon}</span>
                                                            <span className="menu-mobile-item-name">{cat.name}</span>
                                                            {cat.badge && (
                                                                <span className="menu-mobile-item-badge">{cat.badge}</span>
                                                            )}
                                                        </div>
                                                        <div className="menu-mobile-item-right">
                                                            <span className="menu-mobile-item-count">{cat.count}</span>
                                                            {isSelected && <FaCheck className="menu-mobile-item-check" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="menu-sections-wrapper">
                {/* 1. Hot Deals & Combos */}
                <FlexDealSelector deals={flexDeals} />

                {/* 2. Signature Pizzas */}
                <SignatureSelector
                    signaturePizzas={signaturePizzas}
                    topping={topping}
                />

                {/* 3. Classic & Specialty Pizzas */}
                <OtherPizzaSelector
                    otherPizzas={otherPizzas}
                    topping={topping}
                />

                {/* 4. Cravable Sides */}
                <SidesSelector sides={sides} />

                {/* 5. Signature Dips */}
                <DipsSelector dips={dips} />

                {/* 6. Refreshing Drinks */}
                <DrinksSelector drinks={drinks} />
            </div>
        </div>
    );
}

export default MenuContent;