
import React, { useState, useEffect, useCallback } from 'react';
import { Game, Giveaway } from './types';
import { getGames, getGiveaways } from './services/api';
import Header from './components/Header';
import GiveawayCarousel from './components/GiveawayCarousel';
import GameCard from './components/GameCard';
import GameDetailView from './components/GameDetailView';
import Loading from './components/Loading';
import Footer from './components/Footer';
import Pagination from './components/Pagination';

/**
 * Defines the possible views (pages) in the application.
 */
type View = 'home' | 'game-details' | 'all-games' | 'all-giveaways';

/**
 * The root component of the GameForge application.
 * It manages the current view and navigation state.
 */
const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

    /**
     * Handles clicking on a game card, switching to the detail view.
     * @param id The ID of the selected game.
     */
    const handleSelectGame = (id: number) => {
        setSelectedGameId(id);
        setView('game-details');
        window.scrollTo(0, 0);
    };

    /**
     * Handles returning from the game detail view to the previous or home view.
     */
    const handleBack = () => {
        setView('all-games'); // Go back to the list view by default
        setSelectedGameId(null);
    };
    
    /**
     * Renders the component corresponding to the current view state.
     */
    const renderView = () => {
        switch (view) {
            case 'game-details':
                return selectedGameId ? <GameDetailView gameId={selectedGameId} onBack={handleBack} /> : <HomePage onSelectGame={handleSelectGame} setView={setView} />;
            case 'all-games':
                return <GameListView onSelectGame={handleSelectGame} />;
            case 'all-giveaways':
                return <GiveawayListView />;
            case 'home':
            default:
                return <HomePage onSelectGame={handleSelectGame} setView={setView}/>;
        }
    };

    return (
        <div className="min-h-screen bg-transparent font-sans">
            <Header setView={setView} />
            <main className="container mx-auto px-4 py-8">
                <div key={view} className="animate-fade-in">
                    {renderView()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

/**
 * A stunning hero section for the homepage to welcome users.
 */
const Hero: React.FC = () => {
    return (
        <section className="text-center py-16 md:py-20 mb-16 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in">
                Welcome to <span className="text-cyan-400">GameForge</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Discover the best free-to-play games and never miss out on exclusive giveaways. Your next adventure starts here.
            </p>
        </section>
    );
};


interface HomePageProps {
    onSelectGame: (id: number) => void;
    setView: (view: View) => void;
}

/**
 * The main homepage component, displaying a hero, featured giveaways, and popular games.
 */
const HomePage: React.FC<HomePageProps> = ({ onSelectGame, setView }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            setLoading(true);
            try {
                const [gamesData, giveawaysData] = await Promise.all([
                    getGames({ 'sort-by': 'popularity' }),
                    getGiveaways({ type: 'game' })
                ]);
                setGames(gamesData.slice(0, 12));
                setGiveaways(giveawaysData.slice(0, 10));
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomePageData();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <Hero />
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-cyan-400">Featured Giveaways</h2>
                <GiveawayCarousel giveaways={giveaways} />
            </section>

            <section>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-cyan-400">Popular Games</h2>
                    <button 
                        onClick={() => setView('all-games')}
                        className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-300">
                        View All
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map(game => (
                        <GameCard key={game.id} game={game} onSelectGame={onSelectGame} />
                    ))}
                </div>
            </section>
        </>
    );
};

/**
 * Renders a filterable and paginated list of all free-to-play games.
 */
const GameListView: React.FC<{ onSelectGame: (id: number) => void }> = ({ onSelectGame }) => {
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [platform, setPlatform] = useState('all');
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [sortBy, setSortBy] = useState('relevance');
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 12;

    const fetchGamesData = useCallback(async () => {
        setLoading(true);
        try {
            const params: { [key: string]: string } = { 'sort-by': sortBy };
            if (platform !== 'all') params.platform = platform;
            if (category) params.category = category;
            
            const gamesData = await getGames(params);
            setAllGames(gamesData);
            setCurrentPage(1); // Reset to first page on new filter
        } catch (error) {
            console.error("Error fetching games:", error);
            setAllGames([]);
        } finally {
            setLoading(false);
        }
    }, [platform, category, sortBy]);

    useEffect(() => {
        fetchGamesData();
    }, [fetchGamesData]);
    
    const categories = ["mmorpg", "shooter", "strategy", "moba", "racing", "sports", "social", "sandbox", "open-world", "survival", "pve", "pvp", "sci-fi", "fantasy", "card"];

    // Pagination logic
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(allGames.length / gamesPerPage);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-cyan-400">All Free-to-Play Games</h1>
            <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-lg mb-8 flex flex-wrap gap-4 items-center">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="all">All Platforms</option>
                    <option value="pc">PC (Windows)</option>
                    <option value="browser">Browser (Web)</option>
                </select>
                <select value={category || ''} onChange={(e) => setCategory(e.target.value || undefined)} className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                    <option value="relevance">Relevance</option>
                    <option value="popularity">Popularity</option>
                    <option value="release-date">Release Date</option>
                    <option value="alphabetical">Alphabetical</option>
                </select>
            </div>
            {loading ? <Loading /> : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentGames.length > 0 ? currentGames.map(game => (
                            <GameCard key={game.id} game={game} onSelectGame={onSelectGame} />
                        )) : (
                            <p className="col-span-full text-center text-gray-400">No games found with the selected filters.</p>
                        )}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};

/**
 * Displays a list of all current game giveaways.
 */
const GiveawayListView: React.FC = () => {
    const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGiveaways = async () => {
            setLoading(true);
            try {
                const giveawaysData = await getGiveaways();
                setGiveaways(giveawaysData);
            } catch (error) {
                console.error("Error fetching giveaways:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGiveaways();
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-cyan-400">Current Giveaways</h1>
            {loading ? <Loading /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {giveaways.map(giveaway => (
                         <div key={giveaway.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:ring-2 hover:ring-cyan-500 transition-all duration-300 flex flex-col">
                            <img src={giveaway.image} alt={giveaway.title} className="w-full h-48 object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2">{giveaway.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{giveaway.description}</p>
                                <div className="text-sm text-gray-300 mb-4">
                                    <p><span className="font-semibold text-cyan-400">Platforms:</span> {giveaway.platforms}</p>
                                    <p><span className="font-semibold text-cyan-400">Value:</span> {giveaway.worth}</p>
                                </div>
                                <a href={giveaway.open_giveaway_url} target="_blank" rel="noopener noreferrer" className="mt-auto text-center bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-300">
                                    Claim Now
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
