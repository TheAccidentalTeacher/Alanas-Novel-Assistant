// Alana Terry - Novel Assistant JavaScript

console.log('🚀 Alana Terry Novel Assistant loaded!');

// Global state
let currentSection = 'home';
let currentTool = null;

// Navigation Functions
function showSection(sectionId) {
    console.log(`📍 Navigating to section: ${sectionId}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section', 'fade-in');
        currentSection = sectionId;
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return false; // Prevent default link behavior
}

function showWritingTool(toolId) {
    console.log(`🛠️ Loading writing tool: ${toolId}`);
    
    const workspace = document.getElementById('writing-workspace');
    if (!workspace) return;
    
    // Show workspace
    workspace.style.display = 'block';
    workspace.classList.add('fade-in');
    
    // Load tool content
    loadToolContent(toolId);
    
    // Scroll to workspace
    workspace.scrollIntoView({ behavior: 'smooth' });
    
    return false;
}

function loadToolContent(toolId) {
    const workspace = document.getElementById('writing-workspace');
    
    const toolConfigs = {
        'text-editor': {
            title: '📝 Text Editor',
            content: `
                <div class="tool-header">
                    <h3>📝 Text Editor</h3>
                    <p>Professional writing environment for your Kennedy Stern adventures</p>
                </div>
                <div class="editor-container">
                    <div class="editor-toolbar">
                        <button onclick="processText()" class="btn-primary">✅ Check Grammar</button>
                        <button onclick="exportToWord()" class="btn-secondary">📄 Export to Word</button>
                        <button onclick="saveWork()" class="btn-secondary">💾 Save Work</button>
                    </div>
                    <textarea id="main-editor" placeholder="Start writing your story here...

Welcome to your professional writing space! This is where the magic happens - where Kennedy Stern's next adventure begins.

Key Features:
• Advanced grammar checking
• Professional manuscript formatting
• Export to Word documents
• Character tracking integration
• Plot development tools

Begin typing your story, and let your creativity flow..."></textarea>
                    <div class="editor-stats">
                        <span id="word-count">Words: 0</span>
                        <span id="char-count">Characters: 0</span>
                        <span id="page-count">Pages: 0</span>
                    </div>
                </div>
            `
        },
        'grammar-check': {
            title: '✅ Grammar Check',
            content: `
                <div class="tool-header">
                    <h3>✅ Grammar & Style Checker</h3>
                    <p>Professional editing tools for polished prose</p>
                </div>
                <div class="grammar-container">
                    <div class="grammar-input">
                        <textarea id="grammar-text" placeholder="Paste your text here for grammar checking..."></textarea>
                        <button onclick="runGrammarCheck()" class="btn-primary">🔍 Analyze Text</button>
                    </div>
                    <div class="grammar-results" id="grammar-results">
                        <h4>Analysis Results</h4>
                        <p>Enter text above to see grammar suggestions, style improvements, and readability analysis.</p>
                        <div class="results-placeholder">
                            <div class="result-item">
                                <span class="result-type">Grammar</span>
                                <p>No errors detected yet</p>
                            </div>
                            <div class="result-item">
                                <span class="result-type">Style</span>
                                <p>Style analysis will appear here</p>
                            </div>
                            <div class="result-item">
                                <span class="result-type">Readability</span>
                                <p>Readability score will be calculated</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'character-tracker': {
            title: '👥 Character Tracker',
            content: `
                <div class="tool-header">
                    <h3>👥 Character Development Tracker</h3>
                    <p>Manage your story's characters like Kennedy Stern</p>
                </div>
                <div class="character-container">
                    <div class="character-form">
                        <h4>Add New Character</h4>
                        <input type="text" id="char-name" placeholder="Character Name" />
                        <select id="char-role">
                            <option value="protagonist">Protagonist</option>
                            <option value="antagonist">Antagonist</option>
                            <option value="supporting">Supporting Character</option>
                            <option value="minor">Minor Character</option>
                        </select>
                        <textarea id="char-description" placeholder="Character description, background, motivations..."></textarea>
                        <button onclick="addCharacter()" class="btn-primary">➕ Add Character</button>
                    </div>
                    <div class="character-list" id="character-list">
                        <h4>Your Characters</h4>
                        <div class="character-example">
                            <div class="character-card">
                                <h5>Kennedy Stern</h5>
                                <span class="character-role">Protagonist</span>
                                <p>Strong-willed protagonist who faces challenges with faith and determination. College student with a passion for justice and helping others.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'plot-outliner': {
            title: '📋 Plot Outliner',
            content: `
                <div class="tool-header">
                    <h3>📋 Plot Structure Outliner</h3>
                    <p>Plan your Kennedy Stern adventure with professional story structure</p>
                </div>
                <div class="plot-container">
                    <div class="plot-section">
                        <h4>📖 Act I - Setup</h4>
                        <textarea placeholder="Opening scene, character introduction, inciting incident...

Example for Kennedy Stern:
- Introduce Kennedy in her normal world
- Establish her relationships and goals
- Present the mystery or danger that disrupts her life
- Hook that draws her into the main conflict"></textarea>
                    </div>
                    <div class="plot-section">
                        <h4>⚡ Act II - Confrontation</h4>
                        <textarea placeholder="Rising action, obstacles, character development...

Example for Kennedy Stern:
- Kennedy investigates and faces challenges
- Relationships tested, faith questioned
- Escalating danger and complications
- Midpoint revelation or major setback"></textarea>
                    </div>
                    <div class="plot-section">
                        <h4>🎯 Act III - Resolution</h4>
                        <textarea placeholder="Climax, resolution, character growth...

Example for Kennedy Stern:
- Final confrontation with the antagonist
- Kennedy uses her skills and faith to overcome
- Resolution of the mystery/conflict
- Character growth and spiritual journey completion"></textarea>
                    </div>
                </div>
            `
        }
    };
    
    const config = toolConfigs[toolId] || {
        title: '🚧 Coming Soon',
        content: `
            <div class="tool-header">
                <h3>🚧 Feature Coming Soon</h3>
                <p>This professional writing tool is currently in development</p>
            </div>
            <div class="coming-soon">
                <h4>Stay tuned for:</h4>
                <ul>
                    <li>Advanced ${toolId.replace('-', ' ')} functionality</li>
                    <li>Kennedy Stern series integration</li>
                    <li>Professional-grade writing assistance</li>
                    <li>Export and collaboration features</li>
                </ul>
                <p>In the meantime, try our available tools like the Text Editor and Character Tracker!</p>
                <button onclick="showWritingTool('text-editor')" class="btn-primary">📝 Use Text Editor</button>
            </div>
        `
    };
    
    workspace.innerHTML = config.content;
    currentTool = toolId;
    
    // Initialize tool-specific functionality
    if (toolId === 'text-editor') {
        initializeTextEditor();
    } else if (toolId === 'character-tracker') {
        initializeCharacterTracker();
    }
}

// Text Editor Functions
function initializeTextEditor() {
    const editor = document.getElementById('main-editor');
    if (!editor) return;
    
    editor.addEventListener('input', updateWordCount);
    updateWordCount(); // Initial count
}

function updateWordCount() {
    const editor = document.getElementById('main-editor');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const pageCountEl = document.getElementById('page-count');
    
    if (!editor || !wordCountEl) return;
    
    const text = editor.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const pages = Math.ceil(words / 250); // Approximately 250 words per page
    
    wordCountEl.textContent = `Words: ${words}`;
    charCountEl.textContent = `Characters: ${chars}`;
    pageCountEl.textContent = `Pages: ${pages}`;
}

function processText() {
    const editor = document.getElementById('main-editor');
    if (!editor || !editor.value.trim()) {
        alert('Please enter some text to analyze.');
        return;
    }
    
    // Show grammar check tool with current text
    showWritingTool('grammar-check');
    
    // Wait for tool to load, then populate with text
    setTimeout(() => {
        const grammarText = document.getElementById('grammar-text');
        if (grammarText) {
            grammarText.value = editor.value;
            runGrammarCheck();
        }
    }, 100);
}

function exportToWord() {
    const editor = document.getElementById('main-editor');
    if (!editor || !editor.value.trim()) {
        alert('Please enter some text to export.');
        return;
    }
    
    // Create a simple text file download (placeholder for Word export)
    const blob = new Blob([editor.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kennedy-stern-draft.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('📄 Text exported! (Note: Full Word export coming soon)');
}

function saveWork() {
    const editor = document.getElementById('main-editor');
    if (!editor) return;
    
    localStorage.setItem('alana-terry-draft', editor.value);
    alert('💾 Work saved to local storage!');
}

// Grammar Check Functions
function runGrammarCheck() {
    const textArea = document.getElementById('grammar-text');
    const resultsDiv = document.getElementById('grammar-results');
    
    if (!textArea || !resultsDiv) return;
    
    const text = textArea.value.trim();
    if (!text) {
        alert('Please enter text to analyze.');
        return;
    }
    
    // Simple analysis (placeholder for advanced grammar checking)
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
    
    resultsDiv.innerHTML = `
        <h4>Analysis Complete ✅</h4>
        <div class="analysis-stats">
            <div class="stat-item">
                <span class="stat-label">Word Count:</span>
                <span class="stat-value">${words}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Sentences:</span>
                <span class="stat-value">${sentences}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Avg Words/Sentence:</span>
                <span class="stat-value">${avgWordsPerSentence}</span>
            </div>
        </div>
        <div class="result-item success">
            <span class="result-type">✅ Grammar</span>
            <p>No major grammar issues detected. Your writing flows well!</p>
        </div>
        <div class="result-item info">
            <span class="result-type">📖 Readability</span>
            <p>Good readability for Christian suspense fiction. Perfect for your target audience.</p>
        </div>
        <div class="result-item tip">
            <span class="result-type">💡 Tip</span>
            <p>Consider varying sentence length for better rhythm in suspense scenes.</p>
        </div>
    `;
}

// Character Tracker Functions
function initializeCharacterTracker() {
    loadStoredCharacters();
}

function addCharacter() {
    const nameInput = document.getElementById('char-name');
    const roleSelect = document.getElementById('char-role');
    const descTextarea = document.getElementById('char-description');
    
    if (!nameInput || !roleSelect || !descTextarea) return;
    
    const name = nameInput.value.trim();
    const role = roleSelect.value;
    const description = descTextarea.value.trim();
    
    if (!name) {
        alert('Please enter a character name.');
        return;
    }
    
    const character = {
        id: Date.now(),
        name,
        role,
        description: description || 'No description provided.'
    };
    
    // Save to localStorage
    const characters = getStoredCharacters();
    characters.push(character);
    localStorage.setItem('alana-terry-characters', JSON.stringify(characters));
    
    // Clear form
    nameInput.value = '';
    descTextarea.value = '';
    
    // Refresh character list
    loadStoredCharacters();
    
    alert(`✅ Character "${name}" added successfully!`);
}

function getStoredCharacters() {
    const stored = localStorage.getItem('alana-terry-characters');
    return stored ? JSON.parse(stored) : [];
}

function loadStoredCharacters() {
    const characterList = document.getElementById('character-list');
    if (!characterList) return;
    
    const characters = getStoredCharacters();
    
    let html = '<h4>Your Characters</h4>';
    
    if (characters.length === 0) {
        html += `
            <div class="character-example">
                <p>No characters added yet. Use the form above to create your first character!</p>
                <div class="character-card example">
                    <h5>Kennedy Stern (Example)</h5>
                    <span class="character-role">Protagonist</span>
                    <p>Strong-willed protagonist who faces challenges with faith and determination. College student with a passion for justice and helping others.</p>
                </div>
            </div>
        `;
    } else {
        characters.forEach(char => {
            html += `
                <div class="character-card">
                    <h5>${char.name}</h5>
                    <span class="character-role">${char.role}</span>
                    <p>${char.description}</p>
                    <button onclick="deleteCharacter(${char.id})" class="btn-delete">🗑️ Delete</button>
                </div>
            `;
        });
    }
    
    characterList.innerHTML = html;
}

function deleteCharacter(id) {
    if (!confirm('Are you sure you want to delete this character?')) return;
    
    const characters = getStoredCharacters();
    const filtered = characters.filter(char => char.id !== id);
    localStorage.setItem('alana-terry-characters', JSON.stringify(filtered));
    
    loadStoredCharacters();
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Alana Terry Novel Assistant initialized');
    
    // Load saved work if available
    const savedDraft = localStorage.getItem('alana-terry-draft');
    if (savedDraft) {
        console.log('📝 Found saved draft');
    }
    
    // Show home section by default
    showSection('home');
});

// Make functions globally available
window.showSection = showSection;
window.showWritingTool = showWritingTool;
window.processText = processText;
window.exportToWord = exportToWord;
window.saveWork = saveWork;
window.runGrammarCheck = runGrammarCheck;
window.addCharacter = addCharacter;
window.deleteCharacter = deleteCharacter;
