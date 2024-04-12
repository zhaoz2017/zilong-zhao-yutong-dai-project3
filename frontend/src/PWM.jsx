import React, { useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { AuthProvider } from './AuthContext';

const initialCriteria = {
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
};

export default function PWM() {

    const [url, setUrl] = useState('');
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(8);
    const [criteria, setCriteria] = useState(initialCriteria);
    const [passwords, setPasswords] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCriteriaChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.checked });
    };

    const generatePassword = () => {
        const chars = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()',
        };
        let charPool = '';
        Object.keys(criteria).forEach((key) => {
            if (criteria[key]) charPool += chars[key];
        });

        let generatedPassword = '';
        if (charPool.length > 0) {
            // Ensure each selected criterion is represented at least once
            Object.keys(criteria).forEach((key) => {
                if (criteria[key]) generatedPassword += chars[key].charAt(Math.floor(Math.random() * chars[key].length));
            });

            // Fill the remaining length with random characters from the pool
            for (let i = generatedPassword.length; i < length; i++) {
                generatedPassword += charPool.charAt(Math.floor(Math.random() * charPool.length));
            }
        }

        return generatedPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (!url) {
            setError('Please enter a URL.');
            return;
        }
    
        let finalPassword = password;
        if (!finalPassword) {
            if (length < 4 || length > 50 || Object.values(criteria).every((v) => v === false)) {
                setError('Please provide valid password generation criteria.');
                return;
            }
            finalPassword = generatePassword();
        }
    
        try {
            await axios.post('/api/password', { url, password: finalPassword });
            // Optionally fetch and update the list of passwords here if needed
            console.log('Password saved successfully.');
        } catch (error) {
            console.error('Error saving the password:', error);
            setError('Failed to save the password.');
        }

        setLoading(true);
        try {
            await axios.post('/api/password', { url, password: finalPassword });
            setSuccessMessage('Password saved successfully!');
            // If you're fetching passwords, do it here to refresh the list
            setPasswords([...passwords, { url, password: finalPassword }]); // Simulating adding to list
            // Reset form fields and criteria
            setUrl('');
            setPassword('');
            setCriteria(initialCriteria);
            setLength(8);
        } catch (error) {
            console.error('Error saving the password:', error);
            setError('Failed to save the password.');
        }
        setLoading(false);
    };
    



    return (
        <>
        <AuthProvider>
        <Navbar />
        <div className="container">
            <h2>Manage Your Passwords</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className='alert alert-danger'>{error}</p>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="url" className="form-label">URL</label>
                    <input
                        type="text"
                        className="form-control"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password (optional)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="length" className="form-label">Length (4-50)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="length"
                        min="4"
                        max="50"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="uppercase" name="uppercase" checked={criteria.uppercase} onChange={handleCriteriaChange} />
                        <label className="form-check-label" htmlFor="uppercase">
                            Include Uppercase Letters
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="lowercase" name="lowercase" checked={criteria.lowercase} onChange={handleCriteriaChange} />
                        <label className="form-check-label" htmlFor="lowercase">
                            Include Lowercase Letters
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="numbers" name="numbers" checked={criteria.numbers} onChange={handleCriteriaChange} />
                        <label className="form-check-label" htmlFor="numbers">
                            Include Numbers
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="symbols" name="symbols" checked={criteria.symbols} onChange={handleCriteriaChange} />
                        <label className="form-check-label" htmlFor="symbols">
                            Include Symbols
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                    {loading ? 'Saving...' : 'Submit'}
                </button>
            </form>
            <div className="mt-4">
                <h3>Stored Passwords</h3>
                <ul className="list-group">
                    {passwords.map((item, index) => (
                        <li key={index} className="list-group-item">
                            URL: {item.url}, Password: {item.password}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </AuthProvider>
        </>
    )

}