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
