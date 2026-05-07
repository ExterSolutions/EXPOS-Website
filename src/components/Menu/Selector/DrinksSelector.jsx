import '../../../assets/styles/modern-cards.css';
import Drink from '../../_main/DrinksOld/Drink';
import CartFunction from '../../cart';

function DrinksSelector({ drinks }) {
    const cartFn = new CartFunction();
    if (!drinks || drinks.length === 0) return null;
    return (
        <div className="section pt-1 mt-5" id="drinksmenucard">
            <div className="mc-section-header">
                <div>
                    <span className="mc-section-sub">REFRESHING PICKS</span>
                    <h2 className="mc-section-title">Drinks</h2>
                </div>
            </div>
            <div className="mc-grid">
                {drinks?.map((data, idx) => (
                    <Drink data={data} idx={idx} key={"drink-" + data?.softdrinkCode || idx} cartFn={cartFn} />
                ))}
            </div>
        </div>
    )
}

export default DrinksSelector