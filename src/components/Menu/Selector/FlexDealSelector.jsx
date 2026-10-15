import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaFire, FaTag } from 'react-icons/fa';
import '../../../assets/styles/flex-deals.css';

const PICKUP_ONLY   = ['pickupdeal', 'pickup'];
const DELIVERY_ONLY = ['deliverydeal', 'delivery'];

const getDealTypeLabel = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    if (PICKUP_ONLY.includes(t))   return '🏪 Pickup only';
    if (DELIVERY_ONLY.includes(t)) return '🚚 Delivery only';
    return null;
};

const getDisplayPrice = (deal) => {
    const validPrices = (deal?.pizza_prices ?? []).filter(p => Number(p.price) > 0);
    if (deal?.has_pizza_group && validPrices.length > 0) {
        return {
            amount: Math.min(...validPrices.map(p => Number(p.price))),
            fromLabel: validPrices.length > 1,
        };
    }
    return { amount: Number(deal?.price ?? 0), fromLabel: false };
};

function FlexDealSelector({ deals }) {
    const navigate = useNavigate();

    if (!deals || deals.length === 0) return null;

    const handleDealClick = (code) => {
        if (!code) return;
        navigate(`/flex-deals/${code}`);
    };

    return (
        <section className="menu-section pt-1" id="deals">
            <div className="menu-section-header">
                <span className="menu-section-pill-tag">
                    <FaFire className="me-1 text-danger" /> HOT DEALS & COMBOS
                </span>
                <div className="menu-section-title-row">
                    <h2 className="menu-section-heading">Deals & Combos</h2>
                    <Link to="/flex-deals" className="menu-section-view-all-btn">
                        View All Deals →
                    </Link>
                </div>
                <p className="menu-section-subtext">
                    Best value pizza bundles, family feasts, and special multi-pizza combos.
                </p>
            </div>

            <div className="fd-grid">
                {deals.map((deal) => {
                    const { amount, fromLabel } = getDisplayPrice(deal);
                    const typeLabel = getDealTypeLabel(deal.dealType);
                    const hasRealImage =
                        deal.image &&
                        !deal.image.endsWith('/pizza.jpg') &&
                        !deal.image.endsWith('pizza.jpg');

                    return (
                        <div
                            key={'menu-deal-' + deal.code}
                            className="fd-card"
                            onClick={() => handleDealClick(deal.code)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleDealClick(deal.code)}
                        >
                            <div className="fd-card__image-wrap">
                                {hasRealImage ? (
                                    <img
                                        src={deal.image}
                                        alt={deal.name}
                                        className="fd-card__image"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="fd-card__image-placeholder">
                                        🍕
                                    </div>
                                )}
                                <span className="fd-card__flex-badge">
                                    <FaTag size={9} className="me-1" /> DEAL
                                </span>
                                {typeLabel && (
                                    <span className="fd-card__type-badge">{typeLabel}</span>
                                )}
                            </div>

                            <div className="fd-card__body">
                                <h3 className="fd-card__name">{deal.name}</h3>
                                {deal.description ? (
                                    <p className="fd-card__desc">{deal.description}</p>
                                ) : deal.subtitle ? (
                                    <p className="fd-card__desc">{deal.subtitle}</p>
                                ) : null}

                                <div className="fd-card__footer">
                                    <div className="fd-card__price">
                                        {fromLabel && <span className="fd-card__price-label">from </span>}
                                        ${amount > 0 ? amount.toFixed(2) : '0.00'}
                                    </div>
                                    <button
                                        type="button"
                                        className="fd-card__cta"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDealClick(deal.code);
                                        }}
                                    >
                                        Customize & Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default FlexDealSelector;
