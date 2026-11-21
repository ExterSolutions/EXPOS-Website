/**
 * Pick the default sauce for a pizza.
 *
 * The admin can mark one sauce as "Default" (`isDefault` = 1). That sauce is
 * pre-selected. If none is marked we fall back to the first sauce in the list
 * (previous behaviour), so nothing breaks before the admin sets a default.
 */
export const isDefaultFlag = (v) => v === true || v === 1 || v === '1';

export const pickDefaultSauce = (sauces) => {
    if (!Array.isArray(sauces) || sauces.length === 0) return undefined;
    return sauces.find((s) => isDefaultFlag(s?.isDefault)) || sauces[0];
};


/**
 * Same rule for any admin-defaultable option list (special base, ...):
 * the item flagged `isDefault`, else the first item.
 */
export const pickDefault = (list) => {
    if (!Array.isArray(list) || list.length === 0) return undefined;
    return list.find((x) => isDefaultFlag(x?.isDefault)) || list[0];
};

export const pickDefaultSpecialBase = pickDefault;

/**
 * Pick the default cheese for a pizza:
 *   1. The cheese flagged `isDefault` (`isDefault` = 1) by the admin.
 *   2. Otherwise, the first cheese priced at $0.00 (parseFloat(price) === 0).
 *   3. Fallback to the first cheese in the list.
 */
export const pickDefaultCheese = (cheeses) => {
    if (!Array.isArray(cheeses) || cheeses.length === 0) return undefined;
    return (
        cheeses.find((c) => isDefaultFlag(c?.isDefault)) ||
        cheeses.find((c) => parseFloat(c?.price) === 0) ||
        cheeses[0]
    );
};
