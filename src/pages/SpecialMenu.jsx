import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import SpecialPizzaSelection from "../components/_main/SpecialPizzaSelection";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    deliverable,
    getDips,
    getSpecialDetails,
    getToppings,
    orderPlace,
    settingApi,
} from "../services";
import LoadingLayout from "../layouts/LoadingLayout";
import { toast } from "react-toastify";
import {GlobalContext} from "../context/GlobalContext";
import CartList from "../components/_main/Cart/CartList";
import OrderSummary from "../components/_main/Cart/OrderSummary";
import Sides from "../components/SpecialPizza/Sides";
import Dips from "../components/SpecialPizza/Dips";
import Drinks from "../components/SpecialPizza/Drinks";
import { v4 as uuidv4 } from "uuid";
import CartFunction from "../components/cart";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import ResponsiveCart from "../components/_main/Cart/ResponsiveCart";
import SPNotFound from "../layouts/SPNotFound";

function SpecialMenu() {
    // Global Context
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [payloadEdit, setPayloadEdit] = globalCtx.productEdit;
    const [cart, setCart] = globalCtx.cart;
    const [settings, setSettings] = globalCtx.settings;
    const [regUser, setRegUser] = globalCtx.regUser;
    // redux
    const { user } = useSelector((state) => state);
    // API Response - States
    const [getSpecialData, setGetSpecialData] = useState();
    const [dipsData, setDipsData] = useState();
    const [toppingsData, setToppingsData] = useState();
    // Helper Function
    const cartFn = new CartFunction();
    // UseRef
    const pizzaSizeRef = useRef(null);
    //
    const navigate = useNavigate();
    const location = useLocation();
    const { sid } = useParams();
    // All States
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [pizzaSize, setPizzaSize] = useState("Large");
    const [pizzaSizePrice, setPizzaSizePrice] = useState();
    const [pizzaState, setPizzaState] = useState([]);
    const [sidesArr, setSidesArr] = useState([]);
    const [dipsObj, setDipsObj] = useState([]);
    const [drinksObj, setDrinksObj] = useState([]);
    const [totalPrice, setTotalPrice] = useState();
    let calcDipsArr = [];
    let calcOneTpsArr = [];
    let calcTwoTpsArr = [];
    let noOfFreeToppings = Number(getSpecialData?.noofToppings);
    let noOfAdditionalTps = Number(0);
    // Free Toppings, Sides, Dips, Drinks
    const [freeTpsCount, setFreeTpsCount] = useState();
    const [additionalTps, setAdditionalTps] = useState(0);
    const [settingsData, setSettingsData] = useState([]);

    const nonRegularToppingsTitle =
        settingsData.find((item) => item.shortCode === "non-regular-toppings")?.settingValue ??
        "Premium";

    const regularToppingsTitle =
        settingsData.find((item) => item.shortCode === "regular-toppings")?.settingValue ??
        "Regular";

    const premiumToppingCount =
        Number(
            settingsData.find((item) => item.shortCode === "non-regular-toppings-count")?.settingValue
        ) || 1;

    // Handle Pizza Size and Price
    const handlePizzaSize = () => {
        if (pizzaSizeRef.current) {
            if (pizzaSizeRef.current.value === "Large") {
                setPizzaSize("Large");
                setPizzaSizePrice(getSpecialData?.largePizzaPrice);
            }
            if (pizzaSizeRef.current.value === "Extra Large") {
                setPizzaSize("Extra Large");
                setPizzaSizePrice(getSpecialData?.extraLargePizzaPrice);
            }
        }
    };

    // Handle Crust
    const handleCrust = (e, count) => {
        const selectedCrust = getSpecialData?.crust?.find(
            (data) => data.code === e.target.value
        );
        let crustObject = {
            crustCode: selectedCrust?.code,
            crustName: selectedCrust?.crustName,
            price: selectedCrust?.price,
        };
        let arr = [...pizzaState];
        arr[count - 1] = {
            ...arr[count - 1],
            crust: crustObject,
        };
        setPizzaState(arr);
    };

    // handle crust change
    const handleCrustTypeChange = (event, count) => {
        const selectedValue = event.target.value;
        const selectedCrustType = getSpecialData?.crustType?.find(
            (option) => option.crustTypeCode === selectedValue
        );
        let crustTypeObject = {
            crustTypeCode: selectedCrustType?.crustTypeCode,
            crustType: selectedCrustType?.crustType,
            price: selectedCrustType?.price,
        };
        let arr = [...pizzaState];
        arr[count - 1] = {
            ...arr[count - 1],
            crustType: crustTypeObject,
        };
        setPizzaState(arr);
    };

    // Handle Cheese
    const handleCheese = (e, count) => {
        const selectedCheese = getSpecialData?.cheese?.find(
            (data) => data.code === e.target.value
        );
        let cheeseObject = {
            cheeseCode: selectedCheese?.code,
            cheeseName: selectedCheese?.cheeseName,
            price: selectedCheese?.price,
        };
        let arr = [...pizzaState];
        arr[count - 1] = {
            ...arr[count - 1],
            cheese: cheeseObject,
        };
        setPizzaState(arr);
    };
    // Handle SpecialBases
    const handleSpecialbases = (e, count) => {
        const selectedSpecialbases = getSpecialData?.specialbases?.find(
            (data) => data.code === e.target.value
        );
        let specialbasesObject = {
            specialbaseCode: selectedSpecialbases?.code,
            specialbaseName: selectedSpecialbases?.specialbaseName,
            price: selectedSpecialbases?.price,
        };
        let arr = [...pizzaState];
        arr[count - 1] = {
            ...arr[count - 1],
            specialBases: specialbasesObject,
        };
        setPizzaState(arr);
    };
    const handleSpicy = (e, count) => {
        const seletcedSpicy = getSpecialData?.spices?.find(
            (data) => data?.spicyCode === e.target.value
        );
        let spicyObject = {
            spicyCode: seletcedSpicy?.spicyCode,
            spicy: seletcedSpicy?.spicy,
            price: seletcedSpicy?.price,
        };
        let arr = [...pizzaState];
        arr[count - 1] = {
            ...arr[count - 1],
            spicy: spicyObject,
        };
        setPizzaState(arr);
    };
    const handleSauce = (e, count) => {
        const selectedSauce = getSpecialData?.sauce?.find(
            (data) => data?.sauceCode === e.target.value
        );
        let sauceObject = {
            sauceCode: selectedSauce?.sauceCode,
            sauce: selectedSauce?.sauce,
            price: selectedSauce?.price,
        };
        let arr = [...pizzaState];
        arr[count - 1] = {
            ...arr[count - 1],
            sauce: sauceObject,
        };
        setPizzaState(arr);
    };
    const handleCook = (e, count) => {
        const selectedCook = getSpecialData?.cook?.find(
            (data) => data?.cookCode === e.target.value
        );
        let cookObject = {
            cookCode: selectedCook?.cookCode,
            cook: selectedCook?.cook,
            price: selectedCook?.price,
        };
        let arr = [...pizzaState];
        arr[count - 1] = {
            ...arr[count - 1],
            cook: cookObject,
        };
        setPizzaState(arr);
    };

    // Component - Special Pizza Selection
    const spSelection = [];
    for (let i = 1; i <= getSpecialData?.noofPizzas; i++) {
        spSelection.push(
            <SpecialPizzaSelection
                key={i}
                getSpecialData={getSpecialData}
                count={i}
                reset={reset}
                toppingsData={toppingsData}
                pizzaState={pizzaState}
                setPizzaState={setPizzaState}
                handleCrust={handleCrust}
                handleCrustTypeChange={handleCrustTypeChange}
                handleCheese={handleCheese}
                handleSpecialbases={handleSpecialbases}
                handleSpicy={handleSpicy}
                handleSauce={handleSauce}
                handleCook={handleCook}
                setFreeTpsCount={setFreeTpsCount}
                freeTpsCount={freeTpsCount}
                additionalTps={additionalTps}
                setAdditionalTps={setAdditionalTps}
                payloadEdit={payloadEdit}
            />
        );
    }
    // Calculate Price
    const calulatePrice = () => {
        debugger;
        let calculatedPrice = Number(0);
        let totalOneTpsPrice = Number(0);
        let totalTwoTpsPrice = Number(0);

        calculatedPrice +=
            pizzaSize === "Large"
                ? Number(getSpecialData?.largePizzaPrice)
                : pizzaSize === "Extra Large"
                    ? Number(getSpecialData?.extraLargePizzaPrice)
                    : 0;

        setPizzaSizePrice(
            pizzaSize === "Large"
                ? Number(getSpecialData?.largePizzaPrice)
                : pizzaSize === "Extra Large"
                    ? Number(getSpecialData?.extraLargePizzaPrice)
                    : 0
        );
        // OnChange Pizza Size - Price
        // calculatedPrice += Number(pizzaSizePrice) || 0;

        // Crust, Cheese & Specialbases - Price
        pizzaState.forEach((items) => {
            // OnChange Crust Price
            calculatedPrice += items?.crust?.price ? Number(items?.crust?.price) : 0;
            // OnChnage CrustType Price
            calculatedPrice += items?.crustType?.price
                ? Number(items?.crustType?.price)
                : 0;
            // OnChange Cheese Price
            calculatedPrice += items?.cheese?.price
                ? Number(items?.cheese?.price)
                : 0;
            // OnChange Specialbases Price
            calculatedPrice += items?.specialBases?.price
                ? Number(items?.specialBases?.price)
                : 0;
        });

        let pizzaCartons = [];
        for (let i = 0; i < getSpecialData?.noofPizzas; i++) {
            pizzaCartons.push(i);
        }

        // Handle CountAsOne & CountAsTwo Toppings - Price
        pizzaState?.map((data) => {
            let amount = 0;
            pizzaCartons.map((pizzaCarton) => {
                if (data?.toppings?.countAsTwoToppings.length > 0) {
                    data?.toppings?.countAsTwoToppings?.map((items) => {
                        if (items.pizzaIndex === pizzaCarton) {
                            if (noOfFreeToppings > 1) {
                                let tpsObj = {
                                    ...items,
                                    amount: 0,
                                };
                                calcTwoTpsArr.push(tpsObj);
                                noOfFreeToppings -= Number(premiumToppingCount);
                            } else if (noOfFreeToppings === 1) {
                                let tpsObj = {
                                    ...items,
                                    amount: Number(items?.toppingsPrice) / 2,
                                };
                                calcTwoTpsArr.push(tpsObj);
                                noOfFreeToppings -= Number(1);
                                noOfAdditionalTps++;
                            } else {
                                calcTwoTpsArr.push(items);
                                noOfAdditionalTps += Number(premiumToppingCount);
                            }
                        }
                    });
                }
                if (data?.toppings?.countAsOneToppings.length > 0) {
                    data?.toppings?.countAsOneToppings?.map((items) => {
                        if (items.pizzaIndex === pizzaCarton) {
                            if (noOfFreeToppings > 0) {
                                let tpsObj = {
                                    ...items,
                                    amount: amount,
                                };
                                calcOneTpsArr.push(tpsObj);
                                noOfFreeToppings--;
                            } else {
                                calcOneTpsArr.push(items);
                                noOfAdditionalTps++;
                            }
                        }
                    });
                }
            });
        });
        calcOneTpsArr?.map((tps) => {
            totalOneTpsPrice += Number(tps?.amount);
        });
        calculatedPrice += totalOneTpsPrice;
        calcTwoTpsArr?.map((tps) => {
            totalTwoTpsPrice += Number(tps?.amount);
        });
        calculatedPrice += totalTwoTpsPrice;

        // Set Total Price
        setTotalPrice(Number(calculatedPrice).toFixed(2));
    };
    // Handle Cart
    const handleAddToCart = () => {
        if (
            payloadEdit &&
            payloadEdit !== undefined &&
            payloadEdit.productType === "special_pizza"
        ) {
            // Updated Arr of CountAsOne After Calculation
            if (calcOneTpsArr?.length > 0) {
                let arr = [...pizzaState];
                calcOneTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings = [];
                });
                calcOneTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings = [
                        ...arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings,
                        tpsObj,
                    ];
                });
            }
            // Updated Arr of CountAsTwo After Calculation
            if (calcTwoTpsArr?.length > 0) {
                let arr = [...pizzaState];
                calcTwoTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings = [];
                });
                calcTwoTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings = [
                        ...arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings,
                        tpsObj,
                    ];
                });
            }

            let arr = [...pizzaState];

            pizzaState?.map((item, index) => {
                if (
                    toppingsData?.toppings?.freeToppings.length ===
                    item?.toppings?.freeToppings.length
                ) {
                    if (arr[index]) {
                        arr[index] = {
                            ...arr[index],
                            toppings: {
                                ...arr[index].toppings,
                                isAllIndiansTps: true,
                            },
                        };
                    }
                } else {
                    if (arr[index]) {
                        arr[index] = {
                            ...arr[index],
                            toppings: {
                                ...arr[index].toppings,
                                isAllIndiansTps: false,
                            },
                        };
                    }
                }
            });

            const editedPayload = {
                id: payloadEdit?.id,
                productCode: payloadEdit?.productCode,
                productName: getSpecialData?.name,
                productType: "special_pizza",
                config: {
                    pizza: arr,
                    sides: sidesArr,
                    dips: dipsObj,
                    drinks: drinksObj,
                },
                quantity: Number(1),
                price: Number(totalPrice).toFixed(2),
                amount: Number(totalPrice).toFixed(2) * Number(1),
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
                // Reset All Fields
                resetControls();
                setPayloadEdit();
            }
        } else {
            // Updated Arr of CountAsOne After Calculation
            if (calcOneTpsArr?.length > 0) {
                let arr = [...pizzaState];
                calcOneTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings = [];
                });
                calcOneTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings = [
                        ...arr[tpsObj?.pizzaIndex].toppings.countAsOneToppings,
                        tpsObj,
                    ];
                });
            }
            // Updated Arr of CountAsTwo After Calculation
            if (calcTwoTpsArr?.length > 0) {
                let arr = [...pizzaState];
                calcTwoTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings = [];
                });
                calcTwoTpsArr?.map((tpsObj) => {
                    arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings = [
                        ...arr[tpsObj?.pizzaIndex].toppings.countAsTwoToppings,
                        tpsObj,
                    ];
                });
            }
            let arr = [...pizzaState];
            pizzaState?.map((item, index) => {
                if (
                    toppingsData?.toppings?.freeToppings?.length ===
                    item?.toppings?.freeToppings?.length
                ) {
                    if (arr[index]) {
                        arr[index].toppings.isAllIndiansTps = true; // Replace 'true' with the desired value
                    }
                } else {
                    if (arr[index]) {
                        arr[index].toppings.isAllIndiansTps = false; // Replace 'true' with the desired value
                    }
                }
            });
            setPizzaState(arr);

            const payload = {
                id: uuidv4(),
                productCode: getSpecialData?.code,
                productName: getSpecialData?.name,
                productType: "special_pizza",
                config: {
                    pizza: pizzaState,
                    sides: sidesArr,
                    dips: dipsObj,
                    drinks: drinksObj,
                },
                quantity: Number(1),
                price: Number(totalPrice).toFixed(2),
                amount: Number(totalPrice).toFixed(2) * Number(1),
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
                setLoading(false);
            } else {
                localStorage.setItem("redirectTo", location?.pathname);
                navigate("/login");
            }
        } else {
            toast.error("Cart is Empty...");
            setLoading(false);
        }
    };

    // Reset Controls
    const resetControls = () => {
        if (Number(getSpecialData?.largePizzaPrice) !== 0) {
            setPizzaSize("Large");
            setPizzaSizePrice(Number(getSpecialData?.largePizzaPrice));
            setTotalPrice(getSpecialData?.largePizzaPrice);
        } else {
            setPizzaSize("Extra Large");
            setPizzaSizePrice(Number(getSpecialData?.extraLargePizzaPrice));
            setTotalPrice(getSpecialData?.extraLargePizzaPrice);
        }
        setFreeTpsCount(Number(getSpecialData?.noofToppings));
        createEmptyObjects(Number(getSpecialData?.noofPizzas));
        if (getSpecialData?.pops && getSpecialData?.pops?.length > 0) {
            setDrinksObj([
                {
                    drinksCode: getSpecialData?.pops[0]?.code,
                    drinksName: getSpecialData?.pops[0]?.softDrinkName,
                    drinksPrice: getSpecialData?.pops[0]?.price,
                    quantity: 1,
                    totalPrice: Number(0.0).toFixed(2),
                },
            ]);
        } else {
            setDrinksObj([]);
        }
        if (getSpecialData?.freesides && getSpecialData?.freesides.length > 0) {
            const combinationData = getSpecialData?.freesides?.[0]?.lineEntries?.[0];
            const sidesObject = {
                sideCode: getSpecialData?.freesides?.[0]?.code,
                sideName: getSpecialData?.freesides?.[0]?.sideName,
                sideType: getSpecialData?.freesides?.[0]?.type,
                lineCode: combinationData?.code,
                sidePrice: combinationData?.price,
                sideSize: combinationData?.size,
                quantity: 1,
                totalPrice: Number(0.0).toFixed(2),
            };
            setSidesArr([sidesObject]);
        } else {
            setSidesArr([]);
        }
        if (Number(getSpecialData?.noofDips) > 0) {
            setDipsObj([
                {
                    dipsCode: dipsData?.[0]?.dipsCode,
                    dipsName: dipsData?.[0]?.dipsName,
                    dipsPrice: dipsData?.[0]?.price,
                    quantity: Number(getSpecialData?.noofDips),
                    totalPrice: Number(0.0).toFixed(2),
                },
            ]);
        } else {
            setDipsObj([]);
        }
        // calcDipsArr = [];
        setAdditionalTps(0);
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 1000);
    };

    // Create Empty Object of Pizza States
    const createEmptyObjects = (count) => {
        let crustObject = {
            crustCode: getSpecialData?.crust[0].code,
            crustName: getSpecialData?.crust[0].crustName,
            price: getSpecialData?.crust[0].price,
        };
        let crustTypeObject = {
            crustTypeCode: getSpecialData?.crustType[0].crustTypeCode,
            crustType: getSpecialData?.crustType[0].crustType,
            price: getSpecialData?.crustType[0].price ?? 0,
        };
        let cheeseObject = {
            cheeseCode: getSpecialData?.cheese[0].code,
            cheeseName: getSpecialData?.cheese[0].cheeseName,
            price: getSpecialData?.cheese[0].price,
        };
        let spicyObject = {
            spicyCode: getSpecialData?.spices[0].spicyCode,
            spicy: getSpecialData?.spices[0]?.spicy,
            price: getSpecialData?.spices[0]?.price,
        };
        let sauceObject = {
            sauceCode: getSpecialData?.sauce[0]?.sauceCode,
            sauce: getSpecialData?.sauce[0]?.sauce,
            price: getSpecialData?.sauce[0]?.price,
        };
        let cookObject = {
            cookCode: getSpecialData?.cook[0]?.cookCode,
            cook: getSpecialData?.cook[0]?.cook,
            price: getSpecialData?.cook[0]?.price,
        };
        const emptyObjectsArray = Array.from({ length: count }, () => ({
            crust: crustObject,
            cheese: cheeseObject,
            crustType: crustTypeObject,
            specialBases: {},
            spicy: spicyObject,
            sauce: sauceObject,
            cook: cookObject,
            toppings: {
                countAsTwoToppings: [],
                countAsOneToppings: [],
                freeToppings: [],
                isAllIndiansTps: false,
            },
        }));
        setPizzaState(emptyObjectsArray);
    };

    // ----- API Endpoints -----
    const getSpecial = async () => {
        try {
            const res = await getSpecialDetails(sid);
            return res.data;
        } catch (err) {
            throw err;
        }
    };
    const dips = async () => {
        try {
            const res = await getDips();
            return res.data;
        } catch (err) {
            throw err;
        }
    };
    const toppings = async () => {
        try {
            const res = await getToppings();
            return res.data;
        } catch (err) {
            throw err; // Re-throw to handle it in Promise.all
        }
    };

    // ----- UseEffect -----
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [specialData, dipsData, toppingsData, settingRes] =
                    await Promise.all([getSpecial(), dips(), toppings(), settingApi()]);

                setGetSpecialData(specialData);
                setDipsData(dipsData);
                setToppingsData(toppingsData);
                setSettings(settingRes?.data);
                setSettingsData(settingRes?.data);
            } catch (error) {
                if (error.response?.status === 400 || error.response?.status === 500) {
                    toast.error(error.response.data.message);
                }
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo(0, 0);
        fetchData();
    }, []);

    // UseEffect For CreateCart When Cart is Null
    useEffect(() => {
        cartFn.createCart(setCart);
    }, [setCart]);
    // Calculate Function
    useEffect(() => {
        calulatePrice();
        setFreeTpsCount(noOfFreeToppings);
        setAdditionalTps(noOfAdditionalTps);
    }, [
        sidesArr,
        dipsObj,
        drinksObj,
        pizzaSize,
        pizzaSizePrice,
        pizzaState,
        calcDipsArr,
        calcOneTpsArr,
        calcTwoTpsArr,
        noOfFreeToppings,
    ]);
    // UseEffect For Set Default Values
    useEffect(() => {
        if (!payloadEdit) {
            createEmptyObjects(Number(getSpecialData?.noofPizzas));

            // set number of free toppings
            if (getSpecialData?.noofToppings !== undefined) {
                setFreeTpsCount(Number(getSpecialData?.noofToppings));
                setAdditionalTps(0);
            }

            if (Number(getSpecialData?.largePizzaPrice) !== 0) {
                setPizzaSize("Large");
                setPizzaSizePrice(Number(getSpecialData?.largePizzaPrice));
                setTotalPrice(getSpecialData?.largePizzaPrice);
            } else {
                setPizzaSize("Extra Large");
                setPizzaSizePrice(Number(getSpecialData?.extraLargePizzaPrice));
                setTotalPrice(getSpecialData?.extraLargePizzaPrice);
            }

            if (getSpecialData?.freesides && getSpecialData?.freesides.length > 0) {
                const combinationData =
                    getSpecialData?.freesides?.[0]?.lineEntries?.[0];
                const sidesObject = {
                    sideCode: getSpecialData?.freesides?.[0]?.code,
                    sideName: getSpecialData?.freesides?.[0]?.sideName,
                    sideType: getSpecialData?.freesides?.[0]?.type,
                    lineCode: combinationData?.code,
                    sidePrice: combinationData?.price,
                    sideSize: combinationData?.size,
                    quantity: 1,
                    totalPrice: Number(0.0).toFixed(2),
                };
                setSidesArr([sidesObject]);
            } else {
                setSidesArr([]);
            }
            if (Number(getSpecialData?.noofDips) > 0) {
                setDipsObj([
                    {
                        dipsCode: dipsData?.[0]?.dipsCode,
                        dipsName: dipsData?.[0]?.dipsName,
                        dipsPrice: dipsData?.[0]?.price,
                        quantity: Number(getSpecialData?.noofDips),
                        totalPrice: Number(0.0).toFixed(2),
                    },
                ]);
            } else {
                setDipsObj([]);
            }
            if (getSpecialData?.pops && getSpecialData?.pops?.length > 0) {
                setDrinksObj([
                    {
                        drinksCode: getSpecialData?.pops[0]?.code,
                        drinksName: getSpecialData?.pops[0]?.softDrinkName,
                        drinksPrice: getSpecialData?.pops[0]?.price,
                        quantity: 1,
                        totalPrice: Number(0.0).toFixed(2),
                    },
                ]);
            } else {
                setDrinksObj([]);
            }
        }
    }, [getSpecialData]);
    // Populate All Fields - Edit Pizza
    useEffect(() => {
        if (
            payloadEdit &&
            payloadEdit !== undefined &&
            payloadEdit.productType === "special_pizza"
        ) {
            setPizzaSize(payloadEdit?.pizzaSize);
            // if (payloadEdit?.pizzaSize === "Large") {
            //   setPizzaSizePrice(getSpecialData?.largePizzaPrice);
            // }
            // if (payloadEdit?.pizzaSize === "Extra Large") {
            //   setPizzaSizePrice(getSpecialData?.extraLargePizzaPrice);
            // }
            setPizzaSizePrice(payloadEdit?.pizzaPrice);
            setPizzaState(payloadEdit?.config?.pizza);
            setSidesArr(payloadEdit?.config?.sides);
            setDipsObj(payloadEdit?.config?.dips);
            setDrinksObj(payloadEdit?.config?.drinks);
        }
    }, [payloadEdit]);

    return (
        <div>
            <Header />
            {loading ? (
                <LoadingLayout />
            ) : (
                <>
                    {Number(getSpecialData?.showOnClient) === 1 ? (
                        <section className="container-fluid new-block m-0 p-0 w-100 BgsecondaryBlackColor primaryWhiteColor">
                            <div className="nav-margin"></div>
                            {/* Heading */}
                            <div className="custmized-main">
                                <div className="d-flex justify-content-center align-items-center bg-dark p-3 custmized">
                                    <h2 className="m-3 text-white primary-orange-color">
                                        <strong>
                                            {payloadEdit &&
                                                payloadEdit !== undefined &&
                                                payloadEdit.productType === "special_pizza"
                                                ? `${getSpecialData?.name} [ Edit ]`
                                                : getSpecialData?.name}
                                        </strong>
                                    </h2>
                                </div>
                            </div>
                            <div className="row m-0 p-0 w-100 justify-content-center">
                                {/* Pizza Selection */}
                                <div className="col-lg-9 col-md-12 col-sm-12 pizzaSelection py-lg-4 px-lg-3 px-3 py-4">
                                    {/* Pizza Size, noofToppings, additional-Toppings */}
                                    <div className="row mb-3 border-bottom">
                                        <div className="col-lg-4 col-md-6 col-md-6 mb-3">
                                            <div className="d-flex flex-row flex-wrap justify-content-start align-items-center w-100">
                                                <p className="mb-1">Size :</p>
                                                <select
                                                    className="select-input form-drop mx-4 bgPrimaryBlackColor primaryWhiteColor"
                                                    onChange={handlePizzaSize}
                                                    ref={pizzaSizeRef}
                                                    value={pizzaSize}
                                                >
                                                    {Number(getSpecialData?.largePizzaPrice) !== 0 ? (
                                                        <option value="Large">Large</option>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {Number(getSpecialData?.extraLargePizzaPrice) !==
                                                        0 ? (
                                                        <option value="Extra Large">Extra Large</option>
                                                    ) : (
                                                        ""
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-md-12 mb-3">
                                            <p>
                                                Free Toppings :{" "}
                                                <span className="mx-4">
                                                    {freeTpsCount} / {getSpecialData?.noofToppings}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-md-12 mb-3">
                                            <p>
                                                Additional Toppings Used :{" "}
                                                <span className="mx-4">{additionalTps}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pizza Selection */}
                                    {spSelection}

                                    {/* Sides */}
                                    {getSpecialData?.freesides &&
                                        getSpecialData?.freesides.length <= 0 ? (
                                        ""
                                    ) : (
                                        <>
                                            <div className="p-2 pizza-heading text-center bgprimary-orange-color">
                                                <h4 className="my-1">Sides</h4>
                                            </div>
                                            <div
                                                className="row mb-3"
                                                style={{ maxHeight: "450px", overflowY: "scroll" }}
                                            >
                                                <div id="sides" className="col-lg-12 mb-3 sidesContent">
                                                    {getSpecialData?.freesides?.map((data) => {
                                                        return (
                                                            <Sides
                                                                key={data.code}
                                                                data={data}
                                                                sidesArr={sidesArr}
                                                                setSidesArr={setSidesArr}
                                                                reset={reset}
                                                                payloadEdit={payloadEdit}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Dips & Drinks */}
                                    <div className="row gx-3">
                                        {/* Dips */}
                                        {Number(getSpecialData?.noofDips) === 0 ? (
                                            ""
                                        ) : (
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="p-2 pizza-heading text-center bgprimary-orange-color">
                                                    <h4 className="my-1">Dips</h4>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div id="dips" className="col-lg-12 mb-3 dipsContent">
                                                        {dipsData?.length > 0 && (
                                                            <Dips
                                                                dipsData={dipsData}
                                                                dipsObj={dipsObj}
                                                                setDipsObj={setDipsObj}
                                                                noofDips={getSpecialData?.noofDips}
                                                                reset={reset}
                                                                payloadEdit={payloadEdit}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Drinks */}
                                        {(getSpecialData?.pops || getSpecialData?.bottle) && (
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                {(getSpecialData?.pops.length > 0 ||
                                                    getSpecialData?.bottle.length > 0) && (
                                                        <div className="p-2 pizza-heading text-center">
                                                            <h4 className="my-1">Drinks</h4>
                                                        </div>
                                                    )}
                                                <div className="row gx-3 mb-3">
                                                    <div
                                                        id="sides"
                                                        className="mb-3 d-flex justify-content-center align-items-center"
                                                    >
                                                        {(getSpecialData?.pops.length > 0 ||
                                                            getSpecialData?.bottle.length > 0) && (
                                                                <Drinks
                                                                    reset={reset}
                                                                    payloadEdit={payloadEdit}
                                                                    getSpecialData={getSpecialData}
                                                                    drinksObj={drinksObj}
                                                                    setDrinksObj={setDrinksObj}
                                                                />
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Total Price and Add To Cart - Button */}
                                <div className="col-lg-3 py-lg-4 px-lg-3 d-lg-block d-none">
                                    <div className="d-flex w-100 align-items-center justify-content-center flex-column position-relative">
                                        <p className="text-dark mb-3 primaryWhiteColor">
                                            <strong>
                                                ${totalPrice ? Number(totalPrice).toFixed(2) : (0.0).toFixed(2)}
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
                                                    payloadEdit?.productType === "special_pizza"
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
                                                className="btn btn-md w-100 btn-pills"
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
                    ) : (
                        <SPNotFound />
                    )}
                </>
            )}

        </div>
    );
}

export default SpecialMenu;
