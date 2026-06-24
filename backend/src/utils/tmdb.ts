import axios from 'axios';
import { config } from '../config';
import { getCache, setCache } from './cache';

const client = axios.create({
  baseURL: config.tmdbBaseUrl,
  params: {
    api_key: config.tmdbApiKey,
    language: 'en-US',
  },
});

export const searchMovies = async (query: string) => {
  const cacheKey = `tmdb:search:${query.trim().toLowerCase()}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const response = await client.get('/search/movie', { params: { query, include_adult: false } });
  await setCache(cacheKey, response.data, 900); // 15 mins
  return response.data;
};

export const fetchTrendingMovies = async () => {
  const cacheKey = 'tmdb:movies:trending';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const response = await client.get('/trending/movie/week');
  await setCache(cacheKey, response.data, 3600); // 1 hour
  return response.data;
};

export const fetchPopularMovies = async () => {
  const cacheKey = 'tmdb:movies:popular';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const response = await client.get('/movie/popular');
  await setCache(cacheKey, response.data, 3600); // 1 hour
  return response.data;
};

export const fetchMovieDetails = async (tmdbId: number) => {
  const cacheKey = `tmdb:movie:detail:${tmdbId}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const response = await client.get(`/movie/${tmdbId}`, { params: { append_to_response: 'credits' } });
  await setCache(cacheKey, response.data, 86400); // 24 hours
  return response.data;
};
