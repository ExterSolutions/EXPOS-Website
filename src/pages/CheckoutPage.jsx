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
    const { user } = useSelector((state) => state);

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
                                <div className="col-12 text-start">
                                    <h4 className="fw-bolder text-secondary mb-3">
                                        Choose One of the following
                                    </h4>
                                </div>
                                <nav className="col-lg-12 col-md-8 col-sm-12 placeorderTab">
                                    <div
                                        className="nav nav-tabs w-100"
                                        id="nav-tab"
                                        role="tablist"
                                        style={{ border: "none", display: 'flex' }}
                                    >

                                        <button
                                            className={`nav-link py-3 px-md-5 px-3 flex-grow-1 text-center fw-semibold ${selectedType === 'pickup' ? 'active' : ''}`}
                                            id="nav-home-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-home"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-home"
                                            aria-selected="true"
                                            onClick={() => setSelectedType("pickup")}
                                        >
                                            Pickup
                                        </button>

                                        {/* <button
                                            className={`nav-link  ${selectedType === 'delivery' ? 'active' : ''} py-md-2 py-1 px-md-5 px-3`}
                                            id="nav-profile-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-profile"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-profile"
                                            aria-selected="false"
                                            onClick={() => setSelectedType("pickup")}
                                        >
                                            Delivery
                                        </button> */}

                                    </div>
                                </nav>
                            </div>
                        </div>

                        <div className="container-fluid px-lg-5 px-3 pt-3">
                            <div className="tab-content" id="nav-tabContent">

                                <div
                                    className={`tab-pane fade ${selectedType === 'pickup' ? 'show active' : ''}`}
                                    id="nav-home"
                                    role="tabpanel"
                                    aria-labelledby="nav-home-tab"
                                >
                                    <PickupOrder />
                                </div>

                                <div
                                    className={`tab-pane fade mb-3 ${selectedType === 'delivery' ? 'show active' : ''}`}
                                    id="nav-profile"
                                    role="tabpanel"
                                    aria-labelledby="nav-profile-tab"
                                >
                                    <AddressDetails />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default CheckoutPage;
