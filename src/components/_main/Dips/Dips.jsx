import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import '../../../assets/styles/modern-cards.css';
import SafeImage from "../../common/SafeImage";
import dipsFallback from '../../../assets/images/download/new/cat/dips.png';
import { GlobalContext } from "../../../context/GlobalContext";

function Dips({ data, cartFn }) {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [settings] = globalctx.settings;
    const [currentStoreCode] = globalctx.currentStoreCode;
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
        if (e && e.preventDefault) e.preventDefault();
        if (currentStoreCode === undefined || currentStoreCode === null) {
            setShowStorePopup(true);
            return;
        }
        const totalPrice = Number(data?.price || 0) * count;
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
        <div className="mc-card">
            {/* Image */}
            <div className="mc-card__img-wrap mc-card__img-wrap--contain">
                <SafeImage
                    src={data?.image}
                    alt={data?.dipsName}
                    className="mc-card__img mc-card__img--contain"
                    fallback={dipsFallback}
                />
            </div>

            {/* Body */}
            <div className="mc-card__body">
                <h5 className="mc-card__name">{data?.dipsName}</h5>
                {data?.description && (
                    <p className="mc-card__desc">{data.description}</p>
                )}

                <div className="mc-card__price">
                    ${Number(data?.price || 0).toFixed(2)}
                </div>

                {/* Footer */}
                <div className="mc-card__footer">
                    <div className="mc-card__qty" style={{ userSelect: 'none' }}>
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

                    <button
                        type="button"
                        className="mc-card__add"
                        onClick={handleDips}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dips;
