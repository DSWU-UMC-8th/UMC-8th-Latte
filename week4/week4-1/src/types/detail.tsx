import { BaseMovie } from "./movie";

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

type BelongsToCollection = {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
};

export type MovieDetailResponse = BaseMovie & {
    belongs_to_collection: BelongsToCollection;
    budget: number;
    genres: Genre[];
    homepage: string;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
};