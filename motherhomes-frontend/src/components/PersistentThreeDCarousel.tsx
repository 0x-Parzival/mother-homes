
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ThreeDCarousel from './ThreeDCarousel';
import { SERVICES_SLIDES } from '../pages/OtherPage/Services';

const PersistentThreeDCarousel: React.FC = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [slides, setSlides] = useState<any[] | undefined>(undefined);

    useEffect(() => {
        // Paths where the carousel should be visible
        const path = location.pathname;

        if (path === '/') {
            setIsVisible(true);
            setSlides(undefined); // Use default home slides
        } else if (path === '/services') {
            setIsVisible(true);
            setSlides(SERVICES_SLIDES);
        } else {
            setIsVisible(false);
        }
    }, [location]);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1, // Below Navbar (usually z-50) but above background
                display: isVisible ? 'block' : 'none'
            }}
        >
            <ThreeDCarousel slides={slides} />
        </div>
    );
};

export default PersistentThreeDCarousel;
