// Header.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopBanner from './TopBanner';
import LogoSearch from './LogoSearch';
import NavButtons from './NavButtons';
import '../../../assets/styles/new/header/headerr.css';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const headerClass = isCartOpen ? 'backdrop-blur-sm bg-white/80' : '';

  return (
    <>
      <header className={`w-full z-50 relative transition-all duration-300 ${headerClass}`}>
        <TopBanner />
        <LogoSearch onOpenCart={handleOpenCart} />
        <NavButtons onToggleMobileMenu={handleToggleMobileMenu} />
      </header>
    </>
  );
};

export default Header;
