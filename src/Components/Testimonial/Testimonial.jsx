import React, { useState } from 'react';
import { testimonialsData } from "../../data/testimonialsData";
import leftArrow from '../../assets/leftArrow.png';
import rightArrow from '../../assets/rightArrow.png';
import { motion } from 'framer-motion';

const Testimonial = () => {
    const [selected, setSelected] = useState(0);
    const tLength = testimonialsData.length;

    return (
        <div className="bg-gray-900 py-20 px-4" id="testimonial">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            <span className="text-orange-500">What People</span>
                            <br />
                            <span className="text-white">Say About Us</span>
                        </h2>
                        <motion.p 
                            key={selected}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-gray-300 text-lg leading-relaxed"
                        >
                            {testimonialsData[selected].review}
                        </motion.p>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-bold text-orange-500">
                                {testimonialsData[selected].name}
                            </h4>
                            <p className="text-gray-400">{testimonialsData[selected].status}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => selected === 0 ? setSelected(tLength - 1) : setSelected(prev => prev - 1)}
                                className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors duration-300"
                            >
                                <img src={leftArrow} alt="Previous" className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => selected === tLength - 1 ? setSelected(0) : setSelected(prev => prev + 1)}
                                className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors duration-300"
                            >
                                <img src={rightArrow} alt="Next" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute top-4 right-4 w-72 h-80 bg-gradient-to-r rounded-2xl transform rotate-6"></div>
                        <motion.img
                            key={selected}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            src={testimonialsData[selected].image}
                            alt="testimonial"
                            className="relative z-10 w-72 h-80 object-cover rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;