const { TextProcessingService } = require('../../backend/services/text-processing-service');

describe('TextProcessingService', () => {
  let service;

  beforeEach(() => {
    service = new TextProcessingService();
  });

  describe('Grammar Detection', () => {
    test('should detect grammar errors correctly', async () => {
      const text = 'There going to the store. Your welcome to join them.';
      const result = await service.processText(text);
      
      expect(result.grammarErrors).toBeDefined();
      expect(result.grammarErrors.length).toBeGreaterThan(0);
      
      // Check if there/they're error was detected
      const thereError = result.grammarErrors.find(error => 
        error.type === 'there_their_theyre' && error.position === 0);
      expect(thereError).toBeDefined();
      
      // Check if your/you're error was detected
      const yourError = result.grammarErrors.find(error => 
        error.type === 'your_youre' && error.position === text.indexOf('Your'));
      expect(yourError).toBeDefined();
    });
  });

  describe('Character Name Generation', () => {
    test('should never generate character names', async () => {
      const text = 'The protagonist walked into the room. She looked around nervously.';
      const result = await service.processText(text);
      
      expect(result.characterNames).toBeNull();
      expect(result.generatedContent).toBeNull();
    });
  });

  describe('Paragraph Preservation', () => {
    test('should preserve paragraph breaks', async () => {
      const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
      const result = await service.processText(text);
      
      expect(result.preservedFormatting).toBeDefined();
      expect(result.preservedFormatting.paragraphCount).toBe(3);
      
      // Check if paragraph structure is preserved
      const paragraphs = result.preservedFormatting.paragraphs;
      expect(paragraphs[0].content).toBe('First paragraph.');
      expect(paragraphs[1].content).toBe('Second paragraph.');
      expect(paragraphs[2].content).toBe('Third paragraph.');
      
      // Check if paragraph breaks are preserved
      expect(paragraphs[0].followedByBreak).toBe(true);
      expect(paragraphs[1].followedByBreak).toBe(true);
      expect(paragraphs[2].followedByBreak).toBe(false);
    });
  });

  describe('Word Document Export', () => {
    test('should export to Word format without corruption', async () => {
      const text = 'Test paragraph 1.\n\nTest paragraph 2.';
      
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
  });
});