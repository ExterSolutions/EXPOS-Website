import React from 'react';
import { Link } from 'react-router-dom';
import '../../../assets/styles/modern-cards.css';
import Sides from '../../_main/Sides/Sides';
import CartFunction from '../../cart';

function SidesSelector({ sides }) {
    const cartFn = new CartFunction();
    if (!sides || sides.length === 0) return null;

    return (
        <section className="menu-section" id="sides">
            <div className="menu-section-header">
                <span className="menu-section-pill-tag">🍟 CRAVABLE SIDES</span>
                <div className="menu-section-title-row">
                    <h2 className="menu-section-heading">Sides & Appetizers</h2>
                    <Link to="/sides" className="menu-section-view-all-btn">
                        View All Sides →
                    </Link>
                </div>
                <p className="menu-section-subtext">
                    Garlic bread, loaded fries, cheesy sticks, wings, and more.
                </p>
            </div>
            <div className="mc-grid" id="sidesmenucard">
                {sides.map((data) => (
                    <Sides data={data} key={data.sideCode} cartFn={cartFn} />
                ))}
            </div>
        </section>
    );
}

export default SidesSelector;