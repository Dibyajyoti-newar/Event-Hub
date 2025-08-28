// src/pages/AboutPage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Helper component for animated sections
const AnimatedSection = ({ children }) => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className="transition-all duration-700 ease-out opacity-0 translate-y-10">
            {children}
        </div>
    );
};

// SVG Icon Components
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const TicketIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
);

const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


function AboutPage() {
    const featuresForAttendees = [
        { icon: <SearchIcon />, title: 'Powerful Search', description: 'Instantly find events by searching for a specific college or browsing through categories like Hackathons, Workshops, and Fests.' },
        { icon: <HeartIcon />, title: 'Like & Discover', description: 'See what\'s popular! Our "All Events" feed is sorted by likes, helping you discover the most anticipated events in real-time.' },
        { icon: <TicketIcon />, title: 'One-Click Registration', description: 'Register for any event with a single click. All your registered events are neatly organized on your profile page.' }
    ];

    const featuresForOrganizers = [
        { icon: <PlusCircleIcon />, title: 'Create Events Easily', description: 'Have an event to share? Our simple form allows you to post your event and reach thousands of students in minutes.' },
        { icon: <ChartBarIcon />, title: 'Organizer Dashboard', description: 'Manage all your events from one place. Track likes and see how many people have registered for each event you\'ve created.' },
        { icon: <UsersIcon />, title: 'View Your Attendees', description: 'Need to know who\'s coming? Your dashboard includes a feature to view a complete list of attendees for each of your events.' }
    ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-6 py-20 text-center">
            <AnimatedSection>
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">Our Mission</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    To be the central hub for all college events across the nation. We believe that every student should have easy access to opportunities that enrich their college experience, from hackathons and workshops to fests and competitions.
                </p>
            </AnimatedSection>
        </div>
      </div>

      {/* Features for Attendees Section */}
      <div className="py-20">
          <div className="container mx-auto px-6">
              <AnimatedSection>
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800">For Every Student</h2>
                    <p className="mt-4 text-lg text-gray-600">Discovering your next big opportunity has never been easier.</p>
                </div>
              </AnimatedSection>
              <div className="mt-16 grid md:grid-cols-3 gap-12">
                  {featuresForAttendees.map(feature => (
                      <AnimatedSection key={feature.title}>
                        <div className="text-center flex flex-col items-center">
                            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mt-6 text-gray-800">{feature.title}</h3>
                            <p className="mt-2 text-gray-600">{feature.description}</p>
                        </div>
                      </AnimatedSection>
                  ))}
              </div>
          </div>
      </div>
      
      {/* Features for Organizers Section */}
      <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
              <AnimatedSection>
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800">For Event Organizers</h2>
                    <p className="mt-4 text-lg text-gray-600">We give you the tools to make your event a massive success.</p>
                </div>
              </AnimatedSection>
              <div className="mt-16 grid md:grid-cols-3 gap-12">
                  {featuresForOrganizers.map(feature => (
                      <AnimatedSection key={feature.title}>
                        <div className="text-center flex flex-col items-center">
                             <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mt-6 text-gray-800">{feature.title}</h3>
                            <p className="mt-2 text-gray-600">{feature.description}</p>
                        </div>
                      </AnimatedSection>
                  ))}
              </div>
          </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 text-center">
            <AnimatedSection>
                <h2 className="text-4xl font-bold text-gray-800">Ready to Get Started?</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Whether you're looking for an event or creating one, your journey starts here.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/events" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                        Browse Events
                    </Link>
                    <Link to="/create-event" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg shadow-md border border-indigo-600 hover:bg-indigo-50 transition-colors">
                        Create an Event
                    </Link>
                </div>
            </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
