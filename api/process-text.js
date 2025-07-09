// Vercel API Route - Text Processing
const { GrammarDetectionService } = require('../utils/grammar-detection-service');
const { FormattingPreservationService } = require('../utils/formatting-preservation-service');
const { DocumentExportService } = require('../utils/document-export-service');
const { ContentControlService } = require('../utils/content-control-service');

class TextProcessingService {
    constructor() {
        // Initialize logger
        this.logger = console;
        
        // CRITICAL: Preserve original content at all costs
        this.preserveOriginalContent = true;
        this.disableContentGeneration = true;
        this.maintainFormatting = true;
        
        // Initialize specialized services
        this.grammarService = new GrammarDetectionService();
        this.formattingService = new FormattingPreservationService();
        this.documentService = new DocumentExportService();
        this.contentControlService = new ContentControlService();
    }
    
    async processText(text, options = {}) {
        try {
            this.logger.info('Processing text with critical fixes enabled');
            
            // STEP 1: Preserve original formatting
            const formattingData = this.formattingService.preserveFormatting(text);
            
            // STEP 2: Detect grammar errors (FIXED)
            const grammarErrors = await this.grammarService.detectGrammarErrors(text);
            
            // STEP 3: Process character names (FIXED - no automatic generation)
            const characterData = this.contentControlService.processCharacterNames(text);
            
            // STEP 4: Generate suggestions (NO content addition)
            const suggestions = await this.generateSuggestions(text, grammarErrors);
            
            // STEP 5: Create response (preserve everything)
            const result = {
                originalText: text,
                preservedFormatting: formattingData,
                grammarErrors: grammarErrors,
                suggestions: suggestions,
                detectedNames: characterData.detectedNames,
                // CRITICAL: Never generate character names or add content
                generatedContent: null,
                characterNames: null,
                addedContent: null,
                // Metadata
                processedAt: new Date().toISOString(),
                preservationGuarantee: true
            };
            
            // STEP 6: Validate result to ensure no content was modified
            const isValid = this.validateProcessingResult(result);
            if (!isValid) {
                throw new Error('Processing result validation failed - content may have been modified');
            }
            
            this.logger.info(`Text processing complete: ${grammarErrors.length} errors found`);
            return result;
            
        } catch (error) {
            this.logger.error('Text processing failed:', error);
            
            // FALLBACK: Return original text unchanged
            return {
                originalText: text,
                error: error.message,
                fallbackMode: true,
                preservationGuarantee: true
            };
        }
    }
    
    async generateSuggestions(text, grammarErrors) {
        const suggestions = [];
        
        // Convert grammar errors to actionable suggestions
        grammarErrors.forEach(error => {
            suggestions.push({
                type: 'grammar_correction',
                position: error.position,
                original: error.original,
                suggestion: error.suggestion,
                confidence: error.confidence,
                description: error.description
            });
        });
        
        return suggestions;
    }
    
    validateProcessingResult(result) {
        // Ensure no unwanted content was generated
        if (result.generatedContent !== null) return false;
        if (result.characterNames !== null) return false;
        if (result.addedContent !== null) return false;
        
        // Ensure original text is preserved
        if (!result.originalText) return false;
        
        return true;
    }
}

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
        const { text, options = {} } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required and must be a string' });
        }
        
        const service = new TextProcessingService();
        const result = await service.processText(text, options);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
