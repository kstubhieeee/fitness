import React, { useState, useEffect } from "react";
import { useauthstore } from "../../Store/useauthstore";
import { useNavigate } from "react-router-dom";
import "./trainerdashboard.css";

const Trainerdashboard = () => {
    const { authuser } = useauthstore();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchMembers();
    }, [navigate]);

    const fetchMembers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/trainer/members', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch members');
            const data = await response.json();
            setMembers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="trainer-dashboard">
            <div className="navbar">
                <div className="navbar-left">
                    <h2>Welcome, Trainer {authuser}</h2>
                </div>
                <div className="navbar-right">
                    <button 
                        className="logout-btn"
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-container">
                <div className="members-list">
                    <h2>Your Members</h2>
                    <div className="members-grid">
                        {members.map((member) => (
                            <div key={member._id} className="member-card">
                                <img 
                                    src={member.profilePic || "https://via.placeholder.com/150"} 
                                    alt={member.username} 
                                    className="member-image"
                                />
                                <div className="member-info">
                                    <h3>{member.username}</h3>
                                    <p>{member.email}</p>
                                    <div className="membership-status">
                                        <span>Membership: </span>
                                        <span className="status active">Active</span>
                                    </div>
                                </div>
                                <div className="member-actions">
                                    <button className="action-btn">View Progress</button>
                                    <button className="action-btn">Send Message</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="trainer-stats">
                    <h2>Dashboard Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Members</h3>
                            <p className="stat-number">{members.length}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Active Sessions</h3>
                            <p className="stat-number">12</p>
                        </div>
                        <div className="stat-card">
                            <h3>This Week's Sessions</h3>
                            <p className="stat-number">28</p>
                        </div>
                        <div className="stat-card">
                            <h3>Member Progress</h3>
                            <p className="stat-number">85%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trainerdashboard;