/**
 * Multi-Agent System Simulation (Debate-Like)
 */

function resumeAgent(resumeData) {
    const skillList = resumeData.skills.join(', ');
    const totalSkills = resumeData.skills.length;
    return `Resume Agent: I reviewed the candidate's resume. They list ${totalSkills} core technical skills, including strong experience in ${skillList || "various technical areas"}.`;
}

function technicalAgent(answerEvals) {
    const incorrectEvals = answerEvals.filter(e => e.status === 'incorrect');
    const correctEvals = answerEvals.filter(e => e.status === 'correct');
    
    if (incorrectEvals.length > 0) {
        const failedTopics = incorrectEvals.map(e => e.topic || "core concepts").slice(0, 3).join(', ');
        const primaryReason = incorrectEvals[0].reason;
        return `Technical Agent: However, the candidate demonstrated critical knowledge gaps, specifically failing to correctly explain ${failedTopics}. ${primaryReason}`;
    } else if (correctEvals.length > 0) {
        const strongTopics = correctEvals.map(e => e.topic || "core concepts").slice(0, 3).join(', ');
        return `Technical Agent: I agree. The candidate demonstrated solid technical depth and accurately explained complex topics such as ${strongTopics}.`;
    }
    
    return `Technical Agent: The candidate's technical performance was mostly partial and lacked deep technical demonstrations.`;
}

function consistencyAgent(contradictionsObj) {
    if (contradictionsObj.list.length > 0) {
        return `Consistency Agent: This suggests a contradiction between resume claims and actual knowledge. ${contradictionsObj.summary}`;
    }
    return 'Consistency Agent: Their performance is consistent. No major contradictions found between their stated skills and answers.';
}

function hiringManager(decisionData, resumeData) {
    if (decisionData.decision === 'NO HIRE') {
        const qualifier = resumeData.skills.length > 3 ? "Despite a strong resume" : "Given the weak interview";
        return `Hiring Manager: ${qualifier}, the candidate lacks core understanding. I recommend NO HIRE.`;
    }
    return `Hiring Manager: The candidate proves their capabilities and aligns well with our requirements. I recommend HIRE.`;
}

function runAgents({ resumeData, jdData, answerEvals, contradictionsObj, decisionData }) {
    // Generate a debate sequence where each agent references logic from previous
    const discussionLog = [
        resumeAgent(resumeData),
        technicalAgent(answerEvals),
        consistencyAgent(contradictionsObj),
        hiringManager(decisionData, resumeData)
    ];

    return discussionLog;
}

module.exports = { runAgents };
