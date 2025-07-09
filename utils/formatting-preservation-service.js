// Enhanced Formatting Preservation Service
// Addresses the paragraph break loss issue

class FormattingPreservationService {
    constructor() {
        this.preserveLineBreaks = true;
        this.preserveParagraphBreaks = true;
        this.preserveWhitespace = true;
        this.preserveIndentation = true;
    }
    
    preserveFormatting(text) {
        // Create a detailed map of the text's formatting structure
        const formattingData = {
            originalLength: text.length,
            lineBreaks: this.detectLineBreaks(text),
            paragraphs: this.detectParagraphs(text),
            whitespace: this.detectWhitespace(text),
            indentation: this.detectIndentation(text),
            preservationMap: this.createPreservationMap(text)
        };
        
        return formattingData;
    }
    
    detectLineBreaks(text) {
        // Detect all line breaks in the text
        const lineBreaks = [];
        let index = text.indexOf('\n');
        
        while (index !== -1) {
            // Check if this is a single line break or part of a paragraph break
            const isParagraphBreak = (index > 0 && text[index - 1] === '\n') || 
                                    (index < text.length - 1 && text[index + 1] === '\n');
            
            lineBreaks.push({
                index: index,
                isParagraphBreak: isParagraphBreak
            });
            
            index = text.indexOf('\n', index + 1);
        }
        
        return lineBreaks;
    }
    
    detectParagraphs(text) {
        // Split text into paragraphs with detailed information
        const paragraphSeparator = /\n\s*\n/g;
        const paragraphs = [];
        let match;
        let lastIndex = 0;
        
        // Handle the case where text starts with paragraph breaks
        if (text.startsWith('\n\n')) {
            paragraphs.push({
                content: '',
                startIndex: 0,
                endIndex: 0,
                followedByBreak: true,
                precedingBreak: false,
                isEmpty: true
            });
            lastIndex = 2;
        }
        
        // Find all paragraph breaks and extract paragraphs
        while ((match = paragraphSeparator.exec(text)) !== null) {
            const paragraphText = text.substring(lastIndex, match.index).trim();
            
            paragraphs.push({
                content: paragraphText,
                startIndex: lastIndex,
                endIndex: match.index,
                followedByBreak: true,
                precedingBreak: lastIndex > 0,
                isEmpty: paragraphText.length === 0
            });
            
            lastIndex = match.index + match[0].length;
        }
        
        // Add the final paragraph
        if (lastIndex < text.length) {
            const paragraphText = text.substring(lastIndex).trim();
            
            paragraphs.push({
                content: paragraphText,
                startIndex: lastIndex,
                endIndex: text.length,
                followedByBreak: false,
                precedingBreak: lastIndex > 0,
                isEmpty: paragraphText.length === 0
            });
        }
        
        // Handle the case where text ends with paragraph breaks
        if (text.endsWith('\n\n')) {
            paragraphs.push({
                content: '',
                startIndex: text.length,
                endIndex: text.length,
                followedByBreak: false,
                precedingBreak: true,
                isEmpty: true
            });
        }
        
        return paragraphs;
    }
    
    detectWhitespace(text) {
        // Detect significant whitespace patterns
        const whitespacePatterns = [];
        
        // Detect multiple spaces (2 or more)
        const multipleSpaces = /( {2,})/g;
        let match;
        
        while ((match = multipleSpaces.exec(text)) !== null) {
            whitespacePatterns.push({
                type: 'multiple_spaces',
                index: match.index,
                length: match[0].length,
                content: match[0]
            });
        }
        
        // Detect tabs
        const tabs = /(\t+)/g;
        while ((match = tabs.exec(text)) !== null) {
            whitespacePatterns.push({
                type: 'tabs',
                index: match.index,
                length: match[0].length,
                content: match[0]
            });
        }
        
        return whitespacePatterns;
    }
    
    detectIndentation(text) {
        // Detect line indentation patterns
        const indentationPatterns = [];
        const lines = text.split('\n');
        let currentIndex = 0;
        
        for (const line of lines) {
            const leadingWhitespace = line.match(/^(\s+)/);
            
            if (leadingWhitespace) {
                indentationPatterns.push({
                    type: 'indentation',
                    index: currentIndex,
                    length: leadingWhitespace[0].length,
                    content: leadingWhitespace[0],
                    spaces: leadingWhitespace[0].replace(/\t/g, '    ').length
                });
            }
            
            currentIndex += line.length + 1; // +1 for the newline
        }
        
        return indentationPatterns;
    }
    
    createPreservationMap(text) {
        // Create a detailed map of all formatting elements
        const map = [];
        
        // Map newlines
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                // Check if this is part of a paragraph break
                const isParagraphBreak = (i > 0 && text[i - 1] === '\n') || 
                                        (i < text.length - 1 && text[i + 1] === '\n');
                
                map.push({ 
                    index: i, 
                    type: isParagraphBreak ? 'paragraph_break' : 'newline', 
                    preserve: true 
                });
            } else if (text[i] === '\t') {
                map.push({ index: i, type: 'tab', preserve: true });
            } else if (text[i] === ' ') {
                // Check for multiple spaces
                let spaceCount = 1;
                let j = i + 1;
                
                while (j < text.length && text[j] === ' ') {
                    spaceCount++;
                    j++;
                }
                
                if (spaceCount > 1) {
                    map.push({ 
                        index: i, 
                        type: 'multiple_spaces', 
                        count: spaceCount, 
                        preserve: true 
                    });
                    
                    i = j - 1; // Skip the counted spaces
                }
            }
        }
        
        return map;
    }
    
    restoreFormatting(text, formattingData) {
        // Restore formatting based on the preservation map
        let result = text;
        
        // First, restore paragraph breaks
        if (formattingData.paragraphs) {
            let offset = 0;
            
            for (const paragraph of formattingData.paragraphs) {
                if (paragraph.followedByBreak) {
                    // Find the end of this paragraph in the new text
                    const paragraphEnd = result.indexOf(paragraph.content) + paragraph.content.length + offset;
                    
                    // Insert paragraph break
                    result = result.substring(0, paragraphEnd) + '\n\n' + result.substring(paragraphEnd);
                    offset += 2; // Account for the added newlines
                }
            }
        }
        
        // Then restore other formatting elements
        if (formattingData.preservationMap) {
            // Sort the map in reverse order to avoid index shifting
            const sortedMap = [...formattingData.preservationMap].sort((a, b) => b.index - a.index);
            
            for (const item of sortedMap) {
                if (item.type === 'tab' && this.preserveIndentation) {
                    // Find the appropriate position in the new text
                    const position = this.findPositionInNewText(result, item.index, formattingData);
                    result = result.substring(0, position) + '\t' + result.substring(position);
                } else if (item.type === 'multiple_spaces' && this.preserveWhitespace) {
                    const position = this.findPositionInNewText(result, item.index, formattingData);
                    const spaces = ' '.repeat(item.count);
                    result = result.substring(0, position) + spaces + result.substring(position);
                }
            }
        }
        
        return result;
    }
    
    findPositionInNewText(newText, originalPosition, formattingData) {
        // Find the corresponding position in the new text based on the original position
        // This is a simplified implementation and might need refinement for complex cases
        
        // Find which paragraph this position was in
        const paragraph = formattingData.paragraphs.find(p => 
            originalPosition >= p.startIndex && originalPosition <= p.endIndex
        );
        
        if (!paragraph) {
            return originalPosition; // Fallback
        }
        
        // Calculate the offset within the paragraph
        const offsetInParagraph = originalPosition - paragraph.startIndex;
        
        // Find the start of this paragraph in the new text
        const newParagraphStart = newText.indexOf(paragraph.content);
        
        if (newParagraphStart === -1) {
            return originalPosition; // Fallback if paragraph not found
        }
        
        // Return the position in the new text
        return newParagraphStart + offsetInParagraph;
    }
    
    // Utility method to check if formatting is preserved
    validateFormattingPreservation(originalText, processedText) {
        // Check if paragraph count is preserved
        const originalParagraphs = originalText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const processedParagraphs = processedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        
        if (originalParagraphs.length !== processedParagraphs.length) {
            return {
                preserved: false,
                reason: `Paragraph count mismatch: original=${originalParagraphs.length}, processed=${processedParagraphs.length}`
            };
        }
        
        // Check if line break count is preserved
        const originalLineBreaks = (originalText.match(/\n/g) || []).length;
        const processedLineBreaks = (processedText.match(/\n/g) || []).length;
        
        if (originalLineBreaks !== processedLineBreaks) {
            return {
                preserved: false,
                reason: `Line break count mismatch: original=${originalLineBreaks}, processed=${processedLineBreaks}`
            };
        }
        
        // Check if paragraph content is preserved
        for (let i = 0; i < originalParagraphs.length; i++) {
            if (processedParagraphs[i].trim() !== originalParagraphs[i].trim()) {
                return {
                    preserved: false,
                    reason: `Paragraph content mismatch at index ${i}`
                };
            }
        }
        
        return {
            preserved: true,
            reason: 'All formatting preserved'
        };
    }
}

module.exports = { FormattingPreservationService };