import React from "react";

function OrderSummary({ cart }) {
  const subtotal = Number(cart?.subtotal || 0);
  const taxAmount = Number(cart?.taxAmount || 0);
  const convCharges = Number(cart?.convinenceCharges || 0);
  const discountAmount = Number(cart?.discountAmount || 0);
  const deliveryCharges = Number(cart?.deliveryCharges || 0);
  const extraDeliveryCharges = Number(cart?.extraDeliveryCharges || 0);
  const grandtotal = Number(cart?.grandtotal || 0);

  return (
    <div className="row orderSummary px-2">
      <div className="d-flex justify-content-between primaryWhiteColor small mb-1">
        <span>Sub Total:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="d-flex justify-content-between text-success small mb-1">
          <span>Discount:</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      {(taxAmount > 0 || Number(cart?.taxPer || 0) > 0) && (
        <div className="d-flex justify-content-between primaryWhiteColor small mb-1">
          <span>Tax ({cart?.taxPer || 0}%):</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
      )}

      {convCharges > 0 && (
        <div className="d-flex justify-content-between primaryWhiteColor small mb-1">
          <span>Convenience Charges:</span>
          <span>${convCharges.toFixed(2)}</span>
        </div>
      )}

      {deliveryCharges > 0 && (
        <div className="d-flex justify-content-between primaryWhiteColor small mb-1">
          <span>Delivery Charges:</span>
          <span>${deliveryCharges.toFixed(2)}</span>
        </div>
      )}

      {extraDeliveryCharges > 0 && (
        <div className="d-flex justify-content-between primaryWhiteColor small mb-1">
          <span>Extra Delivery Fee:</span>
          <span>${extraDeliveryCharges.toFixed(2)}</span>
        </div>
      )}

      <div className="d-flex justify-content-between primaryWhiteColor fw-bold mt-2 pt-2 border-top border-secondary">
        <span>Grand Total:</span>
        <span>${grandtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
