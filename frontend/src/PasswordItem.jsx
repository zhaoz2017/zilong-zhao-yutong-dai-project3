import React, { useState } from 'react';


const PasswordItem = ({ password, url, username }) => {
    const [visible, setVisible] = useState(false);
    
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
            alert('Password copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <li className="list-group-item">
            URL: {url}, 
            Password: {visible ? password : '••••••••'} (Shared by: {username})
            <button onClick={toggleVisibility}>{visible ? 'Hide' : 'Show'}</button>
            <button onClick={handleCopy}>Copy</button>
        </li>
    );
};
export default PasswordItem;
