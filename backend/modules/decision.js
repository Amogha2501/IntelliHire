/**
 * Final Decision Engine
 */
function makeFinalDecision(jdData, answerEvals, contradictionsObj) {
    const totalQuestions = answerEvals.length;
    let accuracy = 0;
    
    // Skill Breakdown Object (e.g Docker: "1/1")
    const skillBreakdown = {};
    const topicTracker = {}; // { Docker: { total: 1, correct: 1 } }

    answerEvals.forEach(evalResult => {
        const topic = evalResult.topic ? evalResult.topic.toLowerCase() : "general";
        const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
        
        if (!topicTracker[cleanTopic]) {
            topicTracker[cleanTopic] = { total: 0, correct: 0 };
        }
        topicTracker[cleanTopic].total += 10;
        
        if (evalResult.status === 'correct') {
            topicTracker[cleanTopic].correct += 10;
        } else if (evalResult.status === 'partial') {
            topicTracker[cleanTopic].correct += 5;
        }
    });

    for (const [topic, stats] of Object.entries(topicTracker)) {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        skillBreakdown[topic] = `${percentage}% Accuracy`;
    }

    if (totalQuestions > 0) {
        const correctCount = answerEvals.filter(e => e.status === 'correct').length;
        const partialCount = answerEvals.filter(e => e.status === 'partial').length;
        // Accuracy out of 100
        accuracy = ((correctCount * 1.0) + (partialCount * 0.5)) / totalQuestions * 100;
    }

    // New Match Score: (Resume Match + Performance) / 2
    let matchScore = jdData.matchPercentage;
    if (totalQuestions > 0) {
        matchScore = Math.round((jdData.matchPercentage + accuracy) / 2);
    }

    let confidence = Math.round((accuracy + matchScore) / 2);

    // Decision Logic
    const contradictionsCount = contradictionsObj.list.length;
    let decision = 'HIRE';
    
    if (contradictionsCount > 0 || accuracy < 60) {
        decision = 'NO HIRE';
    } else if (accuracy > 85 && contradictionsCount === 0) {
        decision = 'STRONG HIRE';
    }

    // Generating Decision Explanation
    const decisionExplanation = [];
    if (contradictionsCount > 0) {
        decisionExplanation.push(`${contradictionsCount} major contradiction(s) found.`);
    }
    const incorrectCount = answerEvals.filter(e => e.status === 'incorrect').length;
    if (incorrectCount > 0) {
        decisionExplanation.push(`${incorrectCount} critical concept error(s) detected.`);
    }
    if (accuracy < 60) {
        decisionExplanation.push(`Weak overall technical understanding (Accuracy: ${Math.round(accuracy)}%).`);
    } else {
        decisionExplanation.push(`Demonstrated solid technical accuracy (Accuracy: ${Math.round(accuracy)}%).`);
    }

    return {
        decision,
        confidence,
        matchScore, // Adjusted match score
        skillBreakdown,
        decisionExplanation
    };
}

module.exports = { makeFinalDecision };
