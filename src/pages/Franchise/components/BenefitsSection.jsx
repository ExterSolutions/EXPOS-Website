import React from 'react';
import { FiCheckCircle, FiHeadphones, FiTrendingUp, FiAward } from "react-icons/fi";
import { useTheme } from '../../../context/ThemeContext';

const BenefitsSection = () => {
    const { theme, colors } = useTheme();
    return (
        <section className="benefits-section-perfect">
            <div className="benefits-header"
            >
                <span className="benefits-badge"

                >Franchise</span>
                <h2 className="benefits-title">
                    What you're
                    <br />
                    signing up for
                </h2>
            </div>

            <div className="benefits-grid">
                <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                        <FiTrendingUp className="benefit-icon" />
                    </div>
                    <h3 className="benefit-label">Growth</h3>
                </div>

                <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                        <FiAward className="benefit-icon" />
                    </div>
                    <h3 className="benefit-label">Top in the world</h3>
                </div>

                <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                        <FiCheckCircle className="benefit-icon" />
                    </div>
                    <h3 className="benefit-label">Simply Successful</h3>
                </div>

                <div className="benefit-item">
                    <div className="benefit-icon-wrapper">
                        <FiHeadphones className="benefit-icon" />
                    </div>
                    <h3 className="benefit-label">Training & Support</h3>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;