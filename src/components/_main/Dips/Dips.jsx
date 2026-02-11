
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import '../../../../src/cardsui/cardsui.css';
import {GlobalContext} from "../../../context/GlobalContext";

function Dips({ data, cartFn }) {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [settings] = globalctx.settings;
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;

    const [count, setCount] = useState(1);
    const [product, setProduct] = useState(null);

    const user = useSelector((state) => state?.user);

    const countDec = () => {
        if (count > 1) setCount(prev => prev - 1);
    };

    const countInc = () => {
        if (count < 10) setCount(prev => prev + 1);
    };

    const handleDips = (e) => {
        e.preventDefault();
        // alert(currentStoreCode)
        if (currentStoreCode === undefined || currentStoreCode === null) {
            setShowStorePopup(true);
            return;
        }
        const totalPrice = data?.price * count;
        const obj = {
            id: uuidv4(),
            customerCode: user?.data?.customerCode,
            cashierCode: "#NA",
            productCode: data.dipsCode,
            productName: data.dipsName,
            productType: "dips",
            config: {},
            price: Number(data.price).toFixed(2),
            quantity: count,
            amount: Number(totalPrice).toFixed(2),
            taxPer: 0,
            pizzaSize: "",
            comments: "",
        };
        setProduct(obj);
        setCount(1);
    };

    useEffect(() => {
        cartFn.createCart(setCart);
    }, [cartFn, setCart]);

    useEffect(() => {
        if (product !== null) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            const pCode = ct?.product.find(p => p.productCode === product.productCode);
            if (pCode) {
                ct?.product.forEach(item => {
                    if (item.productCode === pCode.productCode) {
                        pCode.quantity += product.quantity;
                        pCode.amount = Number(pCode.amount) + Number(product.amount);
                    }
                });
                cartFn.addCart(ct.product, setCart, true, settings);
            } else {
                ct.product.push(product);
                cartFn.addCart(ct.product, setCart, false, settings);
            }
        }
    }, [product, cartFn, setCart, settings]);

    return (
        <div className="pizza-item">
            {/* Image */}
            <div className="pizza-image-container">
                <img
                    src={data?.image}
                    alt={data?.dipsName}
                    className="pizza-image"
                    loading="lazy" />
            </div>
            <div className="pizza-content">
                <h5 className="pizza-name">{data?.dipsName}</h5>
                <div className="product-description">
                    {data?.description}
                </div>

                <div className="card-price">${Number(data?.price).toFixed(2)}</div>

                {/* Quantity Controls */}
                <div className="qty-controls">
                    <span className={`qty-btn minus ${count <= 1 ? "disabled" : ""}`} onClick={countDec}>-</span>
                    <span className="qty-value ">{count}</span>
                    <span className={`qty-btn plus ${count >= 10 ? "disabled" : ""}`} onClick={countInc}>+</span>
                </div>

                {/* Add to Cart */}
                <button type="button" className="view-button" onClick={handleDips}>Add to Cart</button>
            </div>
        </div>
    );
}

export default Dips;
