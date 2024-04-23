import React, { useState,useEffect } from 'react';

export default function SharedPasswords() {
    const [sharedPasswords, setSharedPasswords] = useState([]);

    useEffect(() => {
        const fetchSharedPasswords = async () => {
            try {
                const { data } = await axios.get('/api/passwords/shared');
                setSharedPasswords(data);
            } catch (error) {
                console.error('Error fetching shared passwords:', error);
            }
        };

        fetchSharedPasswords();
    }, []);

    return (
        <div>
            <h3>Shared Passwords</h3>
            {sharedPasswords.map((password) => (
                <div key={password._id}>
                    <p>URL: {password.url}</p>
                    <p>Password: {password.password} (Shared by: {password.username})</p>
                </div>
            ))}
        </div>
    );
}
