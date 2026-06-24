import { fetchMovieDetails, fetchPopularMovies, fetchTrendingMovies, searchMovies } from '../utils/tmdb';

export const searchMovieCatalog = async (query: string) => {
  return searchMovies(query);
};

export const getTrendingMovies = async () => {
  return fetchTrendingMovies();
};

export const getPopularMovies = async () => {
  return fetchPopularMovies();
};

export const getMovieDetail = async (tmdbId: number) => {
  return fetchMovieDetails(tmdbId);
};
