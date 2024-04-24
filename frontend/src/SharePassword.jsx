import React, { useState,useEffect } from 'react';
import axios from 'axios';

export default function SharePassword({ username }) {
    const [shareUsername, setShareUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmitShare = async (e) => {
        e.preventDefault();
        console.log(111);
        console.log(shareUsername);
        console.log(username);
        if (shareUsername === username) {
            setError("Cannot share with yourself.");
            console.log(222);
            return;
        }
        try {
            const response = await axios.post('/api/password/share', {
                toUsername: shareUsername
            });
            alert('Share request sent!');
        } catch (error) {
            console.error('Error sharing password:', error);
            setError(error.response.data || 'Failed to share password.');
        }
    };

    return (
        <form onSubmit={handleSubmitShare}>
            <h3>Share Password</h3>
            <input
                type="text"
                placeholder="Enter username"
                value={shareUsername}
                onChange={(e) => setShareUsername(e.target.value)}
            />
            <button type="submit" class="btn btn-primary mt-3">Submit</button>
            {error && <div className="alert alert-danger mt-2">{error}</div>}

        </form>
    );
}
