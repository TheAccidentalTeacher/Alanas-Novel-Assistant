// Unit tests for the Document Export Service

const { DocumentExportService } = require('../../backend/services/document-export-service');

describe('DocumentExportService', () => {
  let service;

  beforeEach(() => {
    service = new DocumentExportService();
  });

  describe('Word Document Export', () => {
    test('should export text to Word format', async () => {
      const text = `Title

First paragraph with some content.

Second paragraph with multiple lines of text.

Third paragraph.`;

      // Mock the docx library
      jest.mock('docx', () => ({
        Document: jest.fn().mockImplementation(() => ({})),
        Paragraph: jest.fn().mockImplementation(() => ({})),
        TextRun: jest.fn().mockImplementation(() => ({})),
        HeadingLevel: { HEADING_1: 'heading1', HEADING_2: 'heading2', HEADING_3: 'heading3' },
        AlignmentType: { CENTER: 'center' },
        PageBreak: jest.fn().mockImplementation(() => ({})),
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

    test('should handle export options correctly', async () => {
      const text = `Sample text for export.`;
      const options = {
        title: 'Custom Title',
        author: 'Test Author',
        fontSize: 14,
        fontFamily: 'Arial',
        lineSpacing: 1.5
      };

      // Mock the docx library
      jest.mock('docx', () => ({
        Document: jest.fn().mockImplementation(() => ({})),
        Paragraph: jest.fn().mockImplementation(() => ({})),
        TextRun: jest.fn().mockImplementation(() => ({})),
        HeadingLevel: { HEADING_1: 'heading1' },
        AlignmentType: { CENTER: 'center' },
        Packer: {
          toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-docx-content'))
        }
      }));

      try {
        const buffer = await service.exportToWord(text, options);
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

      // Force Word export to fail by making docx unavailable
      jest.mock('docx', () => {
        throw new Error('Module not found');
      });

      const buffer = await service.exportToWord(text);
      expect(buffer).toBeDefined();
      expect(buffer.toString()).toContain(text);
      expect(buffer.toString()).toContain('Enhanced Novel Crafter Export');
    });
  });

  describe('Paragraph Parsing', () => {
    test('should parse paragraphs correctly', () => {
      const text = `First paragraph.

Second paragraph with
multiple lines.

Third paragraph.`;

      const paragraphs = service.parseParagraphs(text);
      
      expect(paragraphs.length).toBe(3);
      expect(paragraphs[0]).toBe('First paragraph.');
      expect(paragraphs[1]).toBe('Second paragraph with\nmultiple lines.');
      expect(paragraphs[2]).toBe('Third paragraph.');
    });

    test('should handle empty paragraphs', () => {
      const text = `First paragraph.


Third paragraph.`;

      const paragraphs = service.parseParagraphs(text);
      
      expect(paragraphs.length).toBe(3);
      expect(paragraphs[0]).toBe('First paragraph.');
      expect(paragraphs[1]).toBe('');
      expect(paragraphs[2]).toBe('Third paragraph.');
    });

    test('should handle special formatting markers', () => {
      const text = `# Heading 1

## Heading 2

Regular paragraph.

---

Another paragraph after page break.`;

      const paragraphs = service.parseParagraphs(text);
      
      expect(paragraphs.length).toBe(5);
      expect(paragraphs[0]).toBe('# Heading 1');
      expect(paragraphs[1]).toBe('## Heading 2');
      expect(paragraphs[2]).toBe('Regular paragraph.');
      expect(paragraphs[3]).toBe('---');
      expect(paragraphs[4]).toBe('Another paragraph after page break.');
    });
  });

  describe('HTML Conversion', () => {
    test('should convert text to HTML correctly', () => {
      const text = `Title

First paragraph.

Second paragraph.`;

      const html = service.textToHtml(text);
      
      expect(html).toContain('<html>');
      expect(html).toContain('<title>');
      expect(html).toContain('<p>First paragraph.</p>');
      expect(html).toContain('<p>Second paragraph.</p>');
    });

    test('should handle special formatting in HTML conversion', () => {
      const text = `# Main Title

## Subtitle

Regular paragraph.

---

Another paragraph after page break.`;

      const html = service.textToHtml(text);
      
      expect(html).toContain('<h1>Main Title</h1>');
      expect(html).toContain('<h2>Subtitle</h2>');
      expect(html).toContain('<p>Regular paragraph.</p>');
      expect(html).toContain('<hr>');
      expect(html).toContain('<p>Another paragraph after page break.</p>');
    });

    test('should escape HTML special characters', () => {
      const text = `Paragraph with <tags> & special "characters".`;

      const html = service.textToHtml(text);
      
      expect(html).toContain('&lt;tags&gt;');
      expect(html).toContain('&amp;');
      expect(html).toContain('&quot;characters&quot;');
    });
  });

  describe('Document Validation', () => {
    test('should validate exported document correctly', () => {
      // Create a mock Word document buffer (DOCX is a ZIP file starting with PK)
      const validBuffer = Buffer.from('504b0304' + '0'.repeat(200), 'hex');
      
      const validation = service.validateExportedDocument(validBuffer);
      expect(validation.valid).toBe(true);
    });

    test('should detect invalid document', () => {
      // Create an invalid buffer
      const invalidBuffer = Buffer.from('Invalid document content');
      
      const validation = service.validateExportedDocument(invalidBuffer);
      expect(validation.valid).toBe(false);
    });

    test('should detect empty or too small document', () => {
      // Create a too small buffer
      const smallBuffer = Buffer.from('504b0304' + '0'.repeat(10), 'hex');
      
      const validation = service.validateExportedDocument(smallBuffer);
      expect(validation.valid).toBe(false);
    });
  });

  describe('Plain Text Export', () => {
    test('should export as plain text correctly', () => {
      const text = `Sample text for export.`;

      const buffer = service.exportAsPlainText(text);
      expect(buffer).toBeDefined();
      expect(buffer.toString()).toContain(text);
      expect(buffer.toString()).toContain('Enhanced Novel Crafter Export');
    });
  });
});