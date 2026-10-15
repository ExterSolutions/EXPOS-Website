import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../../assets/styles/modern-cards.css';
import SafeImage from "../../common/SafeImage";
import fallbackImage from "../../../assets/images/default-pizza.jpg";
import { getAllIngredients } from "../../../services";
import SignatureModel from "./SignatureModal";

const hideCustomize = false;

function SignaturePizzas({ data, toppingsData }) {
    const [show, setShow] = useState(false);
    const [ingredients, setIngredients] = useState(null);
    const [count, setCount] = useState(1);
    const pizzaSizeRef = useRef(null);
    const navigate = useNavigate();

    const validPrices = (data?.pizza_prices || []).filter(
        price => parseFloat(price.price) > 0
    );

    const [selectedSize, setSelectedSize] = useState(
        validPrices[0]?.shortcode || ''
    );

    const countDec = () => {
        if (count > 1) setCount(c => c - 1);
    };

    const countInc = () => {
        if (count < 10) setCount(c => c + 1);
    };

    const handleClose = () => {
        setShow(false);
        const defaultCode = validPrices[0]?.shortcode || '';
        setSelectedSize(defaultCode);
        if (pizzaSizeRef.current) {
            pizzaSizeRef.current.value = defaultCode;
        }
        setCount(1);
    };

    const getIngredients = async () => {
        try {
            const res = await getAllIngredients();
            setIngredients(res?.data);
        } catch (err) {
            console.error("Error fetching ingredients:", err);
        }
    };

    const handleSides = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setShow(true);
    };

    const handleRedirect = () => {
        navigate(`/signaturepizza/${data?.code}`);
    };

    useEffect(() => {
        getIngredients();
    }, []);

    useEffect(() => {
        const first = (data?.pizza_prices || []).filter(
            p => parseFloat(p.price) > 0
        )?.[0]?.shortcode;
        if (first) {
            setSelectedSize(first);
            if (pizzaSizeRef.current) {
                pizzaSizeRef.current.value = first;
            }
        }
    }, [data]);

    const currentPriceObj = validPrices.find(p => p.shortcode === selectedSize) || validPrices[0];
    const displayPrice = currentPriceObj ? Number(currentPriceObj.price).toFixed(2) : null;

    return (
        <>
            <div className="mc-card">
                {/* Image */}
                <div className="mc-card__img-wrap">
                    {data?.pizza_subtitle && (
                        <span className="mc-card__badge">
                            {data.pizza_subtitle}
                        </span>
                    )}
                    <SafeImage
                        src={data?.pizza_image}
                        alt={data?.pizza_name}
                        className="mc-card__img"
                        fallback={fallbackImage}
                    />
                </div>

                {/* Body */}
                <div className="mc-card__body">
                    <h5 className="mc-card__name">{data?.pizza_name}</h5>

                    {data?.description && (
                        <p className="mc-card__desc">{data.description}</p>
                    )}

                    {displayPrice && (
                        <div className="mc-card__price">${displayPrice}</div>
                    )}

                    {/* Size Selector */}
                    {validPrices.length > 1 && (
                        <div className="mc-card__variant-wrap">
                            <span className="mc-card__variant-label">Select Size</span>
                            <select
                                className="mc-card__select"
                                ref={pizzaSizeRef}
                                value={selectedSize}
                                onChange={(e) => {
                                    setSelectedSize(e.target.value);
                                    if (pizzaSizeRef.current) {
                                        pizzaSizeRef.current.value = e.target.value;
                                    }
                                }}
                                aria-label={`Select size for ${data?.pizza_name}`}
                            >
                                {validPrices.map((price) => (
                                    <option key={price.shortcode} value={price.shortcode}>
                                        {price.size} — ${Number(price.price).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {validPrices.length === 1 && (
                        <select
                            style={{ display: "none" }}
                            ref={pizzaSizeRef}
                            value={validPrices[0].shortcode}
                            readOnly
                        >
                            <option value={validPrices[0].shortcode}>
                                {validPrices[0].size}
                            </option>
                        </select>
                    )}

                    {/* Footer */}
                    <div className="mc-card__footer mc-card__footer--pizza">
                        <div className="mc-card__qty" style={{ userSelect: "none" }}>
                            <button
                                type="button"
                                className={`mc-card__qty-btn${count <= 1 ? " disabled" : ""}`}
                                onClick={countDec}
                                aria-label="Decrease quantity"
                            >−</button>
                            <span className="mc-card__qty-val">{count}</span>
                            <button
                                type="button"
                                className={`mc-card__qty-btn${count >= 10 ? " disabled" : ""}`}
                                onClick={countInc}
                                aria-label="Increase quantity"
                            >+</button>
                        </div>

                        <div className="mc-card__btn-group">
                            <button
                                type="button"
                                className="mc-card__add"
                                onClick={handleSides}
                                title="Add to Cart"
                            >
                                Add
                            </button>
                            {!hideCustomize && (
                                <button
                                    type="button"
                                    className="mc-card__add mc-card__add--outline"
                                    onClick={handleRedirect}
                                >
                                    Customize
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Modal */}
            {show && (
                <SignatureModel
                    show={show}
                    handleClose={handleClose}
                    data={data}
                    ing={ingredients}
                    toppingsData={toppingsData}
                    pizzaSize={selectedSize}
                    pizzaQuantity={count}
                />
            )}
        </>
    );
}

export default SignaturePizzas;
