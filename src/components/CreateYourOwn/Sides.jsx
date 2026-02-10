import React, { useEffect, useRef, useState } from "react";

function Sides({ data, setSidesArr, sidesArr, reset, payloadEdit }) {
    const sidesRef = useRef(null);
    const [sideButton, setSideButton] = useState(false);
    const [sideButtonColor, setSideButtonColor] = useState("#606060");
    // Handle Sides
    const handleSides = () => {
        if (sideButton === false) {
            if (sidesRef.current) {
                const combinationData = data?.combination?.find(
                    (data) => data.lineCode === sidesRef.current.value
                );
                const sidesObject = {
                    sideCode: data?.sideCode,
                    sideName: data?.sideName,
                    sideType: data?.type,
                    lineCode: combinationData?.lineCode,
                    sidePrice: combinationData?.price,
                    sideSize: combinationData?.size,
                    quantity: 1,
                    totalPrice: Number(combinationData?.price).toFixed(2),
                };
                setSidesArr((prev) => [...prev, sidesObject]);
                setSideButton(true);
                setSideButtonColor("#e40000");
            }
        } else {
            setSideButton(false);
            setSideButtonColor("#606060");
            sidesRef.current.value = data?.combination[0]?.lineCode;
            setSidesArr((prev) =>
                prev.filter((item) => item.sideCode !== data.sideCode)
            );
        }
    };
    // Handle Combinations
    const handleCombination = () => {
        if (sidesRef.current) {
            const value = data?.combination?.find(
                (code) => code.lineCode === sidesRef.current.value
            );
            const updatedCombination = sidesArr?.map((sides) => {
                if (sides.sideCode === data.sideCode) {
                    return {
                        ...sides,
                        lineCode: value?.lineCode,
                        sidePrice: value?.price,
                        sideSize: value?.size,
                    };
                }
                return sides;
            });
            setSidesArr(updatedCombination);
        }
    };
    useEffect(() => {
        if (reset) {
            setSideButton(false);
            setSideButtonColor("#606060");
            sidesRef.current.value = data?.combination[0]?.lineCode;
        }
    }, [reset]);

    // Populate - Edit
    useEffect(() => {
        if (payloadEdit) {
            payloadEdit?.config?.sides.map((items) => {
                if (items?.sideCode === data?.sideCode) {
                    setSideButton(true);
                    setSideButtonColor("#e40000");
                    sidesRef.current.value = items?.lineCode;
                }
            });
        }
    }, [payloadEdit]);

    return (
        <div
            className="row gx-3 m-0 p-0 border-bottom align-items-center py-1 py-md-0"
            key={data.sideCode}
        >
            <span className="col-lg-6 col-md-6 col-sm-12 pb-lg-0 pt-2 pt-md-0">
                {data.sideName}{" "}
                <span className="mx-2" style={{ textTransform: "capitalize" }}>
                    ( {data.type} )
                </span>
            </span>
            <div className="col-lg-6 col-md-6 col-sm-12 pb-1">
                <div className="row gx-3 justify-content-lg-end justify-content-between py-2">
                    <select
                        className="col-lg-8 col-md-6 col-sm-6 mx-2 select-input bgPrimaryBlackColor primaryWhiteColor"
                        ref={sidesRef}
                        onChange={handleCombination}
                    >
                        {data?.combination?.map((combination) => {
                            return (
                                <option key={combination.lineCode} value={combination.lineCode}>
                                    {combination.size} - ${combination.price}
                                </option>
                            );
                        })}
                    </select>
                    <button
                        type="button"
                        className="col-lg-4 col-md-6 col-sm-6 addbtn btn btn-sm px-4 text-white"
                        onClick={handleSides}
                        style={{
                            backgroundColor: sideButtonColor,
                            transition: ".3s",
                            width: "100px",
                        }}
                    >
                        {sideButton === false ? "Add" : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sides;
