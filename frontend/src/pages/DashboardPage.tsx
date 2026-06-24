import { useEffect, useState } from "react";
import { getProfileStats } from "../services/movieApi";

const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getProfileStats().then(setStats);
  }, []);

  if (!stats) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration glows */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl flex items-center gap-3 relative z-10">
        <span className="h-10 w-1.5 rounded-full bg-gradient-to-b from-rose-500 to-accent-purple" />
        Your Dashboard
      </h1>

      {/* Metrics Row */}
      <div className="mt-8 grid gap-6 md:grid-cols-3 relative z-10">
        {/* Total Watched */}
        <div className="group rounded-3xl border border-slate-800 bg-surface p-6 shadow-lg hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-[35px] rounded-full pointer-events-none transition group-hover:bg-rose-500/10" />
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
            <svg className="h-4 w-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Total watched
          </p>
          <p className="mt-5 text-6xl font-extrabold text-white tracking-tight font-display">
            {stats.totalWatched}
          </p>
        </div>

        {/* Average Rating */}
        <div className="group rounded-3xl border border-slate-800 bg-surface p-6 shadow-lg hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 blur-[35px] rounded-full pointer-events-none transition group-hover:bg-accent-gold/10" />
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
            <svg className="h-4 w-4 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.582 1.817l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.778-.57-.378-1.817.582-1.817h4.908a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
            Average rating
          </p>
          <p className="mt-5 text-6xl font-extrabold text-white tracking-tight font-display">
            {stats.averageRating ? Number(stats.averageRating).toFixed(1) : "0.0"}
          </p>
        </div>

        {/* Favorite Genres */}
        <div className="group rounded-3xl border border-slate-800 bg-surface p-6 shadow-lg hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-[35px] rounded-full pointer-events-none transition group-hover:bg-accent/10" />
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Favorite genres
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {stats.favoriteGenres.length ? (
              stats.favoriteGenres.slice(0, 3).map((genre: string) => (
                <span
                  key={genre}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-200"
                >
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500 py-1.5">No genres mapped yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Panels Grid */}
      <section className="mt-12 grid gap-6 lg:grid-cols-3 relative z-10">
        {/* Highest Rated */}
        <div className="rounded-3xl border border-slate-800 bg-surface p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Highest Rated
          </h2>
          <div className="mt-5 space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {stats.highestRated.length ? (
              stats.highestRated.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4 transition hover:border-slate-800">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm text-slate-200 line-clamp-1">{item.title}</span>
                    <span className="text-xs font-bold text-accent-gold whitespace-nowrap bg-accent-gold/10 px-2.5 py-1 rounded-lg">
                      ★ {item.rating}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Rate movies to see favorites.</p>
            )}
          </div>
        </div>

        {/* Your Ratings */}
        <div className="rounded-3xl border border-slate-800 bg-surface p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-purple" />
            All Ratings
          </h2>
          <div className="mt-5 space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {stats.ratedMovies.length ? (
              stats.ratedMovies.map((item: any) => (
                <div
                  key={`${item.tmdbId}-${item.rating}`}
                  className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4 transition hover:border-slate-800"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm text-slate-200 line-clamp-1">{item.title}</span>
                    <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800/80 px-2 py-1 rounded-lg">
                      {item.rating}/10
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Rate watched movies to populate this list.
              </p>
            )}
          </div>
        </div>

        {/* Recently Watched */}
        <div className="rounded-3xl border border-slate-800 bg-surface p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Recently Watched
          </h2>
          <div className="mt-5 space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {stats.recentlyWatched.length ? (
              stats.recentlyWatched.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4 transition hover:border-slate-800">
                  <p className="font-semibold text-sm text-slate-200 line-clamp-1">{item.title}</p>
                  <p className="mt-1 text-xxs text-slate-500">
                    Watched on {new Date(item.watchedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Add watched movies to populate this panel.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
