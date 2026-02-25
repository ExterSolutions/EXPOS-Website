import React from "react";
import ToppingsTwoSelector from "../../Selector/ToppingsTwoSelector";

function ToppingsTwo({
  count,
  data,
  pizzaState,
  setPizzaState,
  ToppingsTwo,
  noofToppings,
  premiumToppingCount
}) {
  const handleToppingsTwo = (payload) => {
    setPizzaState((prev) => {
      const updatedPizzaState = [...prev];
      const totalSelected = updatedPizzaState.reduce((acc, pizza) => {
        return acc + (pizza?.toppings?.countAsOneToppings?.length || 0) + ((pizza?.toppings?.countAsTwoToppings?.length || 0) * (premiumToppingCount || 1));
      }, 0);

      if (ToppingsTwo.some((obj) => obj?.toppingsCode === payload?.toppingsCode)) {
        updatedPizzaState[count] = {
          ...updatedPizzaState[count],
          toppings: {
            ...updatedPizzaState[count].toppings,
            countAsTwoToppings: updatedPizzaState[count].toppings.countAsTwoToppings.filter(
              (topping) => topping.toppingsCode !== payload?.toppingsCode
            ),
          },
        };
      } else {
        const isFree = (totalSelected + (premiumToppingCount || 1)) <= noofToppings;
        const updatedToppingsTwo = {
          toppingsCode: payload?.toppingsCode,
          toppingsName: payload?.toppingsName,
          toppingsPrice: isFree ? "0" : (payload?.toppingsPrice ? data?.price : "0"),
          toppingsPlacement: payload?.size,
          amount: isFree ? "0" : data?.price,
          pizzaIndex: count,
        };
        updatedPizzaState[count] = {
          ...updatedPizzaState[count],
          toppings: {
            ...updatedPizzaState[count].toppings,
            countAsTwoToppings: [
              ...updatedPizzaState[count].toppings.countAsTwoToppings,
              updatedToppingsTwo,
            ],
          },
        };
      }
      return updatedPizzaState;
    });
  };

  const handleSizeChange = (payload) => {
    setPizzaState((prev) => {
      const updatedPizzaState = [...prev];
      updatedPizzaState[count] = {
        ...updatedPizzaState[count],
        toppings: {
          ...updatedPizzaState[count].toppings,
          countAsTwoToppings: updatedPizzaState[count].toppings.countAsTwoToppings.map(
            (topping) =>
              topping.toppingsCode === payload.toppingsCode
                ? { ...topping, toppingsPlacement: payload.toppingsPlacement }
                : topping
          ),
        },
      };
      return updatedPizzaState;
    });
  };

  return (
    <ToppingsTwoSelector
      data={data}
      multiplier={premiumToppingCount}
      ToppingsTwo={ToppingsTwo}
      handleTopping={(payload) => handleToppingsTwo(payload)}
      handleSizeChange={(payload) => handleSizeChange(payload)}
    />
  );
}

export default ToppingsTwo;
