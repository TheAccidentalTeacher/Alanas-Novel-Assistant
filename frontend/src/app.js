// Enhanced Novel Crafter - Testing Interface

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const textEditor = document.getElementById('text-editor');
    const processTextBtn = document.getElementById('process-text');
    const exportWordBtn = document.getElementById('export-word');
    const clearTextBtn = document.getElementById('clear-text');
    const grammarResults = document.getElementById('grammar-results');
    const formattingResults = document.getElementById('formatting-results');
    const suggestionsResults = document.getElementById('suggestions-results');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Sample text for testing
    const sampleText = `There are many problems in this text. Your going to find them.

Its important to check you're grammar. The cat and the dog is running around the yard.

This sentence has no capitalization. this is another example.

I don't have nothing to say about this. The book was wrote by the author last year.

The protagonist walked into the room. She looked around nervously.`;

    // Initialize with sample text
    textEditor.value = sampleText;

    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Process Text Button
    processTextBtn.addEventListener('click', async () => {
        const text = textEditor.value;
        if (!text.trim()) {
            alert('Please enter some text to process.');
            return;
        }

        try {
            // Show loading state
            processTextBtn.disabled = true;
            processTextBtn.textContent = 'Processing...';
            
            // Call the text processing service
            const result = await processText(text);
            
            // Display results
            displayGrammarResults(result.grammarErrors);
            displayFormattingResults(result.preservedFormatting);
            displaySuggestions(result.suggestions);
            
            // Reset button
            processTextBtn.disabled = false;
            processTextBtn.textContent = 'Process Text';
        } catch (error) {
            console.error('Error processing text:', error);
            alert('An error occurred while processing the text. Please try again.');
            
            // Reset button
            processTextBtn.disabled = false;
            processTextBtn.textContent = 'Process Text';
        }
    });

    // Export to Word Button
    exportWordBtn.addEventListener('click', async () => {
        const text = textEditor.value;
        if (!text.trim()) {
            alert('Please enter some text to export.');
            return;
        }

        try {
            // Show loading state
            exportWordBtn.disabled = true;
            exportWordBtn.textContent = 'Exporting...';
            
            // Call the export service
            await exportToWord(text);
            
            // Reset button
            exportWordBtn.disabled = false;
            exportWordBtn.textContent = 'Export to Word';
        } catch (error) {
            console.error('Error exporting to Word:', error);
            alert('An error occurred while exporting to Word. Please try again.');
            
            // Reset button
            exportWordBtn.disabled = false;
            exportWordBtn.textContent = 'Export to Word';
        }
    });

    // Clear Text Button
    clearTextBtn.addEventListener('click', () => {
        textEditor.value = '';
        grammarResults.innerHTML = '<p>No grammar errors detected yet.</p>';
        formattingResults.innerHTML = '<p>No formatting information available yet.</p>';
        suggestionsResults.innerHTML = '<p>No suggestions available yet.</p>';
    });

    // API functions for Vercel deployment
    async function processText(text) {
        try {
            const response = await fetch('/api/process-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error calling process-text API:', error);
            throw error;
        }
    }
    
    async function exportToWord(text, options = {}) {
        try {
            const response = await fetch('/api/export-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text, 
                    options: {
                        title: 'My Novel Chapter',
                        author: 'Novel Assistant User',
                        ...options
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Handle file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'novel-chapter.docx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return { success: true };
        } catch (error) {
            console.error('Error calling export-word API:', error);
            throw error;
        }
    }
                    requiresUserApproval: true
                },
                {
                    type: 'grammar_correction',
                    position: text.indexOf('Its important'),
                    original: 'Its important',
                    suggestion: 'It\'s important',
                    explanation: 'Use "it\'s" (contraction of "it is") instead of "its" (possessive)',
                    confidence: 0.9,
                    autoApply: false,
                    requiresUserApproval: true
                },
                {
                    type: 'grammar_correction',
                    position: text.indexOf('you\'re grammar'),
                    original: 'you\'re grammar',
                    suggestion: 'your grammar',
                    explanation: 'Use "your" (possessive) instead of "you\'re" (contraction of "you are")',
                    confidence: 0.9,
                    autoApply: false,
                    requiresUserApproval: true
                },
                {
                    type: 'grammar_correction',
                    position: text.indexOf('dog is running'),
                    original: 'dog is',
                    suggestion: 'dog are',
                    explanation: 'Use "are" with plural subjects ("cat and dog")',
                    confidence: 0.8,
                    autoApply: false,
                    requiresUserApproval: true
                },
                {
                    type: 'grammar_correction',
                    position: text.indexOf('was wrote'),
                    original: 'was wrote',
                    suggestion: 'was written',
                    explanation: 'Use "written" as the past participle of "write"',
                    confidence: 0.9,
                    autoApply: false,
                    requiresUserApproval: true
                }
            ],
            generatedContent: null,
            characterNames: null,
            processedAt: new Date().toISOString(),
            preservationGuarantee: true
        };
    }

    // API functions for Vercel deployment
    async function processText(text) {
        try {
            const response = await fetch('/api/process-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error calling process-text API:', error);
            throw error;
        }
    }

    async function exportToWord(text, options = {}) {
        try {
            const response = await fetch('/api/export-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text, 
                    options: {
                        title: 'My Novel Chapter',
                        author: 'Novel Assistant User',
                        ...options
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Handle file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'novel-chapter.docx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return { success: true };
        } catch (error) {
            console.error('Error calling export-word API:', error);
            throw error;
        }
    }

    // Display functions
    function displayGrammarResults(errors) {
        if (!errors || errors.length === 0) {
            grammarResults.innerHTML = '<p>No grammar errors detected.</p>';
            return;
        }

        let html = '';
        errors.forEach(error => {
            html += `
                <div class="error-item">
                    <h4>${error.type.replace(/_/g, ' ').toUpperCase()}</h4>
                    <p><strong>Original:</strong> "${error.original}"</p>
                    <p><strong>Suggestion:</strong> ${error.suggestion}</p>
                    <p><strong>Explanation:</strong> ${error.explanation}</p>
                    <p><strong>Confidence:</strong> ${Math.round(error.confidence * 100)}%</p>
                </div>
            `;
        });

        grammarResults.innerHTML = html;
    }

    function displayFormattingResults(formatting) {
        if (!formatting) {
            formattingResults.innerHTML = '<p>No formatting information available.</p>';
            return;
        }

        let html = `
            <p><strong>Paragraph Count:</strong> ${formatting.paragraphCount}</p>
            <p><strong>Line Breaks:</strong> ${formatting.lineBreaks}</p>
            <h4>Paragraphs:</h4>
        `;

        formatting.paragraphs.forEach((para, index) => {
            html += `
                <div class="paragraph-item">
                    <p><strong>Paragraph ${index + 1}:</strong></p>
                    <p>${para.content}</p>
                    <p><small>Followed by break: ${para.followedByBreak ? 'Yes' : 'No'}</small></p>
                </div>
            `;
        });

        formattingResults.innerHTML = html;
    }

    function displaySuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
            suggestionsResults.innerHTML = '<p>No suggestions available.</p>';
            return;
        }

        let html = '';
        suggestions.forEach(suggestion => {
            html += `
                <div class="suggestion-item">
                    <h4>${suggestion.type.replace(/_/g, ' ').toUpperCase()}</h4>
                    <p><strong>Original:</strong> "${suggestion.original}"</p>
                    <p><strong>Suggestion:</strong> ${suggestion.suggestion}</p>
                    <p><strong>Explanation:</strong> ${suggestion.explanation}</p>
                    <p><strong>Confidence:</strong> ${Math.round(suggestion.confidence * 100)}%</p>
                </div>
            `;
        });

        suggestionsResults.innerHTML = html;
    }
});