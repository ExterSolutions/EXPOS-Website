// hooks/useSpecialOffer.js
import { useEffect, useState } from "react";
import { getDips, getSpecialOfferNew, getToppings, settingApi } from "../services";
import { toast } from "react-toastify";

export function useSpecialOffer(pid) {
    const [loading, setLoading] = useState(true);
    const [offerData, setOfferData] = useState(null);
    const [confSettings, setConfSettings] = useState(null);
    const [toppings, setToppings] = useState(null);
    const [dips, setDips] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pid) return;
        let cancelled = false;

        const fetchAll = async () => {
            try {
                setLoading(true);
                const [
                    specialOfferResponse,
                    settingsResponse,
                    toppingsResponse,
                    dipsResponse,
                ] = await Promise.allSettled([
                    getSpecialOfferNew(pid),
                    settingApi(),
                    getToppings(),
                    getDips(),
                ]);

                // ✅ Defensive data extraction
                const specialOfferData = specialOfferResponse?.value?.data || null;
                const settingsData = settingsResponse?.value?.data || [];
                const toppingsData = toppingsResponse?.value?.data?.toppings || [];
                const dipsData = dipsResponse?.value?.data || [];

                if (!specialOfferData) throw new Error("Invalid offer data");

                const settingsObj = {
                    premiumToppingsCount: settingsData.find((s) => s.settingCode === "STG_7")?.settingValue ?? 1,
                    premiumTopppingLabel: settingsData.find((s) => s.settingCode === "STG_5")?.settingValue ?? "Premium Toppings",
                    regularToppingLabel: settingsData.find((s) => s.settingCode === "STG_6")?.settingValue ?? "Regular Toppings",
                };

                if (!cancelled) {
                    setOfferData(specialOfferData);
                    setConfSettings(settingsObj);
                    setToppings(toppingsData);
                    setDips(dipsData);
                }
            } catch (err) {
               
                setError(err);
                toast.error("Could not load special offer data. Please try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAll();
        return () => {
            cancelled = true;
        };
    }, [pid]);

    return { loading, error, offerData, confSettings, toppings, dips };
}
