import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteData } from '../components/_main/Header/hooks/useSiteData';
import { useState } from 'react';

function PaymentCancel() {
    const navigate = useNavigate();
    const { siteData, loading } = useSiteData();
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        // Clear any stored order data since payment was cancelled
        localStorage.removeItem('OrderID');
        localStorage.removeItem('sessionId');
        // toast.error('Payment was cancelled.');
    }, []);

    const handleRetryPayment = () => {
        // Navigate back to checkout or cart
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <div className="container mt-5 mb-5 py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body text-center">
                            {/* <div className="text-warning mb-3">
                                <i className="fas fa-exclamation-triangle fa-3x"></i>
                            </div> */}
                            <div className="d-flex justify-content-center align-items-center mb-4">
                                {loading || logoError ? (
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
                            <h2 className="card-title text-warning">Payment Cancelled</h2>
                            <p className="card-text">
                                Your payment was cancelled. No charges have been made to your account.
                            </p>
                            {/* <p className="text-muted">
                You can retry the payment or continue shopping.
              </p> */}
                            <div className="d-flex justify-content-center gap-2 mt-3">
                                {/* <button
                                    className="btn btn-primary"
                                    onClick={handleRetryPayment}
                                >
                                    Retry Payment
                                </button> */}
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleContinueShopping}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentCancel;
