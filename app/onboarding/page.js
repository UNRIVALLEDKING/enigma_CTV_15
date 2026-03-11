"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

const steps = [
  {
    title: "Basic Info",
    fields: [
      { name: "name", label: "What's your name?", type: "text", placeholder: "Enter your name" },
      { name: "age", label: "How old are you?", type: "number", placeholder: "Age" },
      { name: "country", label: "Where are you from?", type: "text", placeholder: "Country" },
    ],
  },
  {
    title: "Career & Interests",
    fields: [
      { name: "profession", label: "Current education or profession", type: "text", placeholder: "e.g. Student, Dev, Designer" },
      { name: "skills", label: "Skills (comma separated)", type: "text", placeholder: "React, AI, Python..." },
      { name: "interests", label: "Interests (comma separated)", type: "text", placeholder: "AI, Design, Startups..." },
    ],
  },
  {
    title: "Personality & Goals",
    fields: [
      { name: "dreamCareer", label: "Your dream career?", type: "text", placeholder: "AI Researcher, Founder..." },
      { name: "goal", label: "Biggest goal in life?", type: "text", placeholder: "Build something impactful..." },
      { name: "riskTolerance", label: "Risk tolerance", type: "select", options: ["low", "medium", "high"] },
      { name: "workStyle", label: "Preferred work style", type: "select", options: ["corporate", "startup", "research", "creator"] },
    ],
  },
  {
    title: "Lifestyle",
    fields: [
      { name: "priority", label: "What matters most?", type: "select", options: ["money", "impact", "freedom", "stability"] },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    country: "",
    profession: "",
    skills: "",
    interests: "",
    dreamCareer: "",
    goal: "",
    riskTolerance: "medium",
    workStyle: "startup",
    priority: "impact",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("futureTwinProfile", JSON.stringify(formData));
      
      // Save to personas gallery
      const savedPersonas = JSON.parse(localStorage.getItem("futureTwinPersonas") || "[]");
      const exists = savedPersonas.some(p => p.name === formData.name && p.age === formData.age);
      if (!exists) {
        localStorage.setItem("futureTwinPersonas", JSON.stringify([...savedPersonas, formData]));
      }
      
      router.push("/dashboard");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="glass w-full max-w-xl rounded-3xl p-8 md:p-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            {steps[currentStep].title}
          </h2>
          <div className="text-sm font-medium text-white/40">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="mb-10 h-1 w-full bg-white/10">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {steps[currentStep].fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-primary focus:outline-none"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#00040d]">
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none"
                  />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
              currentStep === 0
                ? "cursor-not-allowed opacity-0"
                : "text-white/60 hover:text-white"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-black transition-all hover:scale-105 hover:bg-white active:scale-95"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Initialize Timeline
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Next Step
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
