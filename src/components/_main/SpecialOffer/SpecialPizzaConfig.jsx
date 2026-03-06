import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import SpecialDough from "./Configurations/Dough";
import SpecialCheese from "./Configurations/Cheese";
import SpecialSpicy from "./Configurations/Spicy";
import SpecialSauce from "./Configurations/Sauce";
import SpecialCook from "./Configurations/Dough/Cook";
import Toppings from "./Configurations/Toppings";

function SpecialPizzaConfig({
  count,
  specialOfferData,
  pizzaState,
  setPizzaState,
  toppingsData,
  activeAccordion,
  toggleAccordion,
}) {
  console.log('specialOfferData',specialOfferData)
  const [isOpen, setIsOpen] = useState(true);
  const signaturePizzas = specialOfferData?.signaturePizzas ?? [];
  const handlePizzaChange = (e) => {
    const selectedCode = e.target.value;
    if (!selectedCode) return;

    const selectedPizza = signaturePizzas.find((p) => p.code === selectedCode);
    if (!selectedPizza) return;

    setPizzaState((prev) => {
      const newState = [...prev];
      newState[count] = {
        ...newState[count],
        signaturePizza: selectedPizza,
      };
      return newState;
    });
  };
  console.log("specialOfferData", specialOfferData);
  return (
    <div className="mt-3">
      <div
        className="topping-header-bar mb-1"
        style={{ backgroundColor: "var(--primary)" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>PIZZA - {count + 1}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      <div
        className={`mt-2 ${isOpen ? "d-block" : "d-none"} border p-3 rounded-2`}
      >
        <SpecialCheese
          count={count}
          pizzaState={pizzaState}
          setPizzaState={setPizzaState}
          specialOfferData={specialOfferData}
        />
        <SpecialDough
          count={count}
          pizzaState={pizzaState}
          setPizzaState={setPizzaState}
          specialOfferData={specialOfferData}
        />
        <SpecialCook
          count={count}
          pizzaState={pizzaState}
          setPizzaState={setPizzaState}
          specialOfferData={specialOfferData}
        />
        <SpecialSauce
          count={count}
          pizzaState={pizzaState}
          setPizzaState={setPizzaState}
          specialOfferData={specialOfferData}
        />
        <SpecialSpicy
          count={count}
          pizzaState={pizzaState}
          setPizzaState={setPizzaState}
          specialOfferData={specialOfferData}
        />
        <Toppings
          count={count}
          pizzaState={pizzaState}
          setPizzaState={setPizzaState}
          toppingsData={toppingsData}
          noofToppings={specialOfferData?.noofToppings || 0}
          activeAccordion={activeAccordion}
          toggleAccordion={toggleAccordion}
        />
      </div>
    </div>
  );
}

export default SpecialPizzaConfig;
