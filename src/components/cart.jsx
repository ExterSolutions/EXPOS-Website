import { toast } from "react-toastify";

export default class CartFunction {
    createCart(setCart) {
        if (localStorage.getItem("cart") === null) {
            let sub = 0.0;
            let discountAmount = 0.0;
            let taxPer = 0;
            let taxAmount = 0.0;
            let convinencePer = 0.0;
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
                convinencePer: Number(convinencePer).toFixed(2),
                convinenceCharges: Number(convinenceCharges).toFixed(2),
                deliveryCharges: Number(deliveryCharges).toFixed(2),
                extraDeliveryCharges: Number(extraDeliveryCharges).toFixed(2),
                grandtotal: gTotal.toFixed(2),
            };
            localStorage.setItem("cart", JSON.stringify(currentCart));
            setCart(currentCart);
        }
    }

    // Recalculate totals from localStorage if everything else is missing
    updateCartTotals(cart, setCart, settings, selectedStore) {
        if (!cart || !cart.product) return;
        
        let store = selectedStore;
        if (!store) {
            const storedStore = localStorage.getItem("selectedStore");
            if (storedStore) {
                store = JSON.parse(storedStore);
            }
        }
        
        this.addCart(cart.product, setCart, null, settings, store);
    }

    addCart(cartProduct, setCart, isEdit, settings, selectedStore) {
        if (localStorage.getItem("cart") && localStorage.getItem("cart") !== null) {
            if (cartProduct.length > 0) {
                let sub = 0.0;
                let discountAmount = 0.0;
                let taxPer = 0;
                let taxAmount = 0.0;
                let convinencePer = 0.0;
                let convinenceAmount = 0.0;
                let deliveryCharges = 0.0;
                let extraDeliveryCharges = 0.0;
                let gTotal = 0.0;
                
                cartProduct.map((data) => {
                    sub = Number(sub) + Number(data?.amount);
                });

                // Get store from localStorage if not passed
                let store = selectedStore;
                if (!store) {
                    const storedStore = localStorage.getItem("selectedStore");
                    if (storedStore) {
                        store = JSON.parse(storedStore);
                    }
                }

                // Get tax percentage from selected store if available
                if (store?.province?.tax_percent) {
                    taxPer = Number(store.province.tax_percent);
                } else if (store?.province?.tax_percentage) {
                    taxPer = Number(store.province.tax_percentage);
                } else if (store?.tax_percent) {
                    taxPer = Number(store.tax_percent);
                } else if (settings !== undefined) {
                    // Fallback to settings if no store-specific tax
                    settings?.map((data) => {
                        if ((data?.shortCode === "tax_percentage" || data?.shortCode === "tax_percent") && data?.type === "percent") {
                            taxPer = Number(data?.settingValue);
                        }
                    });
                }

                if (settings !== undefined) {
                    settings?.map((data) => {
                        if (data?.shortCode === "convenience_charges" && data?.type === "percent") {
                            convinencePer = Number(data?.settingValue);
                        }
                    });
                }

                let discountedAmount = Number(sub) - Number(discountAmount);
                taxAmount = (discountedAmount * taxPer) / 100;
                convinenceAmount = (discountedAmount * convinencePer) / 100;

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
                    convinencePer: Number(convinencePer).toFixed(2),
                    convinenceCharges: Number(convinenceAmount).toFixed(2),
                    deliveryCharges: Number(deliveryCharges).toFixed(2),
                    extraDeliveryCharges: Number(extraDeliveryCharges).toFixed(2),
                    grandtotal: gTotal.toFixed(2),
                };

                localStorage.setItem("cart", JSON.stringify(currentCart));
                setCart(currentCart);
                
                if (isEdit !== null) {
                    isEdit === true
                        ? toast.success("Product Updated Successfully...")
                        : toast.success("Product Added Successfully...");
                }
            }
        }
    }

    deleteCart(cartProduct, cart, setCart, settings, selectedStore) {
        if (localStorage.getItem("cart") && localStorage.getItem("cart") !== null) {
            if (cartProduct) {
                let sub = 0.0;
                let discountAmount = 0.0;
                let taxPer = 0;
                let taxAmount = 0.0;
                let convinencePer = 0.0;
                let convinenceAmount = 0.0;
                let deliveryCharges = 0.0;
                let extraDeliveryCharges = 0.0;
                let gTotal = 0.0;
                
                const filteredProduct = cart?.product?.filter(
                    (items) => items?.id !== cartProduct.id
                );
                filteredProduct.map((data) => {
                    sub = Number(sub) + Number(data?.amount);
                });

                // Get store from localStorage if not passed
                let store = selectedStore;
                if (!store) {
                    const storedStore = localStorage.getItem("selectedStore");
                    if (storedStore) {
                        store = JSON.parse(storedStore);
                    }
                }

                // Get tax percentage from selected store if available
                if (store?.province?.tax_percent) {
                    taxPer = Number(store.province.tax_percent);
                } else if (store?.province?.tax_percentage) {
                    taxPer = Number(store.province.tax_percentage);
                } else if (store?.tax_percent) {
                    taxPer = Number(store.tax_percent);
                } else if (settings !== undefined) {
                    settings?.map((data) => {
                        if ((data?.shortCode === "tax_percentage" || data?.shortCode === "tax_percent") && data?.type === "percent") {
                            taxPer = Number(data?.settingValue);
                        }
                    });
                }

                if (settings !== undefined) {
                    settings?.map((data) => {
                        if (data?.shortCode === "convenience_charges" && data?.type === "percent") {
                            convinencePer = Number(data?.settingValue);
                        }
                        if (data?.shortCode === "delivery_charges" && data?.type === "amount") {
                            deliveryCharges = data?.settingValue;
                        }
                    });
                }

                let discountedAmount = Number(sub) - Number(discountAmount);
                taxAmount = (discountedAmount * taxPer) / 100;
                convinenceAmount = (discountedAmount * convinencePer) / 100;

                let taxableTotal = taxAmount + convinenceAmount;
                let taxableTotalAmount = discountedAmount + taxableTotal;

                gTotal =
                    Number(taxableTotalAmount) +
                    Number(extraDeliveryCharges);

                const currentCart = {
                    product: filteredProduct,
                    subtotal: sub.toFixed(2),
                    discountAmount: Number(discountAmount).toFixed(2),
                    taxPer: Number(taxPer).toFixed(2),
                    taxAmount: Number(taxAmount).toFixed(2),
                    convinencePer: Number(convinencePer).toFixed(2),
                    convinenceCharges: Number(convinenceAmount).toFixed(2),
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
        if (setCart) {
            setCart({ product: [] });
        }
    }
}
