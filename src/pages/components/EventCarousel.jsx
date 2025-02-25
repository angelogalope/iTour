import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// const events = [
//   {
//       id: 1,
//       title: 'Festival Chinatown',
//       event_date: 'Feb 12',
//       location: 'Pontianak, Indonesia',
//       image: 'path/to/image1.jpg', // Replace with actual image paths
//   },
//   {
//       id: 2,
//       title: 'Event Title 2',
//       event_date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   {
//       id: 3,
//       title: 'Event Title 2',
//       event_date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   {
//       id: 4,
//       title: 'Event Title 2',
//       event_date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   // Add more events as needed
// ];

const EventCarousel = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                // .select('*')
                .select('title, thumbnail, location, event_date, id');

            if (error) {
                console.error('Error fetching events:', error);
                setError(error.message);
                return;
            } 

            if (!data || data.length === 0) {
                console.warn('No events found or data is empty.');
                return;
            }

            const formattedData = data.map(event => ({
                ...event,
                event_date: new Date(event.event_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }));

            setEvents(formattedData);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const settings = {
      dots: true,
      infinite: events.length > 1,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: events.length > 1,
      autoplaySpeed: 3000,
      beforeChange: (current, next) => setCurrentSlide(next),
      appendDots: dots => {
        const totalSlides = events.length; // Total number of slides
        const visibleDots = 4; // Change this to 3 if needed
        let adjustedCurrentSlide = currentSlide;
  
        // Adjust the current slide for dot positioning
        if (currentSlide >= totalSlides - 1) {
          adjustedCurrentSlide = totalSlides - 2; // Move to second-to-last dot
        }
  
        const startIndex = Math.max(0, adjustedCurrentSlide - Math.floor(visibleDots / 2));
        const endIndex = Math.min(totalSlides, startIndex + visibleDots);
        const limitedDots = dots.slice(startIndex, endIndex);
  
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul style={{ margin: '0px' }}>{limitedDots}</ul>
          </div>
        );
      },
    };

    if (loading || error) {
        return (
            <div className="w-full">
                <Slider {...settings}>
                    {[...Array(3)].map((_, index) => (
                      <div className='px-6 '>
                        <div key={index} className="relative p-4 border border-gray-200 bg-white rounded-lg shadow-lg">
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
                {events.length > 0 ? (
                    events.map(event => (
                      <div className='px-6 '>
                        <div key={event.id} className="relative p-4 border border-gray-200 bg-white rounded-lg shadow-lg">
                            <img src={event.thumbnail} alt={event.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                <p className="flex items-center gap-2 text-sm text-gray-500"><FaMapMarkerAlt className="text-blue-600" /> {event.location}</p>
                                <p className="flex items-center gap-2 text-sm text-gray-500"><FaCalendarAlt className="text-red-600"/>{event.event_date}</p>
                            </div>
                        </div>
                      </div>
                    ))
                ) : (
                    <div className='px-6'>
                        <div className="relative p-4 border border-gray-200 bg-white rounded-lg shadow-lg">
                            <SkeletonLoader />
                        </div>
                    </div>
                )}
            </Slider>
        </div>
    );
};

export default EventCarousel;
