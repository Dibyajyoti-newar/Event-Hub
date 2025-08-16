import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase'; // <-- Import auth
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "firebase/auth";

const LoginPage = () => {
    // 'login' or 'signup'
    const [authMode, setAuthMode] = useState('login'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (authMode === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate('/');
        } catch (err) {
            setError(getFriendlyErrorMessage(err.code));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // Makes Firebase errors more user-friendly
    const getFriendlyErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Invalid email or password. Please try again.';
            case 'auth/email-already-in-use':
                return 'This email address is already registered. Try logging in.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters long.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    };

    const toggleAuthMode = () => {
        setAuthMode(authMode === 'login' ? 'signup' : 'login');
        setError('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center font-sans">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 m-4">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    {authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    {authMode === 'login' ? 'Log in to access the Events Hub' : 'Sign up to discover amazing events'}
                </p>

                <form onSubmit={handleAuthAction}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-xs italic text-center mb-4">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 transition-colors duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (authMode === 'login' ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={toggleAuthMode} className="text-sm text-indigo-500 hover:text-indigo-700 hover:underline">
                        {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;