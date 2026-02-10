import { Button, Container, Modal } from "react-bootstrap";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";

function DealsViewSelectionModal({
    viewSelection,
    setViewSelection,
    numberOfDips,
    freeDipsCount,
    addtionalDipsCount,
    size,
    pizzaSizeArr,
    showSpecialOfferConfig,
    Drinks,
    Dips,
    dipsData,
    handleRemoveDips,
    Sides
}) {
    return (
        <Modal
            show={viewSelection}
            onHide={setViewSelection}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className="primary-background-color">
                <Modal.Title>
                    Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="primary-background-color" style={{ overflowY: "auto", width: "100%", maxHeight: "calc(100vh - 300px)" }}>
                <Container className="card-background-color">
                    <div className="px-3 row">
                        <div className="scrollable-content">
                            <div className=' pizza-card-border-color py-3'>
                                <div className='row'>
                                    <div className="col-12 p-2">
                                        <div className="d-flex flex-column py-2">
                                            {numberOfDips > 0 && <>
                                                <p className="fs-5 mb-2 fw-bold">Free Dips: <span className='mx-2'>{freeDipsCount} / {numberOfDips}</span></p>
                                                <p className="fs-5 fw-bold">Additional Dips: <span className='mx-2'>{addtionalDipsCount}</span></p>
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {size && <div className="border-top pizza-card-border-color mt-1 py-3">
                                <div className="row">
                                    <div className="col-lg-12">
                                        {size && <p className="lh-sm fs-6 mt-2 mt-lg-0"><GoDotFill /> Size: {size} ({pizzaSizeArr?.find((data) => data?.size === size)?.price})</p>}
                                    </div>
                                </div>
                            </div>}
                            {showSpecialOfferConfig}
                            {Drinks?.length > 0 && <div className="py-3 border-top pizza-card-border-color">
                                <p>DRINKS YOU SELECTED</p>
                                <div className="mt-3 d-flex flex-wrap gap-3">
                                    {Drinks?.map((el) => {
                                        return <div>
                                            <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.drinksName}(${el?.quantity}) ($${el?.totalPrice})`}</button>
                                        </div>
                                    })}
                                </div>
                            </div>}
                            {Dips?.length > 0 && <div className="py-3 border-top pizza-card-border-color">
                                <p>DIPS YOU SELECTED</p>
                                <div className="mt-3 d-flex flex-wrap gap-3">
                                    {Dips?.map((el) => {
                                        return <div>
                                            <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.dipsName}(${el?.quantity}) ($${dipsData?.find((data) => data?.dipsCode === el?.dipsCode)?.price * el?.quantity})`} <span className="ms-2" onClick={() => handleRemoveDips(el)}><IoMdClose /></span></button>
                                        </div>
                                    })}
                                </div>
                            </div>}
                            {Sides?.length > 0 && <div className="py-3 border-top pizza-card-border-color">
                                <p>SIDES YOU SELECTED</p>
                                <div className="mt-3 d-flex flex-wrap gap-3">
                                    {Sides?.map((el) => {
                                        return <div>
                                            <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.sideName}(${el?.quantity}) ($${el?.totalPrice})`}</button>
                                        </div>
                                    })}
                                </div>
                            </div>}
                        </div>
                    </div>
                </Container>
            </Modal.Body>
            <Modal.Footer className="primary-background-color">
                <Button
                    variant="danger"
                    onClick={() => {
                        setViewSelection();
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DealsViewSelectionModal