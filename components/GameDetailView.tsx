
import React, { useState, useEffect } from 'react';
import { GameDetails } from '../types';
import { getGameDetails } from '../services/api';
import Loading from './Loading';

interface GameDetailViewProps {
    /** The ID of the game to display details for. */
    gameId: number;
    /** A callback function to go back to the previous view. */
    onBack: () => void;
}

/**
 * A component that displays detailed information about a single game.
 * It fetches data based on the provided gameId.
 */
const GameDetailView: React.FC<GameDetailViewProps> = ({ gameId, onBack }) => {
    const [game, setGame] = useState<GameDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const details = await getGameDetails(gameId);
                setGame(details);
            } catch (err) {
                setError("Failed to load game details. The game may not be available or the API is down.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [gameId]);

    // Conditional rendering based on the component's state
    if (loading) return <Loading />;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (!game) return <div className="text-center text-gray-500 py-10">Game not found.</div>;

    return (
        <div>
            <button onClick={onBack} className="mb-8 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Games
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column: Thumbnail and quick facts */}
                <div className="lg:col-span-1">
                    <img src={game.thumbnail} alt={game.title} className="rounded-lg shadow-xl w-full mb-4" />
                    <a href={game.game_url} target="_blank" rel="noopener noreferrer" className="mb-4 block w-full text-center bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-300">
                        Play Now
                    </a>
                    <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-xl font-bold mb-3 border-b border-gray-700 pb-2">Quick Facts</h3>
                        <p className="mt-2"><strong className="text-cyan-400">Genre:</strong> {game.genre}</p>
                        <p className="mt-2"><strong className="text-cyan-400">Platform:</strong> {game.platform}</p>
                        <p className="mt-2"><strong className="text-cyan-400">Publisher:</strong> {game.publisher}</p>
                        <p className="mt-2"><strong className="text-cyan-400">Developer:</strong> {game.developer}</p>
                        <p className="mt-2"><strong className="text-cyan-400">Release Date:</strong> {game.release_date}</p>
                    </div>
                </div>

                {/* Right column: Title, description, screenshots, and system requirements */}
                <div className="lg:col-span-2">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">{game.title}</h1>
                    <div className="prose prose-invert max-w-none text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: game.description }}></div>
                    
                    {game.screenshots && game.screenshots.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-4 text-cyan-400">Screenshots</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {game.screenshots.map(ss => (
                                    <img key={ss.id} src={ss.image} alt="Screenshot" className="rounded-lg shadow-md" />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {game.minimum_system_requirements && (
                         <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Minimum System Requirements</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                <li><strong>OS:</strong> {game.minimum_system_requirements.os}</li>
                                <li><strong>Processor:</strong> {game.minimum_system_requirements.processor}</li>
                                <li><strong>Memory:</strong> {game.minimum_system_requirements.memory}</li>
                                <li><strong>Graphics:</strong> {game.minimum_system_requirements.graphics}</li>
                                <li><strong>Storage:</strong> {game.minimum_system_requirements.storage}</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetailView;
