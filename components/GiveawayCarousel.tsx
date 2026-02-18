
import React, { useEffect, useRef } from 'react';
import { Giveaway } from '../types';

declare const Swiper: any;

interface GiveawayCarouselProps {
    giveaways: Giveaway[];
}

const GiveawayCarousel: React.FC<GiveawayCarouselProps> = ({ giveaways }) => {
    const swiperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (swiperRef.current && giveaways.length > 0) {
            new Swiper(swiperRef.current, {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 30,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  },
            });
        }
    }, [giveaways]);

    if (!giveaways || giveaways.length === 0) {
        return <div className="text-center text-gray-500">No active giveaways at the moment.</div>;
    }

    return (
        <div className="swiper-container relative" ref={swiperRef} style={{'--swiper-navigation-color': '#06b6d4', '--swiper-pagination-color': '#06b6d4'} as React.CSSProperties}>
            <div className="swiper-wrapper">
                {giveaways.map((giveaway) => (
                    <div key={giveaway.id} className="swiper-slide bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <a href={giveaway.open_giveaway_url} target="_blank" rel="noopener noreferrer">
                             <img src={giveaway.image} alt={giveaway.title} className="w-full h-48 object-cover" />
                             <div className="p-4">
                                <h3 className="text-xl font-bold mb-2 truncate">{giveaway.title}</h3>
                                <p className="text-gray-400 text-sm mb-2">Value: {giveaway.worth}</p>
                                <div className="text-xs text-gray-500">
                                    Ends: {new Date(giveaway.end_date).toLocaleDateString()}
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <div className="swiper-pagination"></div>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
        </div>
    );
};

export default GiveawayCarousel;
