import React, { useEffect, useState } from "react";
import { getOrderDetails } from "../../../services";
import { toast } from "react-toastify";
// import moment from "moment/moment";
import LoadingLayout from "../../../layouts/LoadingLayout";
// import "../../../assets/styles/MyAccount/viewOrder.css";
import ViewOrderProductDetails from "./ViewOrderProductDetails";

function ViewOrder({ selectedCode }) {
    const [orderData, setOrderData] = useState();
    const [loading, setLoading] = useState(false);

    const orderDetailsAPI = () => {
        setLoading(true);
        getOrderDetails({ orderCode: selectedCode })
            .then((res) => {
                setOrderData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 500) {
                    toast.error(err.response.data.message);
                }
                setLoading(false);
            });
    };
    useEffect(() => {
        orderDetailsAPI();
    }, []);

    return (
        <>
            {loading === false ? (
                <div className="container-fluid w-100 row justify-content-center p-0 my-2">
                    {/* Order Details */}
                    <div className="col-12 text-start headingTitle">
                        <h4>
                            <strong>Order Details</strong>
                        </h4>
                    </div>
                    {orderData?.orderStatus === "placed" ? (
                        <>
                            <div
                                className="col-12 rounded row mt-3 m-0 p-0 py-1"
                                style={{ backgroundColor: "#deffde" }}
                            >
                                <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                                    <span className="contentTitle">Order No: </span>
                                    <span className="contentText fw-bold">
                                        {orderData?.orderCode}
                                    </span>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                                    <span className="contentTitle">Order Status: </span>
                                    <span className="contentText fw-bold text-success">
                                        {orderData?.orderStatus}
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="col-12 rounded row mt-3 m-0 p-0 py-1"
                                style={{ backgroundColor: "#ffd1d83d" }}
                            >
                                <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                                    <span className="contentTitle">Order No: </span>
                                    <span className="contentText fw-bold">
                                        {orderData?.orderCode}
                                    </span>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                                    <span className="contentTitle">Order Status: </span>
                                    <span className="contentText fw-bold text-danger">
                                        {orderData?.orderStatus}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="col-12 row m-0 p-0">
                        <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                            <span className="contentTitle">Date: </span>
                            <span className="contentText">{orderData?.orderDate}</span>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                            <span className="contentTitle">Order From: </span>
                            <span className="contentText">{orderData?.orderFrom}</span>
                        </div>
                    </div>
                    <div className="col-12 row m-0 p-0">
                        <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                            <span className="contentTitle">Phone Number: </span>
                            <span className="contentText">{orderData?.mobileNumber}</span>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                            <span className="contentTitle">Name: </span>
                            <span className="contentText">{orderData?.customerName}</span>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                            <span className="contentTitle">Address: </span>
                            <span className="contentText">{orderData?.address}</span>
                        </div>
                    </div>
                    <div className="col-12 row m-0 p-0">
                        <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                            <span className="contentTitle">Postal Code: </span>
                            <span className="contentText">{orderData?.zipCode}</span>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                            <span className="contentTitle">Delivery Type: </span>
                            <span className="contentText">{orderData?.deliveryType}</span>
                        </div>
                        {orderData?.deliveryType === "pickup" && (
                            <div className="col-12 row m-0 p-0">
                                <div className="col-lg-4 col-md-6 col-sm-12 py-2">
                                    <span className="contentTitle">Store Location: </span>
                                    <span className="contentText">
                                        {orderData?.storeLocation}
                                    </span>
                                </div>
                                <div className="col-lg-8 col-md-6 col-sm-12 py-2">
                                    <span className="contentTitle">Store Address: </span>
                                    <span className="contentText">{orderData?.storeAddress}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <hr className="my-2"></hr>
                    <ViewOrderProductDetails orderData={orderData} />
                </div>
            ) : (
                <LoadingLayout />
            )}
        </>
    );
}

export default ViewOrder;
