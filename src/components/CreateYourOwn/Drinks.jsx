import React, { useEffect, useState } from "react";

function Drinks({ data, setDrinksArr, drinksArr, reset, payloadEdit }) {
    const [drinksButtonColor, setDrinksButtonColor] = useState("#606060");
    const [drinksButton, setDrinksButton] = useState(false);
    const [qauntity, setQuantity] = useState(1);
    // Handle Drinks
    const handleDrinks = () => {
        if (drinksButton === false) {
            let totalPrice = Number(qauntity) * Number(data.price);
            const drinksObject = {
                drinksCode: data.softdrinkCode,
                drinksName: data.softDrinksName,
                drinksPrice: data.price,
                quantity: qauntity,
                totalPrice: totalPrice.toFixed(2),
            };
            setDrinksArr((prev) => [...prev, drinksObject]);
            setDrinksButton(true);
            setDrinksButtonColor("#e40000");
        } else {
            setDrinksButton(false);
            setDrinksButtonColor("#606060");
            setQuantity(1);
            setDrinksArr((prev) =>
                prev.filter((item) => item.drinksCode !== data.softdrinkCode)
            );
        }
    };
    // handle Quantity and TotalPrice
    const handleQuantity = (e) => {
        if (e.target.value > 0) {
            setQuantity(e.target.value);
            const updatedQuantity = drinksArr.map((drinks) => {
                if (drinks.drinksCode === data.softdrinkCode) {
                    return {
                        ...drinks,
                        quantity: e.target.value,
                    };
                }
                return drinks;
            });
            if (updatedQuantity) {
                const updatedTotalPrice = updatedQuantity.map((drinks) => {
                    if (drinks.drinksCode === data.softdrinkCode) {
                        return {
                            ...drinks,
                            totalPrice: (
                                Number(drinks.quantity) * Number(drinks.drinksPrice)
                            ).toFixed(2),
                        };
                    }
                    return drinks;
                });
                setDrinksArr(updatedTotalPrice);
            }
        }
    };

    useEffect(() => {
        if (reset) {
            setQuantity(1);
            setDrinksButton(false);
            setDrinksButtonColor("#606060");
        }
    }, [reset]);

    // Populate - Edit
    useEffect(() => {
        if (payloadEdit) {
            payloadEdit?.config?.drinks.map((items) => {
                if (items?.drinksCode === data?.softdrinkCode) {
                    setDrinksButton(true);
                    setDrinksButtonColor("#e40000");
                    setQuantity(items?.qauntity);
                }
            });
        }
    }, [payloadEdit]);

    return (
        <div
            className="row gx-3 m-0 p-0 border-bottom align-items-center py-1 py-md-0"
            key={data.softdrinkCode}
        >
            <span className="col-lg-8 col-md-6 col-sm-12 pb-lg-0 pt-2 pt-md-0">
                {data.softDrinksName}
                <span className="mx-2">( $ {data.price} )</span>
            </span>
            <div className="col-lg-4 col-md-6 col-sm-12 pb-1">
                <div className="input-group w-100 py-2 text-end">
                    <input
                        type="number"
                        className="form-control text-end bgPrimaryBlackColor primaryWhiteColor"
                        step={0.0}
                        value={qauntity}
                        onChange={handleQuantity}
                    />

                    <button
                        type="button"
                        className="addbtn btn btn-sm text-white"
                        onClick={(e) => handleDrinks(e, data.softdrinkCode)}
                        style={{
                            backgroundColor: drinksButtonColor,
                            transition: ".3s",
                            width: "100px",
                        }}
                    >
                        {drinksButton === false ? "Add" : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Drinks;
