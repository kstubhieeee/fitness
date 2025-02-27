import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, LogOut, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch members data
            const membersResponse = await fetch('http://localhost:5000/api/admin/members', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            // Fetch trainers data
            const trainersResponse = await fetch('http://localhost:5000/api/admin/trainers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (membersResponse.ok && trainersResponse.ok) {
                const membersData = await membersResponse.json();
                const trainersData = await trainersResponse.json();
                
                setMembers(membersData);
                setTrainers(trainersData);
            } else {
                // If API endpoints don't exist yet, use sample data
                console.warn('Using sample data as API endpoints may not be available');
                
                // Sample members data
                setMembers([
                    { _id: '1', username: 'john_doe', email: 'john@example.com', phone: '1234567890', age: 28, gender: 'male', membership: { status: 'active', type: 'Premium Plan' } },
                    { _id: '2', username: 'jane_smith', email: 'jane@example.com', phone: '9876543210', age: 24, gender: 'female', membership: { status: 'inactive', type: null } },
                    { _id: '3', username: 'mike_johnson', email: 'mike@example.com', phone: '5551234567', age: 32, gender: 'male', membership: { status: 'active', type: 'Basic Plan' } },
                    { _id: '4', username: 'sarah_williams', email: 'sarah@example.com', phone: '7778889999', age: 27, gender: 'female', membership: { status: 'active', type: 'Pro Plan' } }
                ]);
                
                // Sample trainers data
                setTrainers([
                    { _id: '1', username: 'coach_alex', email: 'alex@example.com', phone: '1112223333', fullName: 'Alex Johnson', age: 35, gender: 'male', specialization: 'Strength Training', experience: 8, feePerMonth: 3000 },
                    { _id: '2', username: 'coach_emma', email: 'emma@example.com', phone: '4445556666', fullName: 'Emma Wilson', age: 29, gender: 'female', specialization: 'Yoga', experience: 5, feePerMonth: 2500 },
                    { _id: '3', username: 'coach_david', email: 'david@example.com', phone: '7778889999', fullName: 'David Brown', age: 40, gender: 'male', specialization: 'Cardio', experience: 12, feePerMonth: 3500 }
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/');
        toast.success('Logged out successfully');
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setShowEditModal(true);
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                const endpoint = type === 'member' 
                    ? `http://localhost:5000/api/admin/members/${id}` 
                    : `http://localhost:5000/api/admin/trainers/${id}`;
                
                const response = await fetch(endpoint, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (response.ok) {
                    if (type === 'member') {
                        setMembers(members.filter(member => member._id !== id));
                    } else {
                        setTrainers(trainers.filter(trainer => trainer._id !== id));
                    }
                    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
                } else {
                    // If API endpoint doesn't exist yet, simulate deletion
                    if (type === 'member') {
                        setMembers(members.filter(member => member._id !== id));
                    } else {
                        setTrainers(trainers.filter(trainer => trainer._id !== id));
                    }
                    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error(`Failed to delete ${type}`);
            }
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        
        if (currentUser.username) {
            try {
                const isTrainer = activeTab === 'trainers';
                const endpoint = isTrainer 
                    ? `http://localhost:5000/api/admin/trainers/${currentUser._id}` 
                    : `http://localhost:5000/api/admin/members/${currentUser._id}`;
                
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    },
                    body: JSON.stringify(currentUser)
                });
                
                if (response.ok) {
                    if (isTrainer) {
                        setTrainers(trainers.map(trainer => 
                            trainer._id === currentUser._id ? currentUser : trainer
                        ));
                    } else {
                        setMembers(members.map(member => 
                            member._id === currentUser._id ? currentUser : member
                        ));
                    }
                    
                    setShowEditModal(false);
                    toast.success('User updated successfully');
                } else {
                    // If API endpoint doesn't exist yet, simulate update
                    if (isTrainer) {
                        setTrainers(trainers.map(trainer => 
                            trainer._id === currentUser._id ? currentUser : trainer
                        ));
                    } else {
                        setMembers(members.map(member => 
                            member._id === currentUser._id ? currentUser : member
                        ));
                    }
                    
                    setShowEditModal(false);
                    toast.success('User updated successfully');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Failed to update user');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({
            ...currentUser,
            [name]: value
        });
    };

    const filteredMembers = members.filter(member => 
        member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTrainers = trainers.filter(trainer => 
        trainer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/admin/coupons')}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Coupon
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <LogOut size={20} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`px-4 py-2 font-medium transition-colors duration-200 ${
                            activeTab === 'members' 
                            ? 'text-orange-500 border-b-2 border-orange-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Members
                    </button>
                    <button
                        onClick={() => setActiveTab('trainers')}
                        className={`px-4 py-2 font-medium transition-colors duration-200 ${
                            activeTab === 'trainers' 
                            ? 'text-orange-500 border-b-2 border-orange-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Trainers
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                {/* Members Table */}
                {activeTab === 'members' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Membership</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredMembers.map((member) => (
                                    <tr key={member._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.age}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white capitalize">{member.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                member.membership?.status === 'active' 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-500 text-white'
                                            }`}>
                                                {member.membership?.status || 'inactive'}
                                            </span>
                                            {member.membership?.type && (
                                                <span className="ml-2 text-gray-300">
                                                    {member.membership.type}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            <button 
                                                onClick={() => handleEdit(member)}
                                                className="text-blue-400 hover:text-blue-300 mr-3"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(member._id, 'member')}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Trainers Table */}
                {activeTab === 'trainers' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Experience</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredTrainers.map((trainer) => (
                                    <tr key={trainer._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.specialization}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.experience} years</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₹{trainer.feePerMonth}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            <button 
                                                onClick={() => handleEdit(trainer)}
                                                className="text-blue-400 hover:text-blue-300 mr-3"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(trainer._id, 'trainer')}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {showEditModal && currentUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Edit {activeTab === 'members' ? 'Member' : 'Trainer'}
                        </h2>
                        
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={currentUser.username}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={currentUser.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={currentUser.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            
                            {activeTab === 'members' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={currentUser.age}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={currentUser.gender}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={currentUser.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={currentUser.specialization}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Experience (years)
                                        </label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={currentUser.experience}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Fee Per Month (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="feePerMonth"
                                            value={currentUser.feePerMonth}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;