import React from 'react'

function CombinationMismatch() {
    return (
        <div className="new-block" id="create-your-own-new">
            <div className="nav-margin"></div>
            <section className="special-offers-sec new-block BgsecondaryBlackColor my-5">
                <div className="container">
                    <div className='row justify-content-center'>
                        <div className='col-xl-5 col-lg-5 col-md-6 col-sm-12'>
                            <div className='card bgPrimaryBlackColor'>
                                <div className='card-header text-center'>
                                    <p className='m-3 fs-4 fw-bold text-danger'><strong>Warning</strong> </p>
                                </div>
                                <div className='card-body text-center'>
                                    <p className='text-white fs-5' >Some of the selected pizza combinations are not available.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CombinationMismatch