import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Make sure this path is correct

function Navbar() {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-gray-800">
          Events Hub
        </Link>
        <div className="flex items-center gap-4">
           <Link to="/events" className="text-gray-600 hover:text-blue-600">All Events</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          
          {/* "Create Event" is now always visible */}
          <Link to="/create-event" className="text-gray-600 font-medium hover:text-blue-600">
            Create Event
          </Link>

          {/* --- Conditional Auth UI --- */}
          {currentUser ? (
            // If a user is logged in, show Profile button
            <Link to="/profile" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
              Profile
            </Link>
          ) : (
            // If no user is logged in, show the Login/Register button
            <Link to="/login" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
              Login / Register
            </Link>
          )}
          {/* --- End Conditional Auth UI --- */}

        </div>
      </nav>
    </header>
  );
}

export default Navbar;