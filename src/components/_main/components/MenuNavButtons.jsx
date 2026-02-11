// components/MenuNavButtons.jsx (Updated with CSS import)
import React from "react";
// import './menu-nav-buttons.css';

const MenuNavButtons = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'create-your-own', name: 'Create Your Own', icon: '🎨' },
    { id: 'deals', name: 'Deals', icon: '💰' },
    { id: 'signature-pizza', name: 'Signature Pizza', icon: '⭐' },
    { id: 'other-pizza', name: 'Other Pizza', icon: '🍕' },
    { id: 'sides', name: 'Sides', icon: '🥗' },
    { id: 'dips', name: 'Dips', icon: '🥣' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mb-8 sm:mb-12">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 flex items-center space-x-2 min-w-[120px] sm:min-w-[140px] ${
              activeCategory === category.id
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50'
            }`}
          >
            <span className="text-lg sm:text-xl">{category.icon}</span>
            <span className="whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuNavButtons;