import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieDetails,
  addWatchedMovie,
  removeWatchedMovie,
  getWatchedMovies,
  getRatings,
  rateMovie,
} from "../services/movieApi";
import { useAuth } from "../context/AuthContext";

const MovieDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [movie, setMovie] = useState<any>(null);
  const [rating, setRating] = useState(8);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isWatched, setIsWatched] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (!id) return;

    getMovieDetails(id).then(setMovie);
  }, [id]);

  useEffect(() => {
    if (!token || !movie) return;

    Promise.all([getWatchedMovies(), getRatings()])
      .then(([watched, ratings]) => {
        setIsWatched(watched.some((item: any) => item.tmdbId === movie.id));
        const existingRating = ratings.find(
          (item: any) => item.tmdbId === movie.id,
        );
        if (existingRating) {
          setUserRating(existingRating.rating);
          setRating(existingRating.rating);
        }
      })
      .catch((error) => {
        console.error("Failed to load watch/rating state", error);
      });
  }, [movie, token]);

  if (!movie) {
    return <div className="p-6">Loading movie details...</div>;
  }

  const handleToggleWatched = async () => {
    if (loadingState) return;

    setLoadingState(true);
    try {
      if (isWatched) {
        await removeWatchedMovie(movie.id);
        setIsWatched(false);
        setMessage("Removed from watched list.");
      } else {
        await addWatchedMovie({
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        });
        setIsWatched(true);
        setMessage("Marked as watched.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        isWatched
          ? "Unable to remove from watched."
          : "Unable to add to watched list.",
      );
    } finally {
      setLoadingState(false);
    }
  };

  const handleRating = async () => {
    if (!isWatched) {
      setMessage("You must mark this movie as watched before rating it.");
      return;
    }

    try {
      await rateMovie({ tmdbId: movie.id, rating });
      setUserRating(rating);
      setMessage("Rating saved.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to save rating.");
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="grid gap-10 lg:grid-cols-[340px_1fr] relative z-10">
        {/* Left Column: Movie Poster */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl">
          {movie.poster_path ? (
            <img
              className="w-full rounded-xl object-cover shadow-inner transition duration-500 group-hover:scale-[1.01]"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center bg-slate-900 text-slate-500">
              No Poster Available
            </div>
          )}
          {movie.vote_average && (
            <span className="absolute right-6 top-6 rounded-full bg-slate-950/90 border border-slate-800 px-3.5 py-1.5 text-sm font-bold text-accent-gold backdrop-blur-sm shadow-lg">
              ★ {Number(movie.vote_average).toFixed(1)}
            </span>
          )}
        </div>

        {/* Right Column: Details & Interaction */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {movie.release_date && (
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <>
                  <span className="text-slate-700">•</span>
                  <span className="text-sm font-semibold text-slate-400">
                    {movie.runtime} min
                  </span>
                </>
              )}
            </div>
            
            <h1 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight">
              {movie.title}
            </h1>
            
            <p className="mt-5 text-base text-slate-300 leading-relaxed max-w-3xl">
              {movie.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {movie.genres?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="rounded-xl border border-slate-800 bg-surface px-4.5 py-1.5 text-xs font-semibold text-slate-300 shadow-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Watchlist toggle panel */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleToggleWatched}
                disabled={loadingState}
                className={`w-full rounded-2xl py-4 font-bold text-white shadow-xl transition-all duration-300 active:scale-[0.98] ${
                  isWatched
                    ? "bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-750 text-slate-200"
                    : "bg-gradient-to-r from-rose-500 to-rose-600 hover:brightness-110 shadow-rose-950/20"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isWatched ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    )}
                  </svg>
                  {isWatched ? "Remove from Watched" : "Mark as Watched"}
                </span>
              </button>

              {message && (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm font-medium text-accent flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  {message}
                </div>
              )}

              {/* Dynamic stats details */}
              <div className="grid gap-4 grid-cols-2 mt-2">
                <div className="rounded-2xl border border-slate-900 bg-surface/60 p-4 shadow-md backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    Runtime
                  </p>
                  <p className="mt-1.5 text-lg font-bold text-slate-200">
                    {movie.runtime ? `${movie.runtime} mins` : "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-900 bg-surface/60 p-4 shadow-md backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    TMDB Score
                  </p>
                  <p className="mt-1.5 text-lg font-bold text-slate-200">
                    {movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating card */}
            <div className="rounded-3xl border border-slate-800/80 bg-surface p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Your Rating
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white">
                      {rating}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">/ 10</span>
                  </div>
                  {userRating !== null && (
                    <p className="mt-1 text-xs text-slate-400">
                      Saved rating: <span className="font-semibold text-accent-gold">{userRating}★</span>
                    </p>
                  )}
                </div>
                <span className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                  isWatched
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-slate-800 text-slate-400 border border-slate-700/50"
                }`}>
                  {isWatched ? "Unlocked" : "Locked"}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-900">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase tracking-widest">Slider Controller</span>
                  <span className="font-bold text-slate-200">{rating} ★</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  disabled={!isWatched}
                  className="w-full accent-accent disabled:opacity-35"
                />
              </div>

              <button
                onClick={handleRating}
                disabled={!isWatched}
                className="mt-5 w-full rounded-2xl bg-accent px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-accent/10 transition duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
              >
                Save Rating
              </button>
              {!isWatched && (
                <p className="mt-3.5 text-center text-xs text-slate-500 leading-relaxed">
                  Mark this movie as watched first to unlock the rating slider.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
