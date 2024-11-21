import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import SkeletonLoader from './components/SkeletonLoader'; // Import the SkeletonLoader
import NavBar from './components/NavBar';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const events = [
  {
      id: 1,
      title: 'Festival Chinatown',
      date: 'Feb 12',
      location: 'Pontianak, Indonesia',
      image: 'path/to/image1.jpg', // Replace with actual image paths
  },
  {
      id: 2,
      title: 'Event Title 2',
      date: 'Mar 15',
      location: 'Location 2',
      image: 'path/to/image2.jpg',
  },
  {
      id: 3,
      title: 'Event Title 2',
      date: 'Mar 15',
      location: 'Location 2',
      image: 'path/to/image2.jpg',
  },
  {
      id: 4,
      title: 'Event Title 2',
      date: 'Mar 15',
      location: 'Location 2',
      image: 'path/to/image2.jpg',
  },
  // Add more events as needed
];

const EventList = () => {
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

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
            <ul className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                        <img
                            src={event.thumbnail}
                            alt={event.title}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 ml-4">
                            <h2 className="text-lg font-semibold">{event.title}</h2>
                            <p className="text-sm text-gray-500">{event.description}</p>
                            <p className="text-xs text-gray-400">{event.created_at}</p>
                        </div>
                        <div className="ml-auto flex flex-col items-end">
                          <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                              AR View
                          </button>
                        </div>
                    </div>
                ))}
            </ul>
            <div className="absolute left-0 right-0 bottom-0 w-full bg-white rounded-t-[40px] shadow-black shadow-2xl">
              <NavBar />
            </div>
        </div>
    );
};

export default EventList;
