import React, { useState } from "react";
import OptionSheet from "../../../components/_main/OptionSheet";

const SignaturePizzaSelector = ({
    signaturePizzas,
    selectedCode,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const pizzas = (Array.isArray(signaturePizzas) ? signaturePizzas : (signaturePizzas?.data || []));
    const normalizedOptions = pizzas.map((p, idx) => ({
        id: p.code || p.sideCode || p.id || idx,
        label: p.pizza_name || p.pizzaName || p.name || p.sideName || `Pizza ${idx + 1}`,
        price: 0,
    }));

    const currentPizza = pizzas.find(p => (p.code || p.sideCode || p.id) === selectedCode);
    const selectedLabel = currentPizza 
        ? (currentPizza.pizza_name || currentPizza.pizzaName || currentPizza.name || currentPizza.sideName)
        : "Select Pizza";

    return (
        <div className="mb-3">
            <div className="fw-bold text-uppercase mb-2" style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}>
                SELECT PIZZA
            </div>
            
            <button 
                className="topping-trigger-btn" 
                onClick={() => setIsOpen(true)} 
                type="button"
            >
                <span className="topping-trigger-btn__icon">🍕</span>
                <span className="topping-trigger-btn__label" style={{ fontWeight: '600' }}>
                    {selectedLabel}
                </span>
                <span className="topping-trigger-btn__arrow">›</span>
            </button>

            <OptionSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Choose Pizza"
                options={normalizedOptions}
                selected={selectedCode}
                onSelect={(id) => {
                    onChange(id);
                    setIsOpen(false);
                }}
            />
        </div>
    );
};

export default SignaturePizzaSelector;
