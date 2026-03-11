"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, ShieldCheck, Zap, Database, Search } from "lucide-react";
import Link from "next/link";
import LoadingTerminal from "@/components/LoadingTerminal";

export default function HurdlesPage() {
  const [hurdles, setHurdles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("futureTwinProfile");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      
      const cacheKey = `hurdles_${p.name}_${p.age}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        setHurdles(JSON.parse(cachedData).hurdles);
        setIsCached(true);
        setIsLoading(false);
      } else {
        fetchHurdles(p, cacheKey);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchHurdles = async (p, cacheKey) => {
    try {
      const res = await fetch("/api/hurdles", {
        method: "POST",
        body: JSON.stringify({ profile: p }),
      });
      const data = await res.json();
      if (data.hurdles) {
        setHurdles(data.hurdles);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (err) {
      console.error("Hurdles fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingTerminal message="Scanning Temporal Interference Patterns..." />;
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
            <h1 className="neon-text text-3xl font-bold">Goal Hurdles</h1>
            <div className="flex items-center justify-end gap-2 text-[10px] uppercase tracking-widest mt-1">
              {isCached ? (
                <span className="flex items-center gap-1 text-yellow-500/60">
                  <Database className="h-3 w-3" />
                  Risk Log Retrieved from Neural Archive
                </span>
              ) : (
                <span className="text-white/30 italic">Live Threat Mitigation Scan Active</span>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {hurdles.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl relative overflow-hidden group border-white/5 hover:border-yellow-500/20 transition-all"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <AlertTriangle className="h-20 w-20 text-yellow-500" />
              </div>
              
              <div className="flex items-start gap-6">
                <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-${h.riskLevel === 'High' ? 'red' : 'yellow'}-500/10 border border-${h.riskLevel === 'High' ? 'red' : 'yellow'}-500/20`}>
                  <AlertTriangle className={`h-6 w-6 text-${h.riskLevel === 'High' ? 'red' : 'yellow'}-500`} />
                </div>
                
                <div className="flex-1">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{h.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      h.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {h.riskLevel} Risk
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-white/60 leading-relaxed font-medium">
                      {h.description}
                    </p>
                    
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-3">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Mitigation Protocol
                      </div>
                      <p className="text-primary/80 text-sm leading-relaxed italic">
                        "{h.mitigation}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 glass rounded-3xl p-10 text-center border-dashed border-white/10"
          >
            <Search className="h-8 w-8 text-white/20 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tighter">Strategic Intelligence</h4>
            <p className="max-w-2xl mx-auto text-white/40 text-sm leading-relaxed">
              These hurdles are projected based on current societal and technological trends. Awareness is the first step in temporal stability.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
