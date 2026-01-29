// import { useContext, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { v4 as uuidv4 } from "uuid";
// import '../../../../src/components/_main/Carousel/style-pizza-carousel.css';
// import GlobalContext from "../../../context/GlobalContext";

// function Dips({ data, cartFn }) {
//     const globalctx = useContext(GlobalContext);
//     const [cart, setCart] = globalctx.cart;
//     const [settings] = globalctx.settings;
//     const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
//     const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;

//     const [count, setCount] = useState(1);
//     const [product, setProduct] = useState(null);

//     const user = useSelector((state) => state?.user);

//     const countDec = () => {
//         if (count > 1) {
//             setCount((prev) => prev - 1);
//         }
//     };

//     const countInc = () => {
//         if (count < 10) {
//             setCount((prev) => prev + 1);
//         }
//     };

//     const handleDips = () => {
//         if (currentStoreCode === undefined || currentStoreCode === null) {
//             setShowStorePopup(true);
//             return false;
//         }
//         const totalPrice = data?.price * count;
//         const obj = {
//             id: uuidv4(),
//             customerCode: user?.data?.customerCode,
//             cashierCode: "#NA",
//             productCode: data.dipsCode,
//             productName: data.dipsName,
//             productType: "dips",
//             config: {},
//             price: Number(data.price).toFixed(2),
//             quantity: count,
//             amount: Number(totalPrice).toFixed(2),
//             taxPer: 0,
//             pizzaSize: "",
//             comments: "",
//         };
//         setProduct(obj);
//         setCount(1);
//     };

//     useEffect(() => {
//         cartFn.createCart(setCart);
//     }, [cartFn, setCart]);

//     useEffect(() => {
//         if (product !== null) {
//             let ct = JSON.parse(localStorage.getItem("cart"));
//             const pCode = ct?.product.find(
//                 (code) => code.productCode === product.productCode
//             );
//             if (pCode) {
//                 ct?.product.forEach((data) => {
//                     if (data.productCode === pCode.productCode) {
//                         pCode.quantity = pCode.quantity + product.quantity;
//                         pCode.amount = Number(pCode.amount) + Number(product.amount);
//                     }
//                 });
//                 const cartProduct = ct.product;
//                 cartFn.addCart(cartProduct, setCart, true, settings);
//             } else {
//                 ct.product.push(product);
//                 const cartProduct = ct.product;
//                 cartFn.addCart(cartProduct, setCart, false, settings);
//             }
//         }
//     }, [product, cartFn, setCart, settings]);

//     // return (
//     //     <>
//     //         <div className="grid-card-placeholder">
//     //             <div className="grid-top-container">
//     //                 <img
//     //                     src={data?.image}
//     //                     alt={data?.dipsName}
//     //                     className="bestseller-placeholder"
//     //                 />
//     //             </div>
//     //             <div className="grid-card-detail">
//     //                 <div className="pizzaTitleDiv">
//     //                     <div className="pizzaTitle">
//     //                         <h5 className="pizza-name">
//     //                             {data?.dipsName}
//     //                         </h5>
//     //                     </div>
//     //                 </div>
//     //                 <div className="grid-card-pizzasize">
//     //                     <span className="panjabi-price">
//     //                         $ {Number(data?.price).toFixed(2)}
//     //                     </span>
//     //                 </div>
//     //                 <div className="row g-0 d-flex justify-content-between button-div">
//     //                     <div className="col-12 col-sm-6 m-0 p-0 text-center text-sm-start" style={{ userSelect: "none" }}>
//     //                         <div>
//     //                             <span
//     //                                 className={`cursor-pointer  ${count <= 1 ? "view-btn-disabled" : "sidemenu-button-dec"
//     //                                     }`}
//     //                                 onClick={countDec}
//     //                             >
//     //                                 <i className="fa fa-minus" aria-hidden="true"></i>
//     //                             </span>
//     //                             <span className="countText panjabi-count" id="grid_count">
//     //                                 {count}
//     //                             </span>
//     //                             <span
//     //                                 className={`cursor-pointer  ${count >= 10 ? "view-btn-disabled" : "sidemenu-button-inc"
//     //                                     }`}
//     //                                 onClick={countInc}
//     //                             >
//     //                                 <i className="fa fa-plus" aria-hidden="true"></i>
//     //                             </span>
//     //                         </div>
//     //                     </div>
//     //                     <div className="col-12 col-sm-6 m-0 p-0 text-center text-sm-end">
//     //                         <button
//     //                             className="btn-add-to-cart sidemenu-button-add"
//     //                             onClick={handleDips}
//     //                         >
//     //                             Add to Cart
//     //                         </button>
//     //                     </div>
//     //                 </div>
//     //             </div>
//     //         </div>
//     //     </>
//     // );
//     return (
//         <div className="dips-card">
//             {/* Image */}
//             <div className="dips-image-container">
//                 <img
//                     src={data?.image}
//                     alt={data?.dipsName}
//                     className="dips-image"
//                 />
//             </div>

//             {/* Content */}
//             <div className="dips-content">

//                 <h5 className="pizza-name">{data?.dipsName}</h5>

//                 {/* Price */}
//                 <div className="dips-price">${Number(data?.price).toFixed(2)}</div>

//                 {/* Quantity Controls */}
//                 <div className="dips-qty-controls">
//                     <span
//                         className={`qty-btn ${count <= 1 ? "disabled" : ""}`}
//                         onClick={countDec}
//                     >
//                         -
//                     </span>

//                     <span className="qty-value">{count}</span>

//                     <span
//                         className={`qty-btn ${count >= 10 ? "disabled" : ""}`}
//                         onClick={countInc}
//                     >
//                         +
//                     </span>
//                 </div>

//                 {/* Add to Cart */}
//                 <button className="dips-add-btn" onClick={handleDips}>
//                     Add to Cart
//                 </button>

//             </div>
//         </div>
//     );

// }

// export default Dips;



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
