import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { activeUsername, logOutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await logOutUser();
        navigate('/login');  // 重定向到登录页面
    }
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand mb-0 h1">Keyper Home</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav ms-auto">
                        {!activeUsername ? (
                            <>
                                <NavLink to="/login" className="nav-link">Login</NavLink>
                                <NavLink to="/register" className="nav-link">Register</NavLink>
                            </>
                        ) : (
                            <>
                                <li className="nav-item dropstart">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="flase">
                                    {activeUsername}
                                    </a>
                                    <ul className="dropdown-menu gap-1 p-2 rounded-3 mx-0 shadow">
                                        <li><NavLink to="/pwm" className="dropdown-item rounded-2">Manage Passwords</NavLink></li>
                                        <li><hr className="dropdown-divider"></hr></li>
                                        <li><button onClick={handleLogOut} className="dropdown-item rounded-2">Log Out</button></li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
