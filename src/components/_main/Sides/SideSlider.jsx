import { useEffect, useRef } from "react";
import '../../../assets/styles/modern-cards.css';
import Sides from "./Sides";

function SideSlider({ data, cartFn }) {
    return (
        <div className="section" id="sidesmenucard">
            <div className="container">
                <h4 className="text-center text-capitalize mb-4 py-3">
                    <span className="sp-hr-left"></span>
                    <span>{data?.type}</span>
                    <span className="sp-hr-right"></span>
                </h4>
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
