//// CartList.js - Updated version with icon-only buttons
import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import CartFunction from "../../cart";
import { useLocation, useNavigate } from "react-router-dom";
// import "../../../assets/styles/Cart/CartList.css";
import { toast } from "react-toastify";
import CustomPizzaCart from "./CartComponents/ShowPizzaConfigForCart/CustomPizzaCart";
import SpecialPizzaCart from "./CartComponents/ShowPizzaConfigForCart/SpecialPizzaCart";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import React Icons

function CartList({ cData }) {
  // GlobalContext
  console.log("cData", cData);
  const globalctx = useContext(GlobalContext);
  const [cart, setCart] = globalctx.cart;
  const [settings, setSettings] = globalctx.settings;
  const [showSidebar, setShowSidebar] = globalctx.sidebar;
  // Helper Function
  const cartFn = new CartFunction();
  //
  const location = useLocation();
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault();

    const currentPath = location.pathname;
    const { productType, id, productCode } = cData || {};
    const productRoutes = {
      custom_pizza: `/create-your-own/${id}`,
      special_pizza: `/specialoffer/${productCode}/${id}`,
      special_pizza_topping: `/special-offers-with-toppings/${productCode}/${id}`,
      signature_pizza: `/signaturepizza/${id}/${productCode}`,
      other_pizza: `/otherpizza/${id}/${productCode}`,
    };

    const deleteUrlForItem = productRoutes[productType] || "";
    const isEditingSameItem = currentPath === deleteUrlForItem;

    if (isEditingSameItem) {
      toast.error("You cannot delete this item, The Item is in editing mode");
      return false;
    }

    const isSingleProduct = cart?.product?.length === 1;

    cartFn.deleteCart(cData, cart, setCart, settings);

    if (isSingleProduct) {
      localStorage.removeItem("cart");
      setCart();
      cartFn.createCart(setCart);
    }
  };

  const handleRedirectToEdit = (pathUrl) => {
    navigate(pathUrl);
  };

  // const handleEdit =()=>{
  //     console.log('productType',cData.productType)
  // }
  const handleEdit = () => {
    if (cData?.productType === "custom_pizza") {
      if (location.pathname === `/create-your-own/${cData?.id}`) {
        setShowSidebar(false);
      } else {
        handleRedirectToEdit(`/create-your-own/${cData?.id}`);
        setShowSidebar(false);
      }
    }
    if (cData?.productType === "special_pizza") {
      if (
        location.pathname === `/specialoffer/${cData?.productCode}/${cData?.id}`
      ) {
        setShowSidebar(false);
      } else {
        handleRedirectToEdit(
          `/specialoffer/${cData?.productCode}/${cData?.id}`,
        );
        setShowSidebar(false);
      }
    }

    if (cData?.productType === "special_pizza_topping") {
      if (
        location.pathname ===
        `/special-offers-with-toppings/${cData?.productCode}/${cData?.id}`
      ) {
        setShowSidebar(false);
      } else {
        handleRedirectToEdit(
          `/special-offers-with-toppings/${cData?.productCode}/${cData?.id}`,
        );
        setShowSidebar(false);
      }
    }

    if (cData?.productType === "signature_pizza") {
      if (
        location.pathname ===
        `/signaturepizza/${cData?.id}/${cData?.productCode}`
      ) {
        setShowSidebar(false);
      } else {
        handleRedirectToEdit(
          `/signaturepizza/${cData?.id}/${cData?.productCode}`,
        );
        setShowSidebar(false);
      }
    }

    if (cData?.productType === "other_pizza") {
      if (
        location.pathname === `/otherpizza/${cData?.id}/${cData?.productCode}`
      ) {
        setShowSidebar(false);
      } else {
        handleRedirectToEdit(`/otherpizza/${cData?.id}/${cData?.productCode}`);
        setShowSidebar(false);
      }
    }
  };

  return (
    <div className="cart-item-container mb-2 p-1  rounded">
      <div className="row m-0 list-item">
        <div className="col-12">
          <div className="row align-items-center">
            {/* Title */}
            <div className="col-md-9 col-8 text-start productTitle">
              <span className="fw-bold">
                {cData?.productName} x {cData?.quantity}
              </span>
            </div>
            {/* Price */}
            <div className="col-md-3 col-4 text-end">
              <span className="fw-bold" style={{ fontSize: "1rem" }}>
                ${cData?.amount}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row m-0 px-1 list-item">
        <div className="col-lg-12">
          {/* Pizza Size */}
          {cData?.config?.sidesSize && (
            <>
              <div className="w-100 d-flex text-start main-cartPizzaSize mb-1">
                <span className="fw-medium">Size : </span>
                <span className="mx-2">
                  {cData?.config?.sidesSize ? cData?.config?.sidesSize : ""}
                </span>
              </div>
              {cData?.comments !== "" && (
                <div className="w-100 main-cartPizzaSize mb-1">
                  <span className="fw-medium d-inline">Comments : </span>
                  <span className="d-inline">{cData?.comments}</span>
                </div>
              )}
            </>
          )}
          {cData?.pizzaSize && (
            <div className="w-100 d-flex text-start main-cartPizzaSize mb-1">
              <span className="fw-medium">Size : </span>
              <span className="mx-2">
                {cData?.pizzaSize !== "" ? cData?.pizzaSize : ""}
              </span>
            </div>
          )}
          {cData?.config?.pizza?.length > 0 &&
            cData.config.pizza.map((data, index) => {
              const isCustom = cData.productType === "custom_pizza";
              const isSpecial = cData.productType === "special_pizza";
              if (!isCustom && !isSpecial) return null;
              return (
                <div
                  className="d-flex justify-content-start flex-column selectedPizza mb-2"
                  key={index}
                >
                  {isCustom && <CustomPizzaCart data={data} />}
                  {isSpecial && <SpecialPizzaCart data={data} index={index} />}
                </div>
              );
            })}
          {/* Sides */}
          {cData?.config?.sides?.length > 0 && (
            <div className="w-100 d-flex justify-content-start flex-row align-items-start main-cartPizza mb-1">
              <div className="fw-medium sm-font">Sides :</div>
              <div className="ms-1 d-flex flex-column sm-font">
                {cData?.config?.sides?.map((data, index) => {
                  return (
                    <div key={index}>
                      {data?.sideName} ({data?.sideSize}) x {data?.quantity}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Dips */}
          {cData?.config?.dips?.length > 0 && (
            <div className="w-100 d-flex justify-content-start align-items-start flex-row main-cartPizza mb-1">
              <div className="fw-medium sm-font">Dips: </div>
              <div className="ms-1 d-flex flex-column sm-font">
                {cData?.config?.dips?.map((data, index) => {
                  return (
                    <div key={index}>
                      {data?.dipsName} x {data?.quantity}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Drinks */}
          {cData?.config?.drinks?.length > 0 && (
            <div className="w-100 d-flex justify-content-start align-items-start flex-row main-cartPizza mb-1">
              <div className="fw-medium sm-font">Drinks: </div>
              <div className="ms-1 d-flex flex-column sm-font">
                {cData?.config?.drinks?.map((data, index) => {
                  return (
                    <div key={index}>
                      {data?.drinksName} x {data?.quantity}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Edit & Delete ICONS ONLY (Left side alignment) */}
        <div className="col-lg-18   ">
          <div className="d-flex justify-content-start align-items-center">
            {/* Delete Icon Button */}
            <button
              type="button"
              className="btn btn-icon btn-colours btn-sm  d-flex align-items-center justify-content-center"
              onClick={handleDelete}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                padding: "0",
              }}
              title="Delete"
            >
              <FaTrash size={14} />
            </button>

            {/* Edit Icon Button - Only show for pizza types */}
            {(cData.productType === "special_pizza" ||
              cData.productType === "special_pizza_topping" ||
              cData.productType === "custom_pizza" ||
              cData.productType === "signature_pizza" ||
              cData.productType === "other_pizza") && (
              <button
                type="button"
                className="btn btn-icon btn-colours-new btn-sm d-flex align-items-center justify-content-center"
                onClick={handleEdit}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  padding: "0",
                }}
                title="Edit"
              >
                <FaEdit size={14} />
              </button>
            )}
          </div>
          <div className="col-15">
            <hr className="theme-top-border w-100 m-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartList;
