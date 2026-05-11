

import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartFunction from '../components/cart';
import { GlobalContext } from '../context/GlobalContext';
import { useSiteData } from '../components/_main/Header/hooks/useSiteData';

// ── MODULE-LEVEL: fires at JS parse time, before React mounts ──────────────
console.log('[🔔 PaymentSuccess MODULE] JS loaded at', new Date().toISOString());
console.log('[🔔 PaymentSuccess MODULE] VITE_SOCKET_BASE_URL =', import.meta.env.VITE_SOCKET_BASE_URL);
console.log('[🔔 PaymentSuccess MODULE] pendingOrderMeta in localStorage =',
    localStorage.getItem('pendingOrderMeta'));
// ───────────────────────────────────────────────────────────────────────────

const PaymentSuccess = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const globalctx = useContext(GlobalContext);
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;
    const [currentStore, setCurrentStore] = globalctx.currentStore;
    const [cart, setCart] = globalctx.cart;
    const cartFn = new CartFunction();
    const { siteData, loading: siteDataLoading } = useSiteData();
    const [logoError, setLogoError] = useState(false);

    const handleContinue = useCallback(() => {
        setPaymentStatus('success');
        setLoading(false);
        navigate('/');
    }, [navigate]);

    // Handle Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleContinue();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleContinue]);

    // Handle browser back button
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            // Prevent user from going back to payment page
            navigate('/', { replace: true });
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    useEffect(() => {
        setLoading(true);

        const notifySocketServer = async (meta) => {
            const socketBase = import.meta.env.VITE_SOCKET_BASE_URL;
            console.log('[🔔 PaymentSuccess] notifySocketServer called');
            console.log('[🔔 PaymentSuccess] VITE_SOCKET_BASE_URL =', socketBase);
            console.log('[🔔 PaymentSuccess] order meta =', JSON.stringify(meta, null, 2));

            if (!socketBase) {
                console.error('[🔔 PaymentSuccess] ❌ VITE_SOCKET_BASE_URL is undefined — socket call will fail!');
                return;
            }
            if (!meta.storeCode) {
                console.error('[🔔 PaymentSuccess] ❌ storeCode is empty — cashier will filter this out!');
            }

            try {
                const params = new URLSearchParams({
                    orderCode:    meta.orderCode    || '',
                    orderNumber:  meta.orderNumber  || '',
                    storeCode:    meta.storeCode    || '',
                    customerName: meta.customerName || '',
                    phoneNumber:  meta.phoneNumber  || '',
                    deliveryType: meta.deliveryType || 'pickup',
                    orderFrom:    meta.orderFrom    || 'online',
                    grandTotal:   meta.grandTotal   || '0',
                    status:       meta.status       || 'pending',
                });
                const url = `${socketBase}/order/place/customer?${params.toString()}`;
                console.log('[🔔 PaymentSuccess] Calling socket server →', url);

                const res = await fetch(url);
                const json = await res.json().catch(() => ({}));
                console.log('[🔔 PaymentSuccess] Socket server responded:', res.status, json);

                if (res.ok) {
                    console.log('[🔔 PaymentSuccess] ✅ Socket server notified successfully — cashier bell should ring');
                } else {
                    console.error('[🔔 PaymentSuccess] ❌ Socket server returned error:', res.status, json);
                }
            } catch (err) {
                console.error('[🔔 PaymentSuccess] ❌ Fetch to socket server threw an error:', err);
            }
        };

        const run = async () => {
            console.log('[🔔 PaymentSuccess] run() started — reading pendingOrderMeta from localStorage');
            const rawMeta = localStorage.getItem('pendingOrderMeta');
            console.log('[🔔 PaymentSuccess] raw pendingOrderMeta =', rawMeta);

            if (rawMeta) {
                try {
                    const meta = JSON.parse(rawMeta);
                    // ── Pre-send validation ───────────────────────────────────────────
                    console.log('[🔔 PaymentSuccess] ✅ pendingOrderMeta parsed OK:');
                    console.log('  orderCode    =', meta.orderCode);
                    console.log('  orderNumber  =', meta.orderNumber);
                    console.log('  storeCode    =', meta.storeCode, meta.storeCode ? '✅' : '❌ EMPTY — bell will be dropped on cashier!');
                    console.log('  customerName =', meta.customerName);
                    console.log('  deliveryType =', meta.deliveryType);
                    console.log('  grandTotal   =', meta.grandTotal);
                    console.log('  status       =', meta.status);
                    // ─────────────────────────────────────────────────────────────────
                    await notifySocketServer(meta);
                } catch (e) {
                    console.error('[🔔 PaymentSuccess] ❌ Could not parse pendingOrderMeta:', e);
                }
            } else {
                console.warn('[🔔 PaymentSuccess] ⚠️ No pendingOrderMeta found — socket notification skipped');
                console.warn('[🔔 PaymentSuccess] All localStorage keys:', Object.keys(localStorage));
            }

            localStorage.removeItem('OrderID');
            localStorage.removeItem('sessionId');
            localStorage.removeItem('pendingOrderMeta');
            localStorage.removeItem('cart');
            setCart({ product: [] });
            cartFn.createCart(setCart);
            setPaymentStatus('success');
            setLoading(false);
            console.log('[🔔 PaymentSuccess] run() complete — page should show success');
        };

        // Small delay so the Stripe webhook has a chance to fire first
        console.log('[🔔 PaymentSuccess] Scheduling socket safety-net in 1500ms...');
        setTimeout(run, 1500);
    }, []);


    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Verifying payment...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5 py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm" style={{ overflow: 'visible' }}>
                        <div className="card-body text-center p-5">
                            {paymentStatus === 'success' ? (
                                <>
                                    <div className="d-flex justify-content-center align-items-center mb-4">
                                        {siteDataLoading || logoError ? (
                                            <div className="placeholder-glow d-inline-block" style={{ width: '120px', height: '120px' }}>
                                                <span className="placeholder w-100 h-100 rounded-circle" style={{ backgroundColor: "#e0e0e0", display: 'block' }}></span>
                                            </div>
                                        ) : (
                                            <img
                                                src={siteData?.logo}
                                                alt="Logo"
                                                className="img-fluid"
                                                style={{
                                                    maxWidth: '120px',
                                                    height: 'auto',
                                                    objectFit: 'contain'
                                                }}
                                                onError={() => setLogoError(true)}
                                            />
                                        )}
                                    </div>
                                    <h2 className="card-title text-success mb-3">Payment Successful!</h2>
                                    <p className="card-text mb-3">
                                        Thank you for your order. Your payment has been processed successfully.
                                    </p>
                                    <p className="text-muted mb-4">
                                        You will receive an order confirmation SMS shortly.
                                    </p>
                                    <button
                                        type='button'
                                        onClick={handleContinue}
                                        className="btn btn-primary btn-lg px-5"
                                    >
                                        Continue Shopping
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="text-danger mb-4">
                                        <i className="fas fa-times-circle fa-3x"></i>
                                    </div>
                                    <h2 className="card-title text-danger mb-3">Payment Verification Failed</h2>
                                    <p className="card-text mb-4">
                                        We couldn't verify your payment. Please contact our support team.
                                    </p>
                                    <button
                                        type='button'
                                        onClick={handleContinue}
                                        className="btn btn-primary btn-lg px-5"
                                    >
                                        Continue Shopping
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;