// import "../../../assets/styles/menu-cards/signatures.css";
import OtherPizzas from '../../_main/OtherPizza/otherPizza';
import CartFunction from '../../cart';

function OtherPizzaSelector({ otherPizzas, topping }) {
    const cartFn = new CartFunction();
    if (!otherPizzas || otherPizzas.length === 0) return null;
    return (
        <>
            <div className="section pt-1" id="signaturemenucard">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                        <div className="section-title">Our Delicious Items</div>
                    </div>
                </div>
                <div className="row g-3 signature-grid">
                    {otherPizzas?.map((data) => {
                        return (
                            <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                                <OtherPizzas data={data} key={data.code} cartFn={cartFn} toppingsData={topping} />
                            </div>
                        )
                    })}
                </div>
            </div >
        </>
    )
}

export default OtherPizzaSelector