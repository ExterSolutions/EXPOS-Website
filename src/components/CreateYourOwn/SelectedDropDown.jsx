import React, { useEffect } from "react";

export const SelectedCrustDropDown = ({ allIngredients, setCrust, crust }) => {
    // handle Crust On Change
    const handleCrust = (e) => {
        if (e.target.value !== null && e.target.value !== "") {
            const selectedCrust = allIngredients?.crust?.find(
                (data) => data.crustCode === e.target.value
            );
            setCrust({
                crustCode: selectedCrust.crustCode,
                crustName: selectedCrust.crustName,
                price: selectedCrust.price,
            });
        }
    };

    return (
        <>
            <select
                className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
                value={crust?.crustCode}
                onChange={handleCrust}
            >
                {allIngredients?.crust?.map((data) => {
                    return (
                        <option key={data.crustCode} value={data.crustCode}>
                            {data.crustName} - $ {data.price}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

export const SelectedCrustTypeDropDown = ({
    allIngredients,
    setCrustType,
    crustType,
}) => {
    // handle Cheese On Change
    const handleCrustType = (e) => {
        if (e.target.value !== null && e.target.value !== "") {
            const selectedCrustType = allIngredients?.crustType?.find(
                (data) => data.crustTypeCode === e.target.value
            );
            setCrustType({
                crustTypeCode: selectedCrustType?.crustTypeCode,
                crustType: selectedCrustType?.crustType,
                price: selectedCrustType?.price,
            });
        }
    };
    useEffect(() => { }, []);
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={handleCrustType}
            value={crustType?.crustTypeCode}
        >
            {allIngredients?.crustType?.map((data) => {
                return (
                    <option key={data.crustTypeCode} value={data.crustTypeCode}>
                        {data.crustType} - $ {data.price}
                    </option>
                );
            })}
        </select>
    );
};

export const SelectedCheeseDropDown = ({
    allIngredients,
    setCheese,
    cheese,
}) => {
    // handle Cheese On Change
    const handleCheese = (e) => {
        if (e.target.value !== null && e.target.value !== "") {
            const selectedCheese = allIngredients?.cheese?.find(
                (data) => data.cheeseCode === e.target.value
            );
            setCheese({
                cheeseCode: selectedCheese.cheeseCode,
                cheeseName: selectedCheese.cheeseName,
                price: selectedCheese.price,
            });
        }
    };
    useEffect(() => { }, []);
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={handleCheese}
            value={cheese?.cheeseCode}
        >
            {allIngredients?.cheese?.map((data) => {
                return (
                    <option key={data.cheeseCode} value={data.cheeseCode}>
                        {data.cheeseName} - $ {data.price}
                    </option>
                );
            })}
        </select>
    );
};

export const SelectedSpecialbasesDropDown = ({
    allIngredients,
    setSpecialbases,
    specialbases,
    reset,
}) => {
    // handle Specialbases On Change
    const handleSpecialBases = (e) => {
        if (e.target.value !== null && e.target.value !== "") {
            const selectedSb = allIngredients?.specialbases?.find(
                (data) => data.specialbaseCode === e.target.value
            );
            setSpecialbases({
                specialbaseCode: selectedSb.specialbaseCode,
                specialbaseName: selectedSb.specialbaseName,
                price: selectedSb.price,
            });
        } else {
            setSpecialbases({});
        }
    };
    useEffect(() => {
        if (reset) {
            setSpecialbases({});
        }
    }, [reset]);
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={handleSpecialBases}
            value={specialbases?.specialbaseCode ? specialbases?.specialbaseCode : ""}
        >
            <option value={""}>---- Choose Specialbases ----</option>
            {allIngredients?.specialbases?.map((data) => {
                return (
                    <option key={data.specialbaseCode} value={data.specialbaseCode}>
                        {data.specialbaseName} - $ {data.price}
                    </option>
                );
            })}
        </select>
    );
};

// Spices
export const SelectedSpicesDropDown = ({
    allIngredients,
    reset,
    setSpicy,
    spicy,
}) => {
    // handle Spices On Change
    const handleSpices = (e) => {
        if (e.target.value !== null && e.target.value !== "") {
            const selectedSpices = allIngredients?.spices?.find(
                (data) => data.spicyCode === e.target.value
            );
            setSpicy({
                spicyCode: selectedSpices?.spicyCode,
                spicy: selectedSpices?.spicy,
                price: selectedSpices?.price,
            });
        }
    };
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={handleSpices}
            value={spicy?.spicyCode}
        >
            {allIngredients?.spices?.map((data) => {
                return (
                    <option key={data.spicyCode} value={data.spicyCode}>
                        {data.spicy} - $ {data.price}
                    </option>
                );
            })}
        </select>
    );
};

// Sauce
export const SelectedSauceDropDown = ({
    allIngredients,
    reset,
    sauce,
    setSauce,
}) => {
    // handle Sauce On Change
    const handleSauce = (e) => {
        if (e.target.value !== null && e.target.value !== "") {
            const selectedSauce = allIngredients?.sauce?.find(
                (data) => data.sauceCode === e.target.value
            );
            setSauce({
                sauceCode: selectedSauce.sauceCode,
                sauce: selectedSauce.sauce,
                price: selectedSauce.price,
            });
        }
    };
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={handleSauce}
            value={sauce?.sauceCode}
        >
            {allIngredients?.sauce?.map((data) => {
                return (
                    <option key={data.sauceCode} value={data.sauceCode}>
                        {data.sauce} - $ {data.price}
                    </option>
                );
            })}
        </select>
    );
};

// Cook
export const SelectedCookDropDown = ({
    allIngredients,
    reset,
    cook,
    setCook,
}) => {
    // handle Cook On Change
    const handleCook = (e) => {
        if (e.target.value !== null && e.target.value !== "") {
            const selectedCook = allIngredients?.cook?.find(
                (data) => data.cookCode === e.target.value
            );
            setCook({
                cookCode: selectedCook.cookCode,
                cook: selectedCook.cook,
                price: selectedCook.price,
            });
        }
    };
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={handleCook}
            value={cook?.cookCode}
        >
            {allIngredients?.cook?.map((data) => {
                return (
                    <option key={data.cookCode} value={data.cookCode}>
                        {data.cook} - $ {data?.price}
                    </option>
                );
            })}
        </select>
    );
};
