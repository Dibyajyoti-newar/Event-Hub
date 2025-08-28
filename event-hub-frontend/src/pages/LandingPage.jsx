import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import EventCard from '../components/EventCard';
import EventCardSkeleton from '../components/EventCardSkeleton';

// Updated categories with images only
const eventCategories = [
    { name: 'Hackathon', img: '/hackathon.gif' },
    { name: 'Workshop', img: '/workshop.jpg' },
    { name: 'Fest', img: '/fest.jpg' },
    { name: 'Competition', img: '/competition.jpg' },
    { name: 'Lecture', img: '/lecture.jpg' },
    { name: 'Sports', img: '/sports.jpg' },
];

const topClients = [
    { name: 'IIT Bombay', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/320px-Indian_Institute_of_Technology_Bombay_Logo.svg.png' },
    { name: 'IIT Delhi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/320px-Indian_Institute_of_Technology_Delhi_Logo.svg.png' },
    { name: 'IIM Ahmedabad', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Indian_Institute_of_Management_Ahmedabad_Logo.svg/320px-Indian_Institute_of_Management_Ahmedabad_Logo.svg.png' },
    { name: 'BITS Pilani', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani-Logo.svg/320px-BITS_Pilani-Logo.svg.png' },
    { name: 'University of Delhi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/22/University_of_Delhi.svg/320px-University_of_Delhi.svg.png' },
    { name: 'VIT Vellore', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/Vellore_Institute_of_Technology_logo.svg/320px-Vellore_Institute_of_Technology_logo.svg.png' },
];

const reviews = [
    { quote: "Events Hub revolutionized how we promote our fests. The reach we got was phenomenal, and the platform is incredibly easy to use.", author: "Priya Sharma", organization: "Fest Coordinator, IIT Bombay" },
    { quote: "Listing our workshop was a breeze. We were sold out in two days!", author: "Rajesh Kumar", organization: "E-Cell, IIM Ahmedabad" },
    { quote: "A fantastic platform for inter-college collaboration. We discovered so many amazing events.", author: "Anjali Singh", organization: "Student, University of Delhi" },
];

function LandingPage() {
    const [college, setCollege] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const location = useLocation();

    useEffect(() => {
        if (location.state?.fromSearch) return;
        setSearched(false);
        setCollege('');
    }, [location]);

    const animationStyle = `@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`;

    const handleCollegeSearch = async (e) => {
        e.preventDefault();
        if (!college.trim()) return;
        setSearchTitle(`Events at ${college.trim()}`);
        setLoading(true);
        setSearched(true);
        setSearchResults([]);
        try {
            const q = query(collection(db, 'events'), where("college", "==", college.trim()));
            const querySnapshot = await getDocs(q);
            setSearchResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error searching events: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySearch = async (categoryName) => {
        setSearchTitle(`${categoryName} Events`);
        setLoading(true);
        setSearched(true);
        setCollege('');
        setSearchResults([]);
        try {
            const q = query(collection(db, 'events'), where("category", "==", categoryName));
            const querySnapshot = await getDocs(q);
            setSearchResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error searching by category: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50">
            <style>{animationStyle}</style>

            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900">Find Your Vibe.</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Discover fests, workshops, and hackathons happening at colleges across India.</p>
                <form onSubmit={handleCollegeSearch} className="mt-8 w-full max-w-2xl bg-white p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4">
                    <input type="text" placeholder="Enter a college name" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 w-full md:w-auto" disabled={loading}>
                        {loading && searched ? 'Searching...' : 'Search Events'}
                    </button>
                </form>
            </div>

            {searched ? (
                <div className="py-10 bg-white min-h-screen" id="search-results">
                    <main className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{searchTitle}</h2>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <EventCardSkeleton />
                                <EventCardSkeleton />
                                <EventCardSkeleton />
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {searchResults.map(event => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No events found matching your criteria.</p>
                        )}
                    </main>
                </div>
            ) : (
                <>
                    <div className="px-6 md:px-12 lg:px-20"> {/* ✅ added padding here */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {eventCategories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategorySearch(cat.name)}
                                    className="relative rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform h-40"
                                >
                                    {/* Background image covers full card */}
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    {/* Overlay for text visibility */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{cat.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Rest of your "How It Works", Partners, and Reviews sections remain the same */}
                    <div className="py-20 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="text-center max-w-3xl mx-auto">
                                <h2 className="text-3xl font-bold text-gray-800">How It Works in 3 Easy Steps</h2>
                                <p className="mt-4 text-lg text-gray-600">Finding and joining events has never been simpler.</p>
                            </div>
                            <div className="mt-16 space-y-20">
                                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                    <div className="md:w-1/2"><img src="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Students collaborating" className="rounded-xl shadow-2xl w-full h-full object-cover" /></div>
                                    <div className="md:w-1/2"><span className="font-bold text-blue-600">STEP 1</span><h3 className="text-2xl font-bold mt-2">Find Your Perfect Event</h3><p className="mt-4 text-gray-600">Use our powerful search and category filters to discover events happening at colleges across the country.</p></div>
                                </div>
                                <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                                    <div className="md:w-1/2"><img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Viewing details" className="rounded-xl shadow-2xl w-full h-full object-cover" /></div>
                                    <div className="md:w-1/2"><span className="font-bold text-blue-600">STEP 2</span><h3 className="text-2xl font-bold mt-2">Explore the Details</h3><p className="mt-4 text-gray-600">Click on any event to see all the important information, including a full description, schedule, and location.</p></div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                    <div className="md:w-1/2"><img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Register" className="rounded-xl shadow-2xl w-full h-full object-cover" /></div>
                                    <div className="md:w-1/2"><span className="font-bold text-blue-600">STEP 3</span><h3 className="text-2xl font-bold mt-2">Register in a Click</h3><p className="mt-4 text-gray-600">Ready to go? Just click the "Register Now" button. Your spot is instantly secured.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-16 bg-gray-50">
                        <h2 className="text-center text-3xl font-bold text-gray-800 mb-4">Our Partners</h2>
                        <p className="text-center text-gray-500 mb-8">Trusted by the best institutions in India.</p>
                        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-[scroll_40s_linear_infinite]">
                                {topClients.map((client, index) => (
                                    <li key={index}><img src={client.logoUrl} alt={client.name} className="h-12 filter grayscale hover:grayscale-0 transition-all duration-300" /></li>
                                ))}
                            </ul>
                            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-[scroll_40s_linear_infinite]" aria-hidden="true">
                                {topClients.map((client, index) => (
                                    <li key={index}><img src={client.logoUrl} alt={client.name} className="h-12 filter grayscale hover:grayscale-0 transition-all duration-300" /></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="py-20 bg-white">
                        <div className="container mx-auto px-6">
                            <h2 className="text-center text-3xl font-bold text-gray-800 mb-4">What Organizers Say</h2>
                            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Hear from the people who use our platform to make their events a success.</p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {reviews.map((review, index) => (
                                    <div key={index} className="bg-white p-8 rounded-xl shadow-lg border">
                                        <p className="text-gray-600 mb-6">"{review.quote}"</p>
                                        <div className="font-bold text-gray-900">{review.author}</div>
                                        <div className="text-sm text-gray-500">{review.organization}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default LandingPage;
