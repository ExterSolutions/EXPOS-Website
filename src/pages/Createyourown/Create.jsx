import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import CartFunction from "../../components/cart";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import { getAllIngredients, getSides, settingApi } from "../../services";
import { CheeseSelector } from "./CheeseSelector";
import { DipsSelector } from "./DipsSelector";
import { DrinkSelector } from "./DrinkSelector";
import { FreeToppingSelector } from "./FreeToppingSelector";
import { SauceSelector } from "./SauceSelector";
import { SpicySelector } from "./SpicySelector";
import { ToppingOneSelector } from "./ToppingOneSelector";
import { ToppingTwoSelector } from "./ToppingTwoSelector";

import { FaEye } from "react-icons/fa6";
import CustomizePizzaImg from "../../assets/images/customizePizza.jpg";
import ResponsiveCart from "../../components/_main/Cart/ResponsiveCart";
import { CookSelector } from "./CookSelector";
import CustomizeViewSelectionModal from "./CustomizeViewSelectionModal";
import DoughSelector from "./DoughSelector";
import SidesSelector from "./SidesSelector";

const CreatePizza = () => {
  // navigate
  const navigate = useNavigate();

  // context
  const globalCtx = useContext(GlobalContext);
  const [cart, setCart] = globalCtx.cart;
  const [settings, setSettings] = globalCtx.settings;
  const [currentStoreCode, setCurrentStoreCode] = globalCtx.currentStoreCode;
  const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;

  // states management
  // const [isOpen, setIsOpen] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState("size");

  const [size, setSize] = useState("Large");
  const [pizzaSizeArr, setPizzaSizeArr] = useState([]);
  const [Ingredients, setIngredients] = useState([]);
  const [sidesIngredients, setSidesIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [Drinks, setDrinks] = useState([]);
  const [Dips, setDips] = useState([]);
  const [Sides, setSides] = useState([]);
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
      const sideRes = await getSides();
      setSidesIngredients(sideRes?.data);
      setIngredients(res?.data);
      setCrust(res?.data?.crust[0]?.crustCode);
      setCrustType(res?.data?.crustType[0]?.crustTypeCode);
      setCheese(res?.data?.cheese[0]?.cheeseCode);
      setSpicy(res?.data?.spices[0]?.spicyCode);
      setSauce(res?.data?.sauce[0]?.sauceCode);
      setCook(res?.data?.cook[0]?.cookCode);
      setPizzaSizeArr(res?.data?.sizesAndPrices);
      setSize(res?.data?.sizesAndPrices[0]?.size);
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
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 500) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
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

  const createYourOwnTitle =
    settingsData.find((item) => item.shortCode === "create-your-own")?.settingValue ??
    "Create Your Own";

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
      setToppingsOne((prev) => [...prev, el]);
      setSelectedToppings((prev) => [...prev, el]);
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
      setToppingsTwo((prev) => [...prev, el]);
      setSelectedToppings((prev) => [...prev, el]);
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
      setToppingsFree((prev) => [...prev, el]);
      setSelectedToppings((prev) => [...prev, el]);
    }
  };

  const handleSides = (el) => {
    if (Sides.some((side) => side.sideCode === el.sideCode)) {
      const new_sides = Sides.filter((side) => side.sideCode !== el.sideCode);
      setSides(new_sides);
    } else {
      setSides((prev) => [...prev, el]);
    }
  };

  const handleSideSizeChange = (payload) => {
    if (Sides.some((obj) => obj?.sideCode === payload?.sideCode)) {
      const updated_sides = Sides.map((obj) =>
        obj?.sideCode === payload?.sideCode ? payload : obj
      );
      setSides(updated_sides);
    }
  };

  // fetching data when page loads
  useEffect(() => {
    fetchData();
  }, []);

  // handle drinks
  const handleDrinks = (el) => {
    if (Drinks.some((drink) => drink.code === el.code)) {
      const new_drinks = Drinks.filter((drink) => drink.code !== el.code);
      setDrinks(new_drinks);
    } else {
      setDrinks((prev) => [...prev, el]);
    }
  };

  //  handle dips
  const handleDips = (el) => {
    if (Dips.some((dip) => dip.code === el.code)) {
      const new_dips = Dips.filter((dip) => dip.code !== el.code);
      setDips(new_dips);
    } else {
      setDips((prev) => [...prev, el]);
    }
  };

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

  // handle Remove drinks
  const handleRemovDrinks = (el) => {
    const new_drinks = Drinks.filter((drink) => drink.code !== el.code);
    setDrinks(new_drinks);
  };

  // handle Remove Dips
  const handleRemoveDips = (el) => {
    const new_dips = Dips.filter((dip) => dip.code !== el.code);
    setDips(new_dips);
  };

  const handleRemoveSides = (el) => {
    const new_sides = Sides.filter((side) => side.sideCode !== el.sideCode);
    setSides(new_sides);
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

  const handleDrinkQuantity = (payload) => {
    let updatedDrinks = Drinks?.map((el) =>
      el?.code === payload?.code ? payload : el
    );
    setDrinks(updatedDrinks);
  };

  const handleDipsQuantity = (payload) => {
    let updatedDrinks = Dips?.map((el) =>
      el?.code === payload?.code ? payload : el
    );
    setDips(updatedDrinks);
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

    const drinkArr = Drinks?.map((el) => {
      return {
        drinksCode: el?.code,
        drinksName: el?.name,
        drinksPrice: el?.price,
        quantity: el?.quantity,
        totalPrice: el?.totalPrice,
      };
    });

    const dipsArr = Dips?.map((el) => {
      return {
        dipsCode: el?.code,
        dipsName: el?.name,
        dipsPrice: el?.price,
        quantity: el?.quantity,
        totalPrice: el?.totalPrice,
      };
    });

    const sidesArr = Sides?.map((el) => {
      return {
        sideCode: el?.sideCode,
        sideName: el?.sideName,
        sideType: el?.sideType,
        lineCode: el?.lineCode,
        sidePrice: el?.sidePrice,
        sideSize: el?.sideSize,
        quantity: 1,
        totalPrice: Number(el?.sidePrice).toFixed(2),
      };
    });

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
    let pizzasize = pizzaSizeArr?.find((el) => el?.size === size)?.price;
    let isAllIndiansTps =
      ToppingsFree?.length === Ingredients?.toppings?.freeToppings?.length;

    const payload = {
      id: uuidv4(),
      productCode: "#NA",
      productName: "Create Your Own",
      productType: "custom_pizza",
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
        sides: sidesArr,
        dips: dipsArr,
        drinks: drinkArr,
      },
      quantity: Number(pizzaQuantity),
      price: Number(price).toFixed(2),
      amount: Number(price).toFixed(2) * Number(1),
      taxPer: 0,
      pizzaSize: size,
      pizzaPrice: pizzasize,
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
    if (Drinks?.length > 0) {
      const DrinksPrice = Drinks?.reduce((total, el) => {
        return total + +el?.totalPrice;
      }, 0);

      price = +price + +DrinksPrice;
    }
    if (Dips?.length > 0) {
      const DipsPrice = Dips?.reduce((total, el) => {
        return total + +el?.totalPrice;
      }, 0);

      price = +price + +DipsPrice;
    }
    if (Sides?.length > 0) {
      const SidesPrice = Sides?.reduce((total, el) => {
        return total + +el?.totalPrice;
      }, 0);

      price = +price + +SidesPrice;
    }
    let fixed_price = price.toFixed(2);
    setPrice(fixed_price);
  }, [
    pizzaQuantity,
    Ingredients,
    pizzaSizeArr,
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
    Drinks,
    Dips,
    Sides,
    size,
  ]);

  useEffect(() => {
    ToppingsFree?.length === Ingredients?.toppings?.freeToppings?.length
      ? setIsIndiansToppings(true)
      : setIsIndiansToppings(false);
  }, [ToppingsFree, Ingredients]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.innerWidth <= 766) return;
  //     const scrollY = window.scrollY;
  //     const rightSideDiv = document.querySelector(".right-side-internal-div");
  //     const footer = document.querySelector(".main-footer");

  //     if (!rightSideDiv || !footer) return;

  //     const rightDivTopOffset =
  //       rightSideDiv.getBoundingClientRect().top + scrollY;
  //     const rightDivBottomOffset =
  //       rightSideDiv.getBoundingClientRect().bottom + scrollY;
  //     const footerOffset = footer.offsetTop;
  //     const rightDivHeight = rightSideDiv.offsetHeight;

  //     const isBottomTouch = rightDivBottomOffset + 20 >= footerOffset;

  //     if (scrollY >= 150) {
  //       if (!isBottomTouch) {
  //         setIsFixed(true);
  //         setIsTranslate(false);
  //         setTranslateYVal(null);
  //       } else {
  //         if (scrollY + 80 >= rightDivTopOffset) {
  //           setIsFixed(false);
  //           setIsTranslate(true);
  //           setTranslateYVal(footerOffset - 250 - rightDivHeight);
  //         } else {
  //           setIsFixed(true);
  //           setIsTranslate(false);
  //           setTranslateYVal(null);
  //         }
  //       }
  //     } else {
  //       if (!isTranslate) {
  //         setIsFixed(false);
  //         setIsTranslate(false);
  //         setTranslateYVal(null);
  //       }
  //     }
  //   };

  //   const handleResize = () => {
  //     handleScroll(); // Recalculate on resize or accordion toggle
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [isFixed, isTranslate, translateYVal, activeAccordion]);

  return (
    <>
      {loading ? (
        <>
          <LoadingLayout />
        </>
      ) : (
        <div className="">
          <Header />
          <div className="nav-margin"></div>

          <div
            className="new-block primary-background-color"
            id="create-your-own-new"
          >
            <section className="primary-background-color special-offers-sec new-block py-2">
              <div className="container ">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb ">
                    <li className="breadcrumb-item " aria-current="page">
                      Home
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {createYourOwnTitle}
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="container">
                <div className="mainContainer primary-text-color">
                  {/* left side */}
                  <div className=" p-3">
                    <p className="fs-1 fw-bold text-primary">{createYourOwnTitle.toUpperCase()}</p>
                    <p className="mt-3 mb-3 fs-6 text-secondary">
                      Your perfect slice, your way!
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
                              src={CustomizePizzaImg}
                              alt="Pizza icon"
                            />
                          </div>
                          <div className="col-7 p-0 m-0">
                            <div
                              className="d-flex flex-column justify-content-center "
                              style={{ padding: "0px 10px" }}
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
                                      className={` p-3 rounded-3 ${size === data?.size
                                        ? "selected-card-background-color selected-card-text-color"
                                        : "card-background-color card-text-color"
                                        }`}
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
                            <div className="accordion-body primary-background-color">
                              <div className="d-flex flex-column gap-3">
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
                            <div className="accordion-body primary-background-color">
                              <div className="d-flex flex-column gap-3">
                                {Ingredients?.spices?.map((data, index) => {
                                  return (
                                    <SpicySelector
                                      data={data}
                                      Spicy={Spicy}
                                      handleSpicy={(payload) =>
                                        setSpicy(payload)
                                      }
                                    />
                                  );
                                })}
                              </div>
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
                            <div className="accordion-body primary-background-color">
                              <div className="d-flex flex-column gap-3">
                                {Ingredients?.sauce?.map((data, index) => {
                                  return (
                                    <SauceSelector
                                      data={data}
                                      Sauce={Sauce}
                                      handleSauce={(payload) =>
                                        setSauce(payload)
                                      }
                                    />
                                  );
                                })}
                              </div>
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
                            <div className="accordion-body primary-background-color">
                              <div className="d-flex flex-column gap-3">
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
                    </div>

                    {/* toppings */}
                    {/* <div className="mt-3">
                      <div className="accordion" id="accordionExample9">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingNine">
                            <button
                              className={`fw-bold fs-6 accordion-button ${
                                activeAccordion === "toppings"
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
                            className={`accordion-collapse collapse ${
                              activeAccordion === "toppings" ? "show" : ""
                            }`}
                            aria-labelledby="headingNine"
                            data-bs-parent="#accordionExample9"
                            style={{ overflow: "hidden" }}
                          >
                            <div className="accordion-body primary-background-color">
                              <div className="d-flex flex-column gap-3">
                                <div className="pb-2 mb-2 d-flex justify-content-between row">
                                  <div
                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${
                                      Topping === "two" ? "tab-border" : ""
                                    }`}
                                    onClick={() => setTopping("two")}
                                  >
                                    {nonRegularToppingsTitle}
                                  </div>
                                  <div
                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${
                                      Topping === "one" ? "tab-border" : ""
                                    }`}
                                    onClick={() => setTopping("one")}
                                  >
                                    {regularToppingsTitle}
                                  </div>
                                  <div
                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${
                                      Topping === "free" ? "tab-border" : ""
                                    }`}
                                    onClick={() => setTopping("free")}
                                  >
                                    {indianStyleToppingsTitle}
                                  </div>
                                </div>
                                {Topping === "two" &&
                                  Ingredients?.toppings?.countAsTwo?.map(
                                    (data, index) => {
                                      return (
                                        <ToppingTwoSelector
                                          key={index}
                                          data={data}
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
                                {Topping === "one" &&
                                  Ingredients?.toppings?.countAsOne?.map(
                                    (data, index) => {
                                      return (
                                        <ToppingOneSelector
                                          key={index}
                                          data={data}
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
                    <div className="mt-3">
                      <div className="accordion" id="accordionExample9">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingNine">
                            <button
                              className={`fw-bold fs-6 accordion-button ${activeAccordion === "toppings" ? "" : "collapsed"
                                }`}
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
                            className={`accordion-collapse collapse ${activeAccordion === "toppings" ? "show" : ""
                              }`}
                            aria-labelledby="headingNine"
                            data-bs-parent="#accordionExample9"
                            style={{ overflow: "hidden" }}
                          >
                            <div className="accordion-body primary-background-color">
                              <div className="d-flex flex-column gap-4">

                                {/* Group 1: Non-Regular Toppings */}
                                <div>
                                  <div className="pb-2 mb-2 fw-medium m-0 text-secondary">
                                    {nonRegularToppingsTitle}
                                  </div>
                                  <div className="d-flex flex-wrap gap-2">
                                    {Ingredients?.toppings?.countAsTwo?.map((data, index) => (
                                      <ToppingTwoSelector
                                        key={index}
                                        data={data}
                                        ToppingsTwo={ToppingsTwo}
                                        handleTopping={(payload) => handleToppingsTwo(payload)}
                                        handleSizeChange={(payload) => handleSizeChange(payload)}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {/* Group 2: Regular Toppings */}
                                <div>
                                  <div className="pb-2 mb-2 fw-medium m-0 text-secondary">
                                    {regularToppingsTitle}
                                  </div>
                                  <div className="d-flex flex-wrap gap-2">
                                    {Ingredients?.toppings?.countAsOne?.map((data, index) => (
                                      <ToppingOneSelector
                                        key={index}
                                        data={data}
                                        ToppingsOne={ToppingsOne}
                                        handleTopping={(payload) => handleToppingOne(payload)}
                                        handleSizeChange={(payload) => handleSizeChange(payload)}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {/* Group 3: Indian Style */}
                                <div>
                                  <div className="pb-2 mb-2 fw-medium m-0 text-secondary">
                                    {indianStyleToppingsTitle}
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
                    </div>

                    {/* sides */}
                    <div className="mt-3">
                      <div className="accordion" id="accordionExample10">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingTen">
                            <button
                              className={`fw-bold fs-6 accordion-button ${activeAccordion === "sides" ? "" : "collapsed"
                                }`}
                              type="button"
                              onClick={() => toggleAccordion("sides")}
                              aria-expanded={
                                activeAccordion === "sides" ? "true" : "false"
                              }
                              aria-controls="collapseTen"
                            >
                              SIDES
                            </button>
                          </h2>
                          <div
                            id="collapseTen"
                            className={`accordion-collapse collapse ${activeAccordion === "sides" ? "show" : ""
                              }`}
                            aria-labelledby="headingTen"
                            data-bs-parent="#accordionExample10"
                            style={{ overflow: "hidden" }}
                          >
                            <div className="accordion-body primary-background-color">
                              {sidesIngredients?.map((data, index) => {
                                return (
                                  <SidesSelector
                                    key={index}
                                    Sides={Sides}
                                    data={data}
                                    handleSides={(payload) =>
                                      handleSides(payload)
                                    }
                                    handleSideSizeChange={(payload) =>
                                      handleSideSizeChange(payload)
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* drinks */}
                    <div className="mt-3">
                      <div className="accordion" id="accordionExample10">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingTen">
                            <button
                              className={`fw-bold fs-6 accordion-button ${activeAccordion === "drinks" ? "" : "collapsed"
                                }`}
                              type="button"
                              onClick={() => toggleAccordion("drinks")}
                              aria-expanded={
                                activeAccordion === "drinks" ? "true" : "false"
                              }
                              aria-controls="collapseTen"
                            >
                              DRINKS
                            </button>
                          </h2>
                          <div
                            id="collapseTen"
                            className={`accordion-collapse collapse ${activeAccordion === "drinks" ? "show" : ""
                              }`}
                            aria-labelledby="headingTen"
                            data-bs-parent="#accordionExample10"
                            style={{ overflow: "hidden" }}
                          >
                            <div className="accordion-body primary-background-color">
                              {Ingredients?.softdrinks?.map((data, index) => {
                                return (
                                  <DrinkSelector
                                    key={index}
                                    Drinks={Drinks}
                                    data={data}
                                    handleDrink={(payload) =>
                                      handleDrinks(payload)
                                    }
                                    handleDrinkQuantity={(payload) =>
                                      handleDrinkQuantity(payload)
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* dips */}
                    <div className="mt-3">
                      <div className="accordion" id="accordionExample11">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingEleven">
                            <button
                              className={`fw-bold fs-6 accordion-button ${activeAccordion === "dips" ? "" : "collapsed"
                                }`}
                              type="button"
                              onClick={() => toggleAccordion("dips")}
                              aria-expanded={
                                activeAccordion === "dips" ? "true" : "false"
                              }
                              aria-controls="collapseEleven"
                            >
                              DIPS
                            </button>
                          </h2>
                          <div
                            id="collapseEleven"
                            className={`accordion-collapse collapse ${activeAccordion === "dips" ? "show" : ""
                              }`}
                            aria-labelledby="headingEleven"
                            data-bs-parent="#accordionExample11"
                            style={{ overflow: "hidden" }}
                          >
                            <div className="accordion-body primary-background-color">
                              {Ingredients?.dips?.map((data, index) => {
                                return (
                                  <DipsSelector
                                    key={index}
                                    Dips={Dips}
                                    data={data}
                                    handleDips={(payload) =>
                                      handleDips(payload)
                                    }
                                    handleDipsQuantity={(payload) =>
                                      handleDipsQuantity(payload)
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* right side */}
                  <div
                    className="right-side-div p-3 d-lg-block d-none"
                    style={{ position: "relative !important" }}
                  >
                    <div
                      className={`p-3 right-side-internal-div card-background-color ${isFixed ? "fixed" : ""
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
                            src={CustomizePizzaImg}
                            alt="pizza-icon"
                          />
                        </div>
                        <div className="col-lg-6 p-4">
                          <div className="d-flex flex-column py-4">
                            <p className="lh-sm fs-1 fw-bold text-center text-lg-start">
                              $ {price}
                            </p>
                            <div
                              className="d-none d-flex justify-content-center  justify-content-lg-start align-items-center mt-3"
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
                                  {size && (
                                    <p className="lh-sm fs-6 mt-2 mt-lg-0">
                                      <GoDotFill /> Size: {size} ($
                                      {
                                        pizzaSizeArr?.find(
                                          (el) => el?.size === size
                                        )?.price
                                      }
                                      )
                                    </p>
                                  )}
                                  {CrustType && (
                                    <p className="lh-sm fs-6 mt-2">
                                      <GoDotFill /> Crust Type:{" "}
                                      {
                                        Ingredients?.crustType?.filter(
                                          (top) =>
                                            top?.crustTypeCode === CrustType
                                        )[0]?.crustType
                                      }{" "}
                                      ($
                                      {
                                        Ingredients?.crustType?.filter(
                                          (top) =>
                                            top?.crustTypeCode === CrustType
                                        )[0]?.price
                                      }
                                      )
                                    </p>
                                  )}
                                  {Spicy && (
                                    <p className="lh-sm fs-6 mt-2">
                                      <GoDotFill /> Spicy:{" "}
                                      {
                                        Ingredients?.spices?.filter(
                                          (top) => top?.spicyCode === Spicy
                                        )[0]?.spicy
                                      }{" "}
                                      ($
                                      {
                                        Ingredients?.spices?.filter(
                                          (top) => top?.spicyCode === Spicy
                                        )[0]?.price
                                      }
                                      )
                                    </p>
                                  )}
                                  {Sauce && (
                                    <p className="lh-sm fs-6 mt-2">
                                      <GoDotFill /> Sauce:{" "}
                                      {
                                        Ingredients?.sauce?.filter(
                                          (top) => top?.sauceCode === Sauce
                                        )[0]?.sauce
                                      }{" "}
                                      ($
                                      {
                                        Ingredients?.sauce?.filter(
                                          (top) => top?.sauceCode === Sauce
                                        )[0]?.price
                                      }
                                      )
                                    </p>
                                  )}
                                </div>
                                <div className="col-lg-6">
                                  {Crust && (
                                    <p className="lh-sm fs-6 mt-2 mt-lg-0">
                                      <GoDotFill /> Crust:{" "}
                                      {
                                        Ingredients?.crust?.filter(
                                          (top) => top?.crustCode === Crust
                                        )[0]?.crustName
                                      }{" "}
                                      ($
                                      {
                                        Ingredients?.crust?.filter(
                                          (top) => top?.crustCode === Crust
                                        )[0]?.price
                                      }
                                      )
                                    </p>
                                  )}
                                  {Cheese && (
                                    <p className="lh-sm fs-6 mt-2">
                                      <GoDotFill /> Cheese:{" "}
                                      {
                                        Ingredients?.cheese?.filter(
                                          (top) => top?.cheeseCode === Cheese
                                        )[0]?.cheeseName
                                      }{" "}
                                      ($
                                      {
                                        Ingredients?.cheese?.filter(
                                          (top) => top?.cheeseCode === Cheese
                                        )[0]?.price
                                      }
                                      )
                                    </p>
                                  )}
                                  {Cook && (
                                    <p className="lh-sm fs-6 mt-2">
                                      <GoDotFill /> Cook:{" "}
                                      {
                                        Ingredients?.cook?.filter(
                                          (top) => top?.cookCode === Cook
                                        )[0]?.cook
                                      }{" "}
                                      ($
                                      {
                                        Ingredients?.cook?.filter(
                                          (top) => top?.cookCode === Cook
                                        )[0]?.price
                                      }
                                      )
                                    </p>
                                  )}
                                  {SpecialBases && (
                                    <p className="lh-sm fs-6 mt-2">
                                      <GoDotFill /> Special Base:{" "}
                                      {
                                        Ingredients?.specialbases?.filter(
                                          (top) =>
                                            top?.specialbaseCode ===
                                            SpecialBases
                                        )[0]?.specialbaseName
                                      }{" "}
                                      ($
                                      {
                                        Ingredients?.specialbases?.filter(
                                          (top) =>
                                            top?.specialbaseCode ===
                                            SpecialBases
                                        )[0]?.price
                                      }
                                      )
                                    </p>
                                  )}
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
                                      Indian Style + Coriander
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

                          {Drinks?.length > 0 && (
                            <div className="py-3 border-top pizza-card-border-color">
                              <p>DRINKS YOU SELECTED</p>
                              <div className="mt-3 d-flex flex-wrap gap-3">
                                {Drinks?.map((el) => {
                                  return (
                                    <div>
                                      <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">
                                        {`${el?.name}(${el?.quantity}) ($${el?.totalPrice})`}
                                        <span
                                          className="ms-2"
                                          onClick={() => handleRemovDrinks(el)}
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
                          {Dips?.length > 0 && (
                            <div className="py-3 border-top pizza-card-border-color">
                              <p>DIPS YOU SELECTED</p>
                              <div className="mt-3 d-flex flex-wrap gap-3">
                                {Dips?.map((el) => {
                                  return (
                                    <div>
                                      <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">
                                        {`${el?.name}(${el?.quantity}) ($${el?.totalPrice})`}
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
                                      <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">
                                        {`${el?.sideName}(${el?.quantity}) ($${el?.totalPrice})`}
                                        <span
                                          className="ms-2"
                                          onClick={() => handleRemoveSides(el)}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <Footer />
          <ResponsiveCart
            handleCart={handleAddToCart}
            totalPrice={price}
            section={"Add to Cart"}
          />
          <CustomizeViewSelectionModal
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
            Drinks={Drinks}
            handleRemovDrinks={handleRemovDrinks}
            Dips={Dips}
            handleRemoveDips={handleRemoveDips}
            Sides={Sides}
            handleRemoveSides={handleRemoveSides}
          />
        </div>
      )}
    </>
  );
};

export default CreatePizza;
