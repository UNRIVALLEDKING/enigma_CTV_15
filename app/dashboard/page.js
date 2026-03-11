"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Map, Cpu, Zap, Archive } from "lucide-react";

export default function DashboardPage() {
  const cards = [
    {
      title: "Meet Your Future Self",
      description: "Chat with an AI simulation of who you might become.",
      icon: <User className="h-8 w-8 text-primary" />,
      href: "/future-self",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Explore Timelines",
      description: "Visualize major life events from 2025 to 2035.",
      icon: <Map className="h-8 w-8 text-secondary" />,
      href: "/timeline",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Simulate Decisions",
      description: "Compare two paths and see their long-term impact.",
      icon: <Zap className="h-8 w-8 text-accent" />,
      href: "/simulate",
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      title: "Skill Roadmap",
      description: "Get a personalized learning path for the next decade.",
      icon: <Cpu className="h-8 w-8 text-green-400" />,
      href: "/skills",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "Persona Archive",
      description: "Manage and switch between your saved future personas.",
      icon: <Archive className="h-8 w-8 text-white/50" />,
      href: "/gallery",
      color: "from-gray-500/20 to-slate-500/20",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="neon-text mb-4 text-4xl font-bold md:text-5xl">
          Central Command
        </h1>
        <p className="text-lg text-white/50">
          Your portal to the year 2035 starts here.
        </p>
      </motion.div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={card.href}
              className={`glass group block relative h-full rounded-3xl p-8 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}
            >
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-2xl bg-white/5 p-4 transition-colors group-hover:bg-white/10">
                  {card.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-white group-hover:text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50 group-hover:text-white/80">
                  {card.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20"
      >
        <Link
          href="/"
          className="text-sm font-medium text-white/40 transition-colors hover:text-white"
        >
          ← Return to Portal
        </Link>
      </motion.div>
    </div>
  );
}
