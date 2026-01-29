import React, { useEffect, useRef, useState } from "react";

function Sides({ data, sidesArr, setSidesArr, reset, payloadEdit }) {
  const sidesRef = useRef(null);
  const [sidesButton, setSidesButton] = useState(false);
  const [sidesButtonColor, setSidesButtonColor] = useState("#606060");

  // handle Sides
  const handleSides = () => {
    const combinationData = data?.lineEntries?.find(
      (data) => data.code === sidesRef.current.value
    );
    const sidesObject = {
      sideCode: data?.code,
      sideName: data?.sideName,
      sideType: data?.type,
      lineCode: combinationData?.code,
      sidePrice: combinationData?.price,
      sideSize: combinationData?.size,
      quantity: 1,
      totalPrice: Number(0.0).toFixed(2),
    };

    setSidesArr([sidesObject]);
  };

  // ---- UseEffect ----

  return (
    <div
      className="row gx-3 m-0 p-0 border-bottom align-items-center py-1 py-md-0"
      key={data.code}
    >
      <div className="col-lg-5 col-md-5 col-sm-12 pb-lg-0 pt-2 pt-md-0 d-flex align-items-center">
        <input
          className="form-check-input m-0 p-0 "
          type="radio"
          name="sidesRadioBtn"
          id={`sidesRadioBtn-${data?.code}`}
          value={`sidesRadioBtn-${data?.code}`}
          onChange={handleSides}
          checked={data?.code === sidesArr[0]?.sideCode ? true : false}
        />

        <span className="px-2">
          {data.sideName}{" "}
          <span className="mx-2" style={{ textTransform: "capitalize" }}>
            ( {data.type} )
          </span>
        </span>
      </div>
      <div className="col-lg-7 col-md-7 col-sm-12 row p-md-0 py-md-2 py-2 pb-2 pt-3 d-flex justify-content-md-end justify-content-start">
        <div className="col-lg-7 col-md-8 col-sm-12">
          <select className="w-100 mx-2 select-input bgPrimaryBlackColor primaryWhiteColor" ref={sidesRef} disabled>
            {data.lineEntries.map((combination) => {
              return (
                <option value={combination.code} key={combination.code}>
                  {combination.size} - $ {combination.price}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Sides;
