import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ locations, selectedLocation, setSelectedLocation, isOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCountries, setExpandedCountries] = useState(['Norway']);

    const grouped = locations.reduce((acc, loc) => {
        if (!acc[loc.country]) acc[loc.country] = [];
        acc[loc.country].push(loc);
        return acc;
    }, {});

    const filteredGrouped = Object.entries(grouped).reduce((acc, [country, locs]) => {
        const filtered = locs.filter(l =>
            l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length) acc[country] = filtered;
        return acc;
    }, {});

    const toggleCountry = (country) => {
        setExpandedCountries(prev =>
            prev.includes(country)
                ? prev.filter(c => c !== country)
                : [...prev, country]
        );
    };

    const getCountryIcon = (country) => {
        switch (country) {
            case 'Norway': return '🇳🇴';
            case 'Spain': return '🇪🇸';
            case 'USA': return '🇺🇸';
            case 'Canada': return '🇨🇦';
            case 'Denmark': return '🇩🇰';
            case 'Thailand': return '🇹🇭';
            default: return '🌍';
        }
    };

    return (
        <aside className={clsx(
            "h-full glass border-r border-white/5 transition-all duration-500 overflow-hidden flex flex-col z-50",
            isOpen ? "w-[380px] opacity-100" : "w-0 opacity-0 pointer-events-none"
        )}>
            <div className="p-6 pb-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search destinations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-slate-600 font-jakarta"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-12">
                {Object.keys(filteredGrouped).sort().map(country => (
                    <div key={country} className="mb-2">
                        <button
                            onClick={() => toggleCountry(country)}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{getCountryIcon(country)}</span>
                                <span className="font-bold text-slate-200 tracking-tight">{country}</span>
                            </div>
                            <ChevronRight className={clsx(
                                "w-4 h-4 text-slate-500 transition-transform duration-300",
                                expandedCountries.includes(country) && "rotate-90 text-primary"
                            )} />
                        </button>

                        <div className={clsx(
                            "grid transition-all duration-300 ease-in-out",
                            expandedCountries.includes(country) ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                        )}>
                            <div className="overflow-hidden">
                                <div className="space-y-3 pl-2">
                                    {filteredGrouped[country].map(loc => (
                                        <div
                                            key={loc.id}
                                            onClick={() => setSelectedLocation(loc)}
                                            className={clsx(
                                                "group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden border",
                                                selectedLocation?.id === loc.id
                                                    ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                            )}
                                        >
                                            <img
                                                src={loc.image}
                                                className="w-full h-32 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-700"
                                                alt=""
                                            />
                                            <h4 className="text-sm font-black text-white leading-tight mb-1 group-hover:text-primary transition-colors">
                                                {loc.name}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                                                {loc.description}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> View On Map
                                                </span>
                                                <a
                                                    href={loc.link}
                                                    target="_blank"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-white/10 p-2 rounded-lg hover:bg-primary transition-colors"
                                                >
                                                    <MapPin className="w-3 h-3 text-white" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
