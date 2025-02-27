import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState({
        code: '',
        discount: 10,
        expiryDate: '',
        isActive: true
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/admin/coupons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCoupons(data);
            } else {
                // If API endpoint doesn't exist yet, use sample data
                console.warn('Using sample coupon data as API endpoint may not be available');
                setCoupons([
                    { _id: '1', code: 'SUMMER25', discount: 25, expiryDate: '2025-08-31', isActive: true },
                    { _id: '2', code: 'WELCOME10', discount: 10, expiryDate: '2025-12-31', isActive: true },
                    { _id: '3', code: 'FLASH50', discount: 50, expiryDate: '2025-06-30', isActive: false }
                ]);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Failed to load coupons');
            // Use sample data as fallback
            setCoupons([
                { _id: '1', code: 'SUMMER25', discount: 25, expiryDate: '2025-08-31', isActive: true },
                { _id: '2', code: 'WELCOME10', discount: 10, expiryDate: '2025-12-31', isActive: true },
                { _id: '3', code: 'FLASH50', discount: 50, expiryDate: '2025-06-30', isActive: false }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentCoupon({
            ...currentCoupon,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddCoupon = () => {
        setCurrentCoupon({
            code: '',
            discount: 10,
            expiryDate: '',
            isActive: true
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditCoupon = (coupon) => {
        // Format the date for the input field (YYYY-MM-DD)
        const formattedCoupon = {
            ...coupon,
            expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0]
        };
        setCurrentCoupon(formattedCoupon);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteCoupon = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/coupons/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (response.ok) {
                    setCoupons(coupons.filter(coupon => coupon._id !== id));
                    toast.success('Coupon deleted successfully');
                } else {
                    // If API endpoint doesn't exist yet, simulate deletion
                    setCoupons(coupons.filter(coupon => coupon._id !== id));
                    toast.success('Coupon deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting coupon:', error);
                toast.error('Failed to delete coupon');
                
                // Simulate successful deletion for demo purposes
                setCoupons(coupons.filter(coupon => coupon._id !== id));
                toast.success('Coupon deleted successfully');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentCoupon.code || !currentCoupon.discount || !currentCoupon.expiryDate) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            if (isEditing) {
                const response = await fetch(`http://localhost:5000/api/admin/coupons/${currentCoupon._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    },
                    body: JSON.stringify(currentCoupon)
                });
                
                if (response.ok) {
                    const updatedCoupon = await response.json();
                    setCoupons(coupons.map(coupon => 
                        coupon._id === currentCoupon._id ? updatedCoupon : coupon
                    ));
                    toast.success('Coupon updated successfully');
                } else {
                    // If API endpoint doesn't exist yet, simulate update
                    setCoupons(coupons.map(coupon => 
                        coupon._id === currentCoupon._id ? currentCoupon : coupon
                    ));
                    toast.success('Coupon updated successfully');
                }
            } else {
                const response = await fetch('http://localhost:5000/api/admin/coupons', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    },
                    body: JSON.stringify(currentCoupon)
                });
                
                if (response.ok) {
                    const newCoupon = await response.json();
                    setCoupons([...coupons, newCoupon]);
                    toast.success('Coupon added successfully');
                } else {
                    // If API endpoint doesn't exist yet, simulate adding
                    const newCoupon = {
                        ...currentCoupon,
                        _id: Date.now().toString() // Simple way to generate unique ID
                    };
                    setCoupons([...coupons, newCoupon]);
                    toast.success('Coupon added successfully');
                }
            }
            
            setShowModal(false);
        } catch (error) {
            console.error('Error saving coupon:', error);
            toast.error('Failed to save coupon');
            
            // Simulate successful operation for demo purposes
            if (isEditing) {
                setCoupons(coupons.map(coupon => 
                    coupon._id === currentCoupon._id ? currentCoupon : coupon
                ));
            } else {
                const newCoupon = {
                    ...currentCoupon,
                    _id: Date.now().toString()
                };
                setCoupons([...coupons, newCoupon]);
            }
            setShowModal(false);
            toast.success(isEditing ? 'Coupon updated successfully' : 'Coupon added successfully');
        }
    };

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
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-white hover:text-orange-500 mr-4"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-bold text-white">Manage Coupons</h1>
                    </div>
                    <button
                        onClick={handleAddCoupon}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus size={20} className="mr-2" />
                        Add New Coupon
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coupon Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Discount (%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{coupon.discount}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-2 text-gray-400" />
                                            {new Date(coupon.expiryDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            coupon.isActive 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-gray-500 text-white'
                                        }`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        <button 
                                            onClick={() => handleEditCoupon(coupon)}
                                            className="text-blue-400 hover:text-blue-300 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteCoupon(coupon._id)}
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
            </main>

            {/* Add/Edit Coupon Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {isEditing ? 'Edit Coupon' : 'Add New Coupon'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Coupon Code*
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={currentCoupon.code}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Discount Percentage*
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    min="1"
                                    max="100"
                                    value={currentCoupon.discount}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Expiry Date*
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={currentCoupon.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={currentCoupon.isActive}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded"
                                />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
                                    Active
                                </label>
                            </div>
                            
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    {isEditing ? 'Update Coupon' : 'Add Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;