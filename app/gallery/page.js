"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Plus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const savedPersonas = JSON.parse(localStorage.getItem("futureTwinPersonas") || "[]");
    setPersonas(savedPersonas);
  }, []);

  const switchPersona = (persona) => {
    localStorage.setItem("futureTwinProfile", JSON.stringify(persona));
    // Clear chat ID to start fresh for this persona
    localStorage.removeItem("futureTwinUserId");
    router.push("/dashboard");
  };

  const deletePersona = (index) => {
    const updated = personas.filter((_, i) => i !== index);
    setPersonas(updated);
    localStorage.setItem("futureTwinPersonas", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/50 transition-colors hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <div className="text-right">
            <h1 className="neon-text text-3xl font-bold">Persona Archive</h1>
            <p className="text-sm text-white/30 uppercase tracking-widest">Temporal Records Database</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/onboarding"
            className="glass flex flex-col items-center justify-center rounded-3xl p-10 border-dashed border-white/10 hover:border-primary/50 transition-all group"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <span className="text-lg font-bold text-white/60 group-hover:text-primary">New Persona</span>
          </Link>

          {personas.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass relative overflow-hidden rounded-3xl p-8 group border-white/5"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center">
                  <User className="h-8 w-8 text-white/20" />
                </div>
                <button
                  onClick={() => deletePersona(idx)}
                  className="p-2 text-white/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{p.name}</h3>
                <p className="text-sm text-primary font-mono mb-4">{p.profession}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase text-white/40">Age {p.age}</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase text-white/40">{p.country}</span>
                </div>

                <button
                  onClick={() => switchPersona(p)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-bold text-white/60 hover:bg-primary hover:text-black transition-all"
                >
                  Activate Persona
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
