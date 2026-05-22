/**
 * FlexDealCustomizer.jsx  —  V3 Slot-Based Deal Customization Page (v3)
 *
 * Pizza slots now open FlexDealPizzaSheet which provides:
 *  - Full Signature pizza picker + customization (crust/sauce/cheese/etc + 3-tab toppings)
 *  - Full CYO pizza builder with the same customization
 *  - Extra topping charges tracked per slot and added to the displayed total
 *
 * Zero changes to Special Offer, Toppings, or other existing flows.
 */
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Header from '../../components/_main/Header/Header';
import Footer from '../../components/_main/Footer';
import { GlobalContext } from '../../context/GlobalContext';
import { getFlexDealDetail } from '../../services';
import CartFunction from '../../components/cart';
import FlexDealPizzaSheet from './FlexDealPizzaSheet';
import { calcExtraCharge, allToppingNames } from './FlexDealPizzaSheet';
import '../../assets/styles/flex-deals.css';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const cartFn = new CartFunction();

// ─── Category meta ────────────────────────────────────────────────────────────
const CATEGORY_META = {
    pizza:  { icon: '🍕', label: 'Choose Your Pizzas' },
    sides:  { icon: '🥗', label: 'Choose Your Sides' },
    drinks: { icon: '🥤', label: 'Choose Your Drinks' },
    dips:   { icon: '🍶', label: 'Choose Your Dips' },
    pasta:  { icon: '🍝', label: 'Choose Your Pasta' },
    wings:  { icon: '🍗', label: 'Choose Your Wings' },
    default:{ icon: '🎉', label: 'Make Your Selection' },
};
const catMeta = (cat) => CATEGORY_META[cat?.toLowerCase()] || CATEGORY_META.default;

// ─── Group mode logic ─────────────────────────────────────────────────────────
const getGroupMode = (group) => {
    if (group.item_category === 'pizza') return 'pizza';
    const n = Array.isArray(group.allowed_items) ? group.allowed_items.length : 0;
    if (n === 0) return 'empty';
    if (n <= group.max_selections) return 'auto';
    if (group.max_selections === 1) return 'choice';
    return 'qty';
};

const buildInitialSelection = (group) => {
    if (getGroupMode(group) === 'auto') {
        const qty = Math.max(1, group.included_qty ?? 1);
        const sel = {};
        (group.allowed_items || []).forEach(item => { sel[item.code] = qty; });
        return sel;
    }
    return {};
};

const groupTotalQty = (selMap) =>
    Object.values(selMap || {}).reduce((s, n) => s + n, 0);

const isGroupDone = (group, sel) => {
    if (group.item_category === 'pizza') {
        const numSlots = Math.max(1, group.included_qty ?? 1);
        for (let i = 0; i < numSlots; i++) {
            if (!sel?.[`slot_${i}`]?.filled) return false;
        }
        return true;
    }
    const mode = getGroupMode(group);
    if (mode === 'auto') return true;
    if (mode === 'choice') return groupTotalQty(sel) >= 1;
    return groupTotalQty(sel) >= group.max_selections;
};

// ─── Non-pizza group sub-components ──────────────────────────────────────────

const AutoGroup = ({ group, selection, onUpdate }) => {
    const adjustable = !!group.qty_adjustable;
    const maxQty = group.max_qty ?? group.max_selections ?? 99;
    const adjust = (code, delta) => onUpdate(group.id, { ...selection, [code]: Math.max(1, Math.min(maxQty, (selection[code] ?? 1) + delta)) });
    return (
        <div className="fd-auto-list">
            {(group.allowed_items || []).map(item => {
                const qty = selection[item.code] ?? (group.included_qty ?? 1);
                return (
                    <div key={item.code} className="fd-auto-item">
                        <span className="fd-auto-item__check">✓</span>
                        <div className="fd-auto-item__info">
                            <span className="fd-auto-item__name">{item.name}</span>
                            {item.sizes?.[0] && <span className="fd-auto-item__size">{item.sizes[0].size}</span>}
                        </div>
                        {adjustable ? (
                            <div className="fd-qty-controls">
                                <button className="fd-qty-btn fd-qty-btn--minus" onClick={() => adjust(item.code, -1)} disabled={qty <= 1}>−</button>
                                <span className="fd-qty-value">{qty}</span>
                                <button className="fd-qty-btn fd-qty-btn--plus" onClick={() => adjust(item.code, +1)} disabled={qty >= maxQty}>+</button>
                            </div>
                        ) : (
                            <span className="fd-auto-item__qty-badge">×{qty}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const ChoiceGroup = ({ group, selection, onUpdate }) => {
    const selected = Object.keys(selection || {})[0] || null;
    return (
        <div className="fd-choice-grid">
            {(group.allowed_items || []).map(item => {
                const isSel = selected === item.code;
                return (
                    <button key={item.code} onClick={() => onUpdate(group.id, { [item.code]: 1 })}
                        className={`fd-choice-item${isSel ? ' selected' : ''}`}>
                        {isSel && <span className="fd-choice-item__check">✓</span>}
                        <div className="fd-choice-item__name">{item.name}</div>
                        {item.sizes?.[0] && <div className="fd-choice-item__size">{item.sizes[0].size}</div>}
                    </button>
                );
            })}
        </div>
    );
};

const QtyGroup = ({ group, selection, onUpdate }) => {
    const max = group.max_selections;
    const total = groupTotalQty(selection);
    const atMax = total >= max;
    const add = (item) => { if (!atMax) onUpdate(group.id, { ...selection, [item.code]: (selection[item.code] || 0) + 1 }); };
    const remove = (item) => {
        const cur = selection[item.code] || 0; if (cur <= 0) return;
        const u = { ...selection }; if (cur === 1) delete u[item.code]; else u[item.code] = cur - 1;
        onUpdate(group.id, u);
    };
    return (
        <div>
            <div className="fd-qty-tally">
                <span>Choose up to {max}</span>
                <span className={`fd-qty-tally__count${atMax ? ' at-max' : ''}`}>{total}/{max}</span>
            </div>
            <div className="fd-choice-grid">
                {(group.allowed_items || []).map(item => {
                    const qty = selection[item.code] || 0;
                    return (
                        <div key={item.code} className={`fd-qty-item${qty > 0 ? ' has-qty' : ''}`}>
                            <div className="fd-choice-item__name">{item.name}</div>
                            {item.sizes?.[0] && <div className="fd-choice-item__size">{item.sizes[0].size}</div>}
                            <div className="fd-qty-controls" style={{ marginTop: '0.5rem' }}>
                                <button className="fd-qty-btn fd-qty-btn--minus" onClick={() => remove(item)} disabled={qty === 0}>−</button>
                                <span className="fd-qty-value">{qty}</span>
                                <button className="fd-qty-btn fd-qty-btn--plus" onClick={() => add(item)} disabled={atMax && qty === 0}>+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Pizza Group — slot cards ─────────────────────────────────────────────────
const PizzaGroup = ({ group, selection, onUpdate, onOpenPicker }) => {
    const numSlots = Math.max(1, group.included_qty ?? 1);
    const freeAllowance = group.free_toppings ?? group.slot_config?.free_toppings ?? 0;

    const clearSlot = (i) => {
        const u = { ...selection }; delete u[`slot_${i}`]; onUpdate(group.id, u);
    };

    return (
        <div>
            {freeAllowance > 0 && (
                <div className="fd-pizza-free-hint">
                    ★ {freeAllowance} free topping{freeAllowance !== 1 ? 's' : ''} per pizza included
                </div>
            )}
            <div className="fd-pizza-slots">
                {Array.from({ length: numSlots }, (_, i) => {
                    const slot = selection?.[`slot_${i}`] || null;
                    if (slot?.filled) {
                        const extras = slot.extraCharge ?? 0;
                        const toppingNames = slot.toppings || [];
                        return (
                            <div key={i} className="fd-pizza-slot fd-pizza-slot--filled"
                                onClick={() => onOpenPicker(group.id, i, slot)}>
                                <div className="fd-pizza-slot__top">
                                    <div>
                                        <span className="fd-pizza-slot__label">
                                            {slot.type === 'signature' ? '⭐ ' : '🎨 '}Pizza {i + 1}
                                        </span>
                                        <div className="fd-pizza-slot__name">{slot.displayName}</div>
                                        {toppingNames.length > 0 && (
                                            <div className="fd-pizza-slot__pills">
                                                {toppingNames.slice(0, 4).map((t, ti) => (
                                                    <span key={ti} className="fd-pizza-slot__pill">{t}</span>
                                                ))}
                                                {toppingNames.length > 4 && (
                                                    <span className="fd-pizza-slot__pill fd-pizza-slot__pill--more">+{toppingNames.length - 4}</span>
                                                )}
                                            </div>
                                        )}
                                        {extras > 0 && (
                                            <div className="fd-pizza-slot__extra">
                                                +${extras.toFixed(2)} extra toppings
                                            </div>
                                        )}
                                    </div>
                                    <button className="fd-pizza-slot__clear"
                                        onClick={(e) => { e.stopPropagation(); clearSlot(i); }} title="Remove">✕</button>
                                </div>
                                <div className="fd-pizza-slot__edit-hint">Tap to customize ✏️</div>
                            </div>
                        );
                    }
                    return (
                        <button key={i} className="fd-pizza-slot fd-pizza-slot--empty"
                            onClick={() => onOpenPicker(group.id, i, null)}>
                            <span className="fd-pizza-slot__icon">🍕</span>
                            <div>
                                <div className="fd-pizza-slot__label--empty">Pizza {i + 1}</div>
                                <div className="fd-pizza-slot__hint">
                                    Tap to select · {freeAllowance > 0 ? `${freeAllowance} free toppings` : 'Customize'}
                                </div>
                            </div>
                            <span className="fd-pizza-slot__arrow">›</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Main Customizer Page ─────────────────────────────────────────────────────
const FlexDealCustomizer = () => {
    const { code: dealCode } = useParams();
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [cart, setCart] = globalCtx.cart;
    const [settings] = globalCtx.settings;

    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [groupSelections, setGroupSelections] = useState({});
    const [orActive, setOrActive] = useState({});
    const [picker, setPicker] = useState(null); // { groupId, slotIndex, existingSlot }
    const [quantity, setQuantity] = useState(1);

    // Lock body scroll when the pizza picker sheet is open
    // Using useBodyScrollLock (handles iOS position:fixed trick) instead of
    // direct overflow:hidden which gets stuck on navigation.
    useBodyScrollLock(!!picker);

    // Fetch deal
    useEffect(() => {
        if (!dealCode) return;
        setLoading(true);
        getFlexDealDetail(dealCode)
            .then(res => res?.status === 200 && res.data ? setDeal(res.data) : setError('Deal not found.'))
            .catch(() => setError('Failed to load deal.'))
            .finally(() => setLoading(false));
    }, [dealCode]);

    // Init selections + OR tabs
    useEffect(() => {
        if (!deal?.groups) return;
        const init = {};
        deal.groups.forEach(g => { init[g.id] = g.item_category !== 'pizza' ? buildInitialSelection(g) : {}; });
        setGroupSelections(init);
        const orInit = {};
        const seen = new Set();
        deal.groups.forEach(g => { if (g.or_group_tag && !seen.has(g.or_group_tag)) { seen.add(g.or_group_tag); orInit[g.or_group_tag] = g.id; } });
        setOrActive(orInit);
        if (deal.has_pizza_group && deal.pizza_prices?.length > 0) {
            const valid = deal.pizza_prices.filter(p => Number(p.price) > 0);
            if (valid.length > 0) setSelectedSize(valid[0]);
        }
    }, [deal]);

    const handleGroupUpdate = useCallback((groupId, selData) => {
        setGroupSelections(prev => ({ ...prev, [groupId]: selData }));
    }, []);

    const handleOrTabSwitch = useCallback((tag, groupId) => {
        setOrActive(prev => ({ ...prev, [tag]: groupId }));
        const orGroups = (deal?.groups || []).filter(g => g.or_group_tag === tag);
        setGroupSelections(prev => {
            const next = { ...prev };
            orGroups.forEach(g => { if (g.id !== groupId) next[g.id] = g.item_category !== 'pizza' ? buildInitialSelection(g) : {}; });
            return next;
        });
    }, [deal?.groups]);

    const allGroupsDone = useMemo(() => {
        if (!deal?.groups) return false;
        return deal.groups.every(g => {
            if (g.or_group_tag) return orActive[g.or_group_tag] !== g.id || isGroupDone(g, groupSelections[g.id] || {});
            return isGroupDone(g, groupSelections[g.id] || {});
        });
    }, [deal, groupSelections, orActive]);

    // Base price + extra pizza topping charges
    const basePrice = useMemo(() => {
        if (!deal) return 0;
        if (deal.has_pizza_group && selectedSize) return Number(selectedSize.price ?? 0);
        return Number(deal.price ?? 0);
    }, [deal, selectedSize]);

    const extraPizzaCharge = useMemo(() => {
        if (!deal?.groups) return 0;
        let total = 0;
        deal.groups.forEach(g => {
            if (g.item_category !== 'pizza') return;
            const sel = groupSelections[g.id] || {};
            const numSlots = Math.max(1, g.included_qty ?? 1);
            for (let i = 0; i < numSlots; i++) {
                const slot = sel[`slot_${i}`];
                if (slot?.extraCharge) total += slot.extraCharge;
            }
        });
        return total;
    }, [deal, groupSelections]);

    const totalPrice = useMemo(() => basePrice + extraPizzaCharge, [basePrice, extraPizzaCharge]);

    const handleAddToCart = () => {
        if (!allGroupsDone) { toast.warning('Please complete all selections first.'); return; }

        const groupsPayload = (deal.groups || [])
            .filter(g => !g.or_group_tag || orActive[g.or_group_tag] === g.id)
            .map(g => {
                const sel = groupSelections[g.id] || {};
                let items = [];
                if (g.item_category === 'pizza') {
                    const numSlots = Math.max(1, g.included_qty ?? 1);
                    items = Array.from({ length: numSlots }, (_, i) => {
                        const slot = sel[`slot_${i}`] || {};
                        if (slot.type === 'cyo') {
                            return {
                                source: 'cyo',
                                displayName: slot.displayName,
                                options: slot.options,
                                toppings: slot.toppings || [],
                                toppingData: slot.toppingData,
                                extraCharge: slot.extraCharge || 0,
                            };
                        }
                        return {
                            source: 'signature',
                            signaturePizzaCode: slot.signaturePizzaCode,
                            signaturePizzaName: slot.signaturePizzaName,
                            displayName: slot.displayName,
                            options: slot.options,
                            toppings: slot.toppings || [],
                            toppingData: slot.toppingData,
                            extraCharge: slot.extraCharge || 0,
                        };
                    });
                } else {
                    items = Object.entries(sel).filter(([, qty]) => qty > 0).map(([code, qty]) => {
                        const item = (g.allowed_items || []).find(i => i.code === code);
                        return { code, name: item?.name || code, qty, size: item?.sizes?.[0]?.size || null };
                    });
                }
                return { groupId: g.id, category: g.item_category, label: g.group_label || catMeta(g.item_category).label, items };
            });

        const cartProduct = {
            id: uuidv4(),
            productCode: deal.code,
            productName: deal.name,
            productType: 'flex_deal',
            dealType: deal.dealType || null,   // for cart revalidation on order-type change
            dealFormat: 'v3',
            pizzaSize: selectedSize?.size || '',
            quantity,
            price: totalPrice,
            amount: parseFloat((totalPrice * quantity).toFixed(2)),
            comments: '',
            config: { size: selectedSize ?? null, groups: groupsPayload, extraPizzaCharge },
        };

        const currentCart = JSON.parse(localStorage.getItem('cart')) || { product: [] };
        if (!currentCart.product) currentCart.product = [];
        currentCart.product.push(cartProduct);
        cartFn.addCart(currentCart.product, setCart, false, settings);
        toast.success('Added to cart! 🛒');
        navigate('/cart');
    };

    // ─── Render helpers ───────────────────────────────────────────────────────
    const renderGroupBody = (group) => {
        const mode = getGroupMode(group);
        const sel = groupSelections[group.id] || {};
        if (mode === 'auto')   return <AutoGroup   group={group} selection={sel} onUpdate={handleGroupUpdate} />;
        if (mode === 'choice') return <ChoiceGroup group={group} selection={sel} onUpdate={handleGroupUpdate} />;
        if (mode === 'qty')    return <QtyGroup    group={group} selection={sel} onUpdate={handleGroupUpdate} />;
        if (mode === 'pizza')  return (
            <PizzaGroup group={group} selection={sel} onUpdate={handleGroupUpdate}
                onOpenPicker={(gid, si, cur) => setPicker({ groupId: gid, slotIndex: si, existingSlot: cur })} />
        );
        return <p className="fd-group-empty">No items in this group.</p>;
    };

    const renderGroupCard = (group) => {
        const done = isGroupDone(group, groupSelections[group.id] || {});
        const meta = catMeta(group.item_category);
        const title = group.group_label || meta.label;
        return (
            <div key={group.id} className={`fd-group-card${done ? ' fd-group-card--done' : ''}`}>
                <div className="fd-group-header">
                    <div className="fd-group-header__left">
                        <span className="fd-group-header__icon">{meta.icon}</span>
                        <div>
                            <div className="fd-group-title">{done && <span className="fd-group-done-check">✓ </span>}{title}</div>
                            {getGroupMode(group) !== 'auto' && getGroupMode(group) !== 'pizza' && getGroupMode(group) !== 'empty' && (
                                <div className="fd-group-subtitle">
                                    {getGroupMode(group) === 'choice' ? 'Choose 1' : `Choose up to ${group.max_selections}`}
                                </div>
                            )}
                        </div>
                    </div>
                    {done && <span className="fd-group-done-badge">Done ✓</span>}
                </div>
                {renderGroupBody(group)}
            </div>
        );
    };

    const renderGroups = () => {
        if (!deal?.groups) return null;
        const rendered = new Set();
        const output = [];
        const orSets = {};
        deal.groups.forEach(g => { if (g.or_group_tag) { if (!orSets[g.or_group_tag]) orSets[g.or_group_tag] = []; orSets[g.or_group_tag].push(g); } });

        deal.groups.forEach(g => {
            if (rendered.has(g.id)) return;
            if (g.or_group_tag) {
                const set = orSets[g.or_group_tag];
                const activeId = orActive[g.or_group_tag] ?? set[0]?.id;
                const activeGroup = set.find(sg => sg.id === activeId) || set[0];
                set.forEach(sg => rendered.add(sg.id));
                output.push(
                    <div key={`or-${g.or_group_tag}`} className="fd-group-card">
                        <div className="fd-or-tabs">
                            {set.map(sg => (
                                <button key={sg.id} className={`fd-or-tab-btn${sg.id === activeId ? ' active' : ''}`}
                                    onClick={() => handleOrTabSwitch(g.or_group_tag, sg.id)}>
                                    {sg.group_label || catMeta(sg.item_category).label}
                                </button>
                            ))}
                        </div>
                        {renderGroupBody(activeGroup)}
                    </div>
                );
            } else {
                rendered.add(g.id);
                output.push(renderGroupCard(g));
            }
        });
        return output;
    };

    // ─── Loading / Error ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="fd-page"><Header /><div className="nav-margin" />
            <div className="fd-spinner-wrap" style={{ marginTop: '5rem' }}><div className="fd-spinner" /></div>
        </div>
    );

    if (error || !deal) return (
        <div className="fd-page"><Header /><div className="nav-margin" />
            <div className="fd-empty" style={{ marginTop: '3rem' }}>
                <span className="fd-empty__icon">⚠️</span>
                <p className="fd-empty__text">{error || 'Deal not found.'}</p>
                <button className="fd-card__cta" style={{ marginTop: '1rem' }} onClick={() => navigate('/flex-deals')}>← Back to Flex Deals</button>
            </div>
        </div>
    );

    const validSizes = (deal.pizza_prices ?? []).filter(p => Number(p.price) > 0);
    const doneCount = (deal.groups || []).filter(g => {
        if (g.or_group_tag && orActive[g.or_group_tag] !== g.id) return true;
        return isGroupDone(g, groupSelections[g.id] || {});
    }).length;
    const totalGroups = deal.groups?.length ?? 0;
    const pickerGroup = picker ? (deal.groups || []).find(g => g.id === picker.groupId) : null;

    return (
        <div className="fd-page">
            <Header />
            <div className="nav-margin" />

            {/* Hero */}
            <div className="fd-page__hero">
                <div className="container">
                    <button className="fd-page__back-btn" onClick={() => navigate('/flex-deals')}>← Flex Deals</button>
                    <div className="fd-page__badges">
                        <span className="fd-section-badge">🔥 FLEX DEAL</span>
                        {totalGroups > 0 && (
                            <span className="fd-page__progress-badge">{doneCount}/{totalGroups} complete</span>
                        )}
                    </div>
                    <h1 className="fd-page__deal-name">{deal.name}</h1>
                    {deal.description && <p className="fd-page__deal-desc">{deal.description}</p>}
                </div>
            </div>

            {/* Progress bar */}
            {totalGroups > 0 && (
                <div className="fd-progress-bar">
                    <div className="fd-progress-bar__fill" style={{ width: `${(doneCount / totalGroups) * 100}%` }} />
                </div>
            )}

            {/* Content */}
            <div className="fd-page__content">
                <div className="container">
                    {/* Size selector */}
                    {deal.has_pizza_group && validSizes.length > 1 && (
                        <div className="fd-group-card">
                            <div className="fd-group-header">
                                <div className="fd-group-header__left">
                                    <span className="fd-group-header__icon">📏</span>
                                    <div className="fd-group-title">Choose your size</div>
                                </div>
                            </div>
                            <div className="fd-size-selector">
                                {validSizes.map(size => (
                                    <button key={size.shortcode || size.size}
                                        className={`fd-size-btn${selectedSize?.size === size.size ? ' active' : ''}`}
                                        onClick={() => setSelectedSize(size)}>
                                        <span className="fd-size-btn__name">{size.size}</span>
                                        <span className="fd-size-btn__price">${Number(size.price).toFixed(2)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {renderGroups()}
                    <div className="fd-page__bottom-spacer" />
                </div>
            </div>

            {/* Sticky bar */}
            <div className="fd-sticky-bar">
                <div className="fd-sticky-bar__info">
                    <div className="fd-sticky-bar__label">
                        Total{extraPizzaCharge > 0 ? ` (incl. +$${extraPizzaCharge.toFixed(2)} extras)` : ''}
                    </div>
                    <div className="fd-sticky-bar__price">${(totalPrice * quantity).toFixed(2)}</div>
                </div>
                <div className="fd-sticky-bar__qty">
                    <button className="fd-qty-btn fd-qty-btn--minus" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                    <span className="fd-qty-value">{quantity}</span>
                    <button className="fd-qty-btn fd-qty-btn--plus" onClick={() => setQuantity(q => Math.min(10, q + 1))} disabled={quantity >= 10}>+</button>
                </div>
                <button className="fd-sticky-bar__add" onClick={handleAddToCart} disabled={!allGroupsDone}>
                    {allGroupsDone ? '🛒 Add to Cart' : `${doneCount}/${totalGroups} done`}
                </button>
            </div>

            {/* Pizza picker sheet */}
            {picker && pickerGroup && (
                <FlexDealPizzaSheet
                    group={pickerGroup}
                    existingSlot={picker.existingSlot}
                    settings={settings}
                    onClose={() => setPicker(null)}
                    onPick={(slotData) => {
                        setGroupSelections(prev => ({
                            ...prev,
                            [picker.groupId]: {
                                ...(prev[picker.groupId] || {}),
                                [`slot_${picker.slotIndex}`]: slotData,
                            },
                        }));
                        setPicker(null);
                    }}
                />
            )}


        </div>
    );
};

export default FlexDealCustomizer;
