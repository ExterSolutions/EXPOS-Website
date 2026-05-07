/**
 * FlexDealList.jsx
 *
 * Entirely separate V3 Flex Deals listing page.
 * Fetches from GET /api/v3/deals (showOnClient=1 filter is backend-enforced).
 * No overlap with existing Special Offers or Toppings Deals flows.
 */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/_main/Header/Header';
import Footer from '../../components/_main/Footer';
import { GlobalContext } from '../../context/GlobalContext';
import { getFlexDeals } from '../../services';
import '../../assets/styles/flex-deals.css';

// ── Helpers ──────────────────────────────────────────────────────────────────

const getDealTypeLabel = (dealType) => {
    if (dealType === 'pickupdeal') return '🏪 Pickup only';
    if (dealType === 'deliverydeal') return '🚚 Delivery only';
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

// ── Deal Card ────────────────────────────────────────────────────────────────

const FlexDealCard = ({ deal, onClick }) => {
    const { amount, fromLabel } = getDisplayPrice(deal);
    const typeLabel = getDealTypeLabel(deal.dealType);

    const hasRealImage =
        deal.image &&
        !deal.image.endsWith('/pizza.jpg') &&
        !deal.image.endsWith('pizza.jpg');

    return (
        <div className="fd-card" onClick={() => onClick(deal.code)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick(deal.code)}>
            {/* Image */}
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

            {/* Body */}
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
                    <button className="fd-card__cta" onClick={(e) => { e.stopPropagation(); onClick(deal.code); }}>
                        Customize
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const FlexDealList = () => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [currentCity] = globalCtx.currentCity;

    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cityCode = currentCity?.cityCode ?? currentCity?.code ?? null;
        setLoading(true);
        setError(null);
        getFlexDeals(cityCode)
            .then((res) => {
                if (res?.status === 200 && Array.isArray(res.data)) {
                    setDeals(res.data);
                } else {
                    setDeals([]);
                }
            })
            .catch((err) => {
                console.error('FlexDealList fetch error:', err);
                setError('Unable to load deals. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [currentCity]);

    const handleCardClick = (dealCode) => {
        navigate(`/flex-deals/${dealCode}`);
    };

    return (
        <div className="fd-page">
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

                {/* Empty */}
                {!loading && !error && deals.length === 0 && (
                    <div className="fd-empty">
                        <span className="fd-empty__icon">🎉</span>
                        <p className="fd-empty__text">No Flex Deals available right now. Check back soon!</p>
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
