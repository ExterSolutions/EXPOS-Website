import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import '../../../../src/cardsui/cardsui.css';
import {GlobalContext} from "../../../context/GlobalContext";
import SidesModalTps from "./SidesModalTps";

function Sides({ data, cartFn }) {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [settings, setSettings] = globalctx.settings;
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [count, setCount] = useState(1);
    const [product, setProduct] = useState(null);
    const sPlacementRef = useRef(null);

    const user = useSelector((state) => state?.user);

    // Count Deacrease
    const countDec = () => {
        if (count > 1) {
            setCount((count) => count - 1);
        }
    };
    // Count Increase
    const countInc = () => {
        if (count < 10) {
            setCount((count) => count + 1);
        }
    };

    // Handle Sides - Add To Cart Button
    const handleSides = () => {
        if (currentStoreCode === undefined || currentStoreCode === null) {
            setShowStorePopup(true)
            return false;
        }

        let combinationData = {};
        if (sPlacementRef.current) {
            const selectedCode = sPlacementRef.current.value;
            combinationData = data?.combination?.find(
                (code) => code.lineCode === selectedCode
            );
        }

        const totalPrice = combinationData?.price * count;
        const obj = {
            id: uuidv4(),
            customerCode: user?.data?.customerCode,
            cashierCode: "#NA",
            productCode: data.sideCode,
            productName: data.sideName,
            productType: "side",
            config: {
                lineCode: combinationData?.lineCode,
                sidesSize: combinationData?.size,
                sidesType: data?.type,
            },
            price: combinationData?.price,
            quantity: count,
            amount: totalPrice,
            taxPer: 0,
            pizzaSize: "",
            comments: "",
        };
        setProduct(obj);
        setCount(1);
        sPlacementRef.current.value = data?.combination?.[0]?.lineCode;
    };

    // Create Cart if Cart Key Not Present
    useEffect(() => {
        cartFn.createCart(setCart);
    }, [setCart]);

    // Add to Cart - Logic
    useEffect(() => {
        if (product !== null) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            ct.product.push(product);
            const cartProduct = ct.product;
            cartFn.addCart(cartProduct, setCart, false, settings);
        }
    }, [product]);

    return (
        <>
            <div className="pizza-item">
                <div className="card-image-container">
                    <img
                        src={data?.image}
                        alt={data?.sideName}
                        className="pizza-image"
                        loading="lazy"
                    />
                </div>
                <div className="pizza-content">
                    <h5 className="pizza-name">{data?.sideName}</h5>
                    <div className="product-description">
                        {data?.description}
                    </div>
                    <select
                        className="form-select"
                        ref={sPlacementRef}
                    >
                        {data?.combination?.map((combination) => (
                            <option
                                value={combination.lineCode}
                                key={combination.lineCode}
                            >
                                {combination.size} - ${combination.price}
                            </option>
                        ))}
                    </select>
                    {/* Quantity + / - */}
                    <div className="qty-controls"
                        style={{ userSelect: "none" }}
                    >
                        <span
                            className={`cursor-pointer ${count <= 1 ? "view-btn-disabled" : "sidemenu-button-dec"
                                }`}
                            onClick={countDec}
                        >
                            <i className="fa fa-minus" />
                        </span>
                        <span className="countText panjabi-count">{count}</span>
                        <span
                            className={`cursor-pointer ${count >= 10 ? "view-btn-disabled" : "sidemenu-button-inc"
                                }`}
                            onClick={countInc}
                        >
                            <i className="fa fa-plus" />
                        </span>
                    </div>
                    {/* Buttons */}
                    {Number(data.hasToppings) === 1 &&
                        Number(data.nooftoppings) > 0 ? (
                        <button
                            type="button"
                            className="view-button"
                            onClick={handleShow}
                        >
                            Customize
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="view-button"
                            onClick={handleSides}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>

            <SidesModalTps
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                data={data}
                count={count}
                sPlacementRef={sPlacementRef}
                setProduct={setProduct}
                setCount={setCount}
                product={product}
            />
        </>
    );
}

export default Sides;