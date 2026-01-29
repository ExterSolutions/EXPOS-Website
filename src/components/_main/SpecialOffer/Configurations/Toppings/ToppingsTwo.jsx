import React from "react";
import ToppingsTwoSelector from "../../Selector/ToppingsTwoSelector";

function ToppingsTwo({
  count,
  data,
  pizzaState,
  setPizzaState,
  ToppingsTwo, 
}) {
  const handleToppingsTwo = (payload) => {
    if (
      ToppingsTwo.some((obj) => obj?.toppingsCode === payload?.toppingsCode)
    ) {
      // Remove the topping
      const updatedPizzaState = [...pizzaState];
      updatedPizzaState[count] = {
        ...updatedPizzaState[count],
        toppings: {
          ...updatedPizzaState[count].toppings,
          countAsTwoToppings: updatedPizzaState[
            count
          ].toppings.countAsTwoToppings.filter(
            (topping) => topping.toppingsCode !== payload?.toppingsCode
          ),
        },
      };
      setPizzaState(updatedPizzaState);
    } else {
      const updatedToppingsTwo = {
        toppingsCode: payload?.toppingsCode,
        toppingsName: payload?.toppingsName,
        toppingsPrice: payload?.toppingsPrice ? data?.price : "0",
        toppingsPlacement: payload?.size,
        amount: data?.price,
        pizzaIndex: count,
      };
      const updatedPizzaState = [...pizzaState];
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
      setPizzaState(updatedPizzaState);
    }
  };

  const handleSizeChange = (payload) => {
    // Update the toppingsPlacement for a particular toppingsCode
    const updatedPizzaState = [...pizzaState];
    updatedPizzaState[count] = {
      ...updatedPizzaState[count],
      toppings: {
        ...updatedPizzaState[count].toppings,
        countAsTwoToppings: updatedPizzaState[
          count
        ].toppings.countAsTwoToppings.map(
          (topping) =>
            topping.toppingsCode === payload.toppingsCode
              ? { ...topping, toppingsPlacement: payload.toppingsPlacement } // Update placement
              : topping // Keep other toppings as is
        ),
      },
    };
    setPizzaState(updatedPizzaState);
  };

  return (
    <ToppingsTwoSelector
      data={data}
      ToppingsTwo={ToppingsTwo}
      handleTopping={(payload) => handleToppingsTwo(payload)}
      handleSizeChange={(payload) => handleSizeChange(payload)} 
    />
  );
}

export default ToppingsTwo;
