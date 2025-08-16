import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase.js';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const ProfilePage = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]); // New state for events created by the user
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;

            setLoading(true);
            try {
                // --- Fetch Registered Events ---
                const registrationsQuery = query(collection(db, 'registrations'), where("userId", "==", currentUser.uid));
                const registrationSnapshots = await getDocs(registrationsQuery);
                const eventIds = registrationSnapshots.docs.map(doc => doc.data().eventId);

                if (eventIds.length > 0) {
                    const eventPromises = eventIds.map(id => getDoc(doc(db, 'events', id)));
                    const eventDocs = await Promise.all(eventPromises);
                    const registeredEventsData = eventDocs
                        .filter(doc => doc.exists())
                        .map(doc => ({ id: doc.id, ...doc.data() }));
                    setRegisteredEvents(registeredEventsData);
                } else {
                    setRegisteredEvents([]);
                }

                // --- Fetch Created Events ---
                const createdEventsQuery = query(collection(db, 'events'), where("organizerId", "==", currentUser.uid));
                const createdEventsSnapshot = await getDocs(createdEventsQuery);
                const createdEventsData = createdEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCreatedEvents(createdEventsData);

            } catch (error) {
                console.error("Error fetching user data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    if (loading && !currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    // A small component for the list items to reduce repetition
    const EventListItem = ({ event }) => (
        <Link to={`/event/${event.id}`} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.college}</p>
                </div>
                <span className="text-gray-400 text-xl">&rarr;</span>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center pt-12 font-sans px-4 pb-12">
            {/* User Info Card */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 text-2xl font-bold">
                        {currentUser?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Your Profile
                        </h1>
                         <p className="text-sm text-gray-500 break-words">{currentUser?.email}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <p className="text-xs text-gray-400 uppercase font-semibold">User ID</p>
                    <p className="text-sm text-gray-600 font-mono break-all mt-1">{currentUser?.uid}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-3 mt-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                >
                    Logout
                </button>
            </div>

            {/* Registered Events Section */}
            <div className="w-full max-w-lg mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                    Your Registered Events
                </h2>
                {loading ? (
                    <p className="text-center text-gray-500">Loading your events...</p>
                ) : registeredEvents.length > 0 ? (
                    <div className="space-y-4">
                        {registeredEvents.map(event => <EventListItem key={event.id} event={event} />)}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md border">
                        <p>You haven't registered for any events yet.</p>
                        <Link to="/events" className="text-indigo-600 hover:underline mt-2 inline-block">Browse Events</Link>
                    </div>
                )}
            </div>

            {/* Created Events Section */}
            <div className="w-full max-w-lg mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.747-5.747h11.494" /></svg>
                    Events You've Created
                </h2>
                {loading ? (
                    <p className="text-center text-gray-500">Loading your created events...</p>
                ) : createdEvents.length > 0 ? (
                    <div className="space-y-4">
                        {createdEvents.map(event => <EventListItem key={event.id} event={event} />)}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md border">
                        <p>You haven't created any events.</p>
                        <Link to="/create-event" className="text-indigo-600 hover:underline mt-2 inline-block">Create One Now</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;