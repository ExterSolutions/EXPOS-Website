import React from 'react'
import { Button, Container, Modal } from "react-bootstrap";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";

function CustomizeViewSelectionModal({
    viewSelection,
    setViewSelection,
    Ingredients,
    pizzaSizeArr,
    size,
    CrustType,
    Spicy,
    Sauce,
    Crust,
    Cheese,
    Cook,
    SpecialBases,
    selectedTopping,
    isIndiansToppings,
    handleRemoveIsIndiansToppings,
    handleRemoveTopping,
    Drinks,
    handleRemovDrinks,
    Dips,
    handleRemoveDips,
    Sides,
    handleRemoveSides
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
                            {size && <div className=" pizza-card-border-color py-3">
                                <div className="row">
                                    <div className="col-lg-6">
                                        {size && <p className="lh-sm fs-6 mt-2 mt-lg-0"><GoDotFill /> Size: {size} (${pizzaSizeArr?.find((el) => el?.size === size)?.price})</p>}
                                        {CrustType && <p className="lh-sm fs-6 mt-2" ><GoDotFill /> Crust Type: {Ingredients?.crustType?.filter((top) => top?.crustTypeCode === CrustType)[0]?.crustType} (${Ingredients?.crustType?.filter((top) => top?.crustTypeCode === CrustType)[0]?.price})</p>}
                                        {Spicy && <p className="lh-sm fs-6 mt-2"><GoDotFill /> Spicy: {Ingredients?.spices?.filter((top) => top?.spicyCode === Spicy)[0]?.spicy} (${Ingredients?.spices?.filter((top) => top?.spicyCode === Spicy)[0]?.price})</p>}
                                        {Sauce && <p className="lh-sm fs-6 mt-2"><GoDotFill /> Sauce: {Ingredients?.sauce?.filter((top) => top?.sauceCode === Sauce)[0]?.sauce} (${Ingredients?.sauce?.filter((top) => top?.sauceCode === Sauce)[0]?.price})</p>}
                                    </div>
                                    <div className="col-lg-6" >
                                        {Crust && <p className="lh-sm fs-6 mt-2 mt-lg-0"><GoDotFill /> Crust: {Ingredients?.crust?.filter((top) => top?.crustCode === Crust)[0]?.crustName} (${Ingredients?.crust?.filter((top) => top?.crustCode === Crust)[0]?.price})</p>}
                                        {Cheese && <p className="lh-sm fs-6 mt-2"><GoDotFill /> Cheese: {Ingredients?.cheese?.filter((top) => top?.cheeseCode === Cheese)[0]?.cheeseName} (${Ingredients?.cheese?.filter((top) => top?.cheeseCode === Cheese)[0]?.price})</p>}
                                        {Cook && <p className="lh-sm fs-6 mt-2"><GoDotFill /> Cook: {Ingredients?.cook?.filter((top) => top?.cookCode === Cook)[0]?.cook} (${Ingredients?.cook?.filter((top) => top?.cookCode === Cook)[0]?.price})</p>}
                                        {SpecialBases && <p className="lh-sm fs-6 mt-2"><GoDotFill /> Special Base: {Ingredients?.specialbases?.filter((top) => top?.specialbaseCode === SpecialBases)[0]?.specialbaseName} (${Ingredients?.specialbases?.filter((top) => top?.specialbaseCode === SpecialBases)[0]?.price})</p>}
                                    </div>
                                </div>
                            </div>}

                            {selectedTopping?.length > 0 && (
                                <div className="py-3 border-top pizza-card-border-color">
                                    <p>TOPPINGS YOU SELECTED</p>
                                    <div className="mt-3 d-flex flex-wrap gap-2">
                                        {isIndiansToppings ? (
                                            <>
                                                {/* Display a single button for Indian Toppings Toppings */}
                                                <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">
                                                    Indian Toppings + Coriander
                                                    <span
                                                        className="ms-2"
                                                        onClick={handleRemoveIsIndiansToppings}
                                                    >
                                                        <IoMdClose />
                                                    </span>
                                                </button>

                                                {/* Display non-free toppings */}
                                                {selectedTopping
                                                    ?.filter((el) => el?.type !== "free")
                                                    ?.map((el) => (
                                                        <div key={el.code}>
                                                            <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">
                                                                {`${el?.name}(${el?.size}) ($${el?.price})`}
                                                                <span
                                                                    className="ms-1"
                                                                    onClick={() => handleRemoveTopping(el)}
                                                                >
                                                                    <IoMdClose />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    ))}
                                            </>
                                        ) : (
                                            // Display all selected toppings
                                            selectedTopping?.map((el) => (
                                                <div key={el.code}>
                                                    <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">
                                                        {`${el?.name}(${el?.size}) ($${el?.price})`}
                                                        <span
                                                            className="ms-1"
                                                            onClick={() => handleRemoveTopping(el)}
                                                        >
                                                            <IoMdClose />
                                                        </span>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}


                            {Drinks?.length > 0 && <div className="py-3 border-top pizza-card-border-color">
                                <p>DRINKS YOU SELECTED</p>
                                <div className="mt-3 d-flex flex-wrap gap-3">
                                    {Drinks?.map((el) => {
                                        return <div>
                                            <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.name}(${el?.quantity}) ($${el?.totalPrice})`}<span className="ms-2" onClick={() => handleRemovDrinks(el)}><IoMdClose /></span></button>
                                        </div>
                                    })}
                                </div>
                            </div>}
                            {Dips?.length > 0 && <div className="py-3 border-top pizza-card-border-color">
                                <p>DIPS YOU SELECTED</p>
                                <div className="mt-3 d-flex flex-wrap gap-3">
                                    {Dips?.map((el) => {
                                        return <div>
                                            <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.name}(${el?.quantity}) ($${el?.totalPrice})`}<span className="ms-2" onClick={() => handleRemoveDips(el)}><IoMdClose /></span></button>
                                        </div>
                                    })}
                                </div>
                            </div>}
                            {Sides?.length > 0 && <div className="py-3 border-top pizza-card-border-color">
                                <p>SIDES YOU SELECTED</p>
                                <div className="mt-3 d-flex flex-wrap gap-3">
                                    {Sides?.map((el) => {
                                        return <div>
                                            <button className="px-3 py-1 btn card-secondary-tabs-background-color rounded-5">{`${el?.sideName}(${el?.quantity}) ($${el?.totalPrice})`}<span className="ms-2" onClick={() => handleRemoveSides(el)}><IoMdClose /></span></button>
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

export default CustomizeViewSelectionModal