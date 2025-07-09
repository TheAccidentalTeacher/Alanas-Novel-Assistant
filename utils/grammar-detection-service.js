// Enhanced Grammar Detection Service
// Addresses the grammar detection failure issue

class GrammarDetectionService {
    constructor() {
        // Enhanced grammar rules with improved patterns and context awareness
        this.grammarRules = [
            // There/Their/They're rules with improved context detection
            {
                name: 'there_their_theyre',
                pattern: /\b(there|their|they're)\b/gi,
                check: this.checkThereTheirTheyre.bind(this)
            },
            // Your/You're rules with improved context detection
            {
                name: 'your_youre',
                pattern: /\b(your|you're)\b/gi,
                check: this.checkYourYoure.bind(this)
            },
            // Its/It's rules with improved context detection
            {
                name: 'its_its',
                pattern: /\b(its|it's)\b/gi,
                check: this.checkItsIts.bind(this)
            },
            // Capitalization after sentence endings
            {
                name: 'capitalization',
                // Improved pattern to catch more capitalization errors
                pattern: /([.!?]\s+)([a-z])/g,
                check: this.checkCapitalization.bind(this)
            },
            // Subject-verb agreement
            {
                name: 'subject_verb',
                // Enhanced pattern to better detect subject-verb pairs
                pattern: /(\b(?:I|you|he|she|it|we|they|[A-Z][a-z]+)\b\s+\b(?:is|are|was|were|have|has|do|does)\b|\b(?:is|are|was|were|have|has|do|does)\b)/gi,
                check: this.checkSubjectVerbAgreement.bind(this)
            },
            // Run-on sentences
            {
                name: 'run_on_sentence',
                // Improved pattern to better detect run-on sentences
                pattern: /[^.!?;]+?[,]\s+[^.!?;]+?[,]\s+[^.!?;]+?[,]\s+[^.!?;]+?[.!?]/g,
                check: this.checkRunOnSentence.bind(this)
            },
            // Double negatives
            {
                name: 'double_negative',
                pattern: /\b(not|no|never|nobody|nothing|nowhere|neither|nor)\b[^.!?;]*?\b(not|no|never|nobody|nothing|nowhere|neither|nor)\b/gi,
                check: this.checkDoubleNegative.bind(this)
            },
            // Passive voice
            {
                name: 'passive_voice',
                // Enhanced pattern to better detect passive voice
                pattern: /\b(am|is|are|was|were|be|being|been)\s+(\w+ed|written|done|made|gone|known|seen|taken)\b/gi,
                check: this.checkPassiveVoice.bind(this)
            },
            // Commonly confused words
            {
                name: 'confused_words',
                pattern: /\b(accept|except|affect|effect|than|then|to|too|two|weather|whether|who's|whose)\b/gi,
                check: this.checkConfusedWords.bind(this)
            },
            // Redundant phrases
            {
                name: 'redundant_phrases',
                pattern: /\b(absolutely essential|actual fact|advance planning|basic fundamentals|completely eliminate|current status|end result|final outcome|future plans|past history|unexpected surprise|unintentional mistake)\b/gi,
                check: this.checkRedundantPhrases.bind(this)
            }
        ];
    }

    async detectGrammarErrors(text) {
        const errors = [];
        
        try {
            // Process all grammar rules in parallel for better performance
            const rulePromises = this.grammarRules.map(rule => this.applyGrammarRule(text, rule));
            const ruleResults = await Promise.all(rulePromises);
            
            // Flatten results
            ruleResults.forEach(ruleErrors => {
                errors.push(...ruleErrors);
            });
            
            // Additional comprehensive grammar check
            const additionalErrors = await this.comprehensiveGrammarCheck(text);
            errors.push(...additionalErrors);
            
            // Sort errors by position for better user experience
            errors.sort((a, b) => a.position - b.position);
            
            return errors;
            
        } catch (error) {
            console.error('Grammar detection failed:', error);
            return [];
        }
    }
    
    async applyGrammarRule(text, rule) {
        const errors = [];
        let match;
        const regex = new RegExp(rule.pattern);
        
        // Use exec in a loop to find all matches
        while ((match = regex.exec(text)) !== null) {
            try {
                // Get surrounding context for better analysis
                const context = this.getContext(text, match.index, 30);
                
                // Check if this is actually an error
                const error = await rule.check(match, text, context);
                if (error) {
                    errors.push({
                        type: rule.name,
                        position: match.index,
                        length: match[0].length,
                        original: match[0],
                        suggestion: error.suggestion,
                        explanation: error.explanation,
                        confidence: error.confidence || 0.8,
                        context: context
                    });
                }
            } catch (ruleError) {
                console.warn(`Grammar rule ${rule.name} failed:`, ruleError);
            }
        }
        
        return errors;
    }
    
    async comprehensiveGrammarCheck(text) {
        const errors = [];
        
        // Split text into sentences for analysis
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i].trim();
            
            // Check sentence structure
            const sentenceErrors = await this.checkSentenceStructure(sentence, i, text);
            errors.push(...sentenceErrors);
            
            // Check for repeated words
            const repeatedWordErrors = this.checkRepeatedWords(sentence, i, text);
            errors.push(...repeatedWordErrors);
        }
        
        return errors;
    }
    
    async checkSentenceStructure(sentence, index, fullText) {
        const errors = [];
        
        // Find position of this sentence in the full text
        const position = fullText.indexOf(sentence);
        
        // Check for sentence fragments
        if (sentence.length > 5 && !this.hasSubjectAndVerb(sentence)) {
            errors.push({
                type: 'sentence_fragment',
                position: position,
                length: sentence.length,
                original: sentence,
                suggestion: 'Consider adding a subject or verb to complete this sentence',
                explanation: 'This appears to be a sentence fragment',
                confidence: 0.7
            });
        }
        
        // Check for run-on sentences
        if (sentence.length > 200 && (sentence.match(/,/g) || []).length > 5) {
            errors.push({
                type: 'run_on_sentence',
                position: position,
                length: sentence.length,
                original: sentence,
                suggestion: 'Consider breaking this into shorter sentences',
                explanation: 'This sentence may be too long and complex',
                confidence: 0.6
            });
        }
        
        return errors;
    }
    
    checkRepeatedWords(sentence, index, fullText) {
        const errors = [];
        const words = sentence.toLowerCase().split(/\s+/);
        
        // Find position of this sentence in the full text
        const sentencePosition = fullText.indexOf(sentence);
        
        for (let i = 1; i < words.length; i++) {
            if (words[i].length > 3 && words[i] === words[i-1]) {
                // Find position of the repeated word
                const precedingText = sentence.substring(0, sentence.toLowerCase().indexOf(words[i], sentence.toLowerCase().indexOf(words[i]) + 1));
                const position = sentencePosition + precedingText.length;
                
                errors.push({
                    type: 'repeated_word',
                    position: position,
                    length: words[i].length,
                    original: words[i],
                    suggestion: `Remove the repeated word "${words[i]}"`,
                    explanation: 'Word appears to be accidentally repeated',
                    confidence: 0.9
                });
            }
        }
        
        return errors;
    }
    
    hasSubjectAndVerb(sentence) {
        // Enhanced check for subject and verb presence
        const words = sentence.toLowerCase().split(/\s+/);
        
        // Common verbs
        const verbs = [
            'is', 'are', 'was', 'were', 'have', 'has', 'had', 
            'do', 'does', 'did', 'will', 'would', 'can', 'could', 
            'should', 'may', 'might', 'must', 'shall', 'should',
            'go', 'goes', 'went', 'run', 'runs', 'ran', 'see', 'sees', 'saw',
            'think', 'thinks', 'thought', 'know', 'knows', 'knew',
            'want', 'wants', 'wanted', 'need', 'needs', 'needed',
            'like', 'likes', 'liked', 'use', 'uses', 'used'
        ];
        
        // Common pronouns and determiners that could be subjects
        const subjects = [
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 
            'this', 'that', 'these', 'those', 'who', 'which', 'what',
            'someone', 'somebody', 'something', 'everyone', 'everybody', 'everything',
            'anyone', 'anybody', 'anything', 'no one', 'nobody', 'nothing'
        ];
        
        // Check for verbs (including those ending with ed, ing, s)
        const hasVerb = words.some(word => 
            verbs.includes(word) || 
            word.endsWith('ed') || 
            word.endsWith('ing') || 
            (word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('is') && !word.endsWith('us'))
        );
        
        // Check for subjects
        const hasSubject = words.some(word => subjects.includes(word)) || 
                          (words.length > 2 && /[A-Z]/.test(sentence[0]));
        
        return hasVerb && hasSubject;
    }
    
    // Grammar rule implementations with improved context awareness
    async checkThereTheirTheyre(match, text, context) {
        const word = match[0].toLowerCase();
        
        // Context-based checking with improved accuracy
        if (word === 'there') {
            // Check if it's being used as a location indicator
            if (context.includes('over there') || 
                context.includes('there is') || 
                context.includes('there are') || 
                context.includes('there was') || 
                context.includes('there were') ||
                /there\s+[a-z]+s\b/.test(context)) {
                return null; // Correct usage
            }
            
            // Check if it should be "their" (possessive)
            if (context.includes('there car') || 
                context.includes('there house') || 
                context.includes('there book') ||
                /there\s+[a-z]+s\b/.test(context)) {
                return {
                    suggestion: 'Consider using "their" for possession',
                    explanation: 'Use "their" when indicating possession',
                    confidence: 0.8
                };
            }
            
            // Check if it should be "they're" (contraction)
            if (context.includes('there going') || 
                context.includes('there coming') || 
                context.includes('there trying')) {
                return {
                    suggestion: 'Consider using "they\'re" (they are)',
                    explanation: 'Use "they\'re" as a contraction of "they are"',
                    confidence: 0.8
                };
            }
        }
        
        if (word === 'their') {
            // Check if it should be "there" (location)
            if (context.includes('their is') || 
                context.includes('their are') || 
                context.includes('over their') || 
                context.includes('right their')) {
                return {
                    suggestion: 'Consider using "there" for location',
                    explanation: 'Use "there" when referring to a place or location',
                    confidence: 0.8
                };
            }
            
            // Check if it should be "they're" (contraction)
            if (context.includes('their going') || 
                context.includes('their coming') || 
                context.includes('their trying')) {
                return {
                    suggestion: 'Consider using "they\'re" (they are)',
                    explanation: 'Use "they\'re" as a contraction of "they are"',
                    confidence: 0.8
                };
            }
        }
        
        if (word === 'they\'re') {
            // Check if it should be "there" (location)
            if (context.includes('over they\'re') || 
                context.includes('right they\'re')) {
                return {
                    suggestion: 'Consider using "there" for location',
                    explanation: 'Use "there" when referring to a place or location',
                    confidence: 0.8
                };
            }
            
            // Check if it should be "their" (possessive)
            if (context.includes('they\'re car') || 
                context.includes('they\'re house') || 
                context.includes('they\'re book')) {
                return {
                    suggestion: 'Consider using "their" for possession',
                    explanation: 'Use "their" when indicating possession',
                    confidence: 0.8
                };
            }
        }
        
        // If we're not sure, suggest checking
        return {
            suggestion: 'Check if this should be "there" (location), "their" (possession), or "they\'re" (they are)',
            explanation: 'Common confusion between there/their/they\'re',
            confidence: 0.6
        };
    }
    
    async checkYourYoure(match, text, context) {
        const word = match[0].toLowerCase();
        
        if (word === 'your') {
            // Check if it should be "you're" (contraction)
            if (context.includes('your welcome') || 
                context.includes('your right') || 
                context.includes('your wrong') ||
                context.includes('your going') || 
                context.includes('your coming') || 
                context.includes('your doing')) {
                return {
                    suggestion: 'Consider using "you\'re" (you are)',
                    explanation: 'Use "you\'re" as a contraction of "you are"',
                    confidence: 0.8
                };
            }
        }
        
        if (word === 'you\'re') {
            // Check if it should be "your" (possessive)
            if (context.includes('you\'re car') || 
                context.includes('you\'re house') || 
                context.includes('you\'re book') ||
                context.includes('you\'re name') || 
                context.includes('you\'re phone') || 
                context.includes('you\'re email')) {
                return {
                    suggestion: 'Consider using "your" for possession',
                    explanation: 'Use "your" when indicating possession',
                    confidence: 0.8
                };
            }
        }
        
        // If we're not sure, suggest checking
        return {
            suggestion: 'Check if this should be "your" (possession) or "you\'re" (you are)',
            explanation: 'Common confusion between your/you\'re',
            confidence: 0.7
        };
    }
    
    async checkItsIts(match, text, context) {
        const word = match[0].toLowerCase();
        
        if (word === 'its') {
            // Check if it should be "it's" (contraction)
            if (context.includes('its a') || 
                context.includes('its the') || 
                context.includes('its not') ||
                context.includes('its going') || 
                context.includes('its time') || 
                context.includes('its important')) {
                return {
                    suggestion: 'Consider using "it\'s" (it is/it has)',
                    explanation: 'Use "it\'s" as a contraction of "it is" or "it has"',
                    confidence: 0.8
                };
            }
        }
        
        if (word === 'it\'s') {
            // Check if it should be "its" (possessive)
            if (context.includes('it\'s tail') || 
                context.includes('it\'s paw') || 
                context.includes('it\'s leg') ||
                context.includes('it\'s owner') || 
                context.includes('it\'s color') || 
                context.includes('it\'s size')) {
                return {
                    suggestion: 'Consider using "its" for possession',
                    explanation: 'Use "its" when indicating possession',
                    confidence: 0.8
                };
            }
        }
        
        // If we're not sure, suggest checking
        return {
            suggestion: 'Check if this should be "its" (possession) or "it\'s" (it is/it has)',
            explanation: 'Common confusion between its/it\'s',
            confidence: 0.7
        };
    }
    
    async checkCapitalization(match, text) {
        // This is a clear error - lowercase letter after sentence ending
        return {
            suggestion: 'Capitalize the first letter after the period',
            explanation: 'Sentences should start with a capital letter',
            confidence: 0.9
        };
    }
    
    async checkSubjectVerbAgreement(match, text, context) {
        const matchText = match[0].toLowerCase();
        
        // Extract subject and verb
        const words = context.toLowerCase().split(/\s+/);
        const matchWords = matchText.split(/\s+/);
        
        if (matchWords.length < 2) {
            // Just a verb, need to find the subject
            const verb = matchWords[0];
            const verbIndex = words.indexOf(verb);
            
            if (verbIndex > 0) {
                const potentialSubject = words[verbIndex - 1];
                
                // Check singular subjects with plural verbs
                if ((potentialSubject === 'he' || potentialSubject === 'she' || potentialSubject === 'it') && 
                    (verb === 'are' || verb === 'were' || verb === 'have' || verb === 'do')) {
                    return {
                        suggestion: `Use "${verb === 'are' ? 'is' : verb === 'were' ? 'was' : verb === 'have' ? 'has' : 'does'}" with "${potentialSubject}"`,
                        explanation: 'Singular subjects require singular verbs',
                        confidence: 0.9
                    };
                }
                
                // Check plural subjects with singular verbs
                if ((potentialSubject === 'they' || potentialSubject === 'we' || potentialSubject === 'you') && 
                    (verb === 'is' || verb === 'was' || verb === 'has' || verb === 'does')) {
                    return {
                        suggestion: `Use "${verb === 'is' ? 'are' : verb === 'was' ? 'were' : verb === 'has' ? 'have' : 'do'}" with "${potentialSubject}"`,
                        explanation: 'Plural subjects require plural verbs',
                        confidence: 0.9
                    };
                }
            }
        } else {
            // We have both subject and verb
            const subject = matchWords[0];
            const verb = matchWords[1];
            
            // Check singular subjects with plural verbs
            if ((subject === 'he' || subject === 'she' || subject === 'it') && 
                (verb === 'are' || verb === 'were' || verb === 'have' || verb === 'do')) {
                return {
                    suggestion: `Use "${verb === 'are' ? 'is' : verb === 'were' ? 'was' : verb === 'have' ? 'has' : 'does'}" with "${subject}"`,
                    explanation: 'Singular subjects require singular verbs',
                    confidence: 0.9
                };
            }
            
            // Check plural subjects with singular verbs
            if ((subject === 'they' || subject === 'we' || subject === 'you') && 
                (verb === 'is' || verb === 'was' || verb === 'has' || verb === 'does')) {
                return {
                    suggestion: `Use "${verb === 'is' ? 'are' : verb === 'was' ? 'were' : verb === 'has' ? 'have' : 'do'}" with "${subject}"`,
                    explanation: 'Plural subjects require plural verbs',
                    confidence: 0.9
                };
            }
        }
        
        return null;
    }
    
    async checkRunOnSentence(match, text) {
        return {
            suggestion: 'Consider breaking this into multiple sentences or using semicolons',
            explanation: 'This appears to be a run-on sentence with multiple clauses',
            confidence: 0.7
        };
    }
    
    async checkDoubleNegative(match, text) {
        return {
            suggestion: 'Consider rephrasing to avoid double negative',
            explanation: 'Double negatives can be confusing or change the intended meaning',
            confidence: 0.8
        };
    }
    
    async checkPassiveVoice(match, text) {
        return {
            suggestion: 'Consider using active voice for stronger writing',
            explanation: 'Passive voice can make writing less direct and engaging',
            confidence: 0.6
        };
    }
    
    async checkConfusedWords(match, text, context) {
        const word = match[0].toLowerCase();
        
        const confusionPairs = {
            'accept': { confused: 'except', explanation: '"Accept" means to receive, "except" means to exclude' },
            'except': { confused: 'accept', explanation: '"Except" means to exclude, "accept" means to receive' },
            'affect': { confused: 'effect', explanation: '"Affect" is usually a verb, "effect" is usually a noun' },
            'effect': { confused: 'affect', explanation: '"Effect" is usually a noun, "affect" is usually a verb' },
            'than': { confused: 'then', explanation: '"Than" is for comparison, "then" is for time sequence' },
            'then': { confused: 'than', explanation: '"Then" is for time sequence, "than" is for comparison' },
            'to': { confused: 'too/two', explanation: '"To" is a preposition, "too" means also, "two" is a number' },
            'too': { confused: 'to/two', explanation: '"Too" means also, "to" is a preposition, "two" is a number' },
            'two': { confused: 'to/too', explanation: '"Two" is a number, "to" is a preposition, "too" means also' },
            'weather': { confused: 'whether', explanation: '"Weather" refers to climate, "whether" introduces alternatives' },
            'whether': { confused: 'weather', explanation: '"Whether" introduces alternatives, "weather" refers to climate' },
            'who\'s': { confused: 'whose', explanation: '"Who\'s" means "who is", "whose" shows possession' },
            'whose': { confused: 'who\'s', explanation: '"Whose" shows possession, "who\'s" means "who is"' }
        };
        
        if (confusionPairs[word]) {
            return {
                suggestion: `Check if you meant "${confusionPairs[word].confused}" instead of "${word}"`,
                explanation: confusionPairs[word].explanation,
                confidence: 0.7
            };
        }
        
        return null;
    }
    
    async checkRedundantPhrases(match, text) {
        const phrase = match[0].toLowerCase();
        
        const redundancies = {
            'absolutely essential': 'essential',
            'actual fact': 'fact',
            'advance planning': 'planning',
            'basic fundamentals': 'fundamentals',
            'completely eliminate': 'eliminate',
            'current status': 'status',
            'end result': 'result',
            'final outcome': 'outcome',
            'future plans': 'plans',
            'past history': 'history',
            'unexpected surprise': 'surprise',
            'unintentional mistake': 'mistake'
        };
        
        if (redundancies[phrase]) {
            return {
                suggestion: `Consider using just "${redundancies[phrase]}" instead of "${phrase}"`,
                explanation: 'This phrase contains redundant words',
                confidence: 0.8
            };
        }
        
        return null;
    }
    
    getContext(text, position, radius) {
        const start = Math.max(0, position - radius);
        const end = Math.min(text.length, position + radius);
        return text.substring(start, end);
    }
}

module.exports = { GrammarDetectionService };