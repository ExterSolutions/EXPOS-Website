import { useNavigate } from "react-router-dom";

function SpecialOfferCard({ data }) {
    const navigate = useNavigate();

    const handleLinkClick = (e, productCode) => {
        e.preventDefault();
        if (productCode === "") {
            return;
        }
        navigate(`/specialoffer/${productCode}`);
    };

    return (
        <div className="pizza-item">
            {/* Image */}
            <div className="pizza-image-container">
                <img src={data?.image} alt={data?.name} className="pizza-image" />
            </div>
            {/* Content */}
            <div className="pizza-content">
                <h5 className="pizza-name">{data?.name}</h5>

                {data?.subtitle && <p className="card-subtitle">{data.subtitle}</p>}

                <div className="product-description">
                    {data?.description}
                </div>

                {data?.pizza_prices?.length > 0 && (
                    <select className="form-select">
                        {data.pizza_prices.filter(p => parseFloat(p.price) > 0).map(p => (
                            <option value={p.shortcode} key={p.shortcode}>
                                {p.size} - ${p.price}
                            </option>
                        ))}
                    </select>
                )}

                {/* Button */}
                <button type="button" className="view-button" onClick={(e) => handleLinkClick(e, data?.code ?? "")}>
                    Customize
                </button>
            </div>
        </div>
    );
}

export default SpecialOfferCard;
