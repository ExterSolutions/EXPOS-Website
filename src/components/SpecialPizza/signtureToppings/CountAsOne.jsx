import React, { useEffect, useRef, useState } from "react";

function CountAsOne({
    count,
    data,
    pizzaState,
    setPizzaState,
    reset,
    payloadEdit,
}) {
    const oneTpsRef = useRef(null);
    const [tpsButton, setTpsButton] = useState(false);
    const [tpsButtonColor, setTpsButttonColor] = useState("#606060");

    const handleOneToppings = () => {
        if (tpsButton === false) {
            if (oneTpsRef.current) {
                const tpsObject = {
                    toppingsCode: data?.toppingsCode,
                    toppingsName: data?.toppingsName,
                    toppingsPrice: data?.price ? data?.price : 0,
                    toppingsPlacement: oneTpsRef.current.value,
                    amount: data?.price,
                    pizzaIndex: count - 1,
                };
                let arr = [...pizzaState];
                arr[count - 1].toppings.countAsOneToppings = [
                    ...arr[count - 1].toppings.countAsOneToppings,
                    tpsObject,
                ];
                setPizzaState(arr);
                setTpsButton(true);
                setTpsButttonColor("#e40000");
            }
        } else {
            setTpsButton(false);
            setTpsButttonColor("#606060");
            oneTpsRef.current.value = "whole";
            const updatedArr = pizzaState[
                count - 1
            ].toppings.countAsOneToppings.filter(
                (item) => item.toppingsCode !== data.toppingsCode
            );
            let arr = [...pizzaState];
            arr[count - 1].toppings = {
                ...arr[count - 1].toppings,
                countAsOneToppings: updatedArr,
            };
            setPizzaState(arr);
        }
    };

    const handleOneTpsPlacement = () => {
        if (oneTpsRef.current) {
            const filteredArr = pizzaState[count - 1].toppings.countAsOneToppings.map(
                (items) => {
                    if (items.toppingsCode === data.toppingsCode) {
                        return {
                            ...items,
                            toppingsPlacement: oneTpsRef.current.value,
                        };
                    }
                    return items;
                }
            );
            let arr = [...pizzaState];
            arr[count - 1].toppings = {
                ...arr[count - 1].toppings,
                countAsOneToppings: filteredArr,
            };
            setPizzaState(arr);
        }
    };

    // ---- UseEffect ----
    // UseEffect For Reset
    useEffect(() => {
        if (reset) {
            setTpsButton(false);
            setTpsButttonColor("#606060");
            oneTpsRef.current.value = "whole";
        }
    }, [reset]);
    // Populate - Edit
    useEffect(() => {
        if (
            payloadEdit &&
            payloadEdit !== undefined &&
            payloadEdit.productType === "signature_pizza"
        ) {
            payloadEdit?.config?.pizza[count - 1]?.toppings?.countAsOneToppings.map(
                (items) => {
                    if (items?.toppingsCode === data?.toppingsCode) {
                        setTpsButton(true);
                        setTpsButttonColor("#e40000");
                        oneTpsRef.current.value = items?.toppingsPlacement;
                    }
                }
            );
        }
    }, [payloadEdit]);

    useEffect(() => {
        let pizza = pizzaState[0];
        if (
            pizza &&
            pizza !== undefined
        ) {
            pizza?.toppings?.countAsOneToppings?.map(
                (items) => {
                    if (items?.toppingsCode === data?.toppingsCode) {
                        setTpsButton(true);
                        setTpsButttonColor("#e40000");
                        oneTpsRef.current.value = items?.toppingsPlacement;
                    }
                }
            );
        }

    }, [pizzaState])

    return (
        <div
            className="d-flex justify-content-center align-items-center flex-column py-3 border-bottom"
            key={data.toppingsCode}
        >
            <div className="w-100 d-flex flex-row justify-content-between">
                <span className="mb-3 text-left mx-1">{data.toppingsName}</span>
                <span className="mb-3 text-end mx-1">$ {data.price}</span>
            </div>
            <div className="w-100 d-flex flex-row justify-content-between">
                <select
                    className="select-input w-auto bgPrimaryBlackColor primaryWhiteColor"
                    ref={oneTpsRef}
                    onChange={handleOneTpsPlacement}
                >
                    <option value="whole">Whole</option>
                    <option value="lefthalf">Left Half</option>
                    <option value="righthalf">Right Half</option>
                    <option value="1/4">1/4</option>
                </select>
                <button
                    type="button"
                    className="btn btn-sm px-4 text-white"
                    onClick={handleOneToppings}
                    style={{
                        backgroundColor: tpsButtonColor,
                        transition: ".3s",
                        width: "100px",
                    }}
                >
                    {tpsButton === false ? "Add" : "Remove"}
                </button>
            </div>
        </div>
    );
}

export default CountAsOne;
