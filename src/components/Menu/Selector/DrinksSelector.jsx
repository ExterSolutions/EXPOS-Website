import "../../../assets/styles/menu-cards/speicaldeal.css";
import Drink from '../../_main/DrinksOld/Drink';
import CartFunction from '../../cart';

function DrinksSelector({ drinks }) {
    const cartFn = new CartFunction();
    return (
        <>
            <div className="section pt-1 mt-5" id='specialmenucard'>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                        <div className="section-title">Drinks</div>
                    </div>
                </div>
                <div className="row g-3 signature-grid">
                    {drinks?.map((data, idx) => {
                        return (
                            <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                                <Drink data={data} idx={idx} cartFn={cartFn} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default DrinksSelector