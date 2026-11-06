import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import '../../../assets/styles/modern-cards.css';
import { GlobalContext } from "../../../context/GlobalContext";
import SidesModalTps from "./SidesModalTps";
import SafeImage from "../../common/SafeImage";

function Sides({ data, cartFn }) {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [settings] = globalctx.settings;
    const [currentStoreCode] = globalctx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [count, setCount] = useState(1);
    const sPlacementRef = useRef(null);
    const user = useSelector((state) => state?.user);

    const countDec = () => { if (count > 1) setCount(c => c - 1); };
    const countInc = () => { if (count < 10) setCount(c => c + 1); };

    useEffect(() => { cartFn?.createCart(setCart); }, [cartFn, setCart]);

    const handleSides = () => {
        if (!currentStoreCode) { setShowStorePopup(true); return; }
        let combinationData = data?.combination?.[0] || {};
        if (sPlacementRef.current) {
            const selectedCode = sPlacementRef.current.value;
            combinationData = data?.combination?.find(c => c.lineCode === selectedCode) || combinationData;
        }
        const totalPrice = Number(combinationData?.price || 0) * count;
        const newProduct = {
            id: uuidv4(),
            customerCode: user?.data?.customerCode,
            cashierCode: "#NA",
            productCode: data.sideCode,
            productName: data.sideName,
            productType: "side",
            config: { lineCode: combinationData?.lineCode, sidesSize: combinationData?.size, sidesType: data?.type },
            price: Number(combinationData?.price || 0).toFixed(2),
            quantity: count,
            amount: totalPrice.toFixed(2),
            taxPer: 0,
            pizzaSize: "",
            comments: "",
        };

        let ct = JSON.parse(localStorage.getItem("cart") || "null") || { product: [] };
        if (!Array.isArray(ct.product)) ct.product = [];
        ct.product.push(newProduct);
        cartFn.addCart(ct.product, setCart, false, settings);
        toast.success("Added to cart! 🛒");
        setCount(1);
        if (sPlacementRef.current) sPlacementRef.current.value = data?.combination?.[0]?.lineCode;
    };

    const minPrice = data?.combination?.length
        ? Math.min(...data.combination.map(c => Number(c.price)))
        : null;

    return (
        <>
            <div className="mc-card">
                <div className="mc-card__img-wrap">
                    <SafeImage src={data.image} alt={data.sideName} className="mc-card__img" />
                </div>
                <div className="mc-card__body">
                    <h5 className="mc-card__name">{data?.sideName}</h5>
                    {data?.description && <p className="mc-card__desc">{data.description}</p>}
                    {minPrice != null && (
                        <div className="mc-card__price">
                            {data.combination?.length > 1 ? 'From ' : ''}${minPrice.toFixed(2)}
                        </div>
                    )}
                    {/* Variant selector */}
                    {data?.combination?.length > 1 && (() => {
                        const variantLabel = data.variantType === 'flavour' ? 'Select Flavour'
                            : data.variantType === 'portion' ? 'Select Portion'
                            : 'Select Size';
                        return (
                            <div className="mc-card__variant-wrap">
                                <span className="mc-card__variant-label">{variantLabel}</span>
                                <select className="mc-card__select" ref={sPlacementRef}>
                                    {data.combination.map(c => (
                                        <option value={c.lineCode} key={c.lineCode}>
                                            {c.size} — ${Number(c.price).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    })()}
                    {data?.combination?.length === 1 && (
                        <select style={{ display: 'none' }} ref={sPlacementRef}>
                            <option value={data.combination[0].lineCode}>{data.combination[0].size}</option>
                        </select>
                    )}
                    {/* Footer */}
                    <div className="mc-card__footer">
                        <div className="mc-card__qty" style={{ userSelect: 'none' }}>
                            <button className={`mc-card__qty-btn${count <= 1 ? ' disabled' : ''}`} onClick={countDec}>−</button>
                            <span className="mc-card__qty-val">{count}</span>
                            <button className={`mc-card__qty-btn${count >= 10 ? ' disabled' : ''}`} onClick={countInc}>+</button>
                        </div>
                        {Number(data.hasToppings) === 1 && Number(data.nooftoppings) > 0 ? (
                            <button className="mc-card__add mc-card__add--outline" onClick={handleShow}>Customize</button>
                        ) : (
                            <button className="mc-card__add" onClick={handleSides}>Add to Cart</button>
                        )}
                    </div>
                </div>
            </div>
            <SidesModalTps
                show={show} handleShow={handleShow} handleClose={handleClose}
                data={data} count={count} sPlacementRef={sPlacementRef}
                setProduct={setProduct} setCount={setCount} product={product}
            />
        </>
    );
}

export default Sides;