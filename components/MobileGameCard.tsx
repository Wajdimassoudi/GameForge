
import React from 'react';
import { MobileGame } from '../types';

interface MobileGameCardProps {
    /** The mobile game object from GitHub API. */
    game: MobileGame;
}

/**
 * A star icon component for displaying GitHub stars.
 */
const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

/**
 * A reusable card component to display a summary of an open-source mobile game.
 * It links directly to the GitHub repository.
 */
const MobileGameCard: React.FC<MobileGameCardProps> = ({ game }) => {
    return (
        <a 
            href={game.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:ring-2 hover:ring-cyan-400 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group"
        >
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center mb-3">
                    <img src={game.owner.avatar_url} alt={game.owner.login} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-600" />
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors" title={game.name}>
                        {game.name}
                    </h3>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{game.description || "No description available."}</p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-700">
                    <span className="bg-gray-700 text-cyan-400 text-xs font-bold px-2 py-1 rounded-full">{game.language || 'N/A'}</span>
                    <div className="flex items-center text-gray-400" title={`${game.stargazers_count} stars`}>
                        <StarIcon />
                        <span className="text-sm font-semibold">{game.stargazers_count}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default MobileGameCard;
