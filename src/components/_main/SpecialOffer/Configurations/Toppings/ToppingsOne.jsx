import React from 'react'
import ToppingsOneSelector from '../../Selector/ToppingsOneSelector';

function ToppingsOne({ count, data, pizzaState, setPizzaState, ToppingsOne, noofToppings, premiumToppingCount }) {
    const handleToppingsOne = (payload) => {
        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            const totalSelected = updatedPizzaState.reduce((acc, pizza) => {
                return acc + (pizza?.toppings?.countAsOneToppings?.length || 0) + ((pizza?.toppings?.countAsTwoToppings?.length || 0) * (premiumToppingCount || 1));
            }, 0);

            if (ToppingsOne.some(obj => obj?.toppingsCode === payload?.toppingsCode)) {
                updatedPizzaState[count] = {
                    ...updatedPizzaState[count],
                    toppings: {
                        ...updatedPizzaState[count].toppings,
                        countAsOneToppings: updatedPizzaState[count].toppings.countAsOneToppings.filter(
                            topping => topping.toppingsCode !== payload?.toppingsCode
                        ),
                    },
                };
            } else {
                const isFree = totalSelected < noofToppings;
                const updatedToppingsOne = {
                    toppingsCode: payload?.toppingsCode,
                    toppingsName: payload?.toppingsName,
                    toppingsPrice: isFree ? "0" : (payload?.toppingsPrice ? data?.price : "0"),
                    toppingsPlacement: payload?.size,
                    amount: isFree ? "0" : data?.price,
                    pizzaIndex: count
                };
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
                    countAsOneToppings: updatedPizzaState[count].toppings.countAsOneToppings.map(topping =>
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
        <ToppingsOneSelector data={data} multiplier={1} ToppingsOne={ToppingsOne} handleTopping={(payload) => handleToppingsOne(payload)} handleSizeChange={(payload) => handleSizeChange(payload)} />
    )
}

export default ToppingsOne