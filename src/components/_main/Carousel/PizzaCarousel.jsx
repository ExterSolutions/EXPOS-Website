import { Link } from "react-router-dom";
import fallbackImage from "../../../assets/images/default-pizza.jpg";
import { useTheme } from '../../../context/ThemeContext';

const PizzaCarousel = ({
    sectionSubTitle,
    sectionTitle,
    pizzas,
    redirectBase,
    type,
    showBestSelling = false,
    viewAllLink = null,
    layout = 'grid',   // 'grid' | 'horizontal'
}) => {

    const { theme, colors } = useTheme();
    if (!pizzas || !Array.isArray(pizzas) || pizzas.length === 0) {
        return (
            <div className="section pizza-carousel-section">
                {/* No pizzas available */}
            </div>
        );
    }

    const displayPizzas = pizzas.slice(0, layout === 'horizontal' ? 14 : 8);

    const getRedirectPath = (item) => {
        const productType = item?.productType;
        const code = item?.code;
        switch (productType) {
            case "signature": return code ? `/signaturepizza/${code}` : "/signaturepizza";
            case "special":   return code ? `${redirectBase}/${code}` : redirectBase;
            case "flex":      return code ? `/flex-deals/${code}` : "/flex-deals";
            case "other":     return code ? `/otherpizza/${code}` : "/otherpizza";
            case "sides":   return "/sides";
            case "dips":    return "/dips";
            case "drinks":  return "/drinks";
            default:        return code ? `${redirectBase}/${code}` : redirectBase;
        }
    };

    // ── Grid inline styles ────────────────────────────────────────────────────
    const gridStyle = layout === 'horizontal'
        ? {
            display: 'grid',
            gap: '0.55rem',
            gridAutoRows: 'auto',          // auto height — no clipping
            alignItems: 'stretch',
            justifyItems: 'stretch',
            paddingBottom: '1.5rem',
            width: '100%',
        }
        : {
            display: 'grid',
            gap: '0.75rem',
            gridAutoRows: '290px',         // fixed height for grid tiles
            alignItems: 'stretch',
            justifyItems: 'stretch',       // override style.css justify-items:center
            paddingBottom: '2rem',
            width: '100%',
        };

    return (
        <div className={`section pizza-carousel-section pc-modern pt-60${layout === 'horizontal' ? ' pc-horizontal' : ''}`}>
            <div className="container">
                <div className="pb-2">
                    {/* Subtitle sits alone on its own line */}
                    <span
                        className="category-subtitle"
                        style={{ color: colors?.primary, display: 'block', marginBottom: '2px' }}
                    >
                        {sectionSubTitle || "CHOOSE YOUR FLAVOR"}
                    </span>

                    {/* Title row — "Best Sellers" title + badge + "View All" all share one flex line */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                            <div className="section-title" style={{ margin: 0 }}>{sectionTitle}</div>
                            {showBestSelling && (
                                <span className="best-selling-badge">🏆 Best Sellers</span>
                            )}
                        </div>
                        {viewAllLink && (
                            <Link
                                to={viewAllLink}
                                style={{
                                    flexShrink: 0,
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: colors?.primary,
                                    border: `1.5px solid ${colors?.primary}`,
                                    borderRadius: '2rem',
                                    padding: '0.28rem 0.75rem',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    lineHeight: 1.5,
                                }}
                            >
                                View All →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="pizza-grid" style={gridStyle}>
                {displayPizzas.map((item, index) => {
                    let name =
                        item?.pizzaName ||
                        item?.dipsName ||
                        item?.name ||
                        `Item ${index + 1}`;
                    const image = item?.pizzaImage || item?.image;
                    const rawPrice = item?.displayPrice ?? item?.pizza_prices?.[0]?.price ?? item?.combination?.[0]?.price ?? item?.price ?? null;
                    const price = rawPrice !== null && rawPrice !== undefined ? rawPrice : null;
                    const visitLink = getRedirectPath(item);
                    const description = item?.description || item?.dipsDescription || item?.dipsDiscription;

                    // ── HORIZONTAL CARD (Option A) ────────────────────────────
                    if (layout === 'horizontal') {
                        return (
                            <Link
                                key={item.code || index}
                                to={visitLink}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'stretch',
                                    background: '#ffffff',
                                    borderRadius: '0.875rem',
                                    border: '1.5px solid #e8edf4',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    overflow: 'hidden',
                                    transition: 'box-shadow 0.18s, border-color 0.18s, transform 0.18s',
                                    WebkitTapHighlightColor: 'transparent',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,53,0.16)';
                                    e.currentTarget.style.borderColor = '#ff6b35';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)';
                                    e.currentTarget.style.borderColor = '#e8edf4';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Thumbnail — square, left side */}
                                <div style={{
                                    width: '96px',
                                    minWidth: '96px',
                                    background: 'linear-gradient(135deg, #fff8f5, #fdeee6)',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                }}>
                                    <img
                                        src={image}
                                        alt={name}
                                        loading="lazy"
                                        onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                            minHeight: '96px',
                                        }}
                                    />
                                </div>

                                {/* Content — right side */}
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '0.65rem 0.75rem 0.65rem 0.7rem',
                                    minWidth: 0,
                                    gap: '0.4rem',
                                }}>
                                    {/* Deal name — full text, wraps freely, no truncation */}
                                    <div style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        lineHeight: 1.35,
                                        letterSpacing: '-0.01em',
                                    }}>
                                        {name}
                                    </div>

                                    {/* Footer: price + CTA */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '0.5rem',
                                        marginTop: 'auto',
                                    }}>
                                        {price !== null && Number(price) > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: '1px' }}>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>From</span>
                                                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ff6b35', letterSpacing: '-0.02em' }}>
                                                    ${Number(price).toFixed(2)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div />
                                        )}
                                        <button
                                            type="button"
                                            style={{
                                                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '0.55rem',
                                                padding: '0.38rem 0.8rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                                letterSpacing: '0.01em',
                                            }}
                                        >
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        );
                    }

                    // ── GRID CARD (existing vertical tile) ──────────────────
                    return (
                        <div
                            key={item.code || index}
                            className="pizza-card-wrapper"
                            style={{
                                display: 'flex',
                                width: '100%',
                                maxWidth: 'unset',
                                height: '100%',
                                margin: 0,
                            }}
                        >
                            <Link
                                to={visitLink}
                                className="pizza-card-modern"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                }}
                            >
                                <div
                                    className="pizza-card-img-area"
                                    style={{ height: '150px', flexShrink: 0 }}
                                >
                                    {showBestSelling && index < 3 && (
                                        <span className="pizza-card-badge">🔥 Popular</span>
                                    )}
                                    <img
                                        src={image}
                                        alt={name}
                                        className="pizza-card-img"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallbackImage;
                                        }}
                                    />
                                </div>
                                <div
                                    className="pizza-card-body"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                        overflow: 'hidden',
                                        padding: '0.8rem 0.9rem 0.9rem',
                                        minHeight: 0,
                                    }}
                                >
                                    <h5 className="pizza-card-name">{name}</h5>
                                    <p
                                        className="pizza-card-desc"
                                        style={{
                                            minHeight: '2.17rem',
                                            flex: '0 0 auto',
                                            margin: '0 0 0.5rem',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {description || ''}
                                    </p>
                                    <div className="pizza-card-footer" style={{ marginTop: 'auto' }}>
                                        {price !== null && Number(price) > 0 ? (
                                            <div className="pizza-card-price-group">
                                                <span className="pizza-card-price-label">From</span>
                                                <span className="pizza-card-price">${Number(price).toFixed(2)}</span>
                                            </div>
                                        ) : (
                                            <div className="pizza-card-price-group" />
                                        )}
                                        <button
                                            type="button"
                                            className="pizza-card-order-btn"
                                        >
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default PizzaCarousel;
