/**
 * Rule-based evaluator with detailed explanations
 */
const EVAL_RULES = [
    { 
        keyword: 'docker', 
        badWords: ['virtual machine', 'vm'], 
        requiredWords: ['container', 'image', 'compose'],
        correctConcept: 'Docker uses containers, not virtual machines. Containerization is lightweight and shares the host OS kernel.'
    },
    { 
        keyword: 'react', 
        badWords: ['jquery', 'backend', 'database'], 
        requiredWords: ['component', 'state', 'hook', 'virtual dom', 'props'],
        correctConcept: 'React is a frontend library based on components and state management, not a backend tool.'
    },
    { 
        keyword: 'node', 
        badWords: ['browser', 'frontend', 'html'], 
        requiredWords: ['runtime', 'javascript', 'v8', 'express', 'async', 'event loop'],
        correctConcept: 'Node.js is a server-side JavaScript runtime built on the V8 engine.'
    },
    { 
        keyword: 'sql', 
        badWords: ['nosql', 'document', 'mongo'], 
        requiredWords: ['relational', 'table', 'query', 'join', 'select'],
        correctConcept: 'SQL databases are relational and use tables with strict schemas, unlike document-based NoSQL.'
    },
    {
        keyword: 'nosql',
        badWords: ['relational', 'join', 'table'],
        requiredWords: ['document', 'key-value', 'flexible', 'mongo', 'collection'],
        correctConcept: 'NoSQL databases are non-relational and typically use flexible document structures.'
    },
    {
        keyword: 'kubernetes',
        badWords: ['browser', 'frontend'],
        requiredWords: ['orchestration', 'cluster', 'pods', 'deployment', 'scaling'],
        correctConcept: 'Kubernetes is a container orchestration system used to automate deployment and scaling.'
    },
    {
        keyword: 'api',
        badWords: ['frontend', 'css', 'html'],
        requiredWords: ['rest', 'endpoints', 'json', 'interface', 'http', 'graphql'],
        correctConcept: 'An API acts as an interface between systems typically using HTTP, REST, or JSON endpoints.'
    },
    {
        keyword: 'python',
        badWords: ['compiled', 'markup', 'css'],
        requiredWords: ['interpreted', 'scripting', 'django', 'flask', 'data', 'pandas'],
        correctConcept: 'Python is a high-level, interpreted programming language known for readbility and data handling.'
    },
    {
        keyword: 'cloud',
        badWords: ['local', 'usb', 'desktop'],
        requiredWords: ['aws', 'azure', 'gcp', 'serverless', 'scaling', 'infrastructure'],
        correctConcept: 'Cloud computing involves on-demand availability of computer system resources, heavily emphasizing scalability.'
    },
    {
        keyword: 'agile',
        badWords: ['waterfall', 'documentation first', 'rigid'],
        requiredWords: ['scrum', 'sprints', 'iterative', 'kanban', 'adapt'],
        correctConcept: 'Agile is an iterative methodology prioritizing rapid delivery, sprints, and continuous adaptation.'
    }
];

function evaluateAnswers(qnaPairs) {
    return qnaPairs.map(qna => {
        let status = 'partial'; // default
        const textLower = qna.answer.toLowerCase();
        const questionLower = qna.question.toLowerCase();

        // Extract key words from question to use as a fallback topic
        const questionWords = questionLower.replace(/[^a-z0-9\s]/g, '').split(' ').filter(w => w.length > 4);

        // Find matching rule based on question text
        const rule = EVAL_RULES.find(r => questionLower.includes(r.keyword));

        let resultReason = "";
        let topic = rule ? rule.keyword : (questionWords[0] || "general");

        if (rule) {
            // Use strict word boundaries so "vm" doesn't catch inside "vml"
            const hasBad = rule.badWords.some(w => new RegExp(`\\b${w}\\b`, 'i').test(textLower));
            const hasReq = rule.requiredWords.some(w => new RegExp(`\\b${w}\\b`, 'i').test(textLower));

            if (hasBad) {
                status = 'incorrect';
                resultReason = `${rule.correctConcept} This indicates a fundamental misunderstanding.`;
            } else if (hasReq) {
                status = 'correct';
                resultReason = `Candidate successfully explained key concepts of ${rule.keyword}.`;
            } else if (textLower.includes("don't know") || textLower.includes("not sure") || textLower.length < 15) {
                status = 'incorrect';
                resultReason = `Candidate admitted lack of knowledge or provided extremely vague answer about ${rule.keyword}.`;
            } else {
                status = 'partial';
                resultReason = `Answer regarding ${rule.keyword} is surface-level and lacks core technical components.`;
            }
        } else {
            // Generic robust logic for unknown inputs
            const reasoningWords = ["because", "therefore", "however", "additionally", "for example", "meaning"];
            const demonstratesReasoning = reasoningWords.some(w => textLower.includes(w));

            if (textLower.includes("don't know") || textLower.includes("not sure") || textLower.includes("no idea")) {
                status = 'incorrect';
                resultReason = "Candidate voluntarily admitted a lack of knowledge on this topic.";
            } else if (textLower.length < 25) {
                status = 'incorrect';
                resultReason = "Answer is too brief to demonstrate technical competency.";
            } else {
                // Check if they repeat question words to make sure they are on topic
                const matchesTopic = questionWords.some(w => textLower.includes(w));
                
                if (matchesTopic && textLower.length > 50 && demonstratesReasoning) {
                    status = 'correct';
                    resultReason = "Answer is detailed, well-reasoned, and contextually relevant to the question.";
                } else if (matchesTopic) {
                    status = 'partial';
                    resultReason = "Answer is relevant but lacks sufficient in-depth technical reasoning.";
                } else {
                    status = 'partial';
                    resultReason = "Answer is coherent but connection to the core question is tenuous.";
                }
            }
        }

        return {
            topic,
            question: qna.question,
            answer: qna.answer,
            status,
            reason: resultReason
        };
    });
}

module.exports = { evaluateAnswers };
