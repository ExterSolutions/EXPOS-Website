import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa";
import { Link } from "react-router-dom";
import fallbackImage from "../../../assets/images/default-pizza.jpg";
import { useTheme } from '../../../context/ThemeContext';

const PizzaCarousel = ({
    sectionSubTitle,
    sectionTitle,
    pizzas,
    redirectBase,
    type
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

        switch (productType) {
            case "dips":
                return "/dips";

            case "drinks":
                return "/drinks";

            case "sides":
                return "/sides";

            case "signature":
                return "/signaturepizza";

            case "other":
                return "/otherpizza";

            case "other":
            default:
                return `${redirectBase}/${item.code}`;
        }
    };
    return (
        <div className="section pizza-carousel-section pt-60">
            <div className="d-flex align-items-center justify-content-between pb-2">
                <div className="flex-grow-1 section-header">
                    <span
                        className="category-subtitle"
                        style={{ color: colors?.primary }}
                    >
                        {sectionSubTitle || "CHOOSE YOUR FLAVOR"}
                    </span>
                    <div className="section-title">{sectionTitle}</div>
                </div>
            </div>
            <div className="pizza-grid">
                {displayPizzas.map((item, index) => {
                    // let name = item?.pizzaName || item?.name || `Item ${index + 1}`;
                    let name =
                        item?.pizzaName ||
                        item?.dipsName ||
                        item?.name ||
                        `Item ${index + 1}`;
                    const image = item?.pizzaImage || item?.image;
                    const rating = parseFloat(item?.ratings) || 0;
                    const visitLink = getRedirectPath(item);
                   
                    return (
                        <div key={item.code || index}>
                            <Link to={visitLink} className="pizza-item">
                                <div className="pizza-image-container">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="pizza-image"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallbackImage;
                                        }}
                                    />
                                </div>
                                <div className="pizza-content">
                                    <div className="pizza-rating d-none">
                                        {[...Array(5)].map((_, i) => {
                                            const starValue = i + 1;
                                            if (rating >= starValue) {
                                                return (
                                                    <FaStar
                                                        key={i}
                                                        className="star"
                                                    />
                                                );
                                            } else if (
                                                rating >= starValue - 0.5 &&
                                                rating < starValue
                                            ) {
                                                return (
                                                    <FaStarHalf
                                                        key={i}
                                                        className="star"
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <FaRegStar
                                                        key={i}
                                                        className="star"
                                                    />
                                                );
                                            }
                                        })}
                                    </div>
                                    <h5 className="pizza-name">{name}</h5>
                                    <div className="product-description">
                                        {item?.description ||
                                            item?.dipsDescription ||
                                            item?.dipsDiscription}
                                    </div>
                                    <button
                                        type="button"
                                        title="Order Now"
                                        className="view-button"
                                    >
                                        Order Now
                                    </button>
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
