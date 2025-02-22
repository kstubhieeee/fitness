import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./memberdashboard.css";
import { useauthstore } from "../../Store/useauthstore";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
    const [membership] = useState({
        remainingTime: "30 days",
        renewalDate: "2023-11-30",
    });
    const { authuser } = useauthstore();
    const navigate = useNavigate();
    const [trainer] = useState({
        name: "John Fitness",
        specialization: "Strength Training",
        experience: "8 years",
        email: "john@fitnessgym.com",
        phone: "+1 234 567 890",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn805Los39GYWKAKe-X0ViVASEhvOo8V3IUA&s"
    });

    const [member] = useState({
        username: "",
        profilePic: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    });

    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [selectedEventIndex, setSelectedEventIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchEvents();
    }, [navigate]);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/events', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data.map(event => ({
                ...event,
                date: new Date(event.date)
            })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = (selectedDate) => {
        setDate(selectedDate);
        setNewEvent("");
        setEditingIndex(null);
    };

    const handleAddEvent = async () => {
        if (newEvent.trim() === "") return;

        try {
            if (editingIndex !== null) {
                const event = events[editingIndex];
                const response = await fetch(`http://localhost:5000/api/events/${event._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: newEvent,
                        date: date
                    })
                });
                if (!response.ok) throw new Error('Failed to update event');
                await fetchEvents();
            } else {
                const response = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: newEvent,
                        date: date
                    })
                });
                if (!response.ok) throw new Error('Failed to create event');
                await fetchEvents();
            }

            setNewEvent("");
            setEditingIndex(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditEvent = (index) => {
        setNewEvent(events[index].title);
        setDate(events[index].date);
        setEditingIndex(index);
    };

    const handleDeleteEvent = async (index) => {
        try {
            const event = events[index];
            const response = await fetch(`http://localhost:5000/api/events/${event._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete event');
            await fetchEvents();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEventClick = (index) => {
        setSelectedEventIndex(index === selectedEventIndex ? null : index);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="dashboard">
            <div className="navbar">
                <div className="navbar-left">
                    <h2>Welcome, {authuser}</h2>
                </div>
                <div className="navbar-right">
                    <img src={member.profilePic} alt="Profile" className="profile-pic" />
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
                <div className="left-column">
                    <div className="profile-box">
                        <h2>Your Trainer</h2>
                        <div className="trainer-profile">
                            <img src={trainer.image} alt={trainer.name} />
                            <h3>{trainer.name}</h3>
                            <p><strong>Specialization:</strong> {trainer.specialization}</p>
                            <p><strong>Experience:</strong> {trainer.experience}</p>
                            <p><strong>Contact:</strong></p>
                            <p>📧 {trainer.email}</p>
                            <p>📱 {trainer.phone}</p>
                        </div>
                    </div>

                    <div className="membership-details">
                        <h2>Membership Details</h2>
                        <div className="details-box">
                            <p><strong>Remaining Time:</strong> {membership.remainingTime}</p>
                            <p><strong>Renewal Date:</strong> {membership.renewalDate}</p>
                        </div>
                    </div>
                </div>

                <div className="calendar-section">
                    <h2>Event Calendar</h2>
                    <Calendar
                        onChange={handleDateClick}
                        value={date}
                        tileClassName={({ date }) =>
                            events.some(event => event.date.toDateString() === date.toDateString())
                                ? 'has-event'
                                : null
                        }
                        tileContent={({ date }) => {
                            const event = events.find(event => 
                                event.date.toDateString() === date.toDateString()
                            );
                            return event ? (
                                <div className="event-marker">
                                    {event.title.split(" ").map(word => word[0]).join("")}
                                </div>
                            ) : null;
                        }}
                    />
                    <div className="event-form">
                        <input
                            type="text"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            placeholder="Enter event title"
                            className="transparent-input"
                        />
                        <button 
                            className="transparent-button"
                            onClick={handleAddEvent}
                        >
                            {editingIndex !== null ? "Edit Event" : "Add Event"}
                        </button>
                    </div>
                    <div className="event-list">
                        <h3>Upcoming Events</h3>
                        {events.map((event, index) => (
                            <div 
                                key={event._id} 
                                className="event-item"
                                onClick={() => handleEventClick(index)}
                            >
                                <p>
                                    <strong>{event.title}</strong> - {event.date.toDateString()}
                                </p>
                                {selectedEventIndex === index && (
                                    <div className="event-actions">
                                        <button 
                                            className="transparent-button"
                                            onClick={() => handleEditEvent(index)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="transparent-button"
                                            onClick={() => handleDeleteEvent(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;