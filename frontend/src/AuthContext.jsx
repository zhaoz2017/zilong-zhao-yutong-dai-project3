import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [activeUsername, setActiveUsername] = useState(null);

    async function checkIfUserIsLoggedIn() {
        try {
            const response = await axios.get('/api/users/isLoggedIn');
            console.log(response.data.username);
            setActiveUsername(response.data.username);
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    }

    async function logOutUser() {
        try {
            await axios.post('/api/users/logOut');
            setActiveUsername(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    useEffect(() => {
        checkIfUserIsLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ activeUsername, logOutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
