import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path if firebase.js is elsewhere

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the Provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        // This listener is the core of our authentication state management.
        // It fires whenever the user logs in or out.
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup the listener when the component unmounts
        return unsubscribe;
    }, []);

    // The value that will be available to all children components
    const value = {
        currentUser,
        logout,
    };

    // We don't render the app until the listener has checked for a user.
    // This prevents the "Login" button from flashing on screen for logged-in users.
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};