import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import Navbar from "./Navbar";
import { AuthProvider } from './AuthContext';

export default function Login() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const [error, setErrorValue] = useState('');
    const navigate = useNavigate();

    function setUsername(event) {
        const username = event.target.value;
        setUsernameInput(username);
    }

    function setPassword(event) {
        const pswd = event.target.value;
        setPasswordInput(pswd);
    }

    async function submit() {
        setErrorValue('');
        try {
            const response = await axios.post('/api/users/login', {username: usernameInput, password: passwordInput})
            navigate('/');
        } catch (e) {
            console.log(error);
            setErrorValue(e.response.data);
        }

    }

    return (
        <>
        <AuthProvider>
            <Navbar />
            <div className="container py-5">
                <h1 className="mb-3">Please sign in</h1>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <div className="form-signin w-100 m-auto">
                    <div className="form-floating mb-3">
                        <input 
                            type='text' 
                            className="form-control" 
                            id="floatingInput" 
                            placeholder="Username" 
                            value={usernameInput} 
                            onChange={setUsername}
                        />
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type='password' 
                            className="form-control" 
                            id="floatingPassword" 
                            placeholder="Password" 
                            value={passwordInput} 
                            onChange={setPassword}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div class="row">
                        <div class="col">
                            <button className="btn btn-primary" onClick={submit}>Sign in</button>
                        </div>
                        <div class="col">
                            <NavLink to="/register" className="nav-link">Don't have an account?</NavLink>
                        </div>
                    </div>     
                </div>
            </div>
        </AuthProvider>
        </>
    )
}