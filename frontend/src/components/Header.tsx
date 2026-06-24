import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition duration-200 py-1 ${
      isActive
        ? "text-accent"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-background/80 backdrop-blur-md px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="bg-gradient-to-r from-rose-500 to-accent bg-clip-text text-2xl font-bold tracking-tight text-transparent transition group-hover:opacity-90">
            MovieMind AI
          </span>
          <span className="rounded-md bg-accent-purple/20 px-2 py-0.5 text-xxs font-semibold uppercase tracking-wider text-accent-purple border border-accent-purple/30">
            Beta
          </span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-6">
          <NavLink className={navLinkClass} to="/">
            Home
          </NavLink>
          <NavLink className={navLinkClass} to="/search">
            Search
          </NavLink>
          {token ? (
            <>
              <NavLink className={navLinkClass} to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink className={navLinkClass} to="/recommendations">
                AI Picks
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-950/40 hover:brightness-110 active:scale-[0.98] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-950/40 hover:brightness-110 active:scale-[0.98] transition"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="hidden sm:inline-block rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition"
                to="/signup"
              >
                Signup
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
