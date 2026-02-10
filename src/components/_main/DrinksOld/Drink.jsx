import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {GlobalContext} from "../../../context/GlobalContext";
import '../../../cardsui/cardsui.css';

const Drink = ({ data, cartFn }) => {
    const navigate = useNavigate();
    const globalctx = useContext(GlobalContext);

    const [cart, setCart] = globalctx.cart;
    const [settings] = globalctx.settings;
    const [currentStoreCode] = globalctx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;
    const user = useSelector((state) => state?.user);
    const [count, setCount] = useState(1);
    const [product, setProduct] = useState(null);
    const isJuice = data?.drinksType === "juice";

    const handleNavigate = () => {
        navigate(`/customize-drink/${data.softdrinkCode}`);
    };

    const countDec = () => {
        if (count > 1) setCount(prev => prev - 1);
    };

    const countInc = () => {
        if (count < 10) setCount(prev => prev + 1);
    };

    const handleAddToCart = () => {
        if (!currentStoreCode) {
            setShowStorePopup(true);
            return;
        }

        const totalPrice = Number(data.price) * count;

        const obj = {
            id: uuidv4(),
            customerCode: user?.data?.customerCode,
            cashierCode: "#NA",
            productCode: data.softdrinkCode,
            productName: data.softDrinksName,
            productType: "drink",
            config: {},
            price: Number(data.price).toFixed(2),
            quantity: count,
            amount: totalPrice.toFixed(2),
            taxPer: 0,
            pizzaSize: "",
            comments: "",
        };

        setProduct(obj);
        setCount(1);
    };

    useEffect(() => {
        cartFn?.createCart(setCart);
    }, [cartFn, setCart]);

    useEffect(() => {
        if (product) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            const pCode = ct?.product.find(p => p.productCode === product.productCode);

            if (pCode) {
                pCode.quantity += product.quantity;
                pCode.amount = (
                    Number(pCode.amount) + Number(product.amount)
                ).toFixed(2);
                cartFn.addCart(ct.product, setCart, true, settings);
            } else {
                ct.product.push(product);
                cartFn.addCart(ct.product, setCart, false, settings);
            }
        }
    }, [product, cartFn, setCart, settings]);

    return (
        <div className="pizza-item">
            <div className="pizza-image-container">
                <img
                    src={data?.image}
                    alt={data?.softDrinksName}
                    className="pizza-image"
                    loading="lazy"
                />
            </div>

            <div className="pizza-content">
                <h5 className="pizza-name">{data?.softDrinksName}</h5>

                {data?.description && (
                    <p className="card-desc-drink">{data.description}</p>
                )}

                <div className="card-price">
                    $ {Number(data?.price).toFixed(2)}
                </div>


                {isJuice ? (
                    <>
                        <div className="qty-controls">
                            <span className={`qty-btn minus ${count <= 1 ? "disabled" : ""}`} onClick={countDec}>-</span>
                            <span className="qty-value">{count}</span>
                            <span className={`qty-btn plus ${count >= 10 ? "disabled" : ""}`} onClick={countInc}>+</span>
                        </div>

                        <button
                            type="button"
                            className="view-button"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </>
                ) : (
                
                    <button
                        type="button"
                        className="customize-btn-drinks"
                        onClick={handleNavigate}
                    >
                        Customize
                    </button>
                )}
            </div>
        </div>
    );
};

export default Drink;
