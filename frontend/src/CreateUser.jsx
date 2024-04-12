import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import Navbar from "./Navbar";
import { AuthProvider } from './AuthContext';

export default function CreateUser() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    function setUsername(event) {
        const username = event.target.value;
        setUsernameInput(username);
    }

    function setPassword(event) {
        const pswd = event.target.value;
        setPasswordInput(pswd);
    }

    function handleConfirmPassword(event) {
        const confirmPswd = event.target.value;
        setConfirmPassword(confirmPswd);
    }

    async function submit() {
        // Check if passwords match before attempting to register
        if (passwordInput !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        try {
            const response = await axios.post('/api/users/register', {username: usernameInput, password: passwordInput});
            navigate('/');
        } catch (error) {
            console.log(error);
            setError(error.response.data);
        }
    }

    return (
        <>
        <AuthProvider>
            <Navbar />
            <div className="container py-5">
                <h1 className="mb-3">Register New User</h1>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form className="w-100 m-auto">
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="usernameInput" 
                            placeholder="Username" 
                            value={usernameInput} 
                            onChange={setUsername}
                        />
                        <label htmlFor="usernameInput">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="passwordInput" 
                            placeholder="Master Password" 
                            value={passwordInput} 
                            onChange={setPassword}
                        />
                        <label htmlFor="passwordInput">Master Password</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="confirmPassword" 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={handleConfirmPassword}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>

                    <div class="row">
                        <div class="col">
                            <button type="button" className="btn btn-primary" onClick={submit}>Create Account</button>
                        </div>
                        <div class="col">
                            <NavLink to="/login" className="nav-link">Already have an account?</NavLink>
                        </div>
                    </div>       
                </form>
            </div>
        </AuthProvider>

    </>
    )


}