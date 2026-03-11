"use client";
import { motion } from "framer-motion";

export const FuturisticBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#00040d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,0,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,242,255,0.1),transparent_40%)]" />
      
      {/* Animated Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/30"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            opacity: Math.random(),
          }}
          animate={{
            y: [null, Math.random() * 100 + "vh"],
            x: [null, Math.random() * 100 + "vw"],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
    </div>
  );
};
