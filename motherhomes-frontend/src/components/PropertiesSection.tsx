import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, TrendingUp, Zap, ArrowRight, Star, Clock } from "lucide-react";

interface City {
  name: string;
  properties: number;
  image: string;
  startingPrice: string;
  hooks: string[];
  scarcity?: string;
  scarcityColor?: string;
}

const PropertiesSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState(false);

  const cities: City[] = [
    {
      name: "Ghaziabad",
      startingPrice: "₹7,000",
      hooks: ["Near Metro", "Food Included"],
      scarcity: "🔥 2 rooms left under ₹9k",
      properties: 10,
      image: "https://i.ytimg.com/vi/-pTinhxMwdw/maxresdefault.jpg",
    },
    {
      name: "Noida",
      startingPrice: "₹8,500",
      hooks: ["Corporate Hub", "Student Friendly"],
      scarcity: "⚡ High demand this week",
      properties: 8,
      image: "https://i.ytimg.com/vi/ehMDI6S4WrM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAaz9tfcYpjXQwE9RV32KAEk7gzAw",
    },
    {
      name: "Delhi",
      startingPrice: "₹9,000",
      hooks: ["Central Location", "Verified PGs"],
      scarcity: "🔥 Only 3 spots left",
      properties: 6,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPeb8oowKAnqsuEaAOwn7MKWdmD_biR6KXA&s",
    },
    {
      name: "Greater Noida",
      startingPrice: "₹7,500",
      hooks: ["Knowledge Park", "AC Rooms"],
      properties: 5,
      image: "https://static.india.com/wp-content/uploads/2023/08/Greater-Noida-Freepik.jpg",
    },
    {
      name: "Gurugram",
      startingPrice: "₹11,000",
      hooks: ["Luxury Living", "Near Cyber City"],
      properties: 3,
      image: "https://i.ytimg.com/vi/JaQVOX3inNY/maxresdefault.jpg",
    },
    {
      name: "Dehradun",
      startingPrice: "₹6,500",
      hooks: ["Peaceful Environment", "WiFi Included"],
      properties: 5,
      image: "https://i.ytimg.com/vi/hE1hWY9ROI0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCwE1PtBwiv_QW4wjsuQWU37OtcbA",
    },
    {
      name: "Varanasi",
      startingPrice: "₹5,500",
      hooks: ["Clean & Safe", "Close to BHU"],
      properties: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg",
    }
  ];

  const handleCardClick = (cityName: string) => {
    setSelectedCity(cityName);
    setShowProperties(true);
    // Smooth scroll to properties section
    setTimeout(() => {
      document.getElementById('city-properties')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation) {
      navigate(`/viewlisting?city=${encodeURIComponent(searchLocation)}`);
    } else {
      navigate(`/viewlisting?city=all`);
    }
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-[montserrat]">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Choose Your City & <span className="text-yellow-400">Move In This Week</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Verified PGs & Flats Starting <span className="text-gray-900 font-bold underline decoration-yellow-400">₹7,000</span>
          </p>
        </div>

        {/* Search Bar - Strategic Upgrade */}
        <div className="max-w-4xl mx-auto mb-16 px-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-0 translate-y-2 shadow-2xl rounded-2xl overflow-hidden border border-gray-200"
          >
            <div className="flex-1 flex items-center bg-white px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100">
              <MapPin className="text-yellow-500 mr-3 w-5 h-5" />
              <input
                type="text"
                placeholder="Where are you looking?"
                className="w-full focus:outline-none text-gray-700 font-medium"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="flex-1 hidden md:flex items-center bg-white px-6 py-4 border-r border-gray-100">
              <TrendingUp className="text-green-500 mr-3 w-5 h-5" />
              <select className="w-full focus:outline-none text-gray-600 font-medium bg-transparent">
                <option>Budget: Any</option>
                <option>Under ₹8,000</option>
                <option>₹8,000 - ₹12,000</option>
                <option>Above ₹12,000</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-gray-900 hover:bg-black text-white px-8 py-4 font-bold text-lg flex items-center justify-center transition-colors duration-300 gap-2 shrink-0 group"
            >
              Find Rooms
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
            </button>
          </form>
        </div>

        {/* City Grid - Mobile Horizontal Scroll/Grid Mix */}
        <div className="relative overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 min-w-max sm:min-w-0">
            {cities.map((city, index) => (
              <div
                key={index}
                className="group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100 w-[280px] sm:w-auto"
                onClick={() => handleCardClick(city.name)}
              >
                {/* Card Image */}
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  {/* Scarcity Badge */}
                  {city.scarcity && (
                    <div className="absolute top-4 left-4 z-10 scale-90 sm:scale-100 origin-left">
                      <span className="bg-white/90 backdrop-blur-md text-red-600 px-3 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-lg flex items-center gap-1.5 animate-pulse">
                        {city.scarcity}
                      </span>
                    </div>
                  )}

                  {/* Hover CTA Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-y-4 group-hover:translate-y-0">
                    <span className="bg-yellow-400 text-black px-6 py-2.5 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl border-2 border-black/10">
                      🟢 Explore Rooms <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full text-left z-20 transition-transform duration-300 flex flex-col items-start h-auto">
                  <div className="flex justify-between items-end w-full mb-2">
                    <h3 className="text-white font-black text-xl sm:text-2xl drop-shadow-md leading-tight">
                      {city.name}
                    </h3>
                    <div className="text-yellow-400 font-black text-sm sm:text-base whitespace-nowrap">
                      {city.startingPrice} <span className="text-[10px] text-gray-400 block font-bold leading-none">Starting from</span>
                    </div>
                  </div>

                  {/* Key Hooks */}
                  <div className="flex flex-wrap gap-2 mt-1 sm:mt-2 opacity-90 group-hover:opacity-100 mb-1">
                    {city.hooks.map((hook, hIndex) => (
                      <span key={hIndex} className="text-[10px] sm:text-xs font-bold text-gray-200 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/5">
                        {hook}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Top Properties Section - Strategic Upgrade */}
        {showProperties && (
          <div id="city-properties" className="mt-16 pt-16 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  Top Rooms in <span className="text-yellow-400">{selectedCity}</span>
                </h2>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Highly rated spaces with best-in-class amenities
                </p>
              </div>
              <button
                onClick={() => navigate(`/viewlisting?city=${encodeURIComponent(selectedCity || 'all')}`)}
                className="text-gray-900 font-bold hover:text-yellow-500 flex items-center gap-2 transition-colors whitespace-nowrap group"
              >
                View all in {selectedCity} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group cursor-pointer hover:shadow-2xl transition-all">
                  <div className="relative h-48">
                    <img
                      src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Room"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black shadow-lg">
                      ₹{item === 1 ? '7,500' : item === 2 ? '8,200' : '9,000'}
                    </div>
                  </div>
                  <div className="p-6 text-left">
                    <h4 className="font-black text-lg text-gray-900 mb-1">Premium Room {selectedCity}</h4>
                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Sector {12 + item * 3}, {selectedCity}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Fast Booking
                      </span>
                      <button className="bg-gray-100 group-hover:bg-yellow-400 p-2 rounded-full transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] md:hidden transition-transform duration-500 animate-bounce group shadow-2xl">
        <button
          onClick={() => navigate('/viewlisting?city=all')}
          className="w-full bg-yellow-400 text-gray-900 font-black py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-2 border-4 border-white active:scale-95 transition-all text-lg"
        >
          Find Rooms in My City <Zap className="w-5 h-5 fill-gray-900" />
        </button>
      </div>
    </div>
  );
};

export default PropertiesSection;
