import "../../../assets/styles/grid-cards.css";
import "../../../assets/styles/menu-cards/signatures.css";
import SignaturePizzas from '../../_main/SignaturePizza/signturePizza';
import CartFunction from '../../cart';

function SignatureSelector({ signaturePizzas, topping }) {
    const cartFn = new CartFunction();
    return (
        <>
            <div className="section pt-1" id="signaturemenucard">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                        <div className="section-title">Our Customers Top Picks</div>
                    </div>
                </div>
                <div className="row g-3 signature-grid">
                    {signaturePizzas?.map((data) => {
                        return (
                            <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                                <SignaturePizzas data={data} cartFn={cartFn} toppingsData={topping} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default SignatureSelector