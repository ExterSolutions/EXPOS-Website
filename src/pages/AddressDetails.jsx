
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
import { useNashQuote } from '../hooks/useNashQuote';
import { CountdownTimer } from '../components/CountdownTimer';


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
    const [globalSelectedStore] = globalctx.selectedStore; // has cityCode from store-picker popup

    const [postalCodeOp, setPostalCodeOp] = useState([]);
    const [loading, setLoading] = useState(false);

    const [taxRates, setTaxRates] = useState(null);
    const [readOnly, setReadOnly] = useState(false)

    const [selectedStore, setSelectedStore] = useState(null);
    const [cities, setCities] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    // Timer / flow states
    const [showOrderButtons, setShowOrderButtons] = useState(false);
    const [timerKey, setTimerKey] = useState(0);   // increment to restart CountdownTimer
    const [showTimer, setShowTimer] = useState(false);
    const [isQuoteExpired, setIsQuoteExpired] = useState(false); // shows "Quote expired. Refreshing…" banner

    // Nash delivery quote hook
    const nashQuote = useNashQuote();

    // API response states
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

    // Once cities are fetched, enrich selectedCity with cityCode if stale localStorage lacked it
    useEffect(() => {
        if (cities.length > 0 && selectedCity && !selectedCity.cityCode) {
            const match = cities.find(c => c.value === selectedCity.value);
            if (match?.cityCode) {
                const enriched = { ...selectedCity, cityCode: match.cityCode };
                setSelectedCity(enriched);
                setCurrentCity(enriched);
                localStorage.setItem('currentCity', JSON.stringify(enriched));
            }
        }
    }, [cities, selectedCity]);

    useEffect(() => {
        setSelectedCity(currentCity)
        setSelectedStore(currentStore)
        const storeOptions = currentCity?.stores.map((store) => ({
            value: store.code,
            label: store.storeLocation,
        }));
        setStores(storeOptions);
    }, [currentCity, currentStore])

    // Delivery charges are fetched live from Nash via useNashQuote hook.
    // startTimer / stopTimer replaced by CountdownTimer component + timerKey state.
    const startPriceLock = () => {
        setTimerKey((k) => k + 1); // CountdownTimer resets when key changes
        setShowTimer(true);
    };

    const stopPriceLock = () => setShowTimer(false);

    // HANDLE TIMER EXPIRY  — cancel stale order, re-fetch quote, show expired banner
    const handleTimerExpiry = async () => {
        const orderCode = localStorage.getItem("OrderID");
        if (orderCode) {
            try {
                await cancelOrder(orderCode);
                localStorage.removeItem("OrderID");
                localStorage.removeItem("sessionId");
            } catch (_) { /* silent */ }
        }

        stopPriceLock();
        setShowOrderButtons(false);
        setReadOnly(false);
        setOrderResponse(null);
        setPaymentUrl("");
        setApiPricing(null);

        // Show "Quote expired. Refreshing delivery charges…" and re-fetch
        setIsQuoteExpired(true);
        try {
            await nashQuote.refresh(); // re-uses last address params
        } finally {
            setIsQuoteExpired(false);
        }
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
            setNashQuote(null);

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
            stopPriceLock();
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

    // CountdownTimer manages its own cleanup — nothing extra needed on unmount.

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

            // Use the already-fetched Nash delivery fee from the hook.
            // Auto-fetch runs automatically when address+postalcode are filled (see useEffect below).
            // If hook hasn't loaded yet, fall back to 0 — cashier can adjust on acceptance.
            const deliveryFee = nashQuote.deliveryFee || 0;

            // NOW CALL ORDER PLACE API
            const baseUrl = window.location.origin;
            let custFullName = values.firstname + " " + values.lastname;

            // Grand total = cart total + Nash delivery fee
            const cartTotal = Number(cart?.grandtotal || 0);
            const finalGrandTotal = Number(cartTotal + deliveryFee).toFixed(2);

            const orderPayload = {
                deviceType: "web",
                customerCode: user?.data?.customerCode,
                deliveryType: "delivery",
                customerName: custFullName,
                mobileNumber: values?.phoneno,
                address: values?.address,
                zipCode: values.postalcode,
                cityCode: selectedCity?.cityCode
                    || currentCity?.cityCode
                    || cities.find(c => c.value === (selectedCity?.value || currentCity?.value))?.cityCode
                    || globalSelectedStore?.cityCode
                    || "",
                storeCode: currentStoreCode,
                products: cart?.product,
                subTotal: cart?.subtotal,
                discountAmount: cart?.discountAmount,
                deliveryCharges: deliveryFee,           // Nash delivery fee (from quote)
                extraDeliveryCharges: 0,
                grandTotal: finalGrandTotal,            // cart total + delivery fee → Stripe charges this
                successUrl: `${baseUrl}/payment/success`,
                cancelUrl: `${baseUrl}/payment/cancel`,
            };

            const orderResponse = await orderPlace(orderPayload);

            // Clear the cart immediately since the order is placed backend
            const cartFn = new CartFunction();
            cartFn.clearCart(setCart);

            // NOTE: We do NOT emit a socket event here.
            // The bell is triggered by the Stripe webhook AFTER payment is confirmed:
            //   Stripe → Laravel WebhookController → GET /order/place/customer on socket server
            //   → socket broadcasts "order-by-client" → cashier POS bell rings.
            // Emitting here (before payment) would ring the bell for unpaid orders,
            // and socket events are not queued — a missed event is gone forever.

            // Store order details + full context for socket safety-net in PaymentSuccess
            localStorage.setItem("OrderID", orderResponse.orderCode);
            localStorage.setItem("sessionId", orderResponse.sessionId);
            localStorage.setItem("pendingOrderMeta", JSON.stringify({
                orderCode: orderResponse.orderCode,
                orderNumber: orderResponse.orderNumber,
                storeCode: currentStoreCode,
                customerName: custFullName,
                phoneNumber: values?.phoneno,
                deliveryType: "delivery",
                orderFrom: "online",
                grandTotal: orderResponse?.pricing?.grandTotal || finalGrandTotal,  // use backend-confirmed total
                status: "pending",
            }));

            // Update state with API response
            setOrderResponse(orderResponse);
            setPaymentUrl(orderResponse.paymentUrl);
            setApiPricing(orderResponse.pricing);

            // Lock form and start 3-minute price-lock countdown
            setReadOnly(true);
            setShowOrderButtons(true);
            startPriceLock();

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

    // ── Auto-fetch Nash delivery quote when address + postal code are ready ───────────
    // Debounced 900ms so we don't spam the Nash API while the user is typing.
    // Only runs when the form is NOT locked (readOnly=false) so we don't re-fetch
    // mid-payment. The hook's refresh() handles the post-expiry re-fetch instead.
    useEffect(() => {
        const addr   = formik.values.address   || '';
        const city   = formik.values.city       || '';
        const postal = formik.values.postalcode || '';
        const phone  = formik.values.phoneno   || '';

        if (readOnly || addr.length < 10 || postal.length < 5 || !currentStoreCode) return;

        const t = setTimeout(() => {
            nashQuote.fetchQuote({
                address:    addr,
                city:       city,
                postalcode: postal,
                phoneno:    phone,
                storeCode:  currentStoreCode,
                orderValue: cart?.subtotal || 0,
            });
        }, 900);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.address, formik.values.city, formik.values.postalcode, currentStoreCode, readOnly]);


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
                                                disabled={nashQuote.loading}
                                                style={{
                                                    background: nashQuote.loading ? '#aaa' : 'var(--primary, #2d7a2d)',
                                                    color: '#fff',
                                                    borderRadius: '10px',
                                                    fontSize: '1rem',
                                                    transition: 'background 0.3s',
                                                }}
                                            >
                                                {nashQuote.loading ? '⏳ Calculating delivery…' : '🔒 Confirm & Pay'}
                                            </button>
                                            {!nashQuote.loading && !nashQuote.data && (
                                                <small className="text-muted text-center mt-2">
                                                    Enter your address above to see the delivery fee
                                                </small>
                                            )}
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

                                        {/* Delivery Charges — shimmer while loading, confirmed value once fetched */}
                                        {nashQuote.loading ? (
                                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span className="ttl">Delivery Charges</span>
                                                <span style={{
                                                    display: 'inline-block', width: '70px', height: '16px',
                                                    borderRadius: '4px', background: 'linear-gradient(90deg,#e0e0e0 25%,#f5f5f5 50%,#e0e0e0 75%)',
                                                    backgroundSize: '200% 100%',
                                                    animation: 'shimmer 1.4s infinite linear',
                                                }} />
                                            </li>
                                        ) : (() => {
                                            const fee = apiPricing?.deliveryCharges
                                                ?? (nashQuote.data?.delivery_fee_cents ? nashQuote.data.delivery_fee_cents / 100 : null)
                                                ?? cart?.deliveryCharges;
                                            return fee && Number(fee) > 0 ? (
                                                <li>
                                                    <span className="ttl">
                                                        Delivery Charges
                                                        {nashQuote.data && !apiPricing && (
                                                            <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
                                                                (est. via {nashQuote.data.provider || 'courier'})
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="stts">$ {Number(fee).toFixed(2)}</span>
                                                </li>
                                            ) : null;
                                        })()}

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
                                    <div className="ttl-all" id="font-size">
                                        <span className="ttlnm">Grand Total</span>
                                        {nashQuote.loading && !apiPricing ? (
                                            <span style={{
                                                display: 'inline-block', width: '90px', height: '22px',
                                                borderRadius: '4px', background: 'linear-gradient(90deg,#e0e0e0 25%,#f5f5f5 50%,#e0e0e0 75%)',
                                                backgroundSize: '200% 100%',
                                                animation: 'shimmer 1.4s infinite linear',
                                                verticalAlign: 'middle',
                                            }} />
                                        ) : (
                                            <span className="odr-stts total-font-size">
                                                $ {apiPricing?.grandTotal
                                                    ? Number(apiPricing.grandTotal).toFixed(2)
                                                    : nashQuote.deliveryFee > 0
                                                        ? Number(Number(cart?.grandtotal || 0) + nashQuote.deliveryFee).toFixed(2)
                                                        : cart?.grandtotal
                                                            ? Number(cart.grandtotal).toFixed(2)
                                                            : (0.0).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {/* Quote-expired banner */}
                                    {isQuoteExpired && (
                                        <div style={{
                                            marginTop: '10px', padding: '10px 14px',
                                            borderRadius: '8px', background: '#fff3cd',
                                            border: '1px solid #ffc107', color: '#856404',
                                            fontSize: '13px', textAlign: 'center',
                                        }}>
                                            ⚠️ Quote expired. Refreshing delivery charges…
                                        </div>
                                    )}

                                    {readOnly && showOrderButtons && showTimer && (
                                        <div className="mt-3">
                                            <div className="text-center mb-3">
                                                <CountdownTimer
                                                    durationSeconds={180}
                                                    resetKey={timerKey}
                                                    onExpire={handleTimerExpiry}
                                                    label="Price locked for"
                                                />
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
                                                    Proceed to Payment →
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

                    {readOnly && showOrderButtons && showTimer && (
                        <div className="col-12 mt-1">
                            <div className="text-center mb-2">
                                <CountdownTimer
                                    durationSeconds={180}
                                    resetKey={timerKey}
                                    onExpire={handleTimerExpiry}
                                    label="Price locked for"
                                />
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
                                    Proceed to Payment
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