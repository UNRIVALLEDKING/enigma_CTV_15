"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Calendar, Database } from "lucide-react";
import Link from "next/link";
import LoadingTerminal from "@/components/LoadingTerminal";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("futureTwinProfile");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      
      // Check for cached timeline for THIS specific persona
      const cacheKey = `timeline_${p.name}_${p.age}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        setTimeline(JSON.parse(cachedData));
        setIsCached(true);
        setIsLoading(false);
      } else {
        generateTimeline(p, cacheKey);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const generateTimeline = async (p, cacheKey) => {
    try {
      const res = await fetch("/api/timeline", {
        method: "POST",
        body: JSON.stringify({ profile: p }),
      });
      const data = await res.json();
      if (data.timeline) {
        setTimeline(data.timeline);
        localStorage.setItem(cacheKey, JSON.stringify(data.timeline));
      }
    } catch (err) {
      console.error("Timeline generation error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingTerminal message="Calculated Temporal Trajectories..." />;
  }

  return (
    <div className="min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/50 transition-colors hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <div className="text-right">
            <h1 className="neon-text text-3xl font-bold">Chronological Path</h1>
            <div className="flex items-center justify-end gap-2 text-[10px] uppercase tracking-widest">
              {isCached ? (
                <span className="flex items-center gap-1 text-primary">
                  <Database className="h-3 w-3" />
                  Loaded from Local Neural Cache
                </span>
              ) : (
                <span className="text-white/30 italic">Generated via Gemini Temporal Engine</span>
              )}
            </div>
          </div>
        </header>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-secondary to-transparent" />

          {/* Path Nodes */}
          <div className="space-y-12 md:space-y-24">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex items-center justify-between w-full ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Content Container */}
                <div className="w-full md:w-[45%] ml-12 md:ml-0">
                  <div className="glass group relative overflow-hidden rounded-3xl p-8 border-white/5 hover:border-primary/20 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-primary font-bold text-2xl">{item.year}</span>
                    </div>
                    <p className="text-lg text-white/80 leading-relaxed font-medium">
                      {item.event}
                    </p>
                  </div>
                </div>

                {/* Spacer for MD screens to keep center clear */}
                <div className="hidden md:block md:w-[10%]" />

                {/* Circle Marker - Always on the line */}
                <div className="absolute left-4 md:left-1/2 h-8 w-8 -translate-x-1/2 rounded-full glass border-2 border-primary/50 flex items-center justify-center z-10">
                  <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),1)]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
