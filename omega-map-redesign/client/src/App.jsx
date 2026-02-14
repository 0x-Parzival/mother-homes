import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { Menu, Layers, ChevronLeft, ChevronRight, Globe, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const App = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mapStyle, setMapStyle] = useState('satellite');

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const resp = await axios.get('http://localhost:5001/api/locations');
            setLocations(resp.data);
        } catch (err) {
            console.error('Failed to fetch locations', err);
        }
    };

    const handleNext = () => {
        if (!locations.length) return;
        const currentIndex = selectedLocation ? locations.findIndex(l => l.id === selectedLocation.id) : -1;
        const nextIndex = (currentIndex + 1) % locations.length;
        setSelectedLocation(locations[nextIndex]);
    };

    const handlePrev = () => {
        if (!locations.length) return;
        const currentIndex = selectedLocation ? locations.findIndex(l => l.id === selectedLocation.id) : -1;
        const prevIndex = (currentIndex - 1 + locations.length) % locations.length;
        setSelectedLocation(locations[prevIndex]);
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0f1d] overflow-hidden selection:bg-primary/30">
            {/* Header Bar */}
            <header className="fixed top-0 left-0 right-0 z-[100] h-16 glass flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                        <Globe className="text-primary w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">
                            Omega365 <span className="text-primary italic">Advantage</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest hidden sm:block">Holiday House World Map</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-300 active:scale-95"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="relative flex-1 pt-16 flex overflow-hidden">
                <Sidebar
                    locations={locations}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    isOpen={sidebarOpen}
                />

                <main className="flex-1 relative h-full transition-all duration-500 overflow-hidden">
                    <Map
                        locations={locations}
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        style={mapStyle}
                    />

                    {/* Map Controls */}
                    <div className="absolute top-6 right-6 flex flex-col gap-3 z-50">
                        <button
                            onClick={() => setMapStyle(mapStyle === 'satellite' ? 'streets' : 'satellite')}
                            className="glass p-3 rounded-2xl hover:bg-white/10 transition-all border border-white/10 shadow-2xl group active:scale-95"
                            title="Toggle Style"
                        >
                            <Layers className={cn(
                                "w-5 h-5 transition-colors",
                                mapStyle === 'satellite' ? "text-primary" : "text-slate-300"
                            )} />
                        </button>
                    </div>

                    {/* Floating Details HUD */}
                    {selectedLocation && (
                        <div className="absolute top-6 left-6 z-[40] glass p-5 rounded-[2rem] max-w-[340px] animate-in fade-in slide-in-from-left-8 duration-700 shadow-2xl border-white/10 hidden md:block">
                            <div className="relative h-44 mb-4 overflow-hidden rounded-2xl shadow-xl">
                                <img src={selectedLocation.image} className="w-full h-full object-cover" alt="" />
                                <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-white shadow-lg border border-white/10">
                                    {selectedLocation.country}
                                </div>
                            </div>
                            <h2 className="text-xl font-black text-white mb-2 leading-tight tracking-tight">{selectedLocation.name}</h2>
                            <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                Premium Destination
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-3 font-medium">{selectedLocation.description}</p>
                            <div className="flex gap-2">
                                <a
                                    href={selectedLocation.link}
                                    target="_blank"
                                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-2xl text-xs font-black hover:bg-primary-dark transition-all active:scale-95 shadow-[0_8px_20px_rgba(14,165,233,0.3)]"
                                >
                                    Explore House
                                </a>
                                <button className="p-3.5 glass rounded-2xl text-slate-300 hover:text-white transition-colors border-white/10">
                                    <Info className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Navigation HUD */}
                    {locations.length > 0 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 glass rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[360px] max-w-[90%] border-white/10 transition-all duration-1000">
                            <button
                                onClick={handlePrev}
                                className="w-14 h-14 flex items-center justify-center hover:bg-white/10 rounded-full transition-all text-slate-300 active:scale-90"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>

                            <div className="flex-1 px-6 text-center">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 opacity-80">
                                    {selectedLocation ? `${locations.findIndex(l => l.id === selectedLocation.id) + 1} of ${locations.length}` : `Quick Nav`}
                                </p>
                                <h3 className="text-sm font-black text-white truncate max-w-[220px] mx-auto uppercase tracking-normal">
                                    {selectedLocation?.name || 'Browse Holiday Homes'}
                                </h3>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-14 h-14 flex items-center justify-center hover:bg-white/10 rounded-full transition-all text-slate-300 active:scale-90"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <div className="fixed bottom-4 right-8 text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] z-[100] group select-none pointer-events-none">
                Omega365 <span className="text-primary/40 group-hover:text-primary transition-colors">• Redesigned Exploration HUD</span>
            </div>
        </div>
    );
};

export default App;
