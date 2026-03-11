"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, User, ShieldCheck, Eye, EyeOff, Copy, Check } from "lucide-react";
import WelcomeScreen from "@/components/WelcomeScreen";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("futureTwinAuth");
    if (auth === "true") setIsLoggedIn(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "timetraveller" && password === "timetraveller") {
      localStorage.setItem("futureTwinAuth", "true");
      setIsLoggedIn(true);
      setShowLogin(false);
    } else {
      setError("Invalid temporal credentials.");
    }
  };

  const copyCreds = () => {
    navigator.clipboard.writeText("timetraveller");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoggedIn) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass futuristic-glow w-full max-w-md rounded-3xl p-10 text-center"
      >
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>

        <h1 className="neon-text mb-2 text-3xl font-bold">FutureTwin Terminal</h1>
        <p className="mb-10 text-sm text-white/40 uppercase tracking-widest text-[10px]">Access Restricted to Authorized Personnel</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-white focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-black transition-all hover:scale-[1.02] hover:bg-white active:scale-95"
          >
            Initiate Link
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <button
          onClick={copyCreds}
          className="mt-8 group flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl hover:bg-white/5 transition-all outline-none"
        >
          <div className="text-[10px] text-white/20 tracking-[0.2em] group-hover:text-primary transition-colors uppercase">
            {copied ? "Access Codes Copied" : "Demo: timetraveller / timetraveller"}
          </div>
          {copied ? (
            <Check className="h-3 w-3 text-primary animate-in fade-in scale-in" />
          ) : (
            <Copy className="h-3 w-3 text-white/20 group-hover:text-primary transition-colors" />
          )}
        </button>
      </motion.div>
    </div>
  );
}
