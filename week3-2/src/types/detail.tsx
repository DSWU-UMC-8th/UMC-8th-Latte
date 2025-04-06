type Genre = {
    id: number;
    name: string;
};

type ProductionCompany = {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
};

type ProductionCountry = {
    iso_3166_1: string;
    name: string;
};

type SpokenLanguage = {
    iso_639_1: string;
    name: string;
};

export type Detail = {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: null;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};