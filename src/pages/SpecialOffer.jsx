// import "../assets/styles/menu-cards/speicaldeal.css";
import SpecialOfferCard from '../components/_main/SpecialOffer/SpecialOfferCard';
import DataNotFound from '../layouts/DataNotFound';


function SpecialOffer({ specialOfferData, basePath }) {

    if (specialOfferData?.length < 0) return <DataNotFound />;
    return (
        <div className="section" id="specialmenucard">
            <div className="container-fluid container-lg mb-5">
                <div className="row g-3">
                    {specialOfferData?.map((data) => {
                        return (
                            <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                                <SpecialOfferCard key={data.code} data={data} basePath={basePath} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default SpecialOffer