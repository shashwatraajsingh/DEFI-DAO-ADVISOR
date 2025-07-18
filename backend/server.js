// backend/server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
};
app.use(cors());
app.use(express.json());

// Initialize Gemini AI with current model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Simple JSON parsing function WITHOUT regex
function parseGeminiResponse(text) {
  try {
    console.log('Original Gemini response:', text);
    
    // Clean the text using only string methods (NO REGEX)
    let cleanText = text.trim();
    
    // Remove markdown code blocks using string methods
  while (cleanText.includes('```'))
  cleanText = cleanText.replace('```json', '');

while (cleanText.includes('```'))
  cleanText = cleanText.replace('```javascript', '');

while (cleanText.includes('```'))
  cleanText = cleanText.replace('```', '');

while (cleanText.includes('`')) {
  cleanText = cleanText.replace('`', '');
}
    
    // Remove extra whitespace
    cleanText = cleanText.trim();
    
    // Remove leading "json" text if present
    if (cleanText.toLowerCase().startsWith('json')) {
      cleanText = cleanText.substring(4).trim();
    }
    
    // Extract JSON object
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
    
    console.log('Cleaned text:', cleanText);
    
    // Parse the cleaned JSON
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw error;
  }
}

// AI Summarization endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { title, description, proposalType } = req.body;
    
    console.log('Received request:', { title, description, proposalType });
    
    // Create a simple, direct prompt
    const prompt = `Analyze this DAO proposal and return only valid JSON:

Title: ${title}
Description: ${description}
Type: ${proposalType}

Return exactly this format with no extra text or markdown:
{"tldr":"Your summary here","riskLevel":"Medium","riskExplanation":"Your explanation","keyConsiderations":["Point 1","Point 2","Point 3"]}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    // Parse the response
    const analysis = parseGeminiResponse(text);
    
    // Validate required fields
    if (!analysis.tldr || !analysis.riskLevel || !analysis.riskExplanation || !analysis.keyConsiderations) {
      throw new Error('Missing required fields in AI response');
    }
    
    res.json({
      success: true,
      analysis: {
        tldr: analysis.tldr,
        riskLevel: analysis.riskLevel,
        riskExplanation: analysis.riskExplanation,
        keyConsiderations: analysis.keyConsiderations
      }
    });
    
  } catch (error) {
    console.error('Gemini AI Analysis Error:', error);
    
    // Fallback response
    const proposalTypeText = req.body.proposalType || 'governance';
    const titleText = req.body.title || 'Untitled Proposal';
    
    res.json({
      success: true,
      analysis: {
        tldr: `This ${proposalTypeText} proposal titled "${titleText}" requires careful evaluation of its potential impact on the protocol and community.`,
        riskLevel: "Medium",
        riskExplanation: "The proposal involves changes that could affect protocol operations and user experience. Proper testing and community consensus are essential before implementation.",
        keyConsiderations: [
          "Community consensus and stakeholder alignment are crucial",
          "Technical feasibility and security implications need review",
          "Economic impact on tokenomics and treasury requires analysis",
          "Implementation timeline should be realistic and well-planned"
        ]
      }
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    aiProvider: 'Google Gemini',
    model: 'gemini-2.0-flash'
  });
});

// Simple test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const testPrompt = 'Return only this JSON: {"message":"Hello World","status":"OK"}';
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({
      success: true,
      rawResponse: text,
      cleanedResponse: parseGeminiResponse(text)
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Backend server running on port ' + PORT + ' with Gemini AI');
  console.log('Health check: http://localhost:' + PORT + '/api/health');
  console.log('Test endpoint: http://localhost:' + PORT + '/api/test');
});
