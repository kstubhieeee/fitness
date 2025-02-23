import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useauthstore } from "../../Store/useauthstore";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, LogOut, Search, Edit2, Trash2, CheckCircle } from 'lucide-react';
import "./styles.css";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import toast from 'react-hot-toast';

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
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [dietPlan, setDietPlan] = useState(null);

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
        fetchMemberProfile();
    }, []);

    const fetchMemberProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/members/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.assignedTrainer) {
                setSelectedTrainer(data.assignedTrainer);
                fetchWorkoutPlan(data._id);
                fetchDietPlan(data._id);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchWorkoutPlan = async (memberId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/workout-plans/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setWorkoutPlan(data);
            }
        } catch (error) {
            console.error('Error fetching workout plan:', error);
        }
    };

    const fetchDietPlan = async (memberId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/diet-plans/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDietPlan(data);
            }
        } catch (error) {
            console.error('Error fetching diet plan:', error);
        }
    };

    const handleSelectTrainer = async (trainer) => {
        try {
            const response = await fetch('http://localhost:5000/api/members/select-trainer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ trainerId: trainer._id })
            });

            if (response.ok) {
                setSelectedTrainer(trainer);
                toast.success('Trainer selected successfully!');
            } else {
                toast.error('Failed to select trainer');
            }
        } catch (error) {
            console.error('Error selecting trainer:', error);
            toast.error('Error selecting trainer');
        }
    };

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
                    <ProfileDropdown 
                        username={localStorage.getItem('username')} 
                        userType="member" 
                    />
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
                                            src={trainer.photo}
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
                                                {selectedTrainer?._id === trainer._id ? (
                                                    <button 
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                                        disabled
                                                    >
                                                        <CheckCircle size={16} />
                                                        Selected
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleSelectTrainer(trainer)}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                                                    >
                                                        Select Trainer
                                                    </button>
                                                )}
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

                    {/* Right Sidebar */}
                    <div className="space-y-6">
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
                            </div>
                        </div>

                        {/* Workout Plan Section */}
                        {selectedTrainer && workoutPlan && (
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-white mb-6">Workout Plan</h2>
                                {workoutPlan.weeklyPlan.map((day, index) => (
                                    <div key={index} className="mb-4">
                                        <h3 className="text-lg font-semibold text-orange-500 mb-2">{day.day}</h3>
                                        <div className="space-y-2">
                                            {day.exercises.map((exercise, i) => (
                                                <div key={i} className="bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-white font-medium">{exercise.name}</p>
                                                    <p className="text-gray-400">
                                                        {exercise.sets} sets × {exercise.reps} reps
                                                        {exercise.duration && ` • ${exercise.duration} mins`}
                                                    </p>
                                                    {exercise.notes && (
                                                        <p className="text-gray-400 text-sm mt-1">{exercise.notes}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Diet Plan Section */}
                        {selectedTrainer && dietPlan && (
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-white mb-6">Diet Plan</h2>
                                {dietPlan.weeklyPlan.map((day, index) => (
                                    <div key={index} className="mb-4">
                                        <h3 className="text-lg font-semibold text-orange-500 mb-2">{day.day}</h3>
                                        <div className="space-y-2">
                                            {day.meals.map((meal, i) => (
                                                <div key={i} className="bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-white font-medium capitalize">{meal.type}</p>
                                                    <div className="space-y-1 mt-2">
                                                        {meal.foods.map((food, j) => (
                                                            <div key={j} className="flex justify-between text-gray-400">
                                                                <span>{food.name}</span>
                                                                <span>{food.quantity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MemberDashboard;