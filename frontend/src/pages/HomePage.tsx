import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopular, getTrending, searchMovies } from "../services/movieApi";
import { MovieCard } from "../types";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [trending, setTrending] = useState<MovieCard[]>([]);
  const [popular, setPopular] = useState<MovieCard[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieCard[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    getTrending().then((data) => setTrending(data.slice(0, 6)));
    getPopular().then((data) => setPopular(data.slice(0, 6)));
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    const data = await searchMovies(query);
    setResults(data);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Background glow decorator */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Header Section */}
      <header className="relative mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Your Personal{" "}
            <span className="bg-gradient-to-r from-rose-500 via-accent-purple to-accent bg-clip-text text-transparent">
              Movie Mind
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-400 sm:text-lg max-w-xl leading-relaxed">
            Track watched films, rate your favorites, and let our custom Gemini model suggest your next cinema adventure.
          </p>
        </div>
        <div>
          {token ? (
            <Link
              className="inline-flex rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-950/40 hover:brightness-110 active:scale-[0.98] transition"
              to="/dashboard"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              className="inline-flex rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-950/40 hover:brightness-110 active:scale-[0.98] transition"
              to="/login"
            >
              Get Started
            </Link>
          )}
        </div>
      </header>

      {/* Glassmorphic Search Section */}
      <section className="relative z-10 mb-14 rounded-3xl border border-slate-800/80 bg-surface/60 p-6 backdrop-blur-md shadow-xl shadow-black/25">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSearch}
        >
          <div className="relative flex-1">
            <input
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-5 py-4 pl-12 text-slate-100 placeholder-slate-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/20"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for movies, genres, or actors..."
            />
            {/* Search Icon */}
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            className="rounded-2xl bg-accent px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
            type="submit"
          >
            Search
          </button>
        </form>
      </section>

      {/* Search Results */}
      {results.length > 0 && (
        <section className="mb-14 relative z-10">
          <h2 className="mb-6 text-3xl font-bold text-white flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-accent" />
            Search Results
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {results.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-surface shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-slate-800 hover:shadow-2xl hover:shadow-black/40"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950">
                  {movie.poster_path ? (
                    <img
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center text-sm font-semibold text-slate-500">
                      {movie.title}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-semibold text-slate-200 group-hover:text-white transition">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Section */}
      <section className="mb-14 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-rose-500" />
            Trending This Week
          </h2>
          <Link
            to="/search"
            className="text-sm font-semibold text-accent hover:text-cyan-400 transition"
          >
            Explore all &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {trending.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-surface shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-slate-800 hover:shadow-2xl hover:shadow-black/40"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950">
                {movie.poster_path ? (
                  <img
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center text-sm font-semibold text-slate-500">
                    {movie.title}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 font-semibold text-slate-200 group-hover:text-white transition">
                  {movie.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-accent-purple" />
            Popular Classics
          </h2>
          <Link
            to="/search"
            className="text-sm font-semibold text-accent hover:text-cyan-400 transition"
          >
            Browse more &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {popular.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-surface shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-slate-800 hover:shadow-2xl hover:shadow-black/40"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950">
                {movie.poster_path ? (
                  <img
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center text-sm font-semibold text-slate-500">
                    {movie.title}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 font-semibold text-slate-200 group-hover:text-white transition">
                  {movie.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
