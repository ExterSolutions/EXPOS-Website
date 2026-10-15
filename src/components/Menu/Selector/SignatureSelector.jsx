import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import '../../../assets/styles/modern-cards.css';
import SignaturePizzas from '../../_main/SignaturePizza/signturePizza';
import CartFunction from '../../cart';

function SignatureSelector({ signaturePizzas, topping }) {
    const cartFn = new CartFunction();
    const navigate = useNavigate();

    if (!signaturePizzas || signaturePizzas.length === 0) return null;

    return (
        <section className="menu-section pt-4" id="signature-pizzas">
            <div className="menu-section-header-wrapper d-flex align-items-end justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <span className="menu-section-pill-tag">
                        <FaStar className="me-1 text-warning" /> CHEF'S SIGNATURE SPECIALS
                    </span>
                    <h2 className="menu-section-heading mt-1 mb-0">Signature Pizzas</h2>
                    <p className="menu-section-subtext mb-0 mt-1">
                        Customer favorites and specialty recipes loaded with gourmet ingredients.
                    </p>
                </div>
                <button
                    className="menu-section-view-all-btn"
                    onClick={() => navigate('/signaturepizza')}
                >
                    View All Signatures <FaArrowRight className="ms-1" size={12} />
                </button>
            </div>

            <div className="mc-grid" id="signaturemenucard">
                {signaturePizzas.map((data) => (
                    <SignaturePizzas
                        data={data}
                        key={'signature-card-' + data?.code}
                        cartFn={cartFn}
                        toppingsData={topping}
                    />
                ))}
            </div>
        </section>
    );
}

export default SignatureSelector;