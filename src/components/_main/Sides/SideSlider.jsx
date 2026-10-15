import { useEffect, useRef } from "react";
import '../../../assets/styles/modern-cards.css';
import Sides from "./Sides";

function SideSlider({ data, cartFn }) {
    return (
        <div className="section" id="sidesmenucard">
            <div className="container">
                <div className="page-header-modern mb-2">
                    <span className="page-subtitle-modern">🍟 CRAVABLE SIDES</span>
                    <h2 className="page-title-modern text-capitalize">{data?.type || 'Sides'}</h2>
                    <p className="page-desc-modern">Delicious sides and appetizers made fresh to order.</p>
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
