/**
 * Detects contradictions between resume skills and transcript evaluation.
 * Returns structured objects with severity and a summary string.
 */
function detectContradictions(resumeSkills, evaluatedAnswers) {
    const contradictions = [];

    // Improve tracking of skills that were contradicting
    const mismatchedSkills = new Set();

    evaluatedAnswers.forEach(evalResult => {
        const questionLower = evalResult.question.toLowerCase();
        
        // Check if the question is related to any skill the candidate claims
        const allegedSkill = resumeSkills.find(skill => questionLower.includes(skill.toLowerCase()) || (evalResult.topic && evalResult.topic.toLowerCase() === skill.toLowerCase()));

        if (allegedSkill && evalResult.status === 'incorrect') {
            mismatchedSkills.add(allegedSkill);
            contradictions.push({
                skill: allegedSkill,
                question: evalResult.question,
                issue: "Claimed expertise on resume but failed fundamental questions.",
                severity: "HIGH" 
            });
        }
    });

    let summary = "Candidate appears consistent with resume claims.";
    if (mismatchedSkills.size > 0) {
        const skillsArray = Array.from(mismatchedSkills);
        // e.g "Candidate shows mismatch between claimed skills and demonstrated knowledge in Docker and NoSQL."
        const formattedSkills = skillsArray.length > 1 
            ? `${skillsArray.slice(0, -1).join(', ')} and ${skillsArray[skillsArray.length - 1]}`
            : skillsArray[0];

        summary = `Candidate shows mismatch between claimed skills and demonstrated knowledge in ${formattedSkills}.`;
    }

    return {
        list: contradictions,
        summary: summary
    };
}

module.exports = { detectContradictions };
