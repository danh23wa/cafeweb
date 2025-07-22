import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define the Store interface
interface Store {
    StoreID: number;
    StoreName: string;
    Latitude: number;
    Longitude: number;
    Address: string;
    ImageURL?: string;
}

const StoreLocator = () => {
    const { t } = useTranslation();
    const [city, setCity] = useState("");
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState({ lat: 10.762622, lng: 106.660172 });

    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const routeRef = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([userLocation.lat, userLocation.lng], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapRef.current);
        }

        // Lấy vị trí thực tế của người dùng
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    mapRef.current.setView([latitude, longitude], 13);
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    }, []);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!city) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:3000/api/stores/search?address=${encodeURIComponent(city)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                setError(t('fetchError'));
                setStores([]);
                return;
            }

            const res = await response.json();
            console.log('API data:', res);
            // Support both { data: [...] } and [...] formats
            let storesData: Store[] = Array.isArray(res) ? res : res.data;
            setStores(storesData || []);

            if (mapRef.current) {
                markersRef.current.forEach((marker) => marker.remove());
                markersRef.current = [];

                storesData.forEach((store: Store) => {
                    const marker = L.marker([store.Latitude, store.Longitude])
                        .addTo(mapRef.current)
                        .bindPopup(`<b>${store.StoreName}</b><br>${store.Address}`);
                    markersRef.current.push(marker);
                });

                if (storesData.length > 0) {
                    mapRef.current.setView([storesData[0].Latitude, storesData[0].Longitude], 13);
                }
            }
        } catch (error) {
            setError(t('fetchError'));
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoute = (store: Store) => {
        if (!mapRef.current) return;

        if (routeRef.current) {
            mapRef.current.removeLayer(routeRef.current);
        }

        const storeLocation = { lat: store.Latitude, lng: store.Longitude };

        const routingURL = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${storeLocation.lng},${storeLocation.lat}?overview=full&geometries=geojson`;

        fetch(routingURL)
            .then((response) => response.json())
            .then((data) => {
                if (!data.routes || data.routes.length === 0) {
                    setError(t('routeError'));
                    return;
                }

                const routeCoords = data.routes[0].geometry.coordinates.map((coord: number[]) => [
                    coord[1],
                    coord[0],
                ]);

                routeRef.current = L.polyline(routeCoords, { color: "blue", weight: 5 }).addTo(mapRef.current);
                mapRef.current.fitBounds(routeRef.current.getBounds());
            })
            .catch(() => setError(t('routeError')));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">{t('storeLocatorTitle')}</h2>
            <div className="row">
                {/* Cột tìm kiếm */}
                <div className="col-md-4">
                    <div className="card p-3 shadow border-0">
                        <h5 className="card-title text-center text-secondary">{t('selectCityTitle')}</h5>
                        <form onSubmit={handleSearch}>
                            <div className="mb-3">
                                <select
                                    className="form-select form-select-lg"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    <option value="">{t('selectLocation')}</option>
                                    <option value="Bình Dương">{t('cities.binhDuong')}</option>
                                    <option value="Bình Thuận">{t('cities.binhThuan')}</option>
                                    <option value="Cần Thơ">{t('cities.canTho')}</option>
                                    <option value="Hà Nội">{t('cities.haNoi')}</option>
                                    <option value="Hồ Chí Minh">{t('cities.hoChiMinh')}</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                {t('searchButton')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Cột danh sách cửa hàng */}
                <div className="col-md-8">
                    <div className="card p-3 shadow border-0">
                        <h5 className="card-title text-secondary text-center">{t('storeListTitle')}</h5>
                        {loading && <p className="text-center text-warning">{t('loading')}</p>}
                        {error && <p className="text-danger text-center">{error}</p>}
                        <div className="row">
                            {stores.length > 0 ? (
                                stores.map((store: Store) => (
                                    <div key={store.StoreID} className="col-md-6 mb-3">
                                        <div className="card border-0 shadow-sm">
                                            <img
                                                src={store.ImageURL || "https://via.placeholder.com/400x300?text=No+Image"}
                                                className="card-img-top rounded"
                                                alt={store.StoreName}
                                            />
                                            <div className="card-body text-center">
                                                <h6 className="card-title text-primary">{store.StoreName}</h6>
                                                <p className="card-text">{store.Address}</p>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleRoute(store)}
                                                >
                                                    {t('viewRoute')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !loading && <p className="text-center text-muted">{t('noStoresFound')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bản đồ */}
            <div id="map" style={{ height: "450px", borderRadius: "10px" }} className="mt-4 shadow"></div>
        </div>
    );
};

export default StoreLocator; 