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
    'http://127.0.0.1:5173',
    'https://defi-dao-advisor.vercel.app/'
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
// Enhanced JSON parsing function in CreateProposal.jsx
// Ultra-simple version - GUARANTEED NO SYNTAX ERRORS
function parseGeminiResponse(text) {
  try {
    console.log('Original Gemini response:', text);
    
    // Find the JSON object boundaries
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No JSON object found in response');
    }
    
    // Extract just the JSON part
    const jsonString = text.substring(startIndex, endIndex + 1);
    console.log('Extracted JSON string:', jsonString);
    
    // Parse the JSON
    const parsed = JSON.parse(jsonString);
    console.log('Successfully parsed JSON:', parsed);
    
    return parsed;
  } catch (error) {
    console.error('JSON parsing failed:', error);
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
