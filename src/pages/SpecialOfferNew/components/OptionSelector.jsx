import React, { useCallback, memo } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const OPTION_CONFIG = {
    crust: { codeKey: "crustCode", nameKey: "crustName" },
    crustType: { codeKey: "crustTypeCode", nameKey: "crustType" },
    cheese: { codeKey: "cheeseCode", nameKey: "cheeseName" },
    specialBases: { codeKey: "specialbaseCode", nameKey: "specialbaseName" },
    spicy: { codeKey: "spicyCode", nameKey: "spicy" },
    sauce: { codeKey: "sauceCode", nameKey: "sauce" },
    cook: { codeKey: "cookCode", nameKey: "cook" },
};

const OptionSelector = ({
    optionkey,
    title,
    options = [],
    defaultOption,
    selectedOption,
    onSelect,
}) => {

    // ✅ Hooks FIRST, no conditions
    const handleSelect = useCallback(
        (opt) => {
            const config = OPTION_CONFIG[optionkey];
            if (!config) return;
            const optionObj = {
                [config.codeKey]: opt[config.codeKey],
                [config.nameKey]: opt[config.nameKey],
                price: opt.price,
            }
            onSelect(optionObj);
        },
        [optionkey, onSelect]
    );

    // ✅ Resolve config AFTER hooks
    const config = OPTION_CONFIG[optionkey];
    if (!config) return null;

    return (
        <div className="mb-2">
            <div className="fw-medium mb-1 text-secondary" style={{ fontSize: "0.9rem" }}>
                {title}
            </div>

            <div className="d-flex flex-row flex-wrap gap-2">
                {options.map((opt, index) => {
                    const optCode = opt[config.codeKey];

                    const isSelected =
                        selectedOption?.[config.codeKey] === optCode;

                    const isDefault =
                        defaultOption?.code === optCode ||
                        defaultOption?.[config.codeKey] === optCode;

                    const price = isDefault ? 0 : Number(opt.price || 0);

                    return (
                        <div
                            key={optCode || index}
                            onClick={() => handleSelect({ ...opt, price })}
                            className={`rounded sm-font p-2 rounded theme-border ${isSelected ? "active" : ""}`}
                        >
                            <div
                                className="d-flex flex-row align-items-center gap-1"
                                style={{ minWidth: "100px" }}
                            >
                                <span>{opt[config.nameKey]}</span>
                                {opt.price !== null && (
                                    <span className="ms-1">
                                        (${price.toFixed(2)})
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(OptionSelector);
