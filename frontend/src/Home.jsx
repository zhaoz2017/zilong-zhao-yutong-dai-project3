import Navbar from "./Navbar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function Home() {
    const { activeUsername } = useAuth();

    return (
        <>

        <div class="container-fluid">
            {activeUsername ? (
                <h1>Welcome, {activeUsername}!</h1>
            ) : (
                <h1>Welcome, guest!</h1>
            )}
            <h1>Keyper Introduction</h1>
            <div class="card need-blue-background need-white-color">
                <div class="card-body">
                    <h2 class="first-h2">🔐 Keyper is</h2>
                    <p>A services that can generate and manage passwords on your behalf.</p>
                    <h2>🔐 Why Keyper?</h2>
                    <p>As more and more companies experience hacks and cybersecurity becomes more important.</p>
                    <h2></h2>
                    <p></p>
                </div>
            </div>

            <h1>📝 Credits</h1>
                <div class="card need-blue-background need-white-color">
                <div class="card-body">
                    
                    <h2 class="first-h2">Developed by</h2>
                    <p>Yutong Dai</p>
                    <p>Zilong Zhao</p>

                    <h2>Github repo</h2>
                    <p></p>
                    
                </div>
            </div>
        </div>

        </>

    )
}