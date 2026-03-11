"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WelcomeScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass futuristic-glow max-w-2xl rounded-3xl p-12"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="neon-text mb-6 text-5xl font-bold tracking-tight md:text-7xl"
        >
          Meet Your Future Self – 2035
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-10 text-lg text-white/70 md:text-xl"
        >
          Explore how your choices today can shape your life in 2035.
          Step into the time machine of artificial intelligence.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link
            href="/onboarding"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:bg-white active:scale-95"
          >
            Start Journey
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("futureTwinAuth");
              localStorage.removeItem("futureTwinProfile");
              localStorage.removeItem("futureTwinUserId");
              window.location.reload();
            }}
            className="mt-4 text-xs tracking-widest text-white/30 hover:text-white/60 transition-colors uppercase"
          >
            Logout & Clear Persona
          </button>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 text-sm uppercase tracking-widest text-white/30"
      >
        Powered by Google Gemini & Enigma Engine
      </motion.div>
    </div>
  );
}
