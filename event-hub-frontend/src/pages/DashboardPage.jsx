// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

// A Modal component to display the list of attendees
const AttendeesModal = ({ eventTitle, attendees, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Attendees for "{eventTitle}"</h2>
                {attendees.length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                        {attendees.map((email, index) => (
                            <li key={index} className="bg-gray-100 p-2 rounded-md text-gray-700">{email}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No one has registered for this event yet.</p>
                )}
                <button 
                    onClick={onClose} 
                    className="mt-6 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for the attendees modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                const eventsQuery = query(collection(db, 'events'), where("organizerId", "==", currentUser.uid));
                const eventsSnapshot = await getDocs(eventsQuery);
                const userEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const eventsWithCounts = await Promise.all(
                    userEvents.map(async (event) => {
                        const registrationsColl = collection(db, 'registrations');
                        const registrationsQuery = query(registrationsColl, where("eventId", "==", event.id));
                        const snapshot = await getCountFromServer(registrationsQuery);
                        return {
                            ...event,
                            registrationCount: snapshot.data().count,
                        };
                    })
                );
                
                setEvents(eventsWithCounts);
            } catch (error) {
                console.error("Error fetching dashboard data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser, navigate]);

    // Function to fetch and display attendees for an event
    const handleViewAttendees = async (eventId, eventTitle) => {
        setSelectedEventTitle(eventTitle);
        try {
            const registrationsRef = collection(db, 'registrations');
            const q = query(registrationsRef, where("eventId", "==", eventId));
            const querySnapshot = await getDocs(q);
            
            // This now safely filters out any registrations that don't have a userEmail
            const attendeeEmails = querySnapshot.docs
                .map(doc => doc.data().userEmail)
                .filter(email => email); // This removes any undefined or null emails

            setAttendees(attendeeEmails);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching attendees: ", error);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800">Organizer Dashboard</h1>
                <p className="text-lg text-gray-500 mt-2">Manage your events and view their performance.</p>
            </header>

            <main className="container mx-auto max-w-4xl">
                {events.length > 0 ? (
                    <div className="space-y-6">
                        {events.map(event => (
                            <div key={event.id} className="bg-white rounded-xl shadow-md p-6 border flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                                    <p className="text-gray-500">{event.college}</p>
                                </div>
                                <div className="flex items-center gap-6 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-indigo-600">{event.likes}</p>
                                        <p className="text-sm text-gray-500">Likes</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{event.registrationCount}</p>
                                        <p className="text-sm text-gray-500">Registrations</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/event/${event.id}`} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                                        View
                                    </Link>
                                    <button 
                                        onClick={() => handleViewAttendees(event.id, event.title)}
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        View Attendees
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-white p-10 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-700">No events found</h2>
                        <p className="mt-2">You haven't created any events yet. Get started by creating one!</p>
                        <Link to="/create-event" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                            Create Your First Event
                        </Link>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <AttendeesModal 
                    eventTitle={selectedEventTitle} 
                    attendees={attendees} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default DashboardPage;
