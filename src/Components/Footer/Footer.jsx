import React from 'react';
import Github from "../../assets/github.png";
import Instagram from "../../assets/instagram.png";
import LinkedIn from "../../assets/linkedin.png";
import Logo3 from "../../assets/Logo3.jpg";

const Footer = () => {
    return (
        <footer className="bg-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <img src={Logo3} alt="Logo" className="h-12" />
                        <p className="text-gray-400">
                            Transform your body, transform your life. Join our community of fitness enthusiasts.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold text-xl mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Home</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Programs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Plans</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold text-xl mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">123 Fitness Street</li>
                            <li className="text-gray-400">Workout City, WC 12345</li>
                            <li className="text-gray-400">Phone: (123) 456-7890</li>
                            <li className="text-gray-400">Email: info@powerfit.com</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold text-xl mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors duration-300">
                                <img src={Github} alt="Github" className="w-6 h-6" />
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors duration-300">
                                <img src={Instagram} alt="Instagram" className="w-6 h-6" />
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors duration-300">
                                <img src={LinkedIn} alt="LinkedIn" className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <p className="text-center text-gray-400">
                        © 2024 Power-Fit. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;