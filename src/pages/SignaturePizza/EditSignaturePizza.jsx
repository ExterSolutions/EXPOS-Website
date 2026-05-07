import { useContext, useEffect, useState } from "react";
import pizzaimage from "../../assets/images/pz.png";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import {
    getAllIngredients,
    getSignatureDetails,
    settingApi,
} from "../../services";
import { GoDotFill } from "react-icons/go";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import LoadingLayout from "../../layouts/LoadingLayout";
import CartFunction from "../../components/cart";
import { GlobalContext } from "../../context/GlobalContext";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from "../../components/Tabs/Tabs";
import { CheeseSelector } from "../Createyourown/CheeseSelector";
import { SpicySelector } from "../Createyourown/SpicySelector";
import { SauceSelector } from "../Createyourown/SauceSelector";
import { ToppingTwoSelector } from "../Createyourown/ToppingTwoSelector";
import { ToppingOneSelector } from "../Createyourown/ToppingOneSelector";
import { FreeToppingSelector } from "../Createyourown/FreeToppingSelector";
import DoughSelector from "../Createyourown/DoughSelector";
import { CookSelector } from "../Createyourown/CookSelector";
import ResponsiveCart from "../../components/_main/Cart/ResponsiveCart";
import { FaEye } from "react-icons/fa6";
import SignatureViewSelectionModal from "./SignatureViewSelectionModal";

const EditSignature = () => {
    // navigate
    const navigate = useNavigate();
    const { pid, sid } = useParams();

    // context
    const globalCtx = useContext(GlobalContext);
    const [cart, setCart] = globalCtx.cart;
    const [settings, setSettings] = globalCtx.settings;
    const [currentStoreCode, setCurrentStoreCode] = globalCtx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;

    // states management
    const [getSignatureData, setGetSignatureData] = useState(null);
    const [name, setName] = useState(null);
    const [pizzaSubtitle, setPizzaSubTitle] = useState(null);

    // const [isOpen, setIsOpen] = useState(true);
    const [activeAccordion, setActiveAccordion] = useState("size");

    const [size, setSize] = useState("Large");
    const [pizzaSizeArr, setPizzaSizeArr] = useState([]);
    const [Ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [Crust, setCrust] = useState(null);
    const [CrustType, setCrustType] = useState(null);
    const [Cheese, setCheese] = useState(null);
    const [SpecialBases, setSpecialBases] = useState(null);
    const [Spicy, setSpicy] = useState(null);
    const [Sauce, setSauce] = useState(null);
    const [Cook, setCook] = useState(null);
    const [Topping, setTopping] = useState("two");
    const [ToppingsOne, setToppingsOne] = useState([]);
    const [ToppingsTwo, setToppingsTwo] = useState([]);
    const [ToppingsFree, setToppingsFree] = useState([]);
    //
    const [DefaultToppingsOne, setDefaultToppingsOne] = useState([]);
    const [DefaultToppingsTwo, setDefaultToppingsTwo] = useState([]);
    const [DefaultToppingsFree, setDefaultToppingsFree] = useState([]);
    //
    const [pizzaQuantity, setPizzaQuantity] = useState(1);
    const [selectedTopping, setSelectedToppings] = useState([]);
    const [isIndiansToppings, setIsIndiansToppings] = useState(false);
    const [price, setPrice] = useState(16);

    //
    const [isFixed, setIsFixed] = useState(false);
    const [isTranslate, setIsTranslate] = useState(false);
    const [translateYVal, setTranslateYVal] = useState(null);

    //
    const [viewSelection, setViewSelection] = useState(false);
    const [settingsData, setSettingsData] = useState([]);

    // Healper Function
    const cartFn = new CartFunction();

    // get all ingredients data initially and maintaining initial states
    const fetchData = async () => {
        setLoading(true);
        try {
            const settingResponse = await settingApi();
            setSettingsData(settingResponse?.data);
            const res = await getAllIngredients();
            setIngredients(res?.data);
            // setPizzaSizeArr(res?.data?.sizesAndPrices)
            const indianStyleToppings = res?.data?.toppings?.freeToppings?.map(
                (el) => {
                    return {
                        code: el?.toppingsCode,
                        name: el?.toppingsName,
                        price: el?.price,
                        type: "free",
                        size: "whole",
                    };
                }
            );
            setToppingsFree(indianStyleToppings);
            setSelectedToppings(indianStyleToppings);
            return res;
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(error.response.data.message);
            }
        }
    };

    const nonRegularToppingsTitle =
        settingsData.find((item) => item.shortCode === "non-regular-toppings")?.settingValue ??
        "Premium";

    const regularToppingsTitle =
        settingsData.find((item) => item.shortCode === "regular-toppings")?.settingValue ??
        "Regular";

    const indianStyleToppingsTitle =
        settingsData.find((item) => item.shortCode === "indian-style-toppings")?.settingValue ??
        "Indian Style";

    const signaturePizzaTitle =
        settingsData.find((item) => item.shortCode === "signaturepizza")?.settingValue ??
        "Signature Pizza";

    const premiumToppingCount =
        Number(
            settingsData.find((item) => item.shortCode === "non-regular-toppings-count")?.settingValue
        ) || 1;

    const toggleAccordion = (accordionName) => {
        setActiveAccordion(
            activeAccordion === accordionName ? "size" : accordionName
        );
        setTimeout(() => window.dispatchEvent(new Event("resize")), 8);
    };

    // get special data
    const signaturePizzaData = async (signatureData) => {
        try {
            const cProduct = cart?.product?.find((el) => el?.id == pid);
            const res = await getSignatureDetails(sid);
            setGetSignatureData(res?.data);
            setPizzaSizeArr(
                res?.data?.pizza_prices?.filter((price) => parseFloat(price?.price) > 0)
            );
            setName(cProduct.productName);
            setPizzaSubTitle(res?.data?.pizza_subtitle);
            setSize(cProduct?.pizzaSize);
            setPizzaQuantity(cProduct?.quantity);
            setCrust(cProduct?.config?.pizza[0]?.crust?.crustCode);
            setCrustType(cProduct?.config?.pizza[0]?.crustType?.crustTypeCode);
            setCheese(cProduct?.config?.pizza[0]?.cheese?.cheeseCode);
            setSpecialBases(
                cProduct?.config?.pizza[0]?.specialBases?.specialbaseCode
            );
            setSpicy(cProduct?.config?.pizza[0]?.spicy?.spicyCode);
            setSauce(cProduct?.config?.pizza[0]?.sauce?.sauceCode);
            setCook(cProduct?.config?.pizza[0]?.cook?.cookCode);

            // Set Default Toppings
            const defaultIndianToppings = res?.data?.topping_as_free?.map(
                (el) => el?.code
            );
            const IndTops = [];
            signatureData?.toppings?.freeToppings?.map((el) => {
                if (defaultIndianToppings.includes(el?.toppingsCode)) {
                    IndTops.push({
                        code: el?.toppingsCode,
                        name: el?.toppingsName,
                        price: el?.price,
                        type: "free",
                        size: "whole",
                    });
                }
                return el;
            });
            const dafaultTwoToppings =
                res?.data?.topping_as_2?.map((el) => el.code) || [];
            const TwoTops = [];
            signatureData?.toppings?.countAsTwo?.map((el) => {
                if (dafaultTwoToppings.includes(el?.toppingsCode)) {
                    const matchingToppingTwo = res?.data?.topping_as_2?.find(
                        (tps) => el?.toppingsCode === tps.code
                    );
                    if (matchingToppingTwo) {
                        TwoTops.push({
                            code: el?.toppingsCode,
                            name: el?.toppingsName,
                            price: matchingToppingTwo?.price ?? 0,
                            type: "two",
                            size: "whole",
                        });
                    }
                }
                return el;
            });
            const dafaultOneToppings =
                res?.data?.topping_as_1?.map((el) => el?.code) || [];
            const OneTops = [];
            signatureData?.toppings?.countAsOne?.forEach((el) => {
                if (dafaultOneToppings.includes(el?.toppingsCode)) {
                    const matchingToppingOne = res?.data?.topping_as_1?.find(
                        (tps) => el?.toppingsCode === tps.code
                    );
                    if (matchingToppingOne) {
                        OneTops.push({
                            code: el?.toppingsCode,
                            name: el?.toppingsName,
                            price: matchingToppingOne?.price,
                            type: "one",
                            size: "whole",
                        });
                    }
                }
            });
            setDefaultToppingsFree(IndTops);
            setDefaultToppingsOne(OneTops);
            setDefaultToppingsTwo(TwoTops);

            let indianToppings =
                cProduct?.config?.pizza[0]?.toppings?.freeToppings?.map((el) => {
                    return {
                        code: el?.toppingsCode,
                        name: el?.toppingsName,
                        price: el?.amount,
                        type: "free",
                        size: el?.toppingsPlacement,
                    };
                });

            let twoToppings =
                cProduct?.config?.pizza[0]?.toppings?.countAsTwoToppings?.map((el) => {
                    return {
                        code: el?.toppingsCode,
                        name: el?.toppingsName,
                        price: el?.amount,
                        type: "two",
                        size: el?.toppingsPlacement,
                    };
                });

            let oneToppings =
                cProduct?.config?.pizza[0]?.toppings?.countAsOneToppings?.map((el) => {
                    return {
                        code: el?.toppingsCode,
                        name: el?.toppingsName,
                        price: el?.amount,
                        type: "one",
                        size: el?.toppingsPlacement,
                    };
                });
            setToppingsFree(indianToppings);
            setToppingsOne(oneToppings);
            setToppingsTwo(twoToppings);
            setSelectedToppings([...indianToppings, ...twoToppings, ...oneToppings]);
            return res;
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // handletopping one click
    const handleToppingOne = (el) => {
        if (ToppingsOne.some((obj) => obj?.code === el?.code)) {
            const new_toppings = ToppingsOne?.filter(
                (value) => value.code !== el.code
            );
            setToppingsOne([...new_toppings]);
            const newSelectedToppings = selectedTopping.filter(
                (top) => top?.code !== el.code
            );
            setSelectedToppings(newSelectedToppings);
        } else {
            let toppingsPrice = el?.price;
            const defaultToppingOne = DefaultToppingsOne?.find(
                (topping) => topping?.code === el?.code
            );
            if (defaultToppingOne) {
                toppingsPrice = defaultToppingOne?.price;
            }
            const updatedElOne = { ...el, price: toppingsPrice };
            setToppingsOne((prev) => [...prev, updatedElOne]);
            setSelectedToppings((prev) => [...prev, updatedElOne]);
        }
    };

    // handling topping two click
    const handleToppingsTwo = (el) => {
        if (ToppingsTwo.some((obj) => obj?.code === el?.code)) {
            const new_toppings = ToppingsTwo?.filter(
                (value) => value?.code !== el?.code
            );
            setToppingsTwo([...new_toppings]);
            const newSelectedToppings = selectedTopping.filter(
                (top) => top?.code !== el?.code
            );
            setSelectedToppings(newSelectedToppings);
        } else {
            let toppingsPrice = el?.price;
            const defaultToppingTwo = DefaultToppingsTwo?.find(
                (topping) => topping?.code === el?.code
            );
            if (defaultToppingTwo) {
                toppingsPrice = defaultToppingTwo?.price;
            }
            const updatedElTwo = { ...el, price: toppingsPrice };
            setToppingsTwo((prev) => [...prev, updatedElTwo]);
            setSelectedToppings((prev) => [...prev, updatedElTwo]);
        }
    };

    // handle indian style toppings
    const handleFreeToppings = (el) => {
        if (ToppingsFree.some((obj) => obj?.code === el?.code)) {
            const new_toppings = ToppingsFree?.filter(
                (value) => value?.code !== el?.code
            );
            setToppingsFree([...new_toppings]);
            const newSelectedToppings = selectedTopping.filter(
                (top) => top?.code !== el?.code
            );
            setSelectedToppings(newSelectedToppings);
        } else {
            let toppingPrice = el?.price;
            const defaultToppingFree = DefaultToppingsFree.find(
                (obj) => obj?.code === el?.code
            );
            if (defaultToppingFree) {
                toppingPrice = defaultToppingFree?.price;
            }
            const updatedElFree = { ...el, price: toppingPrice };
            setToppingsFree((prev) => [...prev, updatedElFree]);
            setSelectedToppings((prev) => [...prev, updatedElFree]);
        }
    };

    // fetching data when page loads
    const getData = async () => {
        const res = await fetchData();
        const res1 = await signaturePizzaData(res?.data);
    };

    useEffect(() => {
        getData();
    }, []);

    // handle remove toppings
    const handleRemoveTopping = (el) => {
        if (el?.type === "one") {
            const topsone = selectedTopping?.filter((top) => top?.code !== el?.code);
            const new_toppings = ToppingsOne?.filter((top) => top?.code !== el?.code);
            setToppingsOne(new_toppings);
            setSelectedToppings(topsone);
        } else if (el?.type === "two") {
            const topstwo = selectedTopping?.filter((top) => top?.code !== el?.code);
            const new_toppings = ToppingsTwo?.filter((top) => top?.code !== el?.code);
            setToppingsTwo(new_toppings);
            setSelectedToppings(topstwo);
        } else {
            const topsfree = selectedTopping?.filter((top) => top?.code !== el?.code);
            const new_toppings = ToppingsFree?.filter(
                (top) => top?.code !== el?.code
            );
            setToppingsFree(new_toppings);
            setSelectedToppings(topsfree);
        }
    };

    // handle remove all indians toppings
    const handleRemoveIsIndiansToppings = () => {
        const filteredToppings = selectedTopping?.filter(
            (top) => top?.type !== "free"
        );
        setToppingsFree([]);
        setSelectedToppings(filteredToppings);
    };

    // handle change toppings pizza size
    const handleSizeChange = (payload) => {
        if (payload?.type === "one") {
            const updatedToppingsOne = ToppingsOne.map((obj) =>
                obj.code === payload.code ? payload : obj
            );
            const updatedSelectedToppings = selectedTopping.map((obj) =>
                obj.code === payload.code ? payload : obj
            );
            setSelectedToppings(updatedSelectedToppings);
            setToppingsOne(updatedToppingsOne);
        } else if (payload?.type === "two") {
            const updatedToppingsTwo = ToppingsTwo.map((obj) =>
                obj.code === payload.code ? payload : obj
            );
            const updatedSelectedToppings = selectedTopping.map((obj) =>
                obj.code === payload.code ? payload : obj
            );
            setSelectedToppings(updatedSelectedToppings);
            setToppingsTwo(updatedToppingsTwo);
        } else {
            const updatedToppingsFree = ToppingsFree.map((obj) =>
                obj.code === payload.code ? payload : obj
            );
            const updatedSelectedToppings = selectedTopping.map((obj) =>
                obj.code === payload.code ? payload : obj
            );
            setSelectedToppings(updatedSelectedToppings);
            setToppingsFree(updatedToppingsFree);
        }
    };

    const handleUpdatePizza = () => {
        if (currentStoreCode === undefined || currentStoreCode === null) {
            setShowStorePopup(true);
            return false;
        }
        let crustObj = Ingredients?.crust?.find((el) => el?.crustCode === Crust);
        let crust = {
            crustCode: crustObj.crustCode,
            crustName: crustObj.crustName,
            price: crustObj.price,
        };

        let crustTypeObj = Ingredients?.crustType?.find(
            (el) => el?.crustTypeCode === CrustType
        );
        let crusttype = {
            crustTypeCode: crustTypeObj.crustTypeCode,
            crustType: crustTypeObj.crustType,
            price: crustTypeObj.price,
        };

        let cheeseObj = Ingredients?.cheese?.find(
            (el) => el?.cheeseCode === Cheese
        );
        let cheese = {
            cheeseCode: cheeseObj.cheeseCode,
            cheeseName: cheeseObj.cheeseName,
            price: cheeseObj.price,
        };

        let spicyObj = Ingredients?.spices?.find((el) => el?.spicyCode === Spicy);
        let spicy = {
            spicyCode: spicyObj.spicyCode,
            spicy: spicyObj?.spicy,
            price: spicyObj?.price,
        };

        let sauceObj = Ingredients?.sauce?.find((el) => el?.sauceCode === Sauce);
        let sauce = {
            sauceCode: sauceObj?.sauceCode,
            sauce: sauceObj?.sauce,
            price: sauceObj?.price,
        };

        let cookObj = Ingredients?.cook?.find((el) => el?.cookCode === Cook);
        let cook = {
            cookCode: cookObj?.cookCode,
            cook: cookObj?.cook,
            price: cookObj?.price,
        };

        let specialBaseObj =
            Ingredients?.specialbases?.find(
                (el) => el?.specialbaseCode === SpecialBases
            ) || {};
        let specialbase = {
            specialbaseCode: specialBaseObj?.specialbaseCode,
            specialbaseName: specialBaseObj?.specialbaseName,
            price: specialBaseObj?.price,
        };

        const toppingsOneArr = ToppingsOne?.map((el) => {
            return {
                toppingsCode: el?.code,
                toppingsName: el?.name,
                toppingsPrice: el?.price ? el?.price : 0,
                toppingsPlacement: el?.size,
                amount: el?.price ? el?.price : 0,
            };
        });

        const toppingsTwoArr = ToppingsTwo?.map((el) => {
            return {
                toppingsCode: el?.code,
                toppingsName: el?.name,
                toppingsPrice: el?.price ? el?.price : 0,
                toppingsPlacement: el?.size,
                amount: el?.price ? el?.price : 0,
            };
        });

        const toppingsFreeArr = ToppingsFree?.map((el) => {
            return {
                toppingsCode: el?.code,
                toppingsName: el?.name,
                toppingsPrice: el?.price ? el?.price : 0,
                toppingsPlacement: el?.size,
                amount: el?.price ? el?.price : 0,
            };
        });
        let pizzaPrice = pizzaSizeArr?.find((el) => el?.size === size)?.price;
        let isAllIndiansTps =
            ToppingsFree?.length === Ingredients?.toppings?.freeToppings?.length;
        const payload = {
            id: cart?.product?.find((el) => el?.id == pid)?.id,
            productCode: cart?.product?.find((el) => el?.id == pid)?.productCode,
            productName: cart?.product?.find((el) => el?.id == pid)?.productName,
            productType: "signature_pizza",
            config: {
                pizza: [
                    {
                        crust: crust,
                        crustType: crusttype,
                        cheese: cheese,
                        specialBases: specialbase ?? {},
                        spicy: spicy,
                        sauce: sauce,
                        cook: cook,
                        toppings: {
                            countAsTwoToppings: toppingsTwoArr,
                            countAsOneToppings: toppingsOneArr,
                            freeToppings: toppingsFreeArr,
                            isAllIndiansTps: isAllIndiansTps,
                        },
                    },
                ],
                sides: [],
                dips: [],
                drinks: [],
            },
            quantity: Number(pizzaQuantity),
            price: Number(price).toFixed(2),
            amount: Number(price).toFixed(2) * Number(1),
            taxPer: 0,
            pizzaSize: size,
            pizzaPrice: pizzaPrice,
            comments: "",
        };

        if (payload) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            const filteredCart = ct?.product?.filter(
                (items) => items?.id !== payload?.id
            );
            filteredCart.push(payload);
            const cartProduct = filteredCart;
            cartFn.addCart(cartProduct, setCart, true, settings);
            navigate("/");
        }
    };

    useEffect(() => {
        let price = 0;
        if (pizzaSizeArr?.length > 0) {
            let sizeObject = pizzaSizeArr?.find((el) => el?.size === size);
            price = +price + +sizeObject?.price;
        }
        if (Crust) {
            const CrustObject = Ingredients?.crust?.find(
                (el) => el?.crustCode === Crust
            );
            price = +price + +CrustObject?.price;
        }
        if (CrustType) {
            const CrustTypeObject = Ingredients?.crustType?.find(
                (el) => el?.crustTypeCode === CrustType
            );
            price = +price + +CrustTypeObject?.price;
        }
        if (Cheese) {
            const CheeseObject = Ingredients?.cheese?.find(
                (el) => el?.cheeseCode === Cheese
            );
            price = +price + +CheeseObject?.price;
        }
        if (SpecialBases) {
            const SpecialBasesObject = Ingredients?.specialbases?.find(
                (el) => el?.specialbaseCode === SpecialBases
            );
            price = +price + +SpecialBasesObject?.price;
        }
        if (Spicy) {
            const SpicyObject = Ingredients?.spices?.find(
                (el) => el?.spicyCode === Spicy
            );
            price = +price + +SpicyObject?.price;
        }
        if (Sauce) {
            const SauceObject = Ingredients?.sauce?.find(
                (el) => el?.sauceCode === Sauce
            );
            price = +price + +SauceObject?.price;
        }
        if (Cook) {
            const cookObject = Ingredients?.cook?.find((el) => el?.cookCode === Cook);
            price = +price + +cookObject?.price;
        }
        if (ToppingsOne?.length > 0) {
            const ToppingOnePrice = ToppingsOne?.reduce((total, el) => {
                return total + +el?.price;
            }, 0);

            price = +price + +ToppingOnePrice;
        }
        if (ToppingsTwo?.length > 0) {
            const ToppingTwoPrice = ToppingsTwo?.reduce((total, el) => {
                return total + +el?.price;
            }, 0);

            price = +price + +ToppingTwoPrice;
        }
        if (ToppingsFree?.length > 0) {
            const ToppingsFreePrice = ToppingsFree?.reduce((total, el) => {
                return total + +el?.price;
            }, 0);

            price = +price + +ToppingsFreePrice;
        }
        let fixed_price = price.toFixed(2);
        if (isNaN(fixed_price)) {
            navigate("/signaturepizza");
            const cData = cart?.product?.find((el) => el?.id === pid);
            toast.error("This pizza is not available with these combinations.");
            setTimeout(() => {
                cartFn.deleteCart(cData, cart, setCart, settings);
            }, 3000);
        }
        const finalPrice = (Number(fixed_price) * Number(pizzaQuantity)).toFixed(2);
        setPrice(finalPrice);
    }, [
        pizzaQuantity,
        Crust,
        CrustType,
        Cheese,
        SpecialBases,
        Spicy,
        Sauce,
        Cook,
        ToppingsOne,
        ToppingsTwo,
        ToppingsFree,
        size,
    ]);

    useEffect(() => {
        ToppingsFree?.length === Ingredients?.toppings?.freeToppings?.length
            ? setIsIndiansToppings(true)
            : setIsIndiansToppings(false);
    }, [ToppingsFree, Ingredients]);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (window.innerWidth <= 767) return;
    //         const scrollY = window.scrollY;
    //         const rightSideDiv = document.querySelector(".right-side-internal-div");
    //         const footer = document.querySelector(".main-footer");

    //         if (!rightSideDiv || !footer) return;

    //         const rightDivTopOffset =
    //             rightSideDiv.getBoundingClientRect().top + scrollY;
    //         const rightDivBottomOffset =
    //             rightSideDiv.getBoundingClientRect().bottom + scrollY;
    //         const footerOffset = footer.offsetTop;
    //         const rightDivHeight = rightSideDiv.offsetHeight;

    //         const isBottomTouch = rightDivBottomOffset + 20 >= footerOffset;

    //         if (scrollY >= 300) {
    //             if (!isBottomTouch) {
    //                 setIsFixed(true);
    //                 setIsTranslate(false);
    //                 setTranslateYVal(null);
    //             } else {
    //                 if (scrollY + 80 >= rightDivTopOffset) {
    //                     setIsFixed(false);
    //                     setIsTranslate(true);
    //                     //setTranslateYVal(footerOffset - 250 - rightDivHeight);
    //                     setTranslateYVal(0);
    //                 } else {
    //                     setIsFixed(true);
    //                     setIsTranslate(false);
    //                     setTranslateYVal(null);
    //                 }
    //             }
    //         } else {
    //             if (!isTranslate) {
    //                 setIsFixed(false);
    //                 setIsTranslate(false);
    //                 setTranslateYVal(null);
    //             }
    //         }
    //     };

    //     const handleResize = () => {
    //         handleScroll(); // Recalculate on resize or accordion toggle
    //     };

    //     window.addEventListener("scroll", handleScroll);
    //     window.addEventListener("resize", handleResize);

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, [isFixed, isTranslate, translateYVal, activeAccordion]);

    return (
        <>
            {loading ? (
                <>
                    <LoadingLayout />
                </>
            ) : (
                <div>
                    <Header />
                    <div className="nav-margin"></div>
                    {/* <div className="d-flex align-items-center justify-content-between innder-page-header">
                        <div className="flex-grow-1 section-header">
                            <span className="category-subtitle"></span>
                        </div>
                    </div> */}
                    <div
                        className="new-block primary-background-color"
                        id="create-your-own-new"
                    >
                        <section className="primary-background-color special-offers-sec new-block ">
                            <div className="container">
                                <div className="mainContainer primary-text-color">
                                    {/* left side */}
                                    <div className="p-3">
                                        <p className="fs-5 mb-0 text-secondary">{signaturePizzaTitle}</p>
                                        <p className="fs-1 fw-bold text-primary">{name}</p>
                                        <p className="mt-3 mb-3 fs-6">{pizzaSubtitle}</p>

                                        <div
                                            className="right-side-div p-0 w-100 d-lg-none d-block"
                                            style={{ position: "relative !important" }}
                                        >
                                            <div
                                                className={`p-3 card-background-color card-text-color ${isFixed ? "fixed" : ""
                                                    }`}
                                                style={{
                                                    transform: isTranslate
                                                        ? `translateY(${translateYVal}px)`
                                                        : "none",
                                                }}
                                            >
                                                <div className="row justify-content-start align-content-center p-0 m-0">
                                                    <div className="col-auto p-0 m-0 rounded-3 text-center">
                                                        <img
                                                            className="pizzaImageBorderSM"
                                                            src={getSignatureData?.pizza_image || pizzaimage}
                                                            alt="Pizza icon"
                                                        />
                                                    </div>
                                                    <div className="col-7 p-0 m-0">
                                                        <div
                                                            className="d-flex flex-column justify-content-center "
                                                            style={{ padding: "0px 10px" }}
                                                        >
                                                            <p className=" fw-bold text-start my-1 pizzaPriceSm">
                                                                $ {price}
                                                            </p>
                                                            <div
                                                                className="d-flex justify-content-start align-items-center my-1"
                                                                style={{ userSelect: "none" }}
                                                            >
                                                                <button
                                                                    disabled={pizzaQuantity <= 1}
                                                                    onClick={() =>
                                                                        setPizzaQuantity((prev) => prev - 1)
                                                                    }
                                                                    className="btn btn-secondary rounded-circle pizzaQtyButtonSm"
                                                                    aria-label="Decrease Quantity"
                                                                >
                                                                    <FaMinus className="pizzaQtyButtonSpanSm fs-6" />
                                                                </button>
                                                                <div className=" fs-5 fw-bold mx-2">
                                                                    {pizzaQuantity}
                                                                </div>
                                                                <button
                                                                    disabled={pizzaQuantity >= 10}
                                                                    onClick={() =>
                                                                        setPizzaQuantity((prev) => prev + 1)
                                                                    }
                                                                    className="btn btn-secondary rounded-circle pizzaQtyButtonSm"
                                                                    aria-label="Increase Quantity"
                                                                >
                                                                    <FaPlus className="pizzaQtyButtonSpanSm fs-6" />
                                                                </button>
                                                            </div>
                                                            <div className="d-flex flex-row justify-content-start">
                                                                <div className="d-flex me-2 justify-content-start py-2">
                                                                    <button
                                                                        onClick={handleUpdatePizza}
                                                                        className="btn pizza-card-btn-background-color pizza-card-btn-text-color fw-bold pizzaAddToCardBtnSm"
                                                                    >
                                                                        UPDATE PIZZA
                                                                    </button>
                                                                </div>
                                                                <div className="d-flex justify-content-start py-2">
                                                                    <button
                                                                        onClick={() => setViewSelection(true)}
                                                                        className="btn pizza-view-selection-btn-background-color pizza-card-btn-text-color fw-bold pizzaAddToCardBtnSm"
                                                                    >
                                                                        <FaEye />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* size */}
                                        <div className="mt-3">
                                            <div className="accordion" id="accordionExample1">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "size" ? "" : "collapsed"
                                                                }`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("size")}
                                                            aria-expanded={
                                                                activeAccordion === "size" ? "true" : "false"
                                                            }
                                                            aria-controls="collapseOne"
                                                        >
                                                            SELECT SIZE
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseOne"
                                                        className={`accordion-collapse collapse ${activeAccordion === "size" ? "show" : ""
                                                            }`}
                                                        aria-labelledby="headingOne"
                                                        data-bs-parent="#accordionExample1"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="accordion-body primary-background-color">

                                                            <div className="size-grid">
                                                                {pizzaSizeArr?.map((data, index) => {
                                                                    return (
                                                                        <div
                                                                            className={`${size === data?.size
                                                                                ? "selected-card-background-color selected-card-text-color"
                                                                                : "card-background-color card-text-color"
                                                                                }  p-3 rounded-3`}
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => setSize(data?.size)}
                                                                        >
                                                                            <div className="">
                                                                                <div className="d-block">
                                                                                    <input
                                                                                        type="radio"
                                                                                        className="form-check-input d-none"
                                                                                        checked={size === data?.size}
                                                                                    />
                                                                                </div>
                                                                                <div className="d-block">
                                                                                    {data?.size}{data?.price !== null ? ` ($${data?.price})` : ""}
                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="fs-3 fw-bold mt-5 text-primary">CUSTOMIZE</p>
                                        <p className="mt-3 fs-6 text-secondary">
                                            Select any of the below to create your own pizza.
                                        </p>

                                        {/* dough */}
                                        <div className="mt-3">
                                            <div className="accordion" id="accordionExample4">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "dough" ? "" : "collapsed"
                                                                }`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("dough")}
                                                            aria-expanded={
                                                                activeAccordion === "dough" ? "true" : "false"
                                                            }
                                                            aria-controls="collapseFour"
                                                        >
                                                            DOUGH
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseFour"
                                                        className={`accordion-collapse collapse ${activeAccordion === "dough" ? "show" : ""
                                                            }`}
                                                        aria-labelledby="headingFour"
                                                        data-bs-parent="#accordionExample4"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="accordion-body primary-background-color">
                                                            <DoughSelector
                                                                Ingredients={Ingredients}
                                                                Crust={Crust}
                                                                setCrust={setCrust}
                                                                CrustType={CrustType}
                                                                setCrustType={setCrustType}
                                                                Cook={Cook}
                                                                setCook={setCook}
                                                                SpecialBases={SpecialBases}
                                                                setSpecialBases={setSpecialBases}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* cheese */}
                                        <div className="mt-3">
                                            <div className="accordion" id="accordionExample4">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "cheese" ? "" : "collapsed"
                                                                }`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("cheese")}
                                                            aria-expanded={
                                                                activeAccordion === "cheese" ? "true" : "false"
                                                            }
                                                            aria-controls="collapseFour"
                                                        >
                                                            CHEESE
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseFour"
                                                        className={`accordion-collapse collapse ${activeAccordion === "cheese" ? "show" : ""
                                                            }`}
                                                        aria-labelledby="headingFour"
                                                        data-bs-parent="#accordionExample4"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="d-flex flex-wrap flex-row gap-2 py-3 px-3">
                                                            {Ingredients?.cheese?.map((data, index) => {
                                                                return (
                                                                    <CheeseSelector
                                                                        data={data}
                                                                        Cheese={Cheese}
                                                                        handleCheese={(payload) =>
                                                                            setCheese(payload)
                                                                        }
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* spicy */}
                                        <div className="mt-3">
                                            <div className="accordion" id="accordionExample6">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSix">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "spicy" ? "" : "collapsed"
                                                                }`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("spicy")}
                                                            aria-expanded={
                                                                activeAccordion === "spicy" ? "true" : "false"
                                                            }
                                                            aria-controls="collapseSix"
                                                        >
                                                            SPICY
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseSix"
                                                        className={`accordion-collapse collapse ${activeAccordion === "spicy" ? "show" : ""
                                                            }`}
                                                        aria-labelledby="headingSix"
                                                        data-bs-parent="#accordionExample6"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="d-flex flex-wrap flex-row gap-2 py-3 px-3">
                                                            {Ingredients?.spices?.map((data, index) => {
                                                                return (
                                                                    <SpicySelector
                                                                        data={data}
                                                                        Spicy={Spicy}
                                                                        handleSpicy={(payload) => setSpicy(payload)}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* sauce */}
                                        <div className="mt-3">
                                            <div className="accordion" id="accordionExample7">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSeven">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "sauce" ? "" : "collapsed"
                                                                }`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("sauce")}
                                                            aria-expanded={
                                                                activeAccordion === "sauce" ? "true" : "false"
                                                            }
                                                            aria-controls="collapseSeven"
                                                        >
                                                            SAUCE
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseSeven"
                                                        className={`accordion-collapse collapse ${activeAccordion === "sauce" ? "show" : ""
                                                            }`}
                                                        aria-labelledby="headingSeven"
                                                        data-bs-parent="#accordionExample7"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="d-flex flex-wrap flex-row gap-2 py-3 px-3">
                                                            {Ingredients?.sauce?.map((data, index) => {
                                                                return (
                                                                    <SauceSelector
                                                                        data={data}
                                                                        Sauce={Sauce}
                                                                        handleSauce={(payload) => setSauce(payload)}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* cook */}
                                        <div className="mt-3">
                                            <div className="accordion" id="accordionExample7">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSeven">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "cook" ? "" : "collapsed"
                                                                }`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("cook")}
                                                            aria-expanded={
                                                                activeAccordion === "cook" ? "true" : "false"
                                                            }
                                                            aria-controls="collapseSeven"
                                                        >
                                                            COOK
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseSeven"
                                                        className={`accordion-collapse collapse ${activeAccordion === "cook" ? "show" : ""
                                                            }`}
                                                        aria-labelledby="headingSeven"
                                                        data-bs-parent="#accordionExample7"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="d-flex flex-wrap flex-row gap-2 py-3 px-3">
                                                            {Ingredients?.cook?.map((data, index) => {
                                                                return (
                                                                    <CookSelector
                                                                        data={data}
                                                                        Cook={Cook}
                                                                        handleCook={(payload) => setCook(payload)}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* toppings */}
                                        {/* <div className="mt-3">
                                            <div className="accordion" id="accordionExample9">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingNine">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "toppings"
                                                                ? ""
                                                                : "collapsed"
                                                                }`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("toppings")}
                                                            aria-expanded={
                                                                activeAccordion === "toppings"
                                                                    ? "true"
                                                                    : "false"
                                                            }
                                                            aria-controls="collapseNine"
                                                        >
                                                            TOPPINGS
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseNine"
                                                        className={`accordion-collapse collapse ${activeAccordion === "toppings" ? "show" : ""
                                                            }`}
                                                        aria-labelledby="headingNine"
                                                        data-bs-parent="#accordionExample9"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="accordion-body primary-background-color">
                                                            <div className="pb-2 mb-2 d-flex justify-content-between row">
                                                                <div
                                                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${Topping === "two" ? "tab-border" : ""
                                                                        }`}
                                                                    onClick={() => setTopping("two")}
                                                                >
                                                                    {nonRegularToppingsTitle}
                                                                </div>
                                                                <div
                                                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${Topping === "one" ? "tab-border" : ""
                                                                        }`}
                                                                    onClick={() => setTopping("one")}
                                                                >
                                                                    {regularToppingsTitle}
                                                                </div>
                                                                <div
                                                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${Topping === "free" ? "tab-border" : ""
                                                                        }`}
                                                                    onClick={() => setTopping("free")}
                                                                >
                                                                    Indian Style
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {Topping === "two" &&
                                                                    Ingredients?.toppings?.countAsTwo?.map(
                                                                        (data, index) => {
                                                                            return (
                                                                                <ToppingTwoSelector
                                                                                    key={index}
                                                                                    data={data}
                                                                                    DefaultToppingsTwo={DefaultToppingsTwo}
                                                                                    ToppingsTwo={ToppingsTwo}
                                                                                    handleTopping={(payload) =>
                                                                                        handleToppingsTwo(payload)
                                                                                    }
                                                                                    handleSizeChange={(payload) =>
                                                                                        handleSizeChange(payload)
                                                                                    }
                                                                                />
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {Topping === "one" &&
                                                                    Ingredients?.toppings?.countAsOne?.map(
                                                                        (data, index) => {
                                                                            return (
                                                                                <ToppingOneSelector
                                                                                    key={index}
                                                                                    data={data}
                                                                                    DefaultToppingsOne={DefaultToppingsOne}
                                                                                    ToppingsOne={ToppingsOne}
                                                                                    handleTopping={(payload) =>
                                                                                        handleToppingOne(payload)
                                                                                    }
                                                                                    handleSizeChange={(payload) =>
                                                                                        handleSizeChange(payload)
                                                                                    }
                                                                                />
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {Topping === "free" &&
                                                                    Ingredients?.toppings?.freeToppings?.map(
                                                                        (data, index) => {
                                                                            return (
                                                                                <FreeToppingSelector
                                                                                    key={index}
                                                                                    data={data}
                                                                                    ToppingsFree={ToppingsFree}
                                                                                    handleTopping={(payload) =>
                                                                                        handleFreeToppings(payload)
                                                                                    }
                                                                                    handleSizeChange={(payload) =>
                                                                                        handleSizeChange(payload)
                                                                                    }
                                                                                />
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        {/* toppings */}
                                        <div className="mt-3">
                                            <div className="accordion" id="accordionExample9">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingNine">
                                                        <button
                                                            className={`fw-bold fs-6 accordion-button ${activeAccordion === "toppings" ? "" : "collapsed"}`}
                                                            type="button"
                                                            onClick={() => toggleAccordion("toppings")}
                                                            aria-expanded={activeAccordion === "toppings" ? "true" : "false"}
                                                            aria-controls="collapseNine"
                                                        >
                                                            TOPPINGS
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseNine"
                                                        className={`accordion-collapse collapse ${activeAccordion === "toppings" ? "show" : ""}`}
                                                        aria-labelledby="headingNine"
                                                        data-bs-parent="#accordionExample9"
                                                        style={{ overflow: "hidden" }}
                                                    >
                                                        <div className="accordion-body primary-background-color">

                                                            {/* SECTION 1: Non-Regular Toppings */}
                                                            <div className="pb-2 mb-2 fw-medium m-0 text-secondary">
                                                                {nonRegularToppingsTitle}
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2 mb-4">
                                                                {Ingredients?.toppings?.countAsTwo?.map((data, index) => (
                                                                    <ToppingTwoSelector
                                                                        key={index}
                                                                        data={data}
                                                                        ToppingsTwo={ToppingsTwo}
                                                                        DefaultToppingsTwo={DefaultToppingsTwo}
                                                                        handleTopping={(payload) => handleToppingsTwo(payload)}
                                                                        handleSizeChange={(payload) => handleSizeChange(payload)}
                                                                    />
                                                                ))}
                                                            </div>

                                                            {/* SECTION 2: Regular Toppings */}
                                                            <div className="pb-2 mb-2 fw-medium m-0 text-secondary">
                                                                {regularToppingsTitle}
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2 mb-4">
                                                                {Ingredients?.toppings?.countAsOne?.map((data, index) => (
                                                                    <ToppingOneSelector
                                                                        key={index}
                                                                        data={data}
                                                                        ToppingsOne={ToppingsOne}
                                                                        DefaultToppingsOne={DefaultToppingsOne}
                                                                        handleTopping={(payload) => handleToppingOne(payload)}
                                                                        handleSizeChange={(payload) => handleSizeChange(payload)}
                                                                    />
                                                                ))}
                                                            </div>

                                                            {/* SECTION 3: Indian Style */}
                                                            <div className="pb-2 mb-2 fw-medium m-0 text-secondary">
                                                                Indian Style
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {Ingredients?.toppings?.freeToppings?.map((data, index) => (
                                                                    <FreeToppingSelector
                                                                        key={index}
                                                                        data={data}
                                                                        ToppingsFree={ToppingsFree}
                                                                        handleTopping={(payload) => handleFreeToppings(payload)}
                                                                        handleSizeChange={(payload) => handleSizeChange(payload)}
                                                                    />
                                                                ))}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* right side */}
                                    <div
                                        className="right-side-div p-3  d-lg-block d-none"
                                        style={{ position: "relative !important" }}
                                    >
                                        <div
                                            className={`p-3 right-side-internal-div card-background-color card-text-color ${isFixed ? "fixed" : ""
                                                }`}
                                            style={{
                                                transform: isTranslate
                                                    ? `translateY(${translateYVal}px)`
                                                    : "none",
                                            }}
                                        >
                                            <div className="px-3 row">
                                                <div className="col-lg-6 p-3 rounded-3">
                                                    <img
                                                        className="pizzaImageBorder"
                                                        src={
                                                            getSignatureData?.pizza_image
                                                                ? getSignatureData?.pizza_image
                                                                : pizzaimage
                                                        }
                                                        alt="pizza-icon"
                                                        onError={(e) => {

                                                        }}
                                                    />
                                                </div>
                                                <div className="col-lg-6 p-4">
                                                    <div className="d-flex flex-column py-3">
                                                        <p className="fs-1 fw-bold text-center text-lg-start">
                                                            $ {price}
                                                        </p>
                                                        <div
                                                            className="d-flex justify-content-center  justify-content-lg-start align-items-center mt-3"
                                                            style={{ userSelect: "none" }}
                                                        >
                                                            <button
                                                                disabled={pizzaQuantity <= 1}
                                                                onClick={() =>
                                                                    setPizzaQuantity((prev) => prev - 1)
                                                                }
                                                                className="btn btn-secondary rounded-circle pizzaQtyButton"
                                                            >
                                                                <FaMinus className="pizzaQtyButtonSpan" />
                                                            </button>
                                                            <p className=" fs-4 fw-bold mx-2">
                                                                {pizzaQuantity}
                                                            </p>
                                                            <button
                                                                disabled={pizzaQuantity >= 10}
                                                                className="btn btn-secondary rounded-circle pizzaQtyButton"
                                                                onClick={() =>
                                                                    setPizzaQuantity((prev) => prev + 1)
                                                                }
                                                            >
                                                                <FaPlus className="pizzaQtyButtonSpan" />
                                                            </button>
                                                        </div>
                                                        <div className="d-flex justify-content-center justify-content-lg-start">
                                                            <button
                                                                onClick={() => handleUpdatePizza()}
                                                                className={`view-button px-3`}
                                                            >
                                                                UPDATE PIZZA
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="scrollable-content">
                                                    {size && (
                                                        <div className="border-top pizza-card-border-color ">
                                                            <div className="row">
                                                                <div className="col-lg-6">
                                                                    {(() => {
                                                                        const sizeObj = pizzaSizeArr?.find(el => el?.size === size);
                                                                        return size && (
                                                                            <div className=" fs-6 mt-2">
                                                                                <GoDotFill /> Size: {size}
                                                                                {sizeObj?.price !== null && ` ($${sizeObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                    {(() => {
                                                                        const ctObj = Ingredients?.crustType?.find(top => top?.crustTypeCode === CrustType);
                                                                        return CrustType && (
                                                                            <div className=" fs-6 mt-2">
                                                                                <GoDotFill /> Crust Type: {ctObj?.crustType}
                                                                                {ctObj?.price !== null && ` ($${ctObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                    {(() => {
                                                                        const spicyObj = Ingredients?.spices?.find(top => top?.spicyCode === Spicy);
                                                                        return Spicy && (
                                                                            <div className=" fs-6 mt-2">
                                                                                <GoDotFill /> Spicy: {spicyObj?.spicy}
                                                                                {spicyObj?.price !== null && ` ($${spicyObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                    {(() => {
                                                                        const sauceObj = Ingredients?.sauce?.find(top => top?.sauceCode === Sauce);
                                                                        return Sauce && (
                                                                            <div className=" fs-6 mt-2">
                                                                                <GoDotFill /> Sauce: {sauceObj?.sauce}
                                                                                {sauceObj?.price !== null && ` ($${sauceObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    {(() => {
                                                                        const crustObj = Ingredients?.crust?.find(top => top?.crustCode === Crust);
                                                                        return Crust && (
                                                                            <div className=" fs-6 mt-2 mt-lg-0">
                                                                                <GoDotFill /> Crust: {crustObj?.crustName}
                                                                                {crustObj?.price !== null && ` ($${crustObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                    {(() => {
                                                                        const cheeseObj = Ingredients?.cheese?.find(top => top?.cheeseCode === Cheese);
                                                                        return Cheese && (
                                                                            <div className=" fs-6 mt-2">
                                                                                <GoDotFill /> Cheese: {cheeseObj?.cheeseName}
                                                                                {cheeseObj?.price !== null && ` ($${cheeseObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                    {(() => {
                                                                        const cookObj = Ingredients?.cook?.find(top => top?.cookCode === Cook);
                                                                        return Cook && (
                                                                            <div className=" fs-6 mt-2">
                                                                                <GoDotFill /> Cook: {cookObj?.cook}
                                                                                {cookObj?.price !== null && ` ($${cookObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                    {(() => {
                                                                        const sbObj = Ingredients?.specialbases?.find(top => top?.specialbaseCode === SpecialBases);
                                                                        return SpecialBases && (
                                                                            <div className=" fs-6 mt-2">
                                                                                <GoDotFill /> Special Base: {sbObj?.specialbaseName}
                                                                                {sbObj?.price !== null && ` ($${sbObj?.price})`}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedTopping?.length > 0 && (
                                                        <div className="py-3 border-top pizza-card-border-color">
                                                            <p>TOPPINGS YOU SELECTED</p>
                                                            <div className="mt-3 d-flex flex-wrap gap-2">
                                                                {isIndiansToppings ? (
                                                                    <>
                                                                        {/* Display a single button for Indian Style Toppings */}
                                                                        <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">
                                                                            {indianStyleToppingsTitle} + Coriander
                                                                            <span
                                                                                className="ms-2"
                                                                                onClick={handleRemoveIsIndiansToppings}
                                                                            >
                                                                                <IoMdClose />
                                                                            </span>
                                                                        </button>

                                                                        {/* Display non-free toppings */}
                                                                        {selectedTopping
                                                                            ?.filter((el) => el?.type !== "free")
                                                                            ?.map((el) => (
                                                                                <div key={el.code}>
                                                                                    <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">
                                                                                        {`${el?.name}(${el?.size}) ($${el?.price})`}
                                                                                        <span
                                                                                            className="ms-1"
                                                                                            onClick={() =>
                                                                                                handleRemoveTopping(el)
                                                                                            }
                                                                                        >
                                                                                            <IoMdClose />
                                                                                        </span>
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                    </>
                                                                ) : (
                                                                    // Display all selected toppings
                                                                    selectedTopping?.map((el) => (
                                                                        <div key={el.code}>
                                                                            <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">
                                                                                {`${el?.name}(${el?.size}) ($${el?.price})`}
                                                                                <span
                                                                                    className="ms-1"
                                                                                    onClick={() =>
                                                                                        handleRemoveTopping(el)
                                                                                    }
                                                                                >
                                                                                    <IoMdClose />
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <ResponsiveCart
                        handleCart={handleUpdatePizza}
                        totalPrice={price}
                        section={"UPDATE PIZZA"}
                    />

                    <SignatureViewSelectionModal
                        viewSelection={viewSelection}
                        setViewSelection={setViewSelection}
                        Ingredients={Ingredients}
                        size={size}
                        pizzaSizeArr={pizzaSizeArr}
                        CrustType={CrustType}
                        Spicy={Spicy}
                        Sauce={Sauce}
                        Crust={Crust}
                        Cheese={Cheese}
                        Cook={Cook}
                        SpecialBases={SpecialBases}
                        selectedTopping={selectedTopping}
                        handleRemoveTopping={handleRemoveTopping}
                        isIndiansToppings={isIndiansToppings}
                        handleRemoveIsIndiansToppings={handleRemoveIsIndiansToppings}
                    />


                </div>
            )}
        </>
    );
};

export default EditSignature;
