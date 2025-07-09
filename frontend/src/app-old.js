// Alana's Novel Assistant - Enhanced Interface

// Test if JavaScript is loading
console.log('🚀 JavaScript file loaded!');

// Global variables for character storage
let characters = [];

// Main feature navigation function
function showFeature(featureName) {
    console.log(`🎬 Showing feature: ${featureName}`);
    
    try {
        // Hide all sections first
        const allSections = [
            'welcome', 'text-editor', 'character-tracker', 'plot-outliner', 
            'grammar-check', 'coming-soon'
        ];
        
        allSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('active-feature');
                console.log(`➖ Hid section: ${sectionId}`);
            }
        });
        
        // Determine target section
        let targetSectionId;
        if (['text-editor', 'character-tracker', 'plot-outliner', 'grammar-check', 'welcome'].includes(featureName)) {
            targetSectionId = featureName;
        } else {
            targetSectionId = 'coming-soon';
            console.log(`🚧 Feature "${featureName}" not implemented, showing coming-soon`);
        }
        
        // Show target section
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add('active-feature');
            console.log(`✅ Showed section: ${targetSectionId}`);
            
            // Smooth scroll to the feature section instead of top
            const featureDisplay = document.getElementById('feature-display');
            if (featureDisplay) {
                featureDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            console.error(`❌ Section not found: ${targetSectionId}`);
        }
        
    } catch (error) {
        console.error('❌ Error in showFeature:', error);
    }
    
    // Prevent default behavior and stop event propagation
    return false;
}

// Make functions available globally immediately
window.showFeature = showFeature;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM Content Loaded');
    initializeApp();
});

function initializeApp() {
    console.log('🔧 Initializing Alana\'s Novel Assistant...');
    
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        try {
            setupFeatureNavigation();
            initializeTextEditor();
            initializeCharacterTracker();
            setupTabs();
            loadSampleContent();
            showFeature('welcome');
            console.log('✅ App initialization complete!');
        } catch (error) {
            console.error('❌ Error during initialization:', error);
        }
    }, 500);
}

// Simplified and more robust feature navigation
function setupFeatureNavigation() {
    console.log('🔧 Setting up feature navigation...');
    
    // Use a more direct approach to find buttons
    const buttons = document.getElementsByClassName('feature-btn');
    console.log(`📊 Found ${buttons.length} feature buttons`);
    
    if (buttons.length === 0) {
        console.error('❌ No feature buttons found!');
        return;
    }
    
    // Convert HTMLCollection to Array for easier handling
    Array.from(buttons).forEach((button, index) => {
        const feature = button.getAttribute('data-feature');
        
        if (feature) {
            console.log(`🔗 Setting up button ${index + 1}: ${feature}`);
            
            // Add click event listener
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🔥 Button clicked: ${feature}`);
                showFeature(feature);
            });
            
            // Also add visual feedback
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });
        } else {
            console.warn(`⚠️ Button ${index + 1} missing data-feature attribute`);
        }
    });
    
    console.log('✅ Feature navigation setup complete');
}

// Text Editor Functionality
function initializeTextEditor() {
    console.log('🔧 Initializing text editor...');
    
    const processBtn = document.getElementById('process-text');
    const exportBtn = document.getElementById('export-word');
    const textInput = document.getElementById('text-input');
    
    if (processBtn) {
        processBtn.addEventListener('click', () => {
            const text = textInput ? textInput.value : '';
            if (text.trim()) {
                processText(text);
            } else {
                alert('Please enter some text to process.');
            }
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const text = textInput ? textInput.value : '';
            if (text.trim()) {
                exportToWord(text);
            } else {
                alert('Please enter some text to export.');
            }
        });
    }
}

// Character Tracker Functionality
function initializeCharacterTracker() {
    console.log('🔧 Initializing character tracker...');
    
    const addCharacterBtn = document.getElementById('add-character');
    
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', addCharacter);
    }
}

// Tab functionality
function setupTabs() {
    console.log('🔧 Setting up tabs...');
    
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Hide all tab buttons
    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const targetTab = document.getElementById(`${tabName}-tab`);
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetTab) targetTab.classList.add('active');
    if (targetButton) targetButton.classList.add('active');
}

// Text processing function
async function processText(text) {
    console.log('🔄 Processing text...');
    
    try {
        showFeature('grammar-check');
        
        // Show loading state
        const grammarResults = document.getElementById('grammar-results');
        if (grammarResults) {
            grammarResults.innerHTML = '<p>🔄 Processing your text...</p>';
        }
        
        // Make API call
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
        
        const data = await response.json();
        
        // Display results
        displayResults(data);
        
    } catch (error) {
        console.error('❌ Error processing text:', error);
        const grammarResults = document.getElementById('grammar-results');
        if (grammarResults) {
            grammarResults.innerHTML = `<p>❌ Error processing text: ${error.message}</p>`;
        }
    }
}

// Export to Word function
async function exportToWord(text) {
    console.log('📄 Exporting to Word...');
    
    try {
        const response = await fetch('/api/export-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Download the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'novel-export.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        alert('✅ Document exported successfully!');
        
    } catch (error) {
        console.error('❌ Error exporting document:', error);
        alert(`❌ Error exporting document: ${error.message}`);
    }
}

// Character management functions
function addCharacter() {
    const name = document.getElementById('char-name')?.value.trim();
    const role = document.getElementById('char-role')?.value;
    const description = document.getElementById('char-description')?.value.trim();
    
    if (!name) {
        alert('Please enter a character name.');
        return;
    }
    
    const character = {
        id: Date.now(),
        name,
        role,
        description
    };
    
    characters.push(character);
    displayCharacters();
    
    // Clear form
    document.getElementById('char-name').value = '';
    document.getElementById('char-description').value = '';
}

function displayCharacters() {
    const display = document.getElementById('characters-display');
    if (!display) return;
    
    if (characters.length === 0) {
        display.innerHTML = '<p class="placeholder">No characters created yet. Add your first character above!</p>';
        return;
    }
    
    const html = characters.map(char => `
        <div class="character-card" data-id="${char.id}">
            <h4>${char.name}</h4>
            <span class="character-role">${char.role}</span>
            <p>${char.description || 'No description provided.'}</p>
            <button onclick="deleteCharacter(${char.id})" class="delete-btn">🗑️ Delete</button>
        </div>
    `).join('');
    
    display.innerHTML = html;
}

function deleteCharacter(id) {
    characters = characters.filter(char => char.id !== id);
    displayCharacters();
}

// Display results from text processing
function displayResults(data) {
    // Grammar results
    const grammarResults = document.getElementById('grammar-results');
    if (grammarResults && data.grammar) {
        if (data.grammar.length === 0) {
            grammarResults.innerHTML = '<p>✅ No grammar errors detected!</p>';
        } else {
            const html = data.grammar.map(error => `
                <div class="error-item">
                    <span class="error-type">${error.type}</span>
                    <p><strong>Issue:</strong> ${error.message}</p>
                    <p><strong>Context:</strong> "${error.context}"</p>
                    ${error.suggestions ? `<p><strong>Suggestions:</strong> ${error.suggestions.join(', ')}</p>` : ''}
                </div>
            `).join('');
            grammarResults.innerHTML = html;
        }
    }
    
    // Formatting results
    const formattingResults = document.getElementById('formatting-results');
    if (formattingResults && data.formatting) {
        formattingResults.innerHTML = `
            <p><strong>Paragraphs:</strong> ${data.formatting.paragraphs}</p>
            <p><strong>Sentences:</strong> ${data.formatting.sentences}</p>
            <p><strong>Word Count:</strong> ${data.formatting.wordCount}</p>
            <p><strong>Character Count:</strong> ${data.formatting.characterCount}</p>
        `;
    }
    
    // Analysis results
    const analysisResults = document.getElementById('analysis-results');
    if (analysisResults && data.analysis) {
        analysisResults.innerHTML = `
            <p><strong>Readability Score:</strong> ${data.analysis.readability || 'N/A'}</p>
            <p><strong>Avg. Sentence Length:</strong> ${data.analysis.avgSentenceLength || 'N/A'} words</p>
            <p><strong>Complex Words:</strong> ${data.analysis.complexWords || 0}</p>
        `;
    }
}

// Load sample content
function loadSampleContent() {
    const textInput = document.getElementById('text-input');
    if (textInput && !textInput.value.trim()) {
        textInput.value = `Welcome to Alana's Novel Assistant! This is your complete writing platform with 35+ professional features.

Start by typing your story here, or try out the various tools available in the menu above. 

Key features include:
- Advanced grammar checking
- Character development tools
- Plot outlining assistance
- Professional document export
- And much more!

Your creativity is the limit. Let's bring your story to life!`;
    }
}

console.log('✅ App.js fully loaded and ready!');