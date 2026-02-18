
import React from 'react';
import { AggregatedGame } from '../types';

interface AggregatedGameCardProps {
    /** The game object from the aggregated API. */
    game: AggregatedGame;
}

/**
 * A generic platform/source icon component for the aggregated game card.
 */
const SourceIcon: React.FC<{ source: string }> = ({ source }) => {
    if (source === 'FreeToGame') {
        return (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 7.973 5 10 5c.099 0 .197.008.294.023l-1.002 4.007-3.96-1.002a6.012 6.012 0 01-1.002-4.007zM10 15c-1.012 0-1.965-.298-2.752-.812l3.96-1.002 1.002 4.007A6.012 6.012 0 0110 15z" clipRule="evenodd" />
            </svg>
        );
    }
     if (source === 'F-Droid' || source === 'GitHub') {
         return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
               <path d="M17.8,2H6.2C3.9,2,2,3.9,2,6.2v11.6C2,20.1,3.9,22,6.2,22h11.6c2.3,0,4.2-1.9,4.2-4.2V6.2C22,3.9,20.1,2,17.8,2z M8,17.5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S8.8,17.5,8,17.5z M16,17.5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5 s1.5,0.7,1.5,1.5S16.8,17.5,16,17.5z M18.5,10.2l-3.2,2.8c-0.1,0.1-0.2,0.1-0.3-0.1L12,9.3l-2.9,3.6c-0.1,0.2-0.2,0.1-0.3,0.1 l-3.2-2.8c-0.2-0.1-0.2-0.3,0-0.4l1-1.2c0.1-0.1,0.2-0.1,0.3,0l2.2,2l2.6-3.3c0.1-0.1,0.2-0.1,0.3,0l2.6,3.3l2.2-2 c0.1-0.1,0.2-0.1,0.3,0l1,1.2C18.7,9.9,18.7,10.1,18.5,10.2z"/>
            </svg>
         );
    }
    return null;
};


/**
 * A unified card component to display a summary of any game from the aggregated API.
 * It intelligently determines the correct URL to link to.
 */
const AggregatedGameCard: React.FC<AggregatedGameCardProps> = ({ game }) => {
    const { title, description, image, play_url, apk_url, store_url, source } = game;

    // Determine the primary URL for the card link
    const primaryUrl = play_url || store_url || apk_url;
    
    // Fallback image in case the API doesn't provide one
    const displayImage = image || "https://via.placeholder.com/300x160.png?text=No+Image";

    return (
        <a 
            href={primaryUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:ring-2 hover:ring-cyan-400 transform hover:-translate-y-1 transition-all duration-300 flex flex-col ${!primaryUrl ? 'cursor-default' : ''}`}
            onClick={(e) => !primaryUrl && e.preventDefault()}
        >
            <img src={displayImage} alt={title} className="w-full h-40 object-cover bg-gray-700" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300x160.png?text=Image+Error" }}/>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 truncate" title={title}>{title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{description || "No description available."}</p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-700">
                    <span className="bg-gray-700 text-cyan-400 text-xs font-bold px-2 py-1 rounded-full">{source}</span>
                    <div className="text-gray-400" title={source}>
                        <SourceIcon source={source} />
                    </div>
                </div>
            </div>
        </a>
    );
};

export default AggregatedGameCard;
