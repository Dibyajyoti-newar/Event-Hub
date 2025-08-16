
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EventPostCard = ({ event }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const isLiked = currentUser && event.likedBy.includes(currentUser.uid);

    const handleLike = async (e) => {
        e.preventDefault(); 
        
        if (!currentUser) {
            toast.error("Please log in to like events!");
            navigate('/login');
            return;
        }

        const eventRef = doc(db, 'events', event.id);

        try {
            if (isLiked) {
                await updateDoc(eventRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(currentUser.uid)
                });
            } else {
                await updateDoc(eventRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(currentUser.uid)
                });
            }
        } catch (error) {
            console.error("Error updating likes: ", error);
            toast.error("Couldn't update like. Please try again.");
        }
    };

    return (
        <Link to={`/event/${event.id}`} className="block bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <p className="text-sm font-semibold text-indigo-600">{event.college}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{event.title}</h3>
                <p className="text-gray-500 mt-1">Category: {event.category}</p>
                <p className="text-gray-600 mt-2">
                    Date: {event.date && event.date.seconds ? new Date(event.date.seconds * 1000).toLocaleDateString() : 'No date specified'}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-300 ${isLiked ? 'text-red-500' : ''} z-10 relative`}
                    >
                        <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>
                    <p className="text-gray-600 font-medium">
                        {event.likes} {event.likes === 1 ? 'like' : 'likes'}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default EventPostCard;