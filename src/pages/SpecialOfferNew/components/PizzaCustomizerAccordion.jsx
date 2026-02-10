import React, { useCallback, useEffect, useRef, useState } from "react";
import SignaturePizzaSelector from "./SignaturePizzaSelector";
import OptionSelector from "./OptionSelector";
import { fetchSignaturePizzaDefaults } from "../../../services";
import ToppingAccordion from "./ToppingAccordion";
import ToppingsSelector from "./ToppingsSelector";

const PizzaCustomizerAccordion = ({
    index,
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
    const accordionId = `pizzaAccordion-${index}`;
    const headerId = `pizzaHeader-${index}`;
    const collapseId = `pizzaCollapse-${index}`;

    const [isOpen, setIsOpen] = useState(true);
    const [signatureCode, setSignatureCode] = useState(pizzaSelections?.signaturePizzaCode || null);
    const [loading, setLoading] = useState(false);
    const [signatureDetails, setSignatureDetails] = useState(null);

    /* ---------- Initialize signature code from pizzaSelections (for edit mode) ---------- */
    useEffect(() => {
        if (pizzaSelections?.signaturePizzaCode && !signatureCode) {
            setSignatureCode(pizzaSelections.signaturePizzaCode);
        }
    }, [pizzaSelections?.signaturePizzaCode]);

    /* ---------- Handlers ---------- */
    const makeOptionHandler = useCallback(
        (field) => (opt) => {
            onUpdateCustomization(index, field, opt);
        },
        [index, onUpdateCustomization]
    );

    const handleToggleAccordion = (e) => {
        e.preventDefault();
        setIsOpen((prev) => !prev);
    };

    // ✅ Centralized toppings update handler
    const handleToppingsChange = (type, list) => {
        const currentToppings = pizzaSelections?.toppings || {
            countAsTwoToppings: [],
            countAsOneToppings: [],
            freeToppings: [],
        };

        const updatedToppings = {
            ...currentToppings,
            [type]: list,
        };

        console.log("Updated Toppings:", updatedToppings);

        onUpdateCustomization(index, "toppings", updatedToppings);
    };

    const preselectFreeToppingsIfNeeded = () => {
        if (isEditMode) return; // ❌ NEVER in edit mode
        if (hasPreselectedFreeToppingsRef.current) return;
        if (!toppings?.freeToppings?.length) return;

        const alreadySelected =
            pizzaSelections?.toppings?.freeToppings?.length > 0;

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
        const selectedPizza = signaturePizzas.find((p) => p.code === code) || null;
        if (selectedPizza) {
            onUpdateCustomization(index, "signaturePizzaCode", selectedPizza.code);
            onUpdateCustomization(index, "signaturePizzaName", selectedPizza.pizzaName || selectedPizza.name || "");
            // ✅ CRITICAL: Reset toppings when signature pizza changes
            onUpdateCustomization(index, "toppings", {
                countAsTwoToppings: [],
                countAsOneToppings: [],
                freeToppings: [],
            });
        } else {
            // If cleared (user chose "-- Select Pizza --")
            onUpdateCustomization(index, "signaturePizzaCode", null);
            onUpdateCustomization(index, "signaturePizzaName", null);
            onUpdateCustomization(index, "toppings", {
                countAsTwoToppings: [],
                countAsOneToppings: [],
                freeToppings: [],
            });
        }
    };

    const fetchSignatureDetails = async () => {
        try {
            setLoading(true);
            const response = await fetchSignaturePizzaDefaults(signatureCode);
            const details = response.data;

            const normalizeDefault = (item, priceKey = "price") => {
                if (!item) return null;
                return {
                    ...item,
                    [priceKey]: 0,
                };
            };

            const findByCode = (key, list, code) =>
                list?.find((i) => i[key] === code) || null;

            const signatureMatchesCart =
                isEditMode &&
                pizzaSelections?.signaturePizzaCode === signatureCode;

            if (
                isEditMode &&
                signatureMatchesCart &&
                !hasHydratedEditRef.current
            ) {
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

                const cheese = normalizeDefault(
                    findByCode("cheeseCode", offerData.cheese, details.cheese?.code)
                );

                const crust = normalizeDefault(
                    findByCode("crustCode", offerData.crust, details.crust?.code)
                );

                const crustType = normalizeDefault(
                    findByCode("crustTypeCode", offerData.crustType, details.crust_type?.code)
                );

                const specialBases = normalizeDefault(
                    findByCode(
                        "specialbaseCode",
                        offerData.specialbases,
                        details.special_base?.code
                    )
                );

                const sauce = normalizeDefault(
                    findByCode("sauceCode", offerData.sauce, details.sauce?.code)
                );

                const spicy = normalizeDefault(
                    findByCode("spicyCode", offerData.spices, details.spices?.code)
                );

                const cook = normalizeDefault(
                    findByCode("cookCode", offerData.cook, details.cook?.code)
                );
                // Update customization with defaults
                onUpdateCustomization(index, "cheese", cheese);
                onUpdateCustomization(index, "crust", crust);
                onUpdateCustomization(index, "crustType", crustType);
                onUpdateCustomization(index, "specialBases", specialBases);
                onUpdateCustomization(index, "sauce", sauce);
                onUpdateCustomization(index, "spicy", spicy);
                onUpdateCustomization(index, "cook", cook);
                // store fetched defaults
                setSignatureDetails(details);
                preselectFreeToppingsIfNeeded();
            }
        } catch (err) {
            console.error("Signature pizza fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Fetch Signature Defaults ---------- */
    useEffect(() => {
        if (!signatureCode) return;
        fetchSignatureDetails();
    }, [signatureCode]);

    /* ---------- Render ---------- */
    return (
        <div className="accordion mb-3" id={accordionId}>
            <div className="accordion-item">
                <h2 className="accordion-header" id={headerId}>
                    <button
                        className={`accordion-button fw-bold ${isOpen ? "text-white" : "collapsed text-dark"}`}
                        type="button"
                        aria-expanded={isOpen ? "true" : "false"}
                        aria-controls={collapseId}
                        onClick={handleToggleAccordion}
                    >
                        PIZZA - {index + 1}
                    </button>
                </h2>

                <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                    aria-labelledby={headerId}
                    data-bs-parent={`#${accordionId}`}
                >
                    <div className="accordion-body">
                        {/* Signature Pizza Selector */}
                        <SignaturePizzaSelector
                            signaturePizzas={signaturePizzas}
                            selectedCode={signatureCode}
                            onChange={(code) => handleSignaturePizzaChange(code)}
                        />

                        {/* Loader or Customization Options */}
                        {loading ? (
                            <div className="text-muted">Loading customisations...</div>
                        ) : (
                            signatureDetails && (
                                <>
                                    {/* --- Options --- */}
                                    <OptionSelector
                                        optionkey="cheese"
                                        title="Cheese"
                                        options={offerData.cheese}
                                        defaultOption={signatureDetails.cheese}
                                        selectedOption={pizzaSelections?.cheese}
                                        onSelect={makeOptionHandler("cheese")}
                                    />

                                    <OptionSelector
                                        optionkey="crust"
                                        title="Crust"
                                        options={offerData.crust}
                                        defaultOption={signatureDetails.crust}
                                        selectedOption={pizzaSelections?.crust}
                                        onSelect={makeOptionHandler("crust")}
                                    />

                                    <OptionSelector
                                        optionkey="crustType"
                                        title="Crust Type"
                                        options={offerData.crustType}
                                        defaultOption={signatureDetails.crust_type}
                                        selectedOption={pizzaSelections?.crustType}
                                        onSelect={makeOptionHandler("crustType")}
                                    />

                                    <OptionSelector
                                        optionkey="specialBases"
                                        title="Special Base"
                                        options={offerData.specialbases}
                                        defaultOption={signatureDetails.special_base}
                                        selectedOption={pizzaSelections?.specialBases}
                                        onSelect={makeOptionHandler("specialBases")}
                                    />

                                    <OptionSelector
                                        optionkey="cook"
                                        title="Cook"
                                        options={offerData.cook}
                                        defaultOption={signatureDetails.cook}
                                        selectedOption={pizzaSelections?.cook}
                                        onSelect={makeOptionHandler("cook")}
                                    />

                                    <OptionSelector
                                        optionkey="sauce"
                                        title="Sauce"
                                        options={offerData.sauce}
                                        defaultOption={signatureDetails.sauce}
                                        selectedOption={pizzaSelections?.sauce}
                                        onSelect={makeOptionHandler("sauce")}
                                    />

                                    <OptionSelector
                                        optionkey="spicy"
                                        title="Spicy"
                                        options={offerData.spices}
                                        defaultOption={signatureDetails.spices}
                                        selectedOption={pizzaSelections?.spicy}
                                        onSelect={makeOptionHandler("spicy")}
                                    />

                                    {/* --- Toppings Section --- */}
                                    <ToppingAccordion index={index}>
                                        <ToppingsSelector
                                            key={`premium-${signatureCode}`}
                                            title={settings.premiumTopppingLabel}
                                            options={toppings.countAsTwo ?? []}
                                            defaultOptions={signatureDetails.topping_as_2 ?? []}
                                            selected={
                                                pizzaSelections?.toppings?.countAsTwoToppings ?? []
                                            }
                                            onChange={(list) =>
                                                handleToppingsChange("countAsTwoToppings", list)
                                            }
                                            toppingCount={offerData.premiumToppingsCount}
                                            isIndianStyle={false}
                                        />

                                        <ToppingsSelector
                                            key={`regular-${signatureCode}`}
                                            title={settings.regularToppingLabel}
                                            options={toppings.countAsOne ?? []}
                                            defaultOptions={signatureDetails.topping_as_1 ?? []}
                                            selected={
                                                pizzaSelections?.toppings?.countAsOneToppings ?? []
                                            }
                                            onChange={(list) =>
                                                handleToppingsChange("countAsOneToppings", list)
                                            }
                                            toppingCount={1}
                                            isIndianStyle={false}
                                        />

                                        <ToppingsSelector
                                            key={`indian-${signatureCode}`}
                                            title="Indian Style"
                                            options={toppings.freeToppings ?? []}
                                            defaultOptions={signatureDetails.topping_as_free ?? []}
                                            selected={pizzaSelections?.toppings?.freeToppings ?? []}
                                            onChange={(list) => {
                                                const totalFree = toppings.freeToppings.length;
                                                const isAllSelected = list.length === totalFree;

                                                // Update toppings
                                                onUpdateCustomization(index, "toppings", {
                                                    ...pizzaSelections.toppings,
                                                    freeToppings: list,
                                                });

                                                // Update flag
                                                onUpdateCustomization(index, "isAllIndiansTps", isAllSelected);
                                            }}
                                            toppingCount={1}
                                            isIndianStyle={true}
                                        />
                                    </ToppingAccordion>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PizzaCustomizerAccordion;