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
        value={pizzaState[count - 1]?.crust?.crustCode}
        onChange={(e) => handleCrust(e, count)}
      >
        {getSpecialData?.crust?.map((data) => {
          return (
            <option key={data.code} value={data.code}>
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
        value={pizzaState[count - 1]?.crustType?.crustTypeCode}
        onChange={(e) => handleCrustTypeChange(e, count)}
      >
        {getSpecialData?.crustType?.map((data) => {
          return (
            <option key={data.crustTypeCode} value={data.crustTypeCode}>
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
      {getSpecialData?.cheese?.map((data) => {
        return (
          <option key={data.code} value={data.code}>
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
        value={
          pizzaState[count - 1]?.specialBases?.specialbaseCode
            ? pizzaState[count - 1]?.specialBases?.specialbaseCode
            : ""
        }
      >
        <option value={""}>---- Choose Specialbases ----</option>
        {getSpecialData?.specialbases?.map((data) => {
          return (
            <option key={data.code} value={data.code}>
              {data.specialbaseName} - $ {data.price}
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
      value={pizzaState[count - 1]?.spices?.spicyCode}
    >
      {getSpecialData?.spices?.map((data) => {
        return (
          <option key={data?.spicyCode} value={data?.spicyCode}>
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
      value={pizzaState[count - 1]?.sauce?.sauceCode}
    >
      {getSpecialData?.sauce?.map((data) => {
        return (
          <option key={data?.sauceCode} value={data?.sauceCode}>
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
      {getSpecialData?.cook?.map((data) => {
        return (
          <option key={data?.cookCode} value={data?.cookCode}>
            {data?.cook} - $ {data?.price}
          </option>
        );
      })}
    </select>
  );
};
