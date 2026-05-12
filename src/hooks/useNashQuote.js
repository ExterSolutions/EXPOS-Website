import { useState, useCallback, useRef } from 'react';
import { getDeliveryQuote } from '../services';

/**
 * useNashQuote — fetches and caches a Nash delivery price quote.
 *
 * Usage:
 *   const q = useNashQuote();
 *   q.fetchQuote({ address, city, postalcode, phoneno, storeCode, orderValue });
 *   // later, on timer expiry:
 *   q.refresh();
 */
export function useNashQuote() {
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);
    const [data,        setData]        = useState(null);   // full Nash response .data object
    const [deliveryFee, setDeliveryFee] = useState(0);      // dollars (float)
    const [fetchedAt,   setFetchedAt]   = useState(null);   // ms timestamp

    const lastParamsRef = useRef(null);

    const fetchQuote = useCallback(async ({
        address,
        city   = '',
        postalcode,
        phoneno,
        storeCode,
        orderValue = 0,
    }) => {
        if (!address || !postalcode || !storeCode) return;

        // Store params so refresh() can re-use them
        lastParamsRef.current = { address, city, postalcode, phoneno, storeCode, orderValue };

        setLoading(true);
        setError(null);

        try {
            const phone = phoneno ? `+1${phoneno.replace(/\D/g, '')}` : undefined;

            // Build a full geocodable address: "123 Main St, Toronto, ON, M5V 2T6, Canada"
            // City and province are critical — without them Nash geocodes to the wrong region.
            const parts = [address.trim()];
            if (city)       parts.push(city.trim());
            parts.push('ON');           // province — all Exter stores are in Ontario
            parts.push(postalcode.trim());
            parts.push('Canada');
            const dropoff = parts.filter(Boolean).join(', ');

            console.log('[useNashQuote] dropoff_address →', dropoff);
            const response = await getDeliveryQuote({
                dropoff_address: dropoff,
                ...(phone ? { dropoff_phone: phone } : {}),
                store_code:  storeCode,
                order_value: orderValue,
            });

            if (response?.success && response?.data) {
                const fee = (response.data.delivery_fee_cents || 0) / 100;
                setData(response.data);
                setDeliveryFee(fee);
                setFetchedAt(Date.now());
                setError(null);
            } else {
                // No quote available — clear gracefully, don't block checkout
                setData(null);
                setDeliveryFee(0);
                setFetchedAt(Date.now());
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Unable to fetch delivery quote';
            console.warn('[useNashQuote] fetch failed:', msg);
            setError(msg);
            setDeliveryFee(0);
        } finally {
            setLoading(false);
        }
    }, []);

    /** Re-fetch with the same params as the last call (e.g. after price-lock expiry). */
    const refresh = useCallback(async () => {
        if (lastParamsRef.current) {
            await fetchQuote(lastParamsRef.current);
        }
    }, [fetchQuote]);

    /** Clear all state — call when the user changes their address. */
    const reset = useCallback(() => {
        lastParamsRef.current = null;
        setLoading(false);
        setError(null);
        setData(null);
        setDeliveryFee(0);
        setFetchedAt(null);
    }, []);

    return { loading, error, data, deliveryFee, fetchedAt, fetchQuote, refresh, reset };
}
