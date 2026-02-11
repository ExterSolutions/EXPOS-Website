import React from 'react';



const FormSection = ({ formData, errors, loading, handleChange, handleSubmit }) => {
    return (
        <section className="form-section-perfect">
            <div className="form-header">
                <span className="form-badge">Join us</span>
                <h2 className="form-title">
                    Are you ready
                    <br />
                    to join us?
                </h2>
            </div>

            <form className="franchise-form" onSubmit={handleSubmit}>
                <div className="form-row-group">
                    <div className="form-field">
                        <label>First Name *</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            className={errors.first_name ? 'error-input' : ''}
                        />
                        {errors.first_name && <p className="input-error">{errors.first_name}</p>}
                    </div>
                    <div className="form-field">
                        <label>Last Name *</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className={errors.last_name ? 'error-input' : ''}
                        />
                        {errors.last_name && <p className="input-error">{errors.last_name}</p>}
                    </div>
                </div>

                <div className="form-row-group">
                    <div className="form-field">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={errors.email ? 'error-input' : ''}
                        />
                        {errors.email && <p className="input-error">{errors.email}</p>}
                    </div>
                    <div className="form-field">
                        <label>Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone (10 digits)"
                            maxLength="10"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className={errors.phone ? 'error-input' : ''}
                        />
                        {errors.phone && <p className="input-error">{errors.phone}</p>}
                    </div>
                </div>

                <div className="form-row-group">
                    <div className="form-field">
                        <label>City *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            className={errors.city ? 'error-input' : ''}
                        />
                        {errors.city && <p className="input-error">{errors.city}</p>}
                    </div>
                    <div className="form-field">
                        <label>Province *</label>
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            placeholder="Province/State"
                            className={errors.province ? 'error-input' : ''}
                        />
                        {errors.province && <p className="input-error">{errors.province}</p>}
                    </div>
                </div>

                <div className="form-field full-width-field">
                    <label>Country *</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={errors.country ? 'error-input' : ''}
                    >
                        <option value="">Select Country</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option>
                    </select>
                    {errors.country && <p className="input-error">{errors.country}</p>}
                </div>

                <div className="form-field full-width-field">
                    <label>Preferred Area *</label>
                    <input
                        type="text"
                        name="preferred_area"
                        value={formData.preferred_area}
                        onChange={handleChange}
                        placeholder="Preferred Area"
                        className={errors.preferred_area ? 'error-input' : ''}
                    />
                    {errors.preferred_area && <p className="input-error">{errors.preferred_area}</p>}
                </div>

                <div className="form-field full-width-field">
                    <label>What are your ideal liquid capital? *</label>
                    <select
                        name="total_liquid_assets"
                        value={formData.total_liquid_assets}
                        onChange={handleChange}
                        className={errors.total_liquid_assets ? 'error-input' : ''}
                    >
                        <option value="">Select Range</option>
                        <option value="50k-100k">$50K - $100K</option>
                        <option value="100k-200k">$100K - $200K</option>
                        <option value="200k+">$200K+</option>
                    </select>
                    {errors.total_liquid_assets && <p className="input-error">{errors.total_liquid_assets}</p>}
                </div>

                <div className="form-field full-width-field">
                    <label>What is your timeframe for starting a business? *</label>
                    <div className="radio-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="timeframe"
                                value="Immediately"
                                checked={formData.timeframe === "Immediately"}
                                onChange={handleChange}
                            />
                            <span>Immediately</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="timeframe"
                                value="1-2 months"
                                checked={formData.timeframe === "1-2 months"}
                                onChange={handleChange}
                            />
                            <span>1-2 months</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="timeframe"
                                value="3-6 months"
                                checked={formData.timeframe === "3-6 months"}
                                onChange={handleChange}
                            />
                            <span>3-6 months</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="timeframe"
                                value="Greater than 1 year"
                                checked={formData.timeframe === "Greater than 1 year"}
                                onChange={handleChange}
                            />
                            <span>Greater than 1 year</span>
                        </label>
                    </div>
                    {errors.timeframe && <p className="input-error">{errors.timeframe}</p>}
                </div>

                <div className="form-field full-width-field">
                    <label>Preferred Language *</label>
                    <input
                        type="text"
                        name="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleChange}
                        placeholder="English"
                        className={errors.preferred_language ? 'error-input' : ''}
                    />
                    {errors.preferred_language && <p className="input-error">{errors.preferred_language}</p>}
                </div>

                <div className="checkbox-field full-width-field">
                    <label className={`checkbox-option ${errors.marketing_consent ? 'error-checkbox' : ''}`}>
                        <input
                            type="checkbox"
                            name="marketing_consent"
                            checked={formData.marketing_consent}
                            onChange={handleChange}
                        />
                        <span>I consent to receive marketing text messages from Pizza Franchise at the phone number provided. I understand that my consent is not a condition of my FDD request. Msg&data rates apply. *</span>
                    </label>
                    {errors.marketing_consent && <p className="input-error">{errors.marketing_consent}</p>}
                </div>

                <div className="checkbox-field full-width-field">
                    <label className={`checkbox-option ${errors.terms_consent ? 'error-checkbox' : ''}`}>
                        <input
                            type="checkbox"
                            name="terms_consent"
                            checked={formData.terms_consent}
                            onChange={handleChange}
                        />
                        <span>I consent to receive non-marketing text messages from Pizza Franchise email. My initial website registration and submission of this Franchise inquiry form constitutes my electronic signature. *</span>
                    </label>
                    {errors.terms_consent && <p className="input-error">{errors.terms_consent}</p>}
                </div>

                <div className="full-width-field">
                    <button type="submit" className="submit-form-btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default FormSection;