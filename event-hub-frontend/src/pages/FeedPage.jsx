import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <-- Import useLocation
import { getAllEvents } from '../services/api';
import EventCard from '../components/EventCard.jsx';

function FeedPage() {
  const location = useLocation(); // <-- Get the location object
  const [allEvents, setAllEvents] = useState([]); // <-- Store all events from API
  const [filteredEvents, setFilteredEvents] = useState([]); // <-- Events to display

  // State for the search and filter controls on this page
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(location.state?.category || 'All');
  const [college, setCollege] = useState(location.state?.college || '');


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch all events once when the page loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setAllEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Filter events whenever the search terms change
  useEffect(() => {
    let events = [...allEvents];

    if (college) {
      events = events.filter(event => event.college.toLowerCase().includes(college.toLowerCase()));
    }
    if (category !== 'All') {
      events = events.filter(event => event.category === category);
    }
    if (searchTerm) {
      events = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort the final filtered list by likes
    setFilteredEvents(events.sort((a, b) => b.likes - a.likes));
  }, [allEvents, college, category, searchTerm]);


  if (loading) return <p className="text-center mt-8">Loading events...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="w-full max-w-2xl mx-auto mb-8 bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Event Feed</h1>
        <div className="flex flex-col md:flex-row gap-4">
            <input
                type="text"
                placeholder="Search by event title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="All">All Categories</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Fest">Fest</option>
                <option value="Competition">Competition</option>
            </select>
        </div>
         {college && <p className="text-center mt-4 text-gray-600">Showing results for: <strong>{college}</strong></p>}
      </div>
      <div className="flex flex-col items-center gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id || event.title} event={event} />
          ))
        ) : (
          <p className="text-center">No events found for your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default FeedPage;