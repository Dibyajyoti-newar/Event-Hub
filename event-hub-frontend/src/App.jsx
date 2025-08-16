import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- Import the Toaster
import LandingPage from './pages/LandingPage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; 
import AllEventsPage from './pages/AllEventsPage.jsx';
import CreateEventPage from './pages/CreateEventPage.jsx';
import EditEventPage from './pages/EditEventPage.jsx';

function App() {
  const navigate = useNavigate();

  const handleSearch = (college) => {
    navigate('/feed', { state: { college: college } });
  };

  const handleSelectCategory = (category) => {
    navigate('/feed', { state: { category: category } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" reverseOrder={false} /> {/* <-- Add the Toaster component here */}
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage onSearch={handleSearch} onSelectCategory={handleSelectCategory} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<AllEventsPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/event/:eventId/edit" element={<EditEventPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;