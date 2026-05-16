/**
 * OrderTypeModal.jsx
 *
 * Full-overlay gate shown immediately after a store is selected.
 * The user must choose "Pickup" or "Delivery" before browsing.
 *
 * Props:
 *   isOpen       bool
 *   storeName    string   — shown for context ("Brampton — Main St")
 *   currentType  string   — currently selected type for dismissible re-open
 *   dismissible  bool     — if true, show an X / close button (re-open from header)
 *   onSelect     (type: 'pickup' | 'delivery') => void
 *   onDismiss    () => void  — only called when dismissible=true
 */
import { useEffect } from 'react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import '../../assets/styles/order-type-modal.css';

const OPTIONS = [
    {
        type: 'pickup',
        icon: '🏪',
        label: 'Pickup',
        sub: "I'll collect my order at the store",
        badge: 'Ready in ~20 min',
    },
    {
        type: 'delivery',
        icon: '🚚',
        label: 'Delivery',
        sub: 'Bring it right to my door',
        badge: 'Delivery fee applies',
    },
];

const OrderTypeModal = ({
    isOpen,
    storeName,
    currentType,
    dismissible = false,
    onSelect,
    onDismiss,
}) => {
    // Robust iOS body-scroll lock
    useBodyScrollLock(isOpen);

    // Escape key — only when dismissible
    useEffect(() => {
        if (!isOpen || !dismissible) return;
        const handle = (e) => { if (e.key === 'Escape') onDismiss?.(); };
        document.addEventListener('keydown', handle);
        return () => document.removeEventListener('keydown', handle);
    }, [isOpen, dismissible, onDismiss]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="otm-backdrop"
                onClick={dismissible ? onDismiss : undefined}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className="otm-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Choose order type"
            >
                {/* Close — only when re-opened from header */}
                {dismissible && (
                    <button
                        className="otm-close"
                        onClick={onDismiss}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                )}

                {/* Header */}
                <div className="otm-header">
                    <div className="otm-header__icon">🍕</div>
                    <h2 className="otm-header__title">How would you like your order?</h2>
                    {storeName && (
                        <p className="otm-header__store">📍 {storeName}</p>
                    )}
                </div>

                {/* Options */}
                <div className="otm-options">
                    {OPTIONS.map((opt) => {
                        const isActive = currentType === opt.type;
                        return (
                            <button
                                key={opt.type}
                                id={`otm-option-${opt.type}`}
                                className={`otm-option ${isActive ? 'otm-option--active' : ''}`}
                                onClick={() => onSelect(opt.type)}
                            >
                                <span className="otm-option__icon">{opt.icon}</span>
                                <div className="otm-option__body">
                                    <span className="otm-option__label">{opt.label}</span>
                                    <span className="otm-option__sub">{opt.sub}</span>
                                </div>
                                <span className="otm-option__badge">{opt.badge}</span>
                                {isActive && (
                                    <span className="otm-option__check" aria-label="Selected">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer hint */}
                <p className="otm-footer-hint">
                    You can change this anytime from the header.
                </p>
            </div>
        </>
    );
};

export default OrderTypeModal;
