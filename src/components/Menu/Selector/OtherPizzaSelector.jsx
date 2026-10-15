import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPizzaSlice, FaArrowRight } from 'react-icons/fa';
import OtherPizzas from '../../_main/OtherPizza/otherPizza';
import CartFunction from '../../cart';

function OtherPizzaSelector({ otherPizzas, topping }) {
    const cartFn = new CartFunction();
    const navigate = useNavigate();

    if (!otherPizzas || otherPizzas.length === 0) return null;

    return (
        <section className="menu-section pt-4" id="other-pizzas">
            <div className="menu-section-header-wrapper d-flex align-items-end justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <span className="menu-section-pill-tag">
                        <FaPizzaSlice className="me-1 text-danger" /> OVEN-FRESH FAVORITES
                    </span>
                    <h2 className="menu-section-heading mt-1 mb-0">Classic & Specialty Pizzas</h2>
                    <p className="menu-section-subtext mb-0 mt-1">
                        Traditional recipes prepared with fresh hand-stretched dough and quality toppings.
                    </p>
                </div>
                <button
                    className="menu-section-view-all-btn"
                    onClick={() => navigate('/otherpizza')}
                >
                    View All Pizzas <FaArrowRight className="ms-1" size={12} />
                </button>
            </div>

            <div className="row g-3 signature-grid" id="othermenucard">
                {otherPizzas.map((data) => (
                    <div
                        className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                        key={'other-pizza-card-' + data?.code}
                    >
                        <OtherPizzas
                            data={data}
                            key={data.code}
                            cartFn={cartFn}
                            toppingsData={topping}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default OtherPizzaSelector;