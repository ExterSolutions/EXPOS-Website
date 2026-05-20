/**
 * FlexDealList.jsx
 *
 * Fetches ALL deals once (no deliveryType filter sent to API).
 * Filters client-side so:
 *   Pickup tab   → pickupdeal + other
 *   Delivery tab → deliverydeal + other
 */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/_main/Header/Header';
import Footer from '../../components/_main/Footer';
import PageSEO from '../../components/_main/PageSEO';
import { GlobalContext } from '../../context/GlobalContext';
import { getFlexDeals } from '../../services';
import '../../assets/styles/flex-deals.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

// Deals visible under BOTH pickup and delivery tabs
const isOtherDeal = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    return t === 'other' || t === 'all' || t === 'all-type' || t === 'both' || t === '';
};

const isPickupDeal = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    return t === 'pickupdeal' || t === 'pickup' || isOtherDeal(t);
};

const isDeliveryDeal = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    return t === 'deliverydeal' || t === 'delivery' || isOtherDeal(t);
};

// Badge label — "Other" deals show no badge (visible for both)
const getDealTypeLabel = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    if (t === 'pickupdeal' || t === 'pickup') return '🏪 Pickup only';
    if (t === 'deliverydeal' || t === 'delivery') return '🚚 Delivery only';
    return null;
};

const getDisplayPrice = (deal) => {
    const validPrices = (deal.pizza_prices ?? []).filter(p => Number(p.price) > 0);
    if (deal.has_pizza_group && validPrices.length > 0) {
        return {
            amount: Math.min(...validPrices.map(p => Number(p.price))),
            fromLabel: validPrices.length > 1,
        };
    }
    return { amount: Number(deal.price ?? 0), fromLabel: false };
};

// ── Deal Card ─────────────────────────────────────────────────────────────────

const FlexDealCard = ({ deal, onClick }) => {
    const { amount, fromLabel } = getDisplayPrice(deal);
    const typeLabel = getDealTypeLabel(deal.dealType);

    const hasRealImage =
        deal.image &&
        !deal.image.endsWith('/pizza.jpg') &&
        !deal.image.endsWith('pizza.jpg');

    return (
        <div
            className="fd-card"
            onClick={() => onClick(deal.code)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick(deal.code)}
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
                        {deal.has_pizza_group ? '🍕' : '🎉'}
                    </div>
                )}
                <span className="fd-card__flex-badge">FLEX</span>
                {typeLabel && <span className="fd-card__type-badge">{typeLabel}</span>}
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
                        ${amount.toFixed(2)}
                    </div>
                    <button
                        className="fd-card__cta"
                        onClick={(e) => { e.stopPropagation(); onClick(deal.code); }}
                    >
                        Customize
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const FlexDealList = () => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [currentCity] = globalCtx.currentCity;
    const [selectedType, setSelectedType] = globalCtx.selectedType;

    const [allDeals, setAllDeals] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    // Fetch ALL deals without deliveryType param — filter client-side
    // This ensures "Other" deals always appear in both tabs
    useEffect(() => {
        const cityCode = currentCity?.cityCode ?? currentCity?.code ?? null;
        setLoading(true);
        setError(null);
        getFlexDeals(cityCode)          // ← no deliveryType sent
            .then((res) => {
                if (res?.status === 200 && Array.isArray(res.data)) {
                    setAllDeals(res.data);
                } else {
                    setAllDeals([]);
                }
            })
            .catch((err) => {
                console.error('FlexDealList fetch error:', err);
                setError('Unable to load deals. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [currentCity]); // re-fetch only on city change, NOT on tab switch

    // Client-side filter:
    //   Pickup   → pickupdeal + other
    //   Delivery → deliverydeal + other
    const deals = allDeals.filter(deal =>
        selectedType === 'delivery'
            ? isDeliveryDeal(deal.dealType)
            : isPickupDeal(deal.dealType)
    );

    const handleCardClick = (dealCode) => navigate(`/flex-deals/${dealCode}`);

    const handleTypeSwitch = (type) => {
        setSelectedType(type);
        localStorage.setItem('selectedType', type);
    };

    const emptyMsg = selectedType === 'delivery'
        ? 'No delivery deals available right now. Check back soon!'
        : 'No pickup deals available right now. Check back soon!';

    return (
        <div className="fd-page">
            <PageSEO pageKey="flexDeals" />
            <Header />
            <div className="nav-margin" />

            <div className="container">
                {/* Section Header */}
                <div className="fd-section-header">
                    <h1 className="fd-section-title">Flex Deals</h1>
                    {!loading && !error && deals.length > 0 && (
                        <span className="fd-section-badge">
                            🔥 {deals.length} deal{deals.length !== 1 ? 's' : ''} available
                        </span>
                    )}
                </div>

                {/* Order-type switcher */}
                <div className="fd-type-switcher" role="group" aria-label="Order type">
                    <button
                        id="fd-type-pickup"
                        className={`fd-type-btn ${selectedType !== 'delivery' ? 'fd-type-btn--active' : ''}`}
                        onClick={() => handleTypeSwitch('pickup')}
                    >
                        🏪 Pickup
                    </button>
                    <button
                        id="fd-type-delivery"
                        className={`fd-type-btn ${selectedType === 'delivery' ? 'fd-type-btn--active' : ''}`}
                        onClick={() => handleTypeSwitch('delivery')}
                    >
                        🚚 Delivery
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="fd-spinner-wrap">
                        <div className="fd-spinner" aria-label="Loading deals…" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="fd-empty">
                        <span className="fd-empty__icon">⚠️</span>
                        <p className="fd-empty__text">{error}</p>
                    </div>
                )}

                {/* No deals for this tab */}
                {!loading && !error && deals.length === 0 && (
                    <div className="fd-empty">
                        <span className="fd-empty__icon">🎉</span>
                        <p className="fd-empty__text">{emptyMsg}</p>
                        <button
                            className="fd-type-btn fd-type-btn--active"
                            style={{ marginTop: 12 }}
                            onClick={() => handleTypeSwitch(selectedType === 'delivery' ? 'pickup' : 'delivery')}
                        >
                            View {selectedType === 'delivery' ? '🏪 Pickup' : '🚚 Delivery'} deals instead
                        </button>
                    </div>
                )}

                {/* Deal Grid */}
                {!loading && !error && deals.length > 0 && (
                    <div className="fd-grid">
                        {deals.map((deal) => (
                            <FlexDealCard key={deal.code} deal={deal} onClick={handleCardClick} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlexDealList;
