import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {GlobalContext} from "../../context/GlobalContext";
// import "../../assets/styles/nav.css";
import { LuShoppingCart } from "react-icons/lu";

import DeliveryPickupModalPopup from "./DeliveryPickupModalPopup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TopBanner from "./TopBanner";
import NavMenu from "./NavMenu";
import LogoAndSearchBar from "./LogoAndSearchBar";

const HeaderOrg = ({ isdemo = false }) => {
    // Global Context (unchanged)
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated] = globalCtx.auth;
    const [showSidebar, setShowSidebar] = globalCtx.sidebar;
    const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
    const [currentStoreCode] = globalCtx.currentStoreCode;
    const [currentCity] = globalCtx.currentCity;
    const [currentStore] = globalCtx.currentStore;
    const [cart] = globalCtx.cart;

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state);

    // UI State (unchanged)
    const [dropMenu, setDropMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 767);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 767);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => setShowBanner(!isScrolled), [isScrolled]);

    const handleDrawerToggle = () => setDropMenu(v => !v);
    const handleCartBarToggle = () => setShowSidebar(v => !v);

    const handleOrderNowClick = (e) => {
        e.preventDefault();
        if (cart?.product?.length > 0) {
            if (isAuthenticated && user) navigate("/checkout");
            else {
                localStorage.setItem("redirectTo", "/checkout");
                navigate("/login");
            }
        } else {
            currentStore ? toast.error("Cart is Empty...") : setShowStorePopup(true);
        }
    };

    useEffect(() => {
        if (!currentStoreCode || !currentCity || !currentStore) {
            if (location.pathname === "/") setShowStorePopup(true);
        }
    }, [currentStoreCode, currentCity, currentStore, location.pathname]);

    const navTop = showBanner ? "10px" : "0px";
    const shouldShowBanner = showBanner && !(!isDesktop && dropMenu);
    const containerClass = isdemo
        ? "container-fluid"
        : `container-fluid container-lg ${isDesktop && isScrolled ? 'nav-scrolled' : ''}`;

    const desktopNavContent = !isScrolled ? (
        <>
            {/* Logo/Search - Top */}
            <div className="nav-center desktop-logo-top">
                <LogoAndSearchBar
                    handleOrderNowClick={handleOrderNowClick}
                    handleCartBarToggle={handleCartBarToggle}
                    cart={cart}
                    location={location}
                    onMenuToggle={handleDrawerToggle}
                />
            </div>

            {/* Desktop Horizontal Menu - Bottom with Orange BG */}
            <div className="desktop-nav-menu-wrapper desktop-menu-bottom">
                <div className="desktop-menu-bg">
                    <NavMenu
                        dropMenu={false}
                        handleDrawerToggle={() => { }}
                        location={location}
                        isAuthenticated={isAuthenticated}
                        handleOrderNowClick={handleOrderNowClick}
                        cart={cart}
                        handleCartBarToggle={handleCartBarToggle}
                        hideCart={false}
                        scrolled={isScrolled}
                    />
                </div>
            </div>
        </>
    ) : (
        <div className="desktop-nav-menu-wrapper desktop-menu-scrolled">
            <div className="desktop-menu-bg">
                <NavMenu
                    dropMenu={false}
                    handleDrawerToggle={() => { }}
                    location={location}
                    isAuthenticated={isAuthenticated}
                    handleOrderNowClick={handleOrderNowClick}
                    cart={cart}
                    handleCartBarToggle={handleCartBarToggle}
                    hideCart={false}
                    scrolled={isScrolled}
                />
            </div>
        </div>
    );

    return (
        <div className="customNav">
            <TopBanner isScrolled={isScrolled} showBanner={showBanner} />
            <div className={containerClass} style={{ overflow: "visible" }}>
                <div className="nav-center">
                    <LogoAndSearchBar
                        handleOrderNowClick={handleOrderNowClick}
                        handleCartBarToggle={handleCartBarToggle}
                        cart={cart}
                        location={location}
                        onMenuToggle={handleDrawerToggle}
                    />
                </div>
            </div>
            <nav
                className="navbar fixed-top navbar-expand-md navbar-dark bg-orange-dark transition-all duration-300"
            >
                {dropMenu && !isDesktop && <div className="mobile-menu-backdrop" onClick={handleDrawerToggle} />}
                {!isDesktop && (
                    <div className={`navbar-collapse mobile-menu-collapse`} id="navbarsExample07XL">
                        <NavMenu
                            dropMenu={dropMenu}
                            handleDrawerToggle={handleDrawerToggle}
                            location={location}
                            isAuthenticated={isAuthenticated}
                            handleOrderNowClick={handleOrderNowClick}
                            cart={cart}
                            handleCartBarToggle={handleCartBarToggle}
                            hideCart={true}
                            scrolled={isScrolled}
                        />
                    </div>
                )}
            </nav>
        </div>
    );
};

export default HeaderOrg;