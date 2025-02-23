import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, TrendingUp, MessageSquare, Award, Search, Plus } from 'lucide-react';
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import toast from 'react-hot-toast';

const Trainerdashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainerName, setTrainerName] = useState('');
    const navigate = useNavigate();
    const [selectedMember, setSelectedMember] = useState(null);
    const [showWorkoutForm, setShowWorkoutForm] = useState(false);
    const [showDietForm, setShowDietForm] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState({
        weeklyPlan: [
            { day: "Monday", exercises: [] },
            { day: "Tuesday", exercises: [] },
            { day: "Wednesday", exercises: [] },
            { day: "Thursday", exercises: [] },
            { day: "Friday", exercises: [] },
            { day: "Saturday", exercises: [] },
            { day: "Sunday", exercises: [] }
        ]
    });

    const [dietPlan, setDietPlan] = useState({
        weeklyPlan: [
            { day: "Monday", meals: [] },
            { day: "Tuesday", meals: [] },
            { day: "Wednesday", meals: [] },
            { day: "Thursday", meals: [] },
            { day: "Friday", meals: [] },
            { day: "Saturday", meals: [] },
            { day: "Sunday", meals: [] }
        ]
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('trainerName');
        
        if (!token) {
            navigate('/login');
            return;
        }

        if (storedName) {
            setTrainerName(storedName);
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

    const handleAddExercise = (dayIndex) => {
        const newExercise = {
            name: "",
            sets: 0,
            reps: 0,
            duration: 0,
            notes: ""
        };

        const updatedPlan = { ...workoutPlan };
        updatedPlan.weeklyPlan[dayIndex].exercises.push(newExercise);
        setWorkoutPlan(updatedPlan);
    };

    const handleAddMeal = (dayIndex) => {
        const newMeal = {
            type: "breakfast",
            foods: []
        };

        const updatedPlan = { ...dietPlan };
        updatedPlan.weeklyPlan[dayIndex].meals.push(newMeal);
        setDietPlan(updatedPlan);
    };

    const handleAddFood = (dayIndex, mealIndex) => {
        const newFood = {
            name: "",
            quantity: "",
            calories: 0
        };

        const updatedPlan = { ...dietPlan };
        updatedPlan.weeklyPlan[dayIndex].meals[mealIndex].foods.push(newFood);
        setDietPlan(updatedPlan);
    };

    const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
        const updatedPlan = { ...workoutPlan };
        updatedPlan.weeklyPlan[dayIndex].exercises[exerciseIndex][field] = value;
        setWorkoutPlan(updatedPlan);
    };

    const handleMealChange = (dayIndex, mealIndex, field, value) => {
        const updatedPlan = { ...dietPlan };
        updatedPlan.weeklyPlan[dayIndex].meals[mealIndex][field] = value;
        setDietPlan(updatedPlan);
    };

    const handleFoodChange = (dayIndex, mealIndex, foodIndex, field, value) => {
        const updatedPlan = { ...dietPlan };
        updatedPlan.weeklyPlan[dayIndex].meals[mealIndex].foods[foodIndex][field] = value;
        setDietPlan(updatedPlan);
    };

    const handleSubmitWorkoutPlan = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/workout-plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    memberId: selectedMember._id,
                    weeklyPlan: workoutPlan.weeklyPlan
                })
            });

            if (response.ok) {
                toast.success('Workout plan created successfully!');
                setShowWorkoutForm(false);
            } else {
                toast.error('Failed to create workout plan');
            }
        } catch (error) {
            console.error('Error creating workout plan:', error);
            toast.error('Error creating workout plan');
        }
    };

    const handleSubmitDietPlan = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/diet-plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    memberId: selectedMember._id,
                    weeklyPlan: dietPlan.weeklyPlan
                })
            });

            if (response.ok) {
                toast.success('Diet plan created successfully!');
                setShowDietForm(false);
            } else {
                toast.error('Failed to create diet plan');
            }
        } catch (error) {
            console.error('Error creating diet plan:', error);
            toast.error('Error creating diet plan');
        }
    };

    const stats = [
        { icon: <Users size={24} />, title: "Total Members", value: members.length },
        { icon: <Calendar size={24} />, title: "Active Sessions", value: "12" },
        { icon: <TrendingUp size={24} />, title: "Weekly Sessions", value: "28" },
        { icon: <Award size={24} />, title: "Member Progress", value: "85%" }
    ];

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
                    <h1 className="text-3xl font-bold text-white">Welcome, {trainerName || 'Trainer'}</h1>
                    <ProfileDropdown 
                        username={localStorage.getItem('username')} 
                        userType="trainer" 
                    />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-orange-500">{stat.icon}</div>
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                            </div>
                            <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                        </div>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member._id} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                                    {member.gender === 'male' ? (
                                        <img src="/male.png" alt="Male" className="w-12 h-12" />
                                    ) : (
                                        <img src="/female.png" alt="Female" className="w-12 h-12" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{member.username}</h3>
                                    <p className="text-gray-400">{member.email}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-400">
                                    <Calendar size={16} className="mr-2" />
                                    <span>Age: {member.age}</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                    <Award size={16} className="mr-2" />
                                    <span>Health: {member.healthConditions || 'No conditions'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <button 
                                    onClick={() => {
                                        setSelectedMember(member);
                                        setShowWorkoutForm(true);
                                    }}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Create Workout Plan
                                </button>
                                <button 
                                    onClick={() => {
                                        setSelectedMember(member);
                                        setShowDietForm(true);
                                    }}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Create Diet Plan
                                </button>
                                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                    <MessageSquare size={16} className="mr-2" />
                                    Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workout Plan Form Modal */}
                {showWorkoutForm && selectedMember && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Create Workout Plan for {selectedMember.username}
                            </h2>
                            
                            {workoutPlan.weeklyPlan.map((day, dayIndex) => (
                                <div key={dayIndex} className="mb-6">
                                    <h3 className="text-xl font-semibold text-orange-500 mb-4">{day.day}</h3>
                                    
                                    {day.exercises.map((exercise, exerciseIndex) => (
                                        <div key={exerciseIndex} className="bg-gray-700 p-4 rounded-lg mb-4">
                                            <input
                                                type="text"
                                                placeholder="Exercise name"
                                                value={exercise.name}
                                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'name', e.target.value)}
                                                className="w-full bg-gray-600 text-white p-2 rounded mb-2"
                                            />
                                            <div className="grid grid-cols-3 gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Sets"
                                                    value={exercise.sets}
                                                    onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', parseInt(e.target.value))}
                                                    className="bg-gray-600 text-white p-2 rounded"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Reps"
                                                    value={exercise.reps}
                                                    onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', parseInt(e.target.value))}
                                                    className="bg-gray-600 text-white p-2 rounded"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Duration (mins)"
                                                    value={exercise.duration}
                                                    onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'duration', parseInt(e.target.value))}
                                                    className="bg-gray-600 text-white p-2 rounded"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Notes"
                                                value={exercise.notes}
                                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
                                                className="w-full bg-gray-600 text-white p-2 rounded mt-2"
                                            />
                                        </div>
                                    ))}
                                    
                                    <button
                                        onClick={() => handleAddExercise(dayIndex)}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                                    >
                                        Add Exercise
                                    </button>
                                </div>
                            ))}
                            
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setShowWorkoutForm(false)}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitWorkoutPlan}
                                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                                >
                                    Save Workout Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Diet Plan Form Modal */}
                {showDietForm && selectedMember && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Create Diet Plan for {selectedMember.username}
                            </h2>
                            
                            {dietPlan.weeklyPlan.map((day, dayIndex) => (
                                <div key={dayIndex} className="mb-6">
                                    <h3 className="text-xl font-semibold text-orange-500 mb-4">{day.day}</h3>
                                    
                                    {day.meals.map((meal, mealIndex) => (
                                        <div key={mealIndex} className="bg-gray-700 p-4 rounded-lg mb-4">
                                            <select
                                                value={meal.type}
                                                onChange={(e) => handleMealChange(dayIndex, mealIndex, 'type', e.target.value)}
                                                className="w-full bg-gray-600 text-white p-2 rounded mb-4"
                                            >
                                                <option value="breakfast">Breakfast</option>
                                                <option value="lunch">Lunch</option>
                                                <option value="dinner">Dinner</option>
                                                <option value="snack">Snack</option>
                                            </select>
                                            
                                            {meal.foods.map((food, foodIndex) => (
                                                <div key={foodIndex} className="grid grid-cols-3 gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Food name"
                                                        value={food.name}
                                                        onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'name', e.target.value)}
                                                        className="bg-gray-600 text-white p-2 rounded"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Quantity"
                                                        value={food.quantity}
                                                        onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'quantity', e.target.value)}
                                                        className="bg-gray-600 text-white p-2 rounded"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Calories"
                                                        value={food.calories}
                                                        onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'calories', parseInt(e.target.value))}
                                                        className="bg-gray-600 text-white p-2 rounded"
                                                    />
                                                </div>
                                            ))}
                                            
                                            <button
                                                onClick={() => handleAddFood(dayIndex, mealIndex)}
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 mt-2"
                                            >
                                                Add Food
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <button
                                        onClick={() => handleAddMeal(dayIndex)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                    >
                                        Add Meal
                                    </button>
                                </div>
                            ))}
                            
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setShowDietForm(false)}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitDietPlan}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                >
                                    Save Diet Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Trainerdashboard;