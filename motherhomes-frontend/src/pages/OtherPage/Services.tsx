
import { useNavigate } from "react-router";
import { useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ThreeDCarousel from "../../components/ThreeDCarousel";

const SERVICES_SLIDES = [
  // 1. Accommodation Options
  {
    roomPath: "/carousel_deployment/ThreeJS-Room01/index.html",
    headline: "Accommodation Options",
    subtext: "Choose from a variety of room types tailored to your needs.",
    features: [
      { icon: "home", text: "Single occupancy rooms for privacy", hotspot: { x: 30, y: 60 } },
      { icon: "diversity_3", text: "Double sharing for affordability", hotspot: { x: 50, y: 60 } },
      { icon: "diversity_3", text: "Triple sharing for budget-conscious residents", hotspot: { x: 70, y: 60 } },
      { icon: "couch_lamp", text: "Well-furnished rooms with modern amenities", hotspot: { x: 40, y: 40 } }
    ]
  },
  // 2. Food Services
  {
    roomPath: "/carousel_deployment/ThreeJS-Room05/index.html",
    headline: "Food Services",
    subtext: "Enjoy delicious and nutritious meals prepared with care.",
    features: [
      { icon: "restaurant", text: "Balanced and nutritious meals", hotspot: { x: 50, y: 50 } },
      { icon: "restaurant", text: "Variety of cuisines and menu rotation", hotspot: { x: 30, y: 50 } },
      { icon: "medical_services", text: "Special dietary requirements accommodated", hotspot: { x: 70, y: 50 } },
      { icon: "restaurant", text: "Breakfast, lunch, dinner & evening snacks", hotspot: { x: 50, y: 60 } }
    ]
  },
  // 3. Security Services
  {
    roomPath: "/carousel_deployment/ThreeJS-Room14/dist/index.html",
    headline: "Security Services",
    subtext: "Your safety is our top priority with 24/7 surveillance.",
    features: [
      { icon: "security", text: "24/7 security personnel", hotspot: { x: 10, y: 50 } },
      { icon: "shield_check", text: "CCTV monitoring of common areas", hotspot: { x: 90, y: 20 } },
      { icon: "shield_check", text: "Secure access control systems", hotspot: { x: 20, y: 80 } },
      { icon: "security", text: "Trained security professionals", hotspot: { x: 50, y: 50 } }
    ]
  },
  // 4. Housekeeping
  {
    roomPath: "/carousel_deployment/ThreeJS-Room05/index.html",
    headline: "Housekeeping",
    subtext: "We keep your living space clean and hygienic.",
    features: [
      { icon: "cleaning_services", text: "Regular room cleaning", hotspot: { x: 40, y: 70 } },
      { icon: "local_laundry_service", text: "Linen change service", hotspot: { x: 60, y: 65 } },
      { icon: "cleaning_services", text: "Common area maintenance", hotspot: { x: 20, y: 80 } },
      { icon: "cleaning_services", text: "Waste management and hygiene", hotspot: { x: 80, y: 80 } }
    ]
  },
  // 5. Internet & Utilities
  {
    roomPath: "/carousel_deployment/ThreeJS-Room01/index.html",
    headline: "Internet & Utilities",
    subtext: "Stay connected and comfortable with all essential utilities.",
    features: [
      { icon: "wifi", text: "High-speed WiFi connectivity", hotspot: { x: 80, y: 30 } },
      { icon: "wifi", text: "Power backup for uninterrupted supply", hotspot: { x: 20, y: 30 } },
      { icon: "shower", text: "24/7 water supply with purification", hotspot: { x: 60, y: 40 } },
      { icon: "wifi", text: "Reliable electricity and utilities", hotspot: { x: 40, y: 20 } }
    ]
  },
  // 6. Community Activities
  {
    roomPath: "/carousel_deployment/ThreeJS-Room14/dist/index.html",
    headline: "Community Activities",
    subtext: "Engage with a vibrant community through regular events.",
    features: [
      { icon: "diversity_3", text: "Regular community events", hotspot: { x: 50, y: 50 } },
      { icon: "sports", text: "Recreational facilities", hotspot: { x: 30, y: 60 } },
      { icon: "diversity_3", text: "Common areas for socializing", hotspot: { x: 70, y: 60 } },
      { icon: "diversity_3", text: "Foster connections and friendships", hotspot: { x: 50, y: 70 } }
    ]
  }
];

function Services() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  return (
    <div className="font-sans text-gray-800 bg-white relative">
      {/* Navbar */}
      <Navbar />

      {/* Contact Modal Overlay */}
      {showContactModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md mx-4 relative border border-white/30">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Contact Us
              </h3>
              <p className="text-gray-600 mb-4">
                Feel free to reach out to us for any inquiries or support.
              </p>
              <p className="text-sm text-yellow-600 font-semibold mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                Please log in or schedule a visit for personalized assistance.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-center text-lg">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-slate-800 font-semibold">
                    +91-6202653172
                  </span>
                </div>

                <div className="flex items-center justify-center text-lg">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-slate-800">info@motherhomes.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Replaced with 3D Carousel */}
      <div className="relative pt-20 h-screen bg-gray-900">
        <ThreeDCarousel slides={SERVICES_SLIDES} />
      </div>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">500+</div>
              <div className="text-gray-600">Happy Residents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">15+</div>
              <div className="text-gray-600">Prime Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">24/7</div>
              <div className="text-gray-600">Support & Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Comprehensive PG Accommodation Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At Mother Homes, we offer a comprehensive range of services designed
            to make your stay comfortable, convenient, and enjoyable.
          </p>
        </div>
      </section>

      {/* Premium Amenities Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Premium Amenities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for a comfortable and convenient stay
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">High-Speed WiFi</h3>
              <p className="text-gray-600 text-sm">
                Stay connected with our high-speed internet access
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Air Conditioning</h3>
              <p className="text-gray-600 text-sm">
                Comfortable climate control in all rooms
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h6a2 2 0 002-2V7H7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Laundry</h3>
              <p className="text-gray-600 text-sm">
                Washing and ironing services available
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Security</h3>
              <p className="text-gray-600 text-sm">
                24/7 security with CCTV surveillance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience Our Services?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Find the perfect PG accommodation with all the services you need for
            a comfortable stay.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => navigate("/viewlisting")}
              className="px-10 py-4 bg-yellow-400 text-slate-900 font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Find a PG
            </button>
            <button
              onClick={handleContactClick}
              className="px-10 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Services;
