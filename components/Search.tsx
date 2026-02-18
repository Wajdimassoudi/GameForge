
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchResult } from '../types';
import { getGames, getMobileGames } from '../services/api';

interface SearchProps {
    /** Function to navigate to a specific PC game's detail page. */
    onSelectGame: (id: number) => void;
}

/**
 * An icon for the search input.
 */
const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

/**
 * A professional, real-time search component that queries both PC and Mobile game APIs.
 */
const Search: React.FC<SearchProps> = ({ onSelectGame }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounced search effect
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const performSearch = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }
            setLoading(true);
            setIsOpen(true);

            try {
                const [pcGames, mobileGamesData] = await Promise.all([
                    getGames(),
                    getMobileGames({ q: `${query} in:name,description`, per_page: '5' })
                ]);

                if (signal.aborted) return;

                const filteredPcGames: SearchResult[] = pcGames
                    .filter(game => game.title.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 5)
                    .map(game => ({ ...game, resultType: 'pc' }));

                const filteredMobileGames: SearchResult[] = mobileGamesData.items
                    .map(game => ({ ...game, resultType: 'mobile' }));
                
                setResults([...filteredPcGames, ...filteredMobileGames]);

            } catch (error) {
                if (!signal.aborted) {
                    console.error("Search failed:", error);
                    setResults([]);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        const timeoutId = setTimeout(performSearch, 300);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [query]);

    // Effect to handle closing the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        if (result.resultType === 'pc') {
            onSelectGame(result.id);
        }
    };

    return (
        <div className="relative" ref={searchContainerRef}>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search for any game..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length > 1 && setIsOpen(true)}
                    className="w-full bg-gray-700 text-white p-2 pl-10 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400">Searching...</div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map(result => (
                                <li key={`${result.resultType}-${result.id}`}>
                                    {result.resultType === 'pc' ? (
                                        <button onClick={() => handleSelect(result)} className="w-full text-left flex items-center p-3 hover:bg-cyan-500/20 transition-colors">
                                            <img src={result.thumbnail} alt={result.title} className="w-16 h-10 object-cover rounded mr-4" />
                                            <div className="flex-grow">
                                                <p className="font-bold text-white">{result.title}</p>
                                                <p className="text-sm text-gray-400">{result.platform}</p>
                                            </div>
                                        </button>
                                    ) : (
                                        <a href={result.html_url} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="w-full text-left flex items-center p-3 hover:bg-cyan-500/20 transition-colors">
                                            <img src={result.owner.avatar_url} alt={result.name} className="w-16 h-10 object-contain rounded mr-4" />
                                            <div className="flex-grow">
                                                <p className="font-bold text-white">{result.name}</p>
                                                <p className="text-sm text-gray-400">Mobile (GitHub)</p>
                                            </div>
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-400">No games found for "{query}".</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
