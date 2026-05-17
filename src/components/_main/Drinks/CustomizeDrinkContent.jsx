import { useState } from 'react';
import { FaEye, FaMinus, FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import LoadingLayout from '../../../layouts/LoadingLayout';
import SPNotFound from '../../../layouts/SPNotFound';
import ResponsiveCart from '../Cart/ResponsiveCart';
import CustomizeDrinkDropdown from './CustomizeDrinkDropdown';
import DrinksViewSelectionModal from './DrinksViewSelectionModal';
import SafeImage from '../../common/SafeImage';
import drinkFallback from '../../../assets/images/download/new/cat/drink.png';

function CustomizeDrinkContent({ loading, drinkData, settings, user, cartFn, setCart, currentStoreCode, setShowStorePopup }) {
    const [selectedDrinksTypeArr, setSelectedDrinksTypeArr] = useState([]);
    const [isFixed, setIsFixed] = useState(false);
    const [isTranslate, setIsTranslate] = useState(false);
    const [translateYVal, setTranslateYVal] = useState(null);
    const [drinksQuantity, setDrinksQuantity] = useState(1);
    const [showDrink, setShowDrinks] = useState(1);
    const [viewSelection, setViewSelection] = useState(false);

    const navigate = useNavigate();

    const toggleDrinks = (index) => {
        setShowDrinks(showDrink === index ? 1 : index);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 8);
    }
    // Handle Multiple Drinks Dropdown
    const spSelection = [];
    for (let i = 1; i <= drinkData?.drinksCount; i++) {
        spSelection.push(
            <CustomizeDrinkDropdown
                key={i}
                count={i}
                drinksType={drinkData?.drinkType}
                setSelectedDrinksTypeArr={setSelectedDrinksTypeArr}
                selectedDrinksTypeArr={selectedDrinksTypeArr}
                drinkData={drinkData}
                toggleDrinks={toggleDrinks}
                showDrink={showDrink}
                setShowDrinks={setShowDrinks}
            />
        );
    }

    const handleAddToCart = (e) => {
        if (e) e.preventDefault();
        if (currentStoreCode === undefined || currentStoreCode === null) {
            setShowStorePopup(true)
            return;
        }
        // For Comments Logic - Create String with comma separated
        const drinksComments = selectedDrinksTypeArr.join(", ");

        // Cart Object
        const payload = {
            id: uuidv4(),
            customerCode: user?.data?.customerCode,
            cashierCode: "#NA",
            productCode: drinkData.softdrinkCode,
            productName: drinkData.softDrinksName,
            productType: "drinks",
            config: {
                type: "",
            },
            price: drinkData.price,
            quantity: drinksQuantity,
            amount: (Number(drinkData?.price) * Number(drinksQuantity)).toFixed(2),
            taxPer: 0,
            pizzaSize: "",
            comments: drinksComments,
        };

        if (payload) {
            let ct = JSON.parse(localStorage.getItem("cart"));
            ct.product.push(payload);
            const cartProduct = ct.product;
            cartFn.addCart(cartProduct, setCart, false, settings);
            navigate('/');
        }
    }

    if (loading) {
        return <LoadingLayout />
    }

    return (
        <div>
            {drinkData ?
                <div>
                    <div className="new-block" id="create-your-own-new" >
                        <section className="special-offers-sec new-block primary-background-color">
                            <div className="container">
                                <div className="mainContainer" >
                                    {/* Left side */}
                                    <div className=" p-3">
                                        <div className="fs-1 fw-bold mb-4">{drinkData?.softDrinksName}</div>

                                        <div className="fs-3 fw-bold">CUSTOMIZE</div>
                                        <p className="mt-3 mb-3 fs-6">Customize drinks.</p>

                                        <div className="right-side-div p-0 w-100 d-lg-none d-block position-relative">
                                            <div className={`p-3 card-background-color card-text-color`}>
                                                <div className="row justify-content-start align-content-center p-0 m-0">
                                                    <div className="col-auto p-0 m-0 rounded-3 text-center">
                                                        <SafeImage
                                                            className="pizzaImageBorderSM"
                                                            src={drinkData?.image}
                                                            alt={drinkData?.softDrinksName || 'drink'}
                                                            fallback={drinkFallback}
                                                        />
                                                    </div>
                                                    <div className="col-7 p-0 m-0">
                                                        <div className="d-flex flex-column justify-content-center " style={{ padding: '0px 10px' }}>
                                                            <p className="lh-sm fw-bold text-start my-1 pizzaPriceSm">
                                                                $ {(Number(drinkData?.price) * Number(drinksQuantity)).toFixed(2)}
                                                            </p>
                                                            <div className="d-flex justify-content-start align-items-center my-1" style={{ userSelect: 'none' }}>
                                                                <button
                                                                    disabled={drinksQuantity <= 1}
                                                                    onClick={() => setDrinksQuantity(prev => prev - 1)}
                                                                    className="btn btn-secondary rounded-circle pizzaQtyButtonSm"
                                                                    aria-label="Decrease Quantity"
                                                                >
                                                                    <FaMinus className="pizzaQtyButtonSpanSm fs-6" />
                                                                </button>
                                                                <div className="lh-sm fs-5 fw-bold mx-2">{drinksQuantity}</div>
                                                                <button
                                                                    disabled={drinksQuantity >= 10}
                                                                    onClick={() => setDrinksQuantity(prev => prev + 1)}
                                                                    className="btn btn-secondary rounded-circle pizzaQtyButtonSm"
                                                                    aria-label="Increase Quantity"
                                                                >
                                                                    <FaPlus className="pizzaQtyButtonSpanSm fs-6" />
                                                                </button>
                                                            </div>
                                                            <div className="d-flex flex-row justify-content-start">
                                                                <div className="d-flex me-2 justify-content-start py-2">
                                                                    <button
                                                                        onClick={handleAddToCart}
                                                                        className="btn pizza-card-btn-background-color pizza-card-btn-text-color fw-bold pizzaAddToCardBtnSm"
                                                                    >
                                                                        Add to Cart
                                                                    </button>
                                                                </div>
                                                                <div className="d-flex justify-content-start py-2">
                                                                    <button
                                                                        onClick={() => setViewSelection(true)}
                                                                        className="btn pizza-view-selection-btn-background-color pizza-card-btn-text-color fw-bold pizzaAddToCardBtnSm"
                                                                    >
                                                                        <FaEye />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {spSelection}
                                    </div>

                                    {/* Right side */}
                                    <div className="right-side-div p-3 d-lg-block postion-relative d-none">
                                        <div className={`p-3 right-side-internal-div-new card-background-color card-text-color`}>
                                            <div className="row">
                                                <div className="col-lg-6 p-3 rounded-3">
                                                    <SafeImage
                                                        className="pizzaImageBorder"
                                                        src={drinkData?.image}
                                                        alt={drinkData?.softDrinksName || 'drink'}
                                                        fallback={drinkFallback}
                                                    />
                                                </div>
                                                <div className="col-lg-6 p-4">
                                                    <div className="d-flex flex-column py-4">
                                                        <p className="lh-sm fs-1 fw-bold text-center text-lg-start">
                                                            $ {(Number(drinkData?.price) * Number(drinksQuantity)).toFixed(2)}
                                                        </p>
                                                        <div className=" d-flex justify-content-center  justify-content-lg-start  mt-3 py-2" style={{ userSelect: 'none' }}>
                                                            <button disabled={drinksQuantity <= 1} onClick={() => setDrinksQuantity(prev => prev - 1)} className="btn btn-secondary rounded-circle pizzaQtyButton" ><FaMinus className="pizzaQtyButtonSpan" /></button>
                                                            <p className="lh-sm fs-4 fw-bold mx-3">{drinksQuantity}</p>
                                                            <button disabled={drinksQuantity >= 10} className="btn btn-secondary rounded-circle pizzaQtyButton" onClick={() => setDrinksQuantity(prev => prev + 1)}  ><FaPlus className="pizzaQtyButtonSpan" /></button>
                                                        </div>
                                                        <div className="d-flex justify-content-center justify-content-lg-start">
                                                            <button
                                                                onClick={() => handleAddToCart()}
                                                                className={`view-button px-3`}
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="scrollable-content">
                                                    <div className="col-12">
                                                        {selectedDrinksTypeArr && selectedDrinksTypeArr.length > 0 && (
                                                            <div className="border-top pizza-card-border-color mt-4 py-3">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <ResponsiveCart handleCart={handleAddToCart} totalPrice={drinkData?.price} section={'Add to Cart'} />
                    <DrinksViewSelectionModal
                        viewSelection={viewSelection}
                        setViewSelection={setViewSelection}
                        selectedDrinksTypeArr={selectedDrinksTypeArr}
                    />
                </div> : <SPNotFound />
            }
        </div>
    );
}

export default CustomizeDrinkContent;