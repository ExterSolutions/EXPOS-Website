import React from "react";

// SpecialPizza - Crust
export const SpecialCrustDropdown = ({
    getSpecialData,
    pizzaState,
    handleCrust,
    count,
}) => {


    return (
        <>
            <select
                className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
                value={pizzaState[count - 1]?.crust?.code}
                onChange={(e) => handleCrust(e, count)}
            >
                {getSpecialData?.crusts?.map((data) => {
                    return (
                        <option selected={data?.code === getSpecialData?.crust?.code} key={data.code} value={data.code}>
                            {data.crustName} - $ {data.price}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

// SpecialPizza - CrustType
export const SpecialCrustTypeDropdown = ({
    getSpecialData,
    pizzaState,
    handleCrustTypeChange,
    count,
}) => {
    return (
        <>
            <select
                className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
                value={pizzaState[count - 1]?.crust_type?.code}
                onChange={(e) => handleCrustTypeChange(e, count)}
            >
                {getSpecialData?.crustType?.map((data) => {
                    return (
                        <option selected={data?.crustTypeCode === getSpecialData?.crust_type?.code}  key={data.crustTypeCode} value={data.crustTypeCode}>
                            {data.crustType} - $ {data.price}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

// SpecialPizza - Cheese
export const SpecialCheeseDropdown = ({
    getSpecialData,
    count,
    pizzaState,
    handleCheese,
}) => {
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={(e) => handleCheese(e, count)}
            value={pizzaState[count - 1]?.cheese?.cheeseCode}
        >
            {getSpecialData?.cheeses?.map((data) => {
                return (
                    <option selected={data?.code === getSpecialData?.cheese?.code} key={data.code} value={data.code}>
                        {data.cheeseName} - $ {data.price}
                    </option>
                );
            })}
        </select>
    );
};

// SpecialPizza - SpecialBases
export const SpecialbasesDropDown = ({
    getSpecialData,
    count,
    pizzaState,
    handleSpecialbases,
}) => {
    return (
        <>
            <select
                className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
                onChange={(e) => {
                    handleSpecialbases(e, count);
                }}
                value={pizzaState[count - 1]?.specialBases?.code}
            >
                <option value={""}>---- Choose Specialbases ----</option>
                {getSpecialData?.specialBases?.map((data) => {
                    return (
                        <option selected={data?.code === getSpecialData?.special_base?.code} key={data?.code} value={data?.code}>
                            {data?.specialbaseName} - $ {data?.price}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

// SpecialPizza - Spices
export const SpecialSpicesDropdown = ({
    getSpecialData,
    count,
    pizzaState,
    handleSpicy,
}) => {
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={(e) => handleSpicy(e, count)}
            value={pizzaState[count - 1]?.spicy?.spicyCode}
        >
            {getSpecialData?.spicy?.map((data) => {
                return (
                    <option selected={data?.spicyCode === getSpecialData?.spices?.code} key={data?.spicyCode} value={data?.spicyCode}>
                        {data?.spicy} - $ {data?.price}
                    </option>
                );
            })}
        </select>
    );
};

// SpecialPizza - Sauce
export const SpecialSauceDropdown = ({
    getSpecialData,
    handleSauce,
    count,
    pizzaState,
}) => {
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={(e) => handleSauce(e, count)}
            value={pizzaState[count - 1]?.sauces?.sauceCode}
        >
            {getSpecialData?.sauces?.map((data) => {
                return (
                    <option selected={data?.sauceCode === getSpecialData?.sauce?.code} key={data?.sauceCode} value={data?.sauceCode}>
                        {data?.sauce} - $ {data?.price}
                    </option>
                );
            })}
        </select>
    );
};

// SpecialPizza - Cook
export const SpecialCookDropdown = ({
    getSpecialData,
    handleCook,
    count,
    pizzaState,
}) => {
    return (
        <select
            className="select-input form-drop w-100 bgPrimaryBlackColor primaryWhiteColor"
            onChange={(e) => handleCook(e, count)}
            value={pizzaState[count - 1]?.cook?.cookCode}
        >
            {getSpecialData?.cooks?.map((data) => {
                return (
                    <option  selected={data?.cookCode === getSpecialData?.cook?.code}  key={data?.cookCode} value={data?.cookCode}>
                        {data?.cook} - $ {data?.price}
                    </option>
                );
            })}
        </select>
    );
};
