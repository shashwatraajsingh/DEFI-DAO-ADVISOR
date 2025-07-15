// backend/server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// AI Summarization endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { title, description, proposalType } = req.body;
    
    const prompt = `
    Analyze this DAO proposal and provide a comprehensive analysis in JSON format:
    
    Proposal Title: ${title}
    Proposal Description: ${description}
    Proposal Type: ${proposalType}
    
    Please provide:
    1. A concise TL;DR (2-3 sentences)
    2. Risk Assessment (High/Medium/Low with detailed explanation)
    3. Key considerations for voters (array of 3-4 important points)
    
    Format your response as valid JSON with keys: tldr, riskLevel, riskExplanation, keyConsiderations
    
    Example format:
    {
      "tldr": "Brief summary of the proposal",
      "riskLevel": "Medium", 
      "riskExplanation": "Detailed explanation of risks",
      "keyConsiderations": ["Point 1", "Point 2", "Point 3"]
    }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const analysis = JSON.parse(text);
    
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
    res.status(500).json({
      success: false,
      error: 'Failed to analyze proposal with Gemini AI'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    aiProvider: 'Google Gemini'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT} with Gemini AI`);
});
