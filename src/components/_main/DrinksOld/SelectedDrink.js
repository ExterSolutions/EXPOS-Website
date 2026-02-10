import React, { useContext, useEffect, useMemo, useState } from "react";
import Header from "../Header/Header";
import LoadingLayout from "../../../layouts/LoadingLayout";
import { GlobalContext } from "../../../context/GlobalContext";
import {
    deliverable,
    getDrinks,
    orderPlace,
    settingApi,
} from "../../../services";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SelectedDrinksDropdown } from "./SelectedDrinksDropdown";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import CartFunction from "../../cart";
import { toast } from "react-toastify";

function SelectedDrink() {
    // Global Context
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [cart, setCart] = globalCtx.cart;
    const [settings, setSettings] = globalCtx.settings;
    const [regUser, setRegUser] = globalCtx.regUser;
    //
    const [selectedDrinks, setSelectedDrinks] = useState({});
    const [selectedDrinksTypeArr, setSelectedDrinksTypeArr] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);

    const cartFn = new CartFunction();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const { did } = useParams();

    // Tax Percentage

    // Handle Multiple Drinks Dropdown
    const spSelection = [];
    for (let i = 1; i <= selectedDrinks?.drinksCount; i++) {
        spSelection.push(
            <SelectedDrinksDropdown
                key={i}
                count={i}
                reset={reset}
                drinksType={selectedDrinks?.drinkType}
                setSelectedDrinksTypeArr={setSelectedDrinksTypeArr}
                selectedDrinksTypeArr={selectedDrinksTypeArr}
                drinkData={selectedDrinks}
            />
        );
    }

    const handleAddToCart = () => {
        // For Comments Logic - Create String with comma separated
        const drinksComments = selectedDrinksTypeArr.join(", ");

        // Cart Object
        const payload = {
            id: uuidv4(),
            customerCode: user?.data?.customerCode,
            cashierCode: "#NA",
            productCode: selectedDrinks.softdrinkCode,
            productName: selectedDrinks.softDrinksName,
            productType: "drinks",
            config: {
                type: "",
            },
            price: selectedDrinks.price,
            quantity: 1,
            amount: selectedDrinks?.price,
            taxPer: 0,
            pizzaSize: "",
            comments: drinksComments,
        };
        if (payload) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            ct.product.push(payload);
            const cartProduct = ct.product;
            cartFn.addCart(cartProduct, setCart, false, settings);
            resetControls();
        }
    };

    // PaymentGateway
    const paymentGateway = () => {
        let custFullName = regUser.firstName + " " + regUser?.lastName;
        const payload = {
            callbackUrl: import.meta.env.VITE_APP_CALLBACKURL,
            cancelUrl: import.meta.env.VITE_APP_CANCEL,
            customerCode: user?.data?.customerCode,
            customerName: custFullName,
            mobileNumber: regUser?.mobileNumber,
            address: regUser?.address,
            zipCode: regUser?.zipcode,
            products: cart?.product,
            subTotal: cart?.subtotal,
            discountAmount: cart?.discountAmount,
            taxPer: cart?.taxPer,
            taxAmount: cart?.taxAmount,
            deliveryCharges: cart?.deliveryCharges,
            extraDeliveryCharges: cart?.extraDeliveryCharges,
            grandTotal: cart?.grandtotal,
        };
        orderPlace(payload)
            .then((response) => {
                localStorage.setItem("placedOrder", JSON.stringify(response));
                navigate("/order/verify");
                setLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 400 || error.response.status === 500) {
                    toast.error(error.response.data.message);
                }
            });
    };

    // Handle Place Order
    const handlePlaceOrder = async () => {
        if (cart?.product?.length > 0) {
            if (isAuthenticated && user !== null) {
                navigate("/checkout");
            } else {
                localStorage.setItem("redirectTo", location?.pathname);
                navigate("/login");
            }
        } else {
            toast.error("Cart is Empty...");
        }
    };

    // Reset Controls
    const resetControls = () => {
        // Reset All Fields
        setSelectedDrinksTypeArr([]);
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 200);
    };

    // ------- UseEffect -------
    useEffect(() => {
        cartFn.createCart(setCart);
    }, [setCart]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [drinksResponse, settingsResponse] = await Promise.all([
                getDrinks(),
                settingApi(),
            ]);
            // Process drinks response
            const selectedObject = drinksResponse.data.find(
                (data) => data?.softdrinkCode === did
            );
            setSelectedDrinks(selectedObject);
            setSettings(settingsResponse.data);

        } catch (err) {
            if (
                err.response &&
                (err.response.status === 400 || err.response.status === 500)
            ) {
                toast.error(err.response.data.message);
            } else {
                console.error("Error fetching data:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    const memoizedGetDrinks = useMemo(getDrinks, []);
    const memoizedSettingApi = useMemo(settingApi, []);

    return (
        <div>
            <Header />
            {loading === true ? (
                <>
                    <LoadingLayout />
                </>
            ) : (
                <>
                    <section
                        className="container-fluid vh-100 new-block m-0 p-0 w-100 BgsecondaryBlackColor"
                        style={{ position: "relative" }}
                    >
                        <div className="nav-margin"></div>
                        {/* Heading */}
                        <div className="position-sticky top-0 custmized-main ">
                            <div className="d-flex flex-wrap justify-content-center bg-dark align-items-center p-3 custmized">
                                <h2 className="m-3 text-white primary-orange-color">
                                    <strong>{selectedDrinks?.softDrinksName}</strong>
                                </h2>
                            </div>
                        </div>
                        <div className="row m-0 p-0 w-100 justify-content-center">
                            <div className="col-lg-9 col-md-12 col-sm-12 pizzaSelection py-lg-4 px-lg-3 px-3 py-4">
                                <div className="row mb-3 border-bottom justify-content-center">
                                    <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                                        <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                            <div className="p-2 w-100 pizza-heading text-center mb-4 primaryWhiteColor bgprimary-orange-color">
                                                <h4 className="my-1">Select Drink Type</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                                        <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                            <div className="row justify-content-center w-100 m-0 p-0 primaryWhiteColor">
                                                {spSelection}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 py-lg-4 px-lg-3 d-lg-block d-none">
                                {/* Total Price and Add To Cart - Button */}
                                <div className="d-flex w-100 align-items-center justify-content-center flex-column position-relative ">
                                    <p className="text-dark mb-3 primaryWhiteColor">
                                        <strong>
                                            $
                                            {selectedDrinks?.price
                                                ? Number(selectedDrinks?.price).toFixed(2)
                                                : (0.0).toFixed(2)}
                                        </strong>
                                    </p>
                                    <button
                                        type="button"
                                        className="addtocartbtn w-50 btn btn-sm px-3 py-2 text-white"
                                        onClick={handleAddToCart}
                                    >
                                        <b>Add To Cart</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default SelectedDrink;
