
import React from 'react';

/**
 * The main site footer.
 * Contains copyright information and attribution links to the data APIs.
 */
const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800/30 mt-16 py-8 border-t border-gray-700/50">
            <div className="container mx-auto px-4 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} GameForge. All rights reserved.</p>
                <div className="text-sm mt-2">
                    <span>
                        PC Game data provided by <a href="https://www.freetogame.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">FreeToGame</a>.
                    </span>
                    <span className="mx-2">|</span>
                    <span>
                        Giveaway data by <a href="https://www.gamerpower.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">GamerPower</a>.
                    </span>
                    <span className="mx-2">|</span>
                     <span>
                        Mobile Game data by <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">GitHub</a>.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
