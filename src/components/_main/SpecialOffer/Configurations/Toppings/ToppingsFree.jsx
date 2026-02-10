import React from 'react'
import ToppingsFreeSelector from '../../Selector/ToppingsFreeSelector'

function ToppingsFree({ count, data, pizzaState, setPizzaState, ToppingsFree }) {
    const handleToppingsFree = (payload) => {
        if (ToppingsFree.some(obj => obj?.toppingsCode === payload?.toppingsCode)) {
            // Remove the topping
            const updatedPizzaState = [...pizzaState];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                toppings: {
                    ...updatedPizzaState[count].toppings,
                    freeToppings: updatedPizzaState[count].toppings.freeToppings.filter(
                        topping => topping.toppingsCode !== payload?.toppingsCode
                    ),
                },
            };
            setPizzaState(updatedPizzaState);
        } else {
            const updatedToppingsFree = {
                toppingsCode: payload?.toppingsCode,
                toppingsName: payload?.toppingsName,
                toppingsPrice: payload?.toppingsPrice ? data?.price : "0",
                toppingsPlacement: payload?.size,
                amount: data?.price,
                pizzaIndex: count
            };
            const updatedPizzaState = [...pizzaState];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                toppings: {
                    ...updatedPizzaState[count].toppings,
                    freeToppings: [
                        ...updatedPizzaState[count].toppings.freeToppings,
                        updatedToppingsFree,
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
                freeToppings: updatedPizzaState[count].toppings.freeToppings.map(topping =>
                    topping.toppingsCode === payload.toppingsCode
                        ? { ...topping, toppingsPlacement: payload.toppingsPlacement } // Update placement
                        : topping // Keep other toppings as is
                ),
            },
        };
        setPizzaState(updatedPizzaState);
    };

    return (
        <ToppingsFreeSelector data={data} ToppingsFree={ToppingsFree} handleTopping={(payload) => handleToppingsFree(payload)} handleSizeChange={(payload) => handleSizeChange(payload)} />
    )
}

export default ToppingsFree