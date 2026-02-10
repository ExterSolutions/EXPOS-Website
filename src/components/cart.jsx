import { toast } from "react-toastify";

export default class CartFunction {
    createCart(setCart) {
        if (localStorage.getItem("cart") === null) {
            let sub = 0.0;
            let discountAmount = 0.0;
            let taxPer = 0;
            let taxAmount = 0.0;
            let convinenceCharges = 0.0;
            let deliveryCharges = 0.0;
            let extraDeliveryCharges = 0.0;
            let gTotal = 0.0;
            const currentCart = {
                product: [],
                subtotal: sub.toFixed(2),
                discountAmount: Number(discountAmount).toFixed(2),
                taxPer: Number(taxPer).toFixed(2),
                taxAmount: Number(taxAmount).toFixed(2),
                convinenceCharges: Number(convinenceCharges).toFixed(2),
                deliveryCharges: Number(deliveryCharges).toFixed(2),
                extraDeliveryCharges: Number(extraDeliveryCharges).toFixed(2),
                grandtotal: gTotal.toFixed(2),
            };
            localStorage.setItem("cart", JSON.stringify(currentCart));
            setCart(currentCart);
        }
    }
    addCart(cartProduct, setCart, isEdit, settings) {
        if (localStorage.getItem("cart") && localStorage.getItem("cart") !== null) {
            if (cartProduct.length > 0) {
                let sub = 0.0;
                let discountAmount = 0.0;
                let taxPer = 0;
                let taxAmount = 0.0;
                let convinenceCharges = 0.0;
                let deliveryCharges = 0.0;
                let extraDeliveryCharges = 0.0;
                let gTotal = 0.0;
                cartProduct.map((data) => {
                    sub = Number(sub) + Number(data?.amount);
                });
                if (settings !== undefined) {
                    settings?.map((data) => {
                        if (data?.settingCode === "STG_4" && data?.type === "percent") {
                            convinenceCharges = data?.settingValue;
                        }
                        if (data?.settingCode === "STG_2" && data?.type === "percent") {
                            taxPer = data?.settingValue;
                        }
                    });
                }
                let discountedAmount = Number(sub) - Number(discountAmount);
                // taxAmount = (sub * taxPer) / 100;
                taxAmount = 0;

                let convinenceAmount = (sub * convinenceCharges) / 100;
                let taxableTotal = taxAmount + convinenceAmount;
                let taxableTotalAmount = discountedAmount + taxableTotal;
                gTotal =
                    Number(taxableTotalAmount) +
                    Number(extraDeliveryCharges);
                const currentCart = {
                    product: cartProduct,
                    subtotal: sub.toFixed(2),
                    discountAmount: Number(discountAmount).toFixed(2),
                    taxPer: Number(taxPer).toFixed(2),
                    taxAmount: Number(taxAmount).toFixed(2),
                    convinenceCharges: Number(convinenceCharges).toFixed(2),
                    deliveryCharges: Number(deliveryCharges).toFixed(2),
                    extraDeliveryCharges: Number(extraDeliveryCharges).toFixed(2),
                    grandtotal: gTotal.toFixed(2),
                };

                localStorage.setItem("cart", JSON.stringify(currentCart));
                setCart(currentCart);
                {
                    isEdit === true
                        ? toast.success("Product Updated Successfully...")
                        : toast.success("Product Added Successfully...");
                }
            }
        }
    }
    deleteCart(cartProduct, cart, setCart, settings) {
        if (localStorage.getItem("cart") && localStorage.getItem("cart") !== null) {
            if (cartProduct) {
                let sub = 0.0;
                let discountAmount = 0.0;
                let taxPer = 0;
                let taxAmount = 0.0;
                let convinenceCharges = 0.0;
                let deliveryCharges = 0.0;
                let extraDeliveryCharges = 0.0;
                let gTotal = 0.0;
                const filteredProduct = cart?.product?.filter(
                    (items) => items?.id !== cartProduct.id
                );
                filteredProduct.map((data) => {
                    sub = Number(sub) + Number(data?.amount);
                });
                if (settings !== undefined) {
                    settings?.map((data) => {
                        if (data?.settingCode === "STG_4" && data?.type === "percent") {
                            convinenceCharges = data?.settingValue;
                        }
                        if (data?.settingCode === "STG_2" && data?.type === "percent") {
                            taxPer = data?.settingValue;
                        }
                        if (data?.settingCode === "STG_1" && data?.type === "amount") {
                            deliveryCharges = data?.settingValue;
                        }
                    });
                }
                let discountedAmount = Number(sub) - Number(discountAmount);
                taxAmount = 0;
                let taxableTotal = discountedAmount + taxAmount;
                let convinenceAmount = (taxableTotal * convinenceCharges) / 100;
                let convinencedTotal = taxableTotal + convinenceAmount;

                gTotal =
                    Number(convinencedTotal) +
                    Number(extraDeliveryCharges);

                const currentCart = {
                    product: filteredProduct,
                    subtotal: sub.toFixed(2),
                    discountAmount: Number(discountAmount).toFixed(2),
                    taxPer: Number(taxPer).toFixed(2),
                    taxAmount: Number(taxAmount).toFixed(2),
                    convinenceCharges: Number(convinenceCharges).toFixed(2),
                    deliveryCharges: Number(deliveryCharges).toFixed(2),
                    extraDeliveryCharges: Number(extraDeliveryCharges).toFixed(2),
                    grandtotal: gTotal.toFixed(2),
                };
                localStorage.setItem("cart", JSON.stringify(currentCart));
                setCart(currentCart);
                toast.error("Product Deleted Successfully...");
            }
        }
    }
    clearCart(setCart) {
        localStorage.removeItem("cart");
        setCart();
    }
}
