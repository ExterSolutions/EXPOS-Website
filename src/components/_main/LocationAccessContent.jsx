import { useContext, useEffect, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import Select from "react-select";
import { toast } from 'react-toastify';
import {GlobalContext} from '../../context/GlobalContext';
import { getStoreByLatLong, getStoreLocationByCity } from '../../services';
import { useTheme } from '../../context/ThemeContext';

function LocationAccessContent({ currentTab, isModal, setShow, hasUserSelectedOption, isOrderMethodSelection = false }) {
    const location = useLocation();
    const [cities, setCities] = useState([]);
    const [stores, setStores] = useState([]);
     const { theme, colors } = useTheme();
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [totalStoresCount, setTotalStoresCount] = useState(0);
    const [hasAutoSelected, setHasAutoSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Global Context
    const globalctx = useContext(GlobalContext);
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
    const [currentCity, setCurrentCity] = globalctx.currentCity;
    const [currentStore, setCurrentStore] = globalctx.currentStore;
    const [scrollToSignature, setScrollToSignature] = globalctx.scrollToSignature;
    const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;
    const [currentLatitude, setCurrentLatitude] = globalctx.currentLatitude;
    const [currentLogitude, setCurrentLogitude] = globalctx.currentLogitude;

    // Check if location is already selected
    useEffect(() => {
        const savedStoreCode = localStorage.getItem('currentStoreCode');

        // If location already selected, close modal (but not for order method selection)
        if (savedStoreCode && isModal && !isOrderMethodSelection) {
            setTimeout(() => {
                setShow(false);
            }, 500);
        }
    }, [isModal, setShow, isOrderMethodSelection]);

    // Fetch data from API
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await getStoreLocationByCity();
            const cityOptions = res.data.map((item) => ({
                value: item.city,
                label: item.city,
                stores: item.storeLocations,
            }));
            setCities(cityOptions);

            // Calculate total number of stores
            const totalStores = cityOptions.reduce((count, city) => count + city.stores.length, 0);
            setTotalStoresCount(totalStores);

            // If only one location exists, pre-select it (but don't auto-close yet)
            if (cityOptions.length === 1 && cityOptions[0].stores.length === 1) {
                const singleCity = cityOptions[0];
                const singleStore = singleCity.stores[0];

                // Pre-select the single location (show in dropdowns)
                setSelectedCity(singleCity);
                setCurrentCity(singleCity);

                const storeOption = {
                    value: singleStore.code,
                    label: singleStore.storeLocation,
                };

                setStores([storeOption]);
                setSelectedStore(storeOption);
                setCurrentStore(storeOption);
                setCurrentStoreCode(singleStore.code);

                // Save to localStorage
                localStorage.setItem('currentCity', JSON.stringify(singleCity));
                localStorage.setItem('currentStoreCode', singleStore.code);
                localStorage.setItem('currentStore', JSON.stringify(storeOption));

                setHasAutoSelected(true);

                // Don't auto-close here - let user see the selected location
                // toast.success(`Auto-selected: ${singleStore.storeLocation}`);

            } else if (cityOptions.length === 1 && cityOptions[0].stores.length > 1) {
                // Only one city but multiple stores - pre-select city and show stores
                const singleCity = cityOptions[0];
                setSelectedCity(singleCity);
                setCurrentCity(singleCity);

                const storeOptions = singleCity.stores.map((store) => ({
                    value: store.code,
                    label: store.storeLocation,
                }));
                setStores(storeOptions);

                // Pre-select the first store as default
                if (storeOptions.length > 0) {
                    setSelectedStore(storeOptions[0]);
                    setCurrentStore(storeOptions[0]);
                    setCurrentStoreCode(storeOptions[0].value);

                    localStorage.setItem('currentCity', JSON.stringify(singleCity));
                    localStorage.setItem('currentStoreCode', storeOptions[0].value);
                    localStorage.setItem('currentStore', JSON.stringify(storeOptions[0]));
                }
            }

        } catch (error) {
            toast.error(`Error fetching data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-select and close logic - only runs when user selects Delivery/Pickup AND there's only one location
    useEffect(() => {
        if (hasUserSelectedOption && hasAutoSelected && totalStoresCount === 1) {
            // Auto-close only when user has selected Delivery/Pickup AND there's only one location
            if (isModal) {
                setTimeout(() => {
                    setShow(false);
                    toast.success(`Location selected: ${currentStore?.label}`);
                }, 1000);
            }
        }
    }, [hasUserSelectedOption, hasAutoSelected, totalStoresCount, isModal, setShow, currentStore]);

    useEffect(() => {
        fetchData();
    }, []);

    const latLongWiseStore = async (lat, long) => {
        try {
            setIsLoading(true);
            const res = await getStoreByLatLong(lat, long);

            if (res?.data?.length > 0) {
                // If only one store found from location, select it
                if (res.data.length === 1) {
                    const store = res.data[0];
                    const city = cities.find((c) => c.value === store.city);

                    if (city) {
                        setCurrentStoreCode(store.code);
                        setSelectedCity(city);
                        setCurrentCity(city);

                        const storeOption = {
                            value: store.code,
                            label: store.storeLocation,
                        };

                        setStores([storeOption]);
                        setCurrentStore(storeOption);
                        setSelectedStore(storeOption);

                        // Save to localStorage
                        localStorage.setItem('currentCity', JSON.stringify(city));
                        localStorage.setItem('currentStoreCode', store.code);
                        localStorage.setItem('currentStore', JSON.stringify(storeOption));

                        // Set Lat Long
                        setCurrentLatitude(lat);
                        setCurrentLogitude(long);
                        localStorage.setItem('currentLatitude', lat);
                        localStorage.setItem('currentLogitude', long);

                        toast.success(`Location selected: ${store.storeLocation}`);

                        // Auto-close modal
                        if (isModal) {
                            setTimeout(() => {
                                setShow(false);
                            }, 1500);
                        }
                    }
                } else {
                    // Multiple stores found - show selection
                    const nearestStore = res.data.find((data) => data?.isNearestStore === 1);
                    const city = cities.find((c) => c.value === nearestStore?.city);

                    if (city) {
                        setSelectedCity(city);
                        setCurrentCity(city);
                        localStorage.setItem('currentCity', JSON.stringify(city));

                        const storeOptions = city.stores.map((store) => ({
                            value: store.code,
                            label: store.storeLocation,
                        }));

                        setStores(storeOptions);

                        // Auto-select nearest store if available
                        if (nearestStore) {
                            const storeOption = storeOptions.find((store) => store.value === nearestStore.code);
                            if (storeOption) {
                                setSelectedStore(storeOption);
                                setCurrentStoreCode(nearestStore.code);
                                setCurrentStore(storeOption);
                                localStorage.setItem('currentStoreCode', nearestStore.code);
                                localStorage.setItem('currentStore', JSON.stringify(storeOption));

                                toast.success(`Location selected: ${nearestStore.storeLocation}`);

                                // Auto-close modal
                                if (isModal) {
                                    setTimeout(() => {
                                        setShow(false);
                                    }, 1500);
                                }
                            }
                        }

                        // Set Lat Long
                        setCurrentLatitude(lat);
                        setCurrentLogitude(long);
                        localStorage.setItem('currentLatitude', lat);
                        localStorage.setItem('currentLogitude', long);
                    }
                }
            } else {
                toast.warning(res.message || 'No stores found near your location');
            }
        } catch (error) {
            toast.error('An error occurred while fetching location data.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle city selection
    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setCurrentCity(selectedOption);
        localStorage.setItem('currentCity', JSON.stringify(selectedOption));

        setSelectedStore(null);
        setCurrentStore(null);
        setCurrentStoreCode(null);
        localStorage.removeItem('currentStoreCode');
        localStorage.removeItem('currentStore');

        const storeOptions = selectedOption?.stores?.map((store) => ({
            value: store.code,
            label: store.storeLocation,
        }));
        setStores(storeOptions);

        // Auto-select if only one store in the city
        if (storeOptions.length === 1) {
            handleStoreChange(storeOptions[0]);
        }

        // Reset lat long
        setCurrentLatitude(null);
        setCurrentLogitude(null);
        localStorage.setItem('currentLatitude', null);
        localStorage.setItem('currentLogitude', null);
    };

    // Handle store selection
    const handleStoreChange = (selectedOption) => {
        setCurrentStoreCode(selectedOption.value);
        setCurrentStore(selectedOption);
        localStorage.setItem('currentStoreCode', selectedOption.value);
        localStorage.setItem('currentStore', JSON.stringify(selectedOption));
        setSelectedStore(selectedOption);

        // Reset lat long
        setCurrentLatitude(null);
        setCurrentLogitude(null);
        localStorage.setItem('currentLatitude', null);
        localStorage.setItem('currentLogitude', null);

        // Auto-close if in modal and user has selected Delivery/Pickup
        if (location.pathname === '/' && isModal && hasUserSelectedOption) {
            setTimeout(() => {
                setShow(false);
            }, 1000);
        }

        setScrollToSignature(true);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await latLongWiseStore(latitude, longitude);
                },
                (err) => {
                    setIsLoading(false);
                    const errorMessages = {
                        1: 'Permission denied. Please allow location access.',
                        2: 'Position unavailable. Ensure GPS or location services are enabled.',
                        3: 'Request timed out. Please try again.',
                    };
                    toast.warning(errorMessages[err.code] || 'An unknown error occurred.');
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser.');
        }
    };

    useEffect(() => {
        setSelectedCity(currentCity);
        setSelectedStore(currentStore);

        const storeOptions = currentCity?.stores?.map((store) => ({
            value: store.code,
            label: store.storeLocation,
        }));
        setStores(storeOptions);
    }, [currentCity, currentStore]);

    return (
        <div className='getLatLong'>
            <small>Select your nearest store or use your location to continue...</small>
            <div className='row mx-auto g-2'>
                <div className='col-sm-12'>
                    <label htmlFor='city-select' className='form-label mb-0'>City:</label>
                    <Select
                        id='city-select'
                        options={cities}
                        value={selectedCity}
                        onChange={handleCityChange}
                        placeholder='Select a city...'
                        isSearchable
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            container: (base) => ({ ...base, width: '100%' }),
                        }}
                        aria-label='City Select'
                    />
                </div>
                <div className='col-sm-12'>
                    <label htmlFor='store-select' className='form-label mb-0'>Store:</label>
                    <Select
                        id='store-select'
                        options={stores}
                        value={selectedStore}
                        onChange={handleStoreChange}
                        placeholder={
                            selectedCity ? 'Select a store...' : 'Select a city first...'
                        }
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            container: (base) => ({ ...base, width: '100%' }),
                        }}
                        isSearchable
                        isDisabled={!selectedCity}
                        aria-label='Store Select'
                    />
                </div>
                <div className='col-sm-12 mt-2 text-center'>
                    <small>OR</small>
                </div>
                <div className='col-sm-12'>
                    <button
                        className='btn1 stl2 text-decoration-none fs-6 w-100'
                        onClick={getCurrentLocation}
                        disabled={isLoading}
                        
                    >
                        <FaLocationDot className='mb-1' />
                        {isLoading ? 'Detecting Location...' : 'Use my current location'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LocationAccessContent;