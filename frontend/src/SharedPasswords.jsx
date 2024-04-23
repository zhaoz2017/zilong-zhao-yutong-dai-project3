import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './SharedPasswords.css'

export default function SharedPasswords({ username }) {
    const [sharedPasswords, setSharedPasswords] = useState([]);

    useEffect(() => {
        const fetchSharedPasswords = async () => {
            try {
                const { data } = await axios.get('/api/password');
                const filteredPasswords = data.filter(password => 
                    password.sharedWith.includes(username)
                );
                console.log(username +"shredpasss");
                console.log(filteredPasswords);
                setSharedPasswords(filteredPasswords);
            } catch (error) {
                console.error('Error fetching shared passwords:', error);
            }
        };

        fetchSharedPasswords();
    }, []);

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
