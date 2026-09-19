const { GoogleGenerativeAI } = require('@google/generative-ai');
const Policy = require('../models/Policy');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeRequest = async (title, description) => {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview' });

  // ── Step 1: Classify the request ──────────────────────────────────────────
  const classificationPrompt = `
You are an AI business operations classifier for a company. Analyze the following employee request and return ONLY a valid JSON object.

Title: "${title}"
Description: "${description}"

Return this exact JSON structure (no markdown, no extra text):
{
  "department": "HR|IT|Finance|General",
  "category": "short category name (e.g. VPN Issue, Hotel Expense, WFH Request)",
  "priority": "Low|Medium|High|Critical",
  "summary": "1-2 sentence summary of what the employee is requesting",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- HR: leave requests, WFH/remote work, onboarding, policy questions, payroll disputes
- IT: technical issues, software access, hardware, VPN, credentials
- Finance: reimbursements, expenses, invoices, budget requests, salary
- General: anything else that doesn't fit the above
`;

  const classificationResult = await model.generateContent(classificationPrompt);
  const classificationText = classificationResult.response.text().trim();

  // Parse JSON, stripping potential markdown code blocks
  let classification;
  try {
    const cleaned = classificationText.replace(/```json\n?|\n?```/g, '').trim();
    classification = JSON.parse(cleaned);
  } catch (e) {
    classification = {
      department: 'General',
      category: 'General Inquiry',
      priority: 'Medium',
      summary: description.substring(0, 150),
      keywords: [],
    };
  }

  // ── Step 2: Fetch matching policy from MongoDB ─────────────────────────────
  const policy = await Policy.findOne({ department: classification.department });
  const policyContext = policy
    ? `Policy Name: ${policy.name}
Description: ${policy.description}
Rules:
${policy.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}
${policy.autoApproveLimit ? `Auto-Approve Limit: ₹${policy.autoApproveLimit}` : ''}`
    : 'No specific policy found for this department. Use general company guidelines.';

  // ── Step 3: Make the decision ─────────────────────────────────────────────
  const decisionPrompt = `
You are an AI business operations agent. Based on the request and the applicable company policy, make a decision and generate a helpful response.

Employee Request:
Title: "${title}"
Description: "${description}"

AI Classification:
Department: ${classification.department}
Category: ${classification.category}
Priority: ${classification.priority}
Summary: ${classification.summary}

Applicable Policy:
${policyContext}

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "decision": "Auto Resolve|Human Review",
  "decisionReason": "brief reason for this decision",
  "recommendedAction": "what should be done next",
  "aiResponse": "a professional, helpful response message to the employee (2-4 sentences)"
}

Guidelines:
- Auto Resolve: IT common issues (VPN, passwords, software access), standard HR info requests, small expense claims under policy limit
- Human Review: large expense claims, policy exceptions, sensitive HR matters, unknown categories, Critical priority items
`;

  const decisionResult = await model.generateContent(decisionPrompt);
  const decisionText = decisionResult.response.text().trim();

  let decision;
  try {
    const cleaned = decisionText.replace(/```json\n?|\n?```/g, '').trim();
    decision = JSON.parse(cleaned);
  } catch (e) {
    decision = {
      decision: 'Human Review',
      decisionReason: 'Unable to automatically process this request',
      recommendedAction: 'Escalate to department manager',
      aiResponse: 'Your request has been received and will be reviewed by the appropriate team.',
    };
  }

  // ── Step 4: Build final analysis object ───────────────────────────────────
  return {
    department: classification.department,
    category: classification.category,
    priority: classification.priority,
    summary: classification.summary,
    relevantPolicy: policy ? policy.name : 'General Policy',
    recommendedAction: decision.recommendedAction,
    aiResponse: decision.aiResponse,
    decision: decision.decision,
    decisionReason: decision.decisionReason,
  };
};

module.exports = { analyzeRequest };
