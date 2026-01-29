import React from 'react'
import { Button, Container, Modal } from "react-bootstrap";

function DrinksViewSelectionModal({
    viewSelection,
    setViewSelection,
    selectedDrinksTypeArr,
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
                            <div className="col-12">
                                {selectedDrinksTypeArr && selectedDrinksTypeArr.length > 0 && (
                                    <div className="pizza-card-border-color  py-3">
                                        <p className='fs-6 fw-bold  mx-1'>Drinks Type: </p>
                                        <div className="d-flex flex-wrap">
                                            {selectedDrinksTypeArr.map((data, index) => (
                                                <p className="lh-sm fs-6 mt-2 mb-0 mx-1" key={index}>
                                                    {data}
                                                    {index < selectedDrinksTypeArr.length - 1 && ','}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
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
    );
}

export default DrinksViewSelectionModal