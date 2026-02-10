import { useEffect, useState } from "react";
import SpecialDough from "./Configurations/Dough";
import SpecialCheese from "./Configurations/Cheese";
import SpecialSpicy from "./Configurations/Spicy";
import SpecialSauce from "./Configurations/Sauce";
import SpecialCook from "./Configurations/Dough/Cook";
import Toppings from "./Configurations/Toppings";

function SpecialPizzaConfig({ count, specialOfferData, pizzaState, setPizzaState, toppingsData, activeAccordion, toggleAccordion }) {
    const [isOpen, setIsOpen] = useState(true);
    const signaturePizzas = specialOfferData?.signaturePizzas ?? [];
    // Auto-select first pizza on mount if not already selected
    useEffect(() => {
        if (signaturePizzas.length > 0 && !pizzaState[count]) {
            const firstPizza = signaturePizzas[0];
            const updatedPizzaState = [...pizzaState];
            updatedPizzaState[count] = {
                signaturePizza: firstPizza,
            };
            setPizzaState(updatedPizzaState);
        }
    }, [count, signaturePizzas, pizzaState, setPizzaState]);

    const handlePizzaChange = (e) => {
        const selectedCode = e.target.value;
        if (!selectedCode) return;

        const selectedPizza = signaturePizzas.find((p) => p.code === selectedCode);
        if (!selectedPizza) return;

        const updatedPizzaState = [...pizzaState];
        updatedPizzaState[count] = {
            signaturePizza: selectedPizza,
        };
        setPizzaState(updatedPizzaState);
    };

    return (
        <div className="mt-3">
            <div className="accordion" id={`special-pizza-accordion-${count}`}>
                <div className="accordion-item">
                    <h2 className="accordion-header" id={`special-signature-pizza-${count}`}>
                        <button
                            className={`fw-bold fs-6 accordianBtn accordion-button ${isOpen ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen ? 'true' : 'false'}
                            aria-controls="collapseOne"
                        >
                            PIZZA - {count + 1}
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                        aria-labelledby={`special-signature-pizza-${count}`}
                        data-bs-parent={`special-pizza-accordion-${count}`}
                    >
                        <div className="accordion-body">
                            <div className="p-3 my-3 card-background-color card-text-color">
                                <label className="fw-bold mb-2 d-block ">Select Pizza</label>
                                <select
                                    className="form-select form-select-md"
                                    value={pizzaState[count]?.signaturePizza?.code || ""}
                                    onChange={handlePizzaChange}
                                >
                                    <option value="">-- Select Pizza --</option>
                                    {signaturePizzas.map((pizza) => (
                                        <option key={pizza.code} value={pizza.code}>
                                            {pizza.pizzaName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <SpecialDough count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} />
                            <SpecialCheese count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} />
                            <SpecialSpicy count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} />
                            <SpecialSauce count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} />
                            <SpecialCook count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} />
                            <Toppings count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} toppingsData={toppingsData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default SpecialPizzaConfig;