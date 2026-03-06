import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
import Tabs from "../../components/Tabs/Tabs";
import CartFunction from "../../components/cart";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import pizzaimage from "../../assets/images/pz.png";
import LoadingLayout from "../../layouts/LoadingLayout";
import { GlobalContext } from "../../context/GlobalContext";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  getAllIngredients,
  getDips,
  getSpecialDetails,
  getToppings,
  settingApi,
} from "../../services";
import SpecialPizzaConfig from "../../components/_main/SpecialOffer/SpecialPizzaConfig";
import DipsConfig from "../../components/_main/SpecialOffer/Configurations/DipsConfig";
import SidesConfig from "../../components/_main/SpecialOffer/Configurations/SidesConfig";
import DrinksConfig from "../../components/_main/SpecialOffer/Configurations/DrinksConfig";
import ShowSpecialPizzaConfig from "../../components/_main/SpecialOffer/ShowSpecialPizzaConfig";
import SPNotFound from "../../layouts/SPNotFound";
import ResponsiveCart from "../../components/_main/Cart/ResponsiveCart";
import { FaEye, FaMinus, FaPlus } from "react-icons/fa6";
import DealsViewSelectionModal from "./DealsViewSelectionModal";

const EditSpecialOffer = () => {
  // navigate
  const { pid, sid } = useParams();
  const navigate = useNavigate();
  //
  // context
  const globalCtx = useContext(GlobalContext);
  const [cart, setCart] = globalCtx.cart;
  // console.log('editcart', cart)
  const [settings, setSettings] = globalCtx.settings;
  const [currentStoreCode, setCurrentStoreCode] = globalCtx.currentStoreCode;
  const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;

  // states management
  const [allIngredients, setAllIngredients] = useState(null);
  console.log('allIngredients', allIngredients)
  const [toppingsData, setToppingsData] = useState(null);
  // console.log('toppingsData',toppingsData)
  const [dipsData, setDipsData] = useState(null);
  const [specialOfferData, setSpecialOfferData] = useState(null);
  // console.log('specialOfferData', specialOfferData)
  const [specialOfferDealType, setSpecialOfferDealType] = useState(null);
  const [pizzaSizeArr, setPizzaSizeArr] = useState([]);
  const [Sides, setSides] = useState([]);
  const [Dips, setDips] = useState([]);
  const [Drinks, setDrinks] = useState([]);
  const [name, setName] = useState(null);
  const [pizzaSubtitle, setPizzaSubTitle] = useState(null);
  //
  // const [isOpen, setIsOpen] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState("size");
  //
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
  const [pizzaState, setPizzaState] = useState([]);
  const [loading, setLoading] = useState(true);
  //
  const [isFixed, setIsFixed] = useState(false);
  const [isTranslate, setIsTranslate] = useState(false);
  const [translateYVal, setTranslateYVal] = useState(null);

  const [pizzaQuantity, setPizzaQuantity] = useState(1);
  // console.log('setPizzaQuantity', pizzaQuantity)
  //
  const [viewSelection, setViewSelection] = useState(false);
  const [settingsData, setSettingsData] = useState([]);

  // Premium Topping Count from settings
  const premiumToppingCount = Number(
    settingsData?.find((s) => s.settingCode === "STG_7")?.settingValue || 1,
  );

  // Memoized Dips Calculations
  const { calcDipsArr, noOfAdditionalDips, noOfFreeDips } = useMemo(() => {
    let calcDipsArr = [];
    let noOfAdditionalDips = 0;
    let noOfFreeDips = Number(specialOfferData?.noofDips) ?? 0;

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
    return { calcDipsArr, noOfAdditionalDips, noOfFreeDips };
  }, [Dips, specialOfferData]);

  // Healper Function
  const cartFn = new CartFunction();

  // Get all ingredients data initially and maintain initial states
  const fetchData = async () => {
    setLoading(true);
    try {
      const settingResponse = await settingApi();
      setSettingsData(settingResponse?.data);
      const [toppingsResponse, dipsResponse, allIngredientsResponse] = await Promise.all([
        getToppings(),
        getDips(),
        getAllIngredients(),
      ]);
      setToppingsData(toppingsResponse?.data || []);
      setDipsData(dipsResponse?.data || []);
      console.log('allIngredientsResponse', allIngredientsResponse)
      const ing = allIngredientsResponse?.data || allIngredientsResponse;
      setAllIngredients(ing);
      return { ing, dips: dipsResponse?.data || [] };
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 500) {
        toast.error(
          error.response.data.message ||
          "An error occurred while fetching data.",
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  // const fetchData = async () => {
  //   try {
  //     const [
  //       toppingsResponse,
  //       dipsResponse,
  //       settingResponse,
  //       allIngredientsResponse,
  //     ] = await Promise.all([
  //       getToppings(),
  //       getDips(),
  //       settingApi(),
  //       getAllIngredients(),
  //     ]);
  //     setSettingsData(settingResponse?.data);
  //     setSettings(settingResponse?.data);
  //     setToppingsData(toppingsResponse?.data || []);
  //     setDipsData(dipsResponse?.data || []);
  //     const ing = allIngredientsResponse?.data || allIngredientsResponse;
  //     setAllIngredients(ing);
  //     return ing;
  //   } catch (error) {
  //     if (error.response?.status === 400 || error.response?.status === 500) {
  //       toast.error(
  //         error.response.data.message ||
  //         "An error occurred while fetching data.",
  //       );
  //     } else {
  //       toast.error("An unexpected error occurred.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const toggleAccordion = (accordionName) => {
    setActiveAccordion(
      activeAccordion === accordionName ? "size" : accordionName,
    );
    setTimeout(() => window.dispatchEvent(new Event("resize")), 8);
  };

  // Get special data
  const specialOffersData = async (fetchRes) => {
    setLoading(true);
    try {
      const cProduct = cart?.product?.find((el) => el?.id === sid);
      const res = await getSpecialDetails(pid);
      // const res = await getSpecialDetails(sid, currentStoreCode);
      const data = res?.data || null;
      const allIng = fetchRes?.ing || allIngredients;
      const enrichData = {
        ...data,
        cheese: data?.cheese?.length > 0 ? data.cheese : (allIng?.cheese || []),
        crust: data?.crust?.length > 0 ? data.crust : (allIng?.crust || []),
        crustType: data?.crustType?.length > 0 ? data.crustType : (allIng?.crustType || []),
        specialBases: data?.specialBases?.length > 0 ? data.specialBases : (allIng?.specialbases || []),
        cook: data?.cook?.length > 0 ? data.cook : (allIng?.cook || []),
        sauce: data?.sauce?.length > 0 ? data.sauce : (allIng?.sauce || []),
        spices: data?.spices?.length > 0 ? data.spices : (allIng?.spices || []),
      }
      console.log("datttttaaa", enrichData);


      if (data && isLimitedOfferActive(data)) {
        setSpecialOfferData(enrichData);
        setName(data.name || "");
        setPizzaSubTitle(data.subtitle || "");
        setPizzaSizeArr(data.pizza_prices || []);
        setSpecialOfferDealType(data.dealType || "");
        setNumberOfPizza(data.noofPizzas || 0);
        setNumberOfDips(data.noofDips || 0);
        setFreeDipsCount(data.noofDips || 0);
        setNumberOfSides(data?.noofSides || 0);
        setNumberOfDrinks(data?.noofDrinks || 0);
        setPizzaState(cProduct?.config?.pizza);
        setPizzaQuantity(cProduct?.quantity);
        if (data?.noofDips > 0) {
          if (cProduct?.config?.dips?.length > 0) {
            setDips(cProduct?.config?.dips);
          } else {
            const allIng = allIngredients || fetchRes?.ing;
            const defaultDip = allIng?.dips?.[0] || fetchRes?.dips?.[0];
            if (defaultDip) {
              const payload = {
                dipsCode: defaultDip.dipsCode,
                dipsName: defaultDip.dipsName,
                dipsPrice: Number(defaultDip.price),
                quantity: 1,
                totalPrice: Number(0.0).toFixed(2),
              };
              setDips([payload]);
            }
          }
        }
        setSize(cProduct?.pizzaSize);
        if (data?.noofSides > 0) {
          if (cProduct?.config?.sides?.length > 0) {
            setSides(cProduct?.config?.sides);
          } else {
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
        }
        if (data?.noofDrinks > 0) {
          if (cProduct?.config?.drinks?.length > 0) {
            setDrinks(cProduct?.config?.drinks);
          } else {
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
        }
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 500) {
        toast.error(
          error.response.data.message ||
          "An error occurred while fetching Deals.",
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Special Pizza Config
  const specialPizzaConfig = [];
  for (let i = 0; i < numberOfPizza; i++) {
    specialPizzaConfig.push(
      <SpecialPizzaConfig
        key={i}
        count={i}
        signaturePizzas={specialOfferData?.signaturePizzas}
        pizzaState={pizzaState}
        setPizzaState={setPizzaState}
        specialOfferData={specialOfferData}
        toppingsData={toppingsData}
        allIngredients={allIngredients}
        activeAccordion={activeAccordion}
        toggleAccordion={toggleAccordion}
      />,
    );
  }

  // const specialPizzaConfig = [];
  // for (let i = 0; i < numberOfPizza; i++) {
  //   specialPizzaConfig.push(
  //     <SpecialPizzaConfig
  //       key={i}
  //       count={i}
  //       specialOfferData={specialOfferData}
  //       toppingsData={toppingsData}
  //       allIngredients={allIngredients}
  //       pizzaState={pizzaState}
  //       setPizzaState={setPizzaState}
  //       activeAccordion={activeAccordion}
  //       toggleAccordion={toggleAccordion}
  //     />,
  //   );
  // }

  // Show Special Pizza Config
  const showSpecialOfferConfig = [];
  for (let i = 0; i < numberOfPizza; i++) {
    showSpecialOfferConfig.push(
      <ShowSpecialPizzaConfig
        key={i}
        count={i}
        pizzaState={pizzaState}
        setPizzaState={setPizzaState}
      />,
    );
  }

  // handle Remove Dips
  const handleRemoveDips = (el) => {
    if (numberOfDips > 0 && Dips.length <= 1) {
      toast.warning("At least one dip must be selected.");
      return;
    }
    const new_dips = Dips.filter((dip) => dip.dipsCode !== el.dipsCode);
    setDips(new_dips);
  };

  // Fetching data when the page loads
  const getData = async () => {
    const res = await fetchData();
    await specialOffersData(res);
  };

  useEffect(() => {
    getData();
  }, []);



  const handleAddToCart = () => {
    if (currentStoreCode === undefined || currentStoreCode === null) {
      setShowStorePopup(true);
      return false;
    }

    if (noOfFreeDips > 0) {
      if (!Array.isArray(Dips) || Dips.length === 0) {
        toast.error("Please select at least one dip");
        return false;
      }
    }

    const payload = {
      id: sid,
      productCode: pid,
      productName: name,
      productType: "special_pizza_topping",
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
        pizzaSizeArr?.find((data) => data?.size === size)?.price,
      ),
      comments: "",
    };
    if (payload) {
      let ct = JSON.parse(localStorage.getItem("cart"));
      const filteredCart = ct?.product?.filter(
        (items) => items?.id !== payload?.id,
      );
      filteredCart.push(payload);
      const cartProduct = filteredCart;
      cartFn.addCart(cartProduct, setCart, true, settings);
      navigate("/");
    }
  };

  useEffect(() => {
    if (sid) {
      let price = 0;

      // Pizza Size Calculations
      if (pizzaSizeArr?.length > 0) {
        let sizeObject = pizzaSizeArr?.find((el) => el?.size === size);
        let new_price = sizeObject?.price;
        price = +price + +new_price;
      }

      // Handle Dips
      let totalDipsPrice = 0;
      calcDipsArr?.forEach((dips) => {
        totalDipsPrice += Number(dips?.totalPrice);
      });
      price += Number(totalDipsPrice);

      // Pizza Configurations Price Calculations
      let totalAdditionalPrice = 0;
      pizzaState?.forEach((pizza) => {
        // Dough (Crust & CrustType)
        totalAdditionalPrice += Number(pizza?.crust?.price || 0);
        totalAdditionalPrice += Number(pizza?.crustType?.price || 0);
        // Cheese
        totalAdditionalPrice += Number(pizza?.cheese?.price || 0);
        // Sauce
        totalAdditionalPrice += Number(pizza?.sauce?.price || 0);
        // Spicy
        totalAdditionalPrice += Number(pizza?.spicy?.price || 0);
        // Cook
        totalAdditionalPrice += Number(pizza?.cook?.price || 0);
        // Special Bases
        totalAdditionalPrice += Number(pizza?.specialBases?.price || 0);

        // Toppings
        pizza?.toppings?.countAsOneToppings?.forEach((t) => {
          totalAdditionalPrice += Number(t.toppingsPrice || 0);
        });
        pizza?.toppings?.countAsTwoToppings?.forEach((t) => {
          totalAdditionalPrice += Number(t.toppingsPrice || 0);
        });
      });
      price += Number(totalAdditionalPrice);

      let fixed_price = price.toFixed(2);
      let finalPrice = Number(fixed_price) * Number(pizzaQuantity);
      setPrice(Number(finalPrice).toFixed(2));
      //
      setFreeDipsCount(noOfFreeDips);
      setAdditionalDipsCount(noOfAdditionalDips);
    }
  }, [
    Dips,
    calcDipsArr,
    noOfFreeDips,
    noOfAdditionalDips,
    pizzaQuantity,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 767) return;
      const scrollY = window.scrollY;
      const rightSideDiv = document.querySelector(".right-side-internal-div");
      const footer = document.querySelector(".main-footer");

      if (!rightSideDiv || !footer) return;

      const rightDivTopOffset =
        rightSideDiv.getBoundingClientRect().top + scrollY;
      const rightDivBottomOffset =
        rightSideDiv.getBoundingClientRect().bottom + scrollY;
      const footerOffset = footer.offsetTop;
      const rightDivHeight = rightSideDiv.offsetHeight;

      const isBottomTouch = rightDivBottomOffset + 20 >= footerOffset;

      if (scrollY >= 300) {
        if (!isBottomTouch) {
          setIsFixed(true);
          setIsTranslate(false);
          setTranslateYVal(null);
        } else {
          if (scrollY + 80 >= rightDivTopOffset) {
            setIsFixed(false);
            setIsTranslate(true);
            //setTranslateYVal(footerOffset - 250 - rightDivHeight);
            setTranslateYVal(0);
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

    const handleResize = () => {
      handleScroll(); // Recalculate on resize or accordion toggle
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isFixed, isTranslate, translateYVal, activeAccordion]);

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
          <div className="d-flex align-items-center justify-content-between innder-page-header">
            <div className="flex-grow-1 section-header">
              <span className="category-subtitle"></span>
            </div>
          </div>
          {specialOfferData ? (
            <div className="new-block" id="create-your-own-new">
              <section className="special-offers-sec new-block primary-background-color">
                <div className="container">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb mt-5">
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
                <div className="container">
                  <div className="mainContainer primary-text-color">
                    {/* left side */}
                    <div className="p-3">
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
                                {pizzaSizeArr
                                  ?.filter(
                                    (price) => parseFloat(price.price) > 0,
                                  )
                                  ?.map((data, index) => {
                                    return (
                                      <div
                                        className={`${size === data?.size
                                          ? "selected-card-background-color selected-card-text-color"
                                          : "card-background-color card-text-color"
                                          }  py-3 px-3 mb-3 rounded-3`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setSize(data?.size)}
                                        key={index}
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <p className="fs-6">
                                            <span className="me-2">
                                              <input
                                                type="radio"
                                                className="form-check-input"
                                                checked={size === data?.size}
                                                readOnly
                                              />
                                            </span>
                                            {data?.size} (${data?.price})
                                          </p>
                                          {size === data?.size ? (
                                            <IoMdCheckmarkCircleOutline
                                              color="#90EE90"
                                              size={25}
                                            />
                                          ) : (
                                            <IoMdCheckmarkCircleOutline
                                              color="transparent"
                                              size={25}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="fs-3 fw-bold mt-5">CUSTOMIZE</p>
                      <p className="mt-3 fs-6">
                        Select any of the below to Deals.
                      </p>

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
                          numberOfDips={numberOfDips}
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
                        className={`p-3  right-side-internal-div card-background-color card-text-color ${isFixed ? "fixed" : ""
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
                                  onClick={() => handleAddToCart()}
                                  className={`view-button px-3`}
                                >
                                  UPDATE PIZZA
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="scrollable-content">
                            <div className="border-top pizza-card-border-color">
                              <div className="row">
                                <div className="col-12 p-2">
                                  <div className="d-flex flex-column py-2">
                                    {numberOfDips > 0 && (
                                      <>
                                        <p className="fs-5 mb-2 fw-bold">
                                          Free Dips:{" "}
                                          <span className="mx-2">
                                            {numberOfDips - noOfFreeDips} / {numberOfDips}
                                          </span>
                                        </p>
                                        <p className="fs-5 fw-bold">
                                          Additional Dips:{" "}
                                          <span className="mx-2 text-danger">
                                            {noOfAdditionalDips}
                                          </span>
                                        </p>
                                      </>
                                    )}
                                    {specialOfferData?.noofToppings > 0 &&
                                      (() => {
                                        const totalToppingsLimit = Number(
                                          specialOfferData.noofToppings || 0,
                                        );

                                        const totalSelected = pizzaState.reduce(
                                          (acc, pizza) => {
                                            return (
                                              acc +
                                              (pizza?.toppings?.countAsOneToppings
                                                ?.length || 0) +
                                              (pizza?.toppings?.countAsTwoToppings
                                                ?.length || 0) *
                                              (premiumToppingCount || 1)
                                            );
                                          },
                                          0,
                                        );

                                        const freeUsed = Math.min(
                                          totalSelected,
                                          totalToppingsLimit,
                                        );
                                        const additional = Math.max(
                                          0,
                                          totalSelected - totalToppingsLimit,
                                        );

                                        return (
                                          <>
                                            <p className="fs-5 mb-2 fw-bold">
                                              Free Toppings:{" "}
                                              <span className="mx-2">
                                                {freeUsed} / {totalToppingsLimit}
                                              </span>
                                            </p>
                                            <p className="fs-5 fw-bold">
                                              Additional Toppings:{" "}
                                              <span
                                                className={`mx-2 ${additional > 0 ? "text-danger" : ""}`}
                                              >
                                                {additional}
                                              </span>
                                            </p>
                                          </>
                                        );
                                      })()}
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
                                            (data) => data?.size === size,
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
                                          {`${el?.dipsName}(${el?.quantity
                                            }) ($${dipsData?.find(
                                              (data) =>
                                                data?.dipsCode === el?.dipsCode,
                                            )?.price * el?.quantity
                                            })`}
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
          ) : (
            <SPNotFound />
          )}
          <Footer />
          <ResponsiveCart
            handleCart={handleAddToCart}
            totalPrice={price}
            section={"UPDATE PIZZA"}
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
        </div>
      )}
    </>
  );
};

export default EditSpecialOffer;  