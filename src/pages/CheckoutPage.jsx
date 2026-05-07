import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Footer from "../components/_main/Footer";
import Header from "../components/_main/Header/Header";
import PickupOrder from "../components/PickupOrder";
import {GlobalContext} from "../context/GlobalContext";
import LoadingLayout from "../layouts/LoadingLayout";
import AddressDetails from "./AddressDetails";

// Developer: Shreyas Mahamuni, Working Date: 23-12-2023

function CheckoutPage() {
    const [loading, setLoading] = useState(false);

    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [isAuthenticated, setIsAuthenticated] = globalctx.auth;
    const [selectedType, setSelectedType] = globalctx.selectedType;
    const user = useSelector((state) => state.user);


    const navigate = useNavigate();

    useEffect(() => {
        if (cart?.product?.length > 0) {
            if (isAuthenticated && user !== null) {
                setLoading(false);
                window.scrollTo(0, 0);
            } else {
                navigate("/login");
                setLoading(false);
            }
        } else {
            toast.error("Cart is Empty...");
        }
    }, []);

    return (
        <div className="relative">

            <Header />
            {loading === true ? (
                <>
                    <LoadingLayout />
                </>
            ) : (
                <div className="container">
                    <div className="nav-margin"></div>
                    <div
                        className="container-fluid new-block d-flex flex-column justify-content-center align-items-center p-0"
                        style={{ backgroundColor: "#ffffff" }}
                    >
                        <div className="container-fluid py-3 px-lg-5 px-3">
                            <div className="row gx-3 justify-content-center align-items-center">
                                <div className="col-12">
                                    {/* Modern pill toggle switcher */}
                                    <div style={{
                                        display: 'inline-flex',
                                        background: '#f0f0f0',
                                        borderRadius: '50px',
                                        padding: '4px',
                                        gap: '4px',
                                        width: '100%',
                                        maxWidth: '380px',
                                    }}>
                                        <button
                                            id="nav-home-tab"
                                            type="button"
                                            onClick={() => setSelectedType("pickup")}
                                            style={{
                                                flex: 1,
                                                padding: '10px 20px',
                                                borderRadius: '50px',
                                                border: 'none',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                background: selectedType === 'pickup' ? 'var(--primary, #2d7a2d)' : 'transparent',
                                                color: selectedType === 'pickup' ? '#fff' : '#555',
                                                boxShadow: selectedType === 'pickup' ? '0 2px 8px rgba(45,122,45,0.3)' : 'none',
                                            }}
                                        >
                                            🏪 Pickup
                                        </button>
                                        <button
                                            id="nav-profile-tab"
                                            type="button"
                                            onClick={() => setSelectedType("delivery")}
                                            style={{
                                                flex: 1,
                                                padding: '10px 20px',
                                                borderRadius: '50px',
                                                border: 'none',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                background: selectedType === 'delivery' ? 'var(--primary, #2d7a2d)' : 'transparent',
                                                color: selectedType === 'delivery' ? '#fff' : '#555',
                                                boxShadow: selectedType === 'delivery' ? '0 2px 8px rgba(45,122,45,0.3)' : 'none',
                                            }}
                                        >
                                            🚴 Delivery
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid px-lg-5 px-3 pt-3">
                            {selectedType === 'pickup' && <PickupOrder />}
                            {selectedType === 'delivery' && <AddressDetails />}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default CheckoutPage;
