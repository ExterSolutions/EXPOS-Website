import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import SpecialPizzaSelection from "../components/_main/SpecialPizzaSelection";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    deliverable,
    getDips,
    getSignatureDetails,
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
import SignturePizzaSelection from "../components/_main/SignturePizzaSelection";

function SignatureMenu() {
    // Global Context
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [payloadEdit, setPayloadEdit] = globalCtx.productEdit;
    const [cart, setCart] = globalCtx.cart;
    const [settings, setSettings] = globalCtx.settings;
    const [regUser, setRegUser] = globalCtx.regUser;
    const [settingsData, setSettingsData] = useState([]);
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
    const [pizzaSize, setPizzaSize] = useState(null);
    const [pizzaSizePrice, setPizzaSizePrice] = useState(null);
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

    // Handle Pizza Size and Price
    const handlePizzaSize = (e) => {
        if (e.target.value === "Large") {
            setPizzaSize(e.target.value);
            getSpecialData?.pizza_prices?.map((el) => {
                if (el?.size === e.target.value) setPizzaSizePrice(Number(el?.price));
            });
        }
        if (e.target.value === "Medium") {
            setPizzaSize(e.target.value);
            getSpecialData?.pizza_prices?.map((el) => {
                if (el?.size === e.target.value) setPizzaSizePrice(Number(el?.price));
            });
        }
        if (e.target.value === "Extra Large") {
            setPizzaSize(e.target.value);
            getSpecialData?.pizza_prices?.map((el) => {
                if (el?.size === e.target.value) setPizzaSizePrice(Number(el?.price));
            });
        }
    };

    const premiumToppingCount =
        Number(
            settingsData.find((item) => item.settingCode === "STG_7")?.settingValue
        ) || 1;

    // Handle Crust
    const handleCrust = (e, count) => {
        const selectedCrust = getSpecialData?.crusts?.find(
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
        const selectedCheese = getSpecialData?.cheeses?.find(
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
        const selectedSpecialbases = getSpecialData?.specialBases?.find(
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
        const seletcedSpicy = getSpecialData?.spicy?.find(
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
        const selectedSauce = getSpecialData?.sauces?.find(
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
        const selectedCook = getSpecialData?.cooks?.find(
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
    for (let i = 1; i <= 1; i++) {
        spSelection.push(
            <SignturePizzaSelection
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
        let calculatedPrice = Number(0);
        let totalOneTpsPrice = Number(0);
        let totalTwoTpsPrice = Number(0);
        calculatedPrice += +pizzaSizePrice;

        setPizzaSizePrice(+pizzaSizePrice);
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
        for (let i = 0; i < 1; i++) {
            pizzaCartons.push(i);
        }

        // Handle CountAsOne & CountAsTwo Toppings - Price
        pizzaState?.map((data) => {
            let amount = 0;
            pizzaCartons?.map((pizzaCarton) => {
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
            payloadEdit.productType === "signature_pizza"
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
                productName: getSpecialData?.pizza_name,
                productType: "signature_pizza",
                config: {
                    pizza: arr,
                    sides: [],
                    dips: [],
                    drinks: [],
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
                productName: getSpecialData?.pizza_name,
                productType: "signature_pizza",
                config: {
                    pizza: pizzaState,
                    sides: [],
                    dips: [],
                    drinks: [],
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
        // if (Number(getSpecialData?.largePizzaPrice) !== 0) {
        //     setPizzaSize("Large");
        //     setPizzaSizePrice(Number(getSpecialData?.largePizzaPrice));
        //     setTotalPrice(getSpecialData?.largePizzaPrice);
        // } else {
        //     setPizzaSize("Extra Large");
        //     setPizzaSizePrice(Number(getSpecialData?.extraLargePizzaPrice));
        //     setTotalPrice(getSpecialData?.extraLargePizzaPrice);
        // }

        setPizzaSize(getSpecialData?.pizza_prices[0].size);
        setPizzaSizePrice(Number(getSpecialData?.pizza_prices[0].price));
        setTotalPrice(Number(getSpecialData?.pizza_prices[0].price));

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
        if (getSpecialData !== undefined) {
            let crustData = getSpecialData?.crusts?.filter(
                (el) => el?.code == getSpecialData?.crust?.code
            );
            let crustObject = {
                crustCode: crustData[0]?.code,
                crustName: crustData[0]?.crustName,
                price: crustData[0]?.price,
            };
            let crustTypeData = getSpecialData?.crustType?.filter(
                (el) => el?.crustTypeCode == getSpecialData?.crust_type?.code
            );
            let crustTypeObject = {
                crustTypeCode: crustTypeData[0]?.crustTypeCode,
                crustType: crustTypeData[0]?.crustType,
                price: crustTypeData[0]?.price ?? 0,
            };
            let cheeseTypeData = getSpecialData?.cheeses?.filter(
                (el) => el?.code == getSpecialData?.cheese?.code
            );
            let cheeseObject = {
                cheeseCode: cheeseTypeData[0]?.code,
                cheeseName: cheeseTypeData[0]?.cheeseName,
                price: cheeseTypeData[0]?.price,
            };
            let spicyTypeData = getSpecialData?.spicy?.filter(
                (el) => el?.spicyCode == getSpecialData?.spices?.code
            );
            let spicyObject = {
                spicyCode: spicyTypeData[0]?.spicyCode,
                spicy: spicyTypeData[0]?.spicy,
                price: spicyTypeData[0]?.price,
            };
            let sauceTypeData = getSpecialData?.sauces?.filter(
                (el) => el?.sauceCode == getSpecialData?.sauce?.code
            );
            let sauceObject = {
                sauceCode: sauceTypeData[0]?.sauceCode,
                sauce: sauceTypeData[0]?.sauce,
                price: sauceTypeData[0]?.price,
            };
            let cookTypeData = getSpecialData?.cooks?.filter(
                (el) => el?.cookCode == getSpecialData?.cook?.code
            );
            let cookObject = {
                cookCode: cookTypeData[0]?.cookCode,
                cook: cookTypeData[0]?.cook,
                price: cookTypeData[0]?.price,
            };
            let specialBasesData = getSpecialData?.specialBases?.filter(
                (el) => el?.code == getSpecialData?.special_base?.code
            );
            let specialBasesObject = {
                specialbaseCode: specialBasesData[0]?.code,
                specialbaseName: specialBasesData[0]?.specialbaseName,
                price: specialBasesData[0]?.price,
            };

            let toppingTwoCode = getSpecialData?.topping_as_2?.map((el) => el?.code);
            let toppingsTwoData = toppingsData?.toppings?.countAsTwo?.filter((el) =>
                toppingTwoCode?.includes(el?.toppingsCode)
            );

            let toppingTwoArray = toppingsTwoData?.map((el) => ({
                toppingsCode: el?.toppingsCode,
                toppingsName: el?.toppingsName,
                toppingsPrice: el?.price ? el?.price : "0",
                toppingsPlacement: "whole",
                amount: el?.price,
                pizzaIndex: 0,
            }));

            let toppingOneCode = getSpecialData?.topping_as_1?.map((el) => el?.code);
            let toppingsOneData = toppingsData?.toppings?.countAsOne?.filter((el) =>
                toppingOneCode?.includes(el?.toppingsCode)
            );
            let toppingOneArray = toppingsOneData?.map((el) => ({
                toppingsCode: el?.toppingsCode,
                toppingsName: el?.toppingsName,
                toppingsPrice: el?.price ? el?.price : "0",
                toppingsPlacement: "whole",
                amount: el?.price,
                pizzaIndex: 0,
            }));

            let toppingFreeCode = getSpecialData?.topping_as_free?.map(
                (el) => el?.code
            );
            let toppingsFreeData = toppingsData?.toppings?.freeToppings?.filter(
                (el) => toppingFreeCode?.includes(el?.toppingsCode)
            );
            let toppingFreeArray = toppingsFreeData?.map((el) => ({
                toppingsCode: el?.toppingsCode,
                toppingsName: el?.toppingsName,
                toppingsPrice: el?.price ? el?.price : "0",
                toppingsPlacement: "whole",
                amount: el?.price,
                pizzaIndex: 0,
            }));

            const emptyObjectsArray = Array.from({ length: 1 }, () => ({
                crust: crustObject,
                cheese: cheeseObject,
                crustType: crustTypeObject,
                specialBases: specialBasesObject,
                spicy: spicyObject,
                sauce: sauceObject,
                cook: cookObject,
                toppings: {
                    countAsTwoToppings: toppingTwoArray || [],
                    countAsOneToppings: toppingOneArray || [],
                    freeToppings: toppingFreeArray || [],
                    isAllIndiansTps: false,
                },
            }));
            setPizzaState(emptyObjectsArray);
        }
    };

    // ----- API Endpoints -----
    const getSpecial = async () => {
        try {
            const res = await getSignatureDetails(sid);
            return res.data;
        } catch (err) {
            throw err; // Re-throw to handle it in Promise.all
        }
    };
    const dips = async () => {
        try {
            const res = await getDips();
            return res.data;
        } catch (err) {
            throw err; // Re-throw to handle it in Promise.all
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
                //setSettings(settingRes.data);
                setSettingsData(settingRes?.data);
                specialData?.pizza_prices?.map((el, i) => {
                    if (i == 0) {
                        setPizzaSize(el?.size);
                        setPizzaSizePrice(el?.price);
                    }
                    return el;
                });
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

    useEffect(() => {
        cartFn.createCart(setCart);
    }, [setCart]);
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

            setPizzaSize(getSpecialData?.pizza_prices[0].size);
            setPizzaSizePrice(Number(getSpecialData?.pizza_prices[0].price));
            setTotalPrice(Number(getSpecialData?.pizza_prices[0].price));

            // if (Number(getSpecialData?.largePizzaPrice) !== 0) {
            //     setPizzaSize("Large");
            //     setPizzaSizePrice(Number(getSpecialData?.largePizzaPrice));
            //     setTotalPrice(getSpecialData?.largePizzaPrice);
            // } else {
            //     setPizzaSize("Extra Large");
            //     setPizzaSizePrice(Number(getSpecialData?.extraLargePizzaPrice));
            //     setTotalPrice(getSpecialData?.extraLargePizzaPrice);
            // }

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

    useEffect(() => {
        if (
            payloadEdit &&
            payloadEdit !== undefined &&
            payloadEdit.productType === "signature_pizza"
        ) {
            setPizzaSize(payloadEdit?.pizzaSize);
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
                    <section className="container-fluid new-block m-0 p-0 w-100 BgsecondaryBlackColor primaryWhiteColor">
                        <div className="nav-margin"></div>
                        {/* Heading */}
                        <div className="custmized-main">
                            <div className="d-flex justify-content-center align-items-center bg-dark p-3 custmized">
                                <h2 className="m-3 text-white primary-orange-color">
                                    <strong>
                                        {payloadEdit &&
                                            payloadEdit !== undefined &&
                                            payloadEdit.productType === "signature_pizza"
                                            ? `${getSpecialData?.pizza_name} [ Edit ]`
                                            : getSpecialData?.pizza_name}
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
                                            <div className="mb-1">Size :</div>
                                            <select
                                                className="select-input form-drop mx-4 bgPrimaryBlackColor primaryWhiteColor"
                                                onChange={handlePizzaSize}
                                                ref={pizzaSizeRef}
                                                value={pizzaSize}
                                            >
                                                {getSpecialData?.pizza_prices?.map((el) => (
                                                    <option value={el?.size} key={el?.size}>
                                                        {el?.size} ${el?.price}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Pizza Selection */}
                                {spSelection}
                            </div>
                            {/* Total Price and Add To Cart - Button */}
                            <div className="col-lg-3 py-lg-4 px-lg-3 d-lg-block d-none">
                                <div className="d-flex w-100 align-items-center justify-content-center flex-column position-relative">
                                    <p className="text-dark mb-3 primaryWhiteColor">
                                        <strong>
                                            ${" "}
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
                                                payloadEdit?.productType === "signature_pizza"
                                                ? "Update Pizza"
                                                : "Add To Cart"}
                                        </b>
                                    </button>
                                </div>

                                {/* Cart List */}
                                <div className="cartlist w-100 mt-5 bgPrimaryBlackColor primaryWhiteColor">
                                    <h2 className="p-3 text-center orderTitle">Your Orders</h2>
                                    {cart?.product?.map((cData) => {
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
                </>
            )}
            <Footer />
        </div>
    );
}

export default SignatureMenu;
