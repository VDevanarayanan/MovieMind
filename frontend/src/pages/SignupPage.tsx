import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { setAuthToken } from "../services/api";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        password,
      });
      const { token } = response.data;
      setAuthToken(token);
      login(token, email);
      navigate("/dashboard");
    } catch (err) {
      setError("Unable to create account. Please check your details.");
    }
  };

  return (
    <div className="relative mx-auto max-w-md px-4 py-20 z-10">
      {/* Background glowing blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative rounded-3xl border border-slate-800/80 bg-surface/80 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-6 text-3xl font-extrabold text-white tracking-tight">
          Create Account
        </h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <input
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/10"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <input
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/10"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <input
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/10"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && (
            <div className="rounded-xl border border-red-950/80 bg-red-950/20 px-4 py-2.5 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}
          <button
            className="mt-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 py-3.5 font-bold text-white shadow-xl shadow-rose-950/30 hover:brightness-110 active:scale-[0.98] transition"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link className="font-semibold text-accent hover:text-cyan-400 transition" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
