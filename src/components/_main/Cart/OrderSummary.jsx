import React from "react";
import "../../../assets/styles/custom.css";

function OrderSummary({ cart }) {
  return (
    <>
      {/* SubTotal, TaxPer, GrandTotal */}
      <div className="row orderSummary">
        <div className="d-flex justify-content-between primaryWhiteColor">
          <div className="text-start mb-2">
            {/* <strong>Sub Total : </strong> */}
          </div>
          {/* <div className="text-end mb-2">
            <span className="mx-2">
              $ {cart?.subtotal ? cart?.subtotal : (0.0).toFixed(2)}
            </span>
          </div> */}
        </div>
        <div className="d-flex d-none justify-content-between flex-wrap primaryWhiteColor">
          <div className="text-start mb-2 primaryWhiteColor">
            <strong>Convenience Charges (%)</strong>
          </div>
          <div className="text-end mb-2">
            <span className="mx-2">
              {cart?.convinenceCharges ? cart?.convinenceCharges : 0}
            </span>
          </div>
        </div>
        <div className="d-flex d-none justify-content-between flex-wrap primaryWhiteColor">
          <div className="text-start mb-2">
            <strong>Delivery Charges : </strong>
          </div>
          <div className="text-end mb-2">
            <span className="mx-2">
              ${" "}
              {cart?.deliveryCharges
                ? cart?.deliveryCharges
                : Number(0).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-between flex-wrap primaryWhiteColor">
          <div className="text-start mb-2">
            <strong>Grand Total : </strong>
          </div>
          <div className="text-end fw-bold mb-2">
            <span className="mx-2">
              $ {cart?.grandtotal ? cart?.grandtotal : (0.0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
