import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MovieCard } from "../types";
import { searchMovies, getPopular } from "../services/movieApi";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieCard[]>([]);
  const [popular, setPopular] = useState<MovieCard[]>([]);

  useEffect(() => {
    getPopular().then((data) => setPopular(data.slice(0, 12)));
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const movies = await searchMovies(query);
    setResults(movies);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Glassmorphic Search Block */}
      <div className="relative z-10 mb-12 rounded-3xl border border-slate-800/80 bg-surface/60 p-6 backdrop-blur-md shadow-xl shadow-black/25">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSearch}
        >
          <div className="relative flex-1">
            <input
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-5 py-4 pl-12 text-slate-100 placeholder-slate-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/20"
              placeholder="Search for movies, actors, directors..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
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
      </div>

      {/* Results Grid */}
      {results.length > 0 && (
        <section className="mb-14 relative z-10 animate-fade-in">
          <h2 className="mb-6 text-3xl font-bold text-white flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-accent" />
            Search Results
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
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

      {/* Popular Section */}
      <section className="relative z-10">
        <h2 className="mb-6 text-3xl font-bold text-white flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-accent-purple" />
          Popular Right Now
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
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

export default SearchPage;
