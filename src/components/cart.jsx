import { toast } from "react-toastify";

export default class CartFunction {
    getEmptyCart() {
        return {
            product: [],
            subtotal: (0.0).toFixed(2),
            discountAmount: (0.0).toFixed(2),
            taxPer: (0).toFixed(2),
            taxAmount: (0.0).toFixed(2),
            convinencePer: (0.0).toFixed(2),
            convinenceCharges: (0.0).toFixed(2),
            deliveryCharges: (0.0).toFixed(2),
            extraDeliveryCharges: (0.0).toFixed(2),
            grandtotal: (0.0).toFixed(2),
        };
    }

    createCart(setCart) {
        if (localStorage.getItem("cart") === null) {
            const currentCart = this.getEmptyCart();
            localStorage.setItem("cart", JSON.stringify(currentCart));
            if (setCart) {
                setCart(currentCart);
            }
        }
    }

    // Recalculate totals from localStorage if everything else is missing
    updateCartTotals(cart, setCart, settings, selectedStore) {
        if (!cart || !Array.isArray(cart.product) || cart.product.length === 0) return;

        // Guard against resurrecting a cart that was already cleared in localStorage
        try {
            const storedRaw = localStorage.getItem("cart");
            if (!storedRaw) return;
            const storedParsed = JSON.parse(storedRaw);
            if (!Array.isArray(storedParsed?.product) || storedParsed.product.length === 0) {
                return;
            }
        } catch (_) {
            return;
        }
        
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
        // ── Store Hours Guard ──────────────────────────────────────────────────
        // storeOpen is computed in GlobalContext from settings (open_time/close_time).
        // We read it via a global flag set on window to avoid circular imports.
        // If not configured (shortCodes missing), window.__storeOpen is undefined → allow.
        if (window.__storeOpen === false) {
            const hours = window.__storeHoursString
                ? ` We're open ${window.__storeHoursString}.`
                : '';
            toast.error(`🔒 We're currently closed. Please order during our business hours.${hours}`);
            return false;
        }
        // ────────────────────────────────────────────────────────────────────────
        if (!Array.isArray(cartProduct) || cartProduct.length === 0) {
            this.clearCart(setCart);
            return;
        }

        let sub = 0.0;
        let discountAmount = 0.0;
        let taxPer = 0;
        let taxAmount = 0.0;
        let convinencePer = 0.0;
        let convinenceAmount = 0.0;
        let deliveryCharges = 0.0;
        let extraDeliveryCharges = 0.0;
        let gTotal = 0.0;
        
        cartProduct.forEach((data) => {
            sub = Number(sub) + Number(data?.amount || 0);
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
        if (setCart) {
            setCart(currentCart);
        }
        // NOTE: Toast notifications are intentionally handled by
        // the calling component, not here, to avoid duplicate toasts.
    }

    deleteCart(cartProduct, cart, setCart, settings, selectedStore) {
        if (!cartProduct) return;

        let sourceProducts = Array.isArray(cart?.product) ? cart.product : [];
        if (sourceProducts.length === 0) {
            try {
                const stored = JSON.parse(localStorage.getItem("cart") || "null");
                if (Array.isArray(stored?.product)) {
                    sourceProducts = stored.product;
                }
            } catch (_) {
                sourceProducts = [];
            }
        }

        const filteredProduct = sourceProducts.filter((items) => {
            if (cartProduct.id && items?.id) {
                return items.id !== cartProduct.id;
            }
            return items?.productCode !== cartProduct.productCode;
        });

        if (filteredProduct.length === 0) {
            this.clearCart(setCart);
            toast.error("Product Deleted Successfully...");
            return;
        }

        let sub = 0.0;
        let discountAmount = 0.0;
        let taxPer = 0;
        let taxAmount = 0.0;
        let convinencePer = 0.0;
        let convinenceAmount = 0.0;
        let deliveryCharges = 0.0;
        let extraDeliveryCharges = 0.0;
        let gTotal = 0.0;

        filteredProduct.forEach((data) => {
            sub = Number(sub) + Number(data?.amount || 0);
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
        if (setCart) {
            setCart(currentCart);
        }
        toast.error("Product Deleted Successfully...");
    }

    clearCart(setCart) {
        const emptyCart = this.getEmptyCart();
        localStorage.setItem("cart", JSON.stringify(emptyCart));
        if (setCart) {
            setCart(emptyCart);
        }
    }
}
