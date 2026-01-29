import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment Status: " + paymentIntent.status);
    } else {
      setMessage("Unexpected State");
    }

    setIsProcessing(false);
  };
  return (
    <div className="container p-3 justify-content-center">
      <h1>Card</h1>
      <form id="payment-form" onSubmit={handleSubmit}>
        <label htmlFor="card-payment">Card</label>
        <PaymentElement />
        <button
          disabled={isProcessing}
          className="btn btn-sm bg-dark text-white py-2 px-5"
        >
          {isProcessing ? "Processing...." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
