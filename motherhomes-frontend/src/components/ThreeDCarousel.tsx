
import React, { useEffect, useRef, useState } from 'react';
import './ThreeDCarousel.css';

const ThreeDCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalRooms = 3;
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Paths to the iframes in public folder
    const roomPaths = [
        "/carousel_deployment/ThreeJS-Room01/index.html",
        "/carousel_deployment/ThreeJS-Room14/dist/index.html",
        "/carousel_deployment/ThreeJS-Room05/index.html"
    ];

    const updateCarousel = (index: number) => {
        if (!carouselRef.current) return;

        // Restore the "peek" shift effect from the original HTML
        const shift = 0; // The user said "only the first room is visible", maybe they want NO shift now? 
        // Actually, let's stick to 100% but ensure they don't shrink.
        // If I use shift=15 like the original, it shows part of the next room.
        const offset = -index * 100;
        carouselRef.current.style.transform = `translateX(${offset}%)`;

        const frames = document.querySelectorAll('.room-frame');
        frames.forEach((frame, i) => {
            const contentWindow = (frame as HTMLIFrameElement).contentWindow;
            if (!contentWindow) return;

            if (i === index) {
                contentWindow.postMessage({ type: 'resume' }, '*');
            } else {
                contentWindow.postMessage({ type: 'pause' }, '*');
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

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
            <div className="carousel-container" ref={carouselRef}>
                {/* Room 1 */}
                <div className="room-wrapper">
                    <iframe
                        className="room-frame"
                        src={roomPaths[0]}
                        title="Room 1"
                    />
                    <div className="overlay-container room1-layout">
                        <div className="room1-top">
                            <div className="headline">Everything You Need. Nothing Extra to Buy.</div>
                        </div>
                        <div className="room1-left">
                            <ul className="feature-list">
                                <li className="feature-item"><span className="check-icon">✔</span> Premium Furnished Rooms</li>
                                <li className="feature-item"><span className="check-icon">✔</span> High-Speed WiFi</li>
                                <li className="feature-item"><span className="check-icon">✔</span> 24/7 CCTV Security</li>
                                <li className="feature-item"><span className="check-icon">✔</span> Daily Cleaning</li>
                                <li className="feature-item"><span className="check-icon">✔</span> Power Backup</li>
                                <li className="feature-item"><span className="check-icon">✔</span> Student & Professional Friendly</li>
                            </ul>
                        </div>
                        <div className="room1-bottom">
                            <div className="subtext">Fully furnished, secure, and hassle-free rooms for students & professionals.</div>
                        </div>
                    </div>
                </div>

                {/* Room 2 (Room 14) */}
                <div className="room-wrapper">
                    <iframe
                        className="room-frame"
                        src={roomPaths[1]}
                        title="Room 2"
                    />
                    <div className="overlay-container room2-layout">
                        <div style={{ paddingLeft: '50px' }}>
                            <br /><br /><br />
                            <div className="headline">Everything You Need.<br />Move In Today.</div>
                            <div className="subtext">Fully furnished, secure, and productivity-ready rooms for students & professionals.</div>
                        </div>
                        <div style={{ paddingRight: '50px' }}>
                            <ul className="feature-list">
                                <li className="feature-item" style={{ display: 'block', marginBottom: '20px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>✔ Fully Furnished Study Setup</div>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '20px' }}>Ergonomic desk, storage cabinets & lighting included.</div>
                                </li>
                                <li className="feature-item" style={{ display: 'block', marginBottom: '20px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>✔ High-Speed WiFi</div>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '20px' }}>Seamless browsing, meetings & streaming.</div>
                                </li>
                                <li className="feature-item" style={{ display: 'block', marginBottom: '20px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>✔ 24/7 CCTV Security</div>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '20px' }}>Safe & monitored premises.</div>
                                </li>
                                <li className="feature-item" style={{ display: 'block', marginBottom: '20px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>✔ Daily Cleaning Service</div>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '20px' }}>Always fresh, zero maintenance stress.</div>
                                </li>
                                <li className="feature-item" style={{ display: 'block', marginBottom: '20px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>✔ Power Backup</div>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '20px' }}>Uninterrupted electricity.</div>
                                </li>
                                <li className="feature-item" style={{ display: 'block' }}>
                                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>✔ Nutritious Meals Available</div>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '20px' }}>Healthy food without cooking hassle</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Room 3 (Room 05) */}
                <div className="room-wrapper" style={{ background: '#000' }}>
                    <div className="room3-layout">
                        {/* Left: 3D Room */}
                        <div className="split-left">
                            <iframe
                                className="room-frame"
                                src={roomPaths[2]}
                                title="Room 3"
                            />
                            <div className="gradient-overlay">
                                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>Peaceful, Fully Furnished Private Room</div>
                            </div>
                        </div>
                        {/* Right: Text Content */}
                        <div className="split-right">
                            <div className="headline">Comfort. Safety. Zero Hassle.</div>
                            <div className="subtext">Move into a fully furnished, secure and peaceful space designed for students & working professionals.</div>

                            <ul className="feature-list" style={{ marginTop: '20px' }}>
                                <li className="feature-item" style={{ marginBottom: '15px' }}>
                                    <span className="check-icon">✔</span> <strong>Premium Furnished Bedroom</strong><br />
                                    <span style={{ fontSize: '0.9em', opacity: 0.7, marginLeft: '26px' }}>Comfortable bed, storage & aesthetic interiors included.</span>
                                </li>
                                <li className="feature-item" style={{ marginBottom: '15px' }}>
                                    <span className="check-icon">✔</span> <strong>24/7 CCTV Security</strong><br />
                                    <span style={{ fontSize: '0.9em', opacity: 0.7, marginLeft: '26px' }}>Safe & monitored premises for peace of mind.</span>
                                </li>
                                <li className="feature-item" style={{ marginBottom: '15px' }}>
                                    <span className="check-icon">✔</span> <strong>Daily Cleaning Service</strong><br />
                                    <span style={{ fontSize: '0.9em', opacity: 0.7, marginLeft: '26px' }}>Fresh and hygienic environment.</span>
                                </li>
                                <li className="feature-item" style={{ marginBottom: '15px' }}>
                                    <span className="check-icon">✔</span> <strong>Power Backup</strong><br />
                                    <span style={{ fontSize: '0.9em', opacity: 0.7, marginLeft: '26px' }}>Uninterrupted electricity day & night.</span>
                                </li>
                                <li className="feature-item" style={{ marginBottom: '15px' }}>
                                    <span className="check-icon">✔</span> <strong>High-Speed WiFi</strong><br />
                                    <span style={{ fontSize: '0.9em', opacity: 0.7, marginLeft: '26px' }}>Stay connected without interruptions.</span>
                                </li>
                                <li className="feature-item">
                                    <span className="check-icon">✔</span> <strong>24/7 Purified Water</strong><br />
                                    <span style={{ fontSize: '0.9em', opacity: 0.7, marginLeft: '26px' }}>Safe drinking water always available.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Arrow Controls */}
            <div className="nav-btn prev-btn" onClick={handlePrev}>&#8249;</div>
            <div className="nav-btn next-btn" onClick={handleNext}>&#8250;</div>

            {/* Indicators (Dots) */}
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
