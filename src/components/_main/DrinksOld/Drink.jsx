import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "../../../context/GlobalContext";
import '../../../assets/styles/modern-cards.css';
import SafeImage from "../../common/SafeImage";

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

    const countDec = () => { if (count > 1) setCount(c => c - 1); };
    const countInc = () => { if (count < 10) setCount(c => c + 1); };

    const handleNavigate = () => navigate(`/customize-drink/${data.softdrinkCode}`);

    const handleAddToCart = () => {
        if (!currentStoreCode) { setShowStorePopup(true); return; }
        const totalPrice = Number(data.price) * count;
        setProduct({
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
        });
        setCount(1);
    };

    useEffect(() => { cartFn?.createCart(setCart); }, [cartFn, setCart]);
    useEffect(() => {
        if (product) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            const pCode = ct?.product.find(p => p.productCode === product.productCode);
            if (pCode) {
                pCode.quantity += product.quantity;
                pCode.amount = (Number(pCode.amount) + Number(product.amount)).toFixed(2);
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
                <SafeImage src={data.image} alt={data.softDrinksName} className="mc-card__img mc-card__img--contain" />
            </div>

            {/* Body */}
            <div className="mc-card__body">
                <h5 className="mc-card__name">{data?.softDrinksName}</h5>
                {data?.description && <p className="mc-card__desc">{data.description}</p>}
                {data?.price && (
                    <div className="mc-card__price">${Number(data.price).toFixed(2)}</div>
                )}

                {/* Footer */}
                <div className="mc-card__footer">
                    {isJuice ? (
                        <>
                            <div className="mc-card__qty" style={{ userSelect: 'none' }}>
                                <button className={`mc-card__qty-btn${count <= 1 ? ' disabled' : ''}`} onClick={countDec}>−</button>
                                <span className="mc-card__qty-val">{count}</span>
                                <button className={`mc-card__qty-btn${count >= 10 ? ' disabled' : ''}`} onClick={countInc}>+</button>
                            </div>
                            <button className="mc-card__add" onClick={handleAddToCart}>Add to Cart</button>
                        </>
                    ) : (
                        <button className="mc-card__add mc-card__add--outline" style={{ width: '100%' }} onClick={handleNavigate}>
                            Customize
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Drink;
