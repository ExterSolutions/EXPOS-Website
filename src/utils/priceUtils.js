export const calculateOfferPrice = ({
    offerData,
    selectedSize,
    pizzaSelections = [],
    selectedDips = [],
}) => {
    if (!offerData || !selectedSize) return 0;

    const basePrice = selectedSize !== null && parseFloat(selectedSize?.price ?? 0);

    let pizzaExtras = 0;

    pizzaSelections.forEach((pizza) => {

        // Each pizza’s additional cost
        const { crust, cheese, crustType, specialBases, sauce, cook, spicy } = pizza;

        // Base-level extras
        [crust, cheese, crustType, specialBases, sauce, cook, spicy].forEach((opt) => {
            if (opt?.price) pizzaExtras += parseFloat(opt.price ?? 0);
        });

        const toppings = pizza.toppings;
        if (toppings !== undefined) {
            // Toppings (countAsTwo)
            if (toppings.countAsTwoToppings !== undefined && toppings.countAsTwoToppings?.length > 0) {
                toppings.countAsTwoToppings.forEach((t) => {
                    pizzaExtras += parseFloat(t.toppingsPrice ?? 0);
                });
            }
            // Toppings (countAsOne)
            if (toppings.countAsOneToppings !== undefined && toppings.countAsOneToppings?.length > 0) {
                toppings.countAsOneToppings.forEach((t) => {
                    pizzaExtras += parseFloat(t.toppingsPrice ?? 0);
                });
            }
        }
    });

    // Dips (sum totalPrice from each)
    const dipsPrice = selectedDips.reduce(
        (sum, d) => sum + parseFloat(d.totalPrice ?? 0),
        0
    );

    const total = basePrice + pizzaExtras + dipsPrice;

    return total.toFixed(2);
};
