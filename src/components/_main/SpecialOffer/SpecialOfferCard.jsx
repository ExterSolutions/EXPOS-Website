import { useNavigate } from "react-router-dom";

function SpecialOfferCard({ data, colors, basePath = "/specialoffer" }) {
    const navigate = useNavigate();

    const handleLinkClick = (e, productCode) => {
        e.preventDefault();
        if (!productCode) return;
        navigate(`${basePath}/${productCode}`);
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

                {/* {data?.pizza_prices?.length > 0 && (
                    <select className="form-select mb-3">
                        {data.pizza_prices.filter(p => parseFloat(p.price) > 0).map(p => (
                            <option value={p.shortcode} key={p.shortcode}>
                                {p.size} - ${p.price}
                            </option>
                        ))}
                    </select>
                )} */}

                {/* Container for Price (Left) and Button (Right) */}
                <div
                    className="d-flex align-items-center justify-content-between mt-3"
                    style={{ width: '100%' }}
                >
                    {/* Price - Now on the left */}
                    <div
                        className="pizza-price d-flex flex-column"
                        style={{
                            fontWeight: '700',
                            color: 'var(--secondary)',
                            fontSize: '1.3rem',
                            lineHeight: '1.2',
                            flexShrink: 0
                        }}
                    >

                        <span
                            className="text-decoration-line-through"
                            style={{
                                fontSize: '0.8rem',
                                color: '#000000ff',
                                fontWeight: '500'
                            }}
                        >
                            Starts From
                        </span>
                        <span>
                            ${data?.pizza_prices?.find(p => parseFloat(p.price) > 0)?.price || data?.price || '0.00'}
                        </span>

                        {/* Down Side: Discounted/Old Price */}

                    </div>

                    {/* Button - Now on the right */}
                    <button
                        type="button"
                        className="view-button"
                        style={{ margin: 0, width: 'auto', padding: '8px 20px' }}
                        onClick={(e) => handleLinkClick(e, data?.code ?? "")}
                    >
                        Customize
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SpecialOfferCard;