
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
    /** The game object to display. */
    game: Game;
    /** Function to handle clicks on the card, usually for navigation. */
    onSelectGame: (id: number) => void;
}

/**
 * A platform icon component that displays a different SVG based on the platform string.
 */
const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
    // Renders a Windows icon
    if (platform.toLowerCase().includes('pc') || platform.toLowerCase().includes('windows')) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,12V6.75L9,5.43V11.91L3,12M21,12V4.5L11,3V11.91L21,12M3,13L9,13.09V18.57L3,17.25V13M21,13L11,13.09V21L21,19.5V13Z" />
            </svg>
        );
    }
    // Renders a generic browser/web icon
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 7.973 5 10 5c.099 0 .197.008.294.023l-1.002 4.007-3.96-1.002a6.012 6.012 0 01-1.002-4.007zM10 15c-1.012 0-1.965-.298-2.752-.812l3.96-1.002 1.002 4.007A6.012 6.012 0 0110 15z" clipRule="evenodd" />
        </svg>
    );
};


/**
 * A reusable card component to display a summary of a game.
 * Features an enhanced hover effect for better user interaction.
 */
const GameCard: React.FC<GameCardProps> = ({ game, onSelectGame }) => {
    return (
        <div 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:ring-2 hover:ring-cyan-400 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            onClick={() => onSelectGame(game.id)}
        >
            <img src={game.thumbnail} alt={game.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 truncate" title={game.title}>{game.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{game.short_description}</p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-700">
                    <span className="bg-gray-700 text-cyan-400 text-xs font-bold px-2 py-1 rounded-full">{game.genre}</span>
                    <div className="text-gray-400" title={game.platform}>
                        <PlatformIcon platform={game.platform} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
