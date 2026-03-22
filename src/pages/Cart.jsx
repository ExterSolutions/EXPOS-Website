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
                        <section className="new-block mb-3 BgsecondaryBlackColor" style={{ paddingBottom: '90px' }}>
                            <div className="nav-margin"></div>
                            <div className="container-fluid px-lg-4 px-md-4 px-sm-2">
                                <div className="row gx-4">
                                    <div className="col-lg-12 col-md-12 col-sm-12 py-1 mt-1">
                                        <div className="d-flex justify-content-start align-items-center w-100 productList mb-1">
                                            <h3 className="mx-2">Your Cart</h3>
                                        </div>
                                    </div>
                                    <div className="col-lg-8 col-md-12 col-sm-12 py-2 mt-1 mb-3">
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
                                    <div className="col-lg-4 col-md-12 col-sm-12 py-2 mt-1 mb-3 ">
                                        <div className="row ">
                                            <div className="col-lg-12 col-md-12 col-sm-12 mb-2">
                                                <div className="block-stl10 odr-summary mb-0 bgPrimaryBlackColor primaryWhiteColor">
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
                                                        <li className="d-none">
                                                            <span className="ttl">
                                                                Convenience Charges (%)
                                                            </span>{" "}
                                                            <span className="stts">
                                                                ${" "}
                                                                {cart?.convinenceCharges
                                                                    ? cart?.convinenceCharges
                                                                    : 0}
                                                            </span>
                                                        </li>
                                                        <li className="d-none">
                                                            <span className="ttl">Delivery Charges</span>{" "}
                                                            <span className="stts">
                                                                ${" "}
                                                                {cart?.deliveryCharges
                                                                    ? cart?.deliveryCharges
                                                                    : Number(0).toFixed(2)}
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
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="row gx-3">
                                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                                        <button
                                                            type="button"
                                                            className="w-100 rounded my-2 py-3 cancelCart"
                                                            onClick={handleCancelOrder}
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                                        <button
                                                            type="submit"
                                                            className="w-100 rounded my-2 py-3 addtocart"
                                                            onClick={handleCheckout}
                                                        >
                                                            Checkout
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Mobile Sticky Checkout Bar */}
                            <div className="mobile-sticky-cart-bar d-md-none">
                                <div className="d-flex align-items-center justify-content-between px-3 py-2">
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Grand Total</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                                            ${cart?.grandtotal ? cart.grandtotal : (0.0).toFixed(2)}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn fw-bold px-4 py-2"
                                        style={{ backgroundColor: '#fff', color: 'var(--primary)', borderRadius: '12px', fontSize: '1rem' }}
                                        onClick={handleCheckout}
                                    >
                                        Checkout →
                                    </button>
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
