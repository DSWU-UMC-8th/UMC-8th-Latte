import { useState, useEffect } from "react";
import { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';


const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
    const fetchMovies = async () => {
        // 응답에 대한 타입을 정의해줍니다.
        const { data } = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`,
        {
            headers: {
            Authorization: `Bearer 토큰값`,
            },
        }
        );

        setMovies(data.results);
    };

    fetchMovies();
    }, []);

    return (
        <ul>
        {/* 옵셔널 체인 활용 */}
        {movies?.map((movie) => (
            <li key={movie.id}>
            <h1>{movie.title}</h1>
            </li>
        ))}
        </ul>
    );
};

export default MoviesPage;






// import { useParams } from 'react-router-dom';

// // movies.tsx
// const MoviesPage = () => {
//     const params = useParams();
    
//     console.log(params);
    
//     return <h1>{params.movieId}번의 Movies Page 야호~!</h1>;
// };

// export default MoviesPage;