import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import CartFunction from "../../components/cart";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import {
  getDips,
  getSpecialDetails,
  getSignaturePizza,
  getToppings,
  getAllIngredients,
  settingApi,
} from "../../services";
import { calculateOfferPrice } from "../../utils/priceUtils";
import DipsSelector from "./components/DipsSelector";
import DrinkSelector from "./components/DrinkSelector";
import PizzaCustomizerAccordion from "./components/PizzaCustomizerAccordion";
import SideSelector from "./components/SideSelector";
import SizeSelector from "./components/SizeSelector";
import SummaryModal from "./components/SummaryModal";
import SummarySidebar from "./components/SummarySidebar";
import SummaryTop from "./components/SummaryTop";
import { FaMinus, FaPlus } from "react-icons/fa";

const SpecialOfferPage = () => {
  const { sid } = useParams();
  const navigate = useNavigate();
  // Load Global Context
  const globalCtx = useContext(GlobalContext);

  // Global Context Variables
  const [cart, setCart] = globalCtx.cart;
  const [currentStoreCode, setCurrentStoreCode] = globalCtx.currentStoreCode;
  const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
  const [settings, setSettings] = globalCtx.settings;

  // Cart function
  const cartFn = new CartFunction();

  // States in Special Offers
  const [loading, setLoading] = useState(true);
  const [confSettings, setConfSettings] = useState(null);
  const [toppings, setToppings] = useState(null);
  const [dips, setDips] = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [pricings, setPricings] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pizzaSelections, setPizzaSelections] = useState([]);
  const [selectedSide, setSelectedSide] = useState({});
  const [selectedDrink, setSelectedDrink] = useState({});
  const [selectedDips, setSelectedDips] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [quantity, setQuantity] = useState(1);
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);
  const [allSignaturePizzas, setAllSignaturePizzas] = useState([]);
  const [activePizzaIndex, setActivePizzaIndex] = useState(0);

  useEffect(() => {
    fetchOfferDetailsWithSettings();
  }, []);

  const handleUpdateCustomization = (pizzaIndex, field, value) => {
    setPizzaSelections((prev) => {
      const updated = [...prev];
      updated[pizzaIndex] = {
        ...updated[pizzaIndex],
        [field]: value,
      };
      return updated;
    });
  };

  useEffect(() => {
    if (!offerData || !selectedSize) return;
    const total = calculateOfferPrice({
      offerData,
      selectedSize,
      pizzaSelections,
      selectedDips,
    });
    setTotalPrice(total);
  }, [
    offerData,
    selectedSize,
    selectedSide,
    selectedDrink,
    selectedDips,
    pizzaSelections,
  ]);

  const fetchOfferDetailsWithSettings = async () => {
    try {
      const [
        specialOfferResponse,
        settingsResponse,
        toppingsResponse,
        dipsResponse,
        signaturePizzasResponse,
        ingredientsResponse,
      ] = await Promise.all([
        getSpecialDetails(sid, currentStoreCode),
        settingApi(),
        getToppings(),
        getDips(),
        getSignaturePizza(),
        getAllIngredients(),
      ]);
      console.log("ingredientsResponse", ingredientsResponse);
      let specialOfferData = specialOfferResponse.data;
      // Handle case where API returns array for single item
      if (Array.isArray(specialOfferData) && specialOfferData.length > 0) {
        specialOfferData = specialOfferData[0];
      }

      const settingsData = settingsResponse.data;
      const toppingsData = toppingsResponse.data.toppings;
      const dipsData = dipsResponse.data;
      const fetchedSignaturePizzas = Array.isArray(signaturePizzasResponse)
        ? signaturePizzasResponse
        : signaturePizzasResponse?.data || [];
      setAllSignaturePizzas(fetchedSignaturePizzas);

      // Ensure signaturePizzas is available in specialOfferData for the component
      const offerSignaturePizzas = Array.isArray(
        specialOfferData.signaturePizzas,
      )
        ? specialOfferData.signaturePizzas
        : specialOfferData.signaturePizzas?.data || [];

      if (offerSignaturePizzas.length === 0) {
        specialOfferData.signaturePizzas = fetchedSignaturePizzas;
      } else {
        specialOfferData.signaturePizzas = offerSignaturePizzas;
      }

      const ingredientsData = ingredientsResponse?.data || ingredientsResponse;
      const allIng = Array.isArray(ingredientsData) ? {} : ingredientsData;

      // Merge global ingredients if offer doesn't provide specific lists
      if (!specialOfferData.cheese || specialOfferData.cheese.length === 0)
        specialOfferData.cheese = allIng.cheese || [];
      if (!specialOfferData.crust || specialOfferData.crust.length === 0)
        specialOfferData.crust = allIng.crust || [];
      if (
        !specialOfferData.crustType ||
        specialOfferData.crustType.length === 0
      )
        specialOfferData.crustType = allIng.crustType || [];
      if (
        !specialOfferData.specialbases ||
        specialOfferData.specialbases.length === 0
      )
        specialOfferData.specialbases = allIng.specialbases || [];
      if (!specialOfferData.sauce || specialOfferData.sauce.length === 0)
        specialOfferData.sauce = allIng.sauce || [];
      if (!specialOfferData.spices || specialOfferData.spices.length === 0)
        specialOfferData.spices = allIng.spices || [];
      if (!specialOfferData.cook || specialOfferData.cook.length === 0)
        specialOfferData.cook = allIng.cook || [];
      const systemsettings = {
        premiumToppingsCount:
          settingsData.find((s) => s.shortCode === "non-regular-toppings-count")?.settingValue ??
          1,
        premiumTopppingLabel:
          settingsData.find((s) => s.shortCode === "non-regular-toppings")?.settingValue ??
          "Premium Toppings",
        regularToppingLabel:
          settingsData.find((s) => s.shortCode === "regular-toppings")?.settingValue ??
          "Regular Toppings",
      };
      const signaturePizza =
        specialOfferData?.signaturePizzas?.length > 0
          ? specialOfferData?.signaturePizzas[0]
          : null;
      const emptySelections = Array.from({
        length: parseInt(specialOfferData.noofPizzas),
      }).map(() => {
        return {
          signature: null,
          signaturePizzaCode: "",
          signaturePizzaName: "",
          cheese: null,
          crust: null,
          crustType: null,
          specialBases: null,
          sauce: null,
          spicy: null,
          cook: null,
          toppings: {
            countAsTwoToppings: [],
            countAsOneToppings: [],
            freeToppings: [],
          },
          isAllIndiansTps: true,
        };
      });
      /* ---------- Default Settings ---------- */
      setConfSettings(systemsettings);
      /* ---------- All Toppings ---------- */
      setToppings(toppingsData);
      /* ---------- All Dips ---------- */
      setDips(dipsData);
      /* ---------- Default Selected Size ---------- */
      if (specialOfferData.pizza_prices?.length > 0) {
        const allPrices = specialOfferData.pizza_prices.filter(
          (p) => Number(p.price) > Number(0),
        );
        setPricings(allPrices);
        setSelectedSize(allPrices[0]);
      }
      /* ---------- Default Pizza Selections ---------- */
      setPizzaSelections(emptySelections);
      /* ---------- Special Offer Data ---------- */
      setOfferData(specialOfferData);
      /* ---------- Default Sides ---------- */
      if (specialOfferData?.freesides?.length > 0) {
        const firstSide = specialOfferData.freesides[0];
        const firstLine = firstSide.lineEntries?.[0] || {};
        setSelectedSide([
          {
            sideCode: firstSide.code,
            sideName: firstSide.sideName,
            sideType: firstSide.type ?? "side",
            lineCode: firstLine.code ?? "",
            sidePrice: Number("0.00"),
            sideSize: firstLine.size ?? "",
            quantity: 1,
            totalPrice: Number("0.00"),
          },
        ]);
      }
      /* ---------- Default Drink ---------- */
      const combinedDrinks = [
        ...(specialOfferData.pops || []),
        ...(specialOfferData.bottle || []),
      ];
      if (combinedDrinks.length > 0) {
        const firstDrink = combinedDrinks[0];
        setSelectedDrink([
          {
            drinksCode: firstDrink.code,
            drinksName: firstDrink.softDrinkName,
            quantity: 1,
            drinksPrice: Number("0.00"),
            totalPrice: Number("0.00"),
          },
        ]);
      }
      /* ---------- Default Dips ---------- */
      if (Number(specialOfferData.noofDips) > 0 && dipsData?.length > 0) {
        const firstDip = dipsData[0];
        setSelectedDips([
          {
            dipsCode: firstDip.dipsCode,
            dipsName: firstDip.dipsName,
            quantity: specialOfferData.noofDips,
            dipsPrice: Number(firstDip.price),
            freeQuantity: specialOfferData.noofDips,
            paidQuantity: 0,
            dipsPrice: Number(firstDip.price),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching offer details:", error);
    } finally {
      setLoading(false);
    }
  };

  /* all events */
  const handleSelectSignaturePizza = (pizzaIndex, pizzaObj) => {
    const findDefault = (globalList, defaultItem) => {
      if (!globalList || !defaultItem) return null;
      return globalList.find((x) => x.code === defaultItem.code) || null;
    };

    setPizzaSelections((prev) => {
      const updated = [...prev];
      updated[pizzaIndex] = {
        ...updated[pizzaIndex],
        //signature: pizzaObj,
        signaturePizzaCode: "",
        signaturePizzaName: "",
        crust: findDefault(offerData.crust, pizzaObj.defaultCrust),
        cheese: findDefault(offerData.cheese, pizzaObj.defaultCheese),
        crustType: findDefault(offerData.crustType, pizzaObj.defaultCrustType),
        specialBases: findDefault(
          offerData.specialbases,
          pizzaObj.defaultSpecialBase,
        ),
        sauce: findDefault(offerData.sauce, pizzaObj.defaultSauce),
        spicy: findDefault(offerData.spices, pizzaObj.defaultSpices),
        cook: findDefault(offerData.cook, pizzaObj.defaultCook),
        toppings: {
          countAsTwoToppings: [],
          countAsOneToppings: [],
          freeToppings: [],
        },
        isAllIndiansTps: true,
      };
      return updated;
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (currentStoreCode === undefined || currentStoreCode === null) {
      setShowStorePopup(true);
      toast.error("Please select a store to start adding items to the cart..", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!offerData || !pizzaSelections.length) {
      toast.error("Please select a pizza before adding to cart.");
      return;
    }

    const hasMissingSignature = pizzaSelections.some(
      (pizza) =>
        !pizza.signaturePizzaCode || pizza.signaturePizzaCode.trim() === "",
    );

    if (hasMissingSignature) {
      toast.error(
        "Please select the pizzas from the list and customize them before adding to cart.",
      );
      return;
    }

    if (offerData.noofDips > 0 && !selectedDips?.length) {
      toast.error("Please add dips before adding to cart.");
      return;
    }

    const total = parseFloat(totalPrice);
    const totalAmount = (total * quantity).toFixed(2);

    // Build the product object
    const payload = {
      id: uuidv4(),
      productCode: offerData.code,
      productName: offerData.name,
      productType: "special_pizza",
      config: {
        pizza: pizzaSelections.map((pizza, index) => ({
          ...pizza,
          pizzaIndex: index,
        })),
        sides: selectedSide ? selectedSide : [],
        dips: selectedDips ? selectedDips : [],
        drinks: selectedDrink ? selectedDrink : [],
      },
      quantity: quantity,
      price: total,
      amount: totalAmount,
      pizzaSize: selectedSize != null ? selectedSize?.size : "Small",
      pizzaPrice: selectedSize?.price,
      comments: "",
    };

    if (payload) {
      let ct = JSON.parse(localStorage.getItem("cart")) || {
        product: [],
      };
      // Ensure ct.product exists
      if (!ct.product) {
        ct.product = [];
      }
      ct.product.push(payload);
      const cartProduct = ct.product;
      cartFn.addCart(cartProduct, setCart, false, settings);
      navigate("/addtocart");
    }
  };

  const toggleSummaryModal = (e) => {
    setShowSummaryPopup((prev) => !prev);
  };

  if (loading) {
    return <LoadingLayout />;
  }

  if (!offerData) {
    toast.error(
      "Unable to load offer details. Could you please check out our menu?",
      {
        position: "top-center",
        autoClose: 3000,
      },
    );
    return null; // ← guard: prevents destructuring null on line below
  }

  const { noofPizzas = 0 } = offerData;
  const signaturePizzas =
    offerData.signaturePizzas && offerData.signaturePizzas.length > 0
      ? offerData.signaturePizzas
      : allSignaturePizzas;

  return (
    <div>
      <Header />
      <div className="nav-margin"></div>
      <div className="container py-2 has-sticky-cart-bar">
        <div className="row">
          {/* Slim Offer Hero Strip (replaces old SummaryTop on mobile) */}
          <div className="col-12 d-lg-none mb-3">
            <div className="offer-hero-strip">
              <div className="offer-hero-strip__name">{offerData.name}</div>
              <div className="offer-hero-strip__price">${totalPrice}</div>
            </div>
          </div>

          {/* Pizza Step Indicator (mobile) */}
          {parseInt(noofPizzas) > 1 && (
            <div className="col-12 d-lg-none mb-3">
              <div className="deal-step-indicator">
                {[...Array(parseInt(noofPizzas))].map((_, i) => {
                  const done = !!pizzaSelections[i]?.signaturePizzaCode;
                  const active = activePizzaIndex === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`deal-step-dot ${
                        active ? 'deal-step-dot--active' : done ? 'deal-step-dot--done' : ''
                      }`}
                      data-index={i + 1}
                      onClick={() => setActivePizzaIndex(i)}
                      aria-label={`Pizza ${i + 1}`}
                    >
                      {done && !active ? <i className="bi bi-check2" /> : null}
                    </button>
                  );
                })}
                <div className="deal-step-label">
                  Pizza {activePizzaIndex + 1} of {noofPizzas}
                </div>
              </div>
            </div>
          )}

          {/* LEFT SIDE */}
          <div className="col-lg-6 col-12">
            <h5 className="fw-bold d-none d-lg-block mb-3">{offerData.name}</h5>

            {/* SIZE SELECTOR */}
            <SizeSelector
              pizzaPrices={pricings}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            <h6 className="mt-3 mb-1 fw-bold" style={{ letterSpacing: '0.06em', fontSize: '0.8rem', color: '#888' }}>CUSTOMIZE YOUR PIZZAS</h6>

            {[...Array(parseInt(noofPizzas))].map((_, index) => (
              <PizzaCustomizerAccordion
                key={`pizza-${index}`}
                index={index}
                totalPizzas={parseInt(noofPizzas)}
                isActive={activePizzaIndex === index}
                onSetActive={setActivePizzaIndex}
                onNext={() => setActivePizzaIndex(prev => Math.min(prev + 1, parseInt(noofPizzas) - 1))}
                onBack={() => setActivePizzaIndex(prev => Math.max(prev - 1, 0))}
                settings={confSettings}
                toppings={toppings}
                offerData={offerData}
                signaturePizzas={signaturePizzas}
                pizzaSelections={pizzaSelections[index]}
                onSelectSignaturePizza={handleSelectSignaturePizza}
                onUpdateCustomization={handleUpdateCustomization}
                isEditMode={false}
              />
            ))}

            {/* SIDES & DRINKS SECTION */}
            <SideSelector
              sides={offerData.freesides ?? []}
              selectedSide={selectedSide}
              onSelect={setSelectedSide}
            />

            <DrinkSelector
              pops={offerData.pops ?? []}
              bottle={offerData.bottle ?? []}
              selectedDrink={selectedDrink}
              onSelect={setSelectedDrink}
            />

            <DipsSelector
              dips={dips}
              freeLimit={Number(offerData.noofDips) ?? 0}
              selected={selectedDips}
              onChange={setSelectedDips}
            />
          </div>

          {/* DESKTOP SUMMARY */}
          <div className="col-lg-5 col-12 d-none d-lg-block">
            <SummarySidebar
              selectedSize={selectedSize}
              offerData={offerData}
              pizzaSelections={pizzaSelections}
              selectedSide={selectedSide}
              selectedDips={selectedDips}
              selectedDrink={selectedDrink}
              onAddToCart={handleAddToCart}
              totalPrice={totalPrice}
              quantity={quantity}
              setQuantity={setQuantity}
              isEditMode={false}
              handleOpenSummaryPopup={toggleSummaryModal}
            />
          </div>

          <div className="col-lg-1"></div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Add-to-Cart Bar */}
      <div className="cust-mobile-sticky d-lg-none">
        <div className="cust-mobile-sticky__price">
          <div className="cust-mobile-sticky__label">Total</div>
          <div className="cust-mobile-sticky__amount">${(parseFloat(totalPrice) * quantity).toFixed(2)}</div>
        </div>
        <div className="cust-mobile-sticky__qty">
          <button
            className="cust-mobile-sticky__qty-btn"
            disabled={quantity <= 1}
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            aria-label="Decrease Quantity"
          >
            <FaMinus size={12} />
          </button>
          <span className="cust-mobile-sticky__qty-num">{quantity}</span>
          <button
            className="cust-mobile-sticky__qty-btn"
            disabled={quantity >= 10}
            onClick={() => setQuantity(q => Math.min(10, q + 1))}
            aria-label="Increase Quantity"
          >
            <FaPlus size={12} />
          </button>
        </div>
        <button className="cust-mobile-sticky__add" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      <Footer />

      <SummaryModal
        modalState={showSummaryPopup}
        totalPrice={totalPrice}
        selectedSize={selectedSize}
        offerData={offerData}
        pizzaSelections={pizzaSelections}
        selectedSide={selectedSide}
        selectedDips={selectedDips}
        selectedDrink={selectedDrink}
        toggleSummaryModal={toggleSummaryModal}
      />
    </div>
  );
};

export default SpecialOfferPage;
