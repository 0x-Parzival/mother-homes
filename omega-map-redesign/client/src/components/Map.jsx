import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const Map = ({ locations, selectedLocation, setSelectedLocation, style }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    // Initialize Map
    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: style === 'satellite' ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/navigation-night-v1',
            center: [10, 45],
            zoom: 1.5,
            projection: 'globe'
        });

        mapRef.current.on('style.load', () => {
            mapRef.current.setFog({
                color: 'rgb(11, 11, 25)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)',
                'star-intensity': 0.6
            });
        });

        return () => mapRef.current.remove();
    }, []);

    // Update Style
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setStyle(style === 'satellite' ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/navigation-night-v1');
        }
    }, [style]);

    // Handle Markers
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear old markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        locations.forEach(loc => {
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.width = '16px';
            el.style.height = '16px';
            el.style.borderRadius = '50%';
            el.style.border = '2px solid white';
            el.style.backgroundColor = selectedLocation?.id === loc.id ? '#0ea5e9' : '#94a3b8';
            el.style.cursor = 'pointer';
            el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            el.style.transition = 'all 0.3s ease';

            el.addEventListener('click', () => setSelectedLocation(loc));

            const marker = new mapboxgl.Marker(el)
                .setLngLat([loc.coords[1], loc.coords[0]])
                .addTo(mapRef.current);

            markersRef.current.push(marker);
        });
    }, [locations, selectedLocation]);

    // Fly to selected
    useEffect(() => {
        if (selectedLocation && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedLocation.coords[1], selectedLocation.coords[0]],
                zoom: 12,
                duration: 2500,
                essential: true,
                padding: { left: 380, top: 0, bottom: 0, right: 0 }
            });
        }
    }, [selectedLocation]);

    return (
        <div ref={mapContainerRef} className="w-full h-full bg-[#050510]" />
    );
};

export default Map;
