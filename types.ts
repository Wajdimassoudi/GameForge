
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

/**
 * Represents an open-source mobile game repository from the GitHub API.
 */
export interface MobileGame {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
    description: string;
    stargazers_count: number;
    language: string;
    topics: string[];
}
  
/**
 * Represents the structure of the response from the GitHub API's repository search endpoint.
 */
export interface GithubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: MobileGame[];
}
