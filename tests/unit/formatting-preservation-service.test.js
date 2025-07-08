// Unit tests for the Formatting Preservation Service

const { FormattingPreservationService } = require('../../backend/services/formatting-preservation-service');

describe('FormattingPreservationService', () => {
  let service;

  beforeEach(() => {
    service = new FormattingPreservationService();
  });

  describe('Paragraph Detection', () => {
    test('should correctly identify paragraphs with single line breaks', () => {
      const text = `First paragraph.
Second paragraph.
Third paragraph.`;

      const formattingData = service.preserveFormatting(text);
      
      // Should detect 1 paragraph since there are no empty lines between text
      expect(formattingData.paragraphs.length).toBe(1);
      expect(formattingData.paragraphs[0].content).toContain('First paragraph');
      expect(formattingData.paragraphs[0].content).toContain('Second paragraph');
      expect(formattingData.paragraphs[0].content).toContain('Third paragraph');
    });

    test('should correctly identify paragraphs with double line breaks', () => {
      const text = `First paragraph.

Second paragraph.

Third paragraph.`;

      const formattingData = service.preserveFormatting(text);
      
      // Should detect 3 paragraphs
      expect(formattingData.paragraphs.length).toBe(3);
      expect(formattingData.paragraphs[0].content).toBe('First paragraph.');
      expect(formattingData.paragraphs[1].content).toBe('Second paragraph.');
      expect(formattingData.paragraphs[2].content).toBe('Third paragraph.');
    });

    test('should handle mixed line breaks correctly', () => {
      const text = `First paragraph.
Still first paragraph.

Second paragraph.
Still second paragraph.

Third paragraph.`;

      const formattingData = service.preserveFormatting(text);
      
      // Should detect 3 paragraphs
      expect(formattingData.paragraphs.length).toBe(3);
      expect(formattingData.paragraphs[0].content).toContain('First paragraph');
      expect(formattingData.paragraphs[0].content).toContain('Still first paragraph');
      expect(formattingData.paragraphs[1].content).toContain('Second paragraph');
      expect(formattingData.paragraphs[1].content).toContain('Still second paragraph');
      expect(formattingData.paragraphs[2].content).toBe('Third paragraph.');
    });

    test('should handle empty paragraphs correctly', () => {
      const text = `First paragraph.

Second paragraph.


Third paragraph.`;

      const formattingData = service.preserveFormatting(text);
      
      // Should detect 3 paragraphs
      expect(formattingData.paragraphs.length).toBe(3);
      expect(formattingData.paragraphs[0].content).toBe('First paragraph.');
      expect(formattingData.paragraphs[1].content).toBe('Second paragraph.');
      expect(formattingData.paragraphs[2].content).toBe('Third paragraph.');
    });

    test('should handle text starting with empty lines', () => {
      const text = `

First paragraph.

Second paragraph.`;

      const formattingData = service.preserveFormatting(text);
      
      // Should detect 2 paragraphs
      expect(formattingData.paragraphs.length).toBe(2);
      expect(formattingData.paragraphs[0].content).toBe('First paragraph.');
      expect(formattingData.paragraphs[1].content).toBe('Second paragraph.');
    });

    test('should handle text ending with empty lines', () => {
      const text = `First paragraph.

Second paragraph.

`;

      const formattingData = service.preserveFormatting(text);
      
      // Should detect 2 paragraphs
      expect(formattingData.paragraphs.length).toBe(2);
      expect(formattingData.paragraphs[0].content).toBe('First paragraph.');
      expect(formattingData.paragraphs[1].content).toBe('Second paragraph.');
    });
  });

  describe('Whitespace Detection', () => {
    test('should detect and preserve multiple spaces', () => {
      const text = `First paragraph with  double  spaces.`;

      const formattingData = service.preserveFormatting(text);
      const whitespace = formattingData.whitespace;
      
      expect(whitespace).toBeDefined();
      expect(whitespace.length).toBeGreaterThan(0);
      
      // Find double space instances
      const doubleSpaces = whitespace.filter(w => w.type === 'multiple_spaces');
      expect(doubleSpaces.length).toBeGreaterThan(0);
    });

    test('should detect and preserve tabs', () => {
      const text = `First paragraph.\tTabbed content.`;

      const formattingData = service.preserveFormatting(text);
      const map = formattingData.preservationMap;
      
      expect(map).toBeDefined();
      
      // Find tab instances
      const tabs = map.filter(m => m.type === 'tab');
      expect(tabs.length).toBe(1);
    });
  });

  describe('Indentation Detection', () => {
    test('should detect and preserve line indentation', () => {
      const text = `First paragraph.
    Indented line.
        Double indented line.`;

      const formattingData = service.preserveFormatting(text);
      const indentation = formattingData.indentation;
      
      expect(indentation).toBeDefined();
      expect(indentation.length).toBe(2); // Two indented lines
      
      // Check indentation levels
      expect(indentation[0].spaces).toBe(4);
      expect(indentation[1].spaces).toBe(8);
    });
  });

  describe('Formatting Restoration', () => {
    test('should restore paragraph breaks correctly', () => {
      const originalText = `First paragraph.

Second paragraph.

Third paragraph.`;

      // Simulate text that lost paragraph breaks
      const modifiedText = `First paragraph.Second paragraph.Third paragraph.`;
      
      const formattingData = service.preserveFormatting(originalText);
      const restoredText = service.restoreFormatting(modifiedText, formattingData);
      
      // Check if paragraph breaks are restored
      expect(restoredText.split(/\n\s*\n/).length).toBe(3);
    });

    test('should validate formatting preservation correctly', () => {
      const originalText = `First paragraph.

Second paragraph.

Third paragraph.`;

      // Same text - should be preserved
      const validation = service.validateFormattingPreservation(originalText, originalText);
      expect(validation.preserved).toBe(true);
      
      // Modified text - should not be preserved
      const modifiedText = `First paragraph.Second paragraph.Third paragraph.`;
      const invalidValidation = service.validateFormattingPreservation(originalText, modifiedText);
      expect(invalidValidation.preserved).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long paragraphs', () => {
      // Create a very long paragraph
      const longText = 'This is a very long paragraph. '.repeat(100);
      
      const formattingData = service.preserveFormatting(longText);
      expect(formattingData.paragraphs.length).toBe(1);
      expect(formattingData.paragraphs[0].content.length).toBeGreaterThan(1000);
    });

    test('should handle text with unusual whitespace patterns', () => {
      const text = `First    paragraph  with   unusual    spacing.

Second\t\tparagraph\twith\tmultiple\ttabs.

Third paragraph with trailing spaces.   `;

      const formattingData = service.preserveFormatting(text);
      
      // Should detect 3 paragraphs
      expect(formattingData.paragraphs.length).toBe(3);
      
      // Should detect unusual whitespace
      const whitespace = formattingData.whitespace;
      expect(whitespace.length).toBeGreaterThan(0);
    });

    test('should handle empty text', () => {
      const text = '';
      
      const formattingData = service.preserveFormatting(text);
      expect(formattingData.paragraphs.length).toBe(0);
      expect(formattingData.lineBreaks).toBe(0);
    });

    test('should handle text with only whitespace', () => {
      const text = '   \n\n   \t\t\n   ';
      
      const formattingData = service.preserveFormatting(text);
      expect(formattingData.paragraphs.length).toBe(0);
      expect(formattingData.lineBreaks).toBeGreaterThan(0);
    });
  });
});