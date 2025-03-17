import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, Search, Edit2, Trash2, CheckCircle, Filter, Clock, Dumbbell, Activity, CreditCard, Package, X, Users, TrendingUp } from 'lucide-react';
import "./styles.css";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import toast from 'react-hot-toast';

const MemberDashboard = () => {
    const [trainers, setTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('all');
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
    const [memberProfile, setMemberProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('trainers');
    const [currentPlan, setCurrentPlan] = useState(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [members, setMembers] = useState([]);

    const plans = [
        {
            name: "Basic Plan",
            price: 2500,
            features: [
                "Access to gym equipment",
                "Basic workout plans",
                "Locker room access",
                "1 free trainer session",
                "Access to fitness classes"
            ]
        },
        {
            name: "Premium Plan",
            price: 3000,
            features: [
                "All Basic Plan features",
                "3 trainer sessions/month",
                "Nutrition consultation",
                "Access to premium classes",
                "Sauna & spa access"
            ]
        },
        {
            name: "Pro Plan",
            price: 4500,
            features: [
                "All Premium Plan features",
                "Unlimited trainer sessions",
                "Personalized workout plans",
                "Priority booking",
                "Exclusive member events"
            ]
        }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchTrainers(),
                    fetchMemberProfile(),
                    fetchEvents(),
                    fetchMemberData()
                ]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                toast.error('Failed to load data');
            }
        };

        fetchData();
    }, [navigate]);

    const fetchMemberData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/members/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMemberProfile(data);
                setCurrentPlan(data.membership);
            }
        } catch (error) {
            console.error('Error fetching member data:', error);
            toast.error('Failed to load member data');
        }
    };

    const handlePlanUpdate = async (plan) => {
        try {
            setLoading(true);
            
            const response = await fetch('http://localhost:5000/api/members/update-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    planName: plan.name,
                    amount: plan.price
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update plan');
            }

            const { order } = await response.json();

            const options = {
                key: 'rzp_test_ilZnoyJIDqrWYR',
                amount: plan.price * 100,
                currency: "INR",
                name: "Power Fit",
                description: `${plan.name} Subscription`,
                order_id: order.id,
                handler: async function(response) {
                    try {
                        const verifyResponse = await fetch('http://localhost:5000/api/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                planName: plan.name
                            })
                        });

                        if (verifyResponse.ok) {
                            await fetchMemberData();
                            setShowPlanModal(false);
                            toast.success('Plan updated successfully!');
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: memberProfile?.username || '',
                    email: memberProfile?.email || ''
                },
                theme: {
                    color: "#f97316"
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();

        } catch (error) {
            console.error('Error updating plan:', error);
            toast.error('Failed to update plan');
        } finally {
            setLoading(false);
        }
    };

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
        } catch (error) {
            console.error('Error fetching trainers:', error);
            throw error;
        }
    };

    const fetchMemberProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/members/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch member profile');
            }
            
            const data = await response.json();
            setMemberProfile(data);
            
            if (data.assignedTrainer) {
                setSelectedTrainer(data.assignedTrainer);
                await Promise.all([
                    fetchWorkoutPlan(data._id),
                    fetchDietPlan(data._id)
                ]);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
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
            } else if (response.status !== 404) {
                // Only throw error if it's not a 404 (no plan found)
                throw new Error('Failed to fetch workout plan');
            }
        } catch (error) {
            console.error('Error fetching workout plan:', error);
            toast.error('Failed to load workout plan');
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
            } else if (response.status !== 404) {
                // Only throw error if it's not a 404 (no plan found)
                throw new Error('Failed to fetch diet plan');
            }
        } catch (error) {
            console.error('Error fetching diet plan:', error);
            toast.error('Failed to load diet plan');
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
            console.error('Error fetching events:', err);
            throw err;
        }
    };

    const handleAddEvent = async () => {
        if (!newEvent.trim()) return;

        // Validate that the selected date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
            toast.error("Cannot create events in the past");
            return;
        }

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
            // Validate that the selected date is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date < today) {
                toast.error("Cannot schedule events in the past");
                return;
            }

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

    const stats = [
        { icon: <Users size={24} />, title: "Total Members", value: members.length },
       { icon: <TrendingUp size={24} />, title: "Weekly Sessions", value: members.length * 3 },
        { icon: <Package size={24} />, title: "Current Plan", value: currentPlan?.type || "None" }
    ];

    const renderCurrentPlan = () => {
        if (!currentPlan) {
            return (
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">No Active Plan</h3>
                    <p className="text-gray-400 mb-4">You don't have an active membership plan.</p>
                    <button
                        onClick={() => setShowPlanModal(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                        Choose a Plan
                    </button>
                </div>
            );
        }

        return (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Current Plan</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                        currentPlan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                        {currentPlan.status}
                    </span>
                </div>
                <div className="space-y-2 mb-6">
                    <p className="text-2xl font-bold text-orange-500">{currentPlan.type}</p>
                    <p className="text-gray-400">
                        Valid until: {new Date(currentPlan.endDate).toLocaleDateString()}
                    </p>
                </div>
                <button
                    onClick={() => setShowPlanModal(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                    Change Plan
                </button>
            </div>
        );
    };

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, {memberProfile?.username || 'Member'}! 👋
                    </h1>
                    <ProfileDropdown 
                        username={memberProfile?.username || localStorage.getItem('username')} 
                        userType="member" 
                    />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    {renderCurrentPlan()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} 
                             className="bg-gray-800 p-6 rounded-xl shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                            <div className={`inline-flex p-3 rounded-lg ${stat.color} bg-opacity-20 mb-4`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4 mb-8 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('trainers')}
                        className={`px-4 py-2 font-medium transition-colors duration-200 ${
                            activeTab === 'trainers' 
                            ? 'text-orange-500 border-b-2 border-orange-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Find Trainers
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`px-4 py-2 font-medium transition-colors duration-200 ${
                            activeTab === 'schedule' 
                            ? 'text-orange-500 border-b-2 border-orange-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        My Schedule
                    </button>
                    {selectedTrainer && (
                        <button
                            onClick={() => setActiveTab('plans')}
                            className={`px-4 py-2 font-medium transition-colors duration-200 ${
                                activeTab === 'plans' 
                                ? 'text-orange-500 border-b-2 border-orange-500' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            My Plans
                        </button>
                    )}
                </div>

                {activeTab === 'trainers' && (
                    <>
                        <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search trainers by name or specialization..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <select
                                        value={selectedSpecialization}
                                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                                        className="pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                                    >
                                        <option value="all">All Specializations</option>
                                        {specializations.filter(spec => spec !== 'all').map(spec => (
                                            <option key={spec} value={spec}>
                                                {spec.charAt(0).toUpperCase() + spec.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTrainers.map(trainer => (
                                <div key={trainer._id} 
                                     className="bg-gray-800 rounded-xl p-6 shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={trainer.photo}
                                            alt={trainer.fullName}
                                            className="w-20 h-20 rounded-full object-cover ring-2 ring-orange-500"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white">{trainer.fullName}</h3>
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white mt-2">
                                                {trainer.specialization}
                                            </div>
                                            <div className="flex items-center mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < Math.floor(trainer.rating || 0)
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-400'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="text-gray-400 ml-2">
                                                    ({trainer.reviews?.length || 0} reviews)
                                                </span>
                                            </div>
                                            <p className="text-gray-400 mt-2">
                                                {trainer.experience} years experience
                                            </p>
                                            <p className="text-white font-semibold mt-2">
                                                ${trainer.feePerMonth}/month
                                            </p>
                                            <div className="mt-4 flex space-x-3">
                                                {selectedTrainer?._id === trainer._id ? (
                                                    <button 
                                                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                                        disabled
                                                    >
                                                        <CheckCircle size={16} />
                                                        Selected
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleSelectTrainer(trainer)}
                                                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                                                    >
                                                        Select Trainer
                                                    </button>
                                                )}
                                                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
                                                    <MessageSquare size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'schedule' && (
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">My Calendar</h2>
                                <Calendar
                                    onChange={setDate}
                                    value={date}
                                    className="bg-gray-700 border-0 rounded-lg shadow-lg p-4 w-full"
                                    tileClassName={({ date }) =>
                                        events.some(event => event.date.toDateString() === date.toDateString())
                                            ? 'bg-orange-500 text-white rounded-full'
                                            : null
                                    }
                                    tileDisabled={tileDisabled}
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Events</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newEvent}
                                            onChange={(e) => setNewEvent(e.target.value)}
                                            placeholder="Add new event..."
                                            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <button
                                            onClick={editingEvent ? () => handleEditEvent(events.find(e => e._id === editingEvent)) : handleAddEvent}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            {editingEvent ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        {events.map(event => (
                                            <div key={event._id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                                                <div>
                                                    <p className="text-white font-medium">{event.title}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {event.date.toLocaleDateString()}
                                                    </p>
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
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'plans' && selectedTrainer && (
                    <div className="space-y-8">
                        {workoutPlan && (
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-white mb-6">My Workout Plan</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {workoutPlan.weeklyPlan.map((day, index) => (
                                        <div key={index} className="bg-gray-700 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-orange-500 mb-4">{day.day}</h3>
                                            <div className="space-y-3">
                                                {day.exercises.map((exercise, i) => (
                                                    <div key={i} className="bg-gray-600 p-3 rounded-lg">
                                                        <p className="text-white font-medium">{exercise.name}</p>
                                                        <div className="text-gray-400 text-sm mt-1">
                                                            <span>{exercise.sets} sets × {exercise.reps} reps</span>
                                                            {exercise.duration && (
                                                                <span className="ml-2">• {exercise.duration} mins</span>
                                                            )}
                                                        </div>
                                                        {exercise.notes && (
                                                            <p className="text-gray-400 text-sm mt-2 italic">
                                                                {exercise.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dietPlan && (
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-white mb-6">My Diet Plan</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {dietPlan.weeklyPlan.map((day, index) => (
                                        <div key={index} className="bg-gray-700 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-orange-500 mb-4">{day.day}</h3>
                                            <div className="space-y-3">
                                                {day.meals.map((meal, i) => (
                                                    <div key={i} className="bg-gray-600 p-3 rounded-lg">
                                                        <p className="text-white font-medium capitalize">{meal.type}</p>
                                                        <div className="mt-2 space-y-1">
                                                            {meal.foods.map((food, j) => (
                                                                <div key={j} className="flex justify-between text-sm">
                                                                    <span className="text-gray-300">{food.name}</span>
                                                                    <span className="text-gray-400">{food.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MemberDashboard;