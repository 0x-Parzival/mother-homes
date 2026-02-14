import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Valid Token from Environment
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapItem {
    id: string | number;
    latitude: number;
    longitude: number;
    img: string;
    title: string;
    bedroom: number;
    price: number;
    [key: string]: unknown;
}

interface GlobeProps {
    items?: MapItem[];
    selectedItem?: MapItem | null;
    onMarkerClick?: (item: MapItem) => void;
}

const Globe: React.FC<GlobeProps> = ({ items = [], selectedItem, onMarkerClick }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1', // Using navigation night style
            center: [77.209, 28.6139], // Default to Delhi
            zoom: 1.5,
            projection: { name: 'globe' } as any
        });

        mapRef.current.on('style.load', () => {
            if (!mapRef.current) return;
            mapRef.current.setFog({
                color: 'rgb(11, 11, 25)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)',
                'star-intensity': 0.6
            });
        });

        // Add navigation controls
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    // Update markers when items change
    useEffect(() => {
        if (!mapRef.current) return;

        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (items.length === 0) return;

        const bounds = new mapboxgl.LngLatBounds();

        items.forEach(item => {
            if (!item.latitude || !item.longitude) return;

            // Validate coordinates
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);

            if (isNaN(lat) || isNaN(lng)) return;

            const el = document.createElement('div');
            el.className = 'globe-marker';
            el.style.width = '12px';
            el.style.height = '12px';
            el.style.borderRadius = '50%';
            // Highlight selected item color
            el.style.backgroundColor = selectedItem?.id === item.id ? '#0ea5e9' : '#465fff';
            el.style.border = '2px solid white';
            el.style.boxShadow = selectedItem?.id === item.id
                ? '0 0 15px rgba(14, 165, 233, 0.8)'
                : '0 0 10px rgba(70, 95, 255, 0.5)';
            el.style.cursor = 'pointer';
            el.style.transition = 'all 0.3s ease';

            // Add click listener
            el.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent map click
                if (onMarkerClick) onMarkerClick(item);
            });

            // Create popup content
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; color: #101828; font-family: sans-serif;">
          <img src="${item.img}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
          <h4 style="margin: 0; font-size: 14px; font-weight: bold;">${item.title}</h4>
          <p style="margin: 4px 0 0; font-size: 12px; color: #667085;">₹${item.price.toLocaleString()} • ${item.bedroom} BHK</p>
        </div>
      `);

            const marker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([lng, lat]);
        });

        // Only fit bounds initially or if we strictly want to auto-zoom on filter changes
        // For now, let's avoid re-fitting if we just selected an item
    }, [items, selectedItem, onMarkerClick]);

    // Fly to selected item
    useEffect(() => {
        if (selectedItem && mapRef.current) {
            const lat = Number(selectedItem.latitude);
            const lng = Number(selectedItem.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {
                mapRef.current.flyTo({
                    center: [lng, lat],
                    zoom: 12,
                    duration: 2500,
                    essential: true,
                    padding: { left: 380, top: 0, bottom: 0, right: 0 } // Offset for sidebar
                });
            }
        }
    }, [selectedItem]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-black">
            <div ref={mapContainerRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 z-10 glass px-3 py-1.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-md">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    3D Globe Exploration
                </p>
            </div>
        </div>
    );
};

export default Globe;
