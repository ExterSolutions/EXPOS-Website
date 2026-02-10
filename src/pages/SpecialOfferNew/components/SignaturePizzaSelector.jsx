const SignaturePizzaSelector = ({
    signaturePizzas,
    selectedCode,
    onChange,
}) => {
    return (
        <div className="mb-3">
            <div className="fw-bold text-dark mb-2">SELECT PIZZA</div>
            <select
                className="form-select form-select-sm"
                value={selectedCode || ""}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">-- Select Pizza --</option>
                {signaturePizzas.map((p) => (
                    <option key={p.code} value={p.code}>
                        {p.pizzaName || p.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SignaturePizzaSelector;
