import React, { useContext, useEffect, useState } from "react";
import {GlobalContext} from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import paymentSuccess from "../../assets/images/payment-success.png";
import { useNavigate } from "react-router-dom";
import { useSiteData } from "../../components/_main/Header/hooks/useSiteData";

function Success() {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [loading, setLoading] = useState(false);
    const placeOrderData = JSON.parse(localStorage.getItem("placedOrder"));
    const { siteData, loading: siteDataLoading } = useSiteData();
    const [logoError, setLogoError] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
        localStorage.removeItem("placedOrder");
    };

    useEffect(() => {
        localStorage.removeItem("cart");
        setCart({ product: [] });
    }, [placeOrderData]);

    useEffect(() => {
        if (placeOrderData !== null) {
            navigate("/order/verify");
        } else {
            navigate("/");
        }
    }, []);

    return (
        <>
            {loading === true ? (
                <LoadingLayout />
            ) : (
                <div className="container-fluid d-flex align-items-center justify-content-center flex-column">
                    <div className="w-100 d-flex flex-column align-items-center py-3">
                        {siteDataLoading || logoError ? (
                            <div className="placeholder-glow d-inline-block" style={{ width: '80px', height: '80px' }}>
                                <span className="placeholder w-100 h-100 rounded-circle" style={{ backgroundColor: "#e0e0e0", display: 'block' }}></span>
                            </div>
                        ) : (
                            <img
                                src={siteData?.logo}
                                alt="Logo"
                                className="img-fluid"
                                style={{
                                    maxWidth: '80px',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                                onError={() => setLogoError(true)}
                            />
                        )}
                        <h2
                            className="mt-3"
                            style={{ fontSize: "1.3rem", letterSpacing: ".08rem" }}
                        >
                            <strong>{siteData?.site_name}</strong>
                        </h2>
                    </div>
                    <div className="container-fluid row m-0 p-0 px-3 d-flex justify-content-center">
                        <div className="card py-2 my-4 col-lg-5 col-md-7 col-sm-10 text-center">
                            <div className="d-flex justify-content-center align-items-center my-2 py-2 w-100">
                                <img
                                    src={paymentSuccess}
                                    className="card-img-top"
                                    alt=""
                                    style={{ width: "2.8rem", height: "2.8rem" }}
                                />
                            </div>
                            <div className="card-body">
                                <h5
                                    className="card-title text-success fw-bold"
                                    style={{
                                        fontSize: "1.3rem",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Order Placed Successfully
                                </h5>
                                <h6
                                    className="card-subtitle my-2 mt-3 text-secondary d-flex justify-content-between flex-wrap"
                                    style={{ fontSize: ".95rem", fontWeight: "600" }}
                                >
                                    <span>Transaction Id :</span>{" "}
                                    <span className="mx-2">{placeOrderData?.txnId}</span>
                                </h6>
                                <hr style={{ borderTop: ".1rem dashed #606060" }}></hr>
                                <p
                                    className="card-text text-secondary my-1 d-flex justify-content-between flex-wrap"
                                    style={{ fontSize: ".95rem" }}
                                >
                                    <span className="fw-bold">Order Code :</span>
                                    <span>{placeOrderData?.orderCode}</span>
                                </p>
                                <p
                                    className="card-text text-secondary my-1 d-flex justify-content-between flex-wrap"
                                    style={{ fontSize: ".95rem" }}
                                >
                                    <span className="fw-bold">Receipt Number :</span>
                                    <span>{placeOrderData?.receiptNo}</span>
                                </p>
                                <p
                                    className="card-text text-secondary my-1 d-flex justify-content-between flex-wrap"
                                    style={{ fontSize: ".95rem" }}
                                >
                                    <span className="fw-bold">Order Date :</span>
                                    <span>{placeOrderData?.orderDate}</span>
                                </p>
                                <p
                                    className="card-text text-secondary my-1 d-flex justify-content-between flex-wrap"
                                    style={{ fontSize: ".95rem" }}
                                >
                                    <span className="fw-bold">Total Amount :</span>
                                    <span className="fw-bold">
                                        $ {Number(placeOrderData?.totalAmount).toFixed(2)}
                                    </span>
                                </p>
                            </div>
                            <div className="card-footer bg-white text-center">
                                <button
                                    className="btn btn-md bg-secondary text-light"
                                    onClick={handleBack}
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Success;
