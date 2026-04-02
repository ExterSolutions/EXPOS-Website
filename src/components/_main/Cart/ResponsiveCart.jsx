import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {GlobalContext} from "../../../context/GlobalContext";

function ResponsiveCart({ handleCart, totalPrice, section }) {
    // GlobalContext
    const globalCtx = useContext(GlobalContext);
    const [cart, setCart] = globalCtx.cart;
    //
    const navigate = useNavigate();
    const location = useLocation();

    // handle Back Button
    const handleBackButton = () => {
        navigate("/");
    };
    //handle Checkout Button
    const handleCheckout = () => {
        navigate("/cart");
    };

    useEffect(() => { }, [cart]);

    return (
        <div
            className="p-0 d-lg-none responsive-card-background-color"
            style={{
                position: "fixed",
                width: "100%",
                bottom: "0",
                zIndex: "4",
                height: "65px",
            }}
        >
            <div className="row gx-3  p-2 h-100 justify-content-between align-items-center py-1">
                <div className="col-5 text-center responsive-card-text-color">
                    <i
                        className="fa fa-chevron-left"
                        aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={handleBackButton}
                    ></i>
                    <span className="mx-4 mb-3">
                        <strong>
                            $&nbsp;
                            {totalPrice
                                ? Number(totalPrice).toFixed(2)
                                : (0.0).toFixed(2)}
                        </strong>
                    </span>
                </div>
                <div className="col-auto text-nowrap text-center">
                    <button
                        type="button"
                        className="top-0 pizza-card-btn-background-color pizza-card-btn-text-color pizza-card-btn-text-color btn btn-sm px-3 py-2"
                        onClick={handleCart}
                    >
                        <b>
                            {section}
                        </b>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResponsiveCart;
