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

            // Build a full geocodable address: "123 Main St, Surrey, BC, V3R 4P1, Canada"
            // Province is derived from the first letter of the Canadian postal code:
            //   V → BC (British Columbia)   T → AB (Alberta)
            //   S → SK (Saskatchewan)       R → MB (Manitoba)
            //   K/L/M/N/P → ON (Ontario)    G/H/J → QC (Quebec)
            //   E → NB   B → NS   C → PE   A → NL   X → NT/NU   Y → YT
            const POSTAL_TO_PROVINCE = {
                A: 'NL', B: 'NS', C: 'PE', E: 'NB',
                G: 'QC', H: 'QC', J: 'QC',
                K: 'ON', L: 'ON', M: 'ON', N: 'ON', P: 'ON',
                R: 'MB', S: 'SK', T: 'AB', V: 'BC',
                X: 'NT', Y: 'YT',
            };
            const firstLetter = postalcode.trim().toUpperCase()[0] || '';
            const province = POSTAL_TO_PROVINCE[firstLetter] || 'ON'; // 'ON' as safe fallback

            const parts = [address.trim()];
            if (city)       parts.push(city.trim());
            parts.push(province);
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
                // Log for debugging — shows what pickup address the backend resolved
                console.log('[useNashQuote] ✅ Quote received', {
                    pickup:  response.data._debug_pickup_address  || '(not returned)',
                    dropoff: response.data._debug_dropoff_address || dropoff,
                    store:   response.data._debug_store_code      || storeCode,
                    fee:     `$${fee.toFixed(2)}`,
                    provider: response.data.provider,
                });
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
