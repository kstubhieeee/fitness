import React from 'react';
import { plansData } from '../../data/plansData';
import whiteTick from '../../assets/whiteTick.png';

const Plans = () => {
    return (
        <div className="bg-gray-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                            Choose Your Plan
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg">Start your fitness journey with our flexible plans</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plansData.map((plan, i) => (
                        <div key={i} className={`bg-gray-800 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 ${
                            i === 1 ? 'lg:-mt-4 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-orange-500/20 before:to-transparent before:rounded-2xl' : ''
                        }`}>
                            <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mb-6">
                                {plan.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                            <div className="text-3xl font-bold text-orange-500 mb-6">
                                ${plan.price}
                                <span className="text-sm text-gray-400">/month</span>
                            </div>
                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <img src={whiteTick} alt="check" className="w-5 h-5" />
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1">
                                Join Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Plans;