const KNOWN_SKILLS = [
    'javascript', 'python', 'java', 'c++', 'c#', 'react', 'node.js', 'express',
    'docker', 'kubernetes', 'aws', 'sql', 'nosql', 'mongodb', 'html', 'css',
    'tailwind', 'git', 'machine learning', 'data structures'
];

function parseJD(jdText, resumeSkills) {
    const textLower = jdText.toLowerCase();

    // Extract required skills from JD
    const requiredSkills = KNOWN_SKILLS.filter(skill => textLower.includes(skill.toLowerCase()));

    if (requiredSkills.length === 0) {
        return { requiredSkills: [], missingSkills: [], matchPercentage: 100 };
    }

    // Find missing skills
    const missingSkills = requiredSkills.filter(skill => !resumeSkills.includes(skill));

    // Calculate match percentage
    const matchCount = requiredSkills.length - missingSkills.length;
    const matchPercentage = Math.round((matchCount / requiredSkills.length) * 100);

    return {
        requiredSkills,
        missingSkills,
        matchPercentage
    };
}

module.exports = { parseJD };
