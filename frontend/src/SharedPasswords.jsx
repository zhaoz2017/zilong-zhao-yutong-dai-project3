import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './SharedPasswords.css'

export default function SharedPasswords({ username }) {
    const [sharedPasswords, setSharedPasswords] = useState([]);

    // useEffect(() => {
    //     const fetchSharedPasswords = async () => {
    //         try {
    //             const { data } = await axios.get('/api/password');
    //             const filteredPasswords = data.filter(password => 
    //                 password.sharedWith.includes(username)
    //             );
    //             setSharedPasswords(filteredPasswords);
    //         } catch (error) {
    //             console.error('Error fetching shared passwords:', error);
    //         }
    //     };

    //     fetchSharedPasswords();
    // }, []);
    useEffect(() => {
        const fetchSharedPasswords = async () => {
            try {
                const { data } = await axios.get('/api/password');
                const filteredPasswords = data.filter(password => 
                    password.sharedWith.includes(username)
                );
                setSharedPasswords(filteredPasswords);
            } catch (error) {
                console.error('Error fetching shared passwords:', error);
            }
        };

        fetchSharedPasswords();
        const interval = setInterval(fetchSharedPasswords, 1000);  // Refresh every 5000 milliseconds (5 seconds)

        return () => clearInterval(interval);  // Clean up the interval on component unmount
    }, [username]);  // Depend on username to refetch if it changes
    return (
    <div>
        <h3>Shared Passwords</h3>
        {sharedPasswords.length > 0 ? (
            <div className="scrollable-list">
                <ul className="list-group">
                    {sharedPasswords.map((password, index) => (
                        <li key={index} className="list-group-item">
                            URL: {password.url}, 
                            Password: {password.password} (Shared by: {password.username})
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <p>No shared passwords.</p>  // Use a paragraph for consistency if the list is empty
        )}
    </div>
);

}
