import React, { useContext, useEffect, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
// import "../assets/styles/Cart/MainCartList.css";
import bgImage from "../assets/images/bg-img.jpg";
import {GlobalContext} from "../context/GlobalContext";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import MainCartList from "../components/_main/Cart/MainCartList";
import LoadingLayout from "../layouts/LoadingLayout";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { deliverable, orderPlace } from "../services";
import { AiOutlineShoppingCart } from "react-icons/ai";

function Cart() {
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [cart, setCart] = globalCtx.cart;
    const [regUser, setRegUser] = globalCtx.regUser;
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state);

    const navigate = useNavigate();
    const location = useLocation();

    const handleCheckout = async () => {
        if (cart?.product?.length > 0) {
            if (isAuthenticated && user !== null) {
                navigate("/checkout");
                setLoading(false);
            } else {
                localStorage.setItem("redirectTo", location?.pathname);
                navigate("/login");
                setLoading(false);
            }
        } else {
            toast.error("Cart is Empty...");
        }
    };

    const handleCancelOrder = () => {
        if (cart?.product?.length > 0) {
            swal({
                title: "Order Cancellation",
                text: "Do you really want to cancel order?",
                icon: "warning",
                buttons: ["Cancel", "Ok"],
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    localStorage.removeItem("cart");
                    setCart();
                }
            });
        } else {
            toast.error("Cart is already empty");
        }
    };

    const handleContinueShopping = () => {
        navigate("/");
    };
    return (
        <>
            <Header />
            {loading ? (
                <LoadingLayout />
            ) : (
                <>
                    {cart?.product?.length > 0 ? (
                        <section className="new-block mb-3 BgsecondaryBlackColor">
                            <div className="nav-margin"></div>

                            {/* ── Mobile sticky checkout strip (top, below header) ── */}
                            <div className="d-lg-none" style={{
                                position: "sticky", top: 0, zIndex: 999,
                                background: "#fff", borderBottom: "1px solid #e8e8e8",
                                padding: "10px 16px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            }}>
                                <div>
                                    <div style={{ fontSize: "0.72rem", color: "#888" }}>Grand Total</div>
                                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a1a1a" }}>
                                        ${cart?.grandtotal ? cart.grandtotal : (0).toFixed(2)}
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    style={{
                                        background: "var(--primary, #2d7a2d)", color: "#fff",
                                        border: "none", borderRadius: 10,
                                        padding: "10px 28px", fontWeight: 700, fontSize: "0.95rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    Checkout
                                </button>
                            </div>

                            <div className="container-fluid px-lg-4 px-md-4 px-sm-2" style={{ paddingBottom: 80 }}>
                                <div className="row gx-4">
                                    <div className="col-lg-12 col-md-12 col-sm-12 py-1 mt-1">
                                        <div className="d-flex justify-content-start align-items-center w-100 productList mb-1">
                                            <h3 className="mx-2">Your Cart</h3>
                                        </div>
                                    </div>
                                    <div className="col-lg-8 col-md-12 col-sm-12 py-2 mt-1 mb-3 rounded-3">
                                        <ul className="list-group">
                                            {cart?.product?.map((cData) => {
                                                return (
                                                    <MainCartList
                                                        cData={cData}
                                                        key={cData.id}
                                                        setLoading={setLoading}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    {/* Order Summary */}
                                    <div className="col-lg-4 col-md-12 col-sm-12 py-2 mt-1">
                                        <div className="mb-2 w-100">
                                            <div className="block-stl10 odr-summary rounded-3                mb-3 bgPrimaryBlackColor primaryWhiteColor">
                                                <h3 className="primaryWhiteColor">Order Summary :</h3>
                                                <ul className="list-unstyled">
                                                    <li>
                                                        <span className="ttl">Sub Total</span>{" "}
                                                        <span className="stts">
                                                            ${" "}
                                                            {cart?.subtotal
                                                                ? cart?.subtotal
                                                                : (0.0).toFixed(2)}
                                                        </span>
                                                    </li>
                                                </ul>
                                                <div className="ttl-all">
                                                    <span className="ttlnm">Grand Total</span>
                                                    <span className="odr-stts">
                                                        ${" "}
                                                        {cart?.grandtotal
                                                            ? cart?.grandtotal
                                                            : (0.0).toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="tax-subheading">Tax will be calculated later.</p>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column flex-lg-row gap-2 mt-2 px-1">
                                            <button
                                                type="button"
                                                className="w-100 rounded-3 py-3 cancelCart"
                                                onClick={handleCancelOrder}
                                                style={{ fontWeight: 600 }}
                                            >
                                                Cancel Order
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-100 rounded-3 py-3 addtocart"
                                                onClick={handleCheckout}
                                                style={{ fontWeight: 700, fontSize: '1.1rem' }}
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <>
                            <div className="new-block">
                                <div
                                    className="row m-0 p-0 align-items-center justify-content-center"
                                    style={{ height: "600px" }}
                                >
                                    <div className="text-center">
                                        <div className="py-1">
                                            <AiOutlineShoppingCart
                                                style={{ width: "40px", height: "40px", color: "white" }}
                                            />
                                        </div>
                                        <p className="emptyCartMsg py-4 text-white">Your Cart is Empty</p>
                                        <button
                                            className="btn btn-md addtocart mb-3"
                                            onClick={handleContinueShopping}
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
            <Footer />
        </>
    );
}

export default Cart;
