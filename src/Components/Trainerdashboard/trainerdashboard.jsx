import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Calendar, TrendingUp, MessageSquare, Award, Search, Edit2, Trash2 } from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown"
const Trainerdashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainerName, setTrainerName] = useState('');
    const navigate = useNavigate();

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
                                {member.gender === 'male' ? (
                                    <img src="/male.png" className="w-16 h-16"/>
                                ) : (
                                    <img src="/female.png" className=" w-16 h-16" />
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{member.username}</h3>
                                    <p className="text-gray-400">{member.email}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-400">
                                    <Calendar size={16} className="mr-2" />
                                    <span>Joined: {new Date(member.joinedDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                    <Award size={16} className="mr-2" />
                                    <span>Progress: {member.progress}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                    <TrendingUp size={16} className="mr-2" />
                                    Progress
                                </button>
                                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                    <MessageSquare size={16} className="mr-2" />
                                    Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Trainerdashboard;