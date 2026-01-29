// src/layouts/Sidebar.jsx
import { useContext, useEffect, useState } from "react";
import { IoClose, IoTrashBin } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CartList from "../components/_main/Cart/CartList";
import OrderSummary from "../components/_main/Cart/OrderSummary";
import {GlobalContext} from "../context/GlobalContext";
import { getSpecialDetails } from "../services";

const Sidebar = () => {
    const globalCtx = useContext(GlobalContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [dealsData, setDealsData] = useState([]);
    
    // Safely access Redux state
    let user = null;
    try {
        user = useSelector((state) => state?.user) || null;
    } catch (error) {
        console.warn("Redux not available:", error.message);
        user = null;
    }
    
    // Check if GlobalContext is available
    if (!globalCtx) {
        console.error("GlobalContext is not available. Make sure GlobalProvider wraps App.");
        return <div className="sidebar">Loading...</div>;
    }
    
    // Safely destructure context with defaults
    const cartContext = globalCtx.cart || [{ product: [] }, () => {}];
    const sidebarContext = globalCtx.sidebar || [false, () => {}];
    const productEditContext = globalCtx.productEdit || [null, () => {}];
    const authContext = globalCtx.auth || [false, () => {}];
    const selectedTypeContext = globalCtx.selectedType || ["pickup", () => {}];
    
    const [cart, setCart] = cartContext;
    const [showSidebar, setShowSidebar] = sidebarContext;
    const [payloadEdit, setPayloadEdit] = productEditContext;
    const [isAuthenticated, setIsAuthenticated] = authContext;
    const [selectedType, setSelectedType] = selectedTypeContext;

    const handlePlaceOrder = async () => {
        if (cart?.product?.length > 0) {
            setShowSidebar(false);
            if (isAuthenticated && user !== null) {
                let products = cart?.product.length || 0;
                for (let i = 0; i < cart.product.length; i++) {
                    const element = cart.product[i];
                    if (element?.productType === "special_pizza") {
                        const isValid = await specialOffersData(element);
                        if (!isValid) {
                            return;
                        }
                    }
                }
                setShowSidebar(false);
                navigate("/checkout");
            } else {
                localStorage.setItem("redirectTo", location?.pathname);
                navigate("/login?redirect=" + location?.pathname);
            }
        } else {
            toast.error("Cart is Empty...");
        }
    };

    const isLimitedOfferActive = (offer) => {
        if (offer.limitedOffer === 1) {
            const currentDate = new Date();
            const startDate = new Date(offer.limitedOfferStartDate);
            const endDate = new Date(offer.limitedOfferEndDate);

            if (currentDate >= startDate && currentDate <= endDate) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    };

    const specialOffersData = async (element) => {
        setLoading(true);
        try {
            const res = await getSpecialDetails(element.productCode);
            const data = res?.data || null;
            setLoading(false);
            if (data) {
                if (isLimitedOfferActive(data)) {
                    if (
                        selectedType === "pickup" &&
                        data?.dealType === "deliverydeal"
                    ) {
                        toast.warning(
                            `You can't place the order because your selected order method is ${selectedType}, but some product in your cart is only available for ${data?.dealType === "pickupdeal" ? "pickup deal" : "delivery deal"}.`,
                        );
                        return false;
                    } else if (
                        selectedType === "delivery" &&
                        data?.dealType === "pickupdeal"
                    ) {
                        toast.warning(
                            `You can't place the order because your selected order method is ${selectedType}, but some product in your cart is only available for ${data?.dealType === "pickupdeal" ? "pickup deal" : "delivery deal"}.`,
                        );
                        return false;
                    }
                    return true;
                } else {
                    toast.error(
                        "Your cart has limited-time offer product, but it is no longer available.",
                    );
                    return false;
                }
            } else {
                toast.error("No data found related in your cart products .");
                return false;
            }
        } catch (error) {
            if (
                error.response?.status === 400 ||
                error.response?.status === 500
            ) {
                toast.error(
                    error.response.data.message ||
                    "An error occurred while fetching Deals.",
                );
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClearCart = async (e) => {
        e.preventDefault();
        setCart({ product: [] });
        setShowSidebar(false);
    }

    useEffect(() => {
        if (showSidebar) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [showSidebar]);

    return (
        <div id="sidebar">
            <div
                className="overlay"
                style={{ visibility: showSidebar ? "visible" : `hidden` }}
                onClick={() => setShowSidebar(false)}
            ></div>

            <div
                className={`sidebar position-fixed right-0 top-0 bottom-0 BgsecondaryBlackColor ${showSidebar ? "show" : "hide"}`}
            >
                <div className="cart-header position-relative w-100">
                    <div className="cart-actions">
                        <button
                            type="button"
                            className="clear-cart d-none"
                            title="Clear All Cart"
                            onClick={(e) => handleClearCart(e)}
                        >
                            <IoTrashBin size={28} />
                        </button>
                        <button
                            type="button"
                            className="close-cart"
                            title="Close Side-bar"
                            onClick={() => setShowSidebar(false)}
                        >
                            <IoClose size={18} />
                        </button>
                    </div>
                    <h4 className="text-left orderTitle">Your Cart</h4>
                </div>
                <div className="cart-body flex-grow-1 overflow-y-auto">
                    {cart?.product &&
                        cart.product.map((cData) => {
                            return <CartList cData={cData} key={cData.id} />;
                        })}
                </div>
                <div className="cart-footer">
                    <OrderSummary cart={cart} />
                    <button
                        type="button"
                        className="btn btn-primary w-100 mb-2"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;