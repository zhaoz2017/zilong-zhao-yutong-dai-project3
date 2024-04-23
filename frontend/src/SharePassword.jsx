import React, { useState,useEffect } from 'react';

export default  function SharePassword({ username }) {
    const [shareUsername, setShareUsername] = useState('');
    const [passwordId, setPasswordId] = useState('');
    const [error, setError] = useState('');

    const handleSubmitShare = async (e) => {
        e.preventDefault();
        if (shareUsername === username) {
            setError("Cannot share with yourself.");
            return;
        }
        try {
            const response = await axios.post('/api/passwords/share', {
                toUsername: shareUsername,
                passwordId
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
                placeholder="Enter username to share with"
                value={shareUsername}
                onChange={(e) => setShareUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Password ID"
                value={passwordId}
                onChange={(e) => setPasswordId(e.target.value)}
            />
            <button type="submit">Submit</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
}
