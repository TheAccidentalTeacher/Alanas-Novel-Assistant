// Enhanced Content Control Service
// Addresses the unwanted character name generation issue

class ContentControlService {
    constructor() {
        this.logger = console;
        
        // CRITICAL: Default settings to prevent unwanted content generation
        this.settings = {
            disableAutomaticNameGeneration: true,
            disableContentGeneration: true,
            requireExplicitUserApproval: true,
            preserveOriginalContent: true,
            suggestionsOnly: true
        };
    }
    
    // Method to control character name detection and suggestions
    processCharacterNames(text, options = {}) {
        // Merge options with default settings
        const settings = { ...this.settings, ...options };
        
        // If automatic name generation is disabled, return null
        if (settings.disableAutomaticNameGeneration) {
            return {
                characterNames: null,
                generatedContent: null,
                detectedNames: this.detectPotentialCharacterNames(text),
                settings: settings
            };
        }
        
        // Otherwise, detect potential character names but don't generate new ones
        const detectedNames = this.detectPotentialCharacterNames(text);
        
        return {
            characterNames: null, // Never generate names automatically
            generatedContent: null, // Never generate content automatically
            detectedNames: detectedNames,
            settings: settings
        };
    }
    
    // Method to detect potential character names in text without generating new ones
    detectPotentialCharacterNames(text) {
        const names = [];
        const sentences = text.split(/[.!?]+/);
        
        // Common pronouns that might indicate character references
        const characterPronouns = [
            'he', 'she', 'him', 'her', 'his', 'hers', 'himself', 'herself'
        ];
        
        // Look for capitalized words that might be names
        const capitalizedWordPattern = /\b[A-Z][a-z]+\b/g;
        let match;
        
        while ((match = capitalizedWordPattern.exec(text)) !== null) {
            const potentialName = match[0];
            
            // Skip common non-name capitalized words
            if (this.isCommonNonName(potentialName)) {
                continue;
            }
            
            // Check if this word is used with character pronouns
            const isLikelyCharacter = sentences.some(sentence => {
                const lowerSentence = sentence.toLowerCase();
                return lowerSentence.includes(potentialName.toLowerCase()) && 
                       characterPronouns.some(pronoun => lowerSentence.includes(pronoun));
            });
            
            if (isLikelyCharacter) {
                // Check if this name is already in our list
                if (!names.some(name => name.name === potentialName)) {
                    names.push({
                        name: potentialName,
                        occurrences: this.countOccurrences(text, potentialName),
                        isConfirmed: false, // User needs to confirm
                        pronouns: this.detectPotentialPronouns(text, potentialName)
                    });
                }
            }
        }
        
        return names;
    }
    
    // Helper method to check if a word is a common non-name capitalized word
    isCommonNonName(word) {
        const commonNonNames = [
            'I', 'The', 'A', 'An', 'This', 'That', 'These', 'Those',
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December',
            'America', 'Europe', 'Asia', 'Africa', 'Australia',
            'North', 'South', 'East', 'West',
            'God', 'Lord', 'Internet', 'World', 'Earth', 'Moon', 'Sun'
        ];
        
        return commonNonNames.includes(word);
    }
    
    // Helper method to count occurrences of a word in text
    countOccurrences(text, word) {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        return (text.match(regex) || []).length;
    }
    
    // Helper method to detect potential pronouns associated with a character
    detectPotentialPronouns(text, name) {
        const sentences = text.split(/[.!?]+/);
        const nameRegex = new RegExp(`\\b${name}\\b`);
        const pronouns = { he: 0, she: 0, they: 0 };
        
        sentences.forEach(sentence => {
            if (nameRegex.test(sentence)) {
                const lowerSentence = sentence.toLowerCase();
                
                if (/\bhe\b|\bhim\b|\bhis\b|\bhimself\b/.test(lowerSentence)) {
                    pronouns.he++;
                }
                
                if (/\bshe\b|\bher\b|\bhers\b|\bherself\b/.test(lowerSentence)) {
                    pronouns.she++;
                }
                
                if (/\bthey\b|\bthem\b|\btheir\b|\bthemselves\b/.test(lowerSentence)) {
                    pronouns.they++;
                }
            }
        });
        
        // Determine most likely pronoun
        let likelyPronoun = null;
        let maxCount = 0;
        
        for (const [pronoun, count] of Object.entries(pronouns)) {
            if (count > maxCount) {
                maxCount = count;
                likelyPronoun = pronoun;
            }
        }
        
        return likelyPronoun;
    }
    
    // Method to generate character name suggestions (only when explicitly requested)
    generateCharacterNameSuggestions(detectedNames, genre = null) {
        // Only generate suggestions if explicitly requested
        if (this.settings.disableContentGeneration) {
            return [];
        }
        
        // This would normally use an AI model or database to generate suggestions
        // For now, we'll return a simple placeholder
        return detectedNames.map(character => {
            return {
                originalName: character.name,
                suggestions: [
                    `${character.name} (no suggestions - automatic generation disabled)`,
                ],
                requiresUserApproval: true
            };
        });
    }
    
    // Method to validate that no unwanted content generation occurred
    validateNoUnwantedGeneration(result) {
        const checks = [
            result.characterNames === null,
            result.generatedContent === null,
            result.settings.disableAutomaticNameGeneration === true,
            result.settings.disableContentGeneration === true
        ];
        
        return checks.every(check => check === true);
    }
    
    // Method to handle user-requested character name changes
    handleUserRequestedNameChange(text, oldName, newName) {
        // Only process if the user explicitly requested this change
        if (!oldName || !newName) {
            return text;
        }
        
        // Create a regex that matches the old name as a whole word
        const nameRegex = new RegExp(`\\b${oldName}\\b`, 'g');
        
        // Replace the old name with the new name
        return text.replace(nameRegex, newName);
    }
}

module.exports = { ContentControlService };