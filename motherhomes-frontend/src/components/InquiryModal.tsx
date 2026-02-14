import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import instance from "../utils/Axios/Axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const locationHook = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicHeadline, setDynamicHeadline] = useState("Get Verified PG Options in 10 Minutes");

  useEffect(() => {
    // Basic detection logic - can be expanded
    const params = new URLSearchParams(locationHook.search);
    const locParam = params.get("location");

    // Check if URL path contains known locations (e.g. /noida, /delhi)
    // or if a query param exists
    let detectedLocation = locParam || "";

    if (!detectedLocation) {
      // Simple check on pathname if it contains city names
      const path = locationHook.pathname.toLowerCase();
      if (path.includes("noida")) detectedLocation = "Noida";
      else if (path.includes("gurgaon")) detectedLocation = "Gurgaon";
      else if (path.includes("delhi")) detectedLocation = "Delhi";
      else if (path.includes("bangalore")) detectedLocation = "Bangalore";
      else if (path.includes("mumbai")) detectedLocation = "Mumbai";
    }

    if (detectedLocation) {
      setFormData(prev => ({ ...prev, location: detectedLocation }));
      setDynamicHeadline(`Looking for PG in ${detectedLocation}?`);
    } else {
      setDynamicHeadline("Get Verified PG Options in 10 Minutes");
    }
  }, [isOpen, locationHook]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await instance.post("/leads/inquiry", {
        contactInfo: {
          name: formData.name || "Anonymous", // Backend might require name
          phone: formData.phone,
          // email removed
        },
        location: formData.location,
        searchQuery: `Looking for PG/Flat in ${formData.location}`,
        source: "website_inquiry_modal",
      });

      toast.success("Request received! Our team will call you shortly.");
      localStorage.setItem("inquirySubmitted", "true");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 relative animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {dynamicHeadline}
          </h2>
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            No brokerage. No spam. Instant call support.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-base font-medium"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
              Preferred Location*
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-base font-medium"
              placeholder="e.g., Noida, Sector 62"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
              Name <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
              placeholder="Your Name"
            />
          </div>


          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Finding Best Options..." : "Find My PG"}
            </button>

            {/* Trust Micro-copy */}
            <div className="mt-4 flex items-center justify-between text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 px-1">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-blue-500" /> 100+ tenants shifted</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-blue-500" /> 4.8 rating</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-blue-500" /> Trusted in NCR</span>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
