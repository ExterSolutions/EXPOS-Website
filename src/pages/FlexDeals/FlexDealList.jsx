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

// ── Deal type helpers — robust "not exclusively the other type" logic ─────────
//
// Instead of trying to enumerate every possible "both" value the admin might set
// (e.g. "both", "Both (Pickup & Delivery)", "all", "other", "all-type", ""),
// we simply check: is it NOT exclusively a pickup-only or delivery-only deal?
//
// Pickup   tab shows: anything that is NOT exclusively 'deliverydeal' / 'delivery'
// Delivery tab shows: anything that is NOT exclusively 'pickupdeal'  / 'pickup'

const PICKUP_ONLY   = ['pickupdeal', 'pickup'];
const DELIVERY_ONLY = ['deliverydeal', 'delivery'];

const isPickupDeal = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    return !DELIVERY_ONLY.includes(t);   // show unless it's delivery-ONLY
};

const isDeliveryDeal = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    return !PICKUP_ONLY.includes(t);     // show unless it's pickup-ONLY
};

// Badge — only show a label for exclusively pickup/delivery deals
const getDealTypeLabel = (dealType) => {
    const t = (dealType || '').toLowerCase().trim();
    if (PICKUP_ONLY.includes(t))   return '🏪 Pickup only';
    if (DELIVERY_ONLY.includes(t)) return '🚚 Delivery only';
    return null; // "Both" / "Other" — no badge needed
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
        // Use city from context, fallback to .env VITE_CITY_CODE, then null (fetch all)
        const cityCode = currentCity?.cityCode
            ?? currentCity?.code
            ?? import.meta.env.VITE_CITY_CODE
            ?? null;

        setLoading(true);
        setError(null);

        // Helper to parse both response shapes the API may return:
        //   { status: 200, data: [...] }  ← wrapped
        //   [...]                          ← direct array
        const parseList = (res) =>
            Array.isArray(res?.data) ? res.data
            : Array.isArray(res)     ? res
            : [];

        getFlexDeals(cityCode)
            .then(async (res) => {
                let list = parseList(res);
                // If cityCode gave empty results, retry without it — fetch everything
                if (list.length === 0 && cityCode) {
                    const fallback = await getFlexDeals(null).catch(() => null);
                    list = parseList(fallback);
                }
                setAllDeals(list);
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
