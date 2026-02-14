
import React, { useEffect, useRef, useState } from 'react';
import './ThreeDCarousel.css';

const ThreeDCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const totalRooms = 3;
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Consistent root-relative paths
    const roomPaths = [
        "/carousel_deployment/ThreeJS-Room01/index.html",
        "/carousel_deployment/ThreeJS-Room14/index.html", // Fixed: removed dist/
        "/carousel_deployment/ThreeJS-Room05/index.html"
    ];

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

    // Global mouse tracking for 3D parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
            const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
            setMousePos({ x, y });

            // Send to active iframe for internal model parallax
            const activeFrame = document.querySelector(`.room-wrapper:nth-child(${currentIndex + 1}) .room-frame`) as HTMLIFrameElement;
            if (activeFrame && activeFrame.contentWindow) {
                activeFrame.contentWindow.postMessage({ type: 'mousemove', x, y }, window.location.origin);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [currentIndex]);

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

    // Calculate parallax styles for the ROOM WRAPPER (Low Intensity)
    const getRoomParallaxStyle = (index: number) => {
        if (index !== currentIndex) return {};
        return {
            transform: `perspective(1000px) rotateY(${mousePos.x * 3}deg) rotateX(${-mousePos.y * 3}deg)`,
            transition: 'transform 0.2s ease-out'
        };
    };

    // Calculate parallax styles for the CONTENT CARD (Higher Intensity)
    const getCardParallaxStyle = (index: number) => {
        if (index !== currentIndex) return {};
        return {
            transform: `perspective(1000px) translateZ(50px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`,
            transition: 'transform 0.1s ease-out'
        };
    };

    return (
        <div className="main-carousel-wrapper">
            <div className="carousel-container" ref={carouselRef}>
                {/* Room 1 */}
                <div className="room-wrapper" style={getRoomParallaxStyle(0)}>
                    <iframe
                        className="room-frame"
                        src={roomPaths[0]}
                        title="Room 1"
                    />
                    <div className="overlay-container">
                        <div className="glass-card" style={getCardParallaxStyle(0)} key={`r1-${currentIndex}`}>
                            <div className="headline">Everything You Need. <br/>Nothing Extra to Buy.</div>
                            <div className="subtext">Fully furnished, secure, and hassle-free rooms for students & professionals.</div>
                            <ul className="feature-grid">
                                <li className="feature-item"><div className="feature-main">✔ Premium Furnished Rooms</div></li>
                                <li className="feature-item"><div className="feature-main">✔ High-Speed WiFi</div></li>
                                <li className="feature-item"><div className="feature-main">✔ 24/7 CCTV Security</div></li>
                                <li className="feature-item"><div className="feature-main">✔ Daily Cleaning</div></li>
                                <li className="feature-item"><div className="feature-main">✔ Power Backup</div></li>
                                <li className="feature-item"><div className="feature-main">✔ Student Friendly</div></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Room 2 (Room 14) */}
                <div className="room-wrapper" style={getRoomParallaxStyle(1)}>
                    <iframe
                        className="room-frame"
                        src={roomPaths[1]}
                        title="Room 2"
                    />
                    <div className="overlay-container">
                        <div className="glass-card" style={getCardParallaxStyle(1)} key={`r2-${currentIndex}`}>
                            <div className="headline">Everything You Need.<br />Move In Today.</div>
                            <div className="subtext">Fully furnished, secure, and productivity-ready rooms for students & professionals.</div>
                            <ul className="feature-grid">
                                <li className="feature-item">
                                    <div className="feature-main">✔ Study Setup</div>
                                    <div className="feature-sub">Ergonomic desk & lighting.</div>
                                </li>
                                <li className="feature-item">
                                    <div className="feature-main">✔ Fast WiFi</div>
                                    <div className="feature-sub">Seamless streaming & meetings.</div>
                                </li>
                                <li className="feature-item">
                                    <div className="feature-main">✔ 24/7 Security</div>
                                    <div className="feature-sub">Safe & monitored premises.</div>
                                </li>
                                <li className="feature-item">
                                    <div className="feature-main">✔ Daily Cleaning</div>
                                    <div className="feature-sub">Zero maintenance stress.</div>
                                </li>
                                <li className="feature-item">
                                    <div className="feature-main">✔ Power Backup</div>
                                    <div className="feature-sub">Uninterrupted electricity.</div>
                                </li>
                                <li className="feature-item">
                                    <div className="feature-main">✔ Meals Available</div>
                                    <div className="feature-sub">Healthy food options.</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Room 3 (Room 05) */}
                <div className="room-wrapper" style={getRoomParallaxStyle(2)}>
                    <div className="room3-layout">
                        <div className="split-left">
                            <iframe
                                className="room-frame"
                                src={roomPaths[2]}
                                title="Room 3"
                            />
                            <div className="gradient-overlay">
                                <div className="room-label">Peaceful Private Room</div>
                            </div>
                        </div>
                        <div className="split-right">
                            <div className="glass-card-transparent" style={getCardParallaxStyle(2)} key={`r3-${currentIndex}`}>
                                <div className="headline">Comfort. Safety.<br/>Zero Hassle.</div>
                                <div className="subtext">Move into a fully furnished, secure and peaceful space designed for you.</div>

                                <ul className="feature-list-vertical">
                                    <li className="feature-item" style={{marginBottom: '1rem'}}>
                                        <div className="feature-main">✔ Premium Bedroom</div>
                                        <div className="feature-sub">Comfortable bed & aesthetic interiors.</div>
                                    </li>
                                    <li className="feature-item" style={{marginBottom: '1rem'}}>
                                        <div className="feature-main">✔ CCTV Security</div>
                                        <div className="feature-sub">Safe monitored premises.</div>
                                    </li>
                                    <li className="feature-item" style={{marginBottom: '1rem'}}>
                                        <div className="feature-main">✔ Daily Cleaning</div>
                                        <div className="feature-sub">Fresh and hygienic environment.</div>
                                    </li>
                                    <li className="feature-item">
                                        <div className="feature-main">✔ High-Speed WiFi</div>
                                        <div className="feature-sub">Stay connected 24/7.</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
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
                {[...Array(totalRooms)].map((_, i) => (
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
