// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    const isOrganizer = currentUser && event && event.organizerId === currentUser.uid;

    useEffect(() => {
        const fetchEventAndRegistrationStatus = async () => {
            if (!eventId) return;
            setLoading(true);
            try {
                const eventDocRef = doc(db, 'events', eventId);
                const eventDocSnap = await getDoc(eventDocRef);

                if (eventDocSnap.exists()) {
                    setEvent({ id: eventDocSnap.id, ...eventDocSnap.data() });
                } else {
                    setEvent(null);
                    setLoading(false);
                    return;
                }

                if (currentUser) {
                    const registrationsRef = collection(db, 'registrations');
                    const q = query(registrationsRef, where("userId", "==", currentUser.uid), where("eventId", "==", eventId));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        setIsRegistered(true);
                        setRegistrationId(querySnapshot.docs[0].id);
                    } else {
                        setIsRegistered(false);
                        setRegistrationId(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndRegistrationStatus();
    }, [eventId, currentUser]);

    const handleRegistration = async () => {
        if (!currentUser) {
            toast.error("Please log in to register for events.");
            navigate('/login');
            return;
        }

        setIsRegistering(true);
        const toastId = toast.loading('Processing...');

        try {
            if (isRegistered && registrationId) {
                const registrationDocRef = doc(db, 'registrations', registrationId);
                await deleteDoc(registrationDocRef);
                setIsRegistered(false);
                setRegistrationId(null);
                toast.success('Registration cancelled successfully!', { id: toastId });
            } else {
                
                const newRegistration = await addDoc(collection(db, 'registrations'), {
                    userId: currentUser.uid,
                    userEmail: currentUser.email, // Save the user's email
                    eventId: eventId,
                    registrationDate: new Date()
                });
                setIsRegistered(true);
                setRegistrationId(newRegistration.id);
                toast.success('You have successfully registered!', { id: toastId });
            }
        } catch (error) {
            console.error("Error handling registration:", error);
            toast.error('An error occurred. Please try again.', { id: toastId });
        } finally {
            setIsRegistering(false);
        }
    };

    const handleDelete = async () => {
        if (!isOrganizer) return;

        toast((t) => (
            <span className="flex flex-col items-center gap-4">
                Are you sure you want to delete this event?
                <div className="flex gap-2">
                    <button 
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const deleteToast = toast.loading("Deleting event...");
                            try {
                                await deleteDoc(doc(db, 'events', eventId));
                                toast.success("Event deleted successfully.", { id: deleteToast });
                                navigate('/');
                            } catch (error) {
                                console.error("Error deleting event: ", error);
                                toast.error("Failed to delete event.", { id: deleteToast });
                            }
                        }}
                    >
                        Delete
                    </button>
                    <button 
                        className="bg-gray-200 px-3 py-1 rounded-md text-sm"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </span>
        ), { duration: 6000 });
    };

    if (loading) return <div className="text-center py-20">Loading event details...</div>;
    if (!event) return <div className="text-center py-20">Sorry, the event could not be found.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4">
            <main className="container mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-extrabold text-gray-900">{event.title}</h1>
                <p className="mt-2 text-lg font-semibold text-indigo-600">{event.college}</p>
                <div className="mt-4 text-gray-600 flex items-center gap-4 flex-wrap">
                    <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold">{event.category}</span>
                    <span>|</span>
                    <span>
                        {event.date?.seconds 
                            ? new Date(event.date.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : 'Date not specified'}
                    </span>
                </div>
                <div className="mt-8 prose max-w-none text-gray-700">
                    <p>{event.description || "No description provided for this event."}</p>
                </div>
                <div className="mt-8 pt-6 border-t">
                     <button 
                        onClick={handleRegistration}
                        disabled={isRegistering}
                        className={`w-full font-bold py-3 px-6 rounded-lg shadow-md transition-colors text-white ${
                            isRegistered 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } disabled:opacity-50`}
                    >
                        {isRegistering ? 'Processing...' : (isRegistered ? 'Cancel Registration' : 'Register Now')}
                    </button>

                    {isOrganizer && (
                        <div className="mt-4 flex gap-4">
                            <Link to={`/event/${eventId}/edit`} className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Edit Event
                            </Link>
                            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                                Delete Event
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EventDetailPage;
