/**
 * Pizza Size Priority Map
 * Lower number = higher priority (displayed first)
 */
export const pizzaSizePriority = {
  individual: 1,
  slice: 2,
  personal: 3,
  p: 3,
  s: 4,
  small: 4,
  m: 5,
  medium: 5,
  l: 6,
  large: 6,
  xl: 7,
  "extra large": 7,
  "xtra large": 7,
  xxl: 8,
  party: 9,
};

/**
 * Sorts an array of pizza size objects.
 * Priority order:
 * 1. order_column (if available from API)
 * 2. pizzaSizePriority map (semantic matching)
 * 3. Default (99)
 * 
 * @param {Array} sizes - Array of objects containing .size and optionally .order_column
 * @returns {Array} Sorted array
 */
export const sortPizzaSizes = (sizes) => {
  if (!Array.isArray(sizes)) return [];

  return [...sizes].sort((a, b) => {
    // 1. Try sorting by order_column if both have it
    if (a.order_column !== undefined && b.order_column !== undefined) {
      return Number(a.order_column) - Number(b.order_column);
    }

    // 2. Fallback to semantic priority map
    const sizeA = (a.size || "").toLowerCase().trim();
    const sizeB = (b.size || "").toLowerCase().trim();

    const keys = Object.keys(pizzaSizePriority).sort((x, y) => y.length - x.length);

    const getPriority = (sizeStr) => {
      const match = keys.find((key) => sizeStr.includes(key));
      return match ? pizzaSizePriority[match] : 99;
    };

    const priorityA = getPriority(sizeA);
    const priorityB = getPriority(sizeB);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // 3. Last fallback: alphabetical
    return sizeA.localeCompare(sizeB);
  });
};
