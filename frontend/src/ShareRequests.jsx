import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './ShareRequests.css'

export default  function ShareRequests({ username }) {
    const [requests, setRequests] = useState([]);

    const fetchShareRequests = async () => {
        try {
            const response = await axios.get('/api/share-requests');
            
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch share requests:', error);
        }
    };
    // useEffect(() => {
    //     console.log("重新刷新了");
    //     fetchShareRequests();
    // }, [username]);
    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('/api/share-requests')
                .then(response => {
                    setRequests(response.data);
                })
                .catch(error => console.error('Error fetching share requests:', error));
        }, 1000); 

        return () => clearInterval(interval);
    }, []);
    const handleAccept = async (requestId) => {
        try {
            await axios.post(`/api/share-requests/${requestId}/accept`);
            fetchShareRequests(); // Refresh the list
        } catch (error) {
            console.error('Failed to accept share request:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post(`/api/share-requests/${requestId}/reject`);
            fetchShareRequests(); // Refresh the list
        } catch (error) {
            console.error('Failed to reject share request:', error);
        }
    };

    return (
        <div>
            <h3>Incoming Share Requests</h3>
            {requests.filter(request => request.status === 'pending').map((request) => (
                <div key={request._id}>
                    <p>{request.fromUser} wants to share a password with you.</p>
                    <button onClick={() => handleAccept(request._id)}>Accept</button>
                    <button onClick={() => handleReject(request._id)}>Reject</button>
                </div>
            ))}
            {requests.filter(request => request.status === 'pending').length === 0 && <p>No pending share requests.</p>}
        </div>
    );
}
