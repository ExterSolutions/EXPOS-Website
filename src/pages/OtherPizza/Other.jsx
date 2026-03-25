import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import pizzaimage from "../../assets/images/pz.png";

import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import OptionSheet from "../../components/_main/OptionSheet";
import CartFunction from "../../components/cart";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import SPNotFound from "../../layouts/SPNotFound";
import { getAllIngredients, getOtherDetails, settingApi } from "../../services";
import { CheeseSelector } from "../Createyourown/CheeseSelector";
import { CookSelector } from "../Createyourown/CookSelector";
import DoughSelector from "../Createyourown/DoughSelector";
import { FreeToppingSelector } from "../Createyourown/FreeToppingSelector";
import { SauceSelector } from "../Createyourown/SauceSelector";
import { SpicySelector } from "../Createyourown/SpicySelector";
import { ToppingOneSelector } from "../Createyourown/ToppingOneSelector";
import { ToppingTwoSelector } from "../Createyourown/ToppingTwoSelector";
import ToppingSheet from "../../components/_main/ToppingSheet";
import OtherViewSelectionModal from "./OtherViewSelectionModal";
const Other = () => {
    // navigate
    const navigate = useNavigate();
    const { sid } = useParams();
    // context
    const globalCtx = useContext(GlobalContext);
    const [cart, setCart] = globalCtx.cart;
    const settings = globalCtx.settings[0];
    const currentStoreCode = globalCtx.currentStoreCode[0];
    const { setShowStorePopup } = globalCtx.showStorePopup;
    // states management
    const [getOtherData, setGetOtherData] = useState(null);
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
    const [openSheet, setOpenSheet] = useState(null); // e.g. 'dough' | 'crustType' | 'cheese' | 'spicy' | 'sauce' | 'cook' | 'toppings'
    const [toppingTab, setToppingTab] = useState('two');
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
    const regularToppingsTitle =
        settingsData.find((item) => item.shortCode === "regular-toppings")
            ?.settingValue ?? "Regular Toppings";

    const nonRegularToppingsTitle =
        settingsData.find((item) => item.shortCode === "non-regular-toppings")
            ?.settingValue ?? "Premium Toppings";

    const indianStyleToppingsTitle =
        settingsData.find((item) => item.shortCode === "indian-style-toppings")
            ?.settingValue ?? "Indian Toppings";

    const premiumToppingCount =
        Number(
            settingsData.find((item) => item.shortCode === "non-regular-toppings-count")
                ?.settingValue
        ) || 1;
    const toggleAccordion = (accordionName) => {
        setActiveAccordion(
            activeAccordion === accordionName ? "size" : accordionName
        );
        setTimeout(() => window.dispatchEvent(new Event("resize")), 8);
    };
    // get special data
    const otherPizzaData = async (otherData) => {
        try {
            const res = await getOtherDetails(sid, currentStoreCode);
            const data = res?.data || null;
            if (data) {
                setGetOtherData(res?.data);
                setPizzaSizeArr(
                    res?.data?.pizza_prices?.filter(
                        (price) => parseFloat(price.price) > 0
                    )
                );
                setName(res?.data?.pizza_name);
                setPizzaSubTitle(res?.data?.pizza_subtitle);
                let sizeObj = res?.data?.pizza_prices.find(
                    (price) => parseFloat(price.price) > 0
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
                otherData?.toppings?.freeToppings?.map((el) => {
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
                const twoToppings = res?.data?.topping_as_2?.map((el) => el.code) || [];
                const TwoTops = [];
                otherData?.toppings?.countAsTwo?.map((el) => {
                    if (twoToppings.includes(el?.toppingsCode)) {
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
                const oneToppings =
                    res?.data?.topping_as_1?.map((el) => el?.code) || [];
                const OneTops = [];
                otherData?.toppings?.countAsOne?.forEach((el) => {
                    if (oneToppings.includes(el?.toppingsCode)) {
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
                setToppingsFree(IndTops);
                setToppingsOne(OneTops);
                setToppingsTwo(TwoTops);
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
            let toppingPrice = el?.price;
            const defaultToppingOne = DefaultToppingsOne.find(
                (obj) => obj?.code === el?.code
            );
            if (defaultToppingOne) {
                toppingPrice = defaultToppingOne?.price;
            }
            const updatedElOne = { ...el, price: toppingPrice };
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
            let toppingPrice = el?.price;
            const defaultToppingTwo = DefaultToppingsTwo.find(
                (obj) => obj?.code === el?.code
            );
            if (defaultToppingTwo) {
                toppingPrice = defaultToppingTwo?.price;
            }
            const updatedElTwo = { ...el, price: toppingPrice };
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
        const res1 = await otherPizzaData(res?.data);
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
            productCode: getOtherData?.code,
            productName: getOtherData?.pizza_name,
            productType: "other_pizza",
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
            ct.product.push(payload);
            const cartProduct = ct.product;
            cartFn.addCart(cartProduct, setCart, false, settings);
            navigate("/cart");
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

    const crustOpts = Ingredients?.crust?.map(c => ({ id: c.crustCode, label: c.crustName, price: Number(c.price) })) || [];
    const crustTypeOpts = Ingredients?.crustType?.map(c => ({ id: c.crustTypeCode, label: c.crustType, price: Number(c.price) })) || [];
    const cheeseOpts = Ingredients?.cheese?.map(c => ({ id: c.cheeseCode, label: c.cheeseName, price: Number(c.price) })) || [];
    const spicyOpts = Ingredients?.spices?.map(c => ({ id: c.spicyCode, label: c.spicy, price: Number(c.price) })) || [];
    const sauceOpts = Ingredients?.sauce?.map(c => ({ id: c.sauceCode, label: c.sauce, price: Number(c.price) })) || [];
    const cookOpts = Ingredients?.cook?.map(c => ({ id: c.cookCode, label: c.cook, price: Number(c.price) })) || [];
    const specialBaseOpts = Ingredients?.specialbases?.map(c => ({ id: c.specialbaseCode, label: c.specialbaseName, price: Number(c.price) })) || [];

    const getLabel = (arr, key, valKey) => arr?.find(x => x[key] === valKey);
    const crustLabel = getLabel(Ingredients?.crust, 'crustCode', Crust)?.crustName || 'Select';
    const crustTypeLabel = getLabel(Ingredients?.crustType, 'crustTypeCode', CrustType)?.crustType || 'Select';
    const cheeseLabel = getLabel(Ingredients?.cheese, 'cheeseCode', Cheese)?.cheeseName || 'Select';
    const spicyLabel = getLabel(Ingredients?.spices, 'spicyCode', Spicy)?.spicy || 'Select';
    const sauceLabel = getLabel(Ingredients?.sauce, 'sauceCode', Sauce)?.sauce || 'Select';
    const cookLabel = getLabel(Ingredients?.cook, 'cookCode', Cook)?.cook || 'Select';
    const specialBaseLabel = getLabel(Ingredients?.specialbases, 'specialbaseCode', SpecialBases)?.specialbaseName || 'Select';
    const toppingCount = selectedTopping?.length || 0;

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
                    {/* OptionSheet Modals */}
                    <OptionSheet isOpen={openSheet === 'dough'} onClose={() => setOpenSheet(null)} title="Choose Dough" options={crustOpts} selected={Crust} onSelect={(id) => setCrust(id)} />
                    <OptionSheet isOpen={openSheet === 'crustType'} onClose={() => setOpenSheet(null)} title="Choose Crust Type" options={crustTypeOpts} selected={CrustType} onSelect={(id) => setCrustType(id)} />
                    <OptionSheet isOpen={openSheet === 'cheese'} onClose={() => setOpenSheet(null)} title="Choose Cheese" options={cheeseOpts} selected={Cheese} onSelect={(id) => setCheese(id)} />
                    <OptionSheet isOpen={openSheet === 'spicy'} onClose={() => setOpenSheet(null)} title="Choose Spicy Level" options={spicyOpts} selected={Spicy} onSelect={(id) => setSpicy(id)} />
                    <OptionSheet isOpen={openSheet === 'sauce'} onClose={() => setOpenSheet(null)} title="Choose Sauce" options={sauceOpts} selected={Sauce} onSelect={(id) => setSauce(id)} />
                    <OptionSheet isOpen={openSheet === 'cook'} onClose={() => setOpenSheet(null)} title="Choose Cook Style" options={cookOpts} selected={Cook} onSelect={(id) => setCook(id)} />
                    {specialBaseOpts.length > 0 && <OptionSheet isOpen={openSheet === 'specialBase'} onClose={() => setOpenSheet(null)} title="Choose Special Base" options={specialBaseOpts} selected={SpecialBases} onSelect={(id) => setSpecialBases(id)} />}

                    {/* Topping Sheet */}
                    <ToppingSheet
                        isOpen={openSheet === 'toppings'}
                        onClose={() => setOpenSheet(null)}
                        activeTab={toppingTab}
                        setActiveTab={setToppingTab}
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
                        indianStyleTitle={indianStyleToppingsTitle}
                    />

                    {getOtherData ? (
                        <div className="new-block" id="create-your-own-new">
                            <section className="special-offers-sec new-block primary-background-color py-2">
                                <div className="container py-3 has-sticky-cart-bar">
                                    <div className="row">
                                        {/* ── LEFT COLUMN ──────────────────────────────────── */}
                                        <div className="col-lg-6 col-12">
                                            <h5 className="fw-bold mb-1 d-none d-lg-block">{name}</h5>
                                            {pizzaSubtitle && <p className="text-secondary small mb-3 d-none d-lg-block">{pizzaSubtitle}</p>}

                                            {/* ── OFFER HERO STRIP (mobile) ── */}
                                            <div className="offer-hero-strip d-lg-none mb-3">
                                                <div className="offer-hero-strip__name">{name}</div>
                                                <div className="offer-hero-strip__price">${price}</div>
                                            </div>

                                            {/* ── SIZE PILL SELECTOR ── */}
                                            <div className="mb-3">
                                                <div className="offer-section-label mb-2">SELECT SIZE</div>
                                                <div className="size-pill-scroll">
                                                    {pizzaSizeArr?.map((data) => (
                                                        <button
                                                            key={data.size}
                                                            type="button"
                                                            className={`size-pill${size === data.size ? ' size-pill--active' : ''}`}
                                                            onClick={() => setSize(data.size)}
                                                        >
                                                            <span className="size-pill__name">{data.size}</span>
                                                            <span className="size-pill__price">${data.price}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── CUSTOMIZE TRIGGER BUTTONS ── */}
                                            <h6 className="mt-3 mb-1 fw-bold offer-section-label">CUSTOMIZE YOUR PIZZA</h6>
                                            <div className="d-flex flex-column gap-2 mb-3">
                                                <TriggerBtn icon="🫓" label="Dough" value={crustLabel} sheetKey="dough" />
                                                <TriggerBtn icon="⭕" label="Crust Type" value={crustTypeLabel} sheetKey="crustType" />
                                                {specialBaseOpts.length > 0 && <TriggerBtn icon="🍕" label="Special Base" value={specialBaseLabel} sheetKey="specialBase" />}
                                                <TriggerBtn icon="🧀" label="Cheese" value={cheeseLabel} sheetKey="cheese" />
                                                <TriggerBtn icon="🌶️" label="Spicy" value={spicyLabel} sheetKey="spicy" />
                                                <TriggerBtn icon="🍅" label="Sauce" value={sauceLabel} sheetKey="sauce" />
                                                <TriggerBtn icon="🔥" label="Cook" value={cookLabel} sheetKey="cook" />
                                                <TriggerBtn
                                                    icon="🥗"
                                                    label="Choose Toppings"
                                                    value={toppingCount > 0 ? `${toppingCount} selected` : null}
                                                    sheetKey="toppings"
                                                />
                                                {(ToppingsTwo.length + ToppingsOne.length + ToppingsFree.length) > 0 && (
                                                    <div className="selected-toppings-pills mt-2">
                                                        {[...ToppingsTwo, ...ToppingsOne, ...ToppingsFree].map((t, i) => (
                                                            <span key={i} className="selected-topping-pill">{t.name}</span>
                                                        ))}
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        {/* ── RIGHT COLUMN (desktop summary) ── */}
                                        <div className="col-lg-5 col-12 d-none d-lg-block">
                                            <div
                                                className="p-2 right-side-internal-div-new bg-white shadow-sm rounded-4 card-text-color"
                                                style={{
                                                    position: 'sticky',
                                                    top: '80px',
                                                    border: '1px solid var(--primary-light)'
                                                }}
                                            >
                                                <div className="px-2 row g-1">
                                                    <div className="col-lg-5 p-2 rounded-3">
                                                        <img
                                                            className="pizzaImageBorder"
                                                            src={getOtherData?.pizza_image || pizzaimage}
                                                            alt="pizza-icon"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="d-flex flex-column align-items-center gap-3 py-3">
                                                            <div className="lh-sm fs-1 fw-bold text-center">
                                                                $ {price}
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary rounded-circle pizzaQtyButton"
                                                                    onClick={() => setPizzaQuantity(Math.max(1, pizzaQuantity - 1))}
                                                                    disabled={pizzaQuantity <= 1}
                                                                >
                                                                    <FaMinus className="pizzaQtyButtonSpan" />
                                                                </button>
                                                                <div className="fs-4 fw-bold mx-2">
                                                                    {pizzaQuantity}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary rounded-circle pizzaQtyButton"
                                                                    onClick={() => setPizzaQuantity(pizzaQuantity + 1)}
                                                                    disabled={pizzaQuantity >= 10}
                                                                >
                                                                    <FaPlus className="pizzaQtyButtonSpan" />
                                                                </button>
                                                            </div>
                                                            <div className="d-flex">
                                                                <button
                                                                    type="button"
                                                                    className="view-button px-3"
                                                                    onClick={handleAddToCart}
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 mt-2">
                                                        {/* Selection Summary */}
                                                        <div className="theme-top-border pt-1">
                                                            <div className="row g-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex gap-2 mb-1">
                                                                        <strong className="text-muted small">Size:</strong>
                                                                        <span className="fw-medium small">{size}</span>
                                                                    </div>
                                                                    <div className="d-flex gap-2 mb-1">
                                                                        <strong className="text-muted small">Pizza:</strong>
                                                                        <span className="fw-medium small">{name}</span>
                                                                    </div>
                                                                    {crustLabel !== 'Select' && (
                                                                        <div className="d-flex gap-2 mb-1">
                                                                            <strong className="text-muted small">Dough:</strong>
                                                                            <span className="fw-medium small">{crustLabel}</span>
                                                                        </div>
                                                                    )}
                                                                    {crustTypeLabel !== 'Select' && (
                                                                        <div className="d-flex gap-2 mb-1">
                                                                            <strong className="text-muted small">Crust Type:</strong>
                                                                            <span className="fw-medium small">{crustTypeLabel}</span>
                                                                        </div>
                                                                    )}
                                                                    {cheeseLabel !== 'Select' && (
                                                                        <div className="d-flex gap-2 mb-1">
                                                                            <strong className="text-muted small">Cheese:</strong>
                                                                            <span className="fw-medium small">{cheeseLabel}</span>
                                                                        </div>
                                                                    )}
                                                                    {sauceLabel !== 'Select' && (
                                                                        <div className="d-flex gap-2 mb-1">
                                                                            <strong className="text-muted small">Sauce:</strong>
                                                                            <span className="fw-medium small">{sauceLabel}</span>
                                                                        </div>
                                                                    )}
                                                                    {spicyLabel !== 'Select' && (
                                                                        <div className="d-flex gap-2 mb-1">
                                                                            <strong className="text-muted small">Spicy:</strong>
                                                                            <span className="fw-medium small">{spicyLabel}</span>
                                                                        </div>
                                                                    )}
                                                                    {cookLabel !== 'Select' && (
                                                                        <div className="d-flex gap-2 mb-1">
                                                                            <strong className="text-muted small">Cook:</strong>
                                                                            <span className="fw-medium small">{cookLabel}</span>
                                                                        </div>
                                                                    )}
                                                                    {specialBaseLabel !== 'Select' && (
                                                                        <div className="d-flex gap-2 mb-1">
                                                                            <strong className="text-muted small">Base:</strong>
                                                                            <span className="fw-medium small">{specialBaseLabel}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
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
                    <OtherViewSelectionModal
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
            <Footer />
        </>
    );
};
export default Other;
