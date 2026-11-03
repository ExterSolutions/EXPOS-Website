import { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import {GlobalContext} from "../../../context/GlobalContext";
import { deliverable, orderPlace } from "../../../services";

function OrderPlace({ values }) {
  const { user } = useSelector((state) => state);
  const globalctx = useContext(GlobalContext);
  const [cart, setCart] = globalctx.cart;
  const navigate = useNavigate();
  const submittedRef = useRef(false);
  const idempotencyKeyRef = useRef(`web_ord_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

  const paymentGateway = (values) => {
    let custFullName = values.firstname + " " + values?.lastname;
    const baseUrl = window.location.origin; // Get current domain
    const payload = {
      idempotency_key: idempotencyKeyRef.current,
      callbackUrl: `${baseUrl}/payment/success`,
      cancelUrl: `${baseUrl}/payment/cancel`,
      customerCode: user?.data?.customerCode,
      customerName: custFullName,
      mobileNumber: values?.phoneno,
      address: values?.address,
      zipCode: values?.postalcode,
      products: cart?.product,
      subTotal: cart?.subtotal,
      discountAmount: cart?.discountAmount,
      taxPer: cart?.taxPer,
      taxAmount: cart?.taxAmount,
      deliveryCharges: cart?.deliveryCharges,
      extraDeliveryCharges: cart?.extraDeliveryCharges,
      grandTotal: cart?.grandtotal,
    };
    orderPlace(payload)
      .then((response) => {
        localStorage.setItem("OrderID", response.orderCode);
        localStorage.setItem("sessionId", response.sessionId);
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          console.error("Payment URL not found in response:", response);
          toast.error("Payment URL not available. Please try again.");
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          toast.error(error.response.data.message);
        }
      });
  };
  const placeOrder = async () => {
    await deliverable({ zipcode: values.postalcode })
      .then((res) => {
        if (res?.deliverable === true) {
          paymentGateway(values);
        } else {
          swal({
            title: "Postal Code is Undeliverable",
            text: `postal code cannot deliverable. Please change the postal code and try again`,
            icon: "warning",
            buttons: ["Cancel", "Ok"],
            dangerMode: true,
          }).then(async (willOk) => {
            if (willOk) {
            } else {
              navigate("/");
            }
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 400 || err.response.status === 500) {
          toast.error(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    placeOrder();
  }, []);
}

export default OrderPlace;
