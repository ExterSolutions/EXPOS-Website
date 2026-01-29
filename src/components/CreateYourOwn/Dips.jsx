import React, { useEffect, useState } from "react";

function Dips({ data, reset, setDipsArr, dipsArr, payloadEdit }) {
    const [dispButtonColor, setDispButtonColor] = useState("#606060");
    const [dipsButton, setDipsButton] = useState(false);
    const [qauntity, setQuantity] = useState(1);
    // Handle Drinks
    const handleDips = () => {
        if (dipsButton === false) {
            let totalPrice = Number(qauntity) * Number(data.price);
            const dipsObject = {
                dipsCode: data.dipsCode,
                dipsName: data.dipsName,
                dipsPrice: data.price,
                quantity: qauntity,
                totalPrice: totalPrice.toFixed(2),
            };
            setDipsArr((prev) => [...prev, dipsObject]);
            setDipsButton(true);
            setDispButtonColor("#e40000");
        } else {
            setDipsButton(false);
            setDispButtonColor("#606060");
            setQuantity(1);
            setDipsArr((prev) =>
                prev.filter((item) => item.dipsCode !== data.dipsCode)
            );
        }
    };
    // handle Quantity and TotalPrice
    const handleQuantity = (e) => {
        if (e.target.value >= 1) {
            setQuantity(e.target.value);
            const updatedQuantity = dipsArr.map((dips) => {
                if (dips.dipsCode === data.dipsCode) {
                    return {
                        ...dips,
                        quantity: e.target.value,
                    };
                }
                return dips;
            });
            if (updatedQuantity) {
                const updatedTotalPrice = updatedQuantity.map((dips) => {
                    if (dips.dipsCode === data.dipsCode) {
                        return {
                            ...dips,
                            totalPrice: (
                                Number(dips.quantity) * Number(dips.dipsPrice)
                            ).toFixed(2),
                        };
                    }
                    return dips;
                });
                setDipsArr(updatedTotalPrice);
            }
        }
    };

    useEffect(() => {
        if (reset) {
            setQuantity(1);
            setDipsButton(false);
            setDispButtonColor("#606060");
        }
    }, [reset]);

    // Populate - Edit
    useEffect(() => {
        if (payloadEdit) {
            payloadEdit?.config?.dips.map((items) => {
                if (items?.dipsCode === data?.dipsCode) {
                    setDipsButton(true);
                    setDispButtonColor("#e40000");
                    setQuantity(items?.qauntity);
                }
            });
        }
    }, [payloadEdit]);

    return (
        <div
            className="row gx-3 m-0 p-0 border-bottom align-items-center py-1 py-md-0"
            key={data.dipsCode}
        >
            <span className="col-lg-8 col-md-6 col-sm-12 pb-lg-0 pt-2 pt-md-0">
                {data.dipsName} <span className="mx-2">( $ {data.price} )</span>
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
                        className="addbtn btn btn-sm text-white text-center"
                        onClick={(e) => handleDips(e, data.dipsCode)}
                        style={{
                            backgroundColor: dispButtonColor,
                            transition: ".3s",
                            width: "100px",
                        }}
                    >
                        {dipsButton === false ? "Add" : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dips;
