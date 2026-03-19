/**
 * Simple transcript parser.
 * Assumes alternating lines: Question -> Answer
 */
function parseTranscript(transcriptText) {
    const lines = transcriptText.split('\n').filter(line => line.trim().length > 0);
    const qnaPairs = [];

    for (let i = 0; i < lines.length - 1; i += 2) {
        qnaPairs.push({
            question: lines[i].trim(),
            answer: lines[i + 1].trim()
        });
    }

    return qnaPairs;
}

module.exports = { parseTranscript };
