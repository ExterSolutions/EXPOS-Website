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
}) => {

    const { theme, colors } = useTheme();
    if (!pizzas || !Array.isArray(pizzas) || pizzas.length === 0) {
        return (
            <div className="section pizza-carousel-section">
                {/* No pizzas available */}
            </div>
        );
    }

    const displayPizzas = pizzas.slice(0, 8);

    const getRedirectPath = (item) => {
        const productType = item?.productType;
        const code = item?.code;
        switch (productType) {
            // Direct item pages (have /:sid route)
            case "signature": return code ? `/signaturepizza/${code}` : "/signaturepizza";
            case "special":   return code ? `${redirectBase}/${code}` : redirectBase;
            case "other":     return code ? `/otherpizza/${code}` : "/otherpizza";
            // List pages only (no individual item route)
            case "sides":   return "/sides";
            case "dips":    return "/dips";
            case "drinks":  return "/drinks";
            default:        return code ? `${redirectBase}/${code}` : redirectBase;
        }
    };

    return (
        <div className="section pizza-carousel-section pt-60">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between pb-2">
                    <div className="flex-grow-1 section-header">
                        <span
                            className="category-subtitle"
                            style={{ color: colors?.primary }}
                        >
                            {sectionSubTitle || "CHOOSE YOUR FLAVOR"}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                            <div className="section-title">{sectionTitle}</div>
                            {showBestSelling && (
                                <span className="best-selling-badge">🏆 Best Sellers</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="pizza-grid">
                {displayPizzas.map((item, index) => {
                    let name =
                        item?.pizzaName ||
                        item?.dipsName ||
                        item?.name ||
                        `Item ${index + 1}`;
                    const image = item?.pizzaImage || item?.image;
                    // Use per-type displayPrice if set, then fall back to common fields
                    const rawPrice = item?.displayPrice ?? item?.pizza_prices?.[0]?.price ?? item?.combination?.[0]?.price ?? item?.price ?? null;
                    const price = rawPrice !== null && rawPrice !== undefined ? rawPrice : null;
                    const visitLink = getRedirectPath(item);
                    const description = item?.description || item?.dipsDescription || item?.dipsDiscription;

                    return (
                        <div key={item.code || index} className="pizza-card-wrapper">
                            <Link to={visitLink} className="pizza-card-modern">
                                {/* Image area */}
                                <div className="pizza-card-img-area">
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
                                {/* Content area */}
                                <div className="pizza-card-body">
                                    <h5 className="pizza-card-name">{name}</h5>
                                    {description && (
                                        <p className="pizza-card-desc">{description}</p>
                                    )}
                                    <div className="pizza-card-footer">
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
