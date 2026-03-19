# 🎯 Autonomous AI Interview Panel

> **A real-time, multi-agent AI platform designed to evaluate candidates during an interview simulation. Built for a national-level hackathon, this system thinks alongside human recruiters to deliver intelligent, unbiased hiring decisions.**

---

## 🚀 System Overview

This system simulates a real-world AI-powered hiring assistant. **It does NOT rely on video.** Instead, it focuses purely on raw intelligence, critical thinking, and textual understanding using:

- **Resume Parsing** (Direct PDF Extraction & Text Parsing)
- **Live Interview Transcript** (Streaming or pre-recorded)
- **Job Description** matching
- **Available Roles** alignment

---

## 🧠 Core Capabilities

### 1. Resume Understanding
- Extracts skills, technologies, and experience.
- Identifies and isolates the key claims made by the candidate for cross-referencing.

### 2. Transcript Analysis
- Evaluates the core correctness of technical answers.
- Measures communication clarity.
- Identifies weak, vague, or dodged responses.

### 3. Bluff Detection (Critical Feature)
- Automatically compares resume claims against live interview answers.
- Detects contradictions, incorrect explanations, and overstated skills.
- *Example:* If a candidate claims "MongoDB Expert" on their resume but gives incorrect answers about NoSQL in the transcript, the system actively flags this as a bluff.

### 4. Skill-Based Scoring
Provides precise scores (0–100) across key professional domains:
- Data Structures & Algorithms (DSA)
- Backend Architecture
- Database Management
- Communication & Soft Skills

### 5. Multi-Agent Panel Simulation
The system is fundamentally powered by a multi-agent architectural debate, behaving exactly like 3 distinct human interviewers:
- 💻 **Tech Lead:** Focuses strictly on technical depth and engineering correctness.
- 🤝 **HR Agent:** Focuses on communication, cultural fit, and clarity.
- ⚖️ **System Evaluator:** Detects inconsistencies, computes final scores, and mediates the final decision.
- ***AI Debate Mechanism:*** Agents may disagree! Each provides their unique perspective before a final, calculated decision is reached.

### 6. Decision Reasoning & Transparency
The system doesn't just score; it **explains**. It generates:
- **Final Verdict:** HIRE / NO HIRE
- **Confidence Score:** Low / Medium / High
- **Detailed Reasoning:** Clearly explains *why* the candidate was selected or rejected, isolating **Critical Mistakes**, **Contradictions**, and **Strong Areas**.

### 7. Smart AI Role Recommendation
If a candidate isn't suitable for the applied role, the system doesn't just reject them:
- Suggests alternative roles from the provided open positions list.
- Calculates an exact match percentage for the alternative role.
- Provides reasoning for the redirection.

---

## 🛠️ Important Design Choices

- **No Video Bias:** All intelligence is based purely on textual reasoning, removing visual biases.
- **Deep Reasoning over Scoring:** The focus is on *how* the AI understands the candidate, mimicking a real human interview panel, rather than just acting as a simple Q&A chatbot.
- **Real-Time Concept Architecture:** Built to support progressively streaming transcripts, where scores and panel insights update dynamically as the interview unfolds.

---

## 💻 Tech Stack Setup

- **Backend:** Node.js, Express, Google Gemini 2.5 Flash (`@google/genai`)
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion (Real-time UI animations)

### Running the Project Locally

Make sure you have Node.js 18+ installed. From the project root (`AutonomousInterviewPanel-main`), run:

```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd backend
npm install
cd ..

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Start the Application
npm run dev
### Environment Variables Setup

The backend relies on the Google Gemini API for its intelligent document parsing. You **must** configure your environment variables for it to work.

1. Navigate to the `backend/` directory.
2. Create a new file named `.env`.
3. Add your Gemini API key inside the `.env` file like this:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
```
*(Note: Do not commit your `.env` file! It is already added to `.gitignore` to keep your keys safe).*

---

## ✨ Recent Upgrades
- **Premium UI/UX:** Stunning Dark-mode Glassmorphism UI via Tailwind CSS, complete with ambient glows, smooth animations, and an intuitive Drag-and-Drop resume upload zone.
- **Enhanced AI Logic:** The core evaluation engine now features strict word-boundary analysis and complex rulesets for modern tech (AWS, REST APIs, Python, Agile), enabling precise `"STRONG HIRE"` or `"NO HIRE"` outcomes with detailed percentage-based skill breakdowns!

---

