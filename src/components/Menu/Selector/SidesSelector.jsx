// import "../../../assets/styles/menu-cards/sides.css";
import Sides from '../../_main/Sides/Sides';
import CartFunction from '../../cart';

function SidesSelector({ sides }) {
    const cartFn = new CartFunction();
    return (
        <>
            <div className="section pt-1" id="sidesmenucard">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                        <div className="section-title">Cravable Sides</div>
                    </div>
                </div>
                <div className="row g-3 signature-grid">
                    {sides?.map((data) => {
                        return (
                            <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                                <Sides data={data} key={data.sideCode} cartFn={cartFn} />
                            </div>
                        )
                    })}
                </div>
            </div >
        </>
    )
}

export default SidesSelector