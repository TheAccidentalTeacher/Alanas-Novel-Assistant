// Integration tests for the Enhanced Novel Crafter text processing service

const { TextProcessingService } = require('../../backend/services/text-processing-service');

describe('TextProcessingService Integration Tests', () => {
  let service;

  beforeEach(() => {
    service = new TextProcessingService();
  });

  describe('End-to-End Text Processing', () => {
    test('should process text with all fixes applied', async () => {
      // Sample text with various issues to test all fixes
      const text = `There are many problems in this text. Your going to find them.

Its important to check you're grammar. The cat and the dog is running around the yard.

This sentence has no capitalization. this is another example.

I don't have nothing to say about this. The book was wrote by the author last year.

The protagonist walked into the room. She looked around nervously.`;

      const result = await service.processText(text);

      // Verify the result structure
      expect(result).toBeDefined();
      expect(result.originalText).toBe(text);
      expect(result.preservationGuarantee).toBe(true);
      expect(result.generatedContent).toBeNull();
      expect(result.characterNames).toBeNull();

      // Verify grammar detection
      expect(result.grammarErrors).toBeDefined();
      expect(result.grammarErrors.length).toBeGreaterThan(0);

      // Verify formatting preservation
      expect(result.preservedFormatting).toBeDefined();
      expect(result.preservedFormatting.paragraphCount).toBe(5);

      // Verify suggestions
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions.every(s => s.autoApply === false)).toBe(true);
      expect(result.suggestions.every(s => s.requiresUserApproval === true)).toBe(true);

      // Verify character name detection without generation
      expect(result.detectedNames).toBeDefined();
      const protagonist = result.detectedNames.find(name => name.name === 'She');
      expect(protagonist).toBeDefined();
    });

    test('should preserve paragraph breaks in complex text', async () => {
      const text = `First paragraph with some content.

Second paragraph with
multiple lines
of text.

Third paragraph after double line break.


Fourth paragraph after triple line break.

Fifth paragraph.`;

      const result = await service.processText(text);

      // Verify paragraph preservation
      expect(result.preservedFormatting.paragraphCount).toBe(5);
      
      // Check that each paragraph is correctly identified
      expect(result.preservedFormatting.paragraphs[0].content).toContain('First paragraph');
      expect(result.preservedFormatting.paragraphs[1].content).toContain('Second paragraph');
      expect(result.preservedFormatting.paragraphs[2].content).toContain('Third paragraph');
      expect(result.preservedFormatting.paragraphs[3].content).toContain('Fourth paragraph');
      expect(result.preservedFormatting.paragraphs[4].content).toContain('Fifth paragraph');
      
      // Verify paragraph breaks are preserved
      expect(result.preservedFormatting.paragraphs[0].followedByBreak).toBe(true);
      expect(result.preservedFormatting.paragraphs[1].followedByBreak).toBe(true);
      expect(result.preservedFormatting.paragraphs[2].followedByBreak).toBe(true);
      expect(result.preservedFormatting.paragraphs[3].followedByBreak).toBe(true);
      expect(result.preservedFormatting.paragraphs[4].followedByBreak).toBe(false);
    });
  });

  describe('Grammar Detection', () => {
    test('should detect common grammar errors', async () => {
      const text = `Your going to love this. There car is over their. Its a great day.`;

      const result = await service.processText(text);

      // Check for your/you're error
      const yourError = result.grammarErrors.find(e => 
        e.type === 'your_youre' && e.position === text.indexOf('Your'));
      expect(yourError).toBeDefined();

      // Check for there/their/they're error
      const theirError = result.grammarErrors.find(e => 
        e.type === 'there_their_theyre' && e.position === text.indexOf('There'));
      expect(theirError).toBeDefined();

      // Check for its/it's error
      const itsError = result.grammarErrors.find(e => 
        e.type === 'its_its' && e.position === text.indexOf('Its'));
      expect(itsError).toBeDefined();
    });

    test('should detect subject-verb agreement errors', async () => {
      const text = `The dog and cat is playing. They is happy.`;

      const result = await service.processText(text);

      // Check for subject-verb agreement errors
      const svError = result.grammarErrors.find(e => 
        e.type === 'subject_verb' && e.original.includes('is'));
      expect(svError).toBeDefined();
    });

    test('should detect capitalization errors', async () => {
      const text = `This is a sentence. this should be capitalized.`;

      const result = await service.processText(text);

      // Check for capitalization errors
      const capError = result.grammarErrors.find(e => 
        e.type === 'capitalization');
      expect(capError).toBeDefined();
    });
  });

  describe('Character Name Handling', () => {
    test('should detect character names without generating new ones', async () => {
      const text = `John walked into the room. He sat down at his desk. 
      Mary entered shortly after. She greeted John with a smile.`;

      const result = await service.processText(text);

      // Verify character names are detected but not generated
      expect(result.characterNames).toBeNull();
      
      // Check detected names
      expect(result.detectedNames).toBeDefined();
      expect(result.detectedNames.length).toBeGreaterThan(0);
      
      const john = result.detectedNames.find(name => name.name === 'John');
      const mary = result.detectedNames.find(name => name.name === 'Mary');
      
      expect(john).toBeDefined();
      expect(mary).toBeDefined();
      expect(john.occurrences).toBe(2);
    });

    test('should never generate character names automatically', async () => {
      const text = `The protagonist entered the room quietly. She looked around nervously.
      The antagonist was waiting. He smiled coldly.`;

      const result = await service.processText(text);

      // Verify no character names are generated
      expect(result.characterNames).toBeNull();
      expect(result.generatedContent).toBeNull();
    });
  });

  describe('Document Export', () => {
    test('should export to Word format with preserved formatting', async () => {
      const text = `Title

First paragraph with some content.

Second paragraph with
multiple lines
of text.

Third paragraph.`;

      // Mock the docx library if it's not available in the test environment
      jest.mock('docx', () => ({
        Document: jest.fn().mockImplementation(() => ({})),
        Paragraph: jest.fn().mockImplementation(() => ({})),
        TextRun: jest.fn().mockImplementation(() => ({})),
        Packer: {
          toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-docx-content'))
        }
      }));

      try {
        const buffer = await service.exportToWord(text);
        expect(buffer).toBeDefined();
        expect(buffer.length).toBeGreaterThan(0);
      } catch (error) {
        // If docx library is not available, this test will be skipped
        if (error.message !== 'Word export library not available') {
          throw error;
        }
      }
    });

    test('should fall back to plain text export if Word export fails', async () => {
      const text = `Sample text for export.`;

      // Force Word export to fail
      jest.spyOn(service.documentService, 'exportToWord').mockImplementation(() => {
        throw new Error('Export failed');
      });

      const buffer = await service.exportToWord(text);
      expect(buffer).toBeDefined();
      expect(buffer.toString()).toContain(text);
      expect(buffer.toString()).toContain('Enhanced Novel Crafter Export');
    });
  });

  describe('Error Handling and Fallbacks', () => {
    test('should handle errors gracefully and preserve original text', async () => {
      const text = `Sample text for error testing.`;

      // Force an error in processing
      jest.spyOn(service.grammarService, 'detectGrammarErrors').mockImplementation(() => {
        throw new Error('Grammar detection failed');
      });

      const result = await service.processText(text);
      expect(result).toBeDefined();
      expect(result.originalText).toBe(text);
      expect(result.error).toBeDefined();
      expect(result.fallbackMode).toBe(true);
      expect(result.preservationGuarantee).toBe(true);
    });

    test('should never modify original text even when errors occur', async () => {
      const text = `Original text that should never be modified.`;

      // Force multiple errors
      jest.spyOn(service.grammarService, 'detectGrammarErrors').mockImplementation(() => {
        throw new Error('Grammar detection failed');
      });
      
      jest.spyOn(service.formattingService, 'preserveFormatting').mockImplementation(() => {
        throw new Error('Formatting preservation failed');
      });

      const result = await service.processText(text);
      expect(result.originalText).toBe(text);
      expect(result.preservationGuarantee).toBe(true);
    });
  });
});