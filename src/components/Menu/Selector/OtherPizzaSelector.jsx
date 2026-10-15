import React from 'react';
import { Link } from 'react-router-dom';
import { FaPizzaSlice } from 'react-icons/fa';
import '../../../assets/styles/modern-cards.css';
import OtherPizzas from '../../_main/OtherPizza/otherPizza';
import CartFunction from '../../cart';

function OtherPizzaSelector({ otherPizzas, topping }) {
    const cartFn = new CartFunction();

    if (!otherPizzas || otherPizzas.length === 0) return null;

    return (
        <section className="menu-section" id="other-pizzas">
            <div className="menu-section-header">
                <span className="menu-section-pill-tag">
                    <FaPizzaSlice className="me-1 text-danger" /> OVEN-FRESH FAVORITES
                </span>
                <div className="menu-section-title-row">
                    <h2 className="menu-section-heading">Classic & Specialty Pizzas</h2>
                    <Link to="/otherpizza" className="menu-section-view-all-btn">
                        View All Classics →
                    </Link>
                </div>
                <p className="menu-section-subtext">
                    Traditional recipes prepared with fresh hand-stretched dough and quality toppings.
                </p>
            </div>

            <div className="mc-grid" id="othermenucard">
                {otherPizzas.map((data) => (
                    <OtherPizzas
                        data={data}
                        key={'other-pizza-card-' + data?.code}
                        cartFn={cartFn}
                        toppingsData={topping}
                    />
                ))}
            </div>
        </section>
    );
}

export default OtherPizzaSelector;