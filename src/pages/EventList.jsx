import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import EventListSkeleton from './components/EventListSkeleton'; // Import the SkeletonLoader
import NavBar from './components/NavBar';
import { useNavigate } from 'react-router';
import { IoMdArrowRoundBack } from 'react-icons/io';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// const events = [
//   {
//       id: 1,
//       title: 'Festival Chinatown',
//       date: 'Feb 12',
//       location: 'Pontianak, Indonesia',
//       image: 'path/to/image1.jpg', // Replace with actual image paths
//   },
//   {
//       id: 2,
//       title: 'Event Title 2',
//       date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   {
//       id: 3,
//       title: 'Event Title 2',
//       date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   {
//       id: 4,
//       title: 'Event Title 2',
//       date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   {
//       id: 5,
//       title: 'Event Title 2',
//       date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   {
//       id: 6,
//       title: 'Event Title 2',
//       date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   {
//       id: 7,
//       title: 'Event Title 2',
//       date: 'Mar 15',
//       location: 'Location 2',
//       image: 'path/to/image2.jpg',
//   },
//   // Add more events as needed
// ];

const EventList = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBack = () => {
        navigate(-1);
    };

    const handleVrBtn = () => {
        navigate('/vr-view');
    }

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*');
            if (error) {
                console.error('Error fetching events: ', error);
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
                    month:'long',
                    day:'numeric'
                })
            }));

            setEvents(formattedData);
        } catch (error) {
            console.error('Error fetching events: ', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // const [events, setEvents] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchEvents = async () => {
    //         setLoading(true);
    //         const { data, error } = await supabase
    //             .from('events')
    //             .select('id, title, description, created_at, location, thumbnail');

    //         if (error) {
    //             console.error('Error fetching events:', error);
    //             setError(error.message);
    //         } else {
    //             setEvents(data);
    //         }
    //         setLoading(false);
    //     };

    //     fetchEvents();
    // }, []);

    // if (loading) {
    //     return (
    //         <div>
    //             <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
    //             <div className="flex flex-col gap-3">
    //                 {[...Array(3)].map((_, index) => (
    //                     <SkeletonLoader key={index} />
    //                 ))}
    //             </div>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return <div className="text-red-500 text-center">Error: {error}</div>;
    // }

    if (loading || error) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="p-6">
                    <button onClick={handleBack}>
                        <IoMdArrowRoundBack size={32} /> 
                    </button>
                    <h1 className="text-3xl text-center font-semibold mb-4">Upcoming Events</h1>
                    <div className="flex flex-col gap-3 h-[80vh] pb-20 overflow-y-auto no-scrollbar">
                        {[...Array(7)].map((_, index) => (
                            <div className=''>
                                <div key={index} className="relative gap-3 p-4 border border-gray-200 bg-white rounded-lg shadow-lg">
                                    <EventListSkeleton />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-grow"></div>
                <div className="fixed bottom-6 w-full flex justify-center">
                <div className="bg-white rounded-full shadow-black shadow-2xl w-full max-w-[90%]">
                    <NavBar />
                </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="p-6">
                <button onClick={handleBack}>
                    <IoMdArrowRoundBack size={32} /> 
                </button>
                <h1 className="text-3xl text-center font-semibold mb-4">Upcoming Events</h1>
                <div className="flex flex-col gap-3 h-[80vh] pb-20 overflow-y-auto no-scrollbar">
                    {events.map(event => (
                        <div key={event.id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                            <img
                                src={event.thumbnail}
                                alt={event.title}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1 ml-4">
                                {/* <h2 className="text-lg font-semibold">{event.title}</h2> */}
                                <h2 className='text-lg font-semibold'>
                                    {event.title.length > 8
                                        ? event.title.slice(0, 8) + "..."
                                        : event.title}
                                </h2>
                                <p className="text-sm text-gray-500">{event.description}</p>
                                <p className="text-xs text-gray-400">{event.event_date}</p>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                              <button onClick={handleVrBtn} className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                                  VR View
                              </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-grow"></div>
            <div className="fixed bottom-6 w-full flex justify-center">
              <div className="bg-white rounded-full shadow-black shadow-2xl w-full max-w-[90%]">
                <NavBar />
              </div>
            </div>
        </div>
    );
};

export default EventList;
