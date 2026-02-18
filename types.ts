
/**
 * Represents the basic information for a single game from the FreeToGame API.
 */
export interface Game {
    id: number;
    title: string;
    thumbnail: string;
    short_description: string;
    game_url: string;
    genre: string;
    platform: string;
    publisher: string;
    developer: string;
    release_date: string;
    freetogame_profile_url: string;
}

/**
 * Represents the detailed information for a single game, extending the basic Game interface.
 */
export interface GameDetails extends Game {
    description: string;
    minimum_system_requirements?: {
        os: string;
        processor: string;
        memory: string;
        graphics: string;
        storage: string;
    };
    screenshots: {
        id: number;
        image: string;
    }[];
}

/**
 * Represents a single game giveaway from the GamerPower API.
 */
export interface Giveaway {
    id: number;
    title: string;
    worth: string;
    thumbnail: string;
    image: string;
    description: string;
    instructions: string;
    open_giveaway_url: string;
    published_date: string;
    type: string;
    platforms: string;
    end_date: string;
    users: number;
    status: string;
    gamerpower_url: string;
    open_giveaway: string;
}
