import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast'; 

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [title, setTitle] = useState('');
    const [college, setCollege] = useState('');
    const [category, setCategory] = useState('Hackathon');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    
    const eventCategories = ['Hackathon', 'Workshop', 'Fest', 'Competition', 'Lecture', 'Sports'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("You must be logged in to create an event.");
            return;
        }

        if (!title || !college || !date || !description) {
            toast.error("Please fill out all fields.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Creating your event...'); // Show a loading toast

        try {
            const newEvent = {
                title,
                college,
                category,
                description,
                date: Timestamp.fromDate(new Date(date)),
                organizerId: currentUser.uid,
                likes: 0,
                likedBy: [],
            };

            const docRef = await addDoc(collection(db, "events"), newEvent);
            
            toast.success('Event created successfully!', { id: toastId }); // Update the toast on success
            
            navigate(`/event/${docRef.id}`);
        } catch (err) {
            console.error("Error creating event: ", err);
            toast.error("Failed to create event. Please try again.", { id: toastId }); // Update on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 font-sans px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Create a New Event</h1>
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
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;