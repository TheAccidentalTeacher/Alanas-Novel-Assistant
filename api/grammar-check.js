// Vercel API Route - Grammar Check
const { GrammarDetectionService } = require('../utils/grammar-detection-service');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required and must be a string' });
        }
        
        const grammarService = new GrammarDetectionService();
        const grammarErrors = await grammarService.detectGrammarErrors(text);
        
        res.status(200).json({
            text: text,
            errors: grammarErrors,
            errorCount: grammarErrors.length,
            processedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Grammar Check Error:', error);
        res.status(500).json({ error: 'Grammar check failed', message: error.message });
    }
}
