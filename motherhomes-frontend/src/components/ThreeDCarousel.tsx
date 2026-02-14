
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import './ThreeDCarousel.css';


export interface Slide {
    roomPath: string;
    headline: React.ReactNode;
    subtext: string;
    features: {
        icon: string;
        text: string;
        // x, y in percentage (0-100) relative to the 3D room container (split-left)
        hotspot?: { x: number; y: number }
    }[];
    primaryButton?: { text: string; action: () => void };
    secondaryButton?: { text: string; action: () => void };
}

interface ThreeDCarouselProps {
    className?: string;
    slides?: Slide[];
}


// Default slides if none provided (Backward compatibility for Home)
const DEFAULT_SLIDES: Slide[] = [
    {
        roomPath: "/carousel_deployment/ThreeJS-Room01/index.html",
        headline: <>Everything You Need at one place</>,
        subtext: "Fully furnished, secure, and hassle-free rooms for students & professionals.",
        features: [
            { icon: "couch_lamp", text: "Premium Furnished Rooms" },
            { icon: "shield_check", text: "24/7 CCTV Security" },
            { icon: "wifi", text: "High-Speed WiFi" }
        ],
        primaryButton: {
            text: "🟢 Book Free Visit",
            action: () => window.dispatchEvent(new CustomEvent('open-inquiry-modal'))
        },
        secondaryButton: {
            text: "Browse Rooms",
            action: () => (window as any).navigationNavigate('/viewlisting?city=all')
        }
    },
    {
        roomPath: "/carousel_deployment/ThreeJS-Room05/index.html",
        headline: <>Comfort. Safety.<br />Zero Hassle.</>,
        subtext: "Move into a fully furnished, secure and peaceful space designed for you.",
        features: [
            { icon: "home", text: "Private & Shared Rooms" },
            { icon: "cleaning_services", text: "Professional Housekeeping" },
            { icon: "shower", text: "Smart Bathrooms & Fittings" }
        ],
        primaryButton: {
            text: "🟢 Book Free Visit",
            action: () => window.dispatchEvent(new CustomEvent('open-inquiry-modal'))
        },
        secondaryButton: {
            text: "Browse Rooms",
            action: () => (window as any).navigationNavigate('/viewlisting?city=all')
        }
    },
    {
        roomPath: "/carousel_deployment/ThreeJS-Room14/index.html",
        headline: <>Modern Living<br />Redefined</>,
        subtext: "Discover a space where luxury meets functionality, designed for the modern lifestyle.",
        features: [
            { icon: "couch_lamp", text: "Designer Furniture" },
            { icon: "shield_check", text: "Advanced Security" },
            { icon: "wifi", text: "High-Speed Connectivity" }
        ],
        primaryButton: {
            text: "🟢 Book Free Visit",
            action: () => window.dispatchEvent(new CustomEvent('open-inquiry-modal'))
        },
        secondaryButton: {
            text: "Browse Rooms",
            action: () => (window as any).navigationNavigate('/viewlisting?city=all')
        }
    }
];

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ className, slides }) => {
    const navigate = useNavigate();

    // Expose navigate for button actions defined outside
    useEffect(() => {
        (window as any).navigationNavigate = navigate;
    }, [navigate]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Refs for feature items to calculate start positions for arrows
    const roomContainerRef = useRef<HTMLDivElement>(null);
    const [arrowPaths, setArrowPaths] = useState<{ d: string, key: number }[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0]));
    const lastMessageTime = useRef<number>(0);

    const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
    const totalRooms = activeSlides.length;

    // Resource Virtualization: Track which iframes should be loaded
    useEffect(() => {
        setLoadedIndices(prev => {
            const next = new Set(prev);
            const indicesToLoad = [
                currentIndex,
                (currentIndex + 1) % totalRooms,
                (currentIndex - 1 + totalRooms) % totalRooms
            ];
            indicesToLoad.forEach(idx => next.add(idx));
            return next;
        });
    }, [currentIndex, totalRooms]);

    const updateCarousel = (index: number) => {
        if (!carouselRef.current) return;
        const offset = -index * 100;
        carouselRef.current.style.transform = `translateX(${offset}%)`;

        const frames = document.querySelectorAll('.room-frame');
        frames.forEach((frame, i) => {
            const contentWindow = (frame as HTMLIFrameElement).contentWindow;
            if (!contentWindow) return;

            if (i === index) {
                contentWindow.postMessage({ type: 'resume' }, window.location.origin);
            } else {
                contentWindow.postMessage({ type: 'pause' }, window.location.origin);
            }
        });
    };

    const nextRoom = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalRooms);
    };

    const prevRoom = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalRooms) % totalRooms);
    };

    const goToRoom = (index: number) => {
        setCurrentIndex(index);
        resetTimer();
    };

    const resetTimer = () => {
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
        }
        autoPlayTimerRef.current = setInterval(nextRoom, 10000);
    };

    const handleNext = () => {
        nextRoom();
        resetTimer();
    };

    const handlePrev = () => {
        prevRoom();
        resetTimer();
    };

    // Global mouse tracking with Throttling (capped at ~60fps)
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastMessageTime.current < 16) return; // ~60fps
            lastMessageTime.current = now;

            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;

            setMousePos({ x, y });

            const activeFrame = document.querySelector(`.room-wrapper.active .room-frame`) as HTMLIFrameElement;
            if (activeFrame && activeFrame.contentWindow) {
                activeFrame.contentWindow.postMessage({ type: 'mousemove', x, y }, window.location.origin);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [currentIndex]);

    // Recalculate arrow paths on slide change, resize, or mouse move (for parallax)
    useEffect(() => {
        const updateArrows = () => {
            if (!activeSlides[currentIndex]) return;

            const paths: { d: string, key: number }[] = [];

            const activeWrapper = document.querySelector(`.room-wrapper.active`);
            if (!activeWrapper) return;

            const splitLayout = activeWrapper.querySelector('.room-split-layout');
            const splitLeft = activeWrapper.querySelector('.split-left');

            if (!splitLayout || !splitLeft) return;

            const layoutRect = splitLayout.getBoundingClientRect();
            const leftRect = splitLeft.getBoundingClientRect();

            const parallaxX = mousePos.x * 20;
            const parallaxY = mousePos.y * 10;

            activeSlides[currentIndex].features.forEach((feature, idx) => {
                if (!feature.hotspot) return;

                const featureEl = activeWrapper.querySelector(`[data-feature-index="${idx}"]`);
                if (!featureEl) return;

                const featureRect = featureEl.getBoundingClientRect();

                const startX = featureRect.left - layoutRect.left;
                const startY = featureRect.top + featureRect.height / 2 - layoutRect.top;

                const endX = (leftRect.left - layoutRect.left) + (leftRect.width * (feature.hotspot.x / 100)) + parallaxX;
                const endY = (leftRect.top - layoutRect.top) + (leftRect.height * (feature.hotspot.y / 100)) + parallaxY;

                const cp1X = startX - 100;
                const cp1Y = startY;

                const cp2X = endX + 100;
                const cp2Y = endY;

                const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
                paths.push({ d, key: idx });
            });

            setArrowPaths(paths);
        };

        updateArrows();
        const timeout = setTimeout(updateArrows, 50);
        return () => clearTimeout(timeout);
    }, [currentIndex, mousePos, activeSlides]);


    // Effect for index change updates
    useEffect(() => {
        updateCarousel(currentIndex);
    }, [currentIndex]);

    // Effect for timer and keyboard
    useEffect(() => {
        resetTimer();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const getRoomParallaxStyle = () => {
        return {};
    };

    // Loading handling for iframes
    const [iframeLoaded, setIframeLoaded] = useState<Record<number, boolean>>({});
    const handleIframeLoad = (index: number) => {
        setIframeLoaded(prev => ({ ...prev, [index]: true }));
    };

    // Helpler to render icon (emoji or custom)
    const renderIcon = (iconName: string) => {
        const iconMap: Record<string, string> = {
            "couch_lamp": "🛋️",
            "shield_check": "🛡️",
            "wifi": "⚡",
            "home": "🏠",
            "cleaning_services": "🧼",
            "shower": "🚿",
            "restaurant": "🍽️",
            "security": "👮",
            "medical_services": "⚕️",
            "sports": "⚽",
            "diversity_3": "🤝",
            "local_laundry_service": "🧺"
        };

        return iconMap[iconName] || iconName;
    };

    return (
        <div className={clsx("main-carousel-wrapper", className)}>
            <div className="carousel-container" ref={carouselRef}>
                {activeSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={clsx("room-wrapper", currentIndex === index ? "active" : "inactive")}
                        style={getRoomParallaxStyle()}
                    >
                        <div className="room-split-layout relative">
                            {/* SVG Overlay for Arrows */}
                            {currentIndex === index && (
                                <svg className="arrow-overlay absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                        </marker>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    {arrowPaths.map(path => (
                                        <path
                                            key={path.key}
                                            d={path.d}
                                            fill="none"
                                            stroke="#94a3b8"
                                            strokeWidth="2"
                                            markerEnd="url(#arrowhead)"
                                            className="arrow-path"
                                            filter="url(#glow)"
                                        />
                                    ))}
                                </svg>
                            )}

                            <div className="split-left" ref={roomContainerRef}>
                                {/* Loading Placeholder */}
                                {!iframeLoaded[index] && loadedIndices.has(index) && (
                                    <div className="room-loading-overlay">
                                        <div className="loading-spinner"></div>
                                        <span>Preparing 3D Room...</span>
                                    </div>
                                )}

                                {loadedIndices.has(index) ? (
                                    <iframe
                                        className={clsx("room-frame", iframeLoaded[index] ? "loaded" : "loading")}
                                        src={slide.roomPath}
                                        title={`Room ${index + 1}`}
                                        onLoad={() => handleIframeLoad(index)}
                                    />
                                ) : (
                                    <div className="room-placeholder"></div>
                                )}

                                <div className="drag-hint">
                                    <span className="icon">🔄</span>
                                    <span>Drag to Rotate</span>
                                </div>
                            </div>
                            <div className="split-right">
                                <div className="content-container">
                                    <h2 className="headline">{slide.headline}</h2>
                                    <p className="subtext">{slide.subtext}</p>

                                    <div className="features-grid-vertical">
                                        {slide.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="feature-item-row"
                                                data-feature-index={idx} // Used for creating arrows
                                            >
                                                <span className="icon">{renderIcon(feature.icon)}</span>
                                                <span className="text">{feature.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="button-group-vertical">
                                        {slide.primaryButton && (
                                            <button
                                                className="cta-button-main"
                                                onClick={slide.primaryButton.action}
                                            >
                                                {slide.primaryButton.text}
                                            </button>
                                        )}
                                        {slide.secondaryButton && (
                                            <button
                                                className="cta-button-secondary"
                                                onClick={slide.secondaryButton.action}
                                            >
                                                {slide.secondaryButton.text}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="nav-btn prev-btn" onClick={handlePrev}>
                <span className="arrow-icon">&#8249;</span>
            </div>
            <div className="nav-btn next-btn" onClick={handleNext}>
                <span className="arrow-icon">&#8250;</span>
            </div>

            {/* Indicators */}
            <div className="dots-container">
                {activeSlides.map((_, i) => (
                    <div
                        key={i}
                        className={`dot ${i === currentIndex ? 'active' : ''}`}
                        onClick={() => goToRoom(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThreeDCarousel;
