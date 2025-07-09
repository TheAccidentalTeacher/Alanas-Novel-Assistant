// Alana's Writing Workspace - Functional and Simple
console.log('🚀 Loading Alana\'s Writing Tools...');

// Global variables
let characters = [];
let currentTool = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded, initializing tools...');
    initializeApp();
});

function initializeApp() {
    console.log('🔧 Setting up writing workspace...');
    
    // Make sure all functions are globally available
    window.showTool = showTool;
    window.closeTool = closeTool;
    window.scrollToSection = scrollToSection;
    window.processText = processText;
    window.exportToWord = exportToWord;
    window.saveText = saveText;
    window.addCharacter = addCharacter;
    window.deleteCharacter = deleteCharacter;
    window.analyzeGrammar = analyzeGrammar;
    window.saveNotes = saveNotes;
    window.loadSavedWork = loadSavedWork;
    
    // Initialize text editor if it exists
    const textEditor = document.getElementById('main-text-editor');
    if (textEditor) {
        textEditor.addEventListener('input', updateEditorStats);
        updateEditorStats();
    }
    
    // Load saved notes
    loadNotes();
    
    console.log('✅ Writing workspace ready!');
}

// Tool Management - This is the main function that needs to work
function showTool(toolName) {
    console.log(`🔧 Opening tool: ${toolName}`);
    
    try {
        // Hide all tools first
        const allTools = document.querySelectorAll('.tool-content');
        console.log(`Found ${allTools.length} tool content areas`);
        
        allTools.forEach(tool => {
            tool.classList.remove('active');
            tool.classList.add('hidden');
            tool.style.display = 'none';
        });
        
        // Show tool interface container
        const toolInterface = document.getElementById('tool-interface');
        if (toolInterface) {
            toolInterface.classList.remove('hidden');
            toolInterface.style.display = 'block';
            console.log('✅ Tool interface shown');
        } else {
            console.error('❌ Tool interface not found');
            return;
        }
        
        // Show specific tool
        let targetToolId;
        switch(toolName) {
            case 'text-editor':
                targetToolId = 'text-editor-tool';
                break;
            case 'character-tracker':
                targetToolId = 'character-tracker-tool';
                break;
            case 'grammar-check':
                targetToolId = 'grammar-check-tool';
                break;
            case 'style-analysis':
                targetToolId = 'style-analysis-tool';
                break;
            case 'plot-outliner':
                targetToolId = 'plot-outliner-tool';
                break;
            case 'scene-manager':
                targetToolId = 'scene-manager-tool';
                break;
            case 'word-count':
                targetToolId = 'word-count-tool';
                break;
            case 'export-tools':
                targetToolId = 'export-tools-tool';
                break;
            case 'research-notes':
                targetToolId = 'research-notes-tool';
                break;
            default:
                targetToolId = 'coming-soon-tool';
        }
        
        const targetTool = document.getElementById(targetToolId);
        if (targetTool) {
            targetTool.classList.remove('hidden');
            targetTool.classList.add('active');
            targetTool.style.display = 'block';
            console.log(`✅ Showed tool: ${targetToolId}`);
            
            // Scroll to tool interface
            toolInterface.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            currentTool = toolName;
            
        } else {
            // Show a "coming soon" message for tools not yet implemented
            showComingSoonTool(toolName);
        }
        
    } catch (error) {
        console.error('❌ Error showing tool:', error);
    }
}

function showComingSoonTool(toolName) {
    console.log(`⏳ Showing coming soon for: ${toolName}`);
    
    // Create or update coming soon content
    let comingSoonTool = document.getElementById('coming-soon-tool');
    if (!comingSoonTool) {
        // Create the coming soon tool if it doesn't exist
        const toolInterface = document.getElementById('tool-interface');
        if (toolInterface) {
            comingSoonTool = document.createElement('div');
            comingSoonTool.id = 'coming-soon-tool';
            comingSoonTool.className = 'tool-content hidden';
            toolInterface.appendChild(comingSoonTool);
        }
    }
    
    if (comingSoonTool) {
        const toolDisplayName = toolName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        comingSoonTool.innerHTML = `
            <div class="tool-header">
                <h3>⏳ ${toolDisplayName}</h3>
                <button class="close-btn" onclick="closeTool()">✖️ Close</button>
            </div>
            <div class="coming-soon-content">
                <p>🚧 This tool is coming soon!</p>
                <p>The <strong>${toolDisplayName}</strong> tool is being developed to help you with your writing workflow.</p>
                <p>For now, you can use the Text Editor, Character Tracker, and Grammar Check tools.</p>
            </div>
        `;
        
        comingSoonTool.classList.remove('hidden');
        comingSoonTool.classList.add('active');
        comingSoonTool.style.display = 'block';
        
        console.log(`✅ Showed coming soon for: ${toolName}`);
    }
}

function closeTool() {
    console.log('🔧 Closing current tool');
    
    const toolInterface = document.getElementById('tool-interface');
    if (toolInterface) {
        toolInterface.classList.add('hidden');
        toolInterface.style.display = 'none';
    }
    
    const allTools = document.querySelectorAll('.tool-content');
    allTools.forEach(tool => {
        tool.classList.remove('active');
        tool.classList.add('hidden');
        tool.style.display = 'none';
    });
    
    currentTool = null;
    
    // Scroll back to tools section
    scrollToSection('tools');
}

function scrollToSection(sectionId) {
    console.log(`📍 Scrolling to: ${sectionId}`);
    
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        console.error(`❌ Section not found: ${sectionId}`);
    }
}

// Text Editor Functions
function updateEditorStats() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) return;
    
    const text = textEditor.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const readingTime = Math.ceil(words / 200);
    
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const readingTimeEl = document.getElementById('reading-time');
    
    if (wordCountEl) wordCountEl.textContent = `Words: ${words}`;
    if (charCountEl) charCountEl.textContent = `Characters: ${characters}`;
    if (readingTimeEl) readingTimeEl.textContent = `Reading time: ${readingTime} min`;
}

function processText() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found');
        return;
    }
    
    const text = textEditor.value.trim();
    if (!text) {
        alert('Please enter some text to analyze.');
        return;
    }
    
    console.log('🔄 Processing text for grammar check...');
    
    // Copy text to grammar checker and switch to that tool
    const grammarText = document.getElementById('grammar-text');
    if (grammarText) {
        grammarText.value = text;
    }
    
    showTool('grammar-check');
    
    // Run analysis after a short delay
    setTimeout(() => {
        analyzeGrammar();
    }, 500);
}

function exportToWord() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found');
        return;
    }
    
    const text = textEditor.value.trim();
    if (!text) {
        alert('Please enter some text to export.');
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Text copied to clipboard! You can now paste it into Word.');
    }).catch(() => {
        // Fallback - create a text file for download
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'alana-writing.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('📄 Text file downloaded! You can open it in Word.');
    });
}

function saveText() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found');
        return;
    }
    
    const text = textEditor.value;
    localStorage.setItem('alana-writing-backup', text);
    localStorage.setItem('alana-writing-date', new Date().toISOString());
    
    alert('✅ Your work has been saved locally!');
}

// Character Tracker Functions
function addCharacter() {
    const nameInput = document.getElementById('char-name');
    const roleSelect = document.getElementById('char-role');
    const descriptionInput = document.getElementById('char-description');
    
    if (!nameInput || !roleSelect || !descriptionInput) {
        alert('Character form not found');
        return;
    }
    
    const name = nameInput.value.trim();
    const role = roleSelect.value;
    const description = descriptionInput.value.trim();
    
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
    
    characters.push(character);
    displayCharacters();
    
    // Clear form
    nameInput.value = '';
    descriptionInput.value = '';
    
    console.log(`✅ Added character: ${name}`);
}

function displayCharacters() {
    const display = document.getElementById('characters-display');
    if (!display) return;
    
    if (characters.length === 0) {
        display.innerHTML = '<p class="placeholder-text">No characters added yet. Create your first character above!</p>';
        return;
    }
    
    const html = characters.map(char => `
        <div class="character-card" data-id="${char.id}">
            <h4>${char.name}</h4>
            <span class="character-role">${char.role}</span>
            <p>${char.description}</p>
            <button class="delete-btn" onclick="deleteCharacter(${char.id})">🗑️ Delete</button>
        </div>
    `).join('');
    
    display.innerHTML = html;
}

function deleteCharacter(id) {
    if (confirm('Are you sure you want to delete this character?')) {
        characters = characters.filter(char => char.id !== id);
        displayCharacters();
    }
}

// Grammar Check Functions
function analyzeGrammar() {
    const grammarText = document.getElementById('grammar-text');
    const resultsDiv = document.getElementById('grammar-results');
    
    if (!grammarText || !resultsDiv) {
        alert('Grammar checker interface not found');
        return;
    }
    
    const text = grammarText.value.trim();
    if (!text) {
        alert('Please enter some text to analyze.');
        return;
    }
    
    console.log('🔍 Analyzing grammar...');
    resultsDiv.innerHTML = '<p>🔄 Analyzing your text...</p>';
    
    // Simple analysis
    setTimeout(() => {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length - 1;
        const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
        const paragraphs = text.split(/\n\s*\n/).length;
        
        const results = `
            <div class="grammar-section">
                <h5>📊 Text Analysis:</h5>
                <p><strong>Word Count:</strong> ${words}</p>
                <p><strong>Sentences:</strong> ${sentences}</p>
                <p><strong>Paragraphs:</strong> ${paragraphs}</p>
                <p><strong>Average Words per Sentence:</strong> ${avgWordsPerSentence}</p>
            </div>
            <div class="grammar-section">
                <h5>✅ Writing Feedback:</h5>
                <ul>
                    <li>${avgWordsPerSentence > 25 ? 'Consider shortening some sentences for better readability' : 'Good sentence length variety'}</li>
                    <li>${words > 500 ? 'Substantial content - great progress!' : 'Consider expanding your ideas'}</li>
                    <li>Review for any repeated words or phrases</li>
                    <li>Check for consistent point of view</li>
                </ul>
            </div>
        `;
        
        resultsDiv.innerHTML = results;
    }, 1000);
}

// Notes functionality
function saveNotes() {
    const notesTextarea = document.getElementById('quick-notes');
    if (notesTextarea) {
        const notes = notesTextarea.value;
        localStorage.setItem('alana-quick-notes', notes);
        localStorage.setItem('alana-notes-date', new Date().toISOString());
        alert('✅ Notes saved!');
    }
}

function loadNotes() {
    const savedNotes = localStorage.getItem('alana-quick-notes');
    const notesTextarea = document.getElementById('quick-notes');
    
    if (savedNotes && notesTextarea) {
        notesTextarea.value = savedNotes;
    }
}

// Load saved work function
function loadSavedWork() {
    const savedText = localStorage.getItem('alana-writing-backup');
    const savedDate = localStorage.getItem('alana-writing-date');
    
    if (savedText && savedDate) {
        const formattedDate = new Date(savedDate).toLocaleDateString();
        const confirmLoad = confirm(`Found saved work from ${formattedDate}. Load it into the text editor?`);
        
        if (confirmLoad) {
            showTool('text-editor');
            setTimeout(() => {
                const textEditor = document.getElementById('main-text-editor');
                if (textEditor) {
                    textEditor.value = savedText;
                    updateEditorStats();
                    alert('✅ Saved work loaded!');
                }
            }, 500);
        }
    } else {
        alert('No saved work found.');
    }
}

console.log('✅ Alana\'s Writing Tools loaded and ready!');
