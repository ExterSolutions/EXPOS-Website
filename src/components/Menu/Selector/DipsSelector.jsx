
import Dips from '../../_main/Dips/Dips';
import CartFunction from '../../cart';

function DipsSelector({ dips }) {
    const cartFn = new CartFunction();
    if (!dips || dips.length === 0) return null;

    return (
        <>
            <div className="section pt-1 mt-5" id="dipsmenucard">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                        <div className="section-title">Dips</div>
                    </div>
                </div>
                <div className="row g-3 signature-grid">
                    {dips?.map((data) => {
                        return (
                            <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                                <Dips key={data.dipsCode} data={data} cartFn={cartFn} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default DipsSelector