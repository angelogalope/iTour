import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const EventCarousel = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('id, title, created_at, location, thumbnail');

            if (error) {
                console.error('Error fetching events:', error);
                setError(error.message);
            } else {
                setEvents(data);
            }
            setLoading(false);
        };

        fetchEvents();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        beforeChange: (current, next) => setCurrentSlide(next),
        appendDots: dots => {
            const totalSlides = events.length;
            const visibleDots = 4;
            const limitedDots = dots.slice(0, visibleDots);
            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ul style={{ margin: '0px' }}> {limitedDots} </ul>
                </div>
            );
        },
    };

    if (loading || error) {
        return (
            <div className="w-full">
                <Slider {...settings}>
                    {[...Array(3)].map((_, index) => (
                      <div className='px-6'>
                        <div key={index} className="relative p-4 bg-white rounded-lg shadow-lg overflow-hidden">
                            <SkeletonLoader />
                        </div>
                      </div>
                    ))}
                </Slider>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Slider {...settings}>
                {events.map(event => (
                  <div className='px-6'>
                    <div key={event.id} className="relative p-4 bg-white rounded-lg shadow-lg overflow-hidden">
                        <img src={event.thumbnail} alt={event.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <p className="text-sm text-gray-500">{event.created_at}</p>
                            <p className="text-sm text-gray-500">{event.location}</p>
                        </div>
                    </div>
                  </div>
                ))}
            </Slider>
        </div>
    );
};

export default EventCarousel;
