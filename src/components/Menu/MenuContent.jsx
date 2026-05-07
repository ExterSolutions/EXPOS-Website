import SignatureSelector from './Selector/SignatureSelector'
import SpecialOfferSelector from './Selector/SpecialOfferSelector'
import OtherPizzaSelector from './Selector/OtherPizzaSelector'
import SidesSelector from './Selector/SidesSelector'
import DipsSelector from './Selector/DipsSelector'
import DrinksSelector from './Selector/DrinksSelector'

function MenuContent({
    signaturePizzas,
    specialOffers,
    otherPizzas,
    sides,
    dips,
    drinks,
    topping
}) {
    return (
        <>
            {/* SpecialOfferSelector and SignatureSelector hidden — Flex Deals covers these */}
            {/* <SpecialOfferSelector specialOffers={specialOffers} /> */}
            {/* <SignatureSelector signaturePizzas={signaturePizzas} topping={topping} /> */}
            <OtherPizzaSelector otherPizzas={otherPizzas} topping={topping} />
            <SidesSelector sides={sides} />
            <DipsSelector dips={dips} />
            <DrinksSelector drinks={drinks} />
        </>
    )
}

export default MenuContent