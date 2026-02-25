const SignaturePizzaSelector = ({
    signaturePizzas,
    selectedCode,
    onChange,
}) => {
    // console.log("SignaturePizzaSelector received signaturePizzas:", signaturePizzas);
    return (
        <div className="mb-3">
            <div className="fw-bold text-dark mb-2">SELECT PIZZA</div>
            <select
                className="form-select form-select-sm"
                value={selectedCode || ""}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">-- Select Pizza --</option>
                {(Array.isArray(signaturePizzas) ? signaturePizzas : (signaturePizzas?.data || []))?.map((p, idx) => (
                    <option key={p.code || p.sideCode || p.id || idx} value={p.code || p.sideCode || p.id}>
                        {p.pizza_name || p.pizzaName || p.name || p.sideName || `Pizza ${idx + 1}`}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SignaturePizzaSelector;
