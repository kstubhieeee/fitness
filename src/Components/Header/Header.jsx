import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [menuOpened, setMenuOpened] = useState(false);

    const menuItems = [
        { to: 'home', label: 'Home' },
        { to: 'programs', label: 'Programs' },
        { to: 'reasons', label: 'Why Us' },
        { to: 'Plans', label: 'Plans' },
        { to: 'testimonial', label: 'Testimonials' }
    ];

    return (
        <nav className="relative z-50">
            <div className="flex items-center justify-between">
                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white hover:text-orange-500 transition-colors duration-300"
                    onClick={() => setMenuOpened(!menuOpened)}
                >
                    {menuOpened ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop menu */}
                <ul className="hidden md:flex items-center space-x-8">
                    {menuItems.map((item) => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                spy={true}
                                smooth={true}
                                onClick={() => setMenuOpened(false)}
                                className="text-white hover:text-orange-500 cursor-pointer transition-colors duration-300 text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile menu */}
            {menuOpened && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 py-4 px-6 rounded-lg mt-2">
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    spy={true}
                                    smooth={true}
                                    onClick={() => setMenuOpened(false)}
                                    className="text-white hover:text-orange-500 block transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Header;