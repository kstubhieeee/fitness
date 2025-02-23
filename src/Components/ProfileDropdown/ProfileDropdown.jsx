import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { useauthstore } from '../../Store/useauthstore';

const ProfileDropdown = ({ username, userType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useauthstore();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout(); // This will clear localStorage and zustand state
        setIsOpen(false); // Close dropdown
        navigate('/login', { replace: true }); // Use replace to prevent back navigation
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors duration-200"
            >
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <User size={20} />
                </div>
                <span>{username}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white">{username}</p>
                        <p className="text-xs text-orange-500 capitalize">{userType}</p>
                    </div>
                    
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate(`/${userType}dashboard`);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                    >
                        Dashboard
                    </button>
                    
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                    >
                        <Settings size={16} className="mr-2" />
                        Settings
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 transition-colors duration-200 flex items-center"
                    >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;