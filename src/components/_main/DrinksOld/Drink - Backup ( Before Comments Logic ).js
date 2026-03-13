import React, { useContext, useEffect, useRef, useState } from "react";
import {GlobalContext} from "../../../context/GlobalContext";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Drink = ({ data, cartFn }) => {
  const globalctx = useContext(GlobalContext);
  const [cart, setCart] = globalctx.cart;
  const [settings, setSettings] = globalctx.settings;

  const [count, setCount] = useState(1);
  const [product, setProduct] = useState(null);
  const drinksTypeRef = useRef(null);

  // const user = useSelector((state) => state.user);

  // let taxPer = Number(0).toFixed(2);
  // if (settings !== undefined) {
  //   settings?.map((data) => {
  //     if (data?.shortCode === "tax_percentage" && data?.type === "percent") {
  //       taxPer = data?.settingValue;
  //     }
  //   });
  // }

  // // Count Decrease
  // const countDec = () => {
  //   if (count > 1) {
  //     setCount((count) => count - 1);
  //   }
  // };

  // // Count Decrease
  // const countInc = () => {
  //   setCount((count) => count + 1);
  // };

  // // Handle Drinks
  // const handleDrinks = () => {
  //   const totalPrice = data?.price * count;
  //   const obj = {
  //     id: uuidv4(),
  //     customerCode: user?.data?.customerCode,
  //     cashierCode: "#NA",
  //     productCode: data.softdrinkCode,
  //     productName: data.softDrinksName,
  //     productType: "drinks",
  //     config: {
  //       drinkType: [drinksTypeRef.current.value],
  //     },
  //     price: data.price,
  //     quantity: count,
  //     amount: totalPrice,
  //     taxPer: taxPer,
  //     pizzaSize: "",
  //     comments: "",
  //   };
  //   setProduct(obj);
  //   setCount(1); // count set to 1
  // };

  // useEffect(() => {
  //   cartFn.createCart(setCart);
  // }, [setCart]);

  // useEffect(() => {
  //   if (product !== null) {
  //     let ct = JSON.parse(localStorage.getItem("cart"));
  //     const pCode = ct?.product.find(
  //       (code) => code.productCode === product.productCode
  //     );
  //     if (pCode) {
  //       ct?.product.map((data) => {
  //         if (data.productCode === pCode.productCode) {
  //           pCode.quantity = pCode.quantity + product.quantity;
  //           pCode.amount = Number(pCode.amount) + Number(product.amount);
  //         }
  //       });
  //       const cartProduct = ct.product;
  //       cartFn.addCart(cartProduct, setCart, true, settings);
  //     } else {
  //       ct.product.push(product);
  //       const cartProduct = ct.product;
  //       cartFn.addCart(cartProduct, setCart, false, settings);
  //     }
  //   }
  // }, [product]);

  return (
    <div className="col-lg-3 col-md-4 col-sm-12 mb-3" key={data.softdrinkCode}>
      <div className="d-flex justify-content-center flex-column p-3 box">
        {/* Image */}
        <div className="d-flex justify-content-center mb-3">
          <div className="image-div d-flex justify-content-center">
            <img
              src={data.image ? data.image : "images/pz.png"}
              alt=""
              className="img-fluid image"
            />
          </div>
        </div>
        {/* Title */}
        <div className="sidesTitle mb-3">
          <h3>{data.softDrinksName}</h3>
        </div>
        {/* Quantity and Add To Cart - Button */}
        <div className="d-flex justify-content-center flex-column align-items-center">
          {/* <select
            className="select-input w-75 sideSize mb-3"
            ref={drinksTypeRef}
          >
            {data?.drinkType?.map((item, index) => {
              return (
                <option value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select> */}
          {/* <div className="mb-3 d-flex align-items-center">
            <button className="quantityBtn" onClick={countDec}>
              <i className="fa fa-minus" aria-hidden="true"></i>
            </button>
            <p className="quantityText mx-3">{count}</p>
            <button className="quantityBtn" onClick={countInc}>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </button>
          </div> */}
          <p className="drinksPrice text-dark mb-3">
            Price : <span className="mx-2">$ {data.price}</span>
          </p>

          <Link
            to={`/customize-drink/${data.softdrinkCode}`}
            className="customizedBtn btn btn-sm px-4 py-2 text-white"
          >
            Customize
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Drink;
