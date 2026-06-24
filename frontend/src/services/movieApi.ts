import api from './api';

export const searchMovies = async (query: string) => {
  const response = await api.get('/movies/search', { params: { q: query } });
  return response.data.results;
};

export const getTrending = async () => {
  const response = await api.get('/movies/trending');
  return response.data.results;
};

export const getPopular = async () => {
  const response = await api.get('/movies/popular');
  return response.data.results;
};

export const getMovieDetails = async (id: string) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const addWatchedMovie = async (payload: { tmdbId: number; title: string; poster?: string }) => {
  const response = await api.post('/watched', payload);
  return response.data;
};

export const removeWatchedMovie = async (tmdbId: number) => {
  const response = await api.delete(`/watched/${tmdbId}`);
  return response.data;
};

export const getWatchedMovies = async () => {
  const response = await api.get('/watched');
  return response.data;
};

export const rateMovie = async (payload: { tmdbId: number; rating: number }) => {
  const response = await api.post('/ratings', payload);
  return response.data;
};

export const getRatings = async () => {
  const response = await api.get('/ratings');
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const getProfileStats = async () => {
  const response = await api.get('/profile/stats');
  return response.data;
};
