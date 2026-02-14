import React, { useState } from 'react';
import { Search, MapPin, ChevronRight, Home, IndianRupee } from 'lucide-react';
import clsx from 'clsx';

// Type definition based on Property interface
interface Property {
    _id: string;
    property_name: string;
    rate: number;
    bed: number;
    bathroom: number;
    city: string;
    state: string;
    images: string[];
    latitude: string;
    longitude: string;
    category: "rent" | "sale" | "pg";
    totalCapacity: string;
    description?: string;
}

interface LocationSidebarProps {
    locations: Property[];
    selectedLocation: Property | null;
    setSelectedLocation: (location: Property) => void;
    isOpen: boolean;
}

const LocationSidebar: React.FC<LocationSidebarProps> = ({ locations, selectedLocation, setSelectedLocation, isOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCities, setExpandedCities] = useState<string[]>(['Delhi', 'Mumbai', 'Bangalore']); // Default expanded

    // Group by City
    const grouped = locations.reduce<Record<string, Property[]>>((acc, loc) => {
        const city = loc.city || 'Other';
        if (!acc[city]) acc[city] = [];
        acc[city].push(loc);
        return acc;
    }, {});

    // Filter locations
    const filteredGrouped = Object.entries(grouped).reduce<Record<string, Property[]>>((acc, [city, locs]) => {
        const filtered = locs.filter(l =>
            l.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.state.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length) acc[city] = filtered;
        return acc;
    }, {});

    const toggleCity = (city: string) => {
        setExpandedCities(prev =>
            prev.includes(city)
                ? prev.filter(c => c !== city)
                : [...prev, city]
        );
    };

    const getCityIcon = (city: string) => {
        // Simple mapping or just random flags/icons
        return '🏙️';
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <aside className={clsx(
            "h-full glass border-r border-white/5 transition-all duration-500 overflow-hidden flex flex-col z-50 bg-[#0f172a]/80 backdrop-blur-xl absolute top-0 left-0",
            isOpen ? "w-full sm:w-[380px] opacity-100" : "w-0 opacity-0 pointer-events-none"
        )}>
            {/* Header / Search */}
            <div className="p-6 pb-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for homes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all text-white placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-4 pb-12 custom-scrollbar">
                {Object.keys(filteredGrouped).sort().map(city => (
                    <div key={city} className="mb-2">
                        <button
                            onClick={() => toggleCity(city)}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{getCityIcon(city)}</span>
                                <span className="font-bold text-slate-200 tracking-tight">{city}</span>
                                <span className="text-xs text-slate-500 font-normal">({filteredGrouped[city].length})</span>
                            </div>
                            <ChevronRight className={clsx(
                                "w-4 h-4 text-slate-500 transition-transform duration-300",
                                expandedCities.includes(city) && "rotate-90 text-blue-500"
                            )} />
                        </button>

                        <div className={clsx(
                            "grid transition-all duration-300 ease-in-out",
                            expandedCities.includes(city) ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                        )}>
                            <div className="overflow-hidden">
                                <div className="space-y-3 pl-2">
                                    {filteredGrouped[city].map(loc => (
                                        <div
                                            key={loc._id}
                                            onClick={() => setSelectedLocation(loc)}
                                            className={clsx(
                                                "group relative rounded-2xl p-3 transition-all duration-300 cursor-pointer overflow-hidden border",
                                                selectedLocation?._id === loc._id
                                                    ? "bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <img
                                                    src={loc.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                                                    className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-700"
                                                    alt={loc.property_name}
                                                />
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                                                            {loc.property_name}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                                            <MapPin size={10} /> {loc.city}, {loc.state}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                                                            {loc.category === "pg" ? `${loc.totalCapacity ? loc.totalCapacity : loc.bed} Beds` : `${loc.bed} BHK`}
                                                        </span>
                                                        <span className="text-sm font-bold text-green-400 flex items-center">
                                                            {formatPrice(loc.rate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover CTA */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-blue-600 p-1.5 rounded-full shadow-lg">
                                                    <ChevronRight className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </aside>
    );
};

export default LocationSidebar;
