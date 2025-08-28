// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// SVG Icon for the user profile button
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

// SVG Icon for the site logo
const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


function Navbar() {
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Style for active NavLink on dark background
  const activeLinkStyle = {
    color: 'white',
    fontWeight: '600',
  };

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col gap-4" : "flex items-center gap-6"}>
      <NavLink to="/events" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-300 hover:text-white transition-colors">All Events</NavLink>
      <NavLink to="/about" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-300 hover:text-white transition-colors">About</NavLink>
      <NavLink to="/contact" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-300 hover:text-white transition-colors">Contact</NavLink>
      <NavLink to="/create-event" className="text-gray-300 hover:text-white transition-colors">Create Event</NavLink>
    </div>
  );

  return (
    <header className="bg-gradient-to-r from-gray-900 to-blue-900 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <LogoIcon />
          <span className="text-2xl font-bold text-white tracking-wider">Events Hub</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-gray-300 font-medium hover:text-white transition-colors">Dashboard</Link>
              <Link to="/profile" className="bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-all flex items-center shadow-md">
                <UserIcon />
                Profile
              </Link>
            </>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-full hover:bg-indigo-700 transition-all shadow-md">
              Login / Register
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/90 backdrop-blur-sm py-4 px-6 space-y-4">
            <NavLinks mobile={true} />
             {currentUser ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-700">
                    <Link to="/dashboard" className="text-gray-300 font-medium hover:text-white transition-colors">Dashboard</Link>
                    <Link to="/profile" className="bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-all flex items-center justify-center">
                        <UserIcon />
                        Profile
                    </Link>
                </div>
            ) : (
                <div className="pt-4 border-t border-gray-700">
                    <Link to="/login" className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-full hover:bg-indigo-700 transition-all text-center block">
                    Login / Register
                    </Link>
                </div>
            )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
