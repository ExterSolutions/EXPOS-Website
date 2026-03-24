import React, { useCallback, useEffect, useRef, useState } from "react";
import SignaturePizzaSelector from "./SignaturePizzaSelector";
import OptionSheet from "../../../components/_main/OptionSheet";
import { fetchSignaturePizzaDefaults } from "../../../services";
import ToppingsSelector from "./ToppingsSelector";

// ─── Option config (maps optionKey → code/name field names) ─────────────────
const OPTION_CONFIG = {
    crust:        { codeKey: "crustCode",        nameKey: "crustName" },
    crustType:    { codeKey: "crustTypeCode",    nameKey: "crustType" },
    cheese:       { codeKey: "cheeseCode",       nameKey: "cheeseName" },
    specialBases: { codeKey: "specialbaseCode",  nameKey: "specialbaseName" },
    spicy:        { codeKey: "spicyCode",        nameKey: "spicy" },
    sauce:        { codeKey: "sauceCode",        nameKey: "sauce" },
    cook:         { codeKey: "cookCode",         nameKey: "cook" },
};

// ─── Convert backend option to { id, label, price } used by OptionSheet ─────
function normalizeOptions(arr = [], optionkey) {
    const config = OPTION_CONFIG[optionkey];
    if (!config || !arr?.length) return [];
    return arr.map((opt) => ({
        id:    opt[config.codeKey] ?? opt.code ?? "",
        label: opt[config.nameKey] ?? opt.name ?? "",
        price: Number(opt.price || 0),
    }));
}

// ─── Get selected id from a pizzaSelections field ────────────────────────────
function getSelectedId(selected, optionkey) {
    const config = OPTION_CONFIG[optionkey];
    if (!config || !selected) return null;
    return selected[config.codeKey] ?? null;
}
function getSelectedLabel(selected, optionkey) {
    const config = OPTION_CONFIG[optionkey];
    if (!config || !selected) return null;
    return selected[config.nameKey] ?? null;
}

// ─── Trigger button (matches style.css .topping-trigger-btn) ─────────────────
function TriggerBtn({ icon, label, value, onClick }) {
    return (
        <button className="topping-trigger-btn" onClick={onClick} type="button">
            <span className="topping-trigger-btn__icon">{icon}</span>
            <span className="topping-trigger-btn__label">{label}</span>
            {value && <span className="topping-trigger-btn__count">{value}</span>}
            <span className="topping-trigger-btn__arrow">›</span>
        </button>
    );
}

// ─── Toppings count badge helper ─────────────────────────────────────────────
function toppingCountLabel(pizzaSelections) {
    const c2 = pizzaSelections?.toppings?.countAsTwoToppings?.length || 0;
    const c1 = pizzaSelections?.toppings?.countAsOneToppings?.length || 0;
    const cf = pizzaSelections?.toppings?.freeToppings?.length || 0;
    const total = c2 + c1 + cf;
    return total > 0 ? `${total} selected` : null;
}
function allToppingNames(pizzaSelections) {
    return [
        ...(pizzaSelections?.toppings?.countAsTwoToppings || []),
        ...(pizzaSelections?.toppings?.countAsOneToppings || []),
        ...(pizzaSelections?.toppings?.freeToppings || []),
    ].map((t) => t.toppingsName || t.name || "");
}

// ─── Inner topping adapters for ToppingSheet ────────────────────────────────
// ToppingSheet expects ToppingTwoSelector / ToppingOneSelector / FreeToppingSelector
// as React classes that receive (data, ToppingsTwo, handleTopping, handleSizeChange).
// ToppingsSelector in SpecialOfferNew already has its own API, so we wire them differently.
// We'll use ToppingSheet's own internal rendering — which calls these class props.
// Instead of faking adapters, we'll build a simpler inline topping popup using ToppingsSelector.

function ToppingSheetWrapper({ isOpen, onClose, toppings, offerData, pizzaSelections, settings, onUpdateCustomization, index }) {
    const TOPPINGS_TABS = [
        { id: "countAsTwo", label: settings?.premiumTopppingLabel || "Premium Toppings" },
        { id: "countAsOne", label: settings?.regularToppingLabel || "Regular Toppings" },
        { id: "free", label: settings?.indianToppingLabel || "Indian Toppings" },
    ];

    const [activeTab, setActiveTab] = useState("countAsTwo");

    const handleToppingsChange = (type, list) => {
        const current = pizzaSelections?.toppings || { countAsTwoToppings: [], countAsOneToppings: [], freeToppings: [] };
        const updated = { ...current, [type]: list };
        onUpdateCustomization(index, "toppings", updated);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="topping-sheet-backdrop" onClick={onClose} aria-hidden="true" />

            {/* Sheet */}
            <div className="topping-sheet slide-up-in" role="dialog" aria-modal="true" aria-label="Choose Toppings">
                <div className="topping-sheet__handle" />

                {/* Header */}
                <div className="topping-sheet__header">
                    <div>
                        <p className="topping-sheet__title">Choose Toppings</p>
                        {toppingCountLabel(pizzaSelections) && (
                            <p className="topping-sheet__subtitle">{toppingCountLabel(pizzaSelections)}</p>
                        )}
                    </div>
                    <button className="topping-sheet__close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Tabs */}
                <div className="topping-sheet__tabs">
                    {TOPPINGS_TABS.map((tab) => {
                        const count =
                            tab.id === "countAsTwo" ? (pizzaSelections?.toppings?.countAsTwoToppings?.length || 0) :
                            tab.id === "countAsOne" ? (pizzaSelections?.toppings?.countAsOneToppings?.length || 0) :
                            (pizzaSelections?.toppings?.freeToppings?.length || 0);
                        return (
                            <button
                                key={tab.id}
                                className={`topping-sheet__tab ${activeTab === tab.id ? "topping-sheet__tab--active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span
                                        className="topping-sheet__tab-badge"
                                        style={{
                                            marginLeft: '6px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: '20px',
                                            height: '20px',
                                            padding: '0 5px',
                                            borderRadius: '10px',
                                            background: 'rgba(255,255,255,0.35)',
                                            fontSize: '0.72rem',
                                            fontWeight: '700',
                                            lineHeight: '1',
                                            flexShrink: 0,
                                        }}
                                    >{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Body */}
                <div className="topping-sheet__body">
                    {activeTab === "countAsTwo" && (
                        <ToppingsSelector
                            key={`premium-${index}`}
                            title={TOPPINGS_TABS[0].label}
                            options={toppings?.countAsTwo ?? []}
                            defaultOptions={[]}
                            selected={pizzaSelections?.toppings?.countAsTwoToppings ?? []}
                            onChange={(list) => handleToppingsChange("countAsTwoToppings", list)}
                            toppingCount={offerData?.premiumToppingsCount || 1}
                            isIndianStyle={false}
                        />
                    )}
                    {activeTab === "countAsOne" && (
                        <ToppingsSelector
                            key={`regular-${index}`}
                            title={TOPPINGS_TABS[1].label}
                            options={toppings?.countAsOne ?? []}
                            defaultOptions={[]}
                            selected={pizzaSelections?.toppings?.countAsOneToppings ?? []}
                            onChange={(list) => handleToppingsChange("countAsOneToppings", list)}
                            toppingCount={1}
                            isIndianStyle={false}
                        />
                    )}
                    {activeTab === "free" && (
                        <ToppingsSelector
                            key={`indian-${index}`}
                            title={TOPPINGS_TABS[2].label}
                            options={toppings?.freeToppings ?? []}
                            defaultOptions={[]}
                            selected={pizzaSelections?.toppings?.freeToppings ?? []}
                            onChange={(list) => {
                                const totalFree = toppings?.freeToppings?.length || 0;
                                const isAllSelected = list.length === totalFree;
                                const current = pizzaSelections?.toppings || { countAsTwoToppings: [], countAsOneToppings: [], freeToppings: [] };
                                onUpdateCustomization(index, "toppings", { ...current, freeToppings: list });
                                onUpdateCustomization(index, "isAllIndiansTps", isAllSelected);
                            }}
                            toppingCount={1}
                            isIndianStyle={true}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="topping-sheet__footer">
                    <button className="topping-sheet__done" onClick={onClose} type="button">Done</button>
                </div>
            </div>
        </>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const PizzaCustomizerAccordion = ({
    index,
    totalPizzas,
    isActive,
    onSetActive,
    onNext,
    onBack,
    settings,
    toppings,
    offerData,
    signaturePizzas,
    pizzaSelections,
    onUpdateCustomization,
    isEditMode = false,
}) => {
    const hasPreselectedFreeToppingsRef = useRef(false);
    const hasHydratedEditRef = useRef(false);
    const cardRef = useRef(null);

    const [signatureCode, setSignatureCode] = useState(pizzaSelections?.signaturePizzaCode || null);
    const [loading, setLoading] = useState(false);
    const [signatureDetails, setSignatureDetails] = useState(null);

    // Sheet open states — one per category
    const [openSheet, setOpenSheet] = useState(null); // 'cheese'|'crust'|'crustType'|'specialBases'|'sauce'|'spicy'|'cook'|'toppings'|null

    // Scroll into view when becoming active
    useEffect(() => {
        if (isActive && cardRef.current) {
            setTimeout(() => {
                cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [isActive]);

    useEffect(() => {
        if (pizzaSelections?.signaturePizzaCode && !signatureCode) {
            setSignatureCode(pizzaSelections.signaturePizzaCode);
        }
    }, [pizzaSelections?.signaturePizzaCode]);

    const makeOptionHandler = useCallback(
        (field) => (opt) => {
            onUpdateCustomization(index, field, opt);
        },
        [index, onUpdateCustomization]
    );

    const preselectFreeToppingsIfNeeded = () => {
        if (isEditMode) return;
        if (hasPreselectedFreeToppingsRef.current) return;
        if (!toppings?.freeToppings?.length) return;
        const alreadySelected = pizzaSelections?.toppings?.freeToppings?.length > 0;
        if (alreadySelected) return;
        const allFree = toppings.freeToppings.map((opt) => ({
            toppingsCode: opt.toppingsCode || opt.code,
            toppingsName: opt.toppingsName ?? opt.name ?? "Topping",
            toppingsPrice: "0.00",
            toppingsPlacement: "whole",
            pizzaIndex: index,
            amount: "0.00",
        }));
        hasPreselectedFreeToppingsRef.current = true;
        onUpdateCustomization(index, "toppings", {
            ...pizzaSelections.toppings,
            freeToppings: allFree,
        });
        onUpdateCustomization(index, "isAllIndiansTps", true);
    };

    const handleSignaturePizzaChange = (code) => {
        setSignatureCode(code);
        const pizzas = Array.isArray(signaturePizzas) ? signaturePizzas : (signaturePizzas?.data || []);
        const selectedPizza = pizzas?.find((p) => (p.code || p.sideCode || p.id) === code) || null;
        if (selectedPizza) {
            onUpdateCustomization(index, "signaturePizzaCode", selectedPizza.code || selectedPizza.sideCode || selectedPizza.id);
            onUpdateCustomization(index, "signaturePizzaName", selectedPizza.pizza_name || selectedPizza.pizzaName || selectedPizza.name || selectedPizza.sideName || "");
            onUpdateCustomization(index, "toppings", { countAsTwoToppings: [], countAsOneToppings: [], freeToppings: [] });
        } else {
            onUpdateCustomization(index, "signaturePizzaCode", null);
            onUpdateCustomization(index, "signaturePizzaName", null);
            onUpdateCustomization(index, "toppings", { countAsTwoToppings: [], countAsOneToppings: [], freeToppings: [] });
        }
    };

    const fetchSignatureDetails = async () => {
        try {
            setLoading(true);
            const response = await fetchSignaturePizzaDefaults(signatureCode);
            const details = response.data;
            const normalizeDefault = (item) => {
                if (!item) return null;
                return { ...item, price: 0 };
            };
            const findByCode = (key, list, code) => list?.find((i) => i[key] === code) || null;
            const signatureMatchesCart = isEditMode && pizzaSelections?.signaturePizzaCode === signatureCode;
            if (isEditMode && signatureMatchesCart && !hasHydratedEditRef.current) {
                hasHydratedEditRef.current = true;
                setSignatureDetails(details);
                preselectFreeToppingsIfNeeded();
                onUpdateCustomization(index, "cheese", pizzaSelections.cheese);
                onUpdateCustomization(index, "crust", pizzaSelections.crust);
                onUpdateCustomization(index, "crustType", pizzaSelections.crustType);
                onUpdateCustomization(index, "specialBases", pizzaSelections.specialBases);
                onUpdateCustomization(index, "sauce", pizzaSelections.sauce);
                onUpdateCustomization(index, "spicy", pizzaSelections.spicy);
                onUpdateCustomization(index, "cook", pizzaSelections.cook);
                return;
            }
            if (!isEditMode) {
                onUpdateCustomization(index, "cheese", normalizeDefault(findByCode("cheeseCode", offerData.cheese, details.cheese?.code)));
                onUpdateCustomization(index, "crust", normalizeDefault(findByCode("crustCode", offerData.crust, details.crust?.code)));
                onUpdateCustomization(index, "crustType", normalizeDefault(findByCode("crustTypeCode", offerData.crustType, details.crust_type?.code)));
                onUpdateCustomization(index, "specialBases", normalizeDefault(findByCode("specialbaseCode", offerData.specialbases, details.special_base?.code)));
                onUpdateCustomization(index, "sauce", normalizeDefault(findByCode("sauceCode", offerData.sauce, details.sauce?.code)));
                onUpdateCustomization(index, "spicy", normalizeDefault(findByCode("spicyCode", offerData.spices, details.spices?.code)));
                onUpdateCustomization(index, "cook", normalizeDefault(findByCode("cookCode", offerData.cook, details.cook?.code)));
                setSignatureDetails(details);
                preselectFreeToppingsIfNeeded();
            }
        } catch (err) {
            console.error("Signature pizza fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!signatureCode) return;
        fetchSignatureDetails();
    }, [signatureCode]);

    const isDone = !!pizzaSelections?.signaturePizzaCode;

    // OptionSheet handler factory — wraps OptionSelector's API
    const makeSheetHandler = useCallback((optionkey, field) => (id) => {
        const config = OPTION_CONFIG[optionkey];
        if (!config) return;
        const arr = optionkey === "spicy" ? (offerData?.spices || []) :
                    optionkey === "specialBases" ? (offerData?.specialbases || []) :
                    (offerData?.[optionkey] || []);
        const opt = arr.find((o) => o[config.codeKey] === id);
        if (!opt) return;
        onUpdateCustomization(index, field, { [config.codeKey]: opt[config.codeKey], [config.nameKey]: opt[config.nameKey], price: opt.price || 0 });
    }, [index, onUpdateCustomization, offerData]);

    return (
        <div
            ref={cardRef}
            className={`deal-pizza-card ${isActive ? 'deal-pizza-card--active' : ''} ${isDone && !isActive ? 'deal-pizza-card--done' : ''} mb-3`}
            onClick={() => !isActive && onSetActive(index)}
            role="button"
            style={{ cursor: isActive ? 'default' : 'pointer' }}
        >
            {/* Card Header */}
            <div className="deal-pizza-card__header">
                <div className="deal-pizza-card__num">
                    {isDone && !isActive
                        ? <i className="bi bi-check2" style={{ color: '#fff', fontSize: '1rem' }} />
                        : <span>{index + 1}</span>
                    }
                </div>
                <div className="deal-pizza-card__title">
                    <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                        Pizza {index + 1}
                        {pizzaSelections?.signaturePizzaName && (
                            <span className="deal-pizza-card__selected-name"> — {pizzaSelections.signaturePizzaName}</span>
                        )}
                    </div>
                    {!isActive && (
                        <div style={{ fontSize: '0.78rem', color: isDone ? '#4CAF50' : '#888', marginTop: 2 }}>
                            {isDone ? '✓ Configured  — tap to edit' : 'Tap to configure'}
                        </div>
                    )}
                </div>
                {!isActive && (
                    <i className="bi bi-chevron-down" style={{ color: '#888', flexShrink: 0 }} />
                )}
            </div>

            {/* Card Body — only visible when active */}
            {isActive && (
                <div className="deal-pizza-card__body">
                    <SignaturePizzaSelector
                        signaturePizzas={signaturePizzas}
                        selectedCode={signatureCode}
                        onChange={(code) => handleSignaturePizzaChange(code)}
                    />

                    {loading ? (
                        <div className="text-muted p-3 text-center">Loading customisations...</div>
                    ) : (
                        signatureDetails && (
                            <div className="mt-3">
                                <p className="fw-bold text-uppercase mb-2" style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}>Customize Your Pizza</p>

                                {/* ── Crust (Dough) ── */}
                                {offerData?.crust?.length > 0 && (
                                    <div className="mb-2">
                                        <TriggerBtn
                                            icon="🫓"
                                            label="Dough"
                                            value={getSelectedLabel(pizzaSelections?.crust, "crust")}
                                            onClick={() => setOpenSheet("crust")}
                                        />
                                        <OptionSheet
                                            isOpen={openSheet === "crust"}
                                            onClose={() => setOpenSheet(null)}
                                            title="Choose Dough"
                                            options={normalizeOptions(offerData.crust, "crust")}
                                            selected={getSelectedId(pizzaSelections?.crust, "crust")}
                                            onSelect={makeSheetHandler("crust", "crust")}
                                        />
                                    </div>
                                )}

                                {/* ── Crust Type ── */}
                                {offerData?.crustType?.length > 0 && (
                                    <div className="mb-2">
                                        <TriggerBtn
                                            icon="⭕"
                                            label="Crust Type"
                                            value={getSelectedLabel(pizzaSelections?.crustType, "crustType")}
                                            onClick={() => setOpenSheet("crustType")}
                                        />
                                        <OptionSheet
                                            isOpen={openSheet === "crustType"}
                                            onClose={() => setOpenSheet(null)}
                                            title="Choose Crust Type"
                                            options={normalizeOptions(offerData.crustType, "crustType")}
                                            selected={getSelectedId(pizzaSelections?.crustType, "crustType")}
                                            onSelect={makeSheetHandler("crustType", "crustType")}
                                        />
                                    </div>
                                )}

                                {/* ── Special Base ── */}
                                {offerData?.specialbases?.length > 0 && (
                                    <div className="mb-2">
                                        <TriggerBtn
                                            icon="🍕"
                                            label="Special Base"
                                            value={getSelectedLabel(pizzaSelections?.specialBases, "specialBases")}
                                            onClick={() => setOpenSheet("specialBases")}
                                        />
                                        <OptionSheet
                                            isOpen={openSheet === "specialBases"}
                                            onClose={() => setOpenSheet(null)}
                                            title="Choose Special Base"
                                            options={normalizeOptions(offerData.specialbases, "specialBases")}
                                            selected={getSelectedId(pizzaSelections?.specialBases, "specialBases")}
                                            onSelect={makeSheetHandler("specialBases", "specialBases")}
                                        />
                                    </div>
                                )}

                                {/* ── Cheese ── */}
                                {offerData?.cheese?.length > 0 && (
                                    <div className="mb-2">
                                        <TriggerBtn
                                            icon="🧀"
                                            label="Cheese"
                                            value={getSelectedLabel(pizzaSelections?.cheese, "cheese")}
                                            onClick={() => setOpenSheet("cheese")}
                                        />
                                        <OptionSheet
                                            isOpen={openSheet === "cheese"}
                                            onClose={() => setOpenSheet(null)}
                                            title="Choose Cheese"
                                            options={normalizeOptions(offerData.cheese, "cheese")}
                                            selected={getSelectedId(pizzaSelections?.cheese, "cheese")}
                                            onSelect={makeSheetHandler("cheese", "cheese")}
                                        />
                                    </div>
                                )}

                                {/* ── Spicy ── */}
                                {offerData?.spices?.length > 0 && (
                                    <div className="mb-2">
                                        <TriggerBtn
                                            icon="🌶️"
                                            label="Spicy"
                                            value={getSelectedLabel(pizzaSelections?.spicy, "spicy")}
                                            onClick={() => setOpenSheet("spicy")}
                                        />
                                        <OptionSheet
                                            isOpen={openSheet === "spicy"}
                                            onClose={() => setOpenSheet(null)}
                                            title="Choose Spice Level"
                                            options={normalizeOptions(offerData.spices, "spicy")}
                                            selected={getSelectedId(pizzaSelections?.spicy, "spicy")}
                                            onSelect={makeSheetHandler("spicy", "spicy")}
                                        />
                                    </div>
                                )}

                                {/* ── Sauce ── */}
                                {offerData?.sauce?.length > 0 && (
                                    <div className="mb-2">
                                        <TriggerBtn
                                            icon="🥫"
                                            label="Sauce"
                                            value={getSelectedLabel(pizzaSelections?.sauce, "sauce")}
                                            onClick={() => setOpenSheet("sauce")}
                                        />
                                        <OptionSheet
                                            isOpen={openSheet === "sauce"}
                                            onClose={() => setOpenSheet(null)}
                                            title="Choose Sauce"
                                            options={normalizeOptions(offerData.sauce, "sauce")}
                                            selected={getSelectedId(pizzaSelections?.sauce, "sauce")}
                                            onSelect={makeSheetHandler("sauce", "sauce")}
                                        />
                                    </div>
                                )}

                                {/* ── Cook ── */}
                                {offerData?.cook?.length > 0 && (
                                    <div className="mb-2">
                                        <TriggerBtn
                                            icon="🔥"
                                            label="Cook"
                                            value={getSelectedLabel(pizzaSelections?.cook, "cook")}
                                            onClick={() => setOpenSheet("cook")}
                                        />
                                        <OptionSheet
                                            isOpen={openSheet === "cook"}
                                            onClose={() => setOpenSheet(null)}
                                            title="Choose Cook Style"
                                            options={normalizeOptions(offerData.cook, "cook")}
                                            selected={getSelectedId(pizzaSelections?.cook, "cook")}
                                            onSelect={makeSheetHandler("cook", "cook")}
                                        />
                                    </div>
                                )}

                                {/* ── Toppings ── */}
                                <div className="mb-2">
                                    <button
                                        className="topping-trigger-btn"
                                        onClick={() => setOpenSheet("toppings")}
                                        type="button"
                                    >
                                        <span className="topping-trigger-btn__icon">🥗</span>
                                        <span className="topping-trigger-btn__label">Choose Toppings</span>
                                        {toppingCountLabel(pizzaSelections) && (
                                            <span className="topping-trigger-btn__count">{toppingCountLabel(pizzaSelections)}</span>
                                        )}
                                        <span className="topping-trigger-btn__arrow">›</span>
                                    </button>
                                    {allToppingNames(pizzaSelections).length > 0 && (
                                        <div className="selected-toppings-pills mt-1">
                                            {allToppingNames(pizzaSelections).map((n, i) => (
                                                <span key={i} className="selected-topping-pill">{n}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <ToppingSheetWrapper
                                    isOpen={openSheet === "toppings"}
                                    onClose={() => setOpenSheet(null)}
                                    toppings={toppings}
                                    offerData={offerData}
                                    pizzaSelections={pizzaSelections}
                                    settings={settings}
                                    onUpdateCustomization={onUpdateCustomization}
                                    index={index}
                                />
                            </div>
                        )
                    )}

                    {/* Navigation Buttons */}
                    <div className="deal-pizza-nav">
                        {index > 0 && (
                            <button
                                type="button"
                                className="deal-pizza-nav__back"
                                onClick={(e) => { e.stopPropagation(); onBack(); }}
                            >
                                <i className="bi bi-arrow-left me-1" /> Pizza {index}
                            </button>
                        )}
                        {index < totalPizzas - 1 ? (
                            <button
                                type="button"
                                className="deal-pizza-nav__next ms-auto"
                                onClick={(e) => { e.stopPropagation(); onNext(); }}
                            >
                                Pizza {index + 2} <i className="bi bi-arrow-right ms-1" />
                            </button>
                        ) : (
                            <span className="deal-pizza-nav__done ms-auto">
                                <i className="bi bi-check2-circle me-1" />All pizzas configured!
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PizzaCustomizerAccordion;