import React from "react";
import { ArrowRight, ShieldCheck, Zap, Banknote, Star, Users, MapPin, CheckCircle2 } from "lucide-react";


const Feature: React.FC = () => {

  const handleCTAClick = () => {
    // Open inquiry modal via custom event
    window.dispatchEvent(new CustomEvent("open-inquiry-modal"));
  };

  const guarantees = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-blue-500" />,
      title: "100% Verified & Safe",
      description: "Every property is inspected before listing. No fake ads.",
      proof: "Every property is physically checked by our team.",
      id: "verified"
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      title: "Move In Within 48 Hours",
      description: "Quick booking. Fast assistance. Zero delays.",
      proof: "Most tenants shift within 2 days.",
      id: "move-in"
    },
    {
      icon: <Banknote className="w-12 h-12 text-green-500" />,
      title: "No Hidden Charges",
      description: "Transparent pricing. No brokerage surprise.",
      proof: "Clear rent breakdown before booking.",
      id: "no-brokerage"
    }
  ];

  const stats = [
    { label: "Average Rating", value: "4.8", icon: <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> },
    { label: "Tenants Shifted", value: "100+", icon: <Users className="w-5 h-5 text-blue-500" /> },
    { label: "Active Cities", value: "7", icon: <MapPin className="w-5 h-5 text-red-500" /> }
  ];

  return (
    <div className="bg-white py-16 md:py-24 font-[montserrat]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Heading - Proof Based */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Why <span className="text-yellow-400">100+ Tenants</span> Chose MotherHomes This Year
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Properties Only</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> No Brokerage Fees</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Quick Visit Scheduling</span>
          </div>
          <p className="text-lg text-gray-600 font-medium italic">
            “Unlike local brokers, we don’t charge commission.”
          </p>
        </div>

        {/* Outcome-Based Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {guarantees.map((item) => (
            <div
              key={item.id}
              className="relative p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-yellow-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="mb-6 flex justify-center md:justify-start">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 text-center md:text-left">
                {item.title}
              </h3>
              <p className="text-gray-700 font-bold mb-4 text-center md:text-left leading-relaxed">
                {item.description}
              </p>
              <div className="bg-white/50 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 border border-gray-100 text-center md:text-left">
                “{item.proof}”
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Block - Quantified Trust */}
        <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-14 text-white mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Star className="w-32 h-32 rotate-12" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="flex justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 text-yellow-400">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action-Driving CTA */}
        <div className="text-center">
          <button
            onClick={handleCTAClick}
            className="group relative inline-flex items-center gap-3 bg-yellow-400 text-gray-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-yellow-500 transition-all shadow-2xl hover:shadow-yellow-400/20 active:scale-95"
          >
            <span className="animate-pulse">🟢 Book a Free Visit Now</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-gray-400 font-bold text-sm uppercase tracking-tighter">
            Zero Booking Charges • Top Rated Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feature;
