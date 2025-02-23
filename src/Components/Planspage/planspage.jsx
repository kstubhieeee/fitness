import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from 'lucide-react';
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import toast from 'react-hot-toast';

const Planspage = () => {
    const [loading, setLoading] = useState(false);
    const [memberProfile, setMemberProfile] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        checkMembershipStatus();
    }, [navigate]);

    const checkMembershipStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/members/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMemberProfile(data);
                
                if (data.membership && data.membership.status === 'active') {
                    navigate('/memberdashboard');
                }
            }
        } catch (error) {
            console.error('Error checking membership:', error);
        }
    };

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
            ],
            popular: false
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
            ],
            popular: true
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
            ],
            popular: false
        }
    ];

    const handlePayment = async (plan) => {
        try {
            setLoading(true);
            
            // Create order
            const orderResponse = await fetch('http://localhost:5000/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount: plan.price * 100, // Convert to paise
                    planName: plan.name
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            // Load Razorpay
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: 'rzp_test_ilZnoyJIDqrWYR',
                    amount: plan.price * 100,
                    currency: "INR",
                    name: "Power Fit",
                    description: `${plan.name} Subscription`,
                    order_id: orderData.id,
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
                                toast.success('Payment successful! Welcome to Power Fit!');
                                navigate('/memberdashboard');
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
            };

        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="absolute top-4 right-4">
                    <ProfileDropdown 
                        username={memberProfile?.username || localStorage.getItem('username')} 
                        userType="member" 
                    />
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Select the plan that best fits your fitness goals
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-gray-800 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300 ${
                                plan.popular ? 'border-2 border-orange-500' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                            <div className="text-4xl font-bold text-orange-500 mb-6">
                                ₹{plan.price}
                                <span className="text-gray-400 text-base">/month</span>
                            </div>
                            
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-300">
                                        <Check className="text-orange-500 mr-2" size={20} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            
                            <button
                                onClick={() => handlePayment(plan)}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg py-3 px-4 font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        Get Started
                                        <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Planspage;