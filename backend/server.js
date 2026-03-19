require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');

// Polyfill DOMMatrix for Node 18 compatibility with pdf-parse newer versions
if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix { };
}

const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const { evaluateAnswers } = require('./modules/evaluator');
const { runAgents } = require('./modules/agents');
const { makeFinalDecision } = require('./modules/decision');
const { detectContradictions } = require('./modules/contradiction');
const { parseJD } = require('./modules/jdParser');
const { parseTranscript } = require('./modules/transcriptParser');
const { evaluateWithGemini } = require('./modules/gemini');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to extract common skills from a resume text
function extractSkills(resumeText) {
    const KNOWN_SKILLS = [
        'javascript', 'python', 'java', 'c++', 'c#', 'react', 'node.js', 'express',
        'docker', 'kubernetes', 'aws', 'sql', 'nosql', 'mongodb', 'html', 'css',
        'tailwind', 'git', 'machine learning', 'data structures'
    ];

    // We want exact matches in a simple way.
    const textLower = resumeText.toLowerCase();
    return KNOWN_SKILLS.filter(skill => textLower.includes(skill.toLowerCase()));
}

// Setup Multer for PDF Uploads
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/parse-pdf', upload.single('resumePdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded.' });
        }
        const data = await pdfParse(req.file.buffer);
        res.json({ text: data.text });
    } catch (err) {
        console.error("PDF Parse Error:", err);
        res.status(500).json({ error: 'Failed to parse PDF file.' });
    }
});

app.post('/api/evaluate', async (req, res) => {
    try {
        const { resumeText, jdText, transcriptText, availableRolesText } = req.body;

        if (!resumeText || !jdText || !transcriptText) {
            return res.status(400).json({ error: 'Missing required text inputs.' });
        }

        // Call the real Gemini LLM
        const resultPayload = await evaluateWithGemini(resumeText, jdText, transcriptText, availableRolesText || "Full Stack Developer, Backend Developer, Frontend Developer");

        res.json(resultPayload);

    } catch (err) {
        console.error("Evaluation Error:", err);
        res.status(500).json({ error: err.message || 'Internal server error during evaluation.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
