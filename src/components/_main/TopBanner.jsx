import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaPizzaSlice, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
// import "../../assets/styles/new/header/topBanner.css";

const TopBanner = ({ isScrolled, showBanner }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 3000); // 3 sec delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`top-banner ${isScrolled ? "scrolled" : ""} ${!showBanner ? "hidden" : ""}`}>
      <div className={`top-banner-content ${animate ? "animate" : ""}`}>
        {/* Mobile */}
        <div className="top-banner-mobile">
          <div className="mobile-contact-info fade-in-center">
            <a href="tel:+14034925500" className="top-banner-phone-link">
              <FaPhoneAlt className="top-banner-icon" />
              <span className="contact-text">+1 403 492 5500</span>
            </a>
            <span className="contact-separator">|</span>
            <a href="mailto:hello@chandigarhpizza.in" className="top-banner-email-link">
              <FaEnvelope className="top-banner-icon" />
              <span className="contact-text">hello@chandigarhpizza.in</span>
            </a>
          </div>
        </div>

        {/* Tablet */}
        <div className="top-banner-tablet">
          <div className="tablet-contact-left slide-in-left">
            <a href="mailto:hello@chandigarhpizza.in" className="top-banner-email">
              <FaEnvelope className="top-banner-icon" />
              hello@chandigarhpizza.in
            </a>
          </div>
          <div className="tablet-contact-right slide-in-right">
            <a href="tel:+14034925500" className="top-banner-phone">
              <FaPhoneAlt className="top-banner-icon" />
              +1 403 492 5500
            </a>
          </div>
        </div>

        {/* Desktop */}
        <div className="top-banner-desktop">
          <div className="desktop-contact-info slide-in-left">
            <a href="hello@chandigarhpizza.in" className="top-banner-email">
              <FaEnvelope className="top-banner-icon" />
              hello@chandigarhpizza.in
            </a>
            <span className="desktop-separator">|</span>
            <a href="tel:+14034925500" className="top-banner-phone">
              <FaPhoneAlt className="top-banner-icon" />
              +1 403 492 5500
            </a>
          </div>
          

          <Link to="/menu" className="promo-message slide-in-center">
            <FaPizzaSlice className="top-banner-icon promo-icon" />
            <span>Hot & Fresh Pizzas – Order Now and Get 20% Off!</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;