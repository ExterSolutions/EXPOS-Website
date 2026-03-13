import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIngredients } from "../../../services";
import SignatureModel from "./SignatureModal";

const hideCustomize = false;

function SignaturePizzas({ data, toppingsData, ingredients }) {
    const [show, setShow] = useState(false);
    const pizzaQuantityRef = useRef(null);
    const pizzaSizeRef = useRef(null);
    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
        if (pizzaSizeRef.current) {
            pizzaSizeRef.current.value = data?.pizza_prices.filter(price => price.price > 0)?.[0]?.shortcode;
        }
        if (pizzaQuantityRef.current) {
            pizzaQuantityRef.current.value = 1;
        }
    };

    const handleSides = (e) => {
        e.preventDefault();
        setShow(true);
    };

    const handleRedirect = () => {
        navigate(`/signaturepizza/${data?.code}`);
    };

    const handleLinkClick = (e) => {
        if (
            e.target.tagName === "SELECT" ||
            e.target.tagName === "OPTION" ||
            e.target.classList.contains("btn-add-to-cart")
        ) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    useEffect(() => {
        if (pizzaSizeRef.current) {
            pizzaSizeRef.current.value = data?.pizza_prices.filter(price => price.price > 0)?.[0]?.shortcode;
        }
    }, [data]);

    return (
        <>
            <div className="pizza-item" onClick={handleLinkClick}>
                {/* Circular Image */}
                <div className="pizza-image-container">

                    {data?.pizza_subtitle && (
                        <span className="pizza-badge">
                            {data.pizza_subtitle}
                        </span>)}

                    <img
                        src={data?.pizza_image}
                        alt={data?.pizza_name}
                        className="pizza-image"
                        loading="lazy" />
                </div>

                {/* Card Content */}
                <div className="pizza-content">


                    <h5 className="pizza-name">{data?.pizza_name}</h5>


                    <div className="product-description">
                        {data?.description || ""}
                    </div>

                    {/* Size & Quantity */}
                    <div className="d-flex flex-col sm-flex-row gap-2">
                        <div className="flex-fill-1">
                            <select className="form-select" ref={pizzaSizeRef}>
                                {data?.pizza_prices
                                    ?.filter(price => parseFloat(price.price) > 0)
                                    ?.map(price => (
                                        <option key={price.shortcode} value={price.shortcode}>
                                            {price.size} - ${price.price}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <select className="form-select" ref={pizzaQuantityRef}>
                                {[...Array(10).keys()].map(num => (
                                    <option key={num + 1} value={num + 1}>
                                        {num + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex gap-2 flex-row">
                        <button type="button" className="view-button-new" onClick={handleSides}>
                            Add to Cart
                        </button>
                        {
                            !hideCustomize && (
                                <button type="button" className="customize-btn-new" onClick={handleRedirect}>
                                    Customize
                                </button>
                            )
                        }
                    </div>

                </div>
            </div>

            {/* Signature Modal */}
            {show && pizzaSizeRef.current && (
                <SignatureModel
                    show={show}
                    handleClose={handleClose}
                    data={data}
                    ing={ingredients}
                    toppingsData={toppingsData}
                    pizzaSize={pizzaSizeRef.current.value}
                    pizzaQuantity={pizzaQuantityRef.current.value}
                />
            )}
        </>
    );
}

export default SignaturePizzas;
