import React from 'react';
import '../../../assets/styles/modern-cards.css';
import Drink from '../../_main/DrinksOld/Drink';
import CartFunction from '../../cart';

function DrinksSelector({ drinks }) {
    const cartFn = new CartFunction();
    if (!drinks || drinks.length === 0) return null;

    return (
        <section className="menu-section pt-4 pb-5" id="drinks">
            <div className="menu-section-header-wrapper d-flex align-items-end justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <span className="menu-section-pill-tag">🥤 ICE-COLD</span>
                    <h2 className="menu-section-heading mt-1 mb-0">Refreshing Drinks</h2>
                    <p className="menu-section-subtext mb-0 mt-1">
                        Coke, Sprite, Ginger Ale, juices, and cold bottled beverages.
                    </p>
                </div>
            </div>
            <div className="mc-grid" id="drinksmenucard">
                {drinks.map((data, idx) => (
                    <Drink
                        data={data}
                        idx={idx}
                        key={'drink-' + (data?.softdrinkCode || idx)}
                        cartFn={cartFn}
                    />
                ))}
            </div>
        </section>
    );
}

export default DrinksSelector;