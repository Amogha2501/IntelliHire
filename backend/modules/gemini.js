const { GoogleGenAI } = require('@google/genai');

async function evaluateWithGemini(resumeText, jdText, transcriptText, availableRolesText) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
-------------------You are an Autonomous AI Interview Panel.

Your job is to evaluate a candidate based on:
1) Resume
2) Interview Transcript
3) Job Description
4) Available Roles

You must behave like a real interview panel consisting of:
- Technical Interviewer (focus on technical depth)
- HR Interviewer (focus on communication and clarity)
- System Evaluator (focus on consistency, scoring, and decision)

----------------------------------------

INPUT:
Resume:
${resumeText}

Transcript:
${transcriptText}

Job Description:
${jdText}

Available Roles:
${availableRolesText}

----------------------------------------

TASKS TO PERFORM:

1. RESUME ANALYSIS
- Extract key skills
- Identify claimed technologies
- Identify experience level

2. TRANSCRIPT ANALYSIS
- Evaluate correctness of answers
- Check clarity of communication
- Identify weak or vague explanations

3. BLUFF DETECTION (VERY IMPORTANT)
- Compare resume claims with transcript answers
- Detect:
  - Contradictions
  - Incorrect explanations
  - Overstated skills

4. SKILL-WISE SCORING (0–100)
Provide scores for:
- DSA
- Backend
- Database
- Communication

5. OVERALL EVALUATION
Generate:
- Final Verdict (Hire / No Hire)
- Overall Score (0–100)
- Confidence Score (Low / Medium / High)

6. STRENGTHS & WEAKNESSES
- List key strengths
- List key weaknesses

7. DECISION EXPLANATION (CRITICAL)
Provide:
- 2 critical mistakes
- 1 contradiction
- 1 strong area

8. MULTI-AGENT PANEL DISCUSSION (SIMULATION)
Simulate a short discussion:

Format:
Tech Lead: <technical feedback>
HR: <communication feedback>
System: <final reasoning>

Agents may disagree before final decision.

9. ROLE RECOMMENDATION
If candidate is not suitable for the given role:
- Suggest alternative roles from available roles
- Provide:
  - role_name
  - match_score (0–100)
  - reason

----------------------------------------

OUTPUT FORMAT (STRICT JSON):

{
  "resume_analysis": {
    "skills": ["<string>"],
    "experience_summary": "<string>",
    "key_claims": ["<string>"]
  },
  "transcript_analysis": {
    "technical_accuracy": "<string>",
    "communication_quality": "<string>",
    "issues_detected": ["<string>"]
  },
  "bluff_detection": {
    "bluff_found": true,
    "details": ["<string>"]
  },
  "skill_scores": {
    "dsa": 0,
    "backend": 0,
    "database": 0,
    "communication": 0
  },
  "final_decision": {
    "verdict": "<Hire | No Hire>",
    "overall_score": 0,
    "confidence_score": "<Low | Medium | High>",
    "strength_summary": "<string>",
    "weakness_summary": "<string>"
  },
  "decision_explanation": {
    "critical_mistakes": ["<string>"],
    "contradiction": "<string>",
    "strong_area": "<string>"
  },
  "panel_discussion": [
    {
      "role": "Tech Lead",
      "message": "<string>"
    },
    {
      "role": "HR",
      "message": "<string>"
    },
    {
      "role": "System",
      "message": "<string>"
    }
  ],
  "role_recommendation": {
    "recommended_roles": [
      {
        "role_name": "<string>",
        "match_score": 0,
        "reason": "<string>"
      }
    ]
  }
}

----------------------------------------

IMPORTANT RULES:
- Be strict and realistic like a real interviewer
- Do not be overly positive
- Detect even small inconsistencies
- Ensure reasoning is clear and explainable
- Keep responses concise but insightful
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2
    }
  });

  let jsonStr = response.text;
  // Clean up markdown wrapping if present
  if (jsonStr.startsWith('\`\`\`json')) {
    jsonStr = jsonStr.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
  } else if (jsonStr.startsWith('\`\`\`')) {
    jsonStr = jsonStr.replace(/\`\`\`/g, '');
  }

  try {
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    console.error("Failed to parse Gemini JSON:", jsonStr);
    throw new Error("Failed to parse AI response into JSON format.");
  }
}

module.exports = { evaluateWithGemini };
