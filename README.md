# 🎯 IntelliHire – Autonomous AI Interview Panel

> **AI-powered hiring panel that thinks, debates, and decides like real recruiters.**

---

## 🚀 Overview

**IntelliHire** is a real-time, multi-agent AI platform that simulates a human interview panel to evaluate candidates intelligently and without bias.

Unlike traditional AI tools that rely on keyword matching, IntelliHire focuses on **deep understanding, reasoning, and consistency analysis** to deliver accurate hiring decisions.

---

## 🧠 Key Features

### 🔹 Resume Understanding

* Extracts skills and experience from text or PDF resumes
* Identifies key claims for verification

### 🔹 Transcript Analysis

* Evaluates correctness, depth, and clarity
* Detects vague or shallow answers

### 🔹 ⚠️ Bluff Detection Engine (Core Innovation)

* Compares resume claims with interview performance
* Flags contradictions and exaggerated skills

### 🔹 📊 Skill-Based Scoring

* Data Structures & Algorithms
* Backend Systems
* Databases
* Communication

---

## 🤖 Multi-Agent AI Panel

Simulates a real hiring committee:

* 💻 **Tech Lead** → evaluates technical depth
* 🤝 **HR Agent** → evaluates communication
* ⚖️ **System Evaluator** → detects inconsistencies

👉 Agents “debate” before giving a final decision.

---

## 🎯 Decision Output

* ✅ HIRE / NO HIRE
* 📊 Confidence Score
* 📌 Detailed reasoning (mistakes, strengths, contradictions)

---

## 🔄 Smart Role Recommendation

* Suggests alternative roles if candidate is not a fit
* Provides match percentage and reasoning

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Framer Motion
* **Backend:** Node.js, Express.js
* **AI Integration:** Google Gemini API (`@google/genai`)
* **PDF Parsing:** pdf-parse
* **Deployment:** Render

---

## 💻 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Amogha2501/IntelliHire.git
cd IntelliHire
```

---

### 2️⃣ Install Dependencies

```bash
# Root
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

---

### 3️⃣ Environment Variables

Create `.env` inside `/backend`:

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

---

### 4️⃣ Run Project

```bash
npm run dev
```

---

## 🌐 Live Demo

* Frontend: https://intellihire-frontend-7apu.onrender.com/
* Backend: https://intellihire-sqry.onrender.com

---

## 🎨 Features Showcase

* ✨ Premium UI with glassmorphism design
* 📄 PDF resume upload
* ⚡ Real-time AI evaluation
* 🤖 Multi-agent reasoning system

---

## ⚖️ Design Philosophy

* 🚫 No video → eliminates bias
* 🧠 Focus on reasoning over memorization
* ⚡ Real-time evaluation capability

---

## 🧩 Challenges Solved

* Detecting shallow vs deep understanding
* Identifying resume exaggeration
* Simulating real interview panel decisions
* Making hiring more fair and explainable

---

## 🙌 Credits

* Developed by: CodeStorm
* Contributors:Amogha H Shetty, Raksha P R, Ashika P M, Anisha Rao

---

## 📚 References

* Google Gemini API Documentation
* React Documentation
* Node.js & Express Documentation
* Tailwind CSS Docs
* Framer Motion Docs
* Render Deployment Docs

---

## 🏆 Conclusion

IntelliHire transforms hiring from simple answer checking into **intelligent, reasoning-driven evaluation**, making recruitment more reliable, fair, and aligned with real-world interview practices.
