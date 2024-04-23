import React, { useState,useEffect } from 'react';

import './PWM.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { AuthProvider, useAuth} from './AuthContext';
import SharePassword from './SharePassword';
import ShareRequests from './ShareRequests';
import SharedPasswords from './SharedPasswords';

axios.defaults.withCredentials = true;

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
    
    const { activeUsername,logOutUser } = useAuth();

  
    useEffect(() => {
        // Only call fetchPasswords if activeUsername is not null
        if (activeUsername) {
            console.log("Active username available:", activeUsername);
            fetchPasswords();
        } else {
            console.log("Active username not available yet.");
        }
    }, [activeUsername]);  // Include activeUsername in the dependency array
    const fetchPasswords = async () => {
        try {
            const response = await axios.get('/api/password');
            const userPasswords = response.data.filter(p => p.username === activeUsername);
            console.log("test avtiveusername" + activeUsername);
            console.log(userPasswords+"tetetetetett");
            setPasswords(userPasswords);  // Assuming the backend sends an array of passwords
        } catch (error) {
            console.error('Error retrieving passwords:', error);
            setError('Failed to fetch passwords.');
        }
    };


    const handleDelete = async (url) => {
        if (!window.confirm('Are you sure you want to delete this password?')) return;

        try {
            setLoading(true);
            const requestUrl = `/api/password?url=${encodeURIComponent(url)}`;
            console.log('Sending DELETE request to:', requestUrl);
            const response = await axios.delete(requestUrl);

           // const response = await axios.delete(`/api/password?url=${encodeURIComponent(url)}`);
            alert('Password deleted successfully');
            fetchPasswords();  // Refresh the list to remove the deleted item
        } catch (error) {
            console.error('Failed to delete password:', error);
            alert('Failed to delete password');
        } finally {
            setLoading(false);
        }
    };
    const handleUpdate = async (url) => {
        const newPassword = prompt("Please enter the new password for " + url);
        if (!newPassword) {
            alert('No new password entered. Update cancelled.');
            return;
        }
    
        try {
            setLoading(true);
            const response = await axios.put('/api/password', { url, newPassword });
            alert('Password updated successfully');
            fetchPasswords();  // Refresh the list to show the updated data
        } catch (error) {
            console.error('Failed to update password:', error);
            alert('Failed to update password');
        } finally {
            setLoading(false);
        }
    };

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
            console.log(1111);
            if (length < 4 || length > 50 || Object.values(criteria).every((v) => v === false)) {
                setError('Please provide valid password generation criteria.');
                return;
            }
            finalPassword = generatePassword();
        }
    
        // try {
        //     await axios.post('/api/password', { url, password: finalPassword });
        //     // Optionally fetch and update the list of passwords here if needed
        //     console.log('Password saved successfully.');
        // } catch (error) {
        //     console.error('Error saving the password:', error);
        //     setError('Failed to save the password.');
        // }

        setLoading(true);
        try {
            await axios.post('/api/password', { url, password: finalPassword });
            setSuccessMessage('Password saved successfully!');
            // If you're fetching passwords, do it here to refresh the list
           // setPasswords([...passwords, { url, password: finalPassword }]); // Simulating adding to list
            // Reset form fields and criteria
            fetchPasswords();
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
        {/* <AuthProvider>
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


           
            <SharePassword username={activeUsername} />

            
            <ShareRequests username={activeUsername} />

            <SharedPasswords username={activeUsername} />

            // Render method
            <div className="mt-4">
            <h3>Stored Passwords</h3>
            <div className="scrollable-list">
                <ul className="list-group">
                    {passwords.length > 0 ? (
                        passwords.map((item, index) => (
                            <li key={index} className="list-group-item">
                                URL: {item.url}, Password: {item.password}, DateLastUpdated: {item.date}
                                <button onClick={() => handleUpdate(item.url)}>Update</button>
                                <button onClick={() => handleDelete(item.url)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">No passwords stored.</li>
                    )}
                </ul>
            </div>

        </div>

        </div>
        </AuthProvider> */}

<AuthProvider>
<Navbar />
            {activeUsername ? (
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


                    {/* 依赖于 activeUsername 的组件 */}
                    <SharePassword username={activeUsername} />
                    <ShareRequests username={activeUsername} />
                    <div className="mt-4">
                        <h3>Stored Passwords</h3>
                        <div className="scrollable-list">
                        <ul className="list-group">
                            {passwords.length > 0 ? (
                                passwords.map((item, index) => (
                                    <li key={index} className="list-group-item">
                                        URL: {item.url}, Password: {item.password}, DateLastUpdated: {item.date}
                                        <button onClick={() => handleUpdate(item.url)}>Update</button>
                                        <button onClick={() => handleDelete(item.url)}>Delete</button>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item">No passwords stored.</li>
                            )}
                        </ul>
                    </div>
                    </div>
                    <SharedPasswords username={activeUsername} />
                </div>
            ) : (
                <div>Loading or user not logged in</div>  // 可以显示加载中或者未登录的提示
            )}
        </AuthProvider>
        </>
    )

}