import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, ArrowRight, Info, X, Shield, Activity, BrainCircuit } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultDashboard from './components/ResultDashboard';
import bgImage from './Interview.png';
import appLogo from './Logo.jpeg';

function App() {
    const [started, setStarted] = useState(false);
    const dashboardRef = useRef(null);
    const [showAbout, setShowAbout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleEvaluate = async (data) => {
        setLoading(true);
        setError(null);
        setResult(null);
        
        setTimeout(() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

        try {
            const response = await fetch('https://intellihire-sqry.onrender.com/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.error || 'Evaluation failed');
            }

            setResult(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full font-sans text-slate-200 selection:bg-purple-500/30 overflow-x-hidden">
            {/* Global Background Image */}
            <div
                className="fixed inset-0 z-0 w-full h-full object-cover opacity-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            {/* Dark Overlays - Professional Look */}
            <div className="fixed inset-0 z-10 bg-black/50" />
            <div className="fixed inset-0 z-10 bg-gradient-to-br from-black/40 via-transparent to-black/60 mix-blend-overlay" />

            {/* Main Content Layer */}
            <div className="relative z-20 min-h-screen w-full flex flex-col">
                {!started ? (
                    <div className="flex-1 flex flex-col items-center justify-center overflow-hidden w-full">

                        {/* Top Navigation */}
                        <nav className="absolute top-0 left-0 w-full p-6 md:px-12 z-40 flex justify-between items-center">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-12 h-12 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all overflow-hidden">
                                    <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                                    IntelliHire
                                </span>
                            </div>
                            <button
                                onClick={() => setShowAbout(true)}
                                className="px-5 py-2.5 rounded-full border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 backdrop-blur-md text-sm font-bold text-white transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                            >
                                <Info className="w-4 h-4" /> About System
                            </button>
                        </nav>

                        <AnimatePresence>
                            {showAbout && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                        className="bg-slate-900 border border-indigo-500/30 w-full max-w-2xl rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.2)] relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                        <button
                                            onClick={() => setShowAbout(false)}
                                            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                                                <Bot className="w-8 h-8 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold text-white tracking-tight">How it Works</h2>
                                                <p className="text-indigo-300 font-medium">Multi-Agent AI Simulation</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <Shield className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-slate-200 text-lg mb-1">Bluff Detection Engine</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed">The system cross-references resume claims natively against live interview answers. If a candidate claims expertise but gives incorrect or vague technical answers, the AI flags the contradiction immediately.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <Activity className="w-8 h-8 text-purple-400 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-slate-200 text-lg mb-1">Live Multi-Agent Debate</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed">Three distinct agents (Tech Lead, HR, and System Evaluator) process the transcript simultaneously. They weigh in dynamically, simulate a human discussion, and justify the final hire or reject decision.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <Sparkles className="w-8 h-8 text-amber-400 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-slate-200 text-lg mb-1">Smart Role Re-assignment</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed">Instead of purely rejecting failed candidates, the system analyzes their skill profile against an array of open internal roles and recommends alternate perfect-match positions with complete reasoning.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
                        >


                            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 tracking-tight mb-6 drop-shadow-lg">
                                Autonomous AI Hiring System
                            </h1>

                            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-3xl font-medium drop-shadow-md">
                                A real-time, multi-agent artificial intelligence platform that simulates human recruiters to evaluate candidates with extreme precision.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.6)" }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                onClick={() => setStarted(true)}
                                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-xl text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-3 transition-all border border-indigo-400/30 group"
                            >
                                Start AI Interview
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                            </motion.button>

                            {/* Feature Highlights */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="mt-14 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/90 font-medium text-sm md:text-base w-full overflow-hidden"
                            >
                                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg shrink-0">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    Resume Upload & OCR
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg shrink-0">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    AI Interview Simulation
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg shrink-0">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                                        <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    Real-time AI Scoring
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen flex flex-col w-full flex-1">
                        <header className="mb-10 flex-shrink-0 flex flex-col items-start w-full gap-4">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="inline-flex items-center p-3 px-5 bg-slate-900/60 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl cursor-pointer" onClick={() => setStarted(false)}>
                                    <img src={appLogo} alt="Logo" className="w-10 h-10 rounded-lg mr-4 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] object-cover" />
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 tracking-tight leading-tight">
                                            IntelliHire
                                        </h1>
                                        <p className="text-indigo-200/60 text-xs font-semibold flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> AI Analysis
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <button 
                                    onClick={() => setStarted(false)} 
                                    className="px-4 py-2 rounded-full border border-white/20 bg-slate-900/40 hover:bg-slate-800/60 hover:border-white/40 backdrop-blur-md text-sm font-bold text-white transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                                </button>
                            </motion.div>
                        </header>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1 pb-10">
                            {/* Left Column - Input Form */}
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-5 relative z-10 h-full">
                                <div className="h-full rounded-3xl shadow-2xl">
                                    <InputForm onSubmit={handleEvaluate} loading={loading} />
                                </div>
                                {error && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-4 text-sm text-red-200 bg-red-900/50 backdrop-blur-md rounded-xl border border-red-500/30 flex items-center shadow-lg">
                                        <span className="font-bold mr-2">Error:</span> {error}
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Right Column - Dashboard */}
                            <motion.div ref={dashboardRef} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-7 h-full flex flex-col pt-4 xl:pt-0 scroll-mt-6">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex-1 bg-slate-900/60 p-10 rounded-3xl shadow-2xl shadow-black/10 border border-white/10 flex flex-col items-center justify-center min-h-[600px] backdrop-blur-xl">
                                            <div className="relative">
                                                <div className="w-24 h-24 border-4 border-blue-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                                                <Bot className="w-8 h-8 text-cyan-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                            </div>
                                            <h3 className="mt-8 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 animate-pulse">Running Multi-Agent Simulation</h3>
                                            <p className="mt-2 text-white/80 text-sm">Tech Lead and HR are analyzing your transcript...</p>
                                        </motion.div>
                                    ) : result ? (
                                        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 h-full min-h-[600px]">
                                            <ResultDashboard result={result} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-slate-900/60 p-10 rounded-3xl shadow-2xl shadow-black/10 border border-white/10 flex flex-col items-center justify-center min-h-[600px] text-center backdrop-blur-xl group">
                                            <div className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                                <Bot className="w-16 h-16 text-cyan-300 group-hover:text-white transition-colors duration-500" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">Awaiting Candidate</h3>
                                            <p className="text-white/70 mt-3 max-w-sm leading-relaxed">Fill out the candidate data on the left to begin the AI interview evaluation.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
