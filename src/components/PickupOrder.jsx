import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import {GlobalContext} from "../context/GlobalContext";
import { useSocket } from "../context/SocketContext";
import { getStoreLocation, orderPlace } from "../services";

// Developer: Shreyas Mahamuni, Working Date: 23-12-2023

function PickupOrder() {
    const socket = useSocket();
    const [loading, setLoading] = useState(false);
    const [storeDetails, setStoreDetails] = useState();
    const [isShowConfirmPickup, setIsShowConfirmPickup] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [currentLatitude, setCurrentLatitude] = globalctx.currentLatitude;
    const [currentLogitude, setCurrentLogitude] = globalctx.currentLogitude;
    const [taxPercent, setTaxPercent] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [grand_total, setGrandTotal] = useState(0);
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;

    const [busyLoader, setBusyLoader] = useState(false);

    // API - Get Store Location
    const getStoreDetails = async () => {
        setLoading(true);
        await getStoreLocation({
            "lat": currentLatitude ?? '',
            "long": currentLogitude ?? ''
        })
            .then((res) => {
                setLoading(false);
                setStoreDetails(res.data);
                if (currentStoreCode && res?.data?.length > 0) {
                    const selectedStoreCode = res?.data?.find(
                        (data) => data?.code === currentStoreCode
                    );
                    setSelectedStore(selectedStoreCode);
                }
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 400 || err.response.status === 500) {
                    toast.error(err.response.data.message);
                }
            });
    };

    const handleChooseStore = (data) => {
        setLoading(true);
        setTimeout(() => {
            setSelectedStore(data);
            setIsShowConfirmPickup(false);
            setLoading(false);
        }, 500);
    };

    const handleBackToStore = () => {
        setLoading(true);
        setIsShowConfirmPickup(false);
        setLoading(false);
    };

   const handlePickupOrder = async () => {
    setBusyLoader(true);
    const baseUrl = window.location.origin;
    const payload = {
        customerCode: user?.data?.customerCode,
        deliveryType: "pickup",
        customerName: user?.data?.fullName,
        mobileNumber: user?.data?.mobileNumber,
        products: cart?.product,
        subTotal: cart?.subtotal,
        discountAmount: cart?.discountAmount,
        taxPer: taxPercent,
        taxAmount: taxAmount,
        deliveryCharges: Number(0).toFixed(2),
        extraDeliveryCharges: Number(0).toFixed(2),
        grandTotal: grand_total,
        storeCode: selectedStore?.code,
        successUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancel`,
    };
    
    try {
        const response = await orderPlace(payload);
        
        // Check socket before emitting
        if (socket) {
            const socketOrderData = response.data;
            socket.emit("order-place", socketOrderData);
        }
        
        localStorage.setItem("OrderID", response.orderCode);
        localStorage.setItem("sessionId", response.sessionId);
        
        if (response.paymentUrl) {
            window.location.href = response.paymentUrl;
        } else {
            toast.error("Payment URL not available. Please try again.");
            setBusyLoader(false);
        }
        setLoading(false);
    } catch (error) {
        setBusyLoader(false);
        setLoading(false);
        
        // FIXED: Check if error.response exists before accessing properties
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 500) {
                if (error.response.data?.isStoreError === true) {
                    swal({
                        title: "Store has been closed.",
                        text: `Unfortunately, placing an order is not possible at the moment. You can not place order right now.`,
                        icon: "warning",
                        buttons: "Ok",
                        dangerMode: true,
                    }).then(async (willOk) => {
                        if (willOk) {
                            navigate("/address-details");
                        }
                    });
                } else {
                    toast.error(error.response.data?.message || 'An error occurred');
                }
            } else {
                // Handle other HTTP status codes
                toast.error(`Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
            }
        } else {
   
            console.error('Network error or no response:', error);
            
            if (error.message) {
                if (error.message.includes('Network Error')) {
                    toast.error('Network error. Please check your internet connection.');
                } else if (error.message.includes('timeout')) {
                    toast.error('Request timed out. Please try again.');
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }
};




    const setDefaultData = (selectedStoreData) => {
        let tax_percent = Number(selectedStoreData?.province?.tax_percent).toFixed(2);
        let tax_amount = Number(cart?.subtotal * tax_percent * 0.01).toFixed(2);
        let cart_grand_amount = Number(cart?.grandtotal).toFixed(2);
        let grand_Amount = Number(+cart_grand_amount + +tax_amount).toFixed(2);
        setTaxAmount(tax_amount);
        setGrandTotal(grand_Amount);
        setTaxPercent(selectedStoreData?.province?.tax_percent);
    };

    useEffect(() => {
        if (selectedStore) {
            setDefaultData(selectedStore);
        }
    }, [selectedStore, isShowConfirmPickup]);

    useEffect(() => {
        setLoading(false);
        window.scrollTo(0, 0);
        getStoreDetails();
    }, []);
    return (
        <>
            {isShowConfirmPickup === false ? (
                <div className="relative">
                    <div className="row checkout_pg mb-3">
                        <p className="subTitleColor mb-1">Store Location : </p>
                        <p className="store-subheading mb-4">
                            Choose store location and click on continue.
                        </p>
                    </div>
                    <div className="row g-3 mb-3 justify-content-between">
                        <div className="col-md-7 col-lg-7">
                            {storeDetails
                                ?.sort((a, b) => {
                                    // Move the selected store to the top
                                    if (selectedStore && a.code === selectedStore.code) return -1;
                                    if (selectedStore && b.code === selectedStore.code) return 1;
                                    return 0; // Maintain order for other stores
                                })
                                .map((data) => {
                                    return (
                                        <div className="col-12 p-0 pb-2" key={data.code}>
                                            <div className="card mb-3 store_content shadow-sm">
                                                <div
                                                    className={`card-header py-2 text-start store_header ${selectedStore && data?.code === selectedStore.code
                                                        ? "logo-primary-background-color"
                                                        : ""
                                                        }`}
                                                    style={{
                                                        border: "none",
                                                        color: `${selectedStore && data?.code === selectedStore.code
                                                            ? "white"
                                                            : ""
                                                            }`,
                                                    }}
                                                >
                                                    {data.storeLocation}
                                                </div>
                                                <div className="card-body text-start">
                                                    {data.storeAddress}
                                                </div>
                                                <div
                                                    className="card-footer text-start bg-white"
                                                    style={{ border: "none" }}
                                                >
                                                    <button
                                                        className={`btn btn-sm chooseStoreBtn text-white px-3 mb-2 ${selectedStore && selectedStore?.code === data.code
                                                            ? "logo-primary-background-color"
                                                            : "bg-secondary"
                                                            }`}
                                                        onClick={() => {
                                                            handleChooseStore(data);
                                                        }}
                                                    >
                                                        {selectedStore && selectedStore?.code === data.code
                                                            ? "Selected"
                                                            : "Choose this store"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="col-md-5 col-lg-5 summary-unfixed-box">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 mb-2">
                                    <div className="block-stl10 odr-summary mb-0">
                                        <h3>Order Summary :</h3>
                                        <ul className="list-unstyled">
                                            <li>
                                                <span className="ttl">Sub Total</span>{" "}
                                                <span className="stts">
                                                    $ {cart?.subtotal ? cart?.subtotal : (0.0).toFixed(2)}
                                                </span>
                                            </li>
                                            {selectedStore && (
                                                <li>
                                                    <span className="ttl">
                                                        Tax Amount ({taxPercent}%)
                                                    </span>
                                                    <span className="stts">$ {taxAmount}</span>
                                                </li>
                                            )}
                                            <li className="d-none">
                                                <span className="ttl">Convenience Charges (%)</span>{" "}
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
                                                    $
                                                    {cart?.deliveryCharges
                                                        ? "$" + cart?.deliveryCharges
                                                        : "$" + Number(0).toFixed(2)}
                                                </span>
                                            </li>
                                        </ul>
                                        <div className="ttl-all" id="font-size">
                                            <span className="ttlnm">Grand Total</span>
                                            <span className="odr-stts total-font-size">
                                                $
                                                {selectedStore
                                                    ? grand_total
                                                    : cart?.grandtotal
                                                        ? cart?.grandtotal
                                                        : (0.0).toFixed(2)}
                                            </span>
                                        </div>
                                        {selectedStore && (
                                            <div className="mt-5 float-end">
                                                <button
                                                    className="btn btn-md regBtn"
                                                    onClick={() => setIsShowConfirmPickup(true)}
                                                >
                                                    Place my order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="summary-fixed-box">
                        <h3>Order Summary :</h3>
                        <div className="row">
                            <div className="col-12 filled-bx">
                                <span className="">Sub Total</span>
                                <span className="">
                                    ${cart?.subtotal ? cart?.subtotal : (0.0).toFixed(2)}
                                </span>
                            </div>
                            {selectedStore && (
                                <div className="col-12 filled-bx">
                                    <span className="">Tax Amount({taxPercent}%)</span>
                                    <span className="">${taxAmount}</span>
                                </div>
                            )}
                            <div className="col-12 filled-bx">
                                <strong className="text-grey">Grand Total</strong>
                                <strong className="text-grey">
                                    $
                                    {selectedStore
                                        ? grand_total
                                        : cart?.grandtotal
                                            ? cart?.grandtotal
                                            : (0.0).toFixed(2)}
                                </strong>
                            </div>
                            {selectedStore && (
                                <div className="col-12 mt-1">
                                    <button
                                        className="btn btn-md w-100 regBtn"
                                        onClick={() => setIsShowConfirmPickup(true)}
                                    >
                                        Place my order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row checkout_pg">
                        <p className="subTitleColor mb-4">Confirm & Place Order : </p>
                    </div>
                    <div className="row gx-4 mb-4">
                        <div className="col-lg-6 row">
                            <div className="col-12 pb-2">
                                <p className="mb-3 customerTxt">
                                    <strong className="mb-3 me-2">Selected Store : </strong>{" "}
                                    <span className="mb-3">{selectedStore?.storeLocation}</span>
                                </p>
                                <p className="mb-3 customerTxt">
                                    <strong className="mb-3 me-2">Customer Name : </strong>
                                    <span className="mb-3">{user?.data?.fullName}</span>
                                </p>
                                <p className="mb-3 customerTxt">
                                    <strong className="mb-3 me-2">Phone Number : </strong>
                                    <span className="mb-3">{user?.data?.mobileNumber}</span>
                                </p>
                            </div>
                            <hr />
                            <div className="col-12 pb-4">
                                <strong className="mb-3 me-4">Payment Mode : </strong>
                                <span className="mb-3 fw-bolder text-success">
                                    Online Payment
                                </span>
                            </div>
                            <hr />
                            <div className="col-lg-4 col-md-5 col-4 text-start">
                                <button
                                    className="btn btn-md btn-secondary"
                                    onClick={handleBackToStore}
                                >
                                    Back
                                </button>
                            </div>
                            <div className="col-lg-8 col-md-7 col-8 text-end">
                                {busyLoader ? (
                                    <button className="btn btn-md regBtn" type="button">
                                        Please wait <i class="fa fa-spinner fa-spin"></i>
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-md regBtn"
                                        onClick={handlePickupOrder}
                                    >
                                        Confirm & Place Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default PickupOrder;
