import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
// import Tabs from "../../components/Tabs/Tabs";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  FaEye,
  FaMinus,
  FaPlus,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa6";
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
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import SPNotFound from "../../layouts/SPNotFound";
import {
  getDips,
  getSpecialDetails,
  getToppings,
  getAllIngredients,
  settingApi,
} from "../../services";
import DealsViewSelectionModal from "./DealsViewSelectionModal";
import SizeSelector from "../SpecialOfferNew/components/SizeSelector";
import SummarySidebar from "../SpecialOfferNew/components/SummarySidebar";

function SpecialOffer() {
  // navigate
  const { sid } = useParams();
  const navigate = useNavigate();
  //
  // context
  const globalCtx = useContext(GlobalContext);
  const [cart, setCart] = globalCtx.cart;
  const [settings, setSettings] = globalCtx.settings;
  const currentStoreCode = globalCtx.currentStoreCode[0];
  const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
  const selectedType = globalCtx.selectedType[0];

  // states management
  const [toppingsData, setToppingsData] = useState(null);
  // console.log('toppingsData123',toppingsData)

  const [allIngredients, setAllIngredients] = useState(null);
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
  const [price, setPrice] = useState(0);
  const [pizzaQuantity, setPizzaQuantity] = useState(1);
  const [pizzaState, setPizzaState] = useState([]);
  console.log("pizzaState", pizzaState);
  const [loading, setLoading] = useState(true);
  //
  const [isFixed, setIsFixed] = useState(false);
  const [isTranslate, setIsTranslate] = useState(false);
  const [translateYVal, setTranslateYVal] = useState(null);
  //
  const [viewSelection, setViewSelection] = useState(false);
  const [dealTypeAlert, setDealTypeAlert] = useState(false);
  const [settingsData, setSettingsData] = useState([]);
  const premiumToppingCount = Number(
    settingsData?.find((s) => s.shortCode === "non-regular-toppings-count")?.settingValue || 1,
  );
  const specialOfferTitle =
    settingsData.find((item) => item.shortCode === "specialoffer")?.settingValue ??
    "Special Offer";

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
    try {
      const [toppingsResponse, dipsResponse, allIngredientsResponse, settingsResponse] = await Promise.all([
        getToppings(),
        getDips(),
        getAllIngredients(),
        settingApi(),
      ]);
      setToppingsData(toppingsResponse?.data || []);
      setDipsData(dipsResponse?.data || []);
      const settingsData = settingsResponse?.data || [];
      setSettingsData(settingsData);
      setSettings(settingsData);
      const ing = allIngredientsResponse?.data || allIngredientsResponse;
      setAllIngredients(ing);
      return { ing, dips: dipsResponse?.data || [], toppings: toppingsResponse?.data || [] };
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 500) {
        toast.error(
          error.response.data.message ||
          "An error occurred while fetching data.",
        );
      } else {
        // toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (accordionName) => {
    setActiveAccordion(
      activeAccordion === accordionName ? "size" : accordionName,
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
  const specialOffersData = async (fetchRes) => {
    try {
      const res = await getSpecialDetails(sid, currentStoreCode);
      const data = res?.data || null;
      console.log('Dataaa:', res);
      if (data && isLimitedOfferActive(data)) {
        // Merge global ingredients if offer doesn't provide specific lists
        const mergedData = { ...data };
        const allIng = fetchRes?.ing || allIngredients;
        const toppingsD = fetchRes?.toppings || toppingsData;

        if (allIng) {
          if (allIng.cheese?.length > 0) mergedData.cheese = allIng.cheese;
          if (allIng.crust?.length > 0) mergedData.crust = allIng.crust;
          if (allIng.crustType?.length > 0)
            mergedData.crustType = allIng.crustType;
          if (allIng.specialbases?.length > 0)
            mergedData.specialBases = allIng.specialbases;
          else if (allIng.specialBases?.length > 0)
            mergedData.specialBases = allIng.specialBases;
          if (allIng.sauce?.length > 0) mergedData.sauce = allIng.sauce;
          if (allIng.spices?.length > 0) mergedData.spices = allIng.spices;
          if (allIng.cook?.length > 0) mergedData.cook = allIng.cook;
        }

        setSpecialOfferData(mergedData);
        setName(mergedData.name || "");
        const firstValidSize =
          mergedData.pizza_prices?.find((price) => parseFloat(price.price) > 0)
            ?.size || "";
        setSize(firstValidSize);
        setPizzaSubTitle(mergedData.subtitle || "");
        setPizzaSizeArr(mergedData.pizza_prices || []);
        setSpecialOfferDealType(mergedData.dealType || "");
        setNumberOfPizza(mergedData.noofPizzas || 0);
        setNumberOfDips(mergedData.noofDips || 0);
        setFreeDipsCount(mergedData.noofDips || 0);
        setNumberOfSides(mergedData?.noofSides || 0);
        setNumberOfDrinks(mergedData?.noofDrinks || 0);
        if (mergedData?.noofDips > 0) {
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
        if (mergedData?.noofSides > 0) {
          const selected = mergedData?.freesides[0];
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
        if (mergedData?.noofDrinks > 0) {
          const selected =
            mergedData?.pops?.length > 0
              ? mergedData.pops[0]
              : mergedData?.bottle?.length > 0
                ? mergedData.bottle[0]
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
        const emptyObjectsArray = Array.from(
          { length: mergedData.noofPizzas || 0 },
          () => {
            const firstCrust = mergedData.crust?.[0];
            const firstCrustType = mergedData.crustType?.[0];
            const firstCheese = mergedData.cheese?.[0];
            const firstSpicy = mergedData.spices?.[0];
            const firstSauce = mergedData.sauce?.[0];
            const firstCook = mergedData.cook?.[0];
            const firstSpecialBase = mergedData.specialBases?.[0];

            return {
              signaturePizza: mergedData.signaturePizzas?.[0]
                ? { ...mergedData.signaturePizzas[0] }
                : null,
              crust: {
                crustCode:
                  firstCrust?.code ||
                  firstCrust?.crustCode ||
                  firstCrust?.crustName ||
                  firstCrust?.name ||
                  firstCrust?.sideName ||
                  firstCrust?.pizza_crust_name ||
                  "Regular",
                crustName:
                  firstCrust?.crustName || firstCrust?.name || "Regular",
                price: 0,
              },
              crustType: {
                crustTypeCode:
                  firstCrustType?.code ||
                  firstCrustType?.crustTypeCode ||
                  firstCrustType?.crustType ||
                  firstCrustType?.name ||
                  firstCrustType?.label ||
                  "Regular",
                crustTypeName:
                  firstCrustType?.crustType ||
                  firstCrustType?.name ||
                  "Regular",
                price: 0,
              },
              cheese: {
                cheeseCode:
                  firstCheese?.code ||
                  firstCheese?.cheeseCode ||
                  firstCheese?.cheeseName ||
                  firstCheese?.name ||
                  firstCheese?.sideName ||
                  firstCheese?.pizza_cheese_name ||
                  "Regular",
                cheeseName:
                  firstCheese?.cheeseName || firstCheese?.name || "Regular",
                price: 0,
              },
              spicy: {
                spicyCode:
                  firstSpicy?.code ||
                  firstSpicy?.spicyCode ||
                  firstSpicy?.spicy ||
                  firstSpicy?.name ||
                  firstSpicy?.label ||
                  "Normal",
                spicy: firstSpicy?.spicy || firstSpicy?.name || "Normal",
                price: 0,
              },
              sauce: {
                sauceCode:
                  firstSauce?.code ||
                  firstSauce?.sauceCode ||
                  firstSauce?.sauce ||
                  firstSauce?.name ||
                  "Normal",
                sauce: firstSauce?.sauce || firstSauce?.name || "Normal",
                price: 0,
              },
              cook: {
                cookCode:
                  firstCook?.code ||
                  firstCook?.cookCode ||
                  firstCook?.cook ||
                  firstCook?.name ||
                  firstCook?.label ||
                  "Normal",
                cook: firstCook?.cook || firstCook?.name || "Normal",
                price: 0,
              },
              specialBases: {
                specialbaseCode:
                  firstSpecialBase?.code ||
                  firstSpecialBase?.specialBasesCode ||
                  firstSpecialBase?.specialbaseCode ||
                  firstSpecialBase?.specialbaseName ||
                  firstSpecialBase?.name ||
                  firstSpecialBase?.specialBases ||
                  "",
                specialbaseName:
                  firstSpecialBase?.specialbaseName ||
                  firstSpecialBase?.specialBases ||
                  firstSpecialBase?.name ||
                  "None",
                price: 0,
              },
              toppings: {
                countAsTwoToppings: [],
                countAsOneToppings: [],
                freeToppings: toppingsD?.toppings?.freeToppings?.map((t) => ({
                  toppingsCode: t.toppingsCode,
                  toppingsName: t.toppingsName,
                  toppingsPrice: "0",
                  toppingsPlacement: "whole",
                  amount: t.price || "0",
                  pizzaIndex: mergedData.noofPizzas || 0,
                })) || [],
                isAllIndiansTps: true,
              },
            };
          },
        );
        setPizzaState(emptyObjectsArray);
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 500) {
        toast.error(
          error.response.data.message ||
          "An error occurred while fetching Deals.",
        );
      } else {
        // toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // handle Remove Dips
  const handleRemoveDips = (el) => {
    if (numberOfDips > 0 && Dips.length <= 1) {
      toast.warning("At least one dip must be selected.");
      return;
    }
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
        allIngredients={allIngredients}
        pizzaState={pizzaState}
        setPizzaState={setPizzaState}
        activeAccordion={activeAccordion}
        toggleAccordion={toggleAccordion}
      />,
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
      />,
    );
  }

  // Fetching data when the page loads
  const getData = async () => {
    const ing = await fetchData();
    await specialOffersData(ing);
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
        }.`,
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
      let ct = JSON.parse(localStorage.getItem("cart")) || {
        product: [],
      };
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

      let totalDipsPrice = 0;
      calcDipsArr?.forEach((dips) => {
        totalDipsPrice += Number(dips?.totalPrice);
      });
      price += Number(totalDipsPrice);

      // Toppings & Pizza Configurations Price Calculations
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
    pizzaQuantity,
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
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  useEffect(() => {
    let rightSideDiv, footer;

    const handleScroll = () => {
      if (window.innerWidth <= 1024) return; // consistent with CSS

      // Cache DOM elements to avoid repeated queries
      if (!rightSideDiv)
        rightSideDiv = document.querySelector(".right-side-internal-div-new");
      if (!footer) footer = document.querySelector(".main-footer");

      if (!rightSideDiv || !footer) return;

      const scrollY = window.scrollY;
      const rightDivTopOffset =
        rightSideDiv.getBoundingClientRect().top + scrollY;
      const rightDivBottomOffset =
        rightSideDiv.getBoundingClientRect().bottom + scrollY;
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

  // Intermediate state: data is fetched but state mapping/binding is still processing
  if (!specialOfferData || pizzaState.length === 0) {
    return (
      <div>
        <Header />
        <div className="nav-margin"></div>
        <div className="container py-4">
          <div className="row placeholder-glow text-secondary" style={{ opacity: 0.6 }}>
            {/* Mobile Title Skeleton */}
            <div className="col-12 d-lg-none mb-4">
              <span className="placeholder col-8 fs-2 rounded mb-2 d-block bg-secondary"></span>
              <span className="placeholder col-4 fs-4 rounded d-block bg-secondary"></span>
            </div>

            {/* Left Column Skeleton: text and accordions */}
            <div className="col-lg-6 col-12">
              <span className="placeholder col-6 fs-3 rounded mb-3 d-none d-lg-block bg-secondary"></span>
              <span className="placeholder col-12 fs-6 rounded mb-4 d-none d-lg-block bg-secondary" style={{ height: '40px' }}></span>

              <h6 className="mt-3 mb-2 fw-bold" style={{ color: '#888' }}>
                <span className="placeholder col-4 rounded bg-secondary"></span>
              </h6>

              {/* Fake accordion blocks */}
              <div className="placeholder col-12 rounded mb-3 bg-secondary" style={{ height: '70px', borderRadius: '12px' }}></div>
              <div className="placeholder col-12 rounded mb-3 bg-secondary" style={{ height: '70px', borderRadius: '12px' }}></div>
              <div className="placeholder col-12 rounded mb-3 bg-secondary" style={{ height: '70px', borderRadius: '12px' }}></div>
            </div>

            {/* Right Column Skeleton: sidebar image and summary */}
            <div className="col-lg-5 col-12 d-none d-lg-block">
              <div className="p-4 bg-white border" style={{ minHeight: '600px', borderRadius: '12px' }}>
                <div className="placeholder col-12 rounded mb-4 bg-secondary" style={{ height: '350px' }}></div>
                <div className="placeholder col-6 fs-1 rounded mb-4 bg-secondary"></div>
                <div className="placeholder col-12 rounded mb-4 bg-secondary" style={{ height: '50px', borderRadius: '25px' }}></div>
                <hr className="my-4" />
                <div className="placeholder col-12 rounded mb-2 bg-secondary" style={{ height: '20px' }}></div>
                <div className="placeholder col-8 rounded bg-secondary" style={{ height: '20px' }}></div>
              </div>
            </div>

            <div className="col-lg-1"></div>
          </div>
        </div>

      </div>
    );
  }

  if (specialOfferData?.length < 0) return <SPNotFound />;

  // Adapter: bridge SpecialOffer state shape → SummarySidebar props format
  const adaptedSelectedSize = pizzaSizeArr?.find((s) => s.size === size) || null;
  const adaptedPizzaSelections = pizzaState.map((p) => ({
    signaturePizzaCode: p?.signaturePizza?.code || "",
    signaturePizzaName: p?.signaturePizza?.pizzaName || "",
    crust: p?.crust,
    cheese: p?.cheese,
    crustType: p?.crustType,
    specialBases: p?.specialBases,
    sauce: p?.sauce,
    spicy: p?.spicy,
    cook: p?.cook,
    toppings: p?.toppings,
  }));

  return (
    <div>
      <Header />
      <div className="nav-margin"></div>

      <div className="container py-4" id="create-your-own-new">
        <div className="row">

          {/* ── Slim Offer Hero Strip (mobile only) ── */}
          <div className="col-12 d-lg-none mb-3">
            <div className="offer-hero-strip">
              <div className="offer-hero-strip__name">{name}</div>
              <div className="offer-hero-strip__price">${price}</div>
            </div>
          </div>

          {/* ── Pizza Step Indicator (mobile, multi-pizza deals only) ── */}
          {numberOfPizza > 1 && (
            <div className="col-12 d-lg-none mb-3">
              <div className="deal-step-indicator">
                {[...Array(numberOfPizza)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`deal-step-dot ${activeAccordion === `pizza-${i}` ? "deal-step-dot--active" : ""}`}
                    onClick={() => toggleAccordion(`pizza-${i}`)}
                    aria-label={`Pizza ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── LEFT — configuration column ── */}
          <div className="col-lg-6 col-12">
            <h5 className="fw-bold d-none d-lg-block mb-1">{name}</h5>
            {pizzaSubtitle && (
              <p className={`mb-3 fs-6 ${specialOfferDealType === "pickupdeal" ? "pickup-deal-style" : ""}`}>
                {pizzaSubtitle}
              </p>
            )}

            {/* SIZE — modern SizeSelector component */}
            <SizeSelector
              pizzaPrices={pizzaSizeArr?.filter((p) => parseFloat(p.price) > 0)}
              selectedSize={adaptedSelectedSize}
              onSelectSize={(s) => setSize(s?.size)}
            />

            <h6 className="mt-3 mb-2 fw-bold" style={{ letterSpacing: "0.06em", fontSize: "0.8rem", color: "#888" }}>
              CUSTOMIZE YOUR DEAL
            </h6>

            {/* Existing pizza accordion configs — untouched */}
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

          {/* ── RIGHT — desktop summary sidebar ── */}
          <div className="col-lg-5 col-12 d-none d-lg-block">


            <SummarySidebar
              selectedSize={adaptedSelectedSize}
              offerData={specialOfferData}
              pizzaSelections={adaptedPizzaSelections}
              selectedSide={Sides}
              selectedDips={calcDipsArr}
              selectedDrink={Drinks}
              onAddToCart={handleAddToCart}
              totalPrice={price}
              quantity={pizzaQuantity}
              setQuantity={setPizzaQuantity}
              isEditMode={false}
              handleOpenSummaryPopup={() => setViewSelection(true)}
            />
            {specialOfferData?.noofToppings > 0 && (() => {
              const totalToppingsLimit = Number(specialOfferData.noofToppings || 0);
              const totalSelected = pizzaState.reduce((acc, pizza) => {
                return (
                  acc +
                  (pizza?.toppings?.countAsOneToppings?.length || 0) +
                  (pizza?.toppings?.countAsTwoToppings?.length || 0) * (premiumToppingCount || 1)
                );
              }, 0);
              const freeUsed = Math.min(totalSelected, totalToppingsLimit);
              const additional = Math.max(0, totalSelected - totalToppingsLimit);
              return (
                <div className="p-3 mt-3 bg-white" style={{ borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold fs-6 text-dark">Free Toppings:</span>
                    <span className="fw-bold" style={{ color: 'var(--primary, #2d7a2d)' }}>
                      {freeUsed} / {totalToppingsLimit}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-6 text-dark">Additional Toppings:</span>
                    <span className={`fw-bold ${additional > 0 ? "text-danger" : "text-secondary"}`}>
                      {additional}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="col-lg-1"></div>
        </div>
      </div>

      {/* ── Mobile Sticky Bottom Add-to-Cart Bar ── */}
      <div className="cust-mobile-sticky d-lg-none">
        <div className="cust-mobile-sticky__price">
          <div className="cust-mobile-sticky__label">Total</div>
          <div className="cust-mobile-sticky__amount">${price}</div>
        </div>
        <div className="cust-mobile-sticky__qty">
          <button
            className="cust-mobile-sticky__qty-btn"
            disabled={pizzaQuantity <= 1}
            onClick={() => setPizzaQuantity((prev) => Math.max(1, prev - 1))}
            aria-label="Decrease Quantity"
          >
            <FaMinus size={12} />
          </button>
          <span className="cust-mobile-sticky__qty-num">{pizzaQuantity}</span>
          <button
            className="cust-mobile-sticky__qty-btn"
            disabled={pizzaQuantity >= 10}
            onClick={() => setPizzaQuantity((prev) => Math.min(10, prev + 1))}
            aria-label="Increase Quantity"
          >
            <FaPlus size={12} />
          </button>
        </div>
        <button className="cust-mobile-sticky__add" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      <DealsViewSelectionModal
        viewSelection={viewSelection}
        setViewSelection={() => setViewSelection(false)}
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
        pizzaState={pizzaState}
        specialOfferData={specialOfferData}
      />


    </div>
  );
}

export default SpecialOffer;
