import React, { useContext, useEffect, useState } from "react";
import { paymentCancel } from "../../services";
import { toast } from "react-toastify";
import {GlobalContext} from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import Header from "../../components/_main/Header/Header";
import paymentCancelled from "../../assets/images/payment-cancel.png";
import Footer from "../../components/_main/Footer";
import Unauthorized from "./Unauthorized";

function Cancel() {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState();
    const [unAuth, setUnAuth] = useState(false);
    const sessionId = localStorage.getItem("sessionId");
    const orderCode = localStorage.getItem("orderCode");

    useEffect(() => {
        setLoading(true);
        if (sessionId === null) {
            setUnAuth(true);
            setLoading(false);
        } else {
            const payload = {
                sessionId: sessionId,
                orderCode: orderCode,
            };
            paymentCancel(payload)
                .then((res) => {
                    setErrMsg(res.message);
                    localStorage.removeItem("sessionId");
                    localStorage.removeItem("orderCode");
                    localStorage.removeItem("OrderID");
                    localStorage.removeItem("cart");
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error(err);
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return <LoadingLayout />
    }

    return (
        <>
            <Header />
            {unAuth === false ? (
                <div className="container-fluid row m-0 p-0 px-3 d-flex justify-content-center">
                    <div className="card py-2 my-4 col-lg-5 col-md-7 col-sm-10 text-center">
                        <div className="d-flex justify-content-center align-items-center my-2 py-2 w-100">
                            <img
                                src={paymentCancelled}
                                className="card-img-top"
                                alt=""
                                style={{ width: "2.8rem", height: "2.8rem" }}
                            />
                        </div>
                        <div className="card-body">
                            <h5
                                class="card-title text-danger fw-bold"
                                style={{ fontSize: "1.3rem", textTransform: "capitalize" }}
                            >
                                {errMsg}
                            </h5>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <Unauthorized />
                </>
            )}
            <Footer />
        </>
    );
}

export default Cancel;
