import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from 'lucide-react';

const Planspage = () => {
    const navigate = useNavigate();
    
    const plans = [
        {
            name: "Basic Plan",
            price: "$25",
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
            price: "$30",
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
            price: "$45",
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

    return (
        <div className="min-h-screen bg-gray-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
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
                                {plan.price}
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
                                onClick={() => navigate("/memberdashboard")}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg py-3 px-4 font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center group"
                            >
                                Get Started
                                <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate("/memberdashboard")}
                        className="text-orange-500 hover:text-orange-400 font-medium flex items-center justify-center mx-auto"
                    >
                        Go to Dashboard
                        <ArrowRight className="ml-2" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Planspage;