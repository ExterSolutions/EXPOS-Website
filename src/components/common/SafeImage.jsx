/**
 * SafeImage — drop-in <img> replacement.
 * Shows a branded food placeholder whenever the src URL fails to load.
 * Usage: <SafeImage src={data.image} alt="..." className="mc-card__img" />
 */

// Inline SVG placeholder — no external dependency, works offline.
const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23fff8f5'/><circle cx='200' cy='130' r='65' fill='%23fdeee6' stroke='%23ff6b35' stroke-width='2'/><text x='200' y='145' font-size='52' text-anchor='middle' font-family='serif'>🍕</text><text x='200' y='210' font-size='14' fill='%23ff6b35' font-family='Arial,sans-serif' font-weight='700' text-anchor='middle'>Image not available</text></svg>`;

const SafeImage = ({
    src,
    alt = '',
    className = '',
    style = {},
    loading = 'lazy',
    fallback = PLACEHOLDER_SVG,
    ...rest
}) => {
    const handleError = (e) => {
        // Prevent infinite loop if the fallback itself fails
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
    };

    return (
        <img
            src={src || fallback}
            alt={alt}
            className={className}
            style={style}
            loading={loading}
            onError={handleError}
            {...rest}
        />
    );
};

export default SafeImage;
