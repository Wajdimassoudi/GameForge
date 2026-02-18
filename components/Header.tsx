
import React from 'react';

interface HeaderProps {
    /** Function to change the main view of the application. */
    setView: (view: 'home' | 'all-games' | 'all-giveaways') => void;
}

/**
 * The main site header component.
 * Contains the brand logo and primary navigation links.
 */
const Header: React.FC<HeaderProps> = ({ setView }) => {
    return (
        <header className="bg-gray-900/70 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-700/50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
                     {/* New GameForge Logo */}
                     <svg className="w-9 h-9 mr-2 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 13h-2v2h-2v-2H8v-2h4V9h2v4h2v2z"/>
                    </svg>
                    <h1 className="text-2xl font-bold text-white">GameForge</h1>
                </div>
                <nav className="hidden md:flex space-x-6">
                    <button onClick={() => setView('home')} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-semibold">Home</button>
                    <button onClick={() => setView('all-games')} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-semibold">Free-to-Play Games</button>
                    <button onClick={() => setView('all-giveaways')} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-semibold">Giveaways</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
