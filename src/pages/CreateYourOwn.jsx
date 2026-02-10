import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import "../assets/styles/custom.css";
import {
    deliverable,
    getAllIngredients,
    getPizzaPrice,
    getSides,
    orderPlace,
    settingApi,
} from "../services";
import LoadingLayout from "../layouts/LoadingLayout";
// import "../assets/styles/CreateYourOwn/style.css";
import {GlobalContext} from "../context/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CartList from "../components/_main/Cart/CartList";
import OrderSummary from "../components/_main/Cart/OrderSummary";
import {
    SelectedCheeseDropDown,
    SelectedCookDropDown,
    SelectedCrustDropDown,
    SelectedCrustTypeDropDown,
    SelectedSauceDropDown,
    SelectedSpecialbasesDropDown,
    SelectedSpicesDropDown,
} from "../components/CreateYourOwn/SelectedDropDown";
import CountAsTwo from "../components/CreateYourOwn/Toppings/CountAsTwo";
import CountAsOne from "../components/CreateYourOwn/Toppings/CountAsOne";
import FreeToppings from "../components/CreateYourOwn/Toppings/FreeToppings";
import Drinks from "../components/CreateYourOwn/Drinks";
import Dips from "../components/CreateYourOwn/Dips";
import Sides from "../components/CreateYourOwn/Sides";
import CartFunction from "../components/cart";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import ResponsiveCart from "../components/_main/Cart/ResponsiveCart";
import Tabs from "../components/Tabs/Tabs";

function CreateYourOwn() {
    const pizzaSizeArr = [
        {
            size: "Large",
        },
        {
            size: "Extra Large",
        },
    ];
    // Global Context
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [cart, setCart] = globalCtx.cart;
    const [payloadEdit, setPayloadEdit] = globalCtx.productEdit;
    const [url, setUrl] = globalCtx.urlPath;
    const [settings, setSettings] = globalCtx.settings;
    const [regUser, setRegUser] = globalCtx.regUser;
    // redux
    const { user } = useSelector((state) => state);
    // API States
    const [allIngredients, setAllIngredients] = useState();
    const [sideData, setSideData] = useState();
    //
    const navigate = useNavigate();
    const location = useLocation();
    //
    const [loading, setLoading] = useState(false);
    // Use Ref
    const pizzaSizeRef = useRef(null);
    // All State
    const [pizzaPriceObj, setPizzaPriceObj] = useState({}); // Developer: Shreyas Mahamuni, 22-11-2023
    const [totalPrice, setTotalPrice] = useState();
    const [pizzaSizePrice, setPizzaSizePrice] = useState();
    const [pizzaSize, setPizzaSize] = useState();
    const [crust, setCrust] = useState();
    const [cheese, setCheese] = useState();
    const [specialbases, setSpecialbases] = useState();
    const [countTwoToppingsArr, setCountTwoToppingsArr] = useState([]);
    const [countOneToppingsArr, setCountOneToppingsArr] = useState([]);
    const [freeToppingsArr, setFreeToppingsArr] = useState([]);
    const [drinksArr, setDrinksArr] = useState([]);
    const [dipsArr, setDipsArr] = useState([]);
    const [sidesArr, setSidesArr] = useState([]);
    const [reset, setReset] = useState();
    const [isAllIndiansTps, setIsAllIndiansTps] = useState(false);

    const [spicy, setSpicy] = useState({});
    const [sauce, setSauce] = useState({});
    const [cook, setCook] = useState({});
    const [crustType, setCrustType] = useState({});

    const nonRegularToppingsTitle =
        settings?.filter((item) => item.settingCode === "STG_5")[0].settingValue ??
        "Count 2";

    const regularToppingsTitle =
        settings?.filter((item) => item.settingCode === "STG_6")[0].settingValue ??
        "Count 1";

    const premiumToppingCount =
        Number(
            settings?.filter((item) => item.settingCode === "STG_7")[0].settingValue
        ) ?? Number(1);

    // Helper Function
    const cartFn = new CartFunction();

    // Handle Pizza Size and Its Price
    const handlePizzaSize = () => {
        if (pizzaSizeRef.current) {
            const filteredData = pizzaSizeArr.find(
                (data) => data.size === pizzaSizeRef.current.value
            );
            setPizzaSize(filteredData?.size);
            setPizzaSizePrice(
                filteredData?.size === "Large"
                    ? pizzaPriceObj?.largePizzaPrice
                    : pizzaPriceObj?.extraLargePizzaPrice
            );
        }
    };

    // Calculate Price
    const calulatePrice = () => {
        let calculatedPrice = Number(0);
        let totalTwoToppings = Number(0);
        let totalOneToppings = Number(0);
        let totalFreeToppings = Number(0);
        let totalDrinks = Number(0);
        let totalDips = Number(0);
        let totalSides = Number(0);

        if (countTwoToppingsArr) {
            countTwoToppingsArr.map(
                (twoTps) => (totalTwoToppings += Number(twoTps.amount))
            );
        }
        if (countOneToppingsArr) {
            countOneToppingsArr.map(
                (oneTps) => (totalOneToppings += Number(oneTps.amount))
            );
        }
        if (freeToppingsArr) {
            freeToppingsArr.map(
                (freeTps) => (totalFreeToppings += Number(freeTps.amount))
            );
        }
        if (drinksArr) {
            drinksArr.map((drinks) => (totalDrinks += Number(drinks.totalPrice)));
        }
        if (dipsArr) {
            dipsArr.map((dips) => (totalDips += Number(dips.totalPrice)));
        }
        if (sidesArr) {
            sidesArr.map((side) => (totalSides += Number(side.totalPrice)));
        }
        calculatedPrice += Number(pizzaSizePrice) || 0;
        calculatedPrice += Number(crust?.price) || 0;
        calculatedPrice += Number(crustType?.price) || 0;
        calculatedPrice += Number(cheese?.price) || 0;
        calculatedPrice += Number(specialbases?.price) || 0;
        calculatedPrice += Number(totalTwoToppings) || 0;
        calculatedPrice += Number(totalOneToppings) || 0;
        calculatedPrice += Number(totalFreeToppings) || 0;
        calculatedPrice += Number(totalDrinks) || 0;
        calculatedPrice += Number(totalDips) || 0;
        calculatedPrice += Number(totalSides) || 0;

        setTotalPrice(calculatedPrice);
    };
    // Handle Add To Cart
    const handleAddToCart = () => {
        if (
            payloadEdit &&
            payloadEdit !== undefined &&
            payloadEdit.productType === "custom_pizza" /// Changes
        ) {
            const editedPayload = {
                id: payloadEdit?.id,
                productCode: "#NA",
                productName: "Create Your Own",
                productType: "custom_pizza", /// Changes
                config: {
                    pizza: [
                        {
                            crust: crust,
                            crustType: crustType,
                            cheese: cheese,
                            specialBases: specialbases, /// Changes
                            spicy: spicy,
                            sauce: sauce,
                            cook: cook,
                            toppings: {
                                countAsTwoToppings: countTwoToppingsArr,
                                countAsOneToppings: countOneToppingsArr,
                                freeToppings: freeToppingsArr,
                                isAllIndiansTps: isAllIndiansTps,
                            },
                        },
                    ],
                    sides: sidesArr,
                    dips: dipsArr,
                    drinks: drinksArr,
                },
                quantity: Number(1),
                price: Number(totalPrice).toFixed(2),
                amount: Number(totalPrice).toFixed(2) * Number(1),
                taxPer: 0, /// changes
                pizzaSize: pizzaSize,
                pizzaPrice: pizzaSizePrice,
                comments: "",
            };
            if (editedPayload) {
                let ct = JSON.parse(localStorage.getItem("cart"));
                const filteredCart = ct?.product?.filter(
                    (items) => items?.id !== editedPayload?.id
                );
                filteredCart.push(editedPayload);
                const cartProduct = filteredCart;
                cartFn.addCart(cartProduct, setCart, true, settings);
                setPayloadEdit();
                resetControls();
            }
        } else {
            const payload = {
                id: uuidv4(),
                productCode: "#NA",
                productName: "Create Your Own",
                productType: "custom_pizza",
                config: {
                    pizza: [
                        {
                            crust: crust,
                            crustType: crustType,
                            cheese: cheese,
                            specialBases: specialbases,
                            spicy: spicy,
                            sauce: sauce,
                            cook: cook,
                            toppings: {
                                countAsTwoToppings: countTwoToppingsArr,
                                countAsOneToppings: countOneToppingsArr,
                                freeToppings: freeToppingsArr,
                                isAllIndiansTps: isAllIndiansTps,
                            },
                        },
                    ],
                    sides: sidesArr,
                    dips: dipsArr,
                    drinks: drinksArr,
                },
                quantity: Number(1),
                price: Number(totalPrice).toFixed(2),
                amount: Number(totalPrice).toFixed(2) * Number(1),
                taxPer: 0,
                pizzaSize: pizzaSize,
                pizzaPrice: pizzaSizePrice,
                comments: "",
            };
            if (payload) {
                let ct = JSON.parse(localStorage.getItem("cart"));
                ct.product.push(payload);
                const cartProduct = ct.product;
                cartFn.addCart(cartProduct, setCart, false, settings);
                resetControls();
            }
        }
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
        setPizzaSize(pizzaSizeArr[0]?.size);
        setPizzaSizePrice(
            pizzaSizeArr[0]?.size === "Large"
                ? pizzaPriceObj?.largePizzaPrice
                : pizzaPriceObj?.extraLargePizzaPrice
        );
        setCrust({
            crustCode: allIngredients?.crust[0].crustCode,
            crustName: allIngredients?.crust[0].crustName,
            price: allIngredients?.crust[0].price,
        });
        setCrustType({
            crustTypeCode: allIngredients?.crustType[0]?.crustTypeCode,
            crustType: allIngredients?.crustType[0]?.crustType,
            price: allIngredients?.crustType[0]?.price,
        });
        setCheese({
            cheeseCode: allIngredients?.cheese[0].cheeseCode,
            cheeseName: allIngredients?.cheese[0].cheeseName,
            price: allIngredients?.cheese[0].price,
        });
        setSpicy({
            spicyCode: allIngredients?.spices[0].spicyCode,
            spicy: allIngredients?.spices[0]?.spicy,
            price: allIngredients?.spices[0]?.price,
        });
        setSauce({
            sauceCode: allIngredients?.sauce[0]?.sauceCode,
            sauce: allIngredients?.sauce[0]?.sauce,
            price: allIngredients?.sauce[0]?.price,
        });
        setCook({
            cookCode: allIngredients?.cook[0]?.cookCode,
            cook: allIngredients?.cook[0]?.cook,
            price: allIngredients?.cook[0]?.price,
        });
        setSpecialbases({});
        setCountTwoToppingsArr([]);
        setCountOneToppingsArr([]);
        setFreeToppingsArr([]);
        setDrinksArr([]);
        setDipsArr([]);
        setSidesArr([]);
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 200);
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [allIngredientsRes, sidesRes, pizzaPriceRes, settingRes] =
                await Promise.all([
                    getAllIngredients(),
                    getSides(),
                    getPizzaPrice(),
                    settingApi(),
                ]);

            setAllIngredients(allIngredientsRes.data);
            setSideData(sidesRes.data);
            setPizzaPriceObj(pizzaPriceRes.data);
            setSettings(settingRes.data);
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // ----- UseEffects ----
    useEffect(() => {
        // Screen Always Set To Top after UseEffect Called
        setLoading(false);
        window.scrollTo(0, 0);
        setLoading(true);
        fetchAllData();
    }, []);

    // UseEffect For CreateCart When Cart is Null
    useEffect(() => {
        cartFn.createCart(setCart);
    }, [setCart]);
    const defaultPizzaConfig = useMemo(() => {
        if (!allIngredients || !pizzaPriceObj) return {};

        return {
            crust: {
                crustCode: allIngredients.crust[0].crustCode,
                crustName: allIngredients.crust[0].crustName,
                price: allIngredients.crust[0].price,
            },
            crustType: {
                crustTypeCode: allIngredients.crustType[0]?.crustTypeCode,
                crustType: allIngredients.crustType[0]?.crustType,
                price: allIngredients.crustType[0]?.price,
            },
            cheese: {
                cheeseCode: allIngredients.cheese[0].cheeseCode,
                cheeseName: allIngredients.cheese[0].cheeseName,
                price: allIngredients.cheese[0].price,
            },
            spicy: {
                spicyCode: allIngredients.spices[0].spicyCode,
                spicy: allIngredients.spices[0]?.spicy,
                price: allIngredients.spices[0]?.price,
            },
            sauce: {
                sauceCode: allIngredients.sauce[0]?.sauceCode,
                sauce: allIngredients.sauce[0]?.sauce,
                price: allIngredients.sauce[0]?.price,
            },
            cook: {
                cookCode: allIngredients.cook[0]?.cookCode,
                cook: allIngredients.cook[0]?.cook,
                price: allIngredients.cook[0]?.price,
            },
            specialbases: {},
            pizzaSize: pizzaSizeArr[0].size,
            pizzaSizePrice:
                pizzaSizeArr[0]?.size === "Large"
                    ? pizzaPriceObj.largePizzaPrice
                    : pizzaPriceObj.extraLargePizzaPrice,
        };
    }, [allIngredients, pizzaPriceObj]);

    useEffect(() => {
        if (defaultPizzaConfig && !payloadEdit) {
            setCrust(defaultPizzaConfig.crust);
            setCrustType(defaultPizzaConfig.crustType);
            setCheese(defaultPizzaConfig.cheese);
            setSpicy(defaultPizzaConfig.spicy);
            setSauce(defaultPizzaConfig.sauce);
            setCook(defaultPizzaConfig.cook);
            setSpecialbases(defaultPizzaConfig.specialbases);
            setPizzaSize(defaultPizzaConfig.pizzaSize);
            setPizzaSizePrice(defaultPizzaConfig.pizzaSizePrice);
        }
    }, [defaultPizzaConfig, payloadEdit]);

    // UseEffect For Calculate Function
    useEffect(() => {
        calulatePrice();
        if (
            freeToppingsArr.length === allIngredients?.toppings?.freeToppings?.length
        ) {
            setIsAllIndiansTps(true);
        } else {
            setIsAllIndiansTps(false);
        }
    }, [
        crust,
        crustType,
        cheese,
        specialbases,
        countTwoToppingsArr,
        countOneToppingsArr,
        freeToppingsArr,
        drinksArr,
        dipsArr,
        sidesArr,
        pizzaSizePrice,
        pizzaSize,
        pizzaPriceObj, // Developer: Shreyas Mahamuni, 22-11-2023
    ]);
    // Populate All Fields - Edit Pizza
    useEffect(() => {
        if (
            payloadEdit &&
            payloadEdit !== undefined &&
            payloadEdit.productType === "custom_pizza"
        ) {
            setPizzaSize(payloadEdit?.pizzaSize);
            setPizzaSizePrice(
                payloadEdit?.pizzaSize === "Large"
                    ? pizzaPriceObj?.largePizzaPrice
                    : pizzaPriceObj?.extraLargePizzaPrice
            ); // Developer: Shreyas Mahamuni, 22-11-2023
            setCrust(payloadEdit?.config?.pizza[0]?.crust);
            setCrustType(payloadEdit?.config?.pizza[0]?.crustType);
            setCheese(payloadEdit?.config?.pizza[0]?.cheese);
            setSpecialbases(payloadEdit?.config?.pizza[0]?.specialBases);

            setSpicy(payloadEdit?.config?.pizza[0]?.spicy);
            setSauce(payloadEdit?.config?.pizza[0]?.sauce);
            setCook(payloadEdit?.config?.pizza[0]?.cook);

            setCountTwoToppingsArr(
                payloadEdit?.config?.pizza[0]?.toppings?.countAsTwoToppings
            );
            setCountOneToppingsArr(
                payloadEdit?.config?.pizza[0]?.toppings?.countAsOneToppings
            );
            setFreeToppingsArr(payloadEdit?.config?.pizza[0]?.toppings?.freeToppings);
            setSidesArr(payloadEdit?.config?.sides);
            setDipsArr(payloadEdit?.config?.dips);
            setDrinksArr(payloadEdit?.config?.drinks);
        }
    }, [payloadEdit, pizzaPriceObj]);

    return (
        <div style={{ position: "relative" }}>
            <Header />
            <Tabs />
            {loading ? (
                <>
                    <LoadingLayout />
                </>
            ) : (
                <section className="container-fluid new-block m-0 p-0 w-100 BgsecondaryBlackColor">
                    <div className="nav-margin"></div>
                    <div className=" custmized-main">
                        <div className="d-flex flex-wrap justify-content-center bg-dark align-items-center p-3 custmized">
                            <h2 className="m-3 text-white primary-orange-color">
                                <strong>
                                    {payloadEdit && payloadEdit !== undefined
                                        ? "Create Your Own - Pizza [ Edit ]"
                                        : "Create Your Own - Pizza "}
                                </strong>
                            </h2>
                        </div>
                    </div>
                    <div className="row m-0 p-0 w-100 justify-content-center">
                        <div className="col-lg-9 col-md-12 col-sm-12 pizzaSelection py-lg-4 px-lg-3 px-3 py-4">
                            <div className="row mb-3 border-bottom">
                                <div className="col-lg-4 col-md-6 col-md-6 mb-3">
                                    <div className="d-flex flex-row flex-wrap justify-content-start align-items-center w-100 primaryWhiteColor">
                                        <p className="mb-1">Size :</p>
                                        <select
                                            className="select-input form-drop mx-4 bgPrimaryBlackColor primaryWhiteColor"
                                            ref={pizzaSizeRef}
                                            onChange={handlePizzaSize}
                                            value={pizzaSize}
                                        >
                                            {pizzaSizeArr?.map((data, index) => {
                                                return (
                                                    <option value={data.size} key={index}>
                                                        {data.size}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Crust, Cheese, Specialbases */}
                            <div className="row mb-3 border-bottom primaryWhiteColor">
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                    <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                        <p className="text-start mb-2">Crust :</p>
                                        <SelectedCrustDropDown
                                            allIngredients={allIngredients}
                                            setCrust={setCrust}
                                            crust={crust}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                    <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                        <p className="text-start mb-2">Crust Type :</p>
                                        <SelectedCrustTypeDropDown
                                            allIngredients={allIngredients}
                                            setCrustType={setCrustType}
                                            crustType={crustType}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                    <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                        <p className="text-start mb-2">Cheese :</p>
                                        <SelectedCheeseDropDown
                                            allIngredients={allIngredients}
                                            setCheese={setCheese}
                                            cheese={cheese}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                    <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                        <p className="text-start mb-2">Specialbases :</p>
                                        <SelectedSpecialbasesDropDown
                                            allIngredients={allIngredients}
                                            setSpecialbases={setSpecialbases}
                                            specialbases={specialbases}
                                            reset={reset}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                    <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                        <p className="text-start mb-2">Spicy :</p>
                                        <SelectedSpicesDropDown
                                            allIngredients={allIngredients}
                                            spicy={spicy}
                                            setSpicy={setSpicy}
                                            reset={reset}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                    <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                        <p className="text-start mb-2">Sauce :</p>
                                        <SelectedSauceDropDown
                                            allIngredients={allIngredients}
                                            sauce={sauce}
                                            setSauce={setSauce}
                                            reset={reset}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                    <div className="d-flex justify-content-center flex-column align-items-start w-100">
                                        <p className="text-start mb-2">Cook :</p>
                                        <SelectedCookDropDown
                                            allIngredients={allIngredients}
                                            cook={cook}
                                            setCook={setCook}
                                            reset={reset}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* toppings */}
                            <div className="p-2 pizza-heading text-center bgprimary-orange-color primaryWhiteColor">
                                <h4 className="my-1">Toppings</h4>
                            </div>
                            <div className="row gx-4 mb-3 mt-4 toppings primaryWhiteColor">
                                {/* count 2 toppings */}
                                <div className="col-md-4 col-sm-12 tpsContent mb-3">
                                    <p className="text-center tps-title pb-3 border-bottom border-3">
                                        {nonRegularToppingsTitle}
                                    </p>
                                    {allIngredients?.toppings?.countAsTwo?.map((data) => {
                                        return (
                                            <CountAsTwo
                                                key={data.toppingsCode}
                                                data={data}
                                                setCountTwoToppingsArr={setCountTwoToppingsArr}
                                                countTwoToppingsArr={countTwoToppingsArr}
                                                reset={reset}
                                                payloadEdit={payloadEdit}
                                            />
                                        );
                                    })}
                                </div>
                                {/* count 1 toppings */}
                                <div className="col-md-4 col-sm-12 tpsContent mb-3 primaryWhiteColor">
                                    <p className="text-center tps-title pb-3 border-bottom border-3">
                                        {regularToppingsTitle}
                                    </p>
                                    {allIngredients?.toppings?.countAsOne?.map((data) => {
                                        return (
                                            <CountAsOne
                                                key={data.toppingsCode}
                                                data={data}
                                                countOneToppingsArr={countOneToppingsArr}
                                                setCountOneToppingsArr={setCountOneToppingsArr}
                                                payloadEdit={payloadEdit}
                                                reset={reset}
                                            />
                                        );
                                    })}
                                </div>
                                {/* indians toppings (free) */}
                                <div className="col-md-4 col-sm-12 tpsContent mb-3 primaryWhiteColor">
                                    <p className="text-center tps-title pb-3 border-bottom border-3">
                                        Indians Style Toppings
                                    </p>
                                    {allIngredients?.toppings?.freeToppings?.map((data) => {
                                        return (
                                            <FreeToppings
                                                key={data.toppingsCode}
                                                data={data}
                                                setFreeToppingsArr={setFreeToppingsArr}
                                                freeToppingsArr={freeToppingsArr}
                                                payloadEdit={payloadEdit}
                                                reset={reset}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sides */}
                            <div className="p-2 pizza-heading text-center mb-2 bgprimary-orange-color primaryWhiteColor">
                                <h4 className="my-1">Sides</h4>
                            </div>
                            <div
                                className="row mb-3 primaryWhiteColor"
                                style={{ maxHeight: "450px", overflowY: "scroll" }}
                            >
                                <div id="sides" className="col-lg-12 mb-3 sidesContent">
                                    {sideData?.map((data) => {
                                        return (
                                            <Sides
                                                key={data.sideCode}
                                                data={data}
                                                setSidesArr={setSidesArr}
                                                sidesArr={sidesArr}
                                                reset={reset}
                                                payloadEdit={payloadEdit}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dips */}
                            <div className="p-2 pizza-heading text-center bgprimary-orange-color primaryWhiteColor">
                                <h4 className="my-1">Dips</h4>
                            </div>
                            <div className="row mb-3 primaryWhiteColor">
                                <div id="dips" className="col-lg-12 mb-3 dipsContent">
                                    {allIngredients?.dips?.map((data) => {
                                        return (
                                            <Dips
                                                key={data.dipsCode}
                                                data={data}
                                                setDipsArr={setDipsArr}
                                                dipsArr={dipsArr}
                                                payloadEdit={payloadEdit}
                                                reset={reset}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Drinks */}
                            <div className="p-2 pizza-heading text-center bgprimary-orange-color primaryWhiteColor">
                                <h4 className="my-1">Drinks</h4>
                            </div>
                            <div className="row mb-3 primaryWhiteColor">
                                <div id="drinks" className="col-lg-12 mb-3 drinksContent">
                                    {allIngredients?.softdrinks?.map((data) => {
                                        return (
                                            <Drinks
                                                key={data.softdrinkCode}
                                                data={data}
                                                setDrinksArr={setDrinksArr}
                                                drinksArr={drinksArr}
                                                reset={reset}
                                                payloadEdit={payloadEdit}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 py-lg-4 px-lg-3 d-lg-block d-none">
                            {/* Total Price and Add To Cart - Button */}
                            <div className="d-flex w-100 align-items-center justify-content-center flex-column position-relative">
                                <p className="text-dark mb-3 primaryWhiteColor">
                                    <strong>
                                        $
                                        {totalPrice
                                            ? Number(totalPrice).toFixed(2)
                                            : (0.0).toFixed(2)}
                                    </strong>
                                </p>
                                <button
                                    type="button"
                                    className="addtocartbtn w-50 btn btn-sm px-3 py-2 text-white"
                                    onClick={handleAddToCart}
                                >
                                    <b>
                                        {payloadEdit &&
                                            payloadEdit !== undefined &&
                                            payloadEdit?.productType === "custom_pizza"
                                            ? "Update Pizza"
                                            : "Add To Cart"}
                                    </b>
                                </button>
                            </div>

                            {/* Cart List */}
                            <div className="cartlist w-100 mt-5 bgPrimaryBlackColor primaryWhiteColor">
                                <h2 className="p-3 text-center orderTitle">Your Orders</h2>
                                {cart?.product.map((cData) => {
                                    return (
                                        <CartList
                                            cData={cData}
                                            key={cData.id}
                                            setPayloadEdit={setPayloadEdit}
                                            payloadEdit={payloadEdit}
                                            resetControls={resetControls}
                                            setLoading={setLoading}
                                        />
                                    );
                                })}
                            </div>
                            {/* Place Order */}
                            <div className="placeorder w-100 mt-5">
                                <OrderSummary cart={cart} />
                                <div className="placeOrderBtn w-100 mt-3">
                                    <button
                                        className="btn btn-md w-100 py-2 btn-pills"
                                        onClick={handlePlaceOrder}
                                    >
                                        Place Order{" "}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ResponsiveCart
                        handleAddToCart={handleAddToCart}
                        totalPrice={totalPrice}
                        payloadEdit={payloadEdit}
                    />
                </section>
            )}
            <Footer />
        </div>
    );
}

export default CreateYourOwn;
