import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EditEventPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [title, setTitle] = useState('');
    const [college, setCollege] = useState('');
    const [category, setCategory] = useState('Hackathon');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // Keep for initial auth error

    const eventCategories = ['Hackathon', 'Workshop', 'Fest', 'Competition', 'Lecture', 'Sports'];

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'events', eventId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const eventData = docSnap.data();
                    if (currentUser && eventData.organizerId === currentUser.uid) {
                        setTitle(eventData.title);
                        setCollege(eventData.college);
                        setCategory(eventData.category);
                        setDescription(eventData.description);
                        if (eventData.date && eventData.date.seconds) {
                            const eventDate = new Date(eventData.date.seconds * 1000);
                            setDate(eventDate.toISOString().split('T')[0]);
                        }
                    } else {
                        setError("You are not authorized to edit this event.");
                        toast.error("You are not authorized to edit this event.");
                        setTimeout(() => navigate(`/event/${eventId}`), 2000);
                    }
                } else {
                    setError("Event not found.");
                }
            } catch (err) {
                console.error("Error fetching event:", err);
                setError("Failed to load event data.");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchEvent();
        } else {
            toast.error("Please log in to edit events.");
            navigate('/login');
        }
    }, [eventId, currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Saving changes...");

        try {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, {
                title,
                college,
                category,
                description,
                date: Timestamp.fromDate(new Date(date)),
            });
            toast.success('Event updated successfully!', { id: toastId });
            navigate(`/event/${eventId}`);
        } catch (err) {
            console.error("Error updating event: ", err);
            toast.error("Failed to update event. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <div className="text-center py-20">Loading event editor...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 font-sans px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                 {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                <>
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Your Event</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form inputs remain the same */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="college" className="block text-sm font-medium text-gray-700">College/Institution Name</label>
                            <input type="text" id="college" value={college} onChange={(e) => setCollege(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                    {eventCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </>
                )}
            </div>
        </div>
    );
};

export default EditEventPage;