import React, { useCallback, useEffect, useRef, useState } from "react";

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

const SUGGEST_BASE_URL = "https://api.mapbox.com/autofill/v1/suggest";
const RETRIEVE_BASE_URL = "https://api.mapbox.com/autofill/v1/retrieve";
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

function generateSessionToken() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function distinctExactStreetResults(suggestions = []) {
    return suggestions.filter((item1, idx, arr) => {
        const title1 = item1.matching_name || item1.feature_name || item1.address_line1 || "";
        return (
            item1.accuracy !== "street" ||
            arr.findIndex(
                (item2) =>
                    (item2.matching_name || item2.feature_name || item2.address_line1 || "") === title1
            ) === idx
        );
    });
}

/**
 * Extracts normalized Canadian address fields from a Mapbox Autofill feature or suggestion.
 */
export function extractCanadianAddressParts(featureOrProps) {
    const props = featureOrProps?.properties || featureOrProps || {};
    const context = Array.isArray(props.context) ? props.context : [];

    const line1 = props.address_line1 || props.address || props.feature_name || "";
    const line2 = props.address_line2 || "";
    const city =
        props.place ||
        props.address_level2 ||
        context.find((c) => c?.id?.startsWith("place"))?.text ||
        "";
    const region =
        props.region ||
        props.address_level1 ||
        context.find((c) => c?.id?.startsWith("region"))?.text ||
        "";
    const rawPostal =
        props.postcode ||
        context.find((c) => c?.id?.startsWith("postcode"))?.text ||
        "";

    const cleanPostal = rawPostal.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const postalCode =
        cleanPostal.length > 3
            ? `${cleanPostal.slice(0, 3)} ${cleanPostal.slice(3, 6)}`
            : cleanPostal;

    const streetAddress = [line1, line2].filter(Boolean).join(", ");
    const fullAddress = [line1, line2, city, region].filter(Boolean).join(", ");

    return {
        line1,
        line2,
        streetAddress,
        fullAddress,
        city,
        region,
        postalCode,
        props,
    };
}

/**
 * Drop-in React wrapper around an address <input> providing Mapbox Address Autofill
 * (same API & behavior as Cashier's @mapbox/search-js-react <AddressAutofill>).
 */
export function AddressAutofill({
    accessToken = MAPBOX_TOKEN,
    options = { country: "CA", language: "en" },
    onRetrieve,
    disabled = false,
    children,
}) {
    const containerRef = useRef(null);
    const sessionTokenRef = useRef(generateSessionToken());
    const abortControllerRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const suppressNextInputRef = useRef(false);

    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setSelectedIndex(-1);
    }, []);

    const fetchSuggestions = useCallback(
        async (searchText) => {
            if (disabled) return;
            const trimmed = (searchText || "").trim();
            if (trimmed.length < 3) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                if (accessToken) {
                    const params = new URLSearchParams({
                        types: "address",
                        access_token: accessToken,
                        streets: "true",
                        language: options?.language || "en",
                        country: options?.country || "CA",
                        proximity: "ip",
                        limit: "6",
                        session_token: sessionTokenRef.current,
                    });

                    const url = `${SUGGEST_BASE_URL}/${encodeURIComponent(trimmed)}?${params.toString()}`;
                    const res = await fetch(url, { signal: controller.signal });
                    if (res.ok) {
                        const json = await res.json();
                        const list = distinctExactStreetResults(json?.suggestions || []);
                        setSuggestions(list);
                        setIsOpen(list.length > 0);
                        setSelectedIndex(-1);
                        return;
                    }
                }

                // Keyless fallback (Canadian address search via Nominatim if VITE_MAPBOX_TOKEN is not set in .env)
                const nomParams = new URLSearchParams({
                    q: trimmed,
                    format: "jsonv2",
                    addressdetails: "1",
                    countrycodes: (options?.country || "CA").toLowerCase(),
                    limit: "6",
                });
                const nomRes = await fetch(`${NOMINATIM_SEARCH_URL}?${nomParams.toString()}`, {
                    signal: controller.signal,
                    headers: { "Accept-Language": options?.language || "en" },
                });
                if (!nomRes.ok) {
                    setSuggestions([]);
                    setIsOpen(false);
                    return;
                }
                const nomJson = await nomRes.json();
                const mapped = (Array.isArray(nomJson) ? nomJson : []).map((item) => {
                    const addr = item.address || {};
                    const houseNumber = addr.house_number || "";
                    const road = addr.road || addr.pedestrian || addr.suburb || item.name || "";
                    const line1 = [houseNumber, road].filter(Boolean).join(" ").trim() || item.display_name?.split(",")[0] || "";
                    const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || "";
                    const region = addr.state || addr.province || "";
                    const postcode = addr.postcode || "";
                    return {
                        mapbox_id: `nom-${item.place_id}`,
                        matching_name: line1,
                        feature_name: line1,
                        address_line1: line1,
                        address_level2: city,
                        address_level1: region,
                        place: city,
                        region,
                        postcode,
                        description: [city, region, postcode].filter(Boolean).join(", "),
                        place_name: item.display_name,
                    };
                });
                setSuggestions(mapped);
                setIsOpen(mapped.length > 0);
                setSelectedIndex(-1);
            } catch (err) {
                if (err?.name !== "AbortError") {
                    setSuggestions([]);
                    setIsOpen(false);
                }
            }
        },
        [accessToken, disabled, options?.country, options?.language]
    );

    const handleSelectSuggestion = useCallback(
        async (suggestion) => {
            if (!suggestion) return;

            const inputEl = containerRef.current?.querySelector("input");

            // If user picked a street-level prompt without a house number, prefill street + space
            if (suggestion.accuracy === "street") {
                const streetText = `${suggestion.address_line1 || suggestion.feature_name || ""} `;
                onRetrieve?.({
                    features: [
                        {
                            properties: {
                                ...suggestion,
                                address_line1: streetText,
                                _streetOnly: true,
                            },
                        },
                    ],
                });
                closeDropdown();
                inputEl?.focus();
                return;
            }

            suppressNextInputRef.current = true;
            closeDropdown();
            setSuggestions([]);

            // Immediately fire with suggestion properties so fields populate right away
            const fallbackPayload = {
                type: "FeatureCollection",
                features: [{ type: "Feature", properties: { ...suggestion } }],
            };

            const actionId = suggestion?.action?.id;
            if (!actionId || !accessToken) {
                onRetrieve?.(fallbackPayload);
                sessionTokenRef.current = generateSessionToken();
                return;
            }

            try {
                const params = new URLSearchParams({
                    access_token: accessToken,
                    session_token: sessionTokenRef.current,
                });
                const url = `${RETRIEVE_BASE_URL}/${encodeURIComponent(actionId)}?${params.toString()}`;
                const res = await fetch(url);
                if (res.ok) {
                    const json = await res.json();
                    const feature = json?.features?.[0];
                    if (feature) {
                        // Merge suggestion properties with retrieved feature properties
                        const mergedFeature = {
                            ...feature,
                            properties: {
                                ...suggestion,
                                ...(feature.properties || {}),
                            },
                        };
                        onRetrieve?.({
                            ...json,
                            features: [mergedFeature],
                        });
                    } else {
                        onRetrieve?.(fallbackPayload);
                    }
                } else {
                    onRetrieve?.(fallbackPayload);
                }
            } catch {
                onRetrieve?.(fallbackPayload);
            } finally {
                sessionTokenRef.current = generateSessionToken();
            }
        },
        [accessToken, closeDropdown, onRetrieve]
    );

    // Attach listeners to the underlying <input> inside containerRef
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const inputEl = container.querySelector("input");
        if (!inputEl) return;

        const onInput = (e) => {
            if (suppressNextInputRef.current) {
                suppressNextInputRef.current = false;
                return;
            }
            const value = e.target?.value || "";
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (value.trim().length < 3) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }
            debounceTimerRef.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 220);
        };

        const onKeyDown = (e) => {
            if (!isOpen || suggestions.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                handleSelectSuggestion(suggestions[selectedIndex]);
            } else if (e.key === "Escape") {
                closeDropdown();
            }
        };

        const onFocus = () => {
            if (suggestions.length > 0 && !disabled) {
                setIsOpen(true);
            }
        };

        inputEl.addEventListener("input", onInput);
        inputEl.addEventListener("keydown", onKeyDown);
        inputEl.addEventListener("focus", onFocus);

        return () => {
            inputEl.removeEventListener("input", onInput);
            inputEl.removeEventListener("keydown", onKeyDown);
            inputEl.removeEventListener("focus", onFocus);
        };
    }, [closeDropdown, disabled, fetchSuggestions, handleSelectSuggestion, isOpen, selectedIndex, suggestions]);

    // Dismiss dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                closeDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside, { passive: true });
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [closeDropdown]);

    // Cleanup timers/controllers on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
            {children}
            {isOpen && suggestions.length > 0 && !disabled && (
                <ul
                    role="listbox"
                    aria-label="Address suggestions"
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        margin: 0,
                        padding: "4px 0",
                        listStyle: "none",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.08)",
                        maxHeight: "260px",
                        overflowY: "auto",
                    }}
                >
                    {suggestions.map((suggestion, index) => {
                        const title =
                            suggestion.matching_name ||
                            suggestion.feature_name ||
                            suggestion.address_line1 ||
                            "";
                        const desc =
                            suggestion.description ||
                            suggestion.place_name ||
                            [suggestion.address_level2, suggestion.address_level1, suggestion.postcode]
                                .filter(Boolean)
                                .join(", ");
                        const isActive = index === selectedIndex;

                        return (
                            <li
                                key={suggestion.mapbox_id || suggestion.action?.id || `${title}-${index}`}
                                role="option"
                                aria-selected={isActive}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onMouseLeave={() => setSelectedIndex(-1)}
                                onMouseDown={(e) => {
                                    // Prevent input blur before selection runs
                                    e.preventDefault();
                                    handleSelectSuggestion(suggestion);
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    padding: "9px 12px",
                                    cursor: "pointer",
                                    backgroundColor: isActive ? "#fff5f5" : "#ffffff",
                                    borderBottom:
                                        index < suggestions.length - 1
                                            ? "1px solid #f1f5f9"
                                            : "none",
                                    transition: "background-color 0.12s ease",
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        fontSize: "15px",
                                        lineHeight: "20px",
                                        flexShrink: 0,
                                        marginTop: "1px",
                                    }}
                                >
                                    📍
                                </span>
                                <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                                    <div
                                        style={{
                                            fontSize: "0.88rem",
                                            fontWeight: 600,
                                            color: "#1e293b",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {title}
                                    </div>
                                    {desc && (
                                        <div
                                            style={{
                                                fontSize: "0.76rem",
                                                color: "#64748b",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                marginTop: "1px",
                                            }}
                                        >
                                            {desc}
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default AddressAutofill;

