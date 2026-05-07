
import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import swal from "sweetalert";
import * as Yup from "yup";
import { GlobalContext } from "../context/GlobalContext";
import CartFunction from "../components/cart";
import { useSocket } from "../context/SocketContext";
import LoadingLayout from "../layouts/LoadingLayout";
import {
    cancelOrder,
    getPostalcodeList,
    getStoreLocationByCity,
    orderPlace
} from "../services";


const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;
const canadianPostalCode = Yup.string().test(
    "is-canadian-postal-code",
    "Invalid Canadian Postal Code",
    (value) => {
        if (!value) return true;
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\s\d[A-Za-z]\d$/i;
        return postalCodeRegex.test(value);
    }
);

const ValidateSchema = Yup.object({
    firstname: Yup.string()
        .required("First name is required")
        .matches(
            /^[A-Za-z\ ]+$/,
            "First name should only contain alphabetic characters, spaces"
        )
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name cannot be longer than 50 characters"),
    lastname: Yup.string()
        .required("Last name is required")
        .matches(
            /^[A-Za-z\ ]+$/,
            "Last name should only contain alphabetic characters, spaces"
        )
        .min(3, "Last name must be at least 3 characters")
        .max(50, "Last name cannot be longer than 50 characters"),
    phoneno: Yup.string()
        .required("Phone number is required")
        .matches(
            canadianPhoneNumberRegExp,
            "Invalid Canadian phone number format. Use (XXX) XXX-XXXX."
        ),
    city: Yup.string()
        .required("City is required")
        .matches(
            /^[A-Za-z\ ]+$/,
            "City name should only contain alphabetic characters, spaces"
        )
        .min(3, "City must be at least 3 characters")
        .max(50, "City cannot be longer than 50 characters"),
    postalcode: canadianPostalCode.required("Postal Code is Required"),
    address: Yup.string()
        .required("Address is required")
        .min(10, "Address must be at least 10 characters")
        .max(100, "Address cannot be longer than 100 characters"),
});

function AddressDetails() {
    const socket = useSocket();
    const user = useSelector((state) => state.user);
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
    const [currentCity, setCurrentCity] = globalctx.currentCity;
    const [currentStore, setCurrentStore] = globalctx.currentStore;

    const [postalCodeOp, setPostalCodeOp] = useState([]);
    const [loading, setLoading] = useState(false);

    const [taxRates, setTaxRates] = useState(null);
    const [readOnly, setReadOnly] = useState(false)

    const [selectedStore, setSelectedStore] = useState(null);
    const [cities, setCities] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    // NEW STATES FOR TIMER AND CANCEL LOGIC
    const [showOrderButtons, setShowOrderButtons] = useState(false);
    const [timer, setTimer] = useState(180); // 3 minutes in seconds
    const [timerActive, setTimerActive] = useState(false);
    const timerInterval = useRef(null);

    // NEW STATES FOR API RESPONSE
    const [orderResponse, setOrderResponse] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState("");
    const [apiPricing, setApiPricing] = useState(null);

    const [initialValues, setInitialValues] = useState({
        firstname: user?.data?.firstName,
        lastname: user?.data?.lastName,
        phoneno: user?.data?.mobileNumber,
        postalcode: "",
        city: "",
        address: "",
    });

    const navigate = useNavigate();

    const postalCodeList = async () => {
        if (formik.values.postalcode.length >= 3) {
            await getPostalcodeList({
                search: formik.values.postalcode,
            })
                .then((res) => {
                    setTimeout(() => {
                        setPostalCodeOp(res.data);
                    }, 200);
                })
                .catch((err) => {
                    if (err.response.status === 400 || err.response.status === 500) {
                        toast.error(err.response.data.message);
                    }
                });
        } else {
            setPostalCodeOp([]);
        }
    };

    // Fetch data from API
    const fetchData = async () => {
        try {
            const res = await getStoreLocationByCity();
            const cityOptions = res.data.map((item) => ({
                value: item.city,
                label: item.city,
                cityCode: item.cityCode,
                stores: item.storeLocations,
            }));
            setCities(cityOptions);
        } catch (error) {
            toast.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setSelectedCity(currentCity)
        setSelectedStore(currentStore)
        const storeOptions = currentCity?.stores.map((store) => ({
            value: store.code,
            label: store.storeLocation,
        }));
        setStores(storeOptions);
    }, [currentCity, currentStore])

    // Delivery charges are handled by Nash on the backend.
    // The orderPlace response (apiPricing) returns the Nash-calculated fee
    // which is already displayed in the Order Summary section below.

    // START TIMER FUNCTION
    const startTimer = () => {
        setTimer(180);
        setTimerActive(true);

        timerInterval.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    // Timer expired
                    handleTimerExpiry();
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    // STOP TIMER FUNCTION
    const stopTimer = () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
        setTimerActive(false);
        setTimer(180);
    };

    // HANDLE TIMER EXPIRY
    const handleTimerExpiry = async () => {
        const orderCode = localStorage.getItem("OrderID");

        if (orderCode) {
            try {
                await cancelOrder(orderCode);
                localStorage.removeItem("OrderID");
                localStorage.removeItem("sessionId");
            } catch (error) {
                // Silently ignore cancellation errors during timer expiry as it's automatic
            }
        }

        stopTimer();
        setShowOrderButtons(false);
        setReadOnly(false);
        setOrderResponse(null);
        setPaymentUrl("");
        setApiPricing(null);
    };

    // HANDLE CANCEL ORDER BUTTON
    const handleCancelOrder = async () => {
        const orderCode = localStorage.getItem("OrderID");

        if (!orderCode) {
            toast.error("Order not found to cancel.");
            return;
        }

        try {
            setLoading(true);

            const response = await cancelOrder(orderCode);

            toast.success(response.message || "Order cancelled successfully");

            // Cleanup
            localStorage.removeItem("OrderID");
            localStorage.removeItem("sessionId");

            stopTimer();
            setShowOrderButtons(false);
            setReadOnly(false);
            setOrderResponse(null);
            setPaymentUrl("");
            setApiPricing(null);

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to cancel order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // HANDLE CHANGE ADDRESS BUTTON
    const handleChangeAddress = () => {
        setReadOnly(false);
        if (showOrderButtons) {
            setShowOrderButtons(false);
            stopTimer();
        }
    };

    // HANDLE CONTINUE TO PAYMENT
    const handleContinueToPayment = () => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        } else {
            toast.error("Payment URL not available. Please try again.");
        }
    };

    // FORMAT TIMER DISPLAY (MM:SS)
    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // CLEANUP TIMER ON UNMOUNT
    useEffect(() => {
        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
        };
    }, []);

    // Handle city selection
    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setCurrentCity(selectedOption);
        localStorage.setItem('currentCity', JSON.stringify(selectedOption));
        setSelectedStore(null);
        setCurrentStore(null);
        setCurrentStoreCode(null);
        localStorage.setItem('currentStoreCode', null)
        localStorage.setItem('currentStore', null)
        const storeOptions = selectedOption.stores.map((store) => ({
            value: store.code,
            label: store.storeLocation,
        }));
        setStores(storeOptions);
    };

    // Handle store selection
    const handleStoreChange = (selectedOption) => {
        const fullStore = currentCity?.stores?.find(s => s.code === selectedOption.value);
        if (fullStore) {
            // Update the global selectedStore (full object) to trigger recalculation in GlobalContext
            globalctx.selectedStore[1](fullStore);
            localStorage.setItem('selectedStore', JSON.stringify(fullStore));
        }

        setCurrentStoreCode(selectedOption.value)
        setCurrentStore(selectedOption)
        localStorage.setItem('currentStoreCode', selectedOption.value)
        localStorage.setItem('currentStore', JSON.stringify(selectedOption))
        setSelectedStore(selectedOption);
        toast.success('Store selected successfully.');
    };

    const onSubmit = async (values) => {
        const cleanPostalCode = values.postalcode.replace(/\s/g, '');
        const payload = {
            zipcode: cleanPostalCode,
        };

        if (currentStoreCode === undefined || currentStoreCode === null) {
            toast.error('Please select the nearest store');
            return;
        }

        try {
            setLoading(true);

            // const storeResponse = await zipcodeServicable({
            //     zipcode: cleanPostalCode,
            //     storeCode: currentStoreCode
            // });

            // if (!storeResponse?.deliverable) {
            //     setLoading(false);
            //     return handleUndeliverable(
            //         "Postal Code is Undeliverable with selected store",
            //         "Postal code cannot be delivered. Please change the postal code or store and try again"
            //     );
            // }

            // const deliveryResponse = await deliverable(payload);
            // if (!deliveryResponse?.deliverable) {
            // setLoading(false);
            //     return handleUndeliverable(
            //         "Postal Code is Undeliverable",
            //         "Postal code cannot be delivered. Please change the postal code and try again"
            //     );
            // }

            // Set tax rates for reference
            // setTaxRates(deliveryResponse?.taxRates);

            // NOW CALL ORDER PLACE API
            const baseUrl = window.location.origin;
            let custFullName = values.firstname + " " + values.lastname;

            const orderPayload = {
                deviceType: "web",
                customerCode: user?.data?.customerCode,
                deliveryType: "delivery",
                customerName: custFullName,
                mobileNumber: values?.phoneno,
                address: values?.address,
                zipCode: values.postalcode,
                cityCode: selectedCity?.cityCode || currentCity?.cityCode || "",
                storeCode: currentStoreCode,
                products: cart?.product,
                subTotal: cart?.subtotal,
                discountAmount: cart?.discountAmount,
                //taxPer: deliveryResponse?.taxRates?.tax_percent || 0,
                // taxAmount: Number((cart?.subtotal || 0) * (deliveryResponse?.taxRates?.tax_percent || 0) * 0.01).toFixed(2),
                deliveryCharges: 0,          // Calculated by Nash on backend
                extraDeliveryCharges: 0,      // Set by Nash backend
                grandTotal: Number(cart?.grandtotal || 0).toFixed(2),
                successUrl: `${baseUrl}/payment/success`,
                cancelUrl: `${baseUrl}/payment/cancel`,
            };

            const orderResponse = await orderPlace(orderPayload);

            // Clear the cart immediately since the order is placed backend
            const cartFn = new CartFunction();
            cartFn.clearCart(setCart);

            // Emit socket event
            const socketOrderData = orderResponse.data;
            socket.emit("order-place", socketOrderData);

            // Store order details
            localStorage.setItem("OrderID", orderResponse.orderCode);
            localStorage.setItem("sessionId", orderResponse.sessionId);

            // Update state with API response
            setOrderResponse(orderResponse);
            setPaymentUrl(orderResponse.paymentUrl);
            setApiPricing(orderResponse.pricing);

            // Set readonly and show buttons
            setReadOnly(true);
            setShowOrderButtons(true);
            startTimer();

            toast.success("Order created successfully!");
            setLoading(false);

        } catch (error) {
            setLoading(false);

            if (error.response?.status === 400 || error.response?.status === 500) {
                if (error.response.data.isStoreError === true) {
                    swal({
                        title: "Store has been closed.",
                        text: `Unfortunately, placing an order is not possible at the moment. You can not place order right now.`,
                        icon: "warning",
                        buttons: "Ok",
                        dangerMode: true,
                    }).then(async (willOk) => {
                        if (willOk) {
                            navigate("/checkout");
                        }
                    });
                } else {
                    toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
                }
            } else {
                console.error("Unexpected error:", error);
                // toast.error("An unexpected error occurred.");
            }
        }
    };

    const handleUndeliverable = (title, text) => {
        swal({
            title,
            text,
            icon: "warning",
            buttons: {
                confirm: {
                    text: "OK",
                    value: true,
                    visible: true,
                    closeModal: true,
                },
            },
            dangerMode: true,
        }).then((willOk) => {
            if (willOk) {
                navigate("/checkout");
            }
        });
    };

    const handleUseAddress = () => {
        formik.setValues({
            ...formik.values,
            address: user?.data?.address,
            city: user?.data?.city,
            postalcode: user?.data?.zipcode,
        });
    };

    // Use Formik
    const formik = useFormik({
        initialValues: initialValues,
        validateOnBlur: true,
        validationSchema: ValidateSchema,
        enableReinitialize: true,
        onSubmit,
    });

    useEffect(() => {
        postalCodeList();
    }, [formik.values.postalcode]);


    if (loading) return <LoadingLayout />;

    return (
        <div className="relative" style={{ paddingBottom: "80px" }}>
            <div
                className="container-fluid container-lg d-flex justify-content-start align-items-start flex-column p-0 m-0"
                style={{ backgroundColor: "#ffffff" }}
            >
                <div className="row justify-content-start checkout_pg">
                    <div className="subTitleColor mb-2">Address Details For Checkout :</div>
                </div>

                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12">
                        <div className="row g-3">
                            <div className='col-12'>
                                <div className="d-flex justify-content-start align-items-center flex-row gap-3">
                                    <div>
                                        <strong className="">Payment Mode : </strong>
                                    </div>
                                    <div>
                                        <span className="fw-bolder text-success">
                                            Online Payment
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="fs-6 fw-bold text-secondary">Choose your nearest Store:</div>
                            </div>
                            {/* City Dropdown — locked to current city, prices vary per city */}
                            <div className='col-md-12 col-lg-6'>
                                <label htmlFor="city-select" className="form-label d-flex align-items-center gap-2">
                                    City:
                                    <small className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                                        🔒 Fixed to your selected city
                                    </small>
                                </label>
                                <Select
                                    id="city-select"
                                    options={cities}
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    placeholder="Select a city..."
                                    isSearchable={false}
                                    isDisabled={true}
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        container: (base) => ({ ...base, width: '100%' }),
                                        control: (base) => ({
                                            ...base,
                                            width: '100%',
                                            backgroundColor: '#f5f5f5',
                                            cursor: 'not-allowed',
                                            opacity: 0.75,
                                        }),
                                        menu: (base) => ({ ...base, width: '100%' }),
                                        singleValue: (base) => ({ ...base, color: '#666' }),
                                    }}
                                    aria-label="City Select"
                                />
                            </div>
                            {/* Store Dropdown — changeable to get correct tax/pricing breakdown */}
                            <div className='col-md-12 col-lg-6'>
                                <label htmlFor="store-select" className="form-label">Store:</label>
                                <Select
                                    id="store-select"
                                    options={stores}
                                    value={selectedStore}
                                    onChange={handleStoreChange}
                                    placeholder={
                                        selectedCity ? "Select a store..." : "Select a city first..."
                                    }
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        container: (base) => ({ ...base, width: '100%' }),
                                        control: (base) => ({ ...base, width: '100%' }),
                                        menu: (base) => ({ ...base, width: '100%' }),
                                    }}
                                    isSearchable
                                    isDisabled={!selectedCity}
                                    aria-label="Store Select"
                                />
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="mb-1">
                                    <small>Select your recent delivery address or enter a new one...</small>
                                </div>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row g-2">
                                        <div className="col-12 pb-3 Franborder-bottom">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-lg-8 col-md-7 col-12 text-wrap pb-2">
                                                            <span className="fw-bolder text-secondary delivery_addressTxt">
                                                                {user?.data?.address}, {user?.data?.city}, {user?.data?.zipcode}
                                                            </span>
                                                        </div>
                                                        <div className="col-lg-4 col-md-5 col-12 text-start text-md-end">
                                                            <button
                                                                className="btn btn-sm btn-secondary shadow-sm fw-bold"
                                                                type="button"
                                                                onClick={handleUseAddress}
                                                                disabled={readOnly}
                                                                style={{
                                                                    fontSize: "0.82rem",
                                                                }}
                                                            >
                                                                Use This Address
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <label className="form-label">
                                                Address <small className="text-danger">*</small>
                                            </label>
                                            <input
                                                className="form-control mb-1"
                                                type="text"
                                                name="address"
                                                disabled={readOnly}
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>

                                        {formik.touched.address && formik.errors.address ? (
                                            <div className="text-danger mt-1 mb-1">
                                                {formik.errors.address}
                                            </div>
                                        ) : null}

                                        {/* City */}
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <label className="form-label">
                                                City <small className="text-danger">*</small>
                                            </label>
                                            <input
                                                className="form-control mb-1"
                                                type="text"
                                                name="city"
                                                disabled={readOnly}
                                                value={formik.values.city}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.city && formik.errors.city ? (
                                                <div className="text-danger my-1">
                                                    {formik.errors.city}
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Postal Code */}
                                        <div className="col-lg-2 col-md-3 col-sm-12">
                                            <label className="form-label">
                                                Postal Code <small className="text-danger">*</small>
                                            </label>
                                            <input
                                                className="form-control mb-1"
                                                type="text"
                                                id="postalcode"
                                                name="postalcode"
                                                list="options"
                                                disabled={readOnly}
                                                placeholder=""
                                                onChange={formik.handleChange}
                                                value={formik.values.postalcode}
                                                autoComplete="off"
                                            />
                                            <datalist id="options">
                                                {postalCodeOp?.map((option) => {
                                                    const formattedZip = option.zipcode.slice(0, 3) + ' ' + option.zipcode.slice(3);
                                                    return (
                                                        <option
                                                            key={option.code}
                                                            value={formattedZip}
                                                        />
                                                    );
                                                })}
                                            </datalist>

                                            {formik.touched.postalcode &&
                                                formik.errors.postalcode ? (
                                                <div className="text-danger my-1">
                                                    {formik.errors.postalcode}
                                                </div>
                                            ) : null}
                                        </div>

                                        {!readOnly && <div className="d-grid mt-3 mb-2">
                                            <button
                                                className="py-2 fw-bold btn btn-lg"
                                                type="submit"
                                                style={{
                                                    background: 'var(--primary, #2d7a2d)',
                                                    color: '#fff',
                                                    borderRadius: '10px',
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                🚚 Confirm Address &amp; Place Order
                                            </button>
                                            <small className="text-muted text-center mt-2">
                                                Your delivery charges will be calculated at checkout
                                            </small>
                                        </div>}
                                        {readOnly && !showOrderButtons && <div className="d-flex gap-4 mb-2">
                                            <button
                                                className="py-2 fw-bold btn btn-md regBtn"
                                                type="button"
                                                onClick={handleChangeAddress}
                                            >
                                                Change address
                                            </button>
                                        </div>}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 px-2 summary-unfixed-box">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-2">
                                <div className="block-stl10 odr-summary mb-0">
                                    <h3>Order Summary :</h3>
                                    <ul className="list-unstyled">
                                        {/* Sub Total - Always show */}
                                        <li>
                                            <span className="ttl">Sub Total</span>
                                            <span className="stts">
                                                $ {apiPricing?.subTotal
                                                    ? Number(apiPricing.subTotal).toFixed(2)
                                                    : cart?.subtotal
                                                        ? cart.subtotal
                                                        : (0.0).toFixed(2)}
                                            </span>
                                        </li>

                                        {/* Tax Amount - Only if > 0 */}
                                        {(apiPricing?.taxAmount || cart?.taxAmount) && Number(apiPricing?.taxAmount || cart?.taxAmount) > 0 && (
                                            <li>
                                                <span className="ttl">
                                                    Tax Amount ({apiPricing?.taxPer || cart?.taxPer || 0}%)
                                                </span>
                                                <span className="stts">
                                                    $ {Number(apiPricing?.taxAmount || cart?.taxAmount).toFixed(2)}
                                                </span>
                                            </li>
                                        )}

                                        {/* Discount Amount - Only if > 0 */}
                                        {apiPricing?.discountAmount && Number(apiPricing.discountAmount) > 0 && (
                                            <li>
                                                <span className="ttl">Discount</span>
                                                <span className="stts">
                                                    $ {Number(apiPricing.discountAmount).toFixed(2)}
                                                </span>
                                            </li>
                                        )}

                                        {/* Convenience Charges - Only if > 0 */}
                                        {(apiPricing?.convinenceCharges || cart?.convinenceCharges) && Number(apiPricing?.convinenceCharges || cart?.convinenceCharges) > 0 && (
                                            <li>
                                                <span className="ttl">Convenience Fee ({apiPricing?.convinencePer || cart?.convinencePer || 0}%)</span>
                                                <span className="stts">
                                                    $ {Number(apiPricing?.convinenceCharges || cart?.convinenceCharges).toFixed(2)}
                                                </span>
                                            </li>
                                        )}

                                        {/* Delivery Charges - Only if > 0 */}
                                        {(apiPricing?.deliveryCharges || cart?.deliveryCharges) && Number(apiPricing?.deliveryCharges || cart?.deliveryCharges) > 0 && (
                                            <li>
                                                <span className="ttl">Delivery Charges</span>
                                                <span className="stts">
                                                    $ {Number(apiPricing?.deliveryCharges || cart?.deliveryCharges).toFixed(2)}
                                                </span>
                                            </li>
                                        )}

                                        {/* Extra Delivery Charges - Only if > 0 */}
                                        {apiPricing?.extraDeliveryCharges && Number(apiPricing.extraDeliveryCharges) > 0 && (
                                            <li>
                                                <span className="ttl">Extra Delivery Charges</span>
                                                <span className="stts">
                                                    $ {Number(apiPricing.extraDeliveryCharges).toFixed(2)}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="ttl-all" id="font-size" >
                                        <span className="ttlnm">Grand Total</span>
                                        <span className="odr-stts total-font-size" >
                                            $ {apiPricing?.grandTotal
                                                ? Number(apiPricing.grandTotal).toFixed(2)
                                                : cart?.grandtotal
                                                    ? Number(cart.grandtotal).toFixed(2)
                                                    : (0.0).toFixed(2)}
                                        </span>
                                    </div>
                                    {readOnly && showOrderButtons && (
                                        <div className="mt-3">
                                            <div className="text-center mb-3">
                                                <div className="fw-bold text-danger">
                                                    Time remaining: {formatTimer(timer)}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button
                                                    className="py-2 fw-bold btn btn-md btn-danger"
                                                    type="button"
                                                    onClick={handleCancelOrder}
                                                >
                                                    Cancel Order
                                                </button>
                                                <button
                                                    className="py-2 fw-bold btn btn-md btn-success"
                                                    type="button"
                                                    onClick={handleContinueToPayment}
                                                >
                                                    Continue to Payment
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* summary fixed box on mobile screen only*/}
            <div className="summary-fixed-box">
                <h3>Order Summary :</h3>
                <div className="row">
                    {/* Sub Total - Always show */}
                    <div className="col-12 filled-bx">
                        <span className="">Sub Total</span>
                        <span className="">
                            $ {apiPricing?.subTotal
                                ? Number(apiPricing.subTotal).toFixed(2)
                                : cart?.subtotal
                                    ? cart.subtotal
                                    : (0.0).toFixed(2)}
                        </span>
                    </div>

                    {/* Tax Amount - Only if > 0 */}
                    {apiPricing?.taxAmount && Number(apiPricing.taxAmount) > 0 && (
                        <div className="col-12 filled-bx">
                            <span className="">
                                Tax Amount ({apiPricing?.taxPer || 0}%)
                            </span>
                            <span className="">
                                $ {Number(apiPricing.taxAmount).toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Discount Amount - Only if > 0 */}
                    {apiPricing?.discountAmount && Number(apiPricing.discountAmount) > 0 && (
                        <div className="col-12 filled-bx">
                            <span className="">Discount</span>
                            <span className="">
                                $ {Number(apiPricing.discountAmount).toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Convenience Charges - Only if > 0 */}
                    {apiPricing?.convinenceCharges && Number(apiPricing.convinenceCharges) > 0 && (
                        <div className="col-12 filled-bx">
                            <span className="">Convenience Charges ({apiPricing?.convinencePer || 0}%)</span>
                            <span className="">
                                $ {Number(apiPricing.convinenceCharges).toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Delivery Charges - Only if > 0 */}
                    {apiPricing?.deliveryCharges && Number(apiPricing.deliveryCharges) > 0 && (
                        <div className="col-12 filled-bx">
                            <span className="">Delivery Charges</span>
                            <span className="">
                                $ {Number(apiPricing.deliveryCharges).toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Extra Delivery Charges - Only if > 0 */}
                    {apiPricing?.extraDeliveryCharges && Number(apiPricing.extraDeliveryCharges) > 0 && (
                        <div className="col-12 filled-bx">
                            <span className="">Extra Delivery Charges</span>
                            <span className="">
                                $ {Number(apiPricing.extraDeliveryCharges).toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Grand Total - Always show */}
                    <div className="col-12 filled-bx">
                        <strong className="text-grey">Grand Total</strong>
                        <strong className="text-grey">
                            $ {apiPricing?.grandTotal
                                ? Number(apiPricing.grandTotal).toFixed(2)
                                : cart?.grandtotal
                                    ? Number(cart.grandtotal).toFixed(2)
                                    : (0.0).toFixed(2)}
                        </strong>
                    </div>

                    {readOnly && showOrderButtons && (
                        <div className="col-12 mt-1">
                            <div className="text-center mb-2">
                                <div className="fw-bold text-danger">
                                    Time remaining: {formatTimer(timer)}
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-danger flex-fill"
                                    type="button"
                                    onClick={handleCancelOrder}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-sm regBtn flex-fill"
                                    type="button"
                                    onClick={handleContinueToPayment}
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddressDetails;