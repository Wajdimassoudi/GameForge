
import { Game, GameDetails, Giveaway } from '../types';

// API base URLs
const FREETOGAME_API_BASE = 'https://www.freetogame.com/api';
const GAMERPOWER_API_BASE = 'https://www.gamerpower.com/api';

/**
 * A reliable CORS proxy to bypass browser restrictions when calling APIs directly from the client.
 * NOTE: For a production application, it is highly recommended to build your own server-side proxy
 * for better performance, security, and to avoid reliance on third-party services.
 */
const PROXY_URL = 'https://api.allorigins.win/raw?url=';


/**
 * A generic data fetching function to handle API requests.
 * It uses a proxy to prevent CORS errors and includes error handling.
 * @param url The API endpoint to fetch data from.
 * @returns A promise that resolves to the fetched data.
 */
const fetchData = async <T,>(url: string): Promise<T> => {
    try {
        // We must encode the target URL for the proxy to work correctly.
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
        
        if (!response.ok) {
            // If the proxy or the API server returns an error, we throw an error.
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as T;
    } catch (error) {
        console.error("API call failed:", url, error);
        // Re-throw the error to be handled by the calling component.
        throw error;
    }
};

/**
 * Fetches a list of games from the FreeToGame API.
 * @param params An object of query parameters (e.g., { platform: 'pc', 'sort-by': 'popularity' }).
 * @returns A promise that resolves to an array of Game objects.
 */
export const getGames = (params: { [key: string]: string } = {}): Promise<Game[]> => {
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
export const getGiveaways = (params: { [key: string]: string } = {}): Promise<Giveaway[]> => {
    const query = new URLSearchParams(params).toString();
    return fetchData<Giveaway[]>(`${GAMERPOWER_API_BASE}/giveaways?${query}`);
};
