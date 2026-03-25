import React, { useContext, useEffect, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
// import "../assets/styles/Cart/MainCartList.css";
import bgImage from "../assets/images/bg-img.jpg";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import MainCartList from "../components/_main/Cart/MainCartList";
import LoadingLayout from "../layouts/LoadingLayout";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { deliverable, orderPlace } from "../services";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { motion } from "framer-motion";
import emptyCartImg from "../assets/images/empty-cart.png";

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

                                                    {/* Tax Amount - Only if > 0 */}
                                                    {cart?.taxAmount && Number(cart.taxAmount) > 0 && (
                                                        <li>
                                                            <span className="ttl">Tax ({cart?.taxPer || 0}%)</span>{" "}
                                                            <span className="stts">
                                                                $ {Number(cart.taxAmount).toFixed(2)}
                                                            </span>
                                                        </li>
                                                    )}

                                                    {/* Convenience Fee - Only if > 0 */}
                                                    {cart?.convinenceCharges && Number(cart.convinenceCharges) > 0 && (
                                                        <li>
                                                            <span className="ttl">Convenience Fee</span>{" "}
                                                            <span className="stts">
                                                                $ {Number(cart.convinenceCharges).toFixed(2)}
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>
                                                <div className="ttl-all mt-2">
                                                    <span className="ttlnm">Grand Total</span>
                                                    <span className="odr-stts">
                                                        ${" "}
                                                        {cart?.grandtotal
                                                            ? cart?.grandtotal
                                                            : (0.0).toFixed(2)}
                                                    </span>
                                                </div>
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
                        <div className="new-block d-flex align-items-center justify-content-center" style={{ minHeight: "80vh", background: "inherit" }}>
                            <div className="container d-flex align-items-center justify-content-center">
                                <div className="empty-cart-card d-flex flex-column align-items-center justify-content-center p-5 text-center"
                                    style={{
                                        background: "transparent",
                                        maxWidth: "550px",
                                        width: "90%",
                                    }}>

                                    <div className="mb-4">
                                        <div style={{ position: "relative" }}>
                                            {emptyCartImg ? (
                                                <img
                                                    src={emptyCartImg}
                                                    alt="Empty Cart Illustration"
                                                    style={{ width: "240px", height: "auto", borderRadius: "24px" }}
                                                />
                                            ) : (
                                                <AiOutlineShoppingCart style={{ fontSize: "5rem", color: "#888" }} />
                                            )}
                                        </div>
                                    </div>

                                    <h2 className="mb-2" style={{ fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-0.5px", color: "#888" }}>
                                        Your Cart is Empty!
                                    </h2>

                                    <p className="px-lg-4 mb-4" style={{ fontSize: "1rem", lineHeight: 1.6, maxWidth: "400px", color: "#888" }}>
                                        "Discover something delicious to fill your cart and satisfy your cravings."
                                    </p>

                                    <button
                                        className="btn btn-lg px-5 py-3 mt-2 addtocart"
                                        onClick={handleContinueShopping}
                                        style={{
                                            borderRadius: "16px",
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            border: "none",
                                        }}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <Footer />
        </>
    );
}

export default Cart;
