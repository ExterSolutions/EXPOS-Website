import React, { useEffect, useRef } from "react";

export const SelectedDrinksDropdown = ({
    drinksType,
    count,
    selectedDrinksTypeArr,
    setSelectedDrinksTypeArr,
    selectedDrinks,
    reset,
}) => {
    const selectedDRef = useRef(null);

    // Handle DrinksType
    const handleDrinksType = () => {
        if (selectedDRef.current) {
            let arr = [...selectedDrinksTypeArr];
            arr[count - 1] =
                selectedDRef.current.value !== undefined ||
                    selectedDRef.current.value !== null
                    ? selectedDRef.current.value
                    : drinksType[0];
            setSelectedDrinksTypeArr(arr);
        }
    };

    // ------- UseEffect -------
    // UseEffect - Set Default Arr Values
    useEffect(() => {
        const arr = new Array(count).fill(drinksType[0]);
        setSelectedDrinksTypeArr(arr);
    }, [drinksType]);
    // UseEffect - Reset All Fields
    useEffect(() => {
        if (reset) {
            selectedDRef.current.value = drinksType[0];
            const arr = new Array(count).fill(drinksType[0]);
            setSelectedDrinksTypeArr(arr);
        }
    }, [reset]);

    return (
        <>
            <div className="col-lg-6 col-md-6 col-sm-12">
                <p className="text-start mb-3">
                    {selectedDrinks?.drinksType.charAt(0).toUpperCase() +
                        selectedDrinks?.drinksType.slice(1).toLowerCase()}{" "}
                    ( {count} )
                </p>
                {selectedDrinks?.softdrinkCode === "SFD_1" ? (
                    <select
                        className="select-input form-drop w-100 mb-4 primaryWhiteColor bgPrimaryBlackColor"
                        value={"coke"}
                        onChange={handleDrinksType}
                        ref={selectedDRef}
                    >
                        <option value="coke">Coke</option>
                    </select>
                ) : (
                    <select
                        className="select-input form-drop w-100 mb-4 primaryWhiteColor bgPrimaryBlackColor"
                        value={selectedDrinksTypeArr[count - 1]}
                        onChange={handleDrinksType}
                        ref={selectedDRef}
                    >
                        {drinksType?.map((data, index) => {
                            return (
                                <option key={index} value={data}>
                                    {data}
                                </option>
                            );
                        })}
                    </select>
                )}
            </div>
        </>
    );
};
