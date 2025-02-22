import React from 'react';

const Join = () => {
    return (
        <div className="bg-gray-900 py-20 px-4" id="join-us">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="relative">
                            <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-600"></div>
                            <h2 className="text-4xl md:text-5xl font-bold mt-6">
                                <span className="text-white">READY TO</span>{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                                    LEVEL UP
                                </span>
                            </h2>
                            <h2 className="text-4xl md:text-5xl font-bold mt-2">
                                <span className="text-white">YOUR PHYSIQUE</span>{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                                    WITH US?
                                </span>
                            </h2>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <form className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-xl">
                            <div className="flex gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1">
                                    Join Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Join;