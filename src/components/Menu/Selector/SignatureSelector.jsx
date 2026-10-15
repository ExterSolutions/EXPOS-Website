import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import '../../../assets/styles/modern-cards.css';
import SignaturePizzas from '../../_main/SignaturePizza/signturePizza';
import CartFunction from '../../cart';

function SignatureSelector({ signaturePizzas, topping }) {
    const cartFn = new CartFunction();

    if (!signaturePizzas || signaturePizzas.length === 0) return null;

    return (
        <section className="menu-section" id="signature-pizzas">
            <div className="menu-section-header">
                <span className="menu-section-pill-tag">
                    <FaStar className="me-1 text-warning" /> CHEF'S SIGNATURE SPECIALS
                </span>
                <div className="menu-section-title-row">
                    <h2 className="menu-section-heading">Signature Pizzas</h2>
                    <Link to="/signaturepizza" className="menu-section-view-all-btn">
                        View All Signatures →
                    </Link>
                </div>
                <p className="menu-section-subtext">
                    Customer favorites and specialty recipes loaded with gourmet ingredients.
                </p>
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