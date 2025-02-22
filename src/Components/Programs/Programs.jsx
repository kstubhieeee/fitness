import React from 'react';
import { programsData } from '../../data/programsData';
import { ArrowRight } from 'lucide-react';

const Programs = () => {
    return (
        <div className="bg-gray-900 py-20 px-4" id="programs">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                            EXPLORE
                        </span>{' '}
                        <span className="text-white">OUR</span>{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                            PROGRAMS
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {programsData.map((program, i) => (
                        <div
                            key={i}
                            className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 group"
                        >
                            <div className="text-orange-500 mb-6">
                                {React.cloneElement(program.image, {
                                    className: "w-12 h-12 fill-current"
                                })}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">
                                {program.heading}
                            </h3>

                            <p className="text-gray-400 mb-6 min-h-[80px]">
                                {program.details}
                            </p>

                            <button className="flex items-center gap-2 text-white group-hover:text-orange-500 transition-colors duration-300">
                                <span>Join Now</span>
                                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Programs;