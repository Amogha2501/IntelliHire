import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, BrainCircuit, Activity, MessageSquare } from 'lucide-react';

function ResultDashboard({ result }) {
    if (!result || !result.final_decision) {
        return <div className="p-8 text-center text-white">Loading or Invalid Data...</div>;
    }

    const {
        resume_analysis,
        transcript_analysis,
        bluff_detection,
        skill_scores,
        final_decision,
        decision_explanation,
        panel_discussion,
        role_recommendation
    } = result;

    const matchScore = final_decision.overall_score || 0;
    const [displayedScore, setDisplayedScore] = useState(0);
    const [visibleDiscussionCount, setVisibleDiscussionCount] = useState(0);

    // Animate score from 0 to matchScore
    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const targetScore = parseInt(matchScore, 10) || 0;
        const increment = targetScore / (duration / 16); // 60fps

        if (targetScore === 0) return;

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetScore) {
                setDisplayedScore(targetScore);
                clearInterval(timer);
            } else {
                setDisplayedScore(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [matchScore]);

    // Stream the discussion item by item
    useEffect(() => {
        if (!panel_discussion || panel_discussion.length === 0) return;
        const timer = setInterval(() => {
            setVisibleDiscussionCount(prev => {
                if (prev < panel_discussion.length) return prev + 1;
                clearInterval(timer);
                return prev;
            });
        }, 1200); // 1.2s delay between messages
        return () => clearInterval(timer);
    }, [panel_discussion]);

    // The user's prompt suggests "Hire / No Hire" might be string
    const finalVerdictStr = typeof final_decision.verdict === 'string' ? final_decision.verdict.toUpperCase() : "NO HIRE";
    const isHire = finalVerdictStr.includes('HIRE') && !finalVerdictStr.includes('NO HIRE');

    return (
        <div className="bg-white/10 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-xl h-full flex flex-col">

            {/* Header Decision Panel */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className={`p-8 text-center border-b border-white/10 ${isHire ? 'bg-gradient-to-br from-emerald-900/50 to-slate-900' : 'bg-gradient-to-br from-rose-900/50 to-slate-900'}`}
            >
                <h2 className="text-sm font-bold tracking-widest uppercase mb-2 text-slate-300/80">Final Panel Verdict</h2>
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
                    className={`text-5xl font-extrabold tracking-tight ${isHire ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                    {finalVerdictStr}
                </motion.div>
                <div className="mt-4 flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-200">Panel Confidence: {final_decision.confidence_score}</span>
                </div>
            </motion.div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

                {/* Score & Skills Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col items-center justify-center">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Match Dashboard</h4>
                        <div className="relative flex items-center justify-center">
                            <svg className="w-24 h-24 transform -rotate-90">
                                <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-700/50" />
                                <motion.circle
                                    cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                                    className={`${displayedScore > 70 ? 'text-emerald-500' : displayedScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}
                                    strokeDasharray={251.2}
                                    initial={{ strokeDashoffset: 251.2 }}
                                    animate={{ strokeDashoffset: 251.2 - (251.2 * displayedScore) / 100 }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                />
                            </svg>
                            <span className="absolute text-2xl font-bold text-white">{displayedScore}%</span>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 p-5 rounded-xl border border-white/10">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skill Radar</h4>
                        {skill_scores ? (
                            <div className="space-y-3">
                                {Object.entries(skill_scores).map(([skill, score], i) => {
                                    const numScore = parseFloat(score);
                                    // Handle if AI returns 0-100 instead of 0-10
                                    const displayScore = numScore > 10 ? numScore / 10 : numScore;

                                    return (
                                        <div key={skill}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-300 font-medium capitalize">{skill.replace('_', ' ')}</span>
                                                <span className="text-indigo-300">{displayScore.toFixed(1)}/10</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-1.5">
                                                <motion.div
                                                    className="bg-indigo-500 h-1.5 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(displayScore / 10) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500 italic flex items-center h-full justify-center">No scores available</div>
                        )}
                    </motion.div>
                </div>

                {/* AI Panel Discussion - Live Streaming Effect */}
                <div className="bg-white/5 p-5 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
                    <h3 className="text-sm font-bold text-indigo-300 tracking-wider flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4" /> Live Inter-Agent Discussion
                    </h3>
                    <div className="space-y-3">
                        {panel_discussion && panel_discussion.slice(0, visibleDiscussionCount).map((item, idx) => {
                            const { role, message } = item;
                            const isTech = role.toLowerCase().includes('tech');
                            const isHR = role.toLowerCase().includes('hr');

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex gap-3 text-sm p-3 rounded-lg border ${isTech ? 'bg-blue-900/20 border-blue-500/20' : isHR ? 'bg-amber-900/20 border-amber-500/20' : 'bg-purple-900/20 border-purple-500/20'}`}
                                >
                                    <span className={`font-bold shrink-0 ${isTech ? 'text-blue-400' : isHR ? 'text-amber-400' : 'text-purple-400'}`}>{role}:</span>
                                    <span className="text-slate-200 leading-relaxed">{message}</span>
                                </motion.div>
                            );
                        })}
                        {visibleDiscussionCount < (panel_discussion || []).length && (
                            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-xs text-indigo-400/60 font-mono flex items-center gap-2 italic">
                                <span>Agent typing</span><span className="flex gap-0.5"><span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span></span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Bluff Detection */}
                {
                    bluff_detection?.bluff_found && bluff_detection.details?.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="bg-rose-900/20 p-5 rounded-xl border border-rose-500/30">
                            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center mb-3">
                                <AlertTriangle className="w-4 h-4 mr-2" /> Bluffs / Contradictions Detected
                            </h3>
                            <ul className="space-y-2 list-disc list-inside text-rose-200 border-l-2 border-rose-500/50 pl-3">
                                {bluff_detection.details.map((issue, idx) => (
                                    <li key={idx} className="text-sm leading-snug">{issue}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )
                }

                {/* Decision Breakdown */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-3">Decision Logic Explained</h3>
                    <div className="space-y-4">
                        {/* Critical Mistakes */}
                        {decision_explanation?.critical_mistakes?.length > 0 && (
                            <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-500/10">
                                <h5 className="text-xs font-bold text-rose-400 mb-2">Critical Mistakes:</h5>
                                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                    {decision_explanation.critical_mistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Contradiction & Strong Area */}
                        <div className="grid grid-cols-2 gap-3">
                            {decision_explanation?.contradiction && (
                                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-500/10 text-sm">
                                    <span className="text-xs font-bold text-amber-500 block mb-1">Key Contradiction:</span>
                                    <span className="text-slate-300">{decision_explanation.contradiction}</span>
                                </div>
                            )}
                            {decision_explanation?.strong_area && (
                                <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/10 text-sm">
                                    <span className="text-xs font-bold text-emerald-500 block mb-1">Key Strength:</span>
                                    <span className="text-slate-300">{decision_explanation.strong_area}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Role Recommendation System */}
                {
                    !isHire && role_recommendation?.recommended_roles?.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="bg-indigo-900/20 p-5 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-4 border-b border-indigo-500/20 pb-2">
                                <BrainCircuit className="inline w-4 h-4 mr-2" />
                                Alternative Role Recommendations
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {role_recommendation.recommended_roles.map((role, idx) => (
                                    <div key={idx} className="bg-indigo-950/40 p-4 rounded-lg border border-indigo-500/20 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-indigo-200 text-sm">{role.role_name}</span>
                                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-md border border-emerald-500/30">
                                                {role.match_score}% Match
                                            </span>
                                        </div>
                                        <p className="text-sm text-indigo-300/80 leading-relaxed">
                                            {role.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )
                }

                {/* Resume & Transcript Status */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">Resume Scan</h4>
                        <div className="text-sm space-y-2">
                            <p><span className="text-indigo-400 font-semibold">Experience:</span> <span className="text-slate-300">{resume_analysis?.experience_summary}</span></p>
                            <div>
                                <span className="text-indigo-400 font-semibold block mb-1">Identified Skills:</span>
                                <div className="flex flex-wrap gap-1">
                                    {resume_analysis?.skills?.map((s, i) => <span key={i} className="px-1.5 py-0.5 bg-white/10 text-slate-300 text-[10px] rounded">{s}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">Transcript Scan</h4>
                        <div className="text-sm space-y-2">
                            <p><span className="text-indigo-400 font-semibold">Technical Accuracy:</span> <span className="text-slate-300">{transcript_analysis?.technical_accuracy}</span></p>
                            <p><span className="text-indigo-400 font-semibold">Communication:</span> <span className="text-slate-300">{transcript_analysis?.communication_quality}</span></p>
                            {transcript_analysis?.issues_detected?.length > 0 && (
                                <ul className="list-disc list-inside text-rose-300 text-xs mt-2">
                                    {transcript_analysis.issues_detected.map((iss, i) => <li key={i}>{iss}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                </motion.div>

            </div >
        </div >
    );
}

export default ResultDashboard;
