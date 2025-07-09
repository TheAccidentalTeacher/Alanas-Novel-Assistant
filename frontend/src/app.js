// Alana's Novel Assistant - Enhanced Interface

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initializeApp();
});

// Test function to verify buttons work
function testButtonClick() {
    console.log('Test button clicked!');
    alert('Button click is working!');
    showFeature('text-editor');
}

// Make test function globally available
window.testButtonClick = testButtonClick;

// Global variables for character storage
let characters = [];

function initializeApp() {
    console.log('Initializing Alana\'s Novel Assistant...');
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        setupFeatureNavigation();
        initializeTextEditor();
        initializeCharacterTracker();
        setupTabs();
        loadSampleContent();
        showFeature('welcome');
        console.log('App initialization complete!');
    }, 100);
}

// Feature Navigation System
function setupFeatureNavigation() {
    const featureButtons = document.querySelectorAll('.feature-btn');
    console.log('Found feature buttons:', featureButtons.length);
    
    if (featureButtons.length === 0) {
        console.error('No feature buttons found! Check HTML structure.');
        return;
    }
    
    featureButtons.forEach((button, index) => {
        const feature = button.getAttribute('data-feature');
        console.log(`Button ${index}:`, feature);
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Clicked feature:', feature);
            // Temporary alert for debugging
            alert(`Clicked: ${feature}`);
            showFeature(feature);
            
            featureButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
        
        // Also add some visual feedback
        button.addEventListener('mouseenter', () => {
            console.log('Hovering over:', feature);
        });
    });
}

function showFeature(featureName) {
    console.log('Showing feature:', featureName);
    const allSections = document.querySelectorAll('.feature-section, .welcome-section');
    console.log('Found sections:', allSections.length);
    
    allSections.forEach(section => {
        section.classList.remove('active-feature');
    });
    
    let targetSection;
    if (featureName === 'welcome') {
        targetSection = document.getElementById('welcome');
    } else if (featureName === 'grammar-check') {
        targetSection = document.getElementById('grammar-check');
    } else if (document.getElementById(featureName)) {
        targetSection = document.getElementById(featureName);
    } else {
        targetSection = document.getElementById('coming-soon');
        console.log('Feature not implemented, showing coming-soon');
    }
    
    console.log('Target section:', targetSection);
    if (targetSection) {
        targetSection.classList.add('active-feature');
        console.log('Section activated:', targetSection.id);
    } else {
        console.error('No target section found for:', featureName);
    }
}

// Make showFeature globally available
window.showFeature = showFeature;

// Text Editor Functionality
function initializeTextEditor() {
    const mainEditor = document.getElementById('main-editor');
    const wordCountDisplay = document.getElementById('word-count-display');
    const charCountDisplay = document.getElementById('char-count-display');
    const processTextBtn = document.getElementById('process-text');
    const grammarCheckBtn = document.getElementById('grammar-check-btn');
    const exportWordBtn = document.getElementById('export-word');
    const clearTextBtn = document.getElementById('clear-text');
    const saveDraftBtn = document.getElementById('save-draft');
    
    if (mainEditor) {
        mainEditor.addEventListener('input', updateWordCount);
        updateWordCount();
    }
    
    function updateWordCount() {
        const text = mainEditor.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        if (wordCountDisplay) wordCountDisplay.textContent = `Words: ${words}`;
        if (charCountDisplay) charCountDisplay.textContent = `Characters: ${chars}`;
    }
    
    if (processTextBtn) {
        processTextBtn.addEventListener('click', async () => {
            const text = mainEditor ? mainEditor.value : '';
            if (!text.trim()) {
                alert('Please enter some text to process.');
                return;
            }
            
            await processText(text);
            showFeature('grammar-check');
        });
    }
    
    if (grammarCheckBtn) {
        grammarCheckBtn.addEventListener('click', async () => {
            const text = mainEditor ? mainEditor.value : '';
            if (!text.trim()) {
                alert('Please enter some text to check.');
                return;
            }
            
            await processText(text);
            showFeature('grammar-check');
        });
    }
    
    if (exportWordBtn) {
        exportWordBtn.addEventListener('click', async () => {
            const text = mainEditor ? mainEditor.value : '';
            if (!text.trim()) {
                alert('Please enter some text to export.');
                return;
            }
            
            await exportToWord(text);
        });
    }
    
    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all text?')) {
                if (mainEditor) {
                    mainEditor.value = '';
                    updateWordCount();
                }
            }
        });
    }
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            const text = mainEditor ? mainEditor.value : '';
            localStorage.setItem('novel-assistant-draft', text);
            
            const lastSaved = document.getElementById('last-saved');
            if (lastSaved) {
                lastSaved.textContent = `Saved: ${new Date().toLocaleTimeString()}`;
            }
            
            alert('Draft saved successfully!');
        });
    }
    
    // Load saved draft if exists
    const savedDraft = localStorage.getItem('novel-assistant-draft');
    if (savedDraft && mainEditor && !mainEditor.value) {
        mainEditor.value = savedDraft;
        updateWordCount();
    }
}

// Character Tracker Functionality
function initializeCharacterTracker() {
    const addCharacterBtn = document.getElementById('add-character');
    const charNameInput = document.getElementById('char-name');
    const charRoleSelect = document.getElementById('char-role');
    const charDescriptionTextarea = document.getElementById('char-description');
    const charactersDisplay = document.getElementById('characters-display');
    
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', () => {
            const name = charNameInput ? charNameInput.value.trim() : '';
            const role = charRoleSelect ? charRoleSelect.value : '';
            const description = charDescriptionTextarea ? charDescriptionTextarea.value.trim() : '';
            
            if (!name) {
                alert('Please enter a character name.');
                return;
            }
            
            const character = {
                id: Date.now(),
                name,
                role,
                description,
                createdAt: new Date().toLocaleDateString()
            };
            
            characters.push(character);
            displayCharacters();
            
            // Clear form
            if (charNameInput) charNameInput.value = '';
            if (charRoleSelect) charRoleSelect.value = '';
            if (charDescriptionTextarea) charDescriptionTextarea.value = '';
        });
    }
    
    function displayCharacters() {
        if (!charactersDisplay) return;
        
        if (characters.length === 0) {
            charactersDisplay.innerHTML = '<p class="placeholder">No characters created yet. Add your first character above!</p>';
            return;
        }
        
        const charactersHTML = characters.map(char => `
            <div class="character-card" data-id="${char.id}">
                <h4>${char.name}</h4>
                <p class="character-role">${char.role || 'No role specified'}</p>
                <p class="character-description">${char.description || 'No description provided'}</p>
                <p class="character-date">Created: ${char.createdAt}</p>
                <button class="delete-character" onclick="deleteCharacter(${char.id})">Delete</button>
            </div>
        `).join('');
        
        charactersDisplay.innerHTML = charactersHTML;
    }
    
    // Make deleteCharacter globally available
    window.deleteCharacter = function(id) {
        if (confirm('Are you sure you want to delete this character?')) {
            characters = characters.filter(char => char.id !== id);
            displayCharacters();
        }
    };
}

// Tabs Functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab') + '-tab';
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Load Sample Content
function loadSampleContent() {
    const mainEditor = document.getElementById('main-editor');
    if (mainEditor && !mainEditor.value && !localStorage.getItem('novel-assistant-draft')) {
        const sampleText = `Chapter 1: The Beginning

Sarah walked into the old library, its dusty shelves towering above her like ancient guardians. The afternoon sun streamed through the tall windows, casting long shadows across the worn wooden floors.

She had always loved libraries. There was something magical about being surrounded by thousands of stories, each book a doorway to another world. Today, however, she wasn't here for pleasure reading.

"Excuse me," she approached the elderly librarian at the front desk. "I'm looking for information about the Henderson family. Specifically, records from the 1920s."

The librarian looked up from her work, her eyes twinkling with curiosity. "Historical research, dear? How exciting! Follow me to the archives section."`;
        
        mainEditor.value = sampleText;
        
        // Trigger word count update
        const event = new Event('input');
        mainEditor.dispatchEvent(event);
    }
}

// API Functions
async function processText(text) {
    try {
        const processTextBtn = document.getElementById('process-text');
        const grammarCheckBtn = document.getElementById('grammar-check-btn');
        
        // Show loading state
        if (processTextBtn) {
            processTextBtn.disabled = true;
            processTextBtn.textContent = '🔍 Processing...';
        }
        if (grammarCheckBtn) {
            grammarCheckBtn.disabled = true;
            grammarCheckBtn.textContent = '✅ Checking...';
        }
        
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
        
        const result = await response.json();
        
        // Display results
        displayGrammarResults(result.grammarErrors || []);
        displayFormattingResults(result.preservedFormatting || {});
        displaySuggestions(result.suggestions || []);
        displayAnalysisResults(text);
        
        return result;
    } catch (error) {
        console.error('Error processing text:', error);
        alert('An error occurred while processing the text. Please try again.');
        throw error;
    } finally {
        // Reset buttons
        const processTextBtn = document.getElementById('process-text');
        const grammarCheckBtn = document.getElementById('grammar-check-btn');
        
        if (processTextBtn) {
            processTextBtn.disabled = false;
            processTextBtn.textContent = '🔍 Process Text';
        }
        if (grammarCheckBtn) {
            grammarCheckBtn.disabled = false;
            grammarCheckBtn.textContent = '✅ Grammar Check';
        }
    }
}

async function exportToWord(text) {
    try {
        const exportWordBtn = document.getElementById('export-word');
        
        if (exportWordBtn) {
            exportWordBtn.disabled = true;
            exportWordBtn.textContent = '📄 Exporting...';
        }
        
        const response = await fetch('/api/export-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text, 
                options: {
                    title: 'My Novel Chapter',
                    author: 'Novel Assistant User'
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
        console.error('Error exporting to Word:', error);
        alert('An error occurred while exporting to Word. Please try again.');
        throw error;
    } finally {
        const exportWordBtn = document.getElementById('export-word');
        if (exportWordBtn) {
            exportWordBtn.disabled = false;
            exportWordBtn.textContent = '📄 Export to Word';
        }
    }
}

// Display Functions
function displayGrammarResults(errors) {
    const grammarResults = document.getElementById('grammar-results');
    if (!grammarResults) return;
    
    if (!errors || errors.length === 0) {
        grammarResults.innerHTML = '<p class="success">✅ No grammar errors detected! Your text looks great.</p>';
        return;
    }
    
    const errorsHTML = errors.map(error => `
        <div class="error-item">
            <h4>${error.type.replace('_', ' ').toUpperCase()}</h4>
            <p><strong>Found:</strong> "${error.original}"</p>
            <p><strong>Suggestion:</strong> "${error.suggestion}"</p>
            <p><strong>Explanation:</strong> ${error.explanation}</p>
            <p class="confidence">Confidence: ${Math.round((error.confidence || 0.8) * 100)}%</p>
        </div>
    `).join('');
    
    grammarResults.innerHTML = `
        <h4>Found ${errors.length} potential issue${errors.length === 1 ? '' : 's'}:</h4>
        ${errorsHTML}
    `;
}

function displayFormattingResults(formatting) {
    const formattingResults = document.getElementById('formatting-results');
    if (!formattingResults) return;
    
    const text = document.getElementById('main-editor') ? document.getElementById('main-editor').value : '';
    const paragraphs = text.split('\n\n').length;
    const lines = text.split('\n').length;
    
    formattingResults.innerHTML = `
        <div class="formatting-info">
            <h4>📝 Formatting Analysis</h4>
            <p><strong>Paragraphs:</strong> ${paragraphs}</p>
            <p><strong>Lines:</strong> ${lines}</p>
            <p><strong>Formatting Preserved:</strong> ✅ All paragraph breaks maintained</p>
            <p><strong>Structure:</strong> ${formatting.structureIntact !== false ? '✅ Intact' : '⚠️ May need attention'}</p>
        </div>
    `;
}

function displaySuggestions(suggestions) {
    const suggestionsResults = document.getElementById('suggestions-results');
    if (!suggestionsResults) return;
    
    if (!suggestions || suggestions.length === 0) {
        suggestionsResults.innerHTML = `
            <div class="suggestions-info">
                <h4>💡 Writing Tips</h4>
                <ul>
                    <li>Vary your sentence lengths for better flow</li>
                    <li>Use active voice when possible</li>
                    <li>Show, don't tell - use specific details</li>
                    <li>Read your work aloud to catch rhythm issues</li>
                </ul>
            </div>
        `;
        return;
    }
    
    const suggestionsHTML = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <h4>${suggestion.type}</h4>
            <p>${suggestion.text}</p>
        </div>
    `).join('');
    
    suggestionsResults.innerHTML = suggestionsHTML;
}

function displayAnalysisResults(text) {
    const readabilityScore = document.getElementById('readability-score');
    const avgSentenceLength = document.getElementById('avg-sentence-length');
    const vocabDiversity = document.getElementById('vocab-diversity');
    
    // Simple analysis calculations
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
    
    const avgLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
    const diversity = words.length > 0 ? Math.round((uniqueWords.size / words.length) * 100) : 0;
    const readability = Math.max(1, Math.min(10, Math.round(10 - (avgLength - 15) * 0.2)));
    
    if (readabilityScore) readabilityScore.textContent = `${readability}/10`;
    if (avgSentenceLength) avgSentenceLength.textContent = `${avgLength} words`;
    if (vocabDiversity) vocabDiversity.textContent = `${diversity}%`;
}