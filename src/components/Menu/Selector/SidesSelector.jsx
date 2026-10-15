import React from 'react';
import '../../../assets/styles/modern-cards.css';
import Sides from '../../_main/Sides/Sides';
import CartFunction from '../../cart';

function SidesSelector({ sides }) {
    const cartFn = new CartFunction();
    if (!sides || sides.length === 0) return null;

    return (
        <section className="menu-section pt-4" id="sides">
            <div className="menu-section-header-wrapper d-flex align-items-end justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <span className="menu-section-pill-tag">🍟 PERFECT PAIRINGS</span>
                    <h2 className="menu-section-heading mt-1 mb-0">Cravable Sides</h2>
                    <p className="menu-section-subtext mb-0 mt-1">
                        Garlic bread, loaded fries, cheesy sticks, wings, and more.
                    </p>
                </div>
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