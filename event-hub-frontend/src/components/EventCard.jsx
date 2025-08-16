import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link

function EventCard({ event }) {
  // Fallback to title if id is null or undefined for the key
  const eventId = event.id || event.title;

  return (
    <Link to={`/event/${eventId}`} className="block"> {/* <-- Wrap the card in a Link */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
        <div className="p-6">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-bold">{event.category}</div>
          <h3 className="block mt-1 text-xl leading-tight font-bold text-black">{event.title}</h3>
          <p className="mt-2 text-gray-600">{event.college}</p>
          <p className="mt-4 text-gray-500">{event.description}</p>
          <div className="mt-4 flex justify-between items-center">
              <span className="text-red-500 font-semibold">❤️ {event.likes} Likes</span>
              <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;