
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
import KitchenClosedModal from '../components/common/KitchenClosedModal';
import AddressAutofill, { extractCanadianAddressParts } from '../components/common/AddressAutofill';


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
            /^[A-Za-z\s.\-']+$/,
            "City name should only contain alphabetic characters, spaces"
        )
        .min(2, "City must be at least 2 characters")
        .max(50, "City cannot be longer than 50 characters"),
    postalcode: canadianPostalCode.required("Postal Code is Required"),
    address: Yup.string()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters")
        .max(100, "Address cannot be longer than 100 characters"),
    deliveryInstructions: Yup.string()
        .max(300, "Delivery instructions cannot exceed 300 characters")
        .nullable(),
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
    const storeOpen = globalctx.storeOpen; // reactive — no race condition

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
    const [showKitchenClosed, setShowKitchenClosed] = useState(false);

    const [initialValues, setInitialValues] = useState({
        firstname: user?.data?.firstName,
        lastname: user?.data?.lastName,
        phoneno: user?.data?.mobileNumber,
        postalcode: "",
        city: "",
        address: "",
        deliveryInstructions: "",
    });

    // Tip state: default 10%, with 15%, 20%, and 'other' (editable custom amount, can be 0)
    const [tipMode, setTipMode] = useState("10");
    const [customTip, setCustomTip] = useState("0");

    const baseTipSubtotal = Math.max(
        0,
        Number(cart?.subtotal || 0) - Number(cart?.discountAmount || 0)
    );
    const tipPercent = tipMode === "other" ? 0 : Number(tipMode);
    const tipAmount =
        tipMode === "other"
            ? Math.round(Math.max(0, parseFloat(customTip) || 0) * 100) / 100
            : Math.round(baseTipSubtotal * (tipPercent / 100) * 100) / 100;

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
            localStorage.removeItem("orderCode");
            localStorage.removeItem("sessionId");
            localStorage.removeItem("pendingOrderMeta");

            const cartFn = new CartFunction();
            cartFn.clearCart(setCart);

            stopPriceLock();
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

    const submittingRef = useRef(false);
    const idempotencyKeyRef = useRef(`web_del_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

    const onSubmit = async (values) => {
        if (submittingRef.current || loading) return;

        // Block ordering when kitchen is closed
        console.log('[KitchenClosed][AddressDetails] onSubmit called — storeOpen =', storeOpen);
        if (storeOpen === false) {
            console.log('[KitchenClosed][AddressDetails] 🔴 BLOCKED — showing modal');
            setShowKitchenClosed(true);
            return;
        }

        const cleanPostalCode = values.postalcode.replace(/\s/g, '');
        const payload = {
            zipcode: cleanPostalCode,
        };

        if (currentStoreCode === undefined || currentStoreCode === null) {
            toast.error('Please select the nearest store');
            return;
        }

        submittingRef.current = true;
        try {
            setLoading(true);

            // Use the already-fetched Nash delivery fee from the hook.
            // If the user clicked submit before the 900ms debounce fired, fetch it right now.
            let activeQuoteData = nashQuote.data;
            let customerDeliveryFee = nashQuote.customerDeliveryFee || 0;
            let serviceFee = nashQuote.serviceFee || 0;
            let totalDeliveryCharge = nashQuote.deliveryFee || (customerDeliveryFee + serviceFee);

            if (!activeQuoteData && values?.address && values?.postalcode && currentStoreCode) {
                const fetched = await nashQuote.fetchQuote({
                    address: values.address,
                    city: values.city || '',
                    postalcode: values.postalcode,
                    phoneno: values.phoneno || '',
                    storeCode: currentStoreCode,
                    orderValue: cart?.subtotal || 0,
                });
                if (fetched) {
                    activeQuoteData = fetched.data;
                    customerDeliveryFee = fetched.customerDeliveryFee || 0;
                    serviceFee = fetched.serviceFee || 0;
                    totalDeliveryCharge = fetched.deliveryFee || (customerDeliveryFee + serviceFee);
                }
            }

            // NOW CALL ORDER PLACE API
            const baseUrl = window.location.origin;
            let custFullName = values.firstname + " " + values.lastname;

            // Grand total = cart total + Nash delivery fee (customerDeliveryFee + serviceFee) + tip
            const cartTotal = Number(cart?.grandtotal || 0);
            const finalGrandTotal = Number(cartTotal + totalDeliveryCharge + tipAmount).toFixed(2);

            const buildOrderPayload = (confirmUpdatedQuote = false, overrideQuote = null) => {
                const qData = overrideQuote || activeQuoteData || {};
                const payloadCustFee = overrideQuote
                    ? Number(overrideQuote.customer_delivery_fee_dollars ?? overrideQuote.customer_delivery_fee ?? customerDeliveryFee)
                    : customerDeliveryFee;
                const payloadSrvFee = overrideQuote
                    ? Number(overrideQuote.service_fee_dollars ?? overrideQuote.service_fee ?? serviceFee)
                    : serviceFee;
                const payloadTotalDel = overrideQuote
                    ? Number(overrideQuote.total_customer_delivery_dollars ?? overrideQuote.total_customer_delivery_charge ?? (payloadCustFee + payloadSrvFee))
                    : totalDeliveryCharge;
                const payloadGrandTotal = overrideQuote
                    ? Number(cartTotal + payloadTotalDel + tipAmount).toFixed(2)
                    : finalGrandTotal;

                return {
                    idempotency_key: idempotencyKeyRef.current,
                    deviceType: "web",
                    customerCode: user?.data?.customerCode,
                    deliveryType: "delivery",
                    customerName: custFullName,
                    mobileNumber: values?.phoneno,
                    address: values?.address,
                    zipCode: values.postalcode,
                    deliveryInstructions: (values?.deliveryInstructions || "").trim(),
                    cityCode: selectedCity?.cityCode
                        || currentCity?.cityCode
                        || cities.find(c => c.value === (selectedCity?.value || currentCity?.value))?.cityCode
                        || globalSelectedStore?.cityCode
                        || "",
                    storeCode: currentStoreCode === 'EXP' ? undefined : currentStoreCode,
                    products: cart?.product,
                    subTotal: cart?.subtotal,
                    discountAmount: cart?.discountAmount,
                    taxPer: cart?.taxPer ?? 0,
                    taxAmount: cart?.taxAmount ?? 0,
                    convinencePer: cart?.convinencePer ?? 0,
                    convinenceCharges: cart?.convinenceCharges ?? 0,
                    deliveryCharges: payloadCustFee,
                    customerDeliveryFee: payloadCustFee,
                    serviceFee: payloadSrvFee,
                    extraDeliveryCharges: 0,
                    tipAmount: Number(tipAmount.toFixed(2)),
                    tipPer: tipPercent,
                    grandTotal: payloadGrandTotal,
                    nash_quote_id: qData.quote_id || undefined,
                    nash_quote_expires_at: qData.expires_at || undefined,
                    nash_quoted_cost_cents: qData.nash_quoted_cost_cents ?? undefined,
                    distance_km: qData.distance_km ?? undefined,
                    confirmed_nash_quote_cents: qData.nash_quoted_cost_cents ?? undefined,
                    confirmed_total_customer_delivery_cents: qData.total_customer_delivery_charge_cents
                        ?? qData.total_customer_delivery_cents
                        ?? qData.delivery_fee_cents
                        ?? undefined,
                    ...(confirmUpdatedQuote ? { confirm_updated_quote: true } : {}),
                    successUrl: `${baseUrl}/payment/success`,
                    cancelUrl: `${baseUrl}/payment/cancel`,
                };
            };

            let orderResponse;
            try {
                orderResponse = await orderPlace(buildOrderPayload(false));
            } catch (placeErr) {
                if (placeErr?.response?.status === 409 && (placeErr?.response?.data?.quote_changed || placeErr?.response?.data?.quote_expired)) {
                    let updatedQuote = placeErr.response.data.delivery_breakdown || placeErr.response.data.updated_quote || null;
                    if (!updatedQuote) {
                        const refreshed = await nashQuote.fetchQuote({
                            address: values.address,
                            city: values.city || '',
                            postalcode: values.postalcode,
                            phoneno: values.phoneno || '',
                            storeCode: currentStoreCode,
                            orderValue: cart?.subtotal || 0,
                        });
                        updatedQuote = refreshed?.data || {};
                    }
                    const newCustFee = Number(updatedQuote.customer_delivery_fee_dollars ?? updatedQuote.customer_delivery_fee ?? 0).toFixed(2);
                    const newSrvFee = Number(updatedQuote.service_fee_dollars ?? updatedQuote.service_fee ?? 0).toFixed(2);
                    const newTotalDel = Number(
                        updatedQuote.total_customer_delivery_dollars
                        ?? updatedQuote.total_customer_delivery_charge
                        ?? (Number(newCustFee) + Number(newSrvFee))
                    ).toFixed(2);
                    const newGrand = (cartTotal + Number(newTotalDel) + tipAmount).toFixed(2);

                    const confirmed = await swal({
                        title: "Delivery Quote Updated",
                        text: `The delivery quote has changed.\n\nDelivery Fee: $${newCustFee}\nService Fee: $${newSrvFee}\nUpdated Total: $${newGrand}\n\nWould you like to proceed with the updated total?`,
                        icon: "info",
                        buttons: ["Cancel", "Confirm Updated Total"],
                    });

                    if (!confirmed) {
                        await nashQuote.refresh();
                        submittingRef.current = false;
                        setLoading(false);
                        return;
                    }

                    // Generate a fresh idempotency key for the confirmed retry
                    idempotencyKeyRef.current = `web_del_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
                    orderResponse = await orderPlace(buildOrderPayload(true, updatedQuote));
                } else {
                    throw placeErr;
                }
            }

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
                orderNumber: orderResponse.orderNumber || orderResponse.data?.orderNumber || orderResponse.receiptNo || "",
                storeCode: currentStoreCode === 'EXP' ? undefined : currentStoreCode,
                customerName: custFullName,
                phoneNumber: values?.phoneno,
                deliveryType: "delivery",
                orderFrom: "online",
                grandTotal: orderResponse?.pricing?.grandTotal || finalGrandTotal,  // use backend-confirmed total
                status: "pending",
            }));

            // Update state with API response
            setOrderResponse(orderResponse);
            setApiPricing(orderResponse.pricing);

            toast.success("Order placed! Redirecting to payment…");

            // ── Go directly to Stripe payment ──────────────────────────────
            // Keep loading=true and submittingRef.current=true during redirect so the
            // Confirm & Pay button cannot be re-clicked while Stripe is loading.
            if (orderResponse.paymentUrl) {
                window.location.href = orderResponse.paymentUrl;
            } else {
                submittingRef.current = false;
                setLoading(false);
            }

        } catch (error) {
            submittingRef.current = false;
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

        if (readOnly || addr.length < 5 || postal.length < 5 || !currentStoreCode) return;

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

    /* ── Shared delivery-fee & service-fee resolution (used in both columns) ── */
    const confirmedCustDel  = apiPricing?.customerDeliveryFee ?? apiPricing?.deliveryCharges;
    const confirmedSrvFee   = apiPricing?.serviceFee;

    const estimatedCustDel  = nashQuote.data?.customer_delivery_fee_cents != null
        ? nashQuote.data.customer_delivery_fee_cents / 100
        : (nashQuote.data?.delivery_fee_cents != null ? nashQuote.data.delivery_fee_cents / 100 : null);
    const estimatedSrvFee   = nashQuote.data?.service_fee_cents != null
        ? nashQuote.data.service_fee_cents / 100
        : (estimatedCustDel != null ? 0 : null);
    const estimatedTotalDel = nashQuote.data?.total_customer_delivery_charge_cents != null
        ? nashQuote.data.total_customer_delivery_charge_cents / 100
        : (nashQuote.data?.total_customer_delivery_cents != null
            ? nashQuote.data.total_customer_delivery_cents / 100
            : (estimatedCustDel != null ? estimatedCustDel + (estimatedSrvFee || 0) : null));

    const cartFee           = cart?.deliveryCharges;
    const resolvedCustDel   = confirmedCustDel != null ? Number(confirmedCustDel) : (estimatedCustDel ?? cartFee);
    const resolvedSrvFee    = confirmedSrvFee != null ? Number(confirmedSrvFee) : (estimatedSrvFee ?? 0);
    const resolvedTotalDel  = (resolvedCustDel != null ? Number(resolvedCustDel) + Number(resolvedSrvFee || 0) : null) ?? estimatedTotalDel;

    const foodSubtotal = Number(apiPricing?.subTotal ?? cart?.subtotal ?? 0);
    const discountVal  = Number(apiPricing?.discountAmount ?? cart?.discountAmount ?? 0);
    const convCharges  = Number(apiPricing?.convinenceCharges ?? cart?.convinenceCharges ?? 0);
    const taxVal       = Number(apiPricing?.taxAmount ?? cart?.taxAmount ?? 0);
    const subtotalBeforeTax = Number(
        apiPricing?.subtotalBeforeTax
        ?? Math.max(0, foodSubtotal - discountVal) + Number(resolvedCustDel || 0) + Number(resolvedSrvFee || 0) + convCharges
    );

    const resolvedTip = apiPricing?.tipAmount != null
        ? Number(apiPricing.tipAmount)
        : tipAmount;

    const grandTotal = apiPricing?.grandTotal != null
        ? Number(apiPricing.grandTotal)
        : (resolvedTotalDel != null
            ? Number(cart?.grandtotal || 0) - Number(cart?.deliveryCharges || 0) + Number(resolvedTotalDel)
            : Number(cart?.grandtotal || 0)) + resolvedTip;

    /* ── Reusable: Order Summary lines (ordered per Section 7 spec) ── */
    const SummaryLines = () => (
        <>
            {/* 1. Food Subtotal */}
            <div className="chk-line">
                <span>Food Subtotal</span>
                <span>$ {foodSubtotal.toFixed(2)}</span>
            </div>

            {/* Discount (if applicable) */}
            {discountVal > 0 && (
                <div className="chk-line chk-line--discount">
                    <span>Discount</span>
                    <span>− $ {discountVal.toFixed(2)}</span>
                </div>
            )}

            {/* 2. Delivery Fee */}
            <div className="chk-line chk-line--delivery">
                <span>
                    Delivery Fee
                    {estimatedCustDel != null && !confirmedCustDel && (
                        <span className="chk-est-badge">
                            {nashQuote.data?.distance_km != null ? `${Number(nashQuote.data.distance_km).toFixed(1)} km` : 'est.'}
                        </span>
                    )}
                </span>
                {nashQuote.loading ? (
                    <span className="chk-shimmer" style={{ width: 60 }} />
                ) : resolvedCustDel != null ? (
                    <span>$ {Number(resolvedCustDel).toFixed(2)}</span>
                ) : (
                    <span className="chk-pending-fee">Enter address ↑</span>
                )}
            </div>

            {/* 3. Service Fee */}
            <div className="chk-line chk-line--service-fee" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                        Service Fee
                        {nashQuote.data?.provider && !confirmedSrvFee && (
                            <span className="chk-est-badge">{nashQuote.data.provider}</span>
                        )}
                    </span>
                    {nashQuote.loading ? (
                        <span className="chk-shimmer" style={{ width: 60 }} />
                    ) : resolvedCustDel != null ? (
                        <span>$ {Number(resolvedSrvFee).toFixed(2)}</span>
                    ) : (
                        <span className="chk-pending-fee">—</span>
                    )}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.25 }}>
                    {nashQuote.data?.disclosure || 'Service Fee helps cover third-party delivery partner and order fulfillment costs.'}
                </div>
            </div>

            {/* Convenience Fee (if applicable) */}
            {convCharges > 0 && (
                <div className="chk-line">
                    <span>Convenience Fee ({apiPricing?.convinencePer || cart?.convinencePer || 0}%)</span>
                    <span>$ {convCharges.toFixed(2)}</span>
                </div>
            )}

            {/* 4. Subtotal Before Applicable Tax */}
            <div className="chk-line" style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '6px', marginTop: '4px' }}>
                <span>Subtotal Before Applicable Tax</span>
                <span>$ {subtotalBeforeTax.toFixed(2)}</span>
            </div>

            {/* 5. Applicable Taxes */}
            {taxVal > 0 && (
                <div className="chk-line">
                    <span>Applicable Taxes ({apiPricing?.taxPer || cart?.taxPer || 0}%)</span>
                    <span>$ {taxVal.toFixed(2)}</span>
                </div>
            )}

            {/* Extra Delivery */}
            {apiPricing?.extraDeliveryCharges && Number(apiPricing.extraDeliveryCharges) > 0 && (
                <div className="chk-line">
                    <span>Extra Delivery</span>
                    <span>$ {Number(apiPricing.extraDeliveryCharges).toFixed(2)}</span>
                </div>
            )}

            {/* Tip */}
            <div className="chk-line">
                <span>Tip {tipMode !== 'other' ? `(${tipPercent}%)` : ''}</span>
                <span>$ {Number(resolvedTip).toFixed(2)}</span>
            </div>
        </>
    );

    return (
        <div className="chk-page">
            <KitchenClosedModal isOpen={showKitchenClosed} onClose={() => setShowKitchenClosed(false)} />

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
                                    <AddressAutofill
                                        disabled={readOnly}
                                        options={{ country: "CA", language: "en" }}
                                        onRetrieve={(res) => {
                                            const feature = res?.features?.[0];
                                            if (!feature) return;
                                            if (feature.properties?._streetOnly) {
                                                formik.setFieldValue("address", feature.properties.address_line1 || "");
                                                return;
                                            }
                                            const parts = extractCanadianAddressParts(feature);
                                            const resolvedAddress = (parts.fullAddress || parts.streetAddress || "").slice(0, 100);
                                            if (resolvedAddress) {
                                                formik.setFieldValue("address", resolvedAddress);
                                            }
                                            if (parts.city) {
                                                formik.setFieldValue("city", parts.city);
                                            }
                                            if (parts.postalCode) {
                                                formik.setFieldValue("postalcode", parts.postalCode);
                                            }
                                        }}
                                    >
                                        <div className="chk-input-wrap">
                                            <span className="chk-input-icon">📍</span>
                                            <input
                                                className={`chk-input${formik.touched.address && formik.errors.address ? ' chk-input--error' : ''}`}
                                                type="text"
                                                name="address"
                                                placeholder="Start typing delivery address..."
                                                disabled={readOnly}
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </AddressAutofill>
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
                                        maxLength={7}
                                        value={formik.values.postalcode}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
                                            const formatted = raw.length > 3
                                                ? raw.slice(0, 3) + " " + raw.slice(3, 6)
                                                : raw;
                                            formik.setFieldValue("postalcode", formatted);
                                        }}
                                        onBlur={formik.handleBlur}
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

                                {/* Delivery Instructions (Optional) */}
                                <div className="chk-field chk-field--full">
                                    <label className="chk-label">
                                        Delivery Instructions <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85em' }}>(Optional)</span>
                                    </label>
                                    <textarea
                                        className="chk-input"
                                        name="deliveryInstructions"
                                        rows={2}
                                        maxLength={300}
                                        placeholder="e.g. Gate code #1234, leave at front door, ring doorbell..."
                                        disabled={readOnly}
                                        value={formik.values.deliveryInstructions || ""}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{ resize: 'vertical', minHeight: '64px', paddingTop: '10px' }}
                                    />
                                    {formik.touched.deliveryInstructions && formik.errors.deliveryInstructions && (
                                        <span className="chk-error-msg">{formik.errors.deliveryInstructions}</span>
                                    )}
                                </div>

                            </div>

                            {/* Tip Selection Section */}
                            <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label className="chk-label" style={{ marginBottom: 0 }}>
                                        💝 Add a Tip
                                    </label>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                                        $ {tipAmount.toFixed(2)}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    {[
                                        { key: '10', label: '10%' },
                                        { key: '15', label: '15%' },
                                        { key: '20', label: '20%' },
                                        { key: 'other', label: 'Other' },
                                    ].map((opt) => {
                                        const isSelected = tipMode === opt.key;
                                        const calcVal = opt.key !== 'other'
                                            ? (Math.round(baseTipSubtotal * (Number(opt.key) / 100) * 100) / 100).toFixed(2)
                                            : null;
                                        return (
                                            <button
                                                key={opt.key}
                                                type="button"
                                                disabled={readOnly}
                                                onClick={() => {
                                                    setTipMode(opt.key);
                                                    if (opt.key === 'other' && customTip === '') {
                                                        setCustomTip('0');
                                                    }
                                                }}
                                                style={{
                                                    padding: '8px 6px',
                                                    borderRadius: '10px',
                                                    border: isSelected ? '2px solid #e63946' : '1px solid #d1d5db',
                                                    backgroundColor: isSelected ? '#fff1f2' : '#ffffff',
                                                    color: isSelected ? '#e63946' : '#374151',
                                                    fontWeight: isSelected ? 700 : 600,
                                                    fontSize: '0.85rem',
                                                    cursor: readOnly ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    lineHeight: 1.2,
                                                    transition: 'all 0.15s ease',
                                                }}
                                            >
                                                <span>{opt.label}</span>
                                                {calcVal !== null ? (
                                                    <span style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: '2px' }}>${calcVal}</span>
                                                ) : (
                                                    <span style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: '2px' }}>Custom / $0</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {tipMode === 'other' && (
                                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#6b7280' }}>$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.50"
                                                disabled={readOnly}
                                                className="chk-input"
                                                style={{ paddingLeft: '28px', width: '100%' }}
                                                placeholder="0.00"
                                                value={customTip}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || Number(val) >= 0) {
                                                        setCustomTip(val);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            disabled={readOnly}
                                            onClick={() => setCustomTip('0')}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #d1d5db',
                                                backgroundColor: Number(customTip) === 0 ? '#111827' : '#ffffff',
                                                color: Number(customTip) === 0 ? '#ffffff' : '#374151',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: readOnly ? 'not-allowed' : 'pointer',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            No Tip ($0)
                                        </button>
                                    </div>
                                )}
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
                                    className={`chk-cta-btn${(nashQuote.loading || loading || formik.isSubmitting) ? ' chk-cta-btn--loading' : ''}`}
                                    disabled={nashQuote.loading || loading || formik.isSubmitting}
                                >
                                    {nashQuote.loading
                                        ? <><span className="chk-spinner" /> Calculating delivery fee…</>
                                        : (loading || formik.isSubmitting)
                                            ? <><span className="chk-spinner" /> Processing order…</>
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

