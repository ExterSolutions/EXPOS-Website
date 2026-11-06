import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";
import CartFunction from "./cart";
import { useSocket } from "../context/SocketContext";
import { applyCoupon, getStoreLocationByCity, orderPlace, settingApi } from "../services";
import KitchenClosedModal from "./common/KitchenClosedModal";

function PickupOrder() {
    const socket = useSocket();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const globalctx = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);
    const [storeDetails, setStoreDetails] = useState([]);
    const [isShowConfirmPickup, setIsShowConfirmPickup] = useState(false);
    const [selectedStore, setSelectedStore] = useState(globalctx.selectedStore[0]);
    const [showKitchenClosed, setShowKitchenClosed] = useState(false);

    const [cart, setCart] = globalctx.cart;
    const [currentLatitude] = globalctx.currentLatitude;
    const [currentLogitude] = globalctx.currentLogitude;
    const [currentStoreCode] = globalctx.currentStoreCode;
    const [currentCity] = globalctx.currentCity || [null];
    const [selectedType] = globalctx.selectedType;
    const storeOpen = globalctx.storeOpen; // reactive — no race condition
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

    // Tip state: default 10%, with 15%, 20%, and 'other' (editable custom amount, can be 0)
    const [tipMode, setTipMode] = useState("10");
    const [customTip, setCustomTip] = useState("0");
    const [tipAmount, setTipAmount] = useState(0);
    const [tipPercent, setTipPercent] = useState(10);

    const getStoreDetails = async () => {
        setLoading(true);
        try {
            const res = await getStoreLocationByCity();
            const groups = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

            let filteredStores = [];

            // Find the city group based on current context
            if (currentStoreCode) {
                const myCityGroup = groups.find(g =>
                    (g.storeLocations || []).some(s => s.code === currentStoreCode)
                );
                if (myCityGroup) {
                    filteredStores = myCityGroup.storeLocations.map(s => ({ ...s, cityCode: myCityGroup.cityCode }));
                }
            }
            if (filteredStores.length === 0 && currentCity?.value) {
                const myCityGroup = groups.find(g => g.city === currentCity?.value);
                if (myCityGroup) {
                    filteredStores = myCityGroup.storeLocations.map(s => ({ ...s, cityCode: myCityGroup.cityCode }));
                }
            }
            if (filteredStores.length === 0) {
                filteredStores = groups.flatMap(g => (g.storeLocations || []).map(s => ({ ...s, cityCode: g.cityCode })));
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
        if (storeDetails.length === 0) return;

        // Try to match by currentStoreCode or existing selectedStore.code
        const targetCode = currentStoreCode || selectedStore?.code;
        const matched = targetCode
            ? storeDetails.find(d => d.code === targetCode)
            : null;

        if (matched) {
            if (selectedStore?.code !== matched.code || !selectedStore?.province) {
                setSelectedStore(matched);
            }
            return;
        }

        // Stale store code fallback: match by storeLocation name or single active store
        const targetName = (selectedStore?.storeLocation || globalctx.selectedStore?.[0]?.storeLocation || '').trim().toLowerCase();
        const nameMatched = targetName
            ? storeDetails.find(d => (d.storeLocation || '').trim().toLowerCase() === targetName)
            : null;
        const fallbackStore = nameMatched || (storeDetails.length === 1 ? storeDetails[0] : null);

        if (fallbackStore) {
            setSelectedStore(fallbackStore);
            if (globalctx.updateSelectedStore) {
                globalctx.updateSelectedStore(fallbackStore);
            }
        } else if (!selectedStore) {
            const globalStore = globalctx.selectedStore[0];
            if (globalStore) setSelectedStore(globalStore);
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
        const baseForTip = Math.max(0, subtotal - finalDiscount);
        const effectiveTipPct = tipMode === "other" ? 0 : Number(tipMode);
        const computedTip =
            tipMode === "other"
                ? Math.round(Math.max(0, parseFloat(customTip) || 0) * 100) / 100
                : Math.round(baseForTip * (effectiveTipPct / 100) * 100) / 100;

        const finalTotal = (subtotal + tax_val + conv_val) - finalDiscount + computedTip;

        setTaxPercent(tax_percent);
        setTaxAmount(tax_val.toFixed(2));
        setConvinencePer(conv_per);
        setConvinenceAmt(conv_val.toFixed(2));
        setDiscountAmount(finalDiscount.toFixed(2));
        setTipPercent(effectiveTipPct);
        setTipAmount(computedTip);
        setGrandTotal(finalTotal > 0 ? finalTotal.toFixed(2) : "0.00");
    }, [selectedStore, appliedCoupon, cart, globalctx.settings, tipMode, customTip]);

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

    const submittingRef = useRef(false);
    const idempotencyKeyRef = useRef(`web_pck_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

    const handlePickupOrder = async () => {
        if (submittingRef.current || busyLoader) return;

        // Block ordering when kitchen is closed
        console.log('[KitchenClosed][PickupOrder] handlePickupOrder called — storeOpen =', storeOpen);
        if (storeOpen === false) {
            console.log('[KitchenClosed][PickupOrder] 🔴 BLOCKED — showing modal');
            setShowKitchenClosed(true);
            return;
        }
        submittingRef.current = true;
        setBusyLoader(true);

        // cityCode: prefer from selectedStore (API-fetched), fall back to GlobalContext store (store-picker)
        const resolvedCityCode = selectedStore?.cityCode || globalctx.selectedStore[0]?.cityCode || "";
        console.log('[🛒 PickupOrder] cityCode resolved =', resolvedCityCode, '| selectedStore.cityCode =', selectedStore?.cityCode, '| globalStore.cityCode =', globalctx.selectedStore[0]?.cityCode);

        const baseUrl = window.location.origin;
        const resolvedStoreCode = selectedStore?.code || currentStoreCode || globalctx.selectedStore?.[0]?.code;
        const payload = {
            idempotency_key: idempotencyKeyRef.current,
            customerCode: user?.data?.customerCode,
            deliveryType: selectedType,
            customerName: user?.data?.fullName,
            mobileNumber: user?.data?.mobileNumber,
            products: cart?.product,
            cityCode: resolvedCityCode,
            discount_code: appliedCoupon?.code,
            storeCode: resolvedStoreCode,
            subTotal: cart?.subtotal,
            discountAmount: discountAmount,
            taxPer: taxPercent,
            taxAmount: taxAmount,
            convinencePer: convinencePer,
            convinenceCharges: convinenceAmt,
            deliveryCharges: 0,
            extraDeliveryCharges: 0,
            tipAmount: Number(Number(tipAmount || 0).toFixed(2)),
            tipPer: tipPercent,
            grandTotal: grand_total,
            successUrl: `${baseUrl}/payment/success`,
            cancelUrl: `${baseUrl}/payment/cancel`,
        };

        try {
            const response = await orderPlace(payload);
            // Bell triggered via Stripe webhook after payment — not here (see WebhookController).
            // Store order details + context so PaymentSuccess.jsx can call socket as fallback.
            localStorage.setItem("OrderID", response.orderCode);
            localStorage.setItem("sessionId", response.sessionId);
            localStorage.setItem("pendingOrderMeta", JSON.stringify({
                orderCode: response.orderCode,
                orderNumber: response.orderNumber || response.data?.orderNumber || response.receiptNo || "",
                storeCode: resolvedStoreCode,
                customerName: user?.data?.fullName,
                phoneNumber: user?.data?.mobileNumber,
                deliveryType: selectedType,
                orderFrom: "online",
                grandTotal: response?.pricing?.grandTotal || grand_total,
                status: "pending",
            }));

            // Clear the cart immediately since the order is now placed backend
            const cartFn = new CartFunction();
            cartFn.clearCart(setCart);

            if (response.paymentUrl) {
                window.location.href = response.paymentUrl;
            } else {
                toast.error("Payment URL not available.");
                submittingRef.current = false;
                setBusyLoader(false);
            }
        } catch (error) {
            submittingRef.current = false;
            setBusyLoader(false);
            toast.error(error.response?.data?.message || "Order placement failed");
        }
    };

    return (
        <div className="container py-4">
            <KitchenClosedModal isOpen={showKitchenClosed} onClose={() => setShowKitchenClosed(false)} />
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

                                {/* Tip Section */}
                                <div className="mt-3 mb-3 p-3 rounded-3" style={{ border: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-bold" style={{ fontSize: '0.9rem' }}>💝 Add a Tip</span>
                                        <span className="fw-bold" style={{ fontSize: '0.9rem' }}>${Number(tipAmount || 0).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                                        {[
                                            { key: '10', label: '10%' },
                                            { key: '15', label: '15%' },
                                            { key: '20', label: '20%' },
                                            { key: 'other', label: 'Other' },
                                        ].map((opt) => {
                                            const isSelected = tipMode === opt.key;
                                            const baseSub = Math.max(0, Number(cart?.subtotal || 0) - Number(discountAmount || 0));
                                            const calcVal = opt.key !== 'other'
                                                ? (Math.round(baseSub * (Number(opt.key) / 100) * 100) / 100).toFixed(2)
                                                : null;
                                            return (
                                                <button
                                                    key={opt.key}
                                                    type="button"
                                                    onClick={() => {
                                                        setTipMode(opt.key);
                                                        if (opt.key === 'other' && customTip === '') {
                                                            setCustomTip('0');
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '6px 4px',
                                                        borderRadius: '8px',
                                                        border: isSelected ? '2px solid var(--primary, #e63946)' : '1px solid #d1d5db',
                                                        backgroundColor: isSelected ? '#fff1f2' : '#ffffff',
                                                        color: isSelected ? 'var(--primary, #e63946)' : '#374151',
                                                        fontWeight: isSelected ? 700 : 600,
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    <span>{opt.label}</span>
                                                    {calcVal !== null ? (
                                                        <span style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: '2px' }}>${calcVal}</span>
                                                    ) : (
                                                        <span style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: '2px' }}>Custom/$0</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {tipMode === 'other' && (
                                        <div className="d-flex align-items-center gap-2 mt-2">
                                            <div className="input-group input-group-sm">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.50"
                                                    className="form-control"
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
                                                className={`btn btn-sm ${Number(customTip) === 0 ? 'btn-dark' : 'btn-outline-secondary'}`}
                                                style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 600 }}
                                                onClick={() => setCustomTip('0')}
                                            >
                                                No Tip ($0)
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between mb-2 text-muted">
                                    <span>Tip {tipMode !== 'other' ? `(${tipPercent}%)` : ''}</span>
                                    <span>+${Number(tipAmount || 0).toFixed(2)}</span>
                                </div>

                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="h5 fw-bold">Grand Total</span>
                                    <span className="h5 fw-bold text-primary">${grand_total}</span>
                                </div>

                                <button
                                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm"
                                    disabled={!selectedStore || Number(cart?.subtotal || 0) === 0}
                                    onClick={() => {
                                        console.log('[KitchenClosed][PickupOrder] Proceed btn clicked — storeOpen =', storeOpen);
                                        if (storeOpen === false) {
                                            console.log('[KitchenClosed][PickupOrder] 🔴 BLOCKED — showing modal');
                                            setShowKitchenClosed(true);
                                            return;
                                        }
                                        setIsShowConfirmPickup(true);
                                    }}
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
                                <p className="mb-2"><strong>Tip:</strong> ${Number(tipAmount || 0).toFixed(2)}</p>
                                <p className="mb-0"><strong>Final Price:</strong> ${grand_total}</p>
                            </div>
                            <div className="d-flex gap-3">
                                <button
                                    className="btn btn-light flex-grow-1 py-2"
                                    onClick={() => !busyLoader && setIsShowConfirmPickup(false)}
                                    disabled={busyLoader}
                                >
                                    Back
                                </button>
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