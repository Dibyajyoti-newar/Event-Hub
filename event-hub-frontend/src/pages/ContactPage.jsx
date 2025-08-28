// src/pages/ContactPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Import your db instance

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
                threshold: 0.1,
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
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast.error("Please fill out all fields.");
            return;
        }
        setLoading(true);
        const toastId = toast.loading("Sending your message...");

        try {
            // Save the message to the 'messages' collection in Firestore
            await addDoc(collection(db, "messages"), {
                name: name,
                email: email,
                message: message,
                sentAt: serverTimestamp(), // Adds a server-side timestamp
            });

            toast.success("Thank you for your message! We'll get back to you soon.", { id: toastId });
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error("Error sending message: ", error);
            toast.error("Sorry, something went wrong. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-6 py-20">
        <AnimatedSection>
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">Get in Touch</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Have a question, a suggestion, or just want to say hello? We'd love to hear from you.
                </p>
            </div>
        </AnimatedSection>

        <div className="mt-16 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <div className="grid md:grid-cols-2 gap-16">
                {/* Left Side: Contact Info */}
                <AnimatedSection>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-800">Contact Information</h2>
                        <p className="mt-3 text-gray-600">
                            Fill up the form and our team will get back to you within 24 hours.
                        </p>
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <MailIcon />
                                <span className="text-gray-700">support@eventshub.com</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <LocationIcon />
                                <span className="text-gray-700">123 University Lane, College Town, India</span>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Right Side: Contact Form */}
                <AnimatedSection>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </AnimatedSection>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
