

import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import CartFunction from '../components/cart';
import { GlobalContext } from '../context/GlobalContext';
import { useSiteData } from '../components/_main/Header/hooks/useSiteData';

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
    const { siteData } = useSiteData();

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
        setTimeout(() => {
            localStorage.removeItem('OrderID');
            localStorage.removeItem('sessionId');
            localStorage.removeItem("cart");
            setCart({ product: [] });
            cartFn.createCart(setCart);
            setPaymentStatus('success');
            setLoading(false);
        }, 1500);
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
                                        <img
                                            src={siteData?.logo || logo}
                                            alt="Logo"
                                            className="img-fluid"
                                            style={{
                                                maxWidth: '120px',
                                                height: 'auto',
                                                objectFit: 'contain'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = logo;
                                            }}
                                        />
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