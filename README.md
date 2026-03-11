# 🌌 Enigma: FutureTwin

**Live Simulation**: [https://enigma-timetraveller.vercel.app/](https://enigma-timetraveller.vercel.app/)

Enigma is a futuristic, AI-powered life exploration platform designed for the **Vibe Coding Event (March 11th)**. It allows users to bridge the gap between today and 2035, offering an immersive look at their potential future selves through advanced AI simulations and temporal forecasting.

---

## ✨ Key Features

### 🔹 Meet Your Future Self (Neural Chat)
Connect with a persistent AI persona of yourself in 2035. The chat uses **Local Neural Sync**, loading history instantly from your local cache while staying synchronized with the cloud (MongoDB).

### 🔹 Temporal Timelines
Visualize the major milestones of your potential next decade. An alternating, node-based visual timeline that adapts based on your career goals and personal aspirations.

### 🔹 Decision Matrix (Neural History)
Weigh critical life choices by collapsing wavefunctions of reality. Compare "Path Alpha" vs "Path Beta" and revisit all past simulations through the **Neural History** archive.

### 🔹 Skill Roadmap
A comprehensive growth pathway for the next 10 years. Categorized by "Core Evolution" and "Emerging Specialties," tailored to the AI-first economy of 2035.

### 🔹 Goal Hurdles (Risk Mitigation)
A predictive scan of potential obstacles. Identify high-risk "Temporal Interference" patterns in your path and receive strategic mitigation protocols to stay on track.

### 🔹 Deep Persistence & Persona Archive
Manage multiple life paths through the **Persona Archive**. Every simulation, skill map, and timeline is cached locally per-persona, ensuring zero-latency transitions and optimized token usage.

---

## 🛠️ Tech Stack

- **Core**: Next.js 15 (App Router), React 19
- **Runtime**: Bun (Optimized for speed)
- **Styling**: TailwindCSS & Lucide React Icons
- **Animations**: Framer Motion (Glassmorphism & Particle Effects)
- **AI Engine**: Google Gemini AI SDK (Resilient fallback chain: Gemini 2.5/3.1 + Gemma 3)
- **Database**: MongoDB (Secondary persistence)
- **State**: Deep `localStorage` Residency

---

## 🚀 Local Setup

To run Enigma locally using **Bun**:

1.  **Clone the Repository**
2.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_ai_key
    MONGODB_URI=your_mongodb_connection_string
    ```
3.  **Install Dependencies**
    ```bash
    bun install
    ```
4.  **Launch Temporal Link**
    ```bash
    bun dev
    ```
    Access the portal at `http://localhost:3000`.

---

## 👥 The Ensemble
Developed for the **Compile The Vibe** (March 11, 2026).

- **Team**: CTV-15
- **Team Leader**: Aditya Kumar
- **Focus**: AI Resilience & User Persistence

---

*“The future is not a destination, but a series of collapsed possibilities. Choose wisely.”*
