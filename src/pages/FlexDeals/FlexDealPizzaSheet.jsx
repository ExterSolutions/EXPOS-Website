/**
 * FlexDealPizzaSheet.jsx
 *
 * Bottom-sheet pizza picker for V3 Flex Deals.
 * Matches the exact behaviour of SpecialOfferNew's PizzaCustomizerAccordion:
 *
 *  TAB 1 – SIGNATURE
 *   • Pick from signature pizza list (OptionSheet trigger)
 *   • On selection → fetchSignaturePizzaDefaults(code) populates crust/sauce etc.
 *   • Full customization: Dough · CrustType · SpecialBase · Cheese · Spicy · Sauce · Cook
 *   • Toppings via 3-tab sheet (Premium / Regular / Indian)
 *   • Extra topping charges: each topping's toppingsPrice is included in the slot cost
 *     (budget set by group.free_toppings — highest-price toppings covered first)
 *
 *  TAB 2 – BUILD YOUR OWN
 *   • Same customization options (crust, sauce, cheese etc.) from getAllIngredients
 *   • Same 3-tab topping sheet
 *   • No signature pizza selection step
 *
 * On confirm, calls onPick(slotData) where slotData contains everything needed
 * to compute the slot's extra charge and display the summary.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import OptionSheet from '../../components/_main/OptionSheet';
import { getAllIngredients, fetchSignaturePizzaDefaults, getSignaturePizza, getToppings } from '../../services';
import ToppingsSelector from '../SpecialOfferNew/components/ToppingsSelector';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

// ── Option config (mirrors PizzaCustomizerAccordion) ─────────────────────────
const OPTION_CONFIG = {
    crust:        { codeKey: 'crustCode',       nameKey: 'crustName' },
    crustType:    { codeKey: 'crustTypeCode',   nameKey: 'crustType' },
    cheese:       { codeKey: 'cheeseCode',      nameKey: 'cheeseName' },
    specialBases: { codeKey: 'specialbaseCode', nameKey: 'specialbaseName' },
    spicy:        { codeKey: 'spicyCode',       nameKey: 'spicy' },
    sauce:        { codeKey: 'sauceCode',       nameKey: 'sauce' },
    cook:         { codeKey: 'cookCode',        nameKey: 'cook' },
};

function normalizeOptions(arr = [], optionKey) {
    const cfg = OPTION_CONFIG[optionKey];
    if (!cfg || !arr?.length) return [];
    return arr.map(o => ({ id: o[cfg.codeKey] ?? o.code ?? '', label: o[cfg.nameKey] ?? o.name ?? '', price: Number(o.price || 0) }));
}

function getCode(obj, key)  { return obj?.[OPTION_CONFIG[key]?.codeKey] ?? null; }
function getName(obj, key)  { return obj?.[OPTION_CONFIG[key]?.nameKey] ?? null; }

// ── Topping counting helpers (mirrors PizzaCustomizerAccordion) ───────────────
function toppingCountLabel(toppings) {
    const n = (toppings?.countAsTwoToppings?.length || 0)
            + (toppings?.countAsOneToppings?.length || 0)
            + (toppings?.freeToppings?.length || 0);
    return n > 0 ? `${n} selected` : null;
}
function allToppingNames(toppings) {
    return [
        ...(toppings?.countAsTwoToppings || []),
        ...(toppings?.countAsOneToppings || []),
        ...(toppings?.freeToppings || []),
    ].map(t => t.toppingsName || t.name || '');
}

/**
 * Calculate EXTRA cost: sum of paid toppings beyond the deal's free allowance.
 * Highest-priced toppings are covered by the free budget first (matching cashier logic).
 */
function calcExtraCharge(toppings, freeAllowance = 0) {
    const paid = [
        ...(toppings?.countAsTwoToppings || [])
            .filter(t => parseFloat(t.toppingsPrice || 0) > 0)
            .map(t => ({ price: parseFloat(t.toppingsPrice || 0), slots: t.toppingsPlacement === 'whole' ? 2 : 1 })),
        ...(toppings?.countAsOneToppings || [])
            .filter(t => parseFloat(t.toppingsPrice || 0) > 0)
            .map(t => ({ price: parseFloat(t.toppingsPrice || 0), slots: 1 })),
    ].sort((a, b) => b.price - a.price);

    let freeSlots = freeAllowance;
    let extra = 0;
    paid.forEach(t => {
        if (freeSlots >= t.slots) { freeSlots -= t.slots; } else { extra += t.price; }
    });
    return extra;
}

// ── Topping sheet (3 tabs) ────────────────────────────────────────────────────
const TOPPING_TABS = [
    { id: 'countAsTwo', key: 'countAsTwoToppings', label: 'Premium Toppings' },
    { id: 'countAsOne', key: 'countAsOneToppings', label: 'Regular Toppings' },
    { id: 'free',       key: 'freeToppings',       label: 'Indian Toppings' },
];

const ToppingSheet = ({ isOpen, onClose, toppingsData, toppings, setToppings, settings }) => {
    const [activeTab, setActiveTab] = useState('countAsTwo');

    const handleChange = (key, list) => setToppings(prev => ({ ...prev, [key]: list }));

    if (!isOpen) return null;
    return (
        <>
            <div className="topping-sheet-backdrop" onClick={onClose} aria-hidden="true" />
            <div className="topping-sheet slide-up-in" role="dialog" aria-modal="true">
                <div className="topping-sheet__handle" />
                <div className="topping-sheet__header">
                    <div>
                        <p className="topping-sheet__title">Choose Toppings</p>
                        {toppingCountLabel(toppings) && (
                            <p className="topping-sheet__subtitle">{toppingCountLabel(toppings)}</p>
                        )}
                    </div>
                    <button className="topping-sheet__close" onClick={onClose}>✕</button>
                </div>
                <div className="topping-sheet__tabs">
                    {TOPPING_TABS.map(tab => {
                        const count = toppings?.[tab.key]?.length || 0;
                        return (
                            <button key={tab.id} type="button"
                                className={`topping-sheet__tab ${activeTab === tab.id ? 'topping-sheet__tab--active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                                {count > 0 && (
                                    <span style={{ marginLeft: '6px', display: 'inline-flex', alignItems: 'center',
                                        justifyContent: 'center', minWidth: '20px', height: '20px', padding: '0 5px',
                                        borderRadius: '10px', background: 'rgba(255,255,255,0.35)',
                                        fontSize: '0.72rem', fontWeight: '700' }}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="topping-sheet__body">
                    {activeTab === 'countAsTwo' && (
                        <ToppingsSelector
                            key="premium"
                            title={settings?.premiumTopppingLabel || 'Premium Toppings'}
                            options={toppingsData?.countAsTwo ?? []}
                            defaultOptions={[]}
                            selected={toppings?.countAsTwoToppings ?? []}
                            onChange={list => handleChange('countAsTwoToppings', list)}
                            toppingCount={1}
                            isIndianStyle={false}
                        />
                    )}
                    {activeTab === 'countAsOne' && (
                        <ToppingsSelector
                            key="regular"
                            title={settings?.regularToppingLabel || 'Regular Toppings'}
                            options={toppingsData?.countAsOne ?? []}
                            defaultOptions={[]}
                            selected={toppings?.countAsOneToppings ?? []}
                            onChange={list => handleChange('countAsOneToppings', list)}
                            toppingCount={1}
                            isIndianStyle={false}
                        />
                    )}
                    {activeTab === 'free' && (
                        <ToppingsSelector
                            key="indian"
                            title={settings?.indianToppingLabel || 'Indian Toppings'}
                            options={toppingsData?.freeToppings ?? []}
                            defaultOptions={[]}
                            selected={toppings?.freeToppings ?? []}
                            onChange={list => handleChange('freeToppings', list)}
                            toppingCount={1}
                            isIndianStyle={true}
                        />
                    )}
                </div>
                <div className="topping-sheet__footer">
                    <button className="topping-sheet__done" type="button" onClick={onClose}>
                        {(() => {
                            const n = (toppings?.countAsTwoToppings?.length || 0)
                                    + (toppings?.countAsOneToppings?.length || 0)
                                    + (toppings?.freeToppings?.length || 0);
                            return `✓ Done — ${n} topping${n !== 1 ? 's' : ''} selected`;
                        })()}
                    </button>
                </div>
            </div>
        </>
    );
};

// ── Pizza options (crust/sauce/etc) trigger buttons ───────────────────────────
function TriggerBtn({ icon, label, value, onClick }) {
    return (
        <button className="topping-trigger-btn" onClick={onClick} type="button">
            <span className="topping-trigger-btn__icon">{icon}</span>
            <span className="topping-trigger-btn__label">{label}</span>
            {value && <span className="topping-trigger-btn__count">{value}</span>}
            <span className="topping-trigger-btn__arrow">›</span>
        </button>
    );
}

// ── Pizza options form (shared by both Signature and CYO) ─────────────────────
const PizzaOptionsForm = ({ ingredients, options, setOptions, toppingsData, settings, freeAllowance }) => {
    const [openSheet, setOpenSheet] = useState(null);
    const [toppingSheetOpen, setToppingSheetOpen] = useState(false);

    // Lock scroll when any sub-sheet (option picker or toppings) is open.
    // useBodyScrollLock properly restores scroll even if navigation occurs while open.
    useBodyScrollLock(!!openSheet || toppingSheetOpen);

    const makeSheetHandler = (optionKey, field) => (id) => {
        const cfg = OPTION_CONFIG[optionKey];
        if (!cfg) return;
        const arr = optionKey === 'spicy' ? (ingredients?.spices || [])
                  : optionKey === 'specialBases' ? (ingredients?.specialbases || [])
                  : (ingredients?.[optionKey] || []);
        const opt = arr.find(o => o[cfg.codeKey] === id);
        if (opt) setOptions(prev => ({ ...prev, [field]: { [cfg.codeKey]: opt[cfg.codeKey], [cfg.nameKey]: opt[cfg.nameKey], price: opt.price || 0 } }));
    };

    const handleToppingsChange = (key, list) => {
        setOptions(prev => ({ ...prev, toppings: { ...(prev.toppings || {}), [key]: list } }));
    };

    const extraCharge = calcExtraCharge(options.toppings, freeAllowance);

    return (
        <div className="fd-pizza-options-form">
            {/* ── Dough ── */}
            {ingredients?.crust?.length > 0 && (
                <div className="mb-2">
                    <TriggerBtn icon="🫓" label="Dough" value={getName(options.crust, 'crust')} onClick={() => setOpenSheet('crust')} />
                    <OptionSheet isOpen={openSheet === 'crust'} onClose={() => setOpenSheet(null)} title="Choose Dough"
                        options={normalizeOptions(ingredients.crust, 'crust')}
                        selected={getCode(options.crust, 'crust')}
                        onSelect={makeSheetHandler('crust', 'crust')} />
                </div>
            )}

            {/* ── Crust Type ── */}
            {ingredients?.crustType?.length > 0 && (
                <div className="mb-2">
                    <TriggerBtn icon="⭕" label="Crust Type" value={getName(options.crustType, 'crustType')} onClick={() => setOpenSheet('crustType')} />
                    <OptionSheet isOpen={openSheet === 'crustType'} onClose={() => setOpenSheet(null)} title="Choose Crust Type"
                        options={normalizeOptions(ingredients.crustType, 'crustType')}
                        selected={getCode(options.crustType, 'crustType')}
                        onSelect={makeSheetHandler('crustType', 'crustType')} />
                </div>
            )}

            {/* ── Special Base ── */}
            {ingredients?.specialbases?.length > 0 && (
                <div className="mb-2">
                    <TriggerBtn icon="🍕" label="Special Base" value={getName(options.specialBases, 'specialBases')} onClick={() => setOpenSheet('specialBases')} />
                    <OptionSheet isOpen={openSheet === 'specialBases'} onClose={() => setOpenSheet(null)} title="Choose Special Base"
                        options={normalizeOptions(ingredients.specialbases, 'specialBases')}
                        selected={getCode(options.specialBases, 'specialBases')}
                        onSelect={makeSheetHandler('specialBases', 'specialBases')} />
                </div>
            )}

            {/* ── Cheese ── */}
            {ingredients?.cheese?.length > 0 && (
                <div className="mb-2">
                    <TriggerBtn icon="🧀" label="Cheese" value={getName(options.cheese, 'cheese')} onClick={() => setOpenSheet('cheese')} />
                    <OptionSheet isOpen={openSheet === 'cheese'} onClose={() => setOpenSheet(null)} title="Choose Cheese"
                        options={normalizeOptions(ingredients.cheese, 'cheese')}
                        selected={getCode(options.cheese, 'cheese')}
                        onSelect={makeSheetHandler('cheese', 'cheese')} />
                </div>
            )}

            {/* ── Spicy ── */}
            {ingredients?.spices?.length > 0 && (
                <div className="mb-2">
                    <TriggerBtn icon="🌶️" label="Spicy" value={getName(options.spicy, 'spicy')} onClick={() => setOpenSheet('spicy')} />
                    <OptionSheet isOpen={openSheet === 'spicy'} onClose={() => setOpenSheet(null)} title="Choose Spice Level"
                        options={normalizeOptions(ingredients.spices, 'spicy')}
                        selected={getCode(options.spicy, 'spicy')}
                        onSelect={makeSheetHandler('spicy', 'spicy')} />
                </div>
            )}

            {/* ── Sauce ── */}
            {ingredients?.sauce?.length > 0 && (
                <div className="mb-2">
                    <TriggerBtn icon="🥫" label="Sauce" value={getName(options.sauce, 'sauce')} onClick={() => setOpenSheet('sauce')} />
                    <OptionSheet isOpen={openSheet === 'sauce'} onClose={() => setOpenSheet(null)} title="Choose Sauce"
                        options={normalizeOptions(ingredients.sauce, 'sauce')}
                        selected={getCode(options.sauce, 'sauce')}
                        onSelect={makeSheetHandler('sauce', 'sauce')} />
                </div>
            )}

            {/* ── Cook ── */}
            {ingredients?.cook?.length > 0 && (
                <div className="mb-2">
                    <TriggerBtn icon="🔥" label="Cook" value={getName(options.cook, 'cook')} onClick={() => setOpenSheet('cook')} />
                    <OptionSheet isOpen={openSheet === 'cook'} onClose={() => setOpenSheet(null)} title="Choose Cook Style"
                        options={normalizeOptions(ingredients.cook, 'cook')}
                        selected={getCode(options.cook, 'cook')}
                        onSelect={makeSheetHandler('cook', 'cook')} />
                </div>
            )}

            {/* ── Toppings trigger ── */}
            <div className="mb-2">
                <button className="topping-trigger-btn" onClick={() => setToppingSheetOpen(true)} type="button">
                    <span className="topping-trigger-btn__icon">🥗</span>
                    <span className="topping-trigger-btn__label">Choose Toppings</span>
                    {toppingCountLabel(options.toppings) && (
                        <span className="topping-trigger-btn__count">{toppingCountLabel(options.toppings)}</span>
                    )}
                    <span className="topping-trigger-btn__arrow">›</span>
                </button>
                {allToppingNames(options.toppings).length > 0 && (
                    <div className="selected-toppings-pills mt-1">
                        {allToppingNames(options.toppings).map((n, i) => (
                            <span key={i} className="selected-topping-pill">{n}</span>
                        ))}
                    </div>
                )}
                {extraCharge > 0 && (
                    <div className="fd-extra-topping-warn">
                        +${extraCharge.toFixed(2)} extra topping charge
                    </div>
                )}
            </div>

            <ToppingSheet
                isOpen={toppingSheetOpen}
                onClose={() => setToppingSheetOpen(false)}
                toppingsData={toppingsData}
                toppings={options.toppings || { countAsTwoToppings: [], countAsOneToppings: [], freeToppings: [] }}
                setToppings={(updater) => {
                    setOptions(prev => ({
                        ...prev,
                        toppings: typeof updater === 'function'
                            ? updater(prev.toppings || {})
                            : updater,
                    }));
                }}
                settings={settings}
            />
        </div>
    );
};

// ── Default options from ingredients ─────────────────────────────────────────
// NOTE: toppingsDataRef is used to source freeToppings codes so they match exactly
// what ToppingsSelector renders (both use the same getToppings() source).
function buildDefaultOptions(ing, toppingsDataRef) {
    if (!ing) return {};
    const first = (arr, codeKey, nameKey) => {
        const o = arr?.[0];
        return o ? { [codeKey]: o[codeKey], [nameKey]: o[nameKey], price: 0 } : null;
    };

    // Prefer toppingsData.freeToppings (from getToppings()) over ing.toppings.freeToppings
    // so the toppingsCode values are guaranteed to match what ToppingsSelector uses.
    const freeSrc = toppingsDataRef?.freeToppings ?? ing?.toppings?.freeToppings ?? [];
    const preselectedFree = freeSrc.map(t => ({
        toppingsCode: t.toppingsCode || t.code,
        toppingsName: t.toppingsName ?? t.name ?? 'Topping',
        toppingsPrice: '0.00',
        toppingsPlacement: 'whole',
        amount: '0.00',
    }));

    return {
        crust:        first(ing.crust,       'crustCode',       'crustName'),
        crustType:    first(ing.crustType,   'crustTypeCode',   'crustType'),
        cheese:       first(ing.cheese,      'cheeseCode',      'cheeseName'),
        specialBases: first(ing.specialbases,'specialbaseCode', 'specialbaseName'),
        spicy:        first(ing.spices,      'spicyCode',       'spicy'),
        sauce:        first(ing.sauce,       'sauceCode',       'sauce'),
        cook:         first(ing.cook,        'cookCode',        'cook'),
        toppings: {
            countAsTwoToppings: [],
            countAsOneToppings: [],
            freeToppings: preselectedFree,
        },
    };
}

// ── Map a signature's topping list (topping_as_1 / topping_as_2 / topping_as_free)
// into the format ToppingsSelector / calcExtraCharge expects.
// toppingsDataCategory — the matching category array from getToppings() response
// (e.g. toppingsData.countAsTwo) so we resolve the live price from the same source
// the ToppingsSelector renders.
function mapSigToppingList(sigList, toppingsDataCategory = []) {
    if (!Array.isArray(sigList) || sigList.length === 0) return [];
    return sigList.map(t => {
        // Each entry in topping_as_x has { code, title/name, price }
        const code = t.code || t.toppingsCode;
        const live = toppingsDataCategory.find(
            td => (td.toppingsCode || td.code) === code
        );
        return {
            toppingsCode:      code,
            toppingsName:      t.title || t.name || t.toppingsName || 'Topping',
            toppingsPrice:     live?.toppingsPrice ?? String(t.price ?? '0.00'),
            toppingsPlacement: 'whole',
            amount:            live?.toppingsPrice ?? String(t.price ?? '0.00'),
        };
    });
}

// ── Signature defaults overlay on ingredient fields ──────────────────────────
// Also maps the pizza's own default toppings (topping_as_1/2/free) into selections,
// replacing the generic Indian-style pre-selection with the pizza's actual recipe.
function applySignatureDefaults(options, signatureDetails, ingredients, toppingsData) {
    if (!signatureDetails || !ingredients) return options;
    const find = (arr, codeKey, nameKey, code) => {
        const o = arr?.find(x => x[codeKey] === code);
        return o ? { [codeKey]: o[codeKey], [nameKey]: o[nameKey], price: 0 } : null;
    };

    // Build the pizza's own default toppings from the recipe fields returned by the API.
    // topping_as_2 → premium (countAsTwoToppings)
    // topping_as_1 → regular (countAsOneToppings)
    // topping_as_free → Indian/free (freeToppings)
    const countAsTwoToppings  = mapSigToppingList(signatureDetails.topping_as_2,    toppingsData?.countAsTwo   ?? []);
    const countAsOneToppings  = mapSigToppingList(signatureDetails.topping_as_1,    toppingsData?.countAsOne   ?? []);
    const freeToppings        = mapSigToppingList(signatureDetails.topping_as_free, toppingsData?.freeToppings ?? []);

    // If the signature has NO recipe toppings at all, fall back to pre-selecting
    // all Indian-style toppings (the default behaviour for generic pizzas).
    const hasRecipeToppings = countAsTwoToppings.length > 0 || countAsOneToppings.length > 0 || freeToppings.length > 0;
    const defaultFreeToppings = hasRecipeToppings
        ? freeToppings
        : (options.toppings?.freeToppings ?? []);  // from buildDefaultOptions (all Indians)

    return {
        ...options,
        crust:        find(ingredients.crust,       'crustCode',       'crustName',       signatureDetails.crust?.code)        ?? options.crust,
        crustType:    find(ingredients.crustType,   'crustTypeCode',   'crustType',       signatureDetails.crust_type?.code)   ?? options.crustType,
        cheese:       find(ingredients.cheese,      'cheeseCode',      'cheeseName',      signatureDetails.cheese?.code)       ?? options.cheese,
        specialBases: find(ingredients.specialbases,'specialbaseCode', 'specialbaseName', signatureDetails.special_base?.code) ?? options.specialBases,
        sauce:        find(ingredients.sauce,       'sauceCode',       'sauce',           signatureDetails.sauce?.code)        ?? options.sauce,
        spicy:        find(ingredients.spices,      'spicyCode',       'spicy',           signatureDetails.spices?.code)       ?? options.spicy,
        cook:         find(ingredients.cook,        'cookCode',        'cook',            signatureDetails.cook?.code)         ?? options.cook,
        toppings: {
            countAsTwoToppings,
            countAsOneToppings,
            freeToppings: defaultFreeToppings,
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — FlexDealPizzaSheet
// ═══════════════════════════════════════════════════════════════════════════════
const FlexDealPizzaSheet = ({ group, existingSlot, onPick, onClose, settings }) => {
    const [tab, setTab] = useState(existingSlot?.type === 'cyo' ? 'cyo' : 'signature');
    const freeAllowance = group?.free_toppings ?? group?.slot_config?.free_toppings ?? 0;

    // Lock body scroll for the entire duration this sheet is mounted.
    // useBodyScrollLock uses position:fixed trick (iOS-safe) and auto-restores on unmount.
    useBodyScrollLock(true);

    // ── Shared data (loaded once) ────────────────────────────────────────────
    const [ingredients, setIngredients] = useState(null);
    const [toppingsData, setToppingsData] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllIngredients(), getToppings(), getSignaturePizza()])
            .then(([ingRes, topRes, sigRes]) => {
                const ing = ingRes?.data ?? ingRes;
                setIngredients(Array.isArray(ing) ? {} : ing);
                setToppingsData(topRes?.data?.toppings ?? topRes?.data ?? {});
                const sigs = Array.isArray(sigRes) ? sigRes : sigRes?.data || [];
                setSignatures(sigs);
            })
            .catch(() => toast.error('Could not load pizza options'))
            .finally(() => setDataLoading(false));
    }, []);

    // ── Signature tab state ───────────────────────────────────────────────────
    const [sigCode, setSigCode] = useState(existingSlot?.type === 'signature' ? existingSlot.signaturePizzaCode : null);
    const [sigDetails, setSigDetails] = useState(null);
    const [sigLoading, setSigLoading] = useState(false);

    // Initialize sigOptions from existingSlot immediately (re-edit path) so toppings
    // are available on first render without waiting for the async defaults fetch.
    // For a fresh selection, start empty — the useEffect populates once defaults load.
    const [sigOptions, setSigOptions] = useState(() => {
        if (existingSlot?.type === 'signature' && existingSlot?.toppingData) {
            // Restore toppings from the slot saved earlier; crust/sauce etc. will
            // be overlaid from fetchSignaturePizzaDefaults once data loads.
            return {
                toppings: existingSlot.toppingData,
                ...(existingSlot.options || {}),
            };
        }
        return { toppings: { countAsTwoToppings: [], countAsOneToppings: [], freeToppings: [] } };
    });
    const [sigSheetOpen, setSigSheetOpen] = useState(false);

    // When a signature pizza is chosen → fetch its defaults
    useEffect(() => {
        if (!sigCode || !ingredients || !toppingsData) return;
        setSigLoading(true);
        fetchSignaturePizzaDefaults(sigCode)
            .then(res => {
                const details = res?.data ?? res;
                setSigDetails(details);

                setSigOptions(prev => {
                    const base = buildDefaultOptions(ingredients, toppingsData);
                    // Pass toppingsData so topping_as_1/2/free prices are resolved correctly
                    const withPizzaDefaults = applySignatureDefaults(base, details, ingredients, toppingsData);

                    // Re-edit detection: if prev was seeded from existingSlot (lazy useState),
                    // it already has > 0 toppings. Combined with matching the same pizza code,
                    // this identifies a re-edit — preserve the user's topping selections.
                    const prevTotalToppings =
                        (prev.toppings?.countAsTwoToppings?.length ?? 0) +
                        (prev.toppings?.countAsOneToppings?.length ?? 0) +
                        (prev.toppings?.freeToppings?.length ?? 0);

                    const isSamePizzaReEdit =
                        existingSlot?.type === 'signature' &&
                        existingSlot?.signaturePizzaCode === sigCode &&
                        prevTotalToppings > 0;

                    if (isSamePizzaReEdit) {
                        // Preserve all the user's previous topping selections;
                        // only overlay crust/sauce/etc from the recipe.
                        return {
                            ...withPizzaDefaults,
                            toppings:     prev.toppings,
                            crust:        existingSlot?.options?.crust        ?? withPizzaDefaults.crust,
                            crustType:    existingSlot?.options?.crustType    ?? withPizzaDefaults.crustType,
                            cheese:       existingSlot?.options?.cheese       ?? withPizzaDefaults.cheese,
                            specialBases: existingSlot?.options?.specialBases ?? withPizzaDefaults.specialBases,
                            spicy:        existingSlot?.options?.spicy        ?? withPizzaDefaults.spicy,
                            sauce:        existingSlot?.options?.sauce        ?? withPizzaDefaults.sauce,
                            cook:         existingSlot?.options?.cook         ?? withPizzaDefaults.cook,
                        };
                    }

                    // Fresh selection OR user switched to a different pizza →
                    // apply full recipe defaults (Onions, Green Pepper etc. from topping_as_*)
                    return withPizzaDefaults;
                });
            })
            .catch(() => toast.error('Could not load signature defaults'))
            .finally(() => setSigLoading(false));
    }, [sigCode, ingredients, toppingsData]);

    // When user switches to a DIFFERENT pizza, reset toppings to the new pizza's defaults.
    // We detect a change by comparing the previous sigCode.
    const prevSigCodeRef = React.useRef(sigCode);
    useEffect(() => {
        if (sigCode && sigCode !== prevSigCodeRef.current) {
            prevSigCodeRef.current = sigCode;
            // Clear toppings so the fetch useEffect applies fresh defaults for the new pizza
            setSigOptions({ toppings: { countAsTwoToppings: [], countAsOneToppings: [], freeToppings: [] } });
        }
    }, [sigCode]);



    const sigPizza = useMemo(() => signatures.find(p => p.code === sigCode) || null, [signatures, sigCode]);
    const sigExtraCharge = calcExtraCharge(sigOptions.toppings, freeAllowance);

    const handleSigConfirm = () => {
        if (!sigCode) { toast.warning('Please select a signature pizza'); return; }
        onPick({

            filled: true,
            type: 'signature',
            displayName: sigPizza?.pizza_name || sigPizza?.name || 'Signature Pizza',
            signaturePizzaCode: sigCode,
            signaturePizzaName: sigPizza?.pizza_name || sigPizza?.name || 'Signature Pizza',
            toppings: allToppingNames(sigOptions.toppings),
            toppingData: sigOptions.toppings,
            options: {
                crust: sigOptions.crust,
                crustType: sigOptions.crustType,
                cheese: sigOptions.cheese,
                specialBases: sigOptions.specialBases,
                spicy: sigOptions.spicy,
                sauce: sigOptions.sauce,
                cook: sigOptions.cook,
            },
            extraCharge: sigExtraCharge,
        });
    };

    // ── CYO tab state ─────────────────────────────────────────────────────────
    const [cyoOptions, setCyoOptions] = useState(null); // set once ingredients loaded

    useEffect(() => {
        if (!ingredients || !toppingsData || cyoOptions) return;
        const base = buildDefaultOptions(ingredients, toppingsData);
        if (existingSlot?.type === 'cyo') {
            // Restore from existing slot (all user selections preserved)
            setCyoOptions({
                ...base,
                crust:        existingSlot.options?.crust        ?? base.crust,
                crustType:    existingSlot.options?.crustType    ?? base.crustType,
                cheese:       existingSlot.options?.cheese       ?? base.cheese,
                specialBases: existingSlot.options?.specialBases ?? base.specialBases,
                spicy:        existingSlot.options?.spicy        ?? base.spicy,
                sauce:        existingSlot.options?.sauce        ?? base.sauce,
                cook:         existingSlot.options?.cook         ?? base.cook,
                toppings:     existingSlot.toppingData           ?? base.toppings,
            });
        } else {
            setCyoOptions(base);
        }
    }, [ingredients, toppingsData]);

    const cyoExtraCharge = calcExtraCharge(cyoOptions?.toppings, freeAllowance);

    const handleCYOConfirm = () => {
        if (!cyoOptions) return;
        onPick({
            filled: true,
            type: 'cyo',
            displayName: 'Build Your Own Pizza',
            toppings: allToppingNames(cyoOptions.toppings),
            toppingData: cyoOptions.toppings,
            options: {
                crust:        cyoOptions.crust,
                crustType:    cyoOptions.crustType,
                cheese:       cyoOptions.cheese,
                specialBases: cyoOptions.specialBases,
                spicy:        cyoOptions.spicy,
                sauce:        cyoOptions.sauce,
                cook:         cyoOptions.cook,
            },
            extraCharge: cyoExtraCharge,
        });
    };

    // ── Signature pizza selector (OptionSheet style) ──────────────────────────
    const sigOptions_normalized = useMemo(() =>
        signatures.map((p, i) => ({ id: p.code || i, label: p.pizza_name || p.name || `Pizza ${i + 1}`, price: 0 })),
    [signatures]);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="fd-picker-overlay" onClick={onClose}>
            <div className="fd-picker-sheet" onClick={e => e.stopPropagation()}>
                <div className="fd-picker-handle" />

                <div className="fd-picker-header">
                    <h4 className="fd-picker-title">Customize Pizza</h4>
                    <button className="fd-picker-close" onClick={onClose}>✕</button>
                </div>

                {freeAllowance > 0 && (
                    <div className="fd-picker-free-hint">
                        ★ {freeAllowance} free topping{freeAllowance !== 1 ? 's' : ''} included per pizza
                    </div>
                )}

                <div className="fd-picker-tabs">
                    <button className={`fd-picker-tab${tab === 'signature' ? ' active' : ''}`}
                        onClick={() => setTab('signature')}>⭐ Signature</button>
                    <button className={`fd-picker-tab${tab === 'cyo' ? ' active' : ''}`}
                        onClick={() => setTab('cyo')}>🎨 Build Your Own</button>
                </div>

                <div className="fd-picker-body">
                    {dataLoading ? (
                        <div className="fd-spinner-wrap"><div className="fd-spinner" /></div>
                    ) : (
                        <>
                            {/* ── SIGNATURE TAB ── */}
                            {tab === 'signature' && (
                                <div>
                                    {/* Signature pizza picker */}
                                    <div className="mb-3">
                                        <div className="fd-picker-section-label">SELECT PIZZA</div>
                                        <button className="topping-trigger-btn" type="button"
                                            onClick={() => setSigSheetOpen(true)}>
                                            <span className="topping-trigger-btn__icon">🍕</span>
                                            <span className="topping-trigger-btn__label" style={{ fontWeight: 600 }}>
                                                {sigPizza ? (sigPizza.pizza_name || sigPizza.name) : 'Choose a Signature Pizza'}
                                            </span>
                                            <span className="topping-trigger-btn__arrow">›</span>
                                        </button>
                                        <OptionSheet
                                            isOpen={sigSheetOpen}
                                            onClose={() => setSigSheetOpen(false)}
                                            title="Choose Signature Pizza"
                                            options={sigOptions_normalized}
                                            selected={sigCode}
                                            onSelect={(id) => { setSigCode(id); setSigSheetOpen(false); }}
                                        />
                                    </div>

                                    {/* Customization (only after signature picked + defaults loaded) */}
                                    {sigLoading && (
                                        <div className="fd-spinner-wrap" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                                            <div className="fd-spinner" />
                                        </div>
                                    )}
                                    {!sigLoading && sigCode && sigDetails && (
                                        <div>
                                            <div className="fd-picker-section-label">CUSTOMIZE YOUR PIZZA</div>
                                            <PizzaOptionsForm
                                                ingredients={ingredients}
                                                options={sigOptions}
                                                setOptions={setSigOptions}
                                                toppingsData={toppingsData}
                                                settings={settings}
                                                freeAllowance={freeAllowance}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── CYO TAB ── */}
                            {tab === 'cyo' && (
                                <div>
                                    {!cyoOptions ? (
                                        <div className="fd-spinner-wrap"><div className="fd-spinner" /></div>
                                    ) : (
                                        <>
                                            <div className="fd-picker-section-label">CUSTOMIZE YOUR PIZZA</div>
                                            <PizzaOptionsForm
                                                ingredients={ingredients}
                                                options={cyoOptions}
                                                setOptions={setCyoOptions}
                                                toppingsData={toppingsData}
                                                settings={settings}
                                                freeAllowance={freeAllowance}
                                            />
                                            </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ── Sticky confirm footer — always visible, never scrolls ── */}
                <div className="fd-picker-footer">
                    {tab === 'signature' && (
                        <>
                            {sigExtraCharge > 0 && (
                                <div className="fd-picker-extra-charge">
                                    Extra toppings: +${sigExtraCharge.toFixed(2)}
                                </div>
                            )}
                            <button
                                className="fd-cyo-confirm__btn"
                                onClick={handleSigConfirm}
                                disabled={!sigCode}
                            >
                                {sigCode
                                    ? `✓ Confirm Pizza Selection${sigExtraCharge > 0 ? ` (+$${sigExtraCharge.toFixed(2)})` : ''}`
                                    : 'Select a Pizza First'}
                            </button>
                        </>
                    )}
                    {tab === 'cyo' && cyoOptions && (
                        <>
                            {cyoExtraCharge > 0 && (
                                <div className="fd-picker-extra-charge">
                                    Extra toppings: +${cyoExtraCharge.toFixed(2)}
                                </div>
                            )}
                            <button
                                className="fd-cyo-confirm__btn"
                                onClick={handleCYOConfirm}
                            >
                                {`✓ Confirm Pizza Selection${cyoExtraCharge > 0 ? ` (+$${cyoExtraCharge.toFixed(2)})` : ''}`}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlexDealPizzaSheet;
export { calcExtraCharge, allToppingNames };
