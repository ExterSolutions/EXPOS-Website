import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";
import CartFunction from "./cart";
import { useSocket } from "../context/SocketContext";
import { applyCoupon, getStoreLocationByCity, orderPlace, settingApi } from "../services";

function PickupOrder() {
    const socket = useSocket();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const globalctx = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);
    const [storeDetails, setStoreDetails] = useState([]);
    const [isShowConfirmPickup, setIsShowConfirmPickup] = useState(false);
    const [selectedStore, setSelectedStore] = useState(globalctx.selectedStore[0]);

    const [cart, setCart] = globalctx.cart;
    const [currentLatitude] = globalctx.currentLatitude;
    const [currentLogitude] = globalctx.currentLogitude;
    const [currentStoreCode] = globalctx.currentStoreCode;
    const [currentCity] = globalctx.currentCity || [null];
    const [selectedType] = globalctx.selectedType;
    const [taxPercent, setTaxPercent] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [convinencePer, setConvinencePer] = useState(0);
    const [convinenceAmt, setConvinenceAmt] = useState(0);
    const [grand_total, setGrandTotal] = useState(0);

    const [busyLoader, setBusyLoader] = useState(false);
    const [couponList, setCouponList] = useState([]);
    const [couponCode, setCouponCode] = useState("");

    // Changed to single object for "Single Coupon at a time" logic
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    const getStoreDetails = async () => {
        setLoading(true);
        try {
            const res = await getStoreLocationByCity();
            const groups = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

            let filteredStores = [];

            // Find the city group based on current context
            if (currentStoreCode) {
                const myCityGroup = groups.find(g =>
                    g.storeLocations.some(s => s.code === currentStoreCode)
                );
                if (myCityGroup) {
                    filteredStores = myCityGroup.storeLocations.map(s => ({ ...s, cityCode: myCityGroup.cityCode }));
                }
            } else if (currentCity?.value) {
                const myCityGroup = groups.find(g => g.city === currentCity?.value);
                if (myCityGroup) {
                    filteredStores = myCityGroup.storeLocations.map(s => ({ ...s, cityCode: myCityGroup.cityCode }));
                }
            } else {
                filteredStores = groups.flatMap(g => g.storeLocations.map(s => ({ ...s, cityCode: g.cityCode })));
            }

            setStoreDetails(filteredStores);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch stores");
        } finally {
            setLoading(false);
        }
    };

    const getCouponList = async () => {
        try {
            const res = await applyCoupon();
            setCouponList(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (error) {
            console.error("Coupon fetch error", error);
        }
    };

    const getSettings = async () => {
        try {
            const res = await settingApi();
            if (res?.data) {
                globalctx.settings[1](res.data);
            }
        } catch (error) {
            console.error("Settings fetch error", error);
        }
    };

    useEffect(() => {
        getStoreDetails();
        getCouponList();
        getSettings();
        window.scrollTo(0, 0);
    }, [currentStoreCode]);

    // Sync selectedStore when storeDetails or currentStoreCode changes
    useEffect(() => {
        if (!selectedStore && currentStoreCode && storeDetails.length > 0) {
            const preSelected = storeDetails.find(d => d.code === currentStoreCode);
            if (preSelected) setSelectedStore(preSelected);
        }
    }, [storeDetails, currentStoreCode]);

    // Recalculate totals for SINGLE coupon
    useEffect(() => {
        const subtotal = Number(cart?.subtotal || 0);
        let totalDiscount = 0;

        if (appliedCoupon) {
            if (appliedCoupon.discount_type === "percentage") {
                totalDiscount = (subtotal * appliedCoupon.discount_value) / 100;
            } else {
                totalDiscount = Number(appliedCoupon.discount_value);
            }
        }

        // Convenience charges from settings
        const settingsData = globalctx.settings[0] || [];
        const conv_per = Number(settingsData.find(s => s.shortCode === "convenience_charges")?.settingValue || 0);

        const tax_percent = Number(selectedStore?.province?.tax_percent || 0);
        const discountedSubtotal = subtotal - totalDiscount;
        const tax_val = (discountedSubtotal * tax_percent * 0.01);
        const conv_val = (discountedSubtotal * conv_per * 0.01);

        const finalDiscount = Math.min(totalDiscount, subtotal);
        const finalTotal = (subtotal + tax_val + conv_val) - finalDiscount;

        setTaxPercent(tax_percent);
        setTaxAmount(tax_val.toFixed(2));
        setConvinencePer(conv_per);
        setConvinenceAmt(conv_val.toFixed(2));
        setDiscountAmount(finalDiscount.toFixed(2));
        setGrandTotal(finalTotal > 0 ? finalTotal.toFixed(2) : "0.00");
    }, [selectedStore, appliedCoupon, cart, globalctx.settings]);

    const handleApplyCoupon = () => {
        if (!couponCode) return toast.error("Please enter coupon code");
        const coupon = couponList.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
        if (!coupon) return toast.error("Invalid coupon code");
        toggleCoupon(coupon);
    };

    const toggleCoupon = (coupon) => {
        // If clicking the same one, remove it
        if (appliedCoupon?.code === coupon.code) {
            setAppliedCoupon(null);
            setCouponCode("");
            toast.info(`Coupon ${coupon.code} removed`);
        } else {
            // Min Order check
            if (Number(cart?.subtotal || 0) < Number(coupon.min_order)) {
                return toast.error(`Min order for ${coupon.code} is $${coupon.min_order}`);
            }
            // Apply as the ONLY coupon and update input field
            setAppliedCoupon(coupon);
            setCouponCode(coupon.code);
            toast.success(`${coupon.code} applied!`);
        }
    };

    const handlePickupOrder = async () => {
        setBusyLoader(true);
        const payload = {
            customerCode: user?.data?.customerCode,
            deliveryType: selectedType,
            customerName: user?.data?.fullName,
            mobileNumber: user?.data?.mobileNumber,
            products: cart?.product,
            cityCode: selectedStore?.cityCode || "",
            discount_code: appliedCoupon?.code,
            storeCode: selectedStore?.code,
            subTotal: cart?.subtotal,
            discountAmount: discountAmount,
            taxPer: taxPercent,
            taxAmount: taxAmount,
            convinencePer: convinencePer,
            convinenceCharges: convinenceAmt,
            deliveryCharges: 0,
            extraDeliveryCharges: 0,
            grandTotal: grand_total,
            // subTotal: cart?.subtotal,
            // discountAmount: discountAmount,
            // appliedCoupons: appliedCoupon ? [appliedCoupon.code] : [],
            // taxPer: taxPercent,
            // taxAmount: taxAmount,
            // deliveryCharges: 0,
            // grandTotal: grand_total,
            // storeCode: selectedStore?.code,
            // successUrl: `${window.location.origin}/payment/success`,
            // cancelUrl: `${window.location.origin}/payment/cancel`,
        };

        try {
            const response = await orderPlace(payload);
            // Bell triggered via Stripe webhook after payment — not here (see WebhookController).
            // Store order details + context so PaymentSuccess.jsx can call socket as fallback.
            localStorage.setItem("OrderID", response.orderCode);
            localStorage.setItem("sessionId", response.sessionId);
            localStorage.setItem("pendingOrderMeta", JSON.stringify({
                orderCode: response.orderCode,
                orderNumber: response.orderNumber,
                storeCode: selectedStore?.code,
                customerName: user?.data?.fullName,
                phoneNumber: user?.data?.mobileNumber,
                deliveryType: selectedType,
                orderFrom: "online",
                grandTotal: grand_total,
                status: "pending",
            }));

            // Clear the cart immediately since the order is now placed backend
            const cartFn = new CartFunction();
            cartFn.clearCart(setCart);

            if (response.paymentUrl) {
                window.location.href = response.paymentUrl;
            } else {
                toast.error("Payment URL not available.");
                setBusyLoader(false);
            }
        } catch (error) {
            setBusyLoader(false);
            toast.error(error.response?.data?.message || "Order placement failed");
        }
    };

    return (
        <div className="container py-4">
            {!isShowConfirmPickup ? (
                <div className="row">
                    <div className="col-lg-8">
                        {/* Store Selection */}
                        <h5 className="fw-bold mb-3">Select Pickup Location</h5>
                        <div className="row g-3 mb-4">
                            {storeDetails?.map((data) => (
                                <div className="col-12" key={data.code}>
                                    <div className={`card shadow-sm rounded-4 store-selection-card ${selectedStore?.code === data.code ? 'selected-card' : ''}`}
                                        onClick={() => {
                                            setSelectedStore(data);
                                            // Update global context to trigger cart recalculation (tax etc)
                                            if (globalctx.selectedStore) {
                                                globalctx.selectedStore[1](data);
                                                localStorage.setItem('selectedStore', JSON.stringify(data));
                                            }
                                        }}>
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="fw-bold mb-1">{data.storeLocation}</h6>
                                                <p className="text-muted small mb-0">{data.storeAddress}</p>
                                            </div>
                                            <button
                                                className={`btn rounded-pill px-4 btn-sm ${selectedStore?.code === data.code ? 'btn-primary' : 'btn-outline-primary'}`}
                                            >
                                                {selectedStore?.code === data.code ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Professional Offers Section */}
                        <section className="mb-4">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-3">
                                    <h6 className="fw-bold mb-3">Offers & Coupons</h6>

                                    {/* Syncing Input Field */}
                                    <div className="input-group mb-3 shadow-sm rounded-3 overflow-hidden border">
                                        <input
                                            type="text"
                                            className="form-control border-0 p-2 ps-3"
                                            placeholder="Enter coupon code"
                                            style={{ fontSize: '0.9rem', borderRadius: '0' }}
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={appliedCoupon}
                                        />
                                        {appliedCoupon ? (
                                            <button className="btn btn-danger px-4 fw-bold" style={{ fontSize: '0.85rem', borderRadius: '0' }} onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>
                                                Remove
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary px-4 fw-bold" style={{ fontSize: '0.85rem', backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', borderRadius: '0' }} onClick={handleApplyCoupon}>
                                                Apply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Order Summary</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${Number(cart?.subtotal || 0).toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="d-flex justify-content-between mb-2 text-success fw-medium">
                                        <span>Savings ({appliedCoupon.code})</span>
                                        <span>-${discountAmount}</span>
                                    </div>
                                )}
                                {selectedStore && (
                                    <div className="d-flex justify-content-between mb-2 text-muted">
                                        <span>Tax ({taxPercent}%)</span>
                                        <span>+${taxAmount}</span>
                                    </div>
                                )}
                                {convinencePer > 0 && (
                                    <div className="d-flex justify-content-between mb-2 text-muted">
                                        <span>Convenience Fee ({convinencePer}%)</span>
                                        <span>+${convinenceAmt}</span>
                                    </div>
                                )}

                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="h5 fw-bold">Grand Total</span>
                                    <span className="h5 fw-bold text-primary">${grand_total}</span>
                                </div>

                                <button
                                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm"
                                    disabled={!selectedStore || Number(cart?.subtotal || 0) === 0}
                                    onClick={() => setIsShowConfirmPickup(true)}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Review Step */
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-lg rounded-4 p-4 text-center">
                            <h4 className="fw-bold mb-4">Review Your Order</h4>
                            <div className="text-start bg-light p-3 rounded-3 mb-4">
                                <p className="mb-2"><strong>Store:</strong> {selectedStore?.storeLocation}</p>
                                <p className="mb-2"><strong>Name:</strong> {user?.data?.fullName}</p>
                                <p className="mb-2"><strong>Applied Coupon:</strong> {appliedCoupon ? appliedCoupon.code : "None"}</p>
                                <p className="mb-0"><strong>Final Price:</strong> ${grand_total}</p>
                            </div>
                            <div className="d-flex gap-3">
                                <button className="btn btn-light flex-grow-1 py-2" onClick={() => setIsShowConfirmPickup(false)}>Back</button>
                                <button
                                    className="btn btn-primary flex-grow-1 py-2 fw-bold"
                                    style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', borderRadius: '10px' }}
                                    onClick={handlePickupOrder}
                                    disabled={busyLoader}
                                >
                                    {busyLoader ? "Processing..." : "Confirm & Pay"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PickupOrder;