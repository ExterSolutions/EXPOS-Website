import React from 'react';
import { Link } from 'react-router-dom';
import '../../../assets/styles/modern-cards.css';
import Dips from '../../_main/Dips/Dips';
import CartFunction from '../../cart';

function DipsSelector({ dips }) {
    const cartFn = new CartFunction();
    if (!dips || dips.length === 0) return null;

    return (
        <section className="menu-section" id="dips">
            <div className="menu-section-header">
                <span className="menu-section-pill-tag">🥣 FLAVOR BOOSTERS</span>
                <div className="menu-section-title-row">
                    <h2 className="menu-section-heading">Signature Dips</h2>
                    <Link to="/dips" className="menu-section-view-all-btn">
                        View All Dips →
                    </Link>
                </div>
                <p className="menu-section-subtext">
                    Creamy garlic, cheddar jalapeño, ranch, and sweet chili sauces.
                </p>
            </div>
            <div className="mc-grid" id="dipsmenucard">
                {dips.map((data) => (
                    <Dips
                        key={'dips-card-' + (data?.dipsCode || data?.code)}
                        data={data}
                        cartFn={cartFn}
                    />
                ))}
            </div>
        </section>
    );
}

export default DipsSelector;