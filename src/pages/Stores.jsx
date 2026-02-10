import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { memo, useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import mapMaker from "../assets/images/map-maker.png";
import "../assets/styles/stores/storelocation.css";
import Footer from "../components/_main/Footer";
import Header from "../components/_main/Header/Header";
import SearchBox from "../components/_main/Stores/SearchBox";
import StoreCard from "../components/_main/Stores/StoresCard";
import { GlobalContext } from "../context/GlobalContext";
import LoadingLayout from "../layouts/LoadingLayout";
import { getStoreLocation, getStoreLocationByCity } from "../services";


const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    overflow: "hidden",
};

const Stores = () => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_KEY,
    });

    const [map, setMap] = React.useState(null);
    const [storeLocations, setStoreLocations] = React.useState([]);
    const [storeLocationByCity, setStoreLocationByCity] = React.useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [selectedStoreCode, setSelectedStoreCode] = useState(null);
    const [mapCenter, setMapCenter] = useState({
        lat: 51.168318,
        lng: -100.714792,
    }); // Default center (Canada)
    const [mapZoom, setMapZoom] = useState(3.7);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const globalctx = useContext(GlobalContext);
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
    const [currentCity, setCurrentCity] = globalctx.currentCity;
    const [currentStore, setCurrentStore] = globalctx.currentStore;
    const [currentLatitude, setCurrentLatitude] = globalctx.currentLatitude;
    const [currentLogitude, setCurrentLogitude] = globalctx.currentLogitude;

    const mapOptions = {
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
    };

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleClearSearch = () => {
        setSearchQuery(""); // Clear the search query
        if (currentLatitude && currentLogitude) {
            setMapCenter({ lat: currentLatitude, lng: currentLogitude }); // Reset map center
        } else {
            setMapCenter({ lat: 51.168318, lng: -100.714792 }); // Reset map center to default
        }
        setMapZoom(3.7); // Reset map zoom
    };

    const handleMarkerClick = (store) => {
        if (!store || !store.latitude || !store.longitude) return;

        setMapCenter({
            lat: parseFloat(store.latitude),
            lng: parseFloat(store.longitude),
        });
        setMapZoom(12);
        setActiveMarker(store.code);
        setSelectedStoreCode(store.code);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [getStoreLocationData, getStoreLocationByCityData] = await Promise.all([
                getStoreLocation({
                    lat: currentLatitude ?? "",
                    long: currentLogitude ?? "",
                }),
                getStoreLocationByCity(),
            ]);
            const storeData = getStoreLocationData?.data || [];
            const cityData = getStoreLocationByCityData?.data || [];

            setStoreLocations(storeData);
            setStoreLocationByCity(cityData);
        } catch (err) {
            setStoreLocations([]);
            setStoreLocationByCity([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [currentLatitude, currentLogitude]);

    useEffect(() => {
        if (storeLocations?.length > 0 && currentStoreCode) {
            setMapZoom(12);
            setActiveMarker(currentStoreCode);
            const currentStoreData = storeLocations?.find(
                (store) => store?.code === currentStoreCode
            );

            if (currentStoreData && currentStoreData.latitude && currentStoreData.longitude) {
                setMapCenter({
                    lat: parseFloat(currentStoreData.latitude),
                    lng: parseFloat(currentStoreData.longitude),
                });
                setSelectedStoreCode(currentStoreCode);
            }
        }
    }, [storeLocations, currentStoreCode]);

    useEffect(() => {
        const lowerQuery = (searchQuery || "").toLowerCase().trim();
        if (!storeLocations || storeLocations.length === 0) {
            setFilteredStores([]);
            return;
        }

        if (!lowerQuery) {
            setFilteredStores(storeLocations);
        } else {
            const filtered = storeLocations.filter(
                (store) =>
                    store &&
                    store.storeLocation &&
                    (store.storeLocation.toLowerCase().includes(lowerQuery) ||
                        (store.city && store.city.toLowerCase().includes(lowerQuery)))
            );
            setFilteredStores(filtered);
        }
    }, [searchQuery, storeLocations]);

    if (loading || !isLoaded) return <LoadingLayout />;

    return (
        <div id="location">
            <Header />
            <div className="d-flex align-items-center justify-content-between my-5">
                <div className="flex-grow-1 section-header">
                    <span className="category-subtitle">Our Stores</span>
                    <div className="section-title">Choose Your Nearest Store</div>
                </div>
            </div>
            <Container className="pb-3">
                <Row className="justify-content-center align-items-start">
                    <Col lg={4} md={6} sm={12}>
                        <SearchBox
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onClear={handleClearSearch}
                        />
                    </Col>
                </Row>

                <Row>
                    {filteredStores && filteredStores.length > 0 ? (
                        filteredStores.map((store, index) =>
                            store ? (
                                <Col xl={3} lg={4} md={6} sm={12} className="text-center rounded-3 p-2" key={`store-div-${store.code || index}`}>
                                    <div className="col-12 w-100" >
                                        <StoreCard
                                            key={store.code}
                                            code={store.code}
                                            isBtnSelected={store.code === currentStoreCode}
                                            storeName={store.storeLocation}
                                            storeCity={store.city}
                                            address={store.storeAddress}
                                            latitude={store.latitude}
                                            longitude={store.longitude}
                                            storeDistance={store.distance}
                                            isNearestStore={store.isNearestStore}
                                            onCardClick={() => handleMarkerClick(store)}
                                            isActive={activeMarker === store.code}
                                            setCurrentStoreCode={setCurrentStoreCode}
                                            setCurrentStore={setCurrentStore}
                                            setCurrentCity={setCurrentCity}
                                            storeLocationByCity={storeLocationByCity}
                                            currentLatitude={currentLatitude}
                                            currentLogitude={currentLogitude}
                                            setCurrentLatitude={setCurrentLatitude}
                                            setCurrentLogitude={setCurrentLogitude}
                                        />
                                    </div>
                                </Col>
                            ) : null
                        )
                    ) : (
                        <Col className="text-center p-3">
                            <p>No stores found</p>
                        </Col>
                    )}
                </Row>

                <Row className="justify-content-center align-items-start">

                    <Col xl={12} className="text-center mb-3">
                        <div className="map">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    onUnmount={onUnmount}
                                    options={mapOptions}
                                >
                                    {filteredStores
                                        ?.filter(
                                            (store) =>
                                                store && store.code && store.latitude && store.longitude
                                        )
                                        .map((store) => (
                                            <Marker
                                                key={store.code}
                                                position={{
                                                    lat: parseFloat(store.latitude),
                                                    lng: parseFloat(store.longitude),
                                                }}
                                                icon={mapMaker}
                                                title={store.storeLocation || "Store"}
                                                label={
                                                    store.code === selectedStoreCode
                                                        ? {
                                                            text: `${store.storeLocation || ""}${store.city ? "," + store.city : ""
                                                                }`,
                                                            color: "black",
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                        }
                                                        : null
                                                }
                                            />
                                        ))}
                                </GoogleMap>
                            ) : (
                                <div>Loading map...</div>
                            )}
                        </div>
                    </Col>

                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default memo(Stores);
