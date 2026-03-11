"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Sparkles, TrendingUp, AlertTriangle, History, Binary, Database } from "lucide-react";
import Link from "next/link";
import LoadingTerminal from "@/components/LoadingTerminal";

export default function SimulatePage() {
  const [choiceA, setChoiceA] = useState("");
  const [choiceB, setChoiceB] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("new"); // "new" or "history"

  useEffect(() => {
    const savedProfile = localStorage.getItem("futureTwinProfile");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      
      // Load history for this persona
      const historyKey = `sims_${p.name}_${p.age}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!choiceA || !choiceB || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        body: JSON.stringify({ choiceA, choiceB, profile }),
      });
      const data = await res.json();
      if (data.simulation) {
        setResults(data.simulation);
        
        // Save to History
        const newSim = {
          choiceA,
          choiceB,
          results: data.simulation,
          timestamp: new Date().toISOString()
        };
        const updatedHistory = [newSim, ...history];
        setHistory(updatedHistory);
        
        const historyKey = `sims_${profile.name}_${profile.age}`;
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (sim) => {
    setChoiceA(sim.choiceA);
    setChoiceB(sim.choiceB);
    setResults(sim.results);
    setView("new");
  };

  if (isLoading) {
    return <LoadingTerminal message="Collapsing Wavefunction Realities..." />;
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
            <h1 className="neon-text text-3xl font-bold">Decision Matrix</h1>
            <p className="text-sm text-white/30 uppercase tracking-widest">Multi-path Simulation Active</p>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
            <div className="glass p-1 rounded-2xl flex gap-1">
                <button 
                    onClick={() => setView("new")}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'new' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                >
                    <Binary className="h-4 w-4" />
                    New Simulation
                </button>
                <button 
                     onClick={() => setView("history")}
                     className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'history' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                >
                    <History className="h-4 w-4" />
                    Neural History
                    {history.length > 0 && <span className="ml-1 opacity-50">({history.length})</span>}
                </button>
            </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "new" ? (
            <motion.div
              key="new"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="mb-20 glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Zap className="h-32 w-32 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold mb-8 text-white">What decisions are you weighing?</h2>
                
                <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-primary uppercase tracking-tighter">Path Alpha</label>
                    <textarea
                      value={choiceA}
                      onChange={(e) => setChoiceA(e.target.value)}
                      placeholder="e.g. Staying at my corporate job for stability"
                      className="w-full h-32 rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-accent uppercase tracking-tighter">Path Beta</label>
                    <textarea
                      value={choiceB}
                      onChange={(e) => setChoiceB(e.target.value)}
                      placeholder="e.g. Quitting to build an AI-first startup"
                      className="w-full h-32 rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/20 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-center mt-6">
                    <button
                      type="submit"
                      disabled={!choiceA || !choiceB || isLoading}
                      className="group flex items-center gap-3 rounded-full bg-white px-10 py-4 font-bold text-black transition-all hover:scale-105 hover:bg-primary active:scale-95 disabled:opacity-50"
                    >
                      <Zap className="h-5 w-5" />
                      Collapse Wavefunction
                    </button>
                  </div>
                </form>
              </div>

              <AnimatePresence>
                {results && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {[
                      { data: results.futureA, label: "Outcome Alpha", color: "primary" },
                      { data: results.futureB, label: "Outcome Beta", color: "accent" }
                    ].map((outcome, idx) => (
                      <div key={idx} className={`glass rounded-3xl p-8 border-t-4 ${outcome.color === 'primary' ? 'border-primary' : 'border-accent'}`}>
                        <h3 className={`text-xl font-bold mb-6 ${outcome.color === 'primary' ? 'text-primary' : 'text-accent'}`}>{outcome.label}</h3>
                        <div className="space-y-6">
                          <section>
                            <div className="flex items-center gap-2 text-white/40 text-xs uppercase mb-2">
                              <Sparkles className="h-3 w-3" />
                              Summary
                            </div>
                            <p className="text-lg font-medium text-white">{outcome.data.summary}</p>
                          </section>
                          
                          <section>
                            <div className="flex items-center gap-2 text-white/40 text-xs uppercase mb-2">
                              <TrendingUp className="h-3 w-3" />
                              Career Evolution
                            </div>
                            <p className="text-white/80">{outcome.data.career}</p>
                          </section>

                          <div className="grid grid-cols-2 gap-4">
                              <section className="bg-white/5 rounded-2xl p-4">
                                <div className="text-[10px] text-white/30 uppercase mb-1">Fulfillment</div>
                                <div className="text-lg font-bold text-white">{outcome.data.fulfillment}</div>
                              </section>
                              <section className="bg-white/5 rounded-2xl p-4">
                                <div className="text-[10px] text-white/30 uppercase mb-1">Wildcard</div>
                                <div className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs text-white/70">Potential Event</span>
                                </div>
                              </section>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {history.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl">
                    <Database className="h-12 w-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 font-mono uppercase tracking-widest text-sm">No recorded wavefunction collapses found.</p>
                </div>
              ) : (
                history.map((sim, i) => (
                  <div 
                    key={i} 
                    onClick={() => loadFromHistory(sim)}
                    className="glass p-6 rounded-2xl cursor-pointer hover:border-primary/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex gap-6 items-center flex-1">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                            <Binary className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-primary font-bold text-sm">A:</span>
                                <span className="text-white/80 line-clamp-1 text-sm">{sim.choiceA}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-accent font-bold text-sm">B:</span>
                                <span className="text-white/80 line-clamp-1 text-sm">{sim.choiceB}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right ml-4">
                        <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1">
                            {new Date(sim.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase">Revisit Path →</div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
