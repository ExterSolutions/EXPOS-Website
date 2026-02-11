import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
// import Tabs from "../../components/Tabs/Tabs";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaMinus, FaPlus } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import pizzaimage from "../../assets/images/pz.png";
// import "../../assets/styles/new/homepage/specialpizza/additional.css";
import ResponsiveCart from "../../components/_main/Cart/ResponsiveCart";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import DipsConfig from "../../components/_main/SpecialOffer/Configurations/DipsConfig";
import DrinksConfig from "../../components/_main/SpecialOffer/Configurations/DrinksConfig";
import SidesConfig from "../../components/_main/SpecialOffer/Configurations/SidesConfig";
import ShowSpecialPizzaConfig from "../../components/_main/SpecialOffer/ShowSpecialPizzaConfig";
import SpecialPizzaConfig from "../../components/_main/SpecialOffer/SpecialPizzaConfig";
import CartFunction from "../../components/cart";
import {GlobalContext} from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import SPNotFound from "../../layouts/SPNotFound";
import {
    getDips,
    getSpecialDetails,
    getToppings,
    settingApi,
} from "../../services";
import DealsViewSelectionModal from "./DealsViewSelectionModal";

function SpecialOffer() {
    // navigate
    const { sid } = useParams();
    const navigate = useNavigate();
    //
    // context
    const globalCtx = useContext(GlobalContext);
    const [cart, setCart] = globalCtx.cart;
    const settings = globalCtx.settings[0];
    const currentStoreCode = globalCtx.currentStoreCode[0];
    const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
    const selectedType = globalCtx.selectedType[0];

    // states management
    const [toppingsData, setToppingsData] = useState(null);
    const [dipsData, setDipsData] = useState(null);
    const [specialOfferData, setSpecialOfferData] = useState(null);
    const [specialOfferDealType, setSpecialOfferDealType] = useState(null);
    const [pizzaSizeArr, setPizzaSizeArr] = useState([]);
    const [Sides, setSides] = useState([]);
    const [Dips, setDips] = useState([]);
    const [Drinks, setDrinks] = useState([]);
    const [name, setName] = useState(null);
    const [pizzaSubtitle, setPizzaSubTitle] = useState(null);

    const [activeAccordion, setActiveAccordion] = useState("size");

    const [freeDipsCount, setFreeDipsCount] = useState(0);
    const [addtionalDipsCount, setAdditionalDipsCount] = useState(0);
    //
    const [numberOfPizza, setNumberOfPizza] = useState(0);
    const [numberOfDips, setNumberOfDips] = useState(0);
    const [numberOfDrinks, setNumberOfDrinks] = useState(0);
    const [numberOfSides, setNumberOfSides] = useState(0);
    //
    const [size, setSize] = useState("Large");
    const [price, setPrice] = useState(16);
    const [pizzaQuantity, setPizzaQuantity] = useState(1);
    const [pizzaState, setPizzaState] = useState([]);
    const [loading, setLoading] = useState(true);
    //
    const [isFixed, setIsFixed] = useState(false);
    const [isTranslate, setIsTranslate] = useState(false);
    const [translateYVal, setTranslateYVal] = useState(null);
    //
    const [viewSelection, setViewSelection] = useState(false);
    const [dealTypeAlert, setDealTypeAlert] = useState(false);
    const [settingsData, setSettingsData] = useState([]);
    //
    let calcDipsArr = [];
    let noOfAdditionalDips = Number(0);
    let noOfFreeDips = Number(specialOfferData?.noofDips) ?? 0;

    // Healper Function
    const cartFn = new CartFunction();

    // Get all ingredients data initially and maintain initial states
    const fetchData = async () => {
        try {
            const [toppingsResponse, dipsResponse, settingResponse] =
                await Promise.all([getToppings(), getDips(), settingApi()]);
            setSettingsData(settingResponse?.data);
            setToppingsData(toppingsResponse?.data || []);
            setDipsData(dipsResponse?.data || []);
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(
                    error.response.data.message ||
                    "An error occurred while fetching data."
                );
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleAccordion = (accordionName) => {
        setActiveAccordion(
            activeAccordion === accordionName ? "size" : accordionName
        );
        setTimeout(() => window.dispatchEvent(new Event("resize")), 8);
    };

    // Filter All Reacords From Deals API
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

    // Get special data
    const specialOffersData = async () => {
        try {
            const res = await getSpecialDetails(sid, currentStoreCode);
            const data = res?.data || null;
            if (data && isLimitedOfferActive(data)) {
                setSpecialOfferData(data);
                setName(data.name || "");
                const firstValidSize =
                    data.pizza_prices?.find((price) => parseFloat(price.price) > 0)
                        ?.size || "";
                setSize(firstValidSize);
                setPizzaSubTitle(data.subtitle || "");
                setPizzaSizeArr(data.pizza_prices || []);
                setSpecialOfferDealType(data.dealType || "");
                setNumberOfPizza(data.noofPizzas || 0);
                setNumberOfDips(data.noofDips || 0);
                setFreeDipsCount(data.noofDips || 0);
                setNumberOfSides(data?.noofSides || 0);
                setNumberOfDrinks(data?.noofDrinks || 0);
                if (data?.noofSides > 0) {
                    const selected = data?.freesides[0];
                    const payload = {
                        sideCode: selected?.code,
                        sideName: selected?.sideName,
                        sideType: selected?.type,
                        lineCode: selected?.lineEntries[0]?.code,
                        sidePrice: selected?.lineEntries[0]?.price,
                        sideSize: selected?.lineEntries[0]?.size,
                        quantity: 1,
                        totalPrice: Number(0.0).toFixed(2),
                    };
                    setSides([payload]);
                }
                if (data?.noofDrinks > 0) {
                    const selected =
                        data?.pops?.length > 0
                            ? data.pops[0]
                            : data?.bottle?.length > 0
                                ? data.bottle[0]
                                : null;
                    if (selected) {
                        const payload = {
                            drinksCode: selected.code,
                            drinksName: selected.softDrinkName,
                            drinksPrice: selected.price,
                            quantity: 1,
                            totalPrice: Number(0.0).toFixed(2),
                        };
                        setDrinks([payload]);
                    } else {
                        setDrinks([]);
                    }
                }
                const crustObject = {
                    crustCode: data.crust?.[0]?.code || '',
                    crustName: data.crust?.[0]?.crustName || '',
                    price: data.crust?.[0]?.price || 0,
                };
                const crustTypeObject = {
                    crustTypeCode: data.crustType?.[0]?.crustTypeCode || '',
                    crustType: data.crustType?.[0]?.crustType || '',
                    price: data.crustType?.[0]?.price || 0,
                };
                const cheeseObject = {
                    cheeseCode: data.cheese?.[0]?.code || '',
                    cheeseName: data.cheese?.[0]?.cheeseName || '',
                    price: data.cheese?.[0]?.price || 0,
                };
                const spicyObject = {
                    spicyCode: data.spices?.[0]?.spicyCode || '',
                    spicy: data.spices?.[0]?.spicy || '',
                    price: data.spices?.[0]?.price || 0,
                };
                const sauceObject = {
                    sauceCode: data.sauce?.[0]?.sauceCode || '',
                    sauce: data.sauce?.[0]?.sauce || '',
                    price: data.sauce?.[0]?.price || 0,
                };
                const cookObject = {
                    cookCode: data.cook?.[0]?.cookCode || '',
                    cook: data.cook?.[0]?.cook || '',
                    price: data.cook?.[0]?.price || 0,
                };
                const specialBasesObject = {
                    specialBasesCode: data.specialBases?.[0]?.specialBasesCode || '',
                    specialBases: data.specialBases?.[0]?.specialBases || '',
                    price: data.specialBases?.[0]?.price || 0,
                }
                const emptyObjectsArray = Array.from({ length: data.noofPizzas || 0 }, () => ({
                    crust: crustObject,
                    cheese: cheeseObject,
                    crustType: crustTypeObject,
                    specialBases: specialBasesObject,
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
            }
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(
                    error.response.data.message ||
                    "An error occurred while fetching Deals."
                );
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    // handle Remove Dips
    const handleRemoveDips = (el) => {
        const new_dips = Dips.filter((dip) => dip.dipsCode !== el.dipsCode);
        setDips(new_dips);
    };

    // Special Pizza Config
    const specialPizzaConfig = [];
    for (let i = 0; i < numberOfPizza; i++) {
        specialPizzaConfig.push(
            <SpecialPizzaConfig
                key={i}
                count={i}
                specialOfferData={specialOfferData}
                toppingsData={toppingsData}
                pizzaState={pizzaState}
                setPizzaState={setPizzaState}
                activeAccordion={activeAccordion}
                toggleAccordion={toggleAccordion}
            />
        );
    }

    // Show Special Pizza Config
    const showSpecialOfferConfig = [];
    for (let i = 0; i < numberOfPizza; i++) {
        showSpecialOfferConfig.push(
            <ShowSpecialPizzaConfig
                key={i}
                count={i}
                pizzaState={pizzaState}
                setPizzaState={setPizzaState}
            />
        );
    }

    // Fetching data when the page loads
    const getData = async () => {
        await fetchData();
        await specialOffersData();
    };

    useEffect(() => {
        getData();
    }, [currentStoreCode]);

    const handleAddToCart = (e) => {
        e.preventDefault();

        if (currentStoreCode === undefined || currentStoreCode === null) {
            setShowStorePopup(true);
            return;
        }

        if (dealTypeAlert) {
            toast.warning(
                `You can't add this product to the cart because your selected order method is ${selectedType}, but this product is only available for ${specialOfferDealType === "pickupdeal"
                    ? "pickup deal"
                    : "delivery deal"
                }.`
            );
            return;
        }

        if (noOfFreeDips > 0) {
            if (!Array.isArray(Dips) || Dips.length === 0) {
                toast.error("Please select at least one dip");
                return;
            }
        }

        const payload = {
            id: uuidv4(),
            productCode: specialOfferData?.code,
            productName: specialOfferData?.name,
            productType: "special_pizza",
            config: {
                pizza: pizzaState,
                sides: Sides,
                dips: calcDipsArr,
                drinks: Drinks,
            },
            quantity: Number(pizzaQuantity),
            price: Number(price).toFixed(2),
            amount: Number(price).toFixed(2),
            pizzaSize: size,
            pizzaPrice: Number(
                pizzaSizeArr?.find((data) => data?.size === size)?.price
            ),
            comments: "",
        };
        if (payload) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            ct.product.push(payload);
            const cartProduct = ct.product;
            cartFn.addCart(cartProduct, setCart, false, settings);
            navigate("/");
        }
    };

    useEffect(() => {
        if (sid) {
            let noOfAdditionalDips = Number(0);
            let noOfFreeDips = Number(specialOfferData?.noofDips) ?? 0;

            let price = 0;

            // Pizza Size Calculations
            if (pizzaSizeArr?.length > 0) {
                let sizeObject = pizzaSizeArr?.find((el) => el?.size === size);
                let new_price = sizeObject?.price;
                price = +price + +new_price;
            }

            let totalDipsPrice = Number(0);
            if (Dips?.length > 0) {
                Dips?.forEach((item) => {
                    let usedFreeDips = 0;
                    if (noOfFreeDips > 0) {
                        if (item.quantity <= noOfFreeDips) {
                            usedFreeDips = item.quantity;
                        } else {
                            usedFreeDips = noOfFreeDips;
                        }

                        noOfFreeDips -= usedFreeDips;
                    }
                    let paidQuantity = Number(item.quantity) - Number(usedFreeDips);
                    noOfAdditionalDips += paidQuantity;
                    let dipsObj = {
                        ...item,
                        freeQuantity: usedFreeDips,
                        paidQuantity: paidQuantity,
                        totalPrice: Number(paidQuantity) * Number(item.dipsPrice),
                    };
                    calcDipsArr.push(dipsObj);
                });
            }
            calcDipsArr?.map((dips) => {
                totalDipsPrice += Number(dips?.totalPrice);
            });
            price += Number(totalDipsPrice);

            let fixed_price = price.toFixed(2);
            let finalPrice = Number(fixed_price) * Number(pizzaQuantity);
            setPrice(Number(finalPrice).toFixed(2));
            setFreeDipsCount(noOfFreeDips);
            setAdditionalDipsCount(noOfAdditionalDips);
        }
    }, [
        sid,
        size,
        pizzaState,
        Dips,
        calcDipsArr,
        noOfFreeDips,
        noOfAdditionalDips,
    ]);

    // Throttle function to limit scroll event frequency
    const throttle = (func, limit) => {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    useEffect(() => {
        let rightSideDiv, footer;

        const handleScroll = () => {
            if (window.innerWidth <= 1024) return; // consistent with CSS

            // Cache DOM elements to avoid repeated queries
            if (!rightSideDiv) rightSideDiv = document.querySelector(".right-side-internal-div-new");
            if (!footer) footer = document.querySelector(".main-footer");

            if (!rightSideDiv || !footer) return;

            const scrollY = window.scrollY;
            const rightDivTopOffset = rightSideDiv.getBoundingClientRect().top + scrollY;
            const rightDivBottomOffset = rightSideDiv.getBoundingClientRect().bottom + scrollY;
            const footerOffset = footer.offsetTop;
            const rightDivHeight = rightSideDiv.offsetHeight;

            const isBottomTouch = rightDivBottomOffset + 20 >= footerOffset;

            if (scrollY >= 150) {
                if (!isBottomTouch) {
                    setIsFixed(true);
                    setIsTranslate(false);
                    setTranslateYVal(null);
                } else {
                    if (scrollY + 80 >= rightDivTopOffset) {
                        setIsFixed(true); // Keep fixed to maintain viewport positioning
                        setIsTranslate(true);
                        // Calculate translateY to position the bottom of the div 100px above the footer
                        // Assumes fixed top is 0px (common for sticky after header); adjust if your CSS fixed top differs
                        setTranslateYVal(footerOffset - 100 - rightDivHeight - scrollY);
                    } else {
                        setIsFixed(true);
                        setIsTranslate(false);
                        setTranslateYVal(null);
                    }
                }
            } else {
                if (!isTranslate) {
                    setIsFixed(false);
                    setIsTranslate(false);
                    setTranslateYVal(null);
                }
            }
        };

        const throttledScroll = throttle(handleScroll, 16); // ~60fps
        const handleResize = () => {
            rightSideDiv = null; // Reset cache on resize
            footer = null;
            handleScroll();
        };

        window.addEventListener("scroll", throttledScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", throttledScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, [isFixed, isTranslate, translateYVal, activeAccordion]);

    useEffect(() => {
        if (
            selectedType === "pickup" &&
            specialOfferData?.dealType === "deliverydeal"
        ) {
            setDealTypeAlert(true);
        } else if (
            selectedType === "delivery" &&
            specialOfferData?.dealType === "pickupdeal"
        ) {
            setDealTypeAlert(true);
        } else {
            setDealTypeAlert(false);
        }
    }, [selectedType, specialOfferData]);

    if (loading) return <LoadingLayout />;

    if (specialOfferData?.length < 0) return <SPNotFound />;

    return (

        <div>
            <Header />
            <div className="nav-margin"></div>
            <div className="d-flex align-items-center justify-content-between innder-page-header">
                <div className="flex-grow-1 section-header">
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb custom-breadcrumb mt-3">
                                <li className="breadcrumb-item" aria-current="page">
                                    Home
                                </li>
                                <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                >
                                    Deals
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <span className="category-subtitle"></span>
                </div>
            </div>

            <div className="new-block" id="create-your-own-new">
                <section className="special-offers-sec new-block primary-background-color">
                    <div className="container">
                        <div className="mainContainer primary-text-color">
                            {/* left side */}
                            <div className=" p-3">
                                <p className="fs-1 fw-bold">{name}</p>
                                <p
                                    className={`mt-3 mb-3 fs-6 ${specialOfferDealType === "pickupdeal"
                                        ? "pickup-deal-style"
                                        : ""
                                        }`}
                                >
                                    {pizzaSubtitle}
                                </p>
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
                                                    src={specialOfferData?.image || pizzaimage}
                                                    alt="Pizza icon"
                                                />
                                            </div>
                                            <div className="col-7 p-0 m-0">
                                                <div
                                                    className="d-flex flex-column justify-content-center"
                                                >
                                                    <p className="lh-sm fw-bold text-start my-1 pizzaPriceSm">
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
                                                        <div className="lh-sm fs-5 fw-bold mx-2">
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
                                                                onClick={handleAddToCart}
                                                                className="btn pizza-card-btn-background-color pizza-card-btn-text-color fw-bold pizzaAddToCardBtnSm"
                                                            >
                                                                Add to Cart
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
                                    <div className="accordion" id="accordion-size">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="accordion-size">
                                                <button
                                                    className={`fw-bold fs-6 accordion-button ${activeAccordion === "size" ? "" : "collapsed"
                                                        }`}
                                                    type="button"
                                                    onClick={() => toggleAccordion("size")}
                                                    aria-expanded={
                                                        activeAccordion === "size" ? "true" : "false"
                                                    }
                                                    aria-controls="collapseSize"
                                                >
                                                    SELECT SIZE
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseSize"
                                                className={`accordion-collapse collapse ${activeAccordion === "size" ? "show" : ""
                                                    }`}
                                                aria-labelledby="accordion-size"
                                                data-bs-parent="#accordion-size"
                                                style={{ overflow: "hidden" }}
                                            >
                                                <div className="accordion-body primary-background-color">
                                                    <div className="d-flex align-content-stretch flex-column flex-md-row gap-3">
                                                        {pizzaSizeArr
                                                            ?.filter((price) => parseFloat(price.price) > 0)
                                                            ?.map((data, index) => {
                                                                return (
                                                                    <div
                                                                        className={`p-3 rounded-3 ${size === data?.size
                                                                            ? "selected-card-background-color selected-card-text-color"
                                                                            : "card-background-color card-text-color"
                                                                            }`}
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => setSize(data?.size)}
                                                                        key={index}
                                                                    >
                                                                        <div className="">
                                                                            <div>
                                                                                <input
                                                                                    type="radio"
                                                                                    className="form-check-input d-none"
                                                                                    checked={size === data?.size}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                {data?.size} (${data?.price})
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

                                <p className="fs-3 fw-bold mt-5">CUSTOMIZE</p>

                                <p className="mt-3 fs-6">Select any of the below to Deals.</p>

                                {specialPizzaConfig}

                                {numberOfSides > 0 && (
                                    <SidesConfig
                                        Sides={Sides}
                                        setSides={setSides}
                                        specialOfferData={specialOfferData}
                                        activeAccordion={activeAccordion}
                                        toggleAccordion={toggleAccordion}
                                    />
                                )}
                                {numberOfDips > 0 && (
                                    <DipsConfig
                                        Dips={Dips}
                                        setDips={setDips}
                                        dipsData={dipsData}
                                        activeAccordion={activeAccordion}
                                        toggleAccordion={toggleAccordion}
                                    />
                                )}
                                {numberOfDrinks > 0 && (
                                    <DrinksConfig
                                        Drinks={Drinks}
                                        setDrinks={setDrinks}
                                        specialOfferData={specialOfferData}
                                        activeAccordion={activeAccordion}
                                        toggleAccordion={toggleAccordion}
                                    />
                                )}
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
                                        '--translate-y': isTranslate ? `${translateYVal}px` : '0px',
                                        position: 'sticky'
                                    }}
                                >
                                    <div className="px-3 row">
                                        <div className="col-lg-6 p-3">
                                            <img
                                                className="pizzaImageBorder"
                                                src={
                                                    specialOfferData?.image
                                                        ? specialOfferData?.image
                                                        : pizzaimage
                                                }
                                                alt="pizza-icon"
                                            />
                                        </div>
                                        <div className="col-lg-6 p-4">
                                            <div className="d-flex flex-column py-4">
                                                <p className="lh-sm fs-1 fw-bold text-center text-lg-start">
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
                                                    <p className="lh-sm fs-4 fw-bold mx-2">
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
                                                        onClick={handleAddToCart}
                                                        className={`view-button px-3`}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="scrollable-content">
                                            <div className="border-top pizza-card-border-color mt-4">
                                                <div className="row">
                                                    <div className="col-12 p-2">
                                                        <div className="d-flex flex-column py-2">
                                                            {numberOfDips > 0 && (
                                                                <>
                                                                    <p className="fs-5 mb-2 fw-bold">
                                                                        Free Dips:{" "}
                                                                        <span className="mx-2">
                                                                            {freeDipsCount} / {numberOfDips}
                                                                        </span>
                                                                    </p>
                                                                    <p className="fs-5 fw-bold">
                                                                        Additional Dips:{" "}
                                                                        <span className="mx-2">
                                                                            {addtionalDipsCount}
                                                                        </span>
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {size && (
                                                <div className="border-top pizza-card-border-color mt-1 py-3">
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            {size && (
                                                                <p className="lh-sm fs-6 mt-2 mt-lg-0">
                                                                    <GoDotFill /> Size: {size} (
                                                                    {
                                                                        pizzaSizeArr?.find(
                                                                            (data) => data?.size === size
                                                                        )?.price
                                                                    }
                                                                    )
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {showSpecialOfferConfig}
                                            {Drinks?.length > 0 && (
                                                <div className="py-3 border-top pizza-card-border-color">
                                                    <p>DRINKS YOU SELECTED</p>
                                                    <div className="mt-3 d-flex flex-wrap gap-3">
                                                        {Drinks?.map((el) => {
                                                            return (
                                                                <div>
                                                                    <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.drinksName}(${el?.quantity}) ($${el?.totalPrice})`}</button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            {Dips?.length > 0 && (
                                                <div className="py-3 border-top pizza-card-border-color">
                                                    <p>DIPS YOU SELECTED</p>
                                                    <div className="mt-3 d-flex flex-wrap gap-3">
                                                        {Dips?.map((el) => {
                                                            return (
                                                                <div>
                                                                    <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">
                                                                        {`${el?.dipsName}(${el?.quantity}) ($${dipsData?.find(
                                                                            (data) =>
                                                                                data?.dipsCode === el?.dipsCode
                                                                        )?.price * el?.quantity
                                                                            })`}{" "}
                                                                        <span
                                                                            className="ms-2"
                                                                            onClick={() => handleRemoveDips(el)}
                                                                        >
                                                                            <IoMdClose />
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            {Sides?.length > 0 && (
                                                <div className="py-3 border-top pizza-card-border-color">
                                                    <p>SIDES YOU SELECTED</p>
                                                    <div className="mt-3 d-flex flex-wrap gap-3">
                                                        {Sides?.map((el) => {
                                                            return (
                                                                <div>
                                                                    <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.sideName}(${el?.quantity}) ($${el?.totalPrice})`}</button>
                                                                </div>
                                                            );
                                                        })}
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
                handleCart={handleAddToCart}
                totalPrice={price}
                section={"Add to Cart"}
            />

            <DealsViewSelectionModal
                viewSelection={viewSelection}
                setViewSelection={setViewSelection}
                numberOfDips={numberOfDips}
                freeDipsCount={freeDipsCount}
                addtionalDipsCount={addtionalDipsCount}
                size={size}
                pizzaSizeArr={pizzaSizeArr}
                showSpecialOfferConfig={showSpecialOfferConfig}
                Drinks={Drinks}
                Dips={Dips}
                dipsData={dipsData}
                handleRemoveDips={handleRemoveDips}
                Sides={Sides}
            />
            <Footer />
        </div>

    );
}

export default SpecialOffer;