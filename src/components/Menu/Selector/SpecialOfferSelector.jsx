// import "../../../assets/styles/menu-cards/speicaldeal.css";
import SpecialOfferCard from '../../_main/SpecialOffer/SpecialOfferCard';

function SpecialOfferSelector({ specialOffers }) {
    return (
        <div className="section pt-1" id="specialmenucard">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="flex-grow-1 section-header">
                    <span className="category-subtitle">Craving Something New?</span>
                    <div className="section-title">Explore Our Top Deals</div>
                </div>
            </div>
            <div className="row g-3 signature-grid">
                {specialOffers?.map((data) => {
                    return (
                        <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                            <SpecialOfferCard key={data.code} data={data} />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default SpecialOfferSelector