import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useauthstore } from "../../Store/useauthstore.js";
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "member",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useauthstore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', formData.role);
                localStorage.setItem('username', data.username);
                localStorage.setItem('userId', data._id);
                
                toast.success('Successfully logged in!');
                
                if (formData.role === "member") {
                    navigate("/planspage");
                } else if (formData.role === "trainer") {
                    navigate("/trainerdashboard");
                }
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
             style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/src/assets/front-view-male-boxer-posing.jpg')" }}>
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Login to continue your fitness journey
                    </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                Login As
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="member">Member</option>
                                <option value="trainer">Trainer</option>
                            </select>
                        </div>

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
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-gray-400">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/member-signup')}
                                    className="text-orange-500 hover:text-orange-400 font-medium"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;