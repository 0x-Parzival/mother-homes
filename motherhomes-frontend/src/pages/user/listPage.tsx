import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Globe from "../../components/map/Globe";
import LocationSidebar from "../../components/map/LocationSidebar";
import instance from "../../utils/Axios/Axios";
import { Menu } from "lucide-react";
import Navbar from "../../components/Navbar";

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

const ListPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cityParam = params.get("city");

  const [data, setData] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetching all properties for the map view to be effective
      // You might want to implement pagination or clustering for very large datasets
      const res = await instance.get<{ results: Property[] }>("/property", {
        params: { limit: 100 } // Increased limit for map view
      });

      setData(res.data.results || []);
    } catch (error) {
      console.error("Error fetching property data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter based on city param if present
  const displayedData = cityParam && cityParam !== "all"
    ? data.filter(p => p.city.toLowerCase() === cityParam.toLowerCase())
    : data;

  // Convert Property to MapItem for Globe
  const mapItems = displayedData
    .filter(item => item.latitude && item.longitude)
    .map(item => ({
      id: item._id,
      latitude: parseFloat(item.latitude),
      longitude: parseFloat(item.longitude),
      img: item.images?.[0] || "",
      title: item.property_name,
      bedroom: item.category === "pg" ? parseInt(item.totalCapacity) || 0 : item.bed,
      price: item.rate,
    }));

  const selectedMapItem = selectedProperty ? {
    id: selectedProperty._id,
    latitude: parseFloat(selectedProperty.latitude),
    longitude: parseFloat(selectedProperty.longitude),
    img: selectedProperty.images?.[0] || "",
    title: selectedProperty.property_name,
    bedroom: selectedProperty.category === "pg" ? parseInt(selectedProperty.totalCapacity) || 0 : selectedProperty.bed,
    price: selectedProperty.rate,
  } : null;

  return (
    <div className="flex h-screen w-full bg-[#050510] overflow-hidden relative">
      <Navbar />

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-24 left-4 z-[60] p-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div className="absolute top-0 left-0 h-full z-40 pointer-events-none pt-24">
        <div className="pointer-events-auto h-full">
          <LocationSidebar
            locations={displayedData}
            selectedLocation={selectedProperty}
            setSelectedLocation={setSelectedProperty}
            isOpen={isSidebarOpen}
          />
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 h-full w-full relative">
        {loading && (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510]/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-white/70 font-medium animate-pulse text-lg tracking-wider">Loading Discovery Engine...</p>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="absolute inset-0 z-[90] flex flex-col items-center justify-center bg-[#050510]">
            <div className="glass p-8 rounded-3xl border border-white/10 text-center max-w-md mx-auto">
              <div className="text-5xl mb-6 opacity-50">🔭</div>
              <h3 className="text-white text-xl font-bold mb-3">No Properties Found</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                We couldn't find any listings in this area. Try searching for "All Cities" or check back later.
              </p>
              <button
                onClick={() => window.location.href = '/viewlisting?city=all'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <Globe
          items={mapItems}
          selectedItem={selectedMapItem}
          onMarkerClick={(item) => {
            const prop = data.find(p => p._id === item.id);
            if (prop) setSelectedProperty(prop);
          }}
        />

        {/* Omega Branding / Overlay */}
        <div className="absolute top-24 right-4 z-40 pointer-events-none">
          <div className="glass px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
            <h1 className="text-white font-bold text-sm tracking-widest uppercase">
              MotherHomes <span className="text-blue-500">Explorer</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPage;