import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import pizzaimage from "../../assets/images/pz.png";
// import "../../assets/styles/new/homepage/specialpizza/additional.css";
import ResponsiveCart from "../../components/_main/Cart/ResponsiveCart";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import CartFunction from "../../components/cart";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import SPNotFound from "../../layouts/SPNotFound";
import {
    getAllIngredients,
    getSignatureDetails,
    settingApi,
} from "../../services";
import { CheeseSelector } from "../Createyourown/CheeseSelector";
import { CookSelector } from "../Createyourown/CookSelector";
import DoughSelector from "../Createyourown/DoughSelector";
import { FreeToppingSelector } from "../Createyourown/FreeToppingSelector";
import { SauceSelector } from "../Createyourown/SauceSelector";
import { SpicySelector } from "../Createyourown/SpicySelector";
import { ToppingOneSelector } from "../Createyourown/ToppingOneSelector";
import { ToppingTwoSelector } from "../Createyourown/ToppingTwoSelector";
import SignatureViewSelectionModal from "./SignatureViewSelectionModal";
import ToppingSheet from "../../components/_main/ToppingSheet";
import OptionSheet from "../../components/_main/OptionSheet";
const Signature = () => {
    // navigate
    const navigate = useNavigate();
    const { sid } = useParams();
    // context
    const globalCtx = useContext(GlobalContext);
    const [cart, setCart] = globalCtx.cart;
    const [settings, setSettings] = globalCtx.settings;
    const [currentStoreCode, setCurrentStoreCode] = globalCtx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
    const [settingsData, setSettingsData] = useState([]);
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
    // Topping bottom sheet state
    const [toppingSheetOpen, setToppingSheetOpen] = useState(false);
    const [toppingSheetTab, setToppingSheetTab] = useState("two");
    // OptionSheet state (dough / cheese / spicy / sauce / cook)
    const [openSheet, setOpenSheet] = useState(null);
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
    const nonRegularToppingsTitle = "Premium Toppings";
    const regularToppingsTitle = "Regular Toppings";
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
            const res = await getSignatureDetails(sid);
            const data = res?.data || null;
            if (data) {
                setGetSignatureData(res?.data);
                setPizzaSizeArr(
                    res?.data?.pizza_prices?.filter(
                        (price) => parseFloat(price?.price) > 0
                    )
                );
                setName(res?.data?.pizza_name);
                setPizzaSubTitle(res?.data?.pizza_subtitle);
                let sizeObj = res?.data?.pizza_prices.find(
                    (price) => parseFloat(price?.price) > 0
                );
                setSize(sizeObj?.size);
                setCrust(res?.data?.crust?.code);
                setCrustType(res?.data?.crust_type?.code);
                setCheese(res?.data?.cheese?.code);
                setSpecialBases(res?.data?.special_base?.code);
                setSpicy(res?.data?.spices?.code);
                setSauce(res?.data?.sauce?.code);
                setCook(res?.data?.cook?.code);
                let indianToppings = res?.data?.topping_as_free?.map((el) => {
                    return el?.code;
                });
                let IndTops = [];
                signatureData?.toppings?.freeToppings?.map((el) => {
                    if (indianToppings.includes(el?.toppingsCode)) {
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
                const twoToppings = res?.data?.topping_as_2?.map((el) => el?.code);
                const TwoTops = [];
                signatureData?.toppings?.countAsTwo?.map((el) => {
                    if (twoToppings.includes(el?.toppingsCode)) {
                        const matchingToppingTwo = res?.data?.topping_as_2?.find(
                            (tps) => el?.toppingsCode === tps.code
                        );
                        if (matchingToppingTwo) {
                            TwoTops.push({
                                code: el?.toppingsCode,
                                name: el?.toppingsName,
                                price: matchingToppingTwo?.price,
                                type: "two",
                                size: "whole",
                            });
                        }
                    }
                    return el;
                });
                const oneToppings = res?.data?.topping_as_1?.map((el) => el?.code);
                const OneTops = [];
                signatureData?.toppings?.countAsOne?.map((el) => {
                    if (oneToppings.includes(el?.toppingsCode)) {
                        const matchingToppingOne = res?.data?.topping_as_1?.find(
                            (tps) => el?.toppingsCode === tps?.code
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
                    return el;
                });
                setToppingsFree(IndTops);
                setToppingsOne(OneTops);
                setToppingsTwo(TwoTops);
                setDefaultToppingsFree(IndTops);
                setDefaultToppingsOne(OneTops);
                setDefaultToppingsTwo(TwoTops);
                setSelectedToppings([...IndTops, ...TwoTops, ...OneTops]);
                return res;
            }
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
                (obj) => obj?.code === el?.code
            );
            if (defaultToppingOne) {
                toppingsPrice = defaultToppingOne?.price;
            }
            const updatedELOne = { ...el, price: toppingsPrice };
            setToppingsOne((prev) => [...prev, updatedELOne]);
            setSelectedToppings((prev) => [...prev, updatedELOne]);
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
                (obj) => obj?.code === el?.code
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
        await signaturePizzaData(res?.data);
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

    const handleAddToCart = () => {
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
            id: uuidv4(),
            productCode: getSignatureData?.code,
            productName: getSignatureData?.pizza_name,
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
            let ct = JSON.parse(localStorage.getItem("cart")) || { product: [] };
            if (!ct.product) ct.product = [];
            ct.product.push(payload);
            const cartProduct = ct.product;
            cartFn.addCart(cartProduct, setCart, false, settings);
            toast.success("🛒 Added to cart! Review your order.");
            navigate("/addtocart");
        }
    };



    useEffect(() => {
        if (sid) {
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
                const cookObject = Ingredients?.cook?.find(
                    (el) => el?.cookCode === Cook
                );
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
            const finalPrice = (Number(fixed_price) * Number(pizzaQuantity)).toFixed(
                2
            );
            setPrice(finalPrice);
        }
    }, [
        sid,
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
    //         if (window.innerWidth <= 1024) return; // consistent with CSS

    //         const scrollY = window.scrollY;
    //         const rightSideDiv = document.querySelector(".right-side-internal-div-new");
    //         const footer = document.querySelector(".main-footer");

    //         if (!rightSideDiv || !footer) return;

    //         const rightDivTopOffset = rightSideDiv.getBoundingClientRect().top + scrollY;
    //         const rightDivBottomOffset = rightSideDiv.getBoundingClientRect().bottom + scrollY;
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
    //                     setIsFixed(true); // Keep fixed to maintain viewport positioning
    //                     setIsTranslate(true);
    //                     // Calculate translateY to position the bottom of the div 100px above the footer
    //                     // Assumes fixed top is 0px (common for sticky after header); adjust if your CSS fixed top differs
    //                     setTranslateYVal(footerOffset - 100 - rightDivHeight - scrollY);
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

    //     const handleResize = () => handleScroll();

    //     window.addEventListener("scroll", handleScroll);
    //     window.addEventListener("resize", handleResize);

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, [isFixed, isTranslate, translateYVal, activeAccordion]);

    // ─── OptionSheet helpers ───────────────────────────────────
    const TriggerBtn = ({ icon, label, value, sheetKey }) => (
        <button
            type="button"
            className="topping-trigger-btn"
            onClick={() => setOpenSheet(sheetKey)}
        >
            <span className="topping-trigger-btn__icon">{icon}</span>
            <span className="topping-trigger-btn__label">{label}</span>
            {value && <span className="topping-trigger-btn__value">{value}</span>}
            <span className="topping-trigger-btn__chevron">›</span>
        </button>
    );

    const crustOpts      = Ingredients?.crust?.map(c => ({ id: c.crustCode, label: c.crustName, price: Number(c.price) })) || [];
    const crustTypeOpts  = Ingredients?.crustType?.map(c => ({ id: c.crustTypeCode, label: c.crustType, price: Number(c.price) })) || [];
    const cheeseOpts     = Ingredients?.cheese?.map(c => ({ id: c.cheeseCode, label: c.cheeseName, price: Number(c.price) })) || [];
    const spicyOpts      = Ingredients?.spices?.map(c => ({ id: c.spicyCode, label: c.spicy, price: Number(c.price) })) || [];
    const sauceOpts      = Ingredients?.sauce?.map(c => ({ id: c.sauceCode, label: c.sauce, price: Number(c.price) })) || [];
    const cookOpts       = Ingredients?.cook?.map(c => ({ id: c.cookCode, label: c.cook, price: Number(c.price) })) || [];
    const specialBaseOpts = Ingredients?.specialbases?.map(c => ({ id: c.specialbaseCode, label: c.specialbaseName, price: Number(c.price) })) || [];

    const getLabel  = (arr, key, valKey) => arr?.find(x => x[key] === valKey);
    const crustLabel       = getLabel(Ingredients?.crust,        'crustCode',       Crust)?.crustName       || 'Select';
    const crustTypeLabel   = getLabel(Ingredients?.crustType,    'crustTypeCode',   CrustType)?.crustType   || 'Select';
    const cheeseLabel      = getLabel(Ingredients?.cheese,       'cheeseCode',      Cheese)?.cheeseName     || 'Select';
    const spicyLabel       = getLabel(Ingredients?.spices,       'spicyCode',       Spicy)?.spicy           || 'Select';
    const sauceLabel       = getLabel(Ingredients?.sauce,        'sauceCode',       Sauce)?.sauce           || 'Select';
    const cookLabel        = getLabel(Ingredients?.cook,         'cookCode',        Cook)?.cook             || 'Select';
    const specialBaseLabel = getLabel(Ingredients?.specialbases, 'specialbaseCode', SpecialBases)?.specialbaseName || 'Select';

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
                    {/* OptionSheet Modals */}
                    <OptionSheet isOpen={openSheet === 'dough'} onClose={() => setOpenSheet(null)} title="Choose Dough" options={crustOpts} selected={Crust} onSelect={(id) => setCrust(id)} />
                    <OptionSheet isOpen={openSheet === 'crustType'} onClose={() => setOpenSheet(null)} title="Choose Crust Type" options={crustTypeOpts} selected={CrustType} onSelect={(id) => setCrustType(id)} />
                    <OptionSheet isOpen={openSheet === 'cheese'} onClose={() => setOpenSheet(null)} title="Choose Cheese" options={cheeseOpts} selected={Cheese} onSelect={(id) => setCheese(id)} />
                    <OptionSheet isOpen={openSheet === 'spicy'} onClose={() => setOpenSheet(null)} title="Choose Spicy Level" options={spicyOpts} selected={Spicy} onSelect={(id) => setSpicy(id)} />
                    <OptionSheet isOpen={openSheet === 'sauce'} onClose={() => setOpenSheet(null)} title="Choose Sauce" options={sauceOpts} selected={Sauce} onSelect={(id) => setSauce(id)} />
                    <OptionSheet isOpen={openSheet === 'cook'} onClose={() => setOpenSheet(null)} title="Choose Cook Style" options={cookOpts} selected={Cook} onSelect={(id) => setCook(id)} />
                    {specialBaseOpts.length > 0 && <OptionSheet isOpen={openSheet === 'specialBase'} onClose={() => setOpenSheet(null)} title="Choose Special Base" options={specialBaseOpts} selected={SpecialBases} onSelect={(id) => setSpecialBases(id)} />}
                    {getSignatureData ? (
                        <div className="new-block" id="create-your-own-new">
                            <section className="special-offers-sec new-block primary-background-color">
                                <div className="container">
                                    <div className="mainContainer primary-text-color">
                                        {/* left side */}
                                        <div className="p-3">
                                            {/* Hero Header */}
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <img
                                                    className="cust-hero-img d-none d-sm-block"
                                                    src={getSignatureData?.pizza_image || pizzaimage}
                                                    alt={name}
                                                />
                                                <div>
                                                    <p className="fs-2 fw-bold text-primary mb-1">{name}</p>
                                                    <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>{pizzaSubtitle}</p>
                                                    {/* Desktop Add to Cart controls */}
                                                    <div className="d-none d-lg-flex align-items-center gap-3 mt-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <button disabled={pizzaQuantity <= 1} onClick={() => setPizzaQuantity(p => p - 1)}
                                                                className="btn btn-secondary rounded-circle" style={{ width: 34, height: 34, padding: 0 }} aria-label="Decrease"><FaMinus /></button>
                                                            <span className="fw-bold fs-5">{pizzaQuantity}</span>
                                                            <button disabled={pizzaQuantity >= 10} onClick={() => setPizzaQuantity(p => p + 1)}
                                                                className="btn btn-secondary rounded-circle" style={{ width: 34, height: 34, padding: 0 }} aria-label="Increase"><FaPlus /></button>
                                                        </div>
                                                        <span className="fw-bold fs-5">${price}</span>
                                                        <button onClick={handleAddToCart} className="btn pizza-card-btn-background-color pizza-card-btn-text-color fw-bold px-4">Add to Cart</button>
                                                        <button onClick={() => setViewSelection(true)} className="btn pizza-view-selection-btn-background-color pizza-card-btn-text-color fw-bold"><FaEye /></button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* size */}
                                            {/* SIZE — horizontal pills */}
                                            <div className="mt-1 mb-3">
                                                <p className="fw-bold text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '0.06em', opacity: 0.7 }}>Select Size</p>
                                                <div className="size-pill-scroll">
                                                    {pizzaSizeArr?.map((data, index) => (
                                                        <button
                                                            key={index}
                                                            className={`size-pill ${size === data?.size ? 'size-pill--active' : ''}`}
                                                            onClick={() => setSize(data?.size)}
                                                        >
                                                            <span className="size-pill__label">{data?.size}</span>
                                                            {data?.price !== null && (
                                                                <span className="size-pill__price">${data?.price}</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="fw-bold text-uppercase mb-2 mt-4" style={{ fontSize: '0.8rem', letterSpacing: '0.06em', opacity: 0.7 }}>CUSTOMIZE YOUR PIZZA</p>
                                            {/* Trigger buttons — same style as Other Pizza / Create Your Own */}
                                            <div className="d-flex flex-column gap-2 mb-2">
                                                <TriggerBtn icon="🍞" label="Dough"       value={crustLabel}       sheetKey="dough" />
                                                <TriggerBtn icon="🔥" label="Crust Type"  value={crustTypeLabel}   sheetKey="crustType" />
                                                <TriggerBtn icon="🧀" label="Cheese"      value={cheeseLabel}      sheetKey="cheese" />
                                                <TriggerBtn icon="🌶️" label="Spicy"       value={spicyLabel}       sheetKey="spicy" />
                                                <TriggerBtn icon="🍅" label="Sauce"       value={sauceLabel}       sheetKey="sauce" />
                                                <TriggerBtn icon="👨‍🍳" label="Cook Style"  value={cookLabel}        sheetKey="cook" />
                                                {specialBaseOpts.length > 0 && (
                                                    <TriggerBtn icon="🍕" label="Special Base" value={specialBaseLabel} sheetKey="specialBase" />
                                                )}
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
                                                                        Indian Toppings
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
                                                                                        ToppingsTwo={ToppingsTwo}
                                                                                        DefaultToppingsTwo={
                                                                                            DefaultToppingsTwo
                                                                                        }
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
                                                                                        ToppingsOne={ToppingsOne}
                                                                                        DefaultToppingsOne={
                                                                                            DefaultToppingsOne
                                                                                        }
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
                                            {/* TOPPINGS — bottom sheet trigger */}
                                            <div className="mt-3 mb-4">
                                                <button
                                                    className="topping-trigger-btn"
                                                    onClick={() => setToppingSheetOpen(true)}
                                                >
                                                    <span className="topping-trigger-btn__icon">🍕</span>
                                                    <span className="topping-trigger-btn__label">Choose Toppings</span>
                                                    {(ToppingsTwo.length + ToppingsOne.length + ToppingsFree.length) > 0 && (
                                                        <span className="topping-trigger-btn__count">
                                                            {ToppingsTwo.length + ToppingsOne.length + ToppingsFree.length} selected
                                                        </span>
                                                    )}
                                                    <span className="topping-trigger-btn__arrow">›</span>
                                                </button>
                                                {/* Selected toppings summary */}
                                                {(ToppingsTwo.length + ToppingsOne.length + ToppingsFree.length) > 0 && (
                                                    <div className="selected-toppings-pills">
                                                        {[...ToppingsTwo, ...ToppingsOne, ...ToppingsFree].map((t, i) => (
                                                            <span key={i} className="selected-topping-pill">{t.name}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Topping Sheet */}
                                            <ToppingSheet
                                                isOpen={toppingSheetOpen}
                                                onClose={() => setToppingSheetOpen(false)}
                                                activeTab={toppingSheetTab}
                                                setActiveTab={setToppingSheetTab}
                                                Ingredients={Ingredients}
                                                ToppingsTwo={ToppingsTwo}
                                                ToppingsOne={ToppingsOne}
                                                ToppingsFree={ToppingsFree}
                                                handleToppingsTwo={handleToppingsTwo}
                                                handleToppingOne={handleToppingOne}
                                                handleFreeToppings={handleFreeToppings}
                                                handleSizeChange={handleSizeChange}
                                                ToppingTwoSelector={ToppingTwoSelector}
                                                ToppingOneSelector={ToppingOneSelector}
                                                FreeToppingSelector={FreeToppingSelector}
                                                DefaultToppingsTwo={DefaultToppingsTwo}
                                                DefaultToppingsOne={DefaultToppingsOne}
                                                nonRegularTitle={nonRegularToppingsTitle}
                                                regularTitle={regularToppingsTitle}
                                            />
                                        </div>
                                        {/* right side */}
                                        <div
                                            className="right-side-div p-3 d-lg-block d-none"
                                            style={{ position: "relative !important" }}
                                        >
                                            <div
                                                className={`p-3 right-side-internal-div-new card-background-color card-text-color ${isFixed ? "fixed" : ""
                                                    } ${isTranslate ? "translate" : ""}`}
                                                style={{
                                                    transform: isTranslate
                                                        ? `translateY(${translateYVal}px)`
                                                        : "none",
                                                    position: "sticky"
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
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 p-4">
                                                        <div className="d-flex flex-column py-4">
                                                            <p className=" fs-2 fw-bold text-center text-lg-start">
                                                                $ {price}
                                                            </p>
                                                            <div
                                                                className="d-flex justify-content-center justify-content-lg-start  mt-3"
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
                                                                <p className=" fs-4 fw-bold mx-3">
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
                                                                    onClick={() => handleAddToCart()}
                                                                    className={`view-button px-3`}
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="scrollable-content">
                                                        {size && (
                                                            <div className="border-top pizza-card-border-color mt-4 py-3">
                                                                <div className="row">
                                                                    <div className="col-lg-6">
                                                                        {(() => {
                                                                            const sizeObj = pizzaSizeArr?.find(el => el?.size === size);
                                                                            return size && (
                                                                                <p className=" fs-6 mt-2 mt-lg-0">
                                                                                    <GoDotFill /> Size: {size} 
                                                                                    {sizeObj?.price !== null && ` ($${sizeObj?.price})`}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                        {(() => {
                                                                            const ctObj = Ingredients?.crustType?.find(top => top?.crustTypeCode === CrustType);
                                                                            return CrustType && (
                                                                                <p className=" fs-6 mt-2">
                                                                                    <GoDotFill /> Crust Type: {ctObj?.crustType} 
                                                                                    {ctObj?.price !== null && ` ($${ctObj?.price})`}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                        {(() => {
                                                                            const spicyObj = Ingredients?.spices?.find(top => top?.spicyCode === Spicy);
                                                                            return Spicy && (
                                                                                <p className=" fs-6 mt-2">
                                                                                    <GoDotFill /> Spicy: {spicyObj?.spicy} 
                                                                                    {spicyObj?.price !== null && ` ($${spicyObj?.price})`}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                        {(() => {
                                                                            const sauceObj = Ingredients?.sauce?.find(top => top?.sauceCode === Sauce);
                                                                            return Sauce && (
                                                                                <p className=" fs-6 mt-2">
                                                                                    <GoDotFill /> Sauce: {sauceObj?.sauce} 
                                                                                    {sauceObj?.price !== null && ` ($${sauceObj?.price})`}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        {(() => {
                                                                            const crustObj = Ingredients?.crust?.find(top => top?.crustCode === Crust);
                                                                            return Crust && (
                                                                                <p className=" fs-6 mt-2 mt-lg-0">
                                                                                    <GoDotFill /> Crust: {crustObj?.crustName} 
                                                                                    {crustObj?.price !== null && ` ($${crustObj?.price})`}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                        {(() => {
                                                                            const cheeseObj = Ingredients?.cheese?.find(top => top?.cheeseCode === Cheese);
                                                                            return Cheese && (
                                                                                <p className=" fs-6 mt-2">
                                                                                    <GoDotFill /> Cheese: {cheeseObj?.cheeseName} 
                                                                                    {cheeseObj?.price !== null && ` ($${cheeseObj?.price})`}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                        {(() => {
                                                                            const cookObj = Ingredients?.cook?.find(top => top?.cookCode === Cook);
                                                                            return Cook && (
                                                                                <p className=" fs-6 mt-2">
                                                                                    <GoDotFill /> Cook: {cookObj?.cook} 
                                                                                    {cookObj?.price !== null && ` ($${cookObj?.price})`}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                        {(() => {
                                                                            const sbObj = Ingredients?.specialbases?.find(top => top?.specialbaseCode === SpecialBases);
                                                                            return SpecialBases && (
                                                                                <p className=" fs-6 mt-2">
                                                                                    <GoDotFill /> Special Base: {sbObj?.specialbaseName} 
                                                                                    {sbObj?.price !== null && ` ($${sbObj?.price})`}
                                                                                </p>
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
                                                                            {/* Display a single button for Indian Toppings Toppings */}
                                                                            <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">
                                                                                Indian Toppings + Coriander
                                                                                <span
                                                                                    className="ms-2 d-none"
                                                                                    onClick={
                                                                                        handleRemoveIsIndiansToppings
                                                                                    }
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
                                                                                                className="ms-1 d-none"
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
                    ) : (
                        <SPNotFound />
                    )}
                    <ResponsiveCart
                        handleCart={handleAddToCart}
                        totalPrice={price}
                        section={"Add to Cart"}
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

                    {/* Mobile Sticky Bottom Add-to-Cart Bar */}
                    <div className="cust-mobile-sticky d-lg-none">
                        <div className="cust-mobile-sticky__price">
                            <div className="cust-mobile-sticky__label">Total</div>
                            <div className="cust-mobile-sticky__amount">${price}</div>
                        </div>
                        <div className="cust-mobile-sticky__qty">
                            <button
                                className="cust-mobile-sticky__qty-btn"
                                disabled={pizzaQuantity <= 1}
                                onClick={() => setPizzaQuantity(p => p - 1)}
                                aria-label="Decrease Quantity"
                            >
                                <FaMinus size={12} />
                            </button>
                            <span className="cust-mobile-sticky__qty-num">{pizzaQuantity}</span>
                            <button
                                className="cust-mobile-sticky__qty-btn"
                                disabled={pizzaQuantity >= 10}
                                onClick={() => setPizzaQuantity(p => p + 1)}
                                aria-label="Increase Quantity"
                            >
                                <FaPlus size={12} />
                            </button>
                        </div>
                        <button className="cust-mobile-sticky__add" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    </div>

                </div >
            )}
            <Footer />
        </>
    );
};
export default Signature;