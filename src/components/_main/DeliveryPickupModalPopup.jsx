import { useContext, useEffect, useState } from 'react';
import { FaPeopleCarry } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {GlobalContext} from '../../context/GlobalContext';
import LocationAccessContent from './LocationAccessContent';
import { useTheme } from '../../context/ThemeContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

function DeliveryPickupModalPopup({ setShow }) {
    const [currentTab, setCurrentTab] = useState('pickup');
    const globalCtx = useContext(GlobalContext);
    const { theme, colors } = useTheme();
    const [selectedType, setSelectedType] = globalCtx.selectedType;
    const [currentCity, setCurrentCity] = globalCtx.currentCity;
    const [currentStore, setCurrentStore] = globalCtx.currentStore;
    const navigate = useNavigate();

    // Prevent background scroll while this modal is open (iOS-safe)
    useBodyScrollLock(true);

    const handleTabChange = (tabName) => {
        setCurrentTab(tabName);
        setSelectedType(tabName);
        localStorage.setItem('selectedType', tabName);
    };

    useEffect(() => {
        if (selectedType) {
            setCurrentTab(selectedType);
        }
    }, [selectedType]);

    const handleStartOrder = () => {
        if (currentCity && currentStore) {
            toast.success("Store selected, now start your order");
            const isOrderNowFlow = localStorage.getItem('orderNowFlow') === 'true';
            if (isOrderNowFlow) {
                localStorage.removeItem('orderNowFlow');
                navigate('/checkout');
            }
            setShow(false);
        } else {
            toast.error('Please select a store to start your order');
        }
    }

    return (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header mb-0">
                        <div>
                            <div className='fs-5'>Let's Get Ordering</div>
                            <small className='fw-medium'>
                                Pickup Items From Your Nearest Stores
                            </small>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShow(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className='position-relative locationAccessModal'>
                            <ul className="nav nav-tabs nav-fill mb-2 gap-2" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`rounded-5 nav-link ${currentTab === 'pickup' ? 'active' : ''}`}
                                        id="pickup-tab-1"
                                        data-bs-toggle="tab"
                                        href="#pickup-tabpanel-1"
                                        role="tab"
                                        aria-controls="pickup-tabpanel-1"
                                        aria-selected={currentTab === 'pickup'}
                                        onClick={() => handleTabChange('pickup')}
                                        style={currentTab === 'pickup' ? {
                                            backgroundColor: colors?.primary ,
                                            color: '#fff',
                                            borderColor: colors?.primary 
                                        } : {
                                            color: colors?.primary ,
                                            borderColor: colors?.primary
                                        }}
                                    >
                                        <FaPeopleCarry /> Pickup
                                    </a>
                                </li>
                            </ul>
                            <LocationAccessContent currentTab={currentTab} isModal={true} setShow={setShow} isOrderMethodSelection={true} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary rounded-5"
                            onClick={() => setShow(false)}
                            style={{ padding: '7px 14px' }}
                        >
                            Close
                        </button>
                        <button 
                            className={`btn btn-sm rounded-5 startOrderBtn`} 
                            onClick={handleStartOrder}
                            style={{
                                backgroundColor: colors?.primary || '#e1282a',
                                color: '#fff',
                                borderColor: colors?.primary || '#e1282a'
                            }}
                        >
                            Start Your Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryPickupModalPopup;