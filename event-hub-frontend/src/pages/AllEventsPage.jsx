import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';
import EventPostCard from '../components/EventPostCard.jsx';
import EventPostCardSkeleton from '../components/EventPostCardSkeleton.jsx'; // 👈 Import the skeleton

const AllEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const q = query(
            collection(db, 'events'),
            where("date", ">=", today)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() });
            });
            
            eventsData.sort((a, b) => b.likes - a.likes);

            setEvents(eventsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">All Upcoming Events</h1>
                
                <div className="max-w-2xl mx-auto">
                    {loading ? (
                        // Show three skeleton cards while loading
                        <>
                            <EventPostCardSkeleton />
                            <EventPostCardSkeleton />
                            <EventPostCardSkeleton />
                        </>
                    ) : events.length > 0 ? (
                        // Once loaded, show the actual event cards
                        events.map(event => (
                            <EventPostCard key={event.id} event={event} />
                        ))
                    ) : (
                        // If there are no events, show the message
                        <p className="text-center text-gray-500">No upcoming events found. Check back later!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllEventsPage;