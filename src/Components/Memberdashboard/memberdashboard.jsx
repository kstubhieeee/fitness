import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useauthstore } from "../../Store/useauthstore";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, LogOut, Search, Edit2, Trash2 } from 'lucide-react';
import "./styles.css"

const MemberDashboard = () => {
    const [trainers, setTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('all');
    const { authuser } = useauthstore();
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    // Fetch trainers from the database
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/trainers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch trainers');
                const data = await response.json();
                setTrainers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchTrainers();
    }, []);

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
        }
    };

    const handleAddEvent = async () => {
        if (!newEvent.trim()) return;

        try {
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
            setNewEvent("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditEvent = async (event) => {
        if (editingEvent === event._id) {
            try {
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
                setNewEvent("");
                setEditingEvent(null);
            } catch (err) {
                setError(err.message);
            }
        } else {
            setEditingEvent(event._id);
            setNewEvent(event.title);
            setDate(new Date(event.date));
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
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

    const filteredTrainers = trainers.filter(trainer => {
        const matchesSearch = trainer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            trainer.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = selectedSpecialization === 'all' || 
                                    trainer.specialization?.toLowerCase() === selectedSpecialization.toLowerCase();
        return matchesSearch && matchesSpecialization;
    });

    const specializations = ['all', ...new Set(trainers.map(trainer => trainer.specialization))];

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Welcome, {authuser}</h1>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Search and Filter Section */}
                <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search trainers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <select
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {specializations.map(spec => (
                                <option key={spec} value={spec}>
                                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Trainers List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Available Trainers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredTrainers.map(trainer => (
                                <div key={trainer._id} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:transform hover:scale-105 transition-transform duration-200">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src="/public/trainer/photos/1740246827452-increasy.png"
                                            alt={trainer.fullName}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white">{trainer.fullName}</h3>
                                            <p className="text-orange-500">{trainer.specialization}</p>
                                            <div className="flex items-center mt-2">
                                                <Star className="text-yellow-400" size={16} fill="currentColor" />
                                                <span className="ml-1 text-white">{trainer.rating || 'New'}</span>
                                                <span className="text-gray-400 ml-1">
                                                    ({trainer.reviews?.length || 0} reviews)
                                                </span>
                                            </div>
                                            <p className="text-gray-400 mt-2">{trainer.experience} years experience</p>
                                            <p className="text-white font-semibold mt-2">${trainer.feePerMonth}/month</p>
                                            <div className="mt-4 flex space-x-3">
                                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
                                                    Book Session
                                                </button>
                                                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
                                                    <MessageSquare size={16} />
                                                    Message
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-6">Schedule</h2>
                        <Calendar
                            onChange={setDate}
                            value={date}
                            className="bg-gray-700 border-0 rounded-lg shadow-lg p-4 w-full"
                            tileClassName={({ date }) =>
                                events.some(event => event.date.toDateString() === date.toDateString())
                                    ? 'bg-orange-500 text-white rounded-full'
                                    : null
                            }
                        />
                        <div className="mt-6 space-y-4">
                            <input
                                type="text"
                                value={newEvent}
                                onChange={(e) => setNewEvent(e.target.value)}
                                placeholder="Add new event..."
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={editingEvent ? () => handleEditEvent(events.find(e => e._id === editingEvent)) : handleAddEvent}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                {editingEvent ? 'Update Event' : 'Add Event'}
                            </button>
                            {editingEvent && (
                                <button
                                    onClick={() => {
                                        setEditingEvent(null);
                                        setNewEvent("");
                                    }}
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                        {events.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
                                <div className="space-y-3">
                                    {events.map((event) => (
                                        <div key={event._id} className="bg-gray-700 rounded-lg p-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-white font-medium">{event.title}</p>
                                                    <p className="text-gray-400 text-sm">{event.date.toDateString()}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event._id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MemberDashboard;