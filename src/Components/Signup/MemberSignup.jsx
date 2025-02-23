import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const MemberSignup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        age: "",
        gender: "male",
        emergencyContact: "",
        healthConditions: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/members/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userType: "member"
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', 'member');
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userId', data.user._id);
                
                toast.success("Registration successful!");
                navigate("/planspage");
            } else {
                toast.error(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
             style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/src/assets/front-view-male-boxer-posing.jpg')" }}>
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white">
                        Member Registration
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Join our fitness community and start your transformation journey
                    </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Emergency Contact
                            </label>
                            <input
                                type="tel"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Health Conditions
                            </label>
                            <textarea
                                name="healthConditions"
                                value={formData.healthConditions}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="List any health conditions or concerns..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg py-3 px-4 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing up...
                                    </span>
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MemberSignup;