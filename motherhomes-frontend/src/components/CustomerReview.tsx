import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Review {
  author: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  happyPeople: string;
}

const reviews: Review[] = [
  {
    author: "Niharika",
    role: "Designer",
    avatar: "https://i.pravatar.cc/80?img=5",
    text: "I was able to find a verified flat in Noida within hours. The platform is simple, secure, and truly reliable. Highly recommended for anyone looking to rent without the hassle.",
    rating: 4.88,
    happyPeople: "100+",
  },
  {
    author: "Rahul Sharma",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/80?img=12",
    text: "The 3D globe feature is a game changer! Being able to see the exact location and surroundings before visiting saved me so much time. A truly modern experience.",
    rating: 4.92,
    happyPeople: "250+",
  },
  {
    author: "Anjali Gupta",
    role: "Student",
    avatar: "https://i.pravatar.cc/80?img=9",
    text: "Safe, secure, and affordable. As a student moving to a new city, MotherHomes made the transition seamless. The no-brokerage promise is real!",
    rating: 4.85,
    happyPeople: "500+",
  },
  {
    author: "Vikram Singh",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/80?img=3",
    text: "Zero brokerage and verified listings. What you see is what you get. The support team was incredibly helpful throughout the process.",
    rating: 4.95,
    happyPeople: "1k+",
  },
];

const CustomerReview: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="bg-[#111111] text-white py-20 px-4 font-[montserrat]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 leading-snug font-[montserrat]">
            What Our <span className="text-yellow-400">Customers Say</span>
            <br />
            About Us
          </h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <p className="text-2xl font-bold">{currentReview.happyPeople}</p>
              <p className="text-gray-400 text-sm mt-1">
                Users Found Their Homes
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold flex items-center gap-2">
                {currentReview.rating}
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              </p>
              <p className="text-gray-400 text-sm mt-1">Overall rating</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative bg-transparent text-left transition-opacity duration-500 ease-in-out">
          {/* Quote icon */}
          <Quote className="absolute top-0 right-0 text-yellow-400 w-8 h-8 opacity-50" />

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentReview.avatar}
              alt={currentReview.author}
              className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/50"
            />
            <div>
              <h4 className="font-semibold text-lg">{currentReview.author}</h4>
              <p className="text-yellow-400 text-sm font-medium">{currentReview.role}</p>
            </div>
          </div>

          {/* Review Text */}
          <p className="text-gray-300 leading-relaxed mb-8 text-lg italic bg-white/5 p-6 rounded-2xl border border-white/10 min-h-[120px]">
            "{currentReview.text}"
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-4 items-center">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 hover:bg-white/5 transition-all active:scale-95"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-yellow-400 w-6' : 'bg-gray-700'}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 hover:bg-white/5 transition-all active:scale-95"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReview;
