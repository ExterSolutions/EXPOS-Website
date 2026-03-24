import { useState, useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { GlobalContext } from "../../../context/GlobalContext";
import OptionSheet from "../OptionSheet";
import ToppingSheet from "../ToppingSheet";
// Special offer topping selectors (different API shape than Signature)
import ToppingsTwoComponent from "./Configurations/Toppings/ToppingsTwo";
import ToppingsOneComponent from "./Configurations/Toppings/ToppingsOne";
import ToppingsFreeComponent from "./Configurations/Toppings/ToppingsFree";


// ─── Local helpers ──────────────────────────────────────────────────────────

/**
 * Extracts a stable ID from an ingredient option
 * (the backend uses multiple possible id fields across endpoints).
 */
function getOptionId(item) {
    return (
        item?.code ||
        item?.cheeseCode ||
        item?.crustCode ||
        item?.crustTypeCode ||
        item?.sauceCode ||
        item?.spicyCode ||
        item?.cookCode ||
        item?.specialbaseCode ||
        item?.name ||
        ""
    );
}

/** Converts an array of ingredient objects to { id, label, price } */
function toOptions(arr = [], labelKey) {
    return arr.map((item) => ({
        id: getOptionId(item),
        label: item?.[labelKey] || item?.name || item?.label || getOptionId(item),
        price: Number(item?.price || 0),
    }));
}

// ─── Trigger button (same look as "Choose Toppings" on Signature page) ──────

function TriggerBtn({ icon, label, value, onClick }) {
    return (
        <button className="topping-trigger-btn" onClick={onClick} type="button">
            <span className="topping-trigger-btn__icon">{icon}</span>
            <span className="topping-trigger-btn__label">{label}</span>
            {value && (
                <span className="topping-trigger-btn__count">{value}</span>
            )}
            <span className="topping-trigger-btn__arrow">›</span>
        </button>
    );
}

// ─── Toppings wrapper (adapts SpecialOffer data shape → ToppingSheet) ────────

function SpecialToppingSheet({ isOpen, onClose, count, pizzaState, setPizzaState, toppingsData, noofToppings }) {
    const { settings } = useContext(GlobalContext);
    const settingsData = settings?.[0];

    const nonRegularToppingsTitle =
        settingsData?.find((s) => s.shortCode === "non-regular-toppings")?.settingValue || "Premium";
    const regularToppingsTitle =
        settingsData?.find((s) => s.shortCode === "regular-toppings")?.settingValue || "Regular";
    const premiumToppingCount = Number(
        settingsData?.find((s) => s.shortCode === "non-regular-toppings-count")?.settingValue || 1,
    );

    // Pull current selections for this pizza slot
    const ToppingsTwo = pizzaState[count]?.toppings?.countAsTwoToppings || [];
    const ToppingsOne = pizzaState[count]?.toppings?.countAsOneToppings || [];
    const ToppingsFreeSelected = pizzaState[count]?.toppings?.freeToppings || [];

    const [activeTab, setActiveTab] = useState("two");

    // Fake Ingredients object to be compatible with ToppingSheet API
    const Ingredients = {
        toppings: {
            countAsTwo: toppingsData?.toppings?.countAsTwo || [],
            countAsOne: toppingsData?.toppings?.countAsOne || [],
            freeToppings: toppingsData?.toppings?.freeToppings || [],
        },
    };

    // These wrappers bridge the ToppingSheet API to SpecialOffer's setPizzaState
    const handleToppingsTwo = ({ code, name, price, type, size }) => {
        setPizzaState((prev) => {
            const state = [...prev];
            const existing = state[count].toppings.countAsTwoToppings;
            const exists = existing.some((t) => t.toppingsCode === code);
            const updated = exists
                ? existing.filter((t) => t.toppingsCode !== code)
                : [...existing, { toppingsCode: code, toppingsName: name, toppingsPrice: price, toppingsPlacement: size || "whole" }];
            state[count] = { ...state[count], toppings: { ...state[count].toppings, countAsTwoToppings: updated } };
            return state;
        });
    };

    const handleToppingOne = ({ code, name, price, type, size }) => {
        setPizzaState((prev) => {
            const state = [...prev];
            const existing = state[count].toppings.countAsOneToppings;
            const exists = existing.some((t) => t.toppingsCode === code);
            const updated = exists
                ? existing.filter((t) => t.toppingsCode !== code)
                : [...existing, { toppingsCode: code, toppingsName: name, toppingsPrice: price, toppingsPlacement: size || "whole" }];
            state[count] = { ...state[count], toppings: { ...state[count].toppings, countAsOneToppings: updated } };
            return state;
        });
    };

    const handleFreeToppings = ({ code, name, price, type, size }) => {
        setPizzaState((prev) => {
            const state = [...prev];
            const existing = state[count].toppings.freeToppings;
            const exists = existing.some((t) => t.toppingsCode === code);
            const updated = exists
                ? existing.filter((t) => t.toppingsCode !== code)
                : [...existing, { toppingsCode: code, toppingsName: name, toppingsPrice: "0", toppingsPlacement: size || "whole", amount: price, pizzaIndex: count }];
            state[count] = { ...state[count], toppings: { ...state[count].toppings, freeToppings: updated } };
            return state;
        });
    };

    const handleSizeChange = ({ code, name, price, type, size }) => {
        const key = type === "two" ? "countAsTwoToppings" : type === "one" ? "countAsOneToppings" : "freeToppings";
        setPizzaState((prev) => {
            const state = [...prev];
            const updated = state[count].toppings[key].map((t) =>
                t.toppingsCode === code ? { ...t, toppingsPlacement: size } : t
            );
            state[count] = { ...state[count], toppings: { ...state[count].toppings, [key]: updated } };
            return state;
        });
    };

    const ToppingTwoSelectorAdapter = ({ data, ToppingsTwo: tw, handleTopping, handleSizeChange: hsc }) => (
        <ToppingsTwoComponent
            count={count}
            pizzaState={pizzaState}
            setPizzaState={setPizzaState}
            data={data}
            noofToppings={noofToppings}
            premiumToppingCount={premiumToppingCount}
            ToppingsTwo={ToppingsTwo}
        />
    );

    const ToppingOneSelectorAdapter = ({ data, ToppingsOne: to, handleTopping, handleSizeChange: hsc }) => (
        <ToppingsOneComponent
            count={count}
            pizzaState={pizzaState}
            setPizzaState={setPizzaState}
            data={data}
            noofToppings={noofToppings}
            premiumToppingCount={premiumToppingCount}
            ToppingsOne={ToppingsOne}
        />
    );

    const FreeToppingSelectorAdapter = ({ data, ToppingsFree: tf, handleTopping, handleSizeChange: hsc }) => (
        <ToppingsFreeComponent
            count={count}
            pizzaState={pizzaState}
            setPizzaState={setPizzaState}
            data={data}
            ToppingsFree={ToppingsFreeSelected}
        />
    );

    return (
        <ToppingSheet
            isOpen={isOpen}
            onClose={onClose}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            Ingredients={Ingredients}
            ToppingsTwo={ToppingsTwo}
            ToppingsOne={ToppingsOne}
            ToppingsFree={ToppingsFreeSelected}
            handleToppingsTwo={handleToppingsTwo}
            handleToppingOne={handleToppingOne}
            handleFreeToppings={handleFreeToppings}
            handleSizeChange={handleSizeChange}
            ToppingTwoSelector={ToppingTwoSelectorAdapter}
            ToppingOneSelector={ToppingOneSelectorAdapter}
            FreeToppingSelector={FreeToppingSelectorAdapter}
            nonRegularTitle={nonRegularToppingsTitle}
            regularTitle={regularToppingsTitle}
        />
    );
}

// ─── Main SpecialPizzaConfig ─────────────────────────────────────────────────

function SpecialPizzaConfig({
    count,
    specialOfferData,
    pizzaState,
    setPizzaState,
    toppingsData,
    activeAccordion,
    toggleAccordion,
}) {
    const isActive = activeAccordion === `pizza-${count}`;
    const signaturePizzas = specialOfferData?.signaturePizzas ?? [];

    // Sheet open states — one per category
    const [cheeseOpen, setCheeseOpen] = useState(false);
    const [sauceOpen, setSauceOpen] = useState(false);
    const [spicyOpen, setSpicyOpen] = useState(false);
    const [cookOpen, setCookOpen] = useState(false);
    const [crustOpen, setCrustOpen] = useState(false);
    const [crustTypeOpen, setCrustTypeOpen] = useState(false);
    const [toppingOpen, setToppingOpen] = useState(false);
    const [pizzaOpen, setPizzaOpen] = useState(false);

    // Current slot state
    const slot = pizzaState[count] || {};

    // Signature pizza dropdown handler
    const handlePizzaChange = (e) => {
        const selectedCode = e.target.value;
        if (!selectedCode) return;
        const selectedPizza = signaturePizzas.find((p) => p.code === selectedCode);
        if (!selectedPizza) return;
        setPizzaState((prev) => {
            const newState = [...prev];
            newState[count] = { ...newState[count], signaturePizza: selectedPizza };
            return newState;
        });
    };

    // Generic handler factory for single-select categories
    const makeHandler = (categoryKey, idKey, nameKey, stateField) => (id) => {
        const list = specialOfferData?.[categoryKey] || [];
        const item = list.find((d) => getOptionId(d) === id);
        if (!item) return;
        const update = { [idKey]: getOptionId(item), [nameKey]: item?.[nameKey] || item?.name || id, price: item?.price || 0 };
        setPizzaState((prev) => {
            const s = [...prev];
            s[count] = { ...s[count], [stateField]: update };
            return s;
        });
    };

    const handleCheese = makeHandler("cheese", "cheeseCode", "cheeseName", "cheese");
    const handleSauce = (id) => {
        const item = specialOfferData?.sauce?.find((d) => getOptionId(d) === id);
        if (!item) return;
        setPizzaState((prev) => { const s = [...prev]; s[count] = { ...s[count], sauce: { sauceCode: getOptionId(item), sauce: item?.sauce || item?.name || id, price: item?.price || 0 } }; return s; });
    };
    const handleSpicy = (id) => {
        const list = specialOfferData?.spices || specialOfferData?.spicy || [];
        const item = list.find((d) => getOptionId(d) === id);
        if (!item) return;
        setPizzaState((prev) => { const s = [...prev]; s[count] = { ...s[count], spicy: { spicyCode: getOptionId(item), spicy: item?.spicy || item?.name || id, price: item?.price || 0 } }; return s; });
    };
    const handleCook = (id) => {
        const item = specialOfferData?.cook?.find((d) => getOptionId(d) === id);
        if (!item) return;
        setPizzaState((prev) => { const s = [...prev]; s[count] = { ...s[count], cook: { cookCode: getOptionId(item), cook: item?.cook || item?.name || id, price: item?.price || 0 } }; return s; });
    };
    const handleCrust = (id) => {
        const item = specialOfferData?.crust?.find((d) => getOptionId(d) === id);
        if (!item) return;
        setPizzaState((prev) => { const s = [...prev]; s[count] = { ...s[count], crust: { crustCode: getOptionId(item), crustName: item?.crustName || item?.name || id, price: item?.price || 0 } }; return s; });
    };
    const handleCrustType = (id) => {
        const item = specialOfferData?.crustType?.find((d) => getOptionId(d) === id);
        if (!item) return;
        setPizzaState((prev) => { const s = [...prev]; s[count] = { ...s[count], crustType: { crustTypeCode: getOptionId(item), crustTypeName: item?.crustType || item?.name || id, price: item?.price || 0 } }; return s; });
    };

    // Topping total count for this pizza
    const totalToppings = (slot.toppings?.countAsTwoToppings?.length || 0) + (slot.toppings?.countAsOneToppings?.length || 0) + (slot.toppings?.freeToppings?.length || 0);
    const allToppingNames = [
        ...(slot.toppings?.countAsTwoToppings || []),
        ...(slot.toppings?.countAsOneToppings || []),
        ...(slot.toppings?.freeToppings || []),
    ].map((t) => t.toppingsName);

    return (
        <div
            className={`deal-pizza-card ${isActive ? 'deal-pizza-card--active' : ''} mb-3`}
            onClick={() => { if (!isActive) toggleAccordion(`pizza-${count}`); }}
            role="button"
            style={{ cursor: isActive ? 'default' : 'pointer' }}
        >
            {/* Card Header */}
            <div className="deal-pizza-card__header">
                <div className="deal-pizza-card__num">
                    <span>{count + 1}</span>
                </div>
                <div className="deal-pizza-card__title">
                    <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                        Pizza {count + 1}
                        {(slot.signaturePizza?.name || slot.signaturePizza?.pizza_name) && (
                            <span className="deal-pizza-card__selected-name">
                                {" "}— {slot.signaturePizza?.name || slot.signaturePizza?.pizza_name}
                            </span>
                        )}
                    </div>
                </div>
                {!isActive && (
                    <FaChevronDown style={{ color: '#888', flexShrink: 0 }} />
                )}
            </div>

            {isActive && (
                <div className="deal-pizza-card__body">
                {/* Signature pizza selector (if applicable) */}
                {signaturePizzas.length > 0 && (
                    <div className="mb-3">
                        <p className="fw-bold text-uppercase mb-2" style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}>Select Pizza</p>
                        
                        <TriggerBtn
                            icon="🍕"
                            label="Pizza"
                            value={slot.signaturePizza?.name || slot.signaturePizza?.pizza_name || "Select Pizza"}
                            onClick={() => setPizzaOpen(true)}
                        />
                        <OptionSheet
                            isOpen={pizzaOpen}
                            onClose={() => setPizzaOpen(false)}
                            title="Choose Pizza"
                            options={signaturePizzas.map(p => ({
                                id: p.code || p.id,
                                label: p.name || p.pizza_name || "Unknown Pizza",
                                price: 0
                            }))}
                            selected={slot.signaturePizza?.code || slot.signaturePizza?.id}
                            onSelect={(id) => {
                                const selectedPizza = signaturePizzas.find((p) => (p.code || p.id) === id);
                                if (selectedPizza) {
                                    setPizzaState((prev) => {
                                        const newState = [...prev];
                                        newState[count] = { ...newState[count], signaturePizza: selectedPizza };
                                        return newState;
                                    });
                                }
                            }}
                        />
                    </div>
                )}

                {/* SIZE — horizontal pills (shared class from style.css) */}
                <div className="mt-1 mb-3">
                    <p className="fw-bold text-uppercase mb-2" style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}>Customize Your Pizza</p>
                </div>

                {/* ── Dough / Crust ── */}
                {(specialOfferData?.crust?.length > 0) && (
                    <div className="mb-2">
                        <TriggerBtn
                            icon="🫓"
                            label="Dough"
                            value={slot.crust?.crustName || slot.crust?.crustCode}
                            onClick={() => setCrustOpen(true)}
                        />
                        <OptionSheet
                            isOpen={crustOpen}
                            onClose={() => setCrustOpen(false)}
                            title="Choose Dough"
                            options={toOptions(specialOfferData.crust, "crustName")}
                            selected={slot.crust?.crustCode}
                            onSelect={handleCrust}
                        />
                    </div>
                )}

                {/* ── Crust Type ── */}
                {(specialOfferData?.crustType?.length > 0) && (
                    <div className="mb-2">
                        <TriggerBtn
                            icon="⭕"
                            label="Crust Type"
                            value={slot.crustType?.crustTypeName || slot.crustType?.crustTypeCode}
                            onClick={() => setCrustTypeOpen(true)}
                        />
                        <OptionSheet
                            isOpen={crustTypeOpen}
                            onClose={() => setCrustTypeOpen(false)}
                            title="Choose Crust Type"
                            options={toOptions(specialOfferData.crustType, "crustType")}
                            selected={slot.crustType?.crustTypeCode}
                            onSelect={handleCrustType}
                        />
                    </div>
                )}

                {/* ── Cheese ── */}
                {(specialOfferData?.cheese?.length > 0) && (
                    <div className="mb-2">
                        <TriggerBtn
                            icon="🧀"
                            label="Cheese"
                            value={slot.cheese?.cheeseName || slot.cheese?.cheeseCode}
                            onClick={() => setCheeseOpen(true)}
                        />
                        <OptionSheet
                            isOpen={cheeseOpen}
                            onClose={() => setCheeseOpen(false)}
                            title="Choose Cheese"
                            options={toOptions(specialOfferData.cheese, "cheeseName")}
                            selected={slot.cheese?.cheeseCode}
                            onSelect={handleCheese}
                        />
                    </div>
                )}

                {/* ── Spicy ── */}
                {((specialOfferData?.spices || specialOfferData?.spicy)?.length > 0) && (
                    <div className="mb-2">
                        <TriggerBtn
                            icon="🌶️"
                            label="Spicy"
                            value={slot.spicy?.spicy}
                            onClick={() => setSpicyOpen(true)}
                        />
                        <OptionSheet
                            isOpen={spicyOpen}
                            onClose={() => setSpicyOpen(false)}
                            title="Choose Spice Level"
                            options={toOptions(specialOfferData?.spices || specialOfferData?.spicy || [], "spicy")}
                            selected={slot.spicy?.spicyCode}
                            onSelect={handleSpicy}
                        />
                    </div>
                )}

                {/* ── Sauce ── */}
                {(specialOfferData?.sauce?.length > 0) && (
                    <div className="mb-2">
                        <TriggerBtn
                            icon="🥫"
                            label="Sauce"
                            value={slot.sauce?.sauce}
                            onClick={() => setSauceOpen(true)}
                        />
                        <OptionSheet
                            isOpen={sauceOpen}
                            onClose={() => setSauceOpen(false)}
                            title="Choose Sauce"
                            options={toOptions(specialOfferData.sauce, "sauce")}
                            selected={slot.sauce?.sauceCode}
                            onSelect={handleSauce}
                        />
                    </div>
                )}

                {/* ── Cook ── */}
                {(specialOfferData?.cook?.length > 0) && (
                    <div className="mb-2">
                        <TriggerBtn
                            icon="🔥"
                            label="Cook"
                            value={slot.cook?.cook}
                            onClick={() => setCookOpen(true)}
                        />
                        <OptionSheet
                            isOpen={cookOpen}
                            onClose={() => setCookOpen(false)}
                            title="Choose Cook Style"
                            options={toOptions(specialOfferData.cook, "cook")}
                            selected={slot.cook?.cookCode}
                            onSelect={handleCook}
                        />
                    </div>
                )}

                {/* ── Toppings ── */}
                <div className="mb-2">
                    <button
                        className="topping-trigger-btn"
                        onClick={() => setToppingOpen(true)}
                        type="button"
                    >
                        <span className="topping-trigger-btn__icon">🍕</span>
                        <span className="topping-trigger-btn__label">Choose Toppings</span>
                        {totalToppings > 0 && (
                            <span className="topping-trigger-btn__count">{totalToppings} selected</span>
                        )}
                        <span className="topping-trigger-btn__arrow">›</span>
                    </button>
                    {allToppingNames.length > 0 && (
                        <div className="selected-toppings-pills mt-1">
                            {allToppingNames.map((n, i) => (
                                <span key={i} className="selected-topping-pill">{n}</span>
                            ))}
                        </div>
                    )}
                </div>

                <SpecialToppingSheet
                    isOpen={toppingOpen}
                    onClose={() => setToppingOpen(false)}
                    count={count}
                    pizzaState={pizzaState}
                    setPizzaState={setPizzaState}
                    toppingsData={toppingsData}
                    noofToppings={specialOfferData?.noofToppings || 0}
                />
            </div>
            )}
        </div>
    );
}

export default SpecialPizzaConfig;
