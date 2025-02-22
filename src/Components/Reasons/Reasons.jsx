import React from 'react';
import image1 from '../../assets/image1.png';
import image2 from '../../assets/image2.png';
import image3 from '../../assets/image3.png';
import image4 from '../../assets/image4.png';
import { FaCheck} from 'react-icons/fa';
import { SiNike, SiAdidas, SiNewbalance, SiPuma, SiReebok, SiUnderarmour } from 'react-icons/si';
const Reasons = () => {
    return (
        <div className="bg-gray-900 py-20 px-4" id="reasons">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="grid grid-cols-3 gap-4 h-[600px]">
                        <div className="col-span-1 row-span-2">
                            <img src={image1} alt="reason" className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div className="col-span-2">
                            <img src={image2} alt="reason" className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div className="col-span-1">
                            <img src={image3} alt="reason" className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div className="col-span-1">
                            <img src={image4} alt="reason" className="w-full h-full object-cover rounded-2xl" />
                        </div>
                    </div>

                   <div className="space-y-8">
                        <span className="text-orange-500 font-semibold text-xl">SOME REASONS</span>
                        
                        <h2 className="text-4xl md:text-5xl font-bold">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                                WHY
                            </span>{' '}
                            <span className="text-white">CHOOSE US?</span>
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <FaCheck className="text-orange-500 w-6 h-6" />
                                <span className="text-gray-300 text-lg">OVER 100+ EXPERT COACHES</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaCheck className="text-orange-500 w-6 h-6" />
                                <span className="text-gray-300 text-lg">TRAIN SMARTER AND FASTER THAN BEFORE</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaCheck className="text-orange-500 w-6 h-6" />
                                <span className="text-gray-300 text-lg">1 FREE PROGRAM FOR NEW MEMBERS</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaCheck className="text-orange-500 w-6 h-6" />
                                <span className="text-gray-300 text-lg">RELIABLE PARTNERS</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-orange-500 text-xl font-semibold">OUR PARTNERS</h3>
                            <div className="flex gap-8">
                                <SiNike className="text-white h-8 w-10 opacity-50 hover:opacity-100 transition-opacity duration-300" />
                                <SiAdidas className="text-white h-8 w-10 opacity-50 hover:opacity-100 transition-opacity duration-300" />
                                <SiNewbalance className="text-white h-8 w-10 opacity-50 hover:opacity-100 transition-opacity duration-300" />
                                <SiPuma className="text-white h-8 w-10 opacity-50 hover:opacity-100 transition-opacity duration-300" />
                                <SiUnderarmour className="text-white h-8 w-10 opacity-50 hover:opacity-100 transition-opacity duration-300" />
                                <SiReebok className="text-white h-8 w-10 opacity-50 hover:opacity-100 transition-opacity duration-300" />
                           
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reasons;