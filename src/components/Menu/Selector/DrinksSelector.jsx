import React from 'react';
import { Link } from 'react-router-dom';
import '../../../assets/styles/modern-cards.css';
import Drink from '../../_main/DrinksOld/Drink';
import CartFunction from '../../cart';

function DrinksSelector({ drinks }) {
    const cartFn = new CartFunction();
    if (!drinks || drinks.length === 0) return null;

    return (
        <section className="menu-section pb-4" id="drinks">
            <div className="menu-section-header">
                <span className="menu-section-pill-tag">🥤 ICE-COLD REFRESHMENTS</span>
                <div className="menu-section-title-row">
                    <h2 className="menu-section-heading">Refreshing Drinks</h2>
                    <Link to="/drinks" className="menu-section-view-all-btn">
                        View All Drinks →
                    </Link>
                </div>
                <p className="menu-section-subtext">
                    Coke, Sprite, Ginger Ale, juices, and cold bottled beverages.
                </p>
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