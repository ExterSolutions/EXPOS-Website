import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PopulerModel from "./PupulerModel";
import { getAllIngredients } from "../../services";

const hideCustomize = false;

function Pupuler({ data, toppingsData, ingredients }) {
    const [show, setShow] = useState(false);
    const pizzaQuantityRef = useRef(null);
    const pizzaSizeRef = useRef(null);
    const navigate = useNavigate();


    const handleClose = () => {
        setShow(false);
        if (pizzaSizeRef.current) {
            pizzaSizeRef.current.value = data?.pizza_prices.filter((price) => price.price > 0)?.[0]?.shortcode;
        }
        if (pizzaQuantityRef.current) {
            pizzaQuantityRef.current.value = 1;
        }
    };

    const handleSides = (e) => {
        e.preventDefault();
        setShow(true);
    };

    const handleRedirect = (e) => {
        navigate(`/popular/${data?.code}`);
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
            pizzaSizeRef.current.value = data?.pizza_prices.filter((price) => price.price > 0)?.[0]?.shortcode;
        }
    }, [data]);

    const hasPrices = data?.pizza_prices && data.pizza_prices.length > 0;

    return (
        <>
            <Link to={`/popular/${data?.code}`} onClick={handleLinkClick}>
                <div className="grid-card-placeholder">
                    <div className="grid-top-container relative">
                        <img
                            src={data?.pizzaImage || data?.image}
                            alt={data?.pizzaName || data?.name}
                            className="bestseller-placeholder"
                        />
                    </div>
                    <div className="grid-card-detail">
                        <div className="pizzaTitleDiv">
                            <div className="pizzaTitle">
                                <h5 className="pizza-name">
                                    {data?.pizzaName || data?.name}
                                </h5>
                            </div>
                        </div>
                        <div className="pizzaSubTitleDiv">
                            <div className="pizzaSubTitle">
                                <p className="mb-1 text-decoration-none panjabi-subtitle">
                                    {data?.pizzaSubtitle ? data.pizzaSubtitle : <>&nbsp;</>}
                                </p>
                            </div>
                        </div>
                        {hasPrices && (
                            <div className="grid-card-pizzasize d-flex align-items-center flex-row-reverse gap-2">
                                <select className="panjabi-select form-select qtySelect" ref={pizzaQuantityRef}>
                                    {[...Array(10).keys()].map((num) => (
                                        <option key={num + 1} value={num + 1}>
                                            {num + 1}
                                        </option>
                                    ))}
                                </select>
                                <select className="w-100 pizzaPriceSelect panjabi-select form-select" ref={pizzaSizeRef}>
                                    {data?.pizza_prices
                                        ?.filter((price) => parseFloat(price.price) > 0)
                                        ?.map((price) => (
                                            <option value={price.shortcode} key={price.shortcode}>
                                                {price.size} - $ {price.price}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}
                        {hideCustomize ? (
                            <div className="inner-div">
                                <button className="btn-add-to-cart signaturemenu-button mt-3" onClick={handleSides}>
                                    Add to Cart
                                </button>
                            </div>
                        ) : (
                            <div className="row g-0 d-flex justify-content-between button-div">
                                <div className="col-12 col-sm-6 m-0 p-0 text-center text-sm-start">
                                    <button className="btn-add-to-cart signaturemenu-button" onClick={handleSides}>
                                        Add to Cart
                                    </button>
                                </div>
                                <div className="col-12 col-sm-6 m-0 p-0 text-center text-sm-end">
                                    <button className="btn-add-to-cart signaturemenu-button-customize" onClick={handleRedirect}>
                                        Customize
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
            {show && pizzaSizeRef.current && (
                <PopulerModel
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

export default Pupuler;