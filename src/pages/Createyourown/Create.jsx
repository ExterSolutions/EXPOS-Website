import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import OptionSheet from "../../components/_main/OptionSheet";
import SEOHead from "../../components/_main/SEOHead";
import CartFunction from "../../components/cart";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import { getAllIngredients, getSides, settingApi } from "../../services";
import { CheeseSelector } from "./CheeseSelector";
import { DipsSelector } from "./DipsSelector";
import { DrinkSelector } from "./DrinkSelector";
import { CYOFreeToppingSelector } from "./CYOFreeToppingSelector";
import { CYOToppingOneSelector } from "./CYOToppingOneSelector";
import { CYOToppingTwoSelector } from "./CYOToppingTwoSelector";
import ToppingSheet from "../../components/_main/ToppingSheet";

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
  // Topping sheet state
  const [toppingSheetOpen, setToppingSheetOpen] = useState(false);
  const [toppingSheetTab, setToppingSheetTab] = useState("two");
  // Option sheet state (Dough, Cheese, Spicy, Sauce, Cook, Sides, Drinks, Dips)
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
          <SEOHead
            title="Build Your Own Pizza | Pizza"
            description="Create your perfect pizza from scratch. Choose your dough, cheese, spicy level, sauce, cook style, and toppings. Order online for delivery or pickup."
          />
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
                      Create Your Own
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="container">
                <div className="mainContainer primary-text-color">
                  {/* left side */}
                  <div className="p-3">
                    {/* Hero Header */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img
                        className="cust-hero-img d-none d-sm-block"
                        src={CustomizePizzaImg}
                        alt="Create Your Own Pizza"
                      />
                      <div>
                        <p className="fs-2 fw-bold text-primary mb-1">CREATE YOUR OWN PIZZA</p>
                        <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>Your perfect slice, your way!</p>
                      </div>
                    </div>

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
                    {/* ── OptionSheet Modals ── */}
                    <OptionSheet isOpen={openSheet === 'dough'} onClose={() => setOpenSheet(null)} title="Choose Dough" options={(Ingredients?.crust || []).map(c => ({ id: c.crustCode, label: c.crustName, price: Number(c.price) }))} selected={Crust} onSelect={setCrust} />
                    <OptionSheet isOpen={openSheet === 'cheese'} onClose={() => setOpenSheet(null)} title="Choose Cheese" options={(Ingredients?.cheese || []).map(c => ({ id: c.cheeseCode, label: c.cheeseName, price: Number(c.price) }))} selected={Cheese} onSelect={setCheese} />
                    <OptionSheet isOpen={openSheet === 'spicy'} onClose={() => setOpenSheet(null)} title="Choose Spicy Level" options={(Ingredients?.spices || []).map(c => ({ id: c.spicyCode, label: c.spicy, price: Number(c.price) }))} selected={Spicy} onSelect={setSpicy} />
                    <OptionSheet isOpen={openSheet === 'sauce'} onClose={() => setOpenSheet(null)} title="Choose Sauce" options={(Ingredients?.sauce || []).map(c => ({ id: c.sauceCode, label: c.sauce, price: Number(c.price) }))} selected={Sauce} onSelect={setSauce} />
                    <OptionSheet isOpen={openSheet === 'cook'} onClose={() => setOpenSheet(null)} title="Choose Cook Style" options={(Ingredients?.cook || []).map(c => ({ id: c.cookCode, label: c.cook, price: Number(c.price) }))} selected={Cook} onSelect={setCook} />

                    {/* Sides sheet */}
                    {openSheet === 'sides' && (
                      <>
                        <div className="topping-sheet-backdrop" onClick={() => setOpenSheet(null)} aria-hidden="true" />
                        <div className="topping-sheet slide-up-in" role="dialog" aria-modal="true">
                          <div className="topping-sheet__handle" />
                          <div className="topping-sheet__header">
                            <p className="topping-sheet__title">Add Sides</p>
                            <button className="topping-sheet__close" onClick={() => setOpenSheet(null)} aria-label="Close"><IoMdClose size={20} /></button>
                          </div>
                          <div className="topping-sheet__body">
                            {sidesIngredients?.map((data, index) => (
                              <SidesSelector key={index} Sides={Sides} data={data} handleSides={handleSides} handleSideSizeChange={handleSideSizeChange} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Drinks sheet */}
                    {openSheet === 'drinks' && (
                      <>
                        <div className="topping-sheet-backdrop" onClick={() => setOpenSheet(null)} aria-hidden="true" />
                        <div className="topping-sheet slide-up-in" role="dialog" aria-modal="true">
                          <div className="topping-sheet__handle" />
                          <div className="topping-sheet__header">
                            <p className="topping-sheet__title">Add Drinks</p>
                            <button className="topping-sheet__close" onClick={() => setOpenSheet(null)} aria-label="Close"><IoMdClose size={20} /></button>
                          </div>
                          <div className="topping-sheet__body">
                            {Ingredients?.softdrinks?.map((data, index) => (
                              <DrinkSelector key={index} Drinks={Drinks} data={data} handleDrink={handleDrinks} handleDrinkQuantity={handleDrinkQuantity} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Dips sheet */}
                    {openSheet === 'dips' && (
                      <>
                        <div className="topping-sheet-backdrop" onClick={() => setOpenSheet(null)} aria-hidden="true" />
                        <div className="topping-sheet slide-up-in" role="dialog" aria-modal="true">
                          <div className="topping-sheet__handle" />
                          <div className="topping-sheet__header">
                            <p className="topping-sheet__title">Add Dips</p>
                            <button className="topping-sheet__close" onClick={() => setOpenSheet(null)} aria-label="Close"><IoMdClose size={20} /></button>
                          </div>
                          <div className="topping-sheet__body">
                            {Ingredients?.dips?.map((data, index) => (
                              <DipsSelector key={index} Dips={Dips} data={data} handleDips={handleDips} handleDipsQuantity={handleDipsQuantity} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <h6 className="offer-section-label mb-2 mt-1">CUSTOMIZE YOUR PIZZA</h6>
                    <div className="d-flex flex-column gap-2 mb-3">
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('dough')}>
                        <span className="topping-trigger-btn__icon">🫓</span>
                        <span className="topping-trigger-btn__label">Dough</span>
                        <span className="topping-trigger-btn__value">{(Ingredients?.crust || []).find(c => c.crustCode === Crust)?.crustName || 'Select'}</span>
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('cheese')}>
                        <span className="topping-trigger-btn__icon">🧀</span>
                        <span className="topping-trigger-btn__label">Cheese</span>
                        <span className="topping-trigger-btn__value">{(Ingredients?.cheese || []).find(c => c.cheeseCode === Cheese)?.cheeseName || 'Select'}</span>
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('spicy')}>
                        <span className="topping-trigger-btn__icon">🌶️</span>
                        <span className="topping-trigger-btn__label">Spicy</span>
                        <span className="topping-trigger-btn__value">{(Ingredients?.spices || []).find(c => c.spicyCode === Spicy)?.spicy || 'Select'}</span>
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('sauce')}>
                        <span className="topping-trigger-btn__icon">🍅</span>
                        <span className="topping-trigger-btn__label">Sauce</span>
                        <span className="topping-trigger-btn__value">{(Ingredients?.sauce || []).find(c => c.sauceCode === Sauce)?.sauce || 'Select'}</span>
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('cook')}>
                        <span className="topping-trigger-btn__icon">🔥</span>
                        <span className="topping-trigger-btn__label">Cook</span>
                        <span className="topping-trigger-btn__value">{(Ingredients?.cook || []).find(c => c.cookCode === Cook)?.cook || 'Select'}</span>
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
                    </div>


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
                      {(ToppingsTwo.length + ToppingsOne.length + ToppingsFree.length) > 0 && (
                        <div className="selected-toppings-pills">
                          {[...ToppingsTwo, ...ToppingsOne, ...ToppingsFree].map((t, i) => (
                            <span key={i} className="selected-topping-pill">{t.name}</span>
                          ))}
                        </div>
                      )}
                    </div>

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
                      ToppingTwoSelector={CYOToppingTwoSelector}
                      ToppingOneSelector={CYOToppingOneSelector}
                      FreeToppingSelector={CYOFreeToppingSelector}
                      nonRegularTitle={nonRegularToppingsTitle}
                      regularTitle={regularToppingsTitle}
                      indianStyleTitle={indianStyleToppingsTitle}
                    />

                    {/* ── Sides / Drinks / Dips trigger buttons ── */}
                    <h6 className="offer-section-label mb-2 mt-3">ADD-ONS</h6>
                    <div className="d-flex flex-column gap-2 mb-3">
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('sides')}>
                        <span className="topping-trigger-btn__icon">🥗</span>
                        <span className="topping-trigger-btn__label">Sides</span>
                        {Sides?.length > 0 && <span className="topping-trigger-btn__value">{Sides.length} selected</span>}
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('drinks')}>
                        <span className="topping-trigger-btn__icon">🥤</span>
                        <span className="topping-trigger-btn__label">Drinks</span>
                        {Drinks?.length > 0 && <span className="topping-trigger-btn__value">{Drinks.length} selected</span>}
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
                      <button type="button" className="topping-trigger-btn" onClick={() => setOpenSheet('dips')}>
                        <span className="topping-trigger-btn__icon">🍶</span>
                        <span className="topping-trigger-btn__label">Dips</span>
                        {Dips?.length > 0 && <span className="topping-trigger-btn__value">{Dips.length} selected</span>}
                        <span className="topping-trigger-btn__chevron">›</span>
                      </button>
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
                                    {/* Display a single button for Indian Toppings Toppings */}
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

        </div>
      )}
    </>
  );
};

export default CreatePizza;
