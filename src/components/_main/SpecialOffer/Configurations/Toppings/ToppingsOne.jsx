import React from 'react'
import ToppingsOneSelector from '../../Selector/ToppingsOneSelector';

function ToppingsOne({ count, data, pizzaState, setPizzaState, ToppingsOne }) {
    const handleToppingsOne = (payload) => {
        if (ToppingsOne.some(obj => obj?.toppingsCode === payload?.toppingsCode)) {
            // Remove the topping
            const updatedPizzaState = [...pizzaState];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                toppings: {
                    ...updatedPizzaState[count].toppings,
                    countAsOneToppings: updatedPizzaState[count].toppings.countAsOneToppings.filter(
                        topping => topping.toppingsCode !== payload?.toppingsCode
                    ),
                },
            };
            setPizzaState(updatedPizzaState);
        } else {
            const updatedToppingsOne = {
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
                    countAsOneToppings: [
                        ...updatedPizzaState[count].toppings.countAsOneToppings,
                        updatedToppingsOne,
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
                countAsOneToppings: updatedPizzaState[count].toppings.countAsOneToppings.map(topping =>
                    topping.toppingsCode === payload.toppingsCode
                        ? { ...topping, toppingsPlacement: payload.toppingsPlacement } // Update placement
                        : topping // Keep other toppings as is
                ),
            },
        };
        setPizzaState(updatedPizzaState);
    };


    return (
        <ToppingsOneSelector data={data} ToppingsOne={ToppingsOne} handleTopping={(payload) => handleToppingsOne(payload)} handleSizeChange={(payload) => handleSizeChange(payload)} />
    )
}

export default ToppingsOne