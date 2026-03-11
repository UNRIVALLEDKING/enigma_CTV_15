"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const phrases = [
  "Establishing secure connection to 2035...",
  "Bypassing temporal firewalls...",
  "Loading future memories...",
  "Calibrating personality matrices...",
  "Syncing neural data...",
  "Accessing Global Archive 01...",
  "Decrypting life path probabilities...",
  "Compiling future career roadmap...",
];

export default function LoadingTerminal({ message = "Initializing Simulation..." }) {
  const [logs, setLogs] = useState([]);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] ${phrases[Math.floor(Math.random() * phrases.length)]}`;
      setLogs((prev) => [newLog, ...prev].slice(0, 5));
    }, 1500);

    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);

    return () => {
      clearInterval(logInterval);
      clearInterval(phraseInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#00040d]">
      {/* Background Scanning Animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="h-1 w-full bg-primary/30 blur-sm"
          animate={{ y: ["0%", "1000%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative flex w-full max-w-lg flex-col items-center px-6">
        {/* Main Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </motion.div>

        {/* Status Text */}
        <div className="mb-12 text-center">
          <motion.h2
            key={currentPhrase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl font-bold tracking-widest text-white"
          >
            {message}
          </motion.h2>
          <p className="mt-2 text-sm font-medium text-primary/60">
            Current Node: ARCHIVE_2035_ALPHA
          </p>
        </div>

        {/* Terminal Logs */}
        <div className="w-full space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-6 font-mono text-[10px] lowercase text-white/40 shadow-inner backdrop-blur-md">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={log + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3"
              >
                <div className="h-1 w-1 rounded-full bg-primary/40" />
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="mt-12 w-full max-w-[200px]">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-primary"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-white/20">
            Temporal Synchronization in Progress
          </p>
        </div>
      </div>
    </div>
  );
}
