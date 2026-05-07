import '../../../assets/styles/modern-cards.css';
import Sides from '../../_main/Sides/Sides';
import CartFunction from '../../cart';

function SidesSelector({ sides }) {
    const cartFn = new CartFunction();
    if (!sides || sides.length === 0) return null;
    return (
        <div className="section pt-1" id="sidesmenucard">
            <div className="mc-section-header">
                <div>
                    <span className="mc-section-sub">PERFECT PAIRINGS</span>
                    <h2 className="mc-section-title">Cravable Sides</h2>
                </div>
            </div>
            <div className="mc-grid">
                {sides?.map((data) => (
                    <Sides data={data} key={data.sideCode} cartFn={cartFn} />
                ))}
            </div>
        </div>
    )
}

export default SidesSelector