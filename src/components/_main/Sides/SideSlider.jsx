import { useEffect, useRef } from "react";
import '../../../assets/styles/modern-cards.css';
import Sides from "./Sides";

function SideSlider({ data, cartFn }) {
    return (
        <div className="section" id="sidesmenucard">
            <div className="container">
                <div className="menu-section-header">
                    <span className="menu-section-pill-tag">🍟 CRAVABLE SIDES</span>
                    <div className="menu-section-title-row">
                        <h2 className="menu-section-heading text-capitalize">{data?.type || 'Sides'}</h2>
                    </div>
                </div>
                <div className="mc-grid">
                    {data?.sides?.map((side, index) => (
                        <Sides
                            data={side}
                            key={`side-grid-card-${side?.sideCode || side?.code || index}`}
                            cartFn={cartFn}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SideSlider;
