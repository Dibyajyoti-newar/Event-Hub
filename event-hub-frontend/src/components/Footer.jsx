import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <p>&copy; 2025 Events Hub. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
            <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
            <Link to="/about" className="text-gray-400 hover:text-white">About</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;