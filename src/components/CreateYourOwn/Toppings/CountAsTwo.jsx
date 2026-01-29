import React, { useEffect, useRef, useState } from "react";

function CountAsTwo({
  data,
  setCountTwoToppingsArr,
  countTwoToppingsArr,
  reset,
  payloadEdit,
}) {
  const tpsRef = useRef(null);
  const [tpsButton, setTpsButton] = useState(false);
  const [tpsButtonColor, setTpsButttonColor] = useState("#606060");

  // Handle Toppings When Add Button
  const handleTwoToppings = () => {
    if (tpsButton === false) {
      if (tpsRef.current) {
        const toppingsObject = {
          toppingsCode: data?.toppingsCode,
          toppingsName: data?.toppingsName,
          toppingsPrice: data?.price ? data?.price : 0,
          toppingsPlacement: tpsRef.current.value,
          amount: data?.price ? data?.price : 0,
        };
        setCountTwoToppingsArr((prev) => [...prev, toppingsObject]);
        setTpsButton(true);
        setTpsButttonColor("#e40000");
      }
    } else {
      setTpsButton(false);
      setTpsButttonColor("#606060");
      tpsRef.current.value = "whole";
      setCountTwoToppingsArr((prev) =>
        prev.filter((item) => item.toppingsCode !== data.toppingsCode)
      );
    }
  };
  // Handle Placement And Update Array
  const handlePlacement = () => {
    const updatedData = countTwoToppingsArr.map((tps) => {
      if (tps.toppingsCode === data.toppingsCode) {
        return {
          ...tps,
          toppingsPlacement: tpsRef.current.value,
        };
      }
      return tps;
    });
    setCountTwoToppingsArr(updatedData);
  };

  useEffect(() => {
    if (reset) {
      setTpsButton(false);
      setTpsButttonColor("#606060");
      tpsRef.current.value = "whole";
    }
  }, [reset]);

  // Populate - Edit
  useEffect(() => {
    if (payloadEdit) {
      payloadEdit?.config?.pizza[0]?.toppings?.countAsTwoToppings.map(
        (items) => {
          if (items?.toppingsCode === data?.toppingsCode) {
            setTpsButton(true);
            setTpsButttonColor("#e40000");
            tpsRef.current.value = items?.toppingsPlacement;
          }
        }
      );
    }
  }, [payloadEdit]);

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
          ref={tpsRef}
          onChange={handlePlacement}
        >
          <option value="whole">Whole</option>
          <option value="lefthalf">Left Half</option>
          <option value="righthalf">Right Half</option>
          <option value="1/4">1/4</option>
        </select>
        <button
          type="button"
          className="btn btn-sm px-4 text-white"
          onClick={(e) => handleTwoToppings(e, data.toppingsCode)}
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

export default CountAsTwo;
