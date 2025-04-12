import { useState } from "react";
import { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage() {

    const [page, setPage] = useState(1); // 페이지네이션 
    const { category } = useParams<{
        category: string;
    }>();

    const url = `https://api.themoviedb.org/3/movie/${category}?page=${page}`;

    const { 
        data: movies, 
        isPending, 
        isError 
    } = useCustomFetch<MovieResponse>(url, 'ko-KR');

    // console.log(movies);

    if(isError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }
    
    return(
        <>
            <div className="flex items-center justify-center gap-6 mt-5">
                <button
                    className="bg-[#D76C82] text-white px-6 py-3 rounded-lg shadow-md 
                        hover:bg-[#EBE8DB] hover:text-[#D76C82] transition-all
                        duration-500 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev-1)}
                >
                    {'<'}
                </button>
                <span>{page} 페이지</span>
                <button
                    className="bg-[#D76C82] text-white px-6 py-3 rounded-lg shadow-md 
                    hover:bg-[#EBE8DB] hover:text-[#D76C82] transition-all
                    duration-500 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
                    onClick={() => setPage((prev) => prev+1)}
                >
                    {'>'}
                </button>
            </div>

            {isPending && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}

            {!isPending && (
                <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
                lg:grid-cols-5 xl:grid-cols-6 x">
                    {movies?.results.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>
    )
}