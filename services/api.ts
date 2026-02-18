
import { Game, GameDetails, Giveaway, GithubSearchResponse } from '../types';

// API base URLs
const FREETOGAME_API_BASE = 'https://www.freetogame.com/api';
const GAMERPOWER_API_BASE = 'https://www.gamerpower.com/api';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Our own API proxy endpoint, running as a Vercel Serverless Function.
 * This is the robust solution to avoid CORS issues on deployed environments.
 */
const API_PROXY = '/api/proxy';


/**
 * A generic data fetching function to handle API requests via our own proxy.
 * This function now sends requests to our serverless function, which then fetches the data.
 * @param url The target API endpoint to fetch data from.
 * @returns A promise that resolves to the fetched data.
 */
const fetchData = async <T,>(url: string): Promise<T> => {
    try {
        // We pass the target URL as a query parameter to our proxy.
        const proxyUrl = `${API_PROXY}?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            // If our proxy returns an error, we try to parse the message it provides.
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json() as T;
    } catch (error) {
        console.error("API call failed via proxy:", url, error);
        // Re-throw the refined error to be handled by the calling component.
        throw error;
    }
};

/**
 * Fetches a list of games from the FreeToGame API.
 * @param params An object of query parameters (e.g., { platform: 'pc', 'sort-by': 'popularity' }).
 * @returns A promise that resolves to an array of Game objects.
 */
export const getGames = (params: { [key:string]: string } = {}): Promise<Game[]> => {
    const query = new URLSearchParams(params).toString();
    return fetchData<Game[]>(`${FREETOGAME_API_BASE}/games?${query}`);
};

/**
 * Fetches detailed information for a specific game by its ID.
 * @param id The unique identifier for the game.
 * @returns A promise that resolves to a GameDetails object.
 */
export const getGameDetails = (id: number): Promise<GameDetails> => {
    return fetchData<GameDetails>(`${FREETOGAME_API_BASE}/game?id=${id}`);
};

/**
 * Fetches a list of game giveaways from the GamerPower API.
 * @param params An object of query parameters (e.g., { type: 'game' }).
 * @returns A promise that resolves to an array of Giveaway objects.
 */
export const getGiveaways = (params: { [key:string]: string } = {}): Promise<Giveaway[]> => {
    const query = new URLSearchParams(params).toString();
    return fetchData<Giveaway[]>(`${GAMERPOWER_API_BASE}/giveaways?${query}`);
};

/**
 * Fetches a list of open-source mobile games from the GitHub API.
 * @param params An object of query parameters (e.g., { q: 'android game', sort: 'stars' }).
 * @returns A promise that resolves to a GithubSearchResponse object.
 */
export const getMobileGames = (params: { [key:string]: string } = {}): Promise<GithubSearchResponse> => {
    const query = new URLSearchParams(params).toString();
    return fetchData<GithubSearchResponse>(`${GITHUB_API_BASE}/search/repositories?${query}`);
};
