import React, { useEffect, useRef, useState } from "react";

function Dips({ dipsData, dipsObj, setDipsObj, reset, payloadEdit, noofDips }) {
  let freeDips = Number(noofDips);
  const dipsRef = useRef(null);

  // Create Object & setDipsObj
  const dipsObject = (object) => {
    const Obj = {
      dipsCode: object?.dipsCode,
      dipsName: object?.dipsName,
      dipsPrice: object?.price,
      quantity: freeDips,
      totalPrice: Number(0.0).toFixed(2),
    };
    setDipsObj([Obj]);
  };

  // Get Current Obj
  const current = () => {
    if (dipsRef.current) {
      const selectedDips = dipsData.find(
        (items) => items?.dipsCode === dipsRef.current.value
      );
      dipsObject(selectedDips);
    }
  };

  // handle Drinks
  const handleDips = (e) => {
    current();
  };

  // ---- UseEffect ----
  // UseEffect - Reset
  useEffect(() => {
    if (reset) {
      dipsRef.current.value = dipsData[0]?.dipsCode;
    }
  }, [reset]);
  // UseEffect Get Current Value
  useEffect(() => {
    current();
  }, []);
  // Populate - Edit
  useEffect(() => {
    if (
      payloadEdit &&
      payloadEdit !== undefined &&
      payloadEdit.productType === "special"
    ) {
      dipsRef.current.value = payloadEdit?.config?.dips?.dipsCode;
    }
  }, [payloadEdit]);

  return (
    <>
      <div className="row m-0 p-0 align-items-center">
        <div className="col-lg-8 col-md-8 col-sm-12 order-md-1 order-2">
          <select
            className="w-100 select-input my-3 bgPrimaryBlackColor primaryWhiteColor"
            ref={dipsRef}
            style={{ width: "300px" }}
            onChange={handleDips}
            value={dipsObj[0]?.dipsCode}
          >
            {dipsData?.map((data) => {
              return (
                <option key={data.dipsCode} value={data.dipsCode}>
                  {data?.dipsName} - $ {Number(0.0).toFixed(2)}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12 text-md-end text-start mt-md-0 mt-4 order-md-2 order-1">
          <span>Quantity : {freeDips}</span>
        </div>
      </div>
    </>
  );
}

export default Dips;
