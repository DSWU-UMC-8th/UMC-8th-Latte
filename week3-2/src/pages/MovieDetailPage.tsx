import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Detail } from "../types/detail";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Cast } from "../types/credit";

export const MovieDetailPage = () => {
    const { movieId } = useParams();

    const [movie, setMovie] = useState<Detail>();
    const [credit, setCredit] = useState<Cast[]>([]);
    
    const [isPending, setIsPending] = useState(false); //로딩 상태
    const [isError, setIsError] = useState(false); //에러 상태 

    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);

            try{
                const { data } = await axios.get<Detail>( 
                    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                        }
                    }
                );

                const credit = await axios.get( 
                    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                        }
                    }
                );

                // console.log("credit", credit.data);
                
                setMovie(data);
                setCredit(credit.data.cast);

            } catch {
                setIsError(true);
            } finally { // 공통으로
                setIsPending(false); 
            }
        };

        fetchMovies();
    }, [movieId]);

    if(isError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }

    return (
        <>
            {isPending && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}
            
            <div>
                {!isPending && (
                    <div className="bg-black">
                        <div>
                            {movie && (
                                <div className="relative w-full h-[450px] overflow-hidden">
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
                                        alt={`${movie.title} 영화의 이미지`}
                                        className="size-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                    <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-6 mt-3">
                                        <h1 className="text-4xl font-bold">{movie.title}</h1>
                                        <h3 className="text-sm mt-4">평균 {movie.vote_average}</h3>
                                        <h3 className="text-sm mt-1">{movie.release_date}</h3>
                                        <h3 className="text-sm mt-1">{movie.runtime}분</h3>
                                        <h2 className="text-xl italic mt-5">{movie.tagline}</h2>
                                        <p className="text-sm text-left text-gray-200 mt-5 leading-relaxed w-150">{movie.overview}</p>
                                    </div>
                                </div>
                            )};
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl font-semibold mb-4 text-white">감독/출연</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 mt-10 lg:grid-cols-6 gap-6">
                                {credit.map((cast) => (
                                    <div key={cast.id} className="flex flex-col items-center text-center mb-5">
                                    {cast.profile_path === null ? (
                                        <div className="size-24 bg-gray-200 rounded-full"></div>
                                    ) : (
                                        <img
                                        src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                                        className="size-30 rounded-full object-cover border-1 border-white"
                                        alt="프로필 이미지"
                                        />
                                    )};
                                    <p className="text-m font-semibold text-white">{cast.name}</p>
                                    <p className="text-sm text-gray-400">{cast.character}</p>
                                </div>
                                ))}
                            </div>
                            </div>
                    </div>
                )};
            </div>
        </>
    );
};