import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function MobileStickyBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a small delay or strictly on mobile
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClick = () => {
        // Dispatch event to open modal
        window.dispatchEvent(new Event("open-inquiry-modal"));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden safe-area-bottom">
            <button
                onClick={handleClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                <MessageCircle size={20} />
                Need Help Finding PG?
            </button>
        </div>
    );
}
