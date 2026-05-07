import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import CartFunction from "../../components/cart";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import {
  getAllIngredients,
  getDips,
  getSpecialOfferNew,
  getToppings,
  settingApi,
} from "../../services";
import { calculateOfferPrice } from "../../utils/priceUtils";
import DipsSelector from "./components/DipsSelector";
import DrinkSelector from "./components/DrinkSelector";
import FixedCartSection from "./components/FixedCartSection";
import PizzaCustomizerAccordion from "./components/PizzaCustomizerAccordion";
import SideSelector from "./components/SideSelector";
import SizeSelector from "./components/SizeSelector";
import SummaryModal from "./components/SummaryModal";
import SummarySidebar from "./components/SummarySidebar";
import SummaryTop from "./components/SummaryTop";

const EditSpecialOfferPage = () => {
  const { pid, sid } = useParams(); // Get itemId from route

  const navigate = useNavigate();

  // Load Global Context
  const globalCtx = useContext(GlobalContext);

  const printLogs = false;

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
  console.log("offerData", offerData);
  const [pricings, setPricings] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pizzaSelections, setPizzaSelections] = useState([]);
  const [selectedSide, setSelectedSide] = useState({});
  const [selectedDrink, setSelectedDrink] = useState({});
  const [selectedDips, setSelectedDips] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [quantity, setQuantity] = useState(1);
  const [cartItemToEdit, setCartItemToEdit] = useState(null);
  console.log("cartItemToEdit", cartItemToEdit);
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);
  const [settingsData, setSettingsData] = useState([]);
  const specialOfferTitle =
    settingsData.find((item) => item.shortCode === "specialoffer")?.settingValue ??
    "Special Offer";

  useEffect(() => {
    // Get cart item from localStorage using itemId
    const ct = JSON.parse(localStorage.getItem("cart")) || { product: [] };
    console.log("ct", ct);
    const foundItem = ct.product.find((item) => item.id === sid);
    console.log("foundItem", foundItem);

    if (!foundItem) {
      toast.error("Cart item not found. Redirecting to menu...");
      navigate("/menu");
      return;
    }

    setCartItemToEdit(foundItem);
    fetchOfferDetailsWithSettings(foundItem);
  }, [sid]);

  const handleUpdateCustomization = (index, field, value) => {
    setPizzaSelections((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
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

  const fetchOfferDetailsWithSettings = async (cartItem) => {
    console.log("cartItem11", cartItem);
    try {
      const [
        specialOfferResponse,
        settingsResponse,
        toppingsResponse,
        dipsResponse,
        ingredientsResponse
      ] = await Promise.all([
        getSpecialOfferNew(pid),
        settingApi(),
        getToppings(),
        getDips(),
        getAllIngredients(),
      ]);

      console.log('ingredientsResponse', ingredientsResponse);
      // console.log("SignaturePizzaList", SignaturePizzaListResponse);
      console.log("specialOfferResponse", specialOfferResponse);
      // const specialOfferData = specialOfferResponse.data.find(
      //   (s) => s.code == "SPO_18",
      // );
      const specialOfferData = specialOfferResponse.data;
      console.log("specialOfferData", specialOfferData);
      const settingsData = settingsResponse.data;
      setSettingsData(settingsData);
      const toppingsData = toppingsResponse.data.toppings;
      const dipsData = dipsResponse.data;
      const ingredientsData = ingredientsResponse.data;
      // console.log('ingredientsData', ingredientsData);

      // console.log("specialOfferData", specialOfferData);
      // console.log("settingsData", settingsData);
      // console.log("toppingsData", toppingsData);
      // console.log("dipsData", dipsData);

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
        indianStyleToppingsLabel:
          settingsData.find((s) => s.shortCode === "indian-style-toppings")?.settingValue ??
          "Indian Style",
      };

      const enrichedOfferData = {
        ...specialOfferData,
        cheese: ingredientsData.cheese || [],
        crust: ingredientsData.crust || [],
        crustType: ingredientsData.crustType || [],
        specialbases: ingredientsData.specialbases || [],
        cook: ingredientsData.cook || [],
        sauce: ingredientsData.sauce || [],
        spices: ingredientsData.spices || [],
      };
      console.log('enrichedOfferData', enrichedOfferData)

      /* ---------- Set Configuration ---------- */
      setConfSettings(systemsettings);
      setToppings(toppingsData);
      setDips(dipsData);
      setOfferData(enrichedOfferData);
      let allPrices = [];
      console.log("allPrices", allPrices);
      if (enrichedOfferData.pizza_prices?.length > 0) {
        allPrices = enrichedOfferData.pizza_prices.filter(
          (p) => Number(p.price) > Number(0),
        );
        setPricings(allPrices);
      }

      /* ---------- Pre-populate from Cart Item ---------- */
      if (cartItem) {
        // Set Size
        const sizeFromCart =
          specialOfferData.pizza_prices.find(
            (p) => p.size === cartItem.pizzaSize,
          ) || allPrices[0];

        setSelectedSize(sizeFromCart);

        // Set Pizza Selections
        if (cartItem.config?.pizza) {
          setPizzaSelections(cartItem.config.pizza);
        }

        // Set Sides
        // if (cartItem.config?.sides?.length > 0) {
        //   setSelectedSide(cartItem.config.sides[0]);
        // }
        if (cartItem.config?.sides) {
          const sidesData = Array.isArray(cartItem.config.sides)
            ? cartItem.config.sides
            : [cartItem.config.sides];

          setSelectedSide(sidesData);
        }

        // Set Drinks
        // if (cartItem.config?.drinks?.length > 0) {
        //   setSelectedDrink(cartItem.config.drinks[0]);
        // }
        if (cartItem.config?.drinks) {
          const drinkData = Array.isArray(cartItem.config.drinks)
            ? cartItem.config.drinks
            : [cartItem.config.drinks];

          setSelectedDrink(drinkData);
        }

        // Set Dips
        if (cartItem.config?.dips?.length > 0) {
          setSelectedDips(cartItem.config.dips);
        }

        // Set Quantity
        setQuantity(cartItem.quantity || 1);
      }
    } catch (error) {
      // console.error("Error fetching offer details:", error);
      toast.error("Failed to load offer details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCart = (e) => {
    e.preventDefault();

    if (currentStoreCode === undefined || currentStoreCode === null) {
      setShowStorePopup(true);
      toast.error("Please select a store to start adding items to the cart.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!offerData || !pizzaSelections.length) {
      toast.error("Please select a pizza before updating cart.");
      return;
    }

    const hasMissingSignature = pizzaSelections.some(
      (pizza) =>
        !pizza.signaturePizzaCode || pizza.signaturePizzaCode.trim() === "",
    );

    if (hasMissingSignature) {
      toast.error(
        "Please select a signature pizza for all pizzas before updating cart.",
      );
      return;
    }

    if (offerData.noofDips > 0 && !selectedDips?.length) {
      toast.error("Please add dips before updating cart.");
      return;
    }

    const total = parseFloat(totalPrice);
    const totalAmount = (total * quantity).toFixed(2);

    // Build the updated product object
    const updatedPayload = {
      ...cartItemToEdit, // Keep the same ID and other properties
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
      pizzaPrice: total,
      comments: cartItemToEdit.comments || "",
    };

    // Update cart in localStorage
    let ct = JSON.parse(localStorage.getItem("cart")) || { product: [] };
    // Find and replace the item
    console.log('ct123', ct);
    const itemIndex = ct.product.findIndex(
      (item) => item.id === cartItemToEdit.id,
    );

    if (itemIndex !== -1) {
      ct.product[itemIndex] = updatedPayload;
    } else {
      // If not found (shouldn't happen), add it
      ct.product.push(updatedPayload);
    }

    const cartProduct = ct.product;
    cartFn.addCart(cartProduct, setCart, false, settings);

    navigate("/menu");
  };

  const toggleSummaryModal = (e) => {
    e.preventDefault();
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
        onClose: () => {
          navigate("/menu");
        },
      },
    );
    return null;
  }

  // check thissssssss tommorows
  const { noofPizzas, signaturePizzas } = offerData;
  // const { signaturePizzas } = SignaturePizzaList;
  // const { noofPizzas, signaturePizzas } = cartItemToEdit;
  console.log("signaturePizzas", signaturePizzas);
  console.log("noofPizzas", cartItemToEdit);
  console.log("offerData", offerData);

  return (
    <div>
      <Header />
      <div className="nav-margin"></div>
      <div className="container py-4">
        {/* Edit Mode Banner */}
        <div className="alert alert-info mb-3 d-none" role="alert">
          <i className="bi bi-pencil-square me-2"></i>
          <strong>Edit Mode:</strong> You are editing an existing cart item
        </div>

        <div className="row">
          {/* MOBILE & TABLET SUMMARY (Visible up to 1023px) */}
          <div className="col-12 d-lg-none mb-4">
            <SummaryTop
              offerData={offerData}
              pizzaSelections={pizzaSelections}
              onAddToCart={handleUpdateCart}
              totalPrice={totalPrice}
              quantity={quantity}
              setQuantity={setQuantity}
              isEditMode={true}
              handleOpenSummaryPopup={toggleSummaryModal}
            />
          </div>

          {/* LEFT SIDE */}
          <div className="col-lg-6 col-md-12 col-12">
            <p className="fs-5 mb-0 text-secondary">{specialOfferTitle}</p>
            <h5 className="fw-bold d-none d-lg-block mb-3">{offerData.name}</h5>

            {/* SIZE SELECTOR */}
            <SizeSelector
              pizzaPrices={pricings}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            <h6 className="mt-4 fw-bold">CUSTOMIZE</h6>
            <p className="text-muted">
              Select any and customize as you like from our special pizzas.
            </p>

            {[...Array(parseInt(noofPizzas) || 0)].map((_, index) => (
              <PizzaCustomizerAccordion
                key={`pizza-${index}`}
                index={index}
                settings={confSettings}
                toppings={toppings}
                offerData={offerData}
                signaturePizzas={signaturePizzas}
                pizzaSelections={pizzaSelections[index]}
                onUpdateCustomization={handleUpdateCustomization}
                isEditMode={true}
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

          {/* DESKTOP SUMMARY (Visible from 1024px) */}
          <div className="col-lg-5 col-md-5 d-none d-lg-block">
            <SummarySidebar
              selectedSize={selectedSize}
              offerData={offerData}
              pizzaSelections={pizzaSelections}
              selectedSide={selectedSide}
              selectedDips={selectedDips}
              selectedDrink={selectedDrink}
              onAddToCart={handleUpdateCart}
              totalPrice={totalPrice}
              quantity={quantity}
              setQuantity={setQuantity}
              isEditMode={true}
              handleOpenSummaryPopup={toggleSummaryModal}
            />
          </div>

          <div className="col-lg-1"></div>
        </div>
      </div>

      <FixedCartSection
        onAddToCart={handleUpdateCart}
        totalPrice={totalPrice}
        quantity={quantity}
        section={"Update Cart"}
      />

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

export default EditSpecialOfferPage;
