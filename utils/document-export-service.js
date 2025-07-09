// Enhanced Document Export Service
// Addresses the Word document export corruption issue

class DocumentExportService {
    constructor() {
        this.logger = console;
    }
    
    async exportToWord(text, options = {}) {
        try {
            // Ensure docx library is available
            let Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, PageBreak;
            
            try {
                const docx = require('docx');
                Document = docx.Document;
                Paragraph = docx.Paragraph;
                TextRun = docx.TextRun;
                Packer = docx.Packer;
                HeadingLevel = docx.HeadingLevel;
                AlignmentType = docx.AlignmentType;
                PageBreak = docx.PageBreak;
            } catch (error) {
                this.logger.error('docx library not available:', error);
                throw new Error('Word export library not available');
            }
            
            // Parse options
            const {
                title = 'Document',
                author = 'Enhanced Novel Crafter',
                fontSize = 12,
                fontFamily = 'Times New Roman',
                lineSpacing = 1.15,
                pageMargins = {
                    top: 1440,    // 1 inch (in twips)
                    right: 1440,  // 1 inch
                    bottom: 1440, // 1 inch
                    left: 1440    // 1 inch
                }
            } = options;
            
            // Preserve paragraph structure with enhanced handling
            const paragraphs = this.parseParagraphs(text);
            
            // Create document elements
            const docElements = [];
            
            // Add title if provided
            if (title) {
                docElements.push(
                    new Paragraph({
                        text: title,
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: {
                            after: 400 // Space after title
                        }
                    })
                );
            }
            
            // Process each paragraph
            paragraphs.forEach((paragraphText, index) => {
                // Skip empty paragraphs but preserve their breaks
                if (!paragraphText.trim()) {
                    docElements.push(
                        new Paragraph({
                            children: [],
                            spacing: {
                                after: 200 // Space for empty paragraph
                            }
                        })
                    );
                    return;
                }
                
                // Handle special paragraph types
                if (paragraphText.startsWith('# ')) {
                    // Heading 1
                    docElements.push(
                        new Paragraph({
                            text: paragraphText.substring(2),
                            heading: HeadingLevel.HEADING_1,
                            spacing: {
                                before: 240,
                                after: 120
                            }
                        })
                    );
                } else if (paragraphText.startsWith('## ')) {
                    // Heading 2
                    docElements.push(
                        new Paragraph({
                            text: paragraphText.substring(3),
                            heading: HeadingLevel.HEADING_2,
                            spacing: {
                                before: 240,
                                after: 120
                            }
                        })
                    );
                } else if (paragraphText.startsWith('### ')) {
                    // Heading 3
                    docElements.push(
                        new Paragraph({
                            text: paragraphText.substring(4),
                            heading: HeadingLevel.HEADING_3,
                            spacing: {
                                before: 240,
                                after: 120
                            }
                        })
                    );
                } else if (paragraphText.startsWith('---')) {
                    // Page break
                    docElements.push(new PageBreak());
                } else {
                    // Regular paragraph
                    docElements.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: paragraphText.trim(),
                                    size: fontSize * 2, // Convert to half-points
                                    font: fontFamily
                                })
                            ],
                            spacing: {
                                after: 200, // Space after paragraph
                                line: Math.round(lineSpacing * 240) // Line spacing (240 = single spacing)
                            }
                        })
                    );
                }
            });
            
            // Create the document
            const doc = new Document({
                creator: author,
                title: title,
                description: 'Document created by Enhanced Novel Crafter',
                sections: [{
                    properties: {
                        page: {
                            margin: pageMargins
                        }
                    },
                    children: docElements
                }]
            });
            
            // Generate buffer
            const buffer = await Packer.toBuffer(doc);
            
            // Validate the generated document
            if (buffer.length < 100) {
                throw new Error('Generated document is too small, likely corrupted');
            }
            
            this.logger.info('Word document generated successfully', {
                size: buffer.length,
                paragraphs: paragraphs.length
            });
            
            return buffer;
            
        } catch (error) {
            this.logger.error('Word export failed:', error);
            
            // Fallback: Generate plain text file
            return this.exportAsPlainText(text);
        }
    }
    
    parseParagraphs(text) {
        // Enhanced paragraph parsing with preservation of empty paragraphs
        const result = [];
        let currentParagraph = '';
        
        // Split by double newlines (paragraph breaks)
        const rawParagraphs = text.split(/\n\s*\n/);
        
        // Process each paragraph
        rawParagraphs.forEach(paragraph => {
            // Preserve empty paragraphs
            if (!paragraph.trim()) {
                result.push('');
                return;
            }
            
            // Handle paragraphs with single line breaks
            const lines = paragraph.split('\n');
            
            if (lines.length === 1) {
                // Simple paragraph
                result.push(paragraph);
            } else {
                // Paragraph with line breaks
                // In Word, we'll preserve these as a single paragraph
                result.push(paragraph);
            }
        });
        
        return result;
    }
    
    exportAsPlainText(text) {
        // Fallback export as plain text
        const header = '# Enhanced Novel Crafter Export\n\n';
        const footer = '\n\n---\nExported from Enhanced Novel Crafter';
        
        return Buffer.from(header + text + footer, 'utf8');
    }
    
    async exportToPDF(text, options = {}) {
        try {
            // Check if we have PDF export capabilities
            const { exec } = require('child_process');
            const fs = require('fs');
            const path = require('path');
            const os = require('os');
            
            // Create a temporary HTML file
            const tempDir = os.tmpdir();
            const tempHtmlPath = path.join(tempDir, `export-${Date.now()}.html`);
            const tempPdfPath = path.join(tempDir, `export-${Date.now()}.pdf`);
            
            // Convert text to HTML
            const html = this.textToHtml(text, options);
            
            // Write HTML to temp file
            fs.writeFileSync(tempHtmlPath, html);
            
            // Convert HTML to PDF using wkhtmltopdf
            return new Promise((resolve, reject) => {
                exec(`wkhtmltopdf "${tempHtmlPath}" "${tempPdfPath}"`, (error, stdout, stderr) => {
                    // Clean up HTML file
                    try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
                    
                    if (error) {
                        this.logger.error('PDF export failed:', error);
                        reject(new Error('PDF export failed'));
                        return;
                    }
                    
                    // Read the PDF file
                    try {
                        const pdfBuffer = fs.readFileSync(tempPdfPath);
                        
                        // Clean up PDF file
                        try { fs.unlinkSync(tempPdfPath); } catch (e) {}
                        
                        resolve(pdfBuffer);
                    } catch (readError) {
                        reject(readError);
                    }
                });
            });
            
        } catch (error) {
            this.logger.error('PDF export failed:', error);
            
            // Fallback: Generate plain text file
            return this.exportAsPlainText(text);
        }
    }
    
    textToHtml(text, options = {}) {
        const {
            title = 'Document',
            fontFamily = 'Times New Roman, serif',
            fontSize = '12pt',
            lineHeight = '1.5'
        } = options;
        
        // Convert paragraphs to HTML
        const paragraphs = text.split(/\n\s*\n/);
        const htmlParagraphs = paragraphs.map(p => {
            if (!p.trim()) return '<p>&nbsp;</p>';
            
            // Handle special formatting
            if (p.startsWith('# ')) {
                return `<h1>${this.escapeHtml(p.substring(2))}</h1>`;
            } else if (p.startsWith('## ')) {
                return `<h2>${this.escapeHtml(p.substring(3))}</h2>`;
            } else if (p.startsWith('### ')) {
                return `<h3>${this.escapeHtml(p.substring(4))}</h3>`;
            } else if (p.startsWith('---')) {
                return '<hr>';
            } else {
                // Replace single line breaks with <br>
                const withLineBreaks = p.replace(/\n/g, '<br>');
                return `<p>${this.escapeHtml(withLineBreaks)}</p>`;
            }
        }).join('\n');
        
        // Create complete HTML document
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${this.escapeHtml(title)}</title>
    <style>
        body {
            font-family: ${fontFamily};
            font-size: ${fontSize};
            line-height: ${lineHeight};
            margin: 1in;
        }
        h1, h2, h3 {
            font-family: ${fontFamily};
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        p {
            margin-bottom: 0.5em;
            text-align: justify;
        }
        hr {
            page-break-before: always;
            border: none;
            margin: 0;
            padding: 0;
        }
        @page {
            margin: 1in;
        }
    </style>
</head>
<body>
    <h1>${this.escapeHtml(title)}</h1>
    ${htmlParagraphs}
</body>
</html>`;
    }
    
    escapeHtml(text) {
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        
        return text.replace(/[&<>"']/g, char => htmlEscapes[char]);
    }
    
    // Validate exported document
    validateExportedDocument(buffer) {
        // Basic validation
        if (!buffer || buffer.length < 100) {
            return {
                valid: false,
                reason: 'Document is too small or empty'
            };
        }
        
        // Check for common Word document signatures
        const signature = buffer.slice(0, 4).toString('hex');
        if (signature !== '504b0304') { // ZIP file signature (DOCX is a ZIP file)
            return {
                valid: false,
                reason: 'Invalid document signature'
            };
        }
        
        return {
            valid: true,
            size: buffer.length
        };
    }
}

module.exports = { DocumentExportService };