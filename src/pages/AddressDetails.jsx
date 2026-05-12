
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

    /* ── Shared delivery-fee resolution (used in both columns) ── */
    const confirmedFee  = apiPricing?.deliveryCharges;
    const estimatedFee  = nashQuote.data?.delivery_fee_cents != null
        ? nashQuote.data.delivery_fee_cents / 100 : null;
    const cartFee       = cart?.deliveryCharges;
    const resolvedFee   = confirmedFee ?? estimatedFee ?? cartFee;

    const grandTotal = apiPricing?.grandTotal
        ? Number(apiPricing.grandTotal)
        : nashQuote.deliveryFee > 0
            ? Number(cart?.grandtotal || 0) + nashQuote.deliveryFee
            : Number(cart?.grandtotal || 0);

    /* ── Reusable: Order Summary lines ── */
    const SummaryLines = () => (
        <>
            {/* Sub Total */}
            <div className="chk-line">
                <span>Sub Total</span>
                <span>$ {apiPricing?.subTotal
                    ? Number(apiPricing.subTotal).toFixed(2)
                    : cart?.subtotal ? cart.subtotal : '0.00'}</span>
            </div>

            {/* Tax */}
            {(apiPricing?.taxAmount || cart?.taxAmount) && Number(apiPricing?.taxAmount || cart?.taxAmount) > 0 && (
                <div className="chk-line">
                    <span>Tax ({apiPricing?.taxPer || cart?.taxPer || 0}%)</span>
                    <span>$ {Number(apiPricing?.taxAmount || cart?.taxAmount).toFixed(2)}</span>
                </div>
            )}

            {/* Discount */}
            {apiPricing?.discountAmount && Number(apiPricing.discountAmount) > 0 && (
                <div className="chk-line chk-line--discount">
                    <span>Discount</span>
                    <span>− $ {Number(apiPricing.discountAmount).toFixed(2)}</span>
                </div>
            )}

            {/* Convenience Fee */}
            {(apiPricing?.convinenceCharges || cart?.convinenceCharges) && Number(apiPricing?.convinenceCharges || cart?.convinenceCharges) > 0 && (
                <div className="chk-line">
                    <span>Convenience Fee ({apiPricing?.convinencePer || cart?.convinencePer || 0}%)</span>
                    <span>$ {Number(apiPricing?.convinenceCharges || cart?.convinenceCharges).toFixed(2)}</span>
                </div>
            )}

            {/* Delivery — always visible */}
            <div className="chk-line chk-line--delivery">
                <span>
                    Delivery Charges
                    {estimatedFee != null && !confirmedFee && (
                        <span className="chk-est-badge">est. · {nashQuote.data?.provider || 'courier'}</span>
                    )}
                </span>
                {nashQuote.loading ? (
                    <span className="chk-shimmer" style={{ width: 60 }} />
                ) : resolvedFee != null ? (
                    <span>$ {Number(resolvedFee).toFixed(2)}</span>
                ) : (
                    <span className="chk-pending-fee">Enter address ↑</span>
                )}
            </div>

            {/* Extra Delivery */}
            {apiPricing?.extraDeliveryCharges && Number(apiPricing.extraDeliveryCharges) > 0 && (
                <div className="chk-line">
                    <span>Extra Delivery</span>
                    <span>$ {Number(apiPricing.extraDeliveryCharges).toFixed(2)}</span>
                </div>
            )}
        </>
    );

    return (
        <div className="chk-page">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="chk-header">
                <div className="chk-header__inner">
                    <div>
                        <h1 className="chk-header__title">🔒 Secure Checkout</h1>
                        <p className="chk-header__sub">Delivery Order · Online Payment</p>
                    </div>
                    <div className="chk-header__trust">
                        <span className="chk-trust-badge">🛡️ SSL Encrypted</span>
                        <span className="chk-trust-badge">💳 Secure Payment</span>
                    </div>
                </div>
                <div className="chk-progress">
                    <div className="chk-progress__step chk-progress__step--active">① Address</div>
                    <div className="chk-progress__divider">›</div>
                    <div className="chk-progress__step">② Review</div>
                    <div className="chk-progress__divider">›</div>
                    <div className="chk-progress__step">③ Payment</div>
                </div>
            </div>

            {/* ── Two-column layout ────────────────────────────────────── */}
            <div className="chk-layout">

                {/* ── LEFT: Form ─────────────────────────────────────── */}
                <div className="chk-form-col">

                    {/* Store selector card */}
                    <div className="chk-card">
                        <div className="chk-card__header">🏪 Choose Your Store</div>
                        <div className="chk-store-row">
                            <div className="chk-field-wrap">
                                <label htmlFor="city-select" className="chk-label">
                                    City
                                    <span className="chk-locked-chip">🔒 Fixed</span>
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
                                        menuPortal: (b) => ({ ...b, zIndex: 9999 }),
                                        container: (b) => ({ ...b, width: '100%' }),
                                        control: (b) => ({ ...b, width: '100%', backgroundColor: '#f5f5f5', cursor: 'not-allowed', opacity: 0.75, borderRadius: '10px', minHeight: '44px' }),
                                        menu: (b) => ({ ...b, width: '100%' }),
                                        singleValue: (b) => ({ ...b, color: '#666' }),
                                    }}
                                    aria-label="City Select"
                                />
                            </div>
                            <div className="chk-field-wrap">
                                <label htmlFor="store-select" className="chk-label">Store</label>
                                <Select
                                    id="store-select"
                                    options={stores}
                                    value={selectedStore}
                                    onChange={handleStoreChange}
                                    placeholder={selectedCity ? "Select a store..." : "Select a city first..."}
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (b) => ({ ...b, zIndex: 9999 }),
                                        container: (b) => ({ ...b, width: '100%' }),
                                        control: (b) => ({ ...b, width: '100%', borderRadius: '10px', minHeight: '44px' }),
                                        menu: (b) => ({ ...b, width: '100%' }),
                                    }}
                                    isSearchable
                                    isDisabled={!selectedCity}
                                    aria-label="Store Select"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address form card */}
                    <div className="chk-card">
                        <div className="chk-card__header">📍 Delivery Address</div>

                        {/* Saved address shortcut */}
                        {user?.data?.address && (
                            <div className="chk-saved-addr">
                                <div className="chk-saved-addr__text">
                                    📌 {user.data.address}, {user.data.city}, {user.data.zipcode}
                                </div>
                                <button
                                    className="chk-saved-addr__btn"
                                    type="button"
                                    onClick={handleUseAddress}
                                    disabled={readOnly}
                                >
                                    Use This Address
                                </button>
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit}>
                            <div className="chk-field-grid">

                                {/* Street Address */}
                                <div className="chk-field chk-field--full">
                                    <label className="chk-label">
                                        Street Address <span className="chk-required">*</span>
                                    </label>
                                    <div className="chk-input-wrap">
                                        <span className="chk-input-icon">📍</span>
                                        <input
                                            className={`chk-input${formik.touched.address && formik.errors.address ? ' chk-input--error' : ''}`}
                                            type="text"
                                            name="address"
                                            placeholder="e.g. 123 Main Street"
                                            disabled={readOnly}
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                    {formik.touched.address && formik.errors.address && (
                                        <span className="chk-error-msg">{formik.errors.address}</span>
                                    )}
                                </div>

                                {/* City */}
                                <div className="chk-field">
                                    <label className="chk-label">
                                        City <span className="chk-required">*</span>
                                    </label>
                                    <input
                                        className={`chk-input${formik.touched.city && formik.errors.city ? ' chk-input--error' : ''}`}
                                        type="text"
                                        name="city"
                                        placeholder="e.g. Brampton"
                                        disabled={readOnly}
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.city && formik.errors.city && (
                                        <span className="chk-error-msg">{formik.errors.city}</span>
                                    )}
                                </div>

                                {/* Postal Code */}
                                <div className="chk-field">
                                    <label className="chk-label">
                                        Postal Code <span className="chk-required">*</span>
                                    </label>
                                    <input
                                        className={`chk-input${formik.touched.postalcode && formik.errors.postalcode ? ' chk-input--error' : ''}`}
                                        type="text"
                                        id="postalcode"
                                        name="postalcode"
                                        list="postal-options"
                                        placeholder="e.g. L6X 4L9"
                                        disabled={readOnly}
                                        value={formik.values.postalcode}
                                        onChange={formik.handleChange}
                                        autoComplete="off"
                                    />
                                    <datalist id="postal-options">
                                        {postalCodeOp?.map((option) => {
                                            const formatted = option.zipcode.slice(0, 3) + ' ' + option.zipcode.slice(3);
                                            return <option key={option.code} value={formatted} />;
                                        })}
                                    </datalist>
                                    {formik.touched.postalcode && formik.errors.postalcode && (
                                        <span className="chk-error-msg">{formik.errors.postalcode}</span>
                                    )}
                                </div>

                            </div>

                            {/* Quote hint */}
                            {!readOnly && !nashQuote.loading && !nashQuote.data && (
                                <div className="chk-quote-hint">
                                    💡 Enter your address above — delivery fee will calculate automatically
                                </div>
                            )}

                            {/* Confirm & Pay button */}
                            {!readOnly && (
                                <button
                                    type="submit"
                                    id="chk-confirm-btn"
                                    className={`chk-cta-btn${nashQuote.loading ? ' chk-cta-btn--loading' : ''}`}
                                    disabled={nashQuote.loading}
                                >
                                    {nashQuote.loading
                                        ? <><span className="chk-spinner" /> Calculating delivery fee…</>
                                        : '🔒 Confirm & Pay'}
                                </button>
                            )}

                            {/* Change address button */}
                            {readOnly && !showOrderButtons && (
                                <button
                                    type="button"
                                    className="chk-change-btn"
                                    onClick={handleChangeAddress}
                                >
                                    ✏️ Change Address
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* ── RIGHT: Order Summary ────────────────────────────── */}
                <div className="chk-summary-col">
                    <div className="chk-summary-card">
                        <div className="chk-summary-card__header">
                            <span>ORDER SUMMARY</span>
                            {cart?.totalQuantity > 0 && (
                                <span className="chk-summary-badge">{cart.totalQuantity} item{cart.totalQuantity !== 1 ? 's' : ''}</span>
                            )}
                        </div>

                        <div className="chk-summary-lines">
                            <SummaryLines />
                        </div>

                        <div className="chk-summary-total">
                            <span>Grand Total</span>
                            {nashQuote.loading && !apiPricing ? (
                                <span className="chk-shimmer" style={{ width: 80, height: 26 }} />
                            ) : (
                                <span className="chk-summary-total__amount">
                                    {!apiPricing && !nashQuote.data && !cart?.deliveryCharges && (
                                        <span className="chk-plus-delivery">+ delivery</span>
                                    )}
                                    $ {grandTotal.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Quote-expired banner */}
                        {isQuoteExpired && (
                            <div className="chk-expired-banner">
                                ⚠️ Quote expired. Refreshing delivery charges…
                            </div>
                        )}

                        {/* Price-lock timer + action buttons */}
                        {readOnly && showOrderButtons && showTimer && (
                            <div className="chk-timer-section">
                                <div className="chk-timer-section__label">Price locked for:</div>
                                <CountdownTimer
                                    durationSeconds={180}
                                    resetKey={timerKey}
                                    onExpire={handleTimerExpiry}
                                    label="Price locked for"
                                />
                                <div className="chk-action-row">
                                    <button
                                        className="chk-btn-cancel"
                                        type="button"
                                        onClick={handleCancelOrder}
                                    >
                                        Cancel Order
                                    </button>
                                    <button
                                        className="chk-btn-pay"
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

            {/* ── Mobile sticky CTA bar ───────────────────────────────── */}
            {!readOnly && (
                <div className="chk-mobile-bar">
                    <div className="chk-mobile-bar__total">
                        <span className="chk-mobile-bar__label">Total</span>
                        <span className="chk-mobile-bar__amount">
                            {nashQuote.loading ? '…' : `$ ${grandTotal.toFixed(2)}`}
                            {!apiPricing && !nashQuote.data && (
                                <span className="chk-mobile-bar__hint"> + delivery</span>
                            )}
                        </span>
                    </div>
                    <button
                        className={`chk-mobile-bar__btn${nashQuote.loading ? ' chk-mobile-bar__btn--loading' : ''}`}
                        form="chk-confirm-form"
                        onClick={() => formik.handleSubmit()}
                        disabled={nashQuote.loading}
                        type="button"
                    >
                        {nashQuote.loading ? '⏳ Calculating…' : '🔒 Confirm & Pay'}
                    </button>
                </div>
            )}

            {/* Mobile timer + action buttons (when price locked) */}
            {readOnly && showOrderButtons && showTimer && (
                <div className="chk-mobile-bar chk-mobile-bar--timer">
                    <CountdownTimer
                        durationSeconds={180}
                        resetKey={timerKey}
                        onExpire={handleTimerExpiry}
                        label="Price locked for"
                    />
                    <div className="chk-action-row chk-action-row--mobile">
                        <button className="chk-btn-cancel" type="button" onClick={handleCancelOrder}>Cancel</button>
                        <button className="chk-btn-pay" type="button" onClick={handleContinueToPayment}>Pay →</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AddressDetails;

