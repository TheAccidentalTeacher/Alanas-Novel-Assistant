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
    window.analyzeGrammarAI = analyzeGrammarAI;
    window.analyzeStyle = analyzeStyle;
    window.analyzeStyleAI = analyzeStyleAI;
    window.getCreativeHelp = getCreativeHelp;
    window.getCharacterHelp = getCharacterHelp;
    window.getPlotHelp = getPlotHelp;
    window.searchCharacterImages = searchCharacterImages;
    window.searchBookCoverImages = searchBookCoverImages;
    window.closeAIModal = closeAIModal;
    window.copyAIResponse = copyAIResponse;
    window.closeImageModal = closeImageModal;
    window.openImageFull = openImageFull;
    window.savePlotOutline = savePlotOutline;
    window.loadPlotOutline = loadPlotOutline;
    window.exportPlotOutline = exportPlotOutline;
    window.addScene = addScene;
    window.deleteScene = deleteScene;
    window.updateProgress = updateProgress;
    window.resetDailyProgress = resetDailyProgress;
    window.exportToClipboard = exportToClipboard;
    window.downloadAsText = downloadAsText;
    window.formatForSubmission = formatForSubmission;
    window.addResearchNote = addResearchNote;
    window.deleteResearchNote = deleteResearchNote;
    window.saveNotes = saveNotes;
    window.loadSavedWork = loadSavedWork;
    
    // Initialize text editor if it exists
    const textEditor = document.getElementById('main-text-editor');
    if (textEditor) {
        textEditor.addEventListener('input', updateEditorStats);
        updateEditorStats();
    }
    
    // Load saved notes and data
    loadNotes();
    loadSavedData();
    
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

// Style Analysis Functions
function analyzeStyle() {
    const styleText = document.getElementById('style-text');
    const resultsDiv = document.getElementById('style-results');
    
    if (!styleText || !resultsDiv) {
        alert('Style analysis interface not found');
        return;
    }
    
    const text = styleText.value.trim();
    if (!text) {
        alert('Please enter some text to analyze.');
        return;
    }
    
    console.log('🎨 Analyzing writing style...');
    resultsDiv.innerHTML = '<p>🔄 Analyzing your writing style...</p>';
    
    setTimeout(() => {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length - 1;
        const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
        const paragraphs = text.split(/\n\s*\n/).length;
        
        // Style analysis
        const complexWords = text.split(/\s+/).filter(word => word.length > 6).length;
        const simpleWords = words - complexWords;
        const readabilityScore = Math.max(1, Math.min(10, 10 - (avgWordsPerSentence / 5) + (simpleWords / words * 2)));
        
        const results = `
            <div class="style-section">
                <h5>📊 Writing Style Metrics:</h5>
                <p><strong>Readability Score:</strong> ${readabilityScore.toFixed(1)}/10</p>
                <p><strong>Average Sentence Length:</strong> ${avgWordsPerSentence} words</p>
                <p><strong>Complex Words:</strong> ${complexWords} (${((complexWords/words)*100).toFixed(1)}%)</p>
                <p><strong>Paragraph Count:</strong> ${paragraphs}</p>
            </div>
            <div class="style-section">
                <h5>✍️ Style Recommendations:</h5>
                <ul>
                    <li>${avgWordsPerSentence > 20 ? 'Consider varying sentence length for better flow' : 'Good sentence variety'}</li>
                    <li>${complexWords/words > 0.3 ? 'Consider simplifying some complex words for clarity' : 'Good vocabulary balance'}</li>
                    <li>${paragraphs < 3 ? 'Consider breaking text into more paragraphs' : 'Good paragraph structure'}</li>
                    <li>Check for consistent point of view and tense</li>
                </ul>
            </div>
        `;
        
        resultsDiv.innerHTML = results;
    }, 1200);
}

// Plot Outline Functions
let plotOutlines = {};

function savePlotOutline() {
    const beginning = document.getElementById('plot-beginning')?.value || '';
    const middle = document.getElementById('plot-middle')?.value || '';
    const end = document.getElementById('plot-end')?.value || '';
    
    plotOutlines.current = { beginning, middle, end };
    localStorage.setItem('alana-plot-outline', JSON.stringify(plotOutlines.current));
    localStorage.setItem('alana-plot-date', new Date().toISOString());
    
    alert('✅ Plot outline saved!');
}

function loadPlotOutline() {
    const saved = localStorage.getItem('alana-plot-outline');
    if (saved) {
        const outline = JSON.parse(saved);
        document.getElementById('plot-beginning').value = outline.beginning || '';
        document.getElementById('plot-middle').value = outline.middle || '';
        document.getElementById('plot-end').value = outline.end || '';
        alert('✅ Plot outline loaded!');
    } else {
        alert('No saved plot outline found.');
    }
}

function exportPlotOutline() {
    const beginning = document.getElementById('plot-beginning')?.value || '';
    const middle = document.getElementById('plot-middle')?.value || '';
    const end = document.getElementById('plot-end')?.value || '';
    
    const outline = `PLOT OUTLINE\n\n=== ACT I: BEGINNING ===\n${beginning}\n\n=== ACT II: MIDDLE ===\n${middle}\n\n=== ACT III: END ===\n${end}`;
    
    navigator.clipboard.writeText(outline).then(() => {
        alert('✅ Plot outline copied to clipboard!');
    }).catch(() => {
        // Fallback download
        const blob = new Blob([outline], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plot-outline.txt';
        a.click();
        window.URL.revokeObjectURL(url);
        alert('📄 Plot outline downloaded!');
    });
}

// Scene Manager Functions
let scenes = [];

function addScene() {
    const titleInput = document.getElementById('scene-title');
    const typeSelect = document.getElementById('scene-type');
    const notesInput = document.getElementById('scene-notes');
    
    if (!titleInput || !typeSelect || !notesInput) {
        alert('Scene form not found');
        return;
    }
    
    const title = titleInput.value.trim();
    const type = typeSelect.value;
    const notes = notesInput.value.trim();
    
    if (!title) {
        alert('Please enter a scene title.');
        return;
    }
    
    const scene = {
        id: Date.now(),
        title,
        type,
        notes: notes || 'No notes provided.'
    };
    
    scenes.push(scene);
    displayScenes();
    localStorage.setItem('alana-scenes', JSON.stringify(scenes));
    
    // Clear form
    titleInput.value = '';
    notesInput.value = '';
    
    console.log(`✅ Added scene: ${title}`);
}

function displayScenes() {
    const display = document.getElementById('scenes-display');
    if (!display) return;
    
    if (scenes.length === 0) {
        display.innerHTML = '<p class="placeholder-text">No scenes added yet. Create your first scene above!</p>';
        return;
    }
    
    const html = scenes.map(scene => `
        <div class="scene-card" data-id="${scene.id}">
            <h4>${scene.title}</h4>
            <span class="scene-type">${scene.type}</span>
            <p>${scene.notes}</p>
            <button class="delete-btn" onclick="deleteScene(${scene.id})">🗑️ Delete</button>
        </div>
    `).join('');
    
    display.innerHTML = html;
}

function deleteScene(id) {
    if (confirm('Are you sure you want to delete this scene?')) {
        scenes = scenes.filter(scene => scene.id !== id);
        displayScenes();
        localStorage.setItem('alana-scenes', JSON.stringify(scenes));
    }
}

// Progress Tracking Functions
function updateProgress() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found. Open the text editor first.');
        return;
    }
    
    const text = textEditor.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    // Update today's progress
    const today = new Date().toDateString();
    let dailyProgress = JSON.parse(localStorage.getItem('alana-daily-progress') || '{}');
    dailyProgress[today] = words;
    localStorage.setItem('alana-daily-progress', JSON.stringify(dailyProgress));
    
    // Update total progress
    localStorage.setItem('alana-total-words', words.toString());
    
    // Update display
    document.getElementById('today-progress').textContent = `${words} words`;
    document.getElementById('total-progress').textContent = `${words} words`;
    
    alert(`✅ Progress updated: ${words} words!`);
}

function resetDailyProgress() {
    if (confirm('Reset today\'s progress counter?')) {
        const today = new Date().toDateString();
        let dailyProgress = JSON.parse(localStorage.getItem('alana-daily-progress') || '{}');
        dailyProgress[today] = 0;
        localStorage.setItem('alana-daily-progress', JSON.stringify(dailyProgress));
        
        document.getElementById('today-progress').textContent = '0 words';
        alert('✅ Daily progress reset!');
    }
}

// Export Tools Functions
function exportToClipboard() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found. Open the text editor first.');
        return;
    }
    
    const text = textEditor.value.trim();
    if (!text) {
        alert('No text to export. Write something first!');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Text copied to clipboard!');
    }).catch(() => {
        alert('❌ Failed to copy to clipboard. Try the download option instead.');
    });
}

function downloadAsText() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found. Open the text editor first.');
        return;
    }
    
    const text = textEditor.value.trim();
    if (!text) {
        alert('No text to export. Write something first!');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `alana-writing-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert('📄 Text file downloaded!');
}

function formatForSubmission() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found. Open the text editor first.');
        return;
    }
    
    const text = textEditor.value.trim();
    if (!text) {
        alert('No text to format. Write something first!');
        return;
    }
    
    // Basic manuscript formatting
    const formatted = text
        .split('\n\n')
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0)
        .map(paragraph => '    ' + paragraph) // Indent paragraphs
        .join('\n\n');
    
    const manuscript = `MANUSCRIPT FORMAT\n\nTitle: [Your Title Here]\nAuthor: Alana Terry\nDate: ${new Date().toLocaleDateString()}\n\n${formatted}`;
    
    navigator.clipboard.writeText(manuscript).then(() => {
        alert('✅ Formatted manuscript copied to clipboard!');
    }).catch(() => {
        // Fallback download
        const blob = new Blob([manuscript], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted-manuscript.txt';
        a.click();
        window.URL.revokeObjectURL(url);
        alert('📄 Formatted manuscript downloaded!');
    });
}

// Research Notes Functions
let researchNotes = [];

function addResearchNote() {
    const topicInput = document.getElementById('research-topic');
    const categorySelect = document.getElementById('research-category');
    const contentInput = document.getElementById('research-content');
    
    if (!topicInput || !categorySelect || !contentInput) {
        alert('Research form not found');
        return;
    }
    
    const topic = topicInput.value.trim();
    const category = categorySelect.value;
    const content = contentInput.value.trim();
    
    if (!topic) {
        alert('Please enter a research topic.');
        return;
    }
    
    const note = {
        id: Date.now(),
        topic,
        category,
        content: content || 'No content provided.',
        date: new Date().toLocaleDateString()
    };
    
    researchNotes.push(note);
    displayResearchNotes();
    localStorage.setItem('alana-research', JSON.stringify(researchNotes));
    
    // Clear form
    topicInput.value = '';
    contentInput.value = '';
    
    console.log(`✅ Added research note: ${topic}`);
}

function displayResearchNotes() {
    const display = document.getElementById('research-display');
    if (!display) return;
    
    if (researchNotes.length === 0) {
        display.innerHTML = '<p class="placeholder-text">No research notes yet. Add your first note above!</p>';
        return;
    }
    
    const html = researchNotes.map(note => `
        <div class="research-card" data-id="${note.id}">
            <h4>${note.topic}</h4>
            <span class="research-category">${note.category}</span>
            <span class="research-date">${note.date}</span>
            <p>${note.content}</p>
            <button class="delete-btn" onclick="deleteResearchNote(${note.id})">🗑️ Delete</button>
        </div>
    `).join('');
    
    display.innerHTML = html;
}

function deleteResearchNote(id) {
    if (confirm('Are you sure you want to delete this research note?')) {
        researchNotes = researchNotes.filter(note => note.id !== id);
        displayResearchNotes();
        localStorage.setItem('alana-research', JSON.stringify(researchNotes));
    }
}

// Load saved data on initialization
function loadSavedData() {
    // Load scenes
    const savedScenes = localStorage.getItem('alana-scenes');
    if (savedScenes) {
        scenes = JSON.parse(savedScenes);
        displayScenes();
    }
    
    // Load research notes
    const savedResearch = localStorage.getItem('alana-research');
    if (savedResearch) {
        researchNotes = JSON.parse(savedResearch);
        displayResearchNotes();
    }
    
    // Load plot outline
    const savedPlot = localStorage.getItem('alana-plot-outline');
    if (savedPlot) {
        plotOutlines.current = JSON.parse(savedPlot);
    }
}

// AI Assistant Integration
async function callAI(text, action, context = '') {
    try {
        const response = await fetch('/api/ai-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                action,
                context
            })
        });

        const data = await response.json();
        
        if (data.success) {
            return data.response;
        } else {
            console.error('AI Error:', data.error);
            return data.fallback || 'AI assistance unavailable';
        }
    } catch (error) {
        console.error('AI Request Error:', error);
        return 'AI assistance temporarily unavailable';
    }
}

// Enhanced Grammar Check with AI
async function analyzeGrammarAI() {
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
    
    resultsDiv.innerHTML = '<p>🤖 AI is analyzing your text for grammar and style...</p>';
    
    try {
        const aiResponse = await callAI(text, 'grammar');
        
        // Also run basic analysis
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length - 1;
        const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
        
        const results = `
            <div class="grammar-section">
                <h5>🤖 AI Grammar & Style Analysis:</h5>
                <div class="ai-response">${aiResponse.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="grammar-section">
                <h5>📊 Basic Text Stats:</h5>
                <p><strong>Words:</strong> ${words} | <strong>Sentences:</strong> ${sentences} | <strong>Avg per sentence:</strong> ${avgWordsPerSentence}</p>
            </div>
        `;
        
        resultsDiv.innerHTML = results;
    } catch (error) {
        console.error('AI Grammar Error:', error);
        // Fallback to basic analysis
        analyzeGrammar();
    }
}

// Enhanced Style Analysis with AI
async function analyzeStyleAI() {
    const styleText = document.getElementById('style-text');
    const resultsDiv = document.getElementById('style-results');
    
    if (!styleText || !resultsDiv) {
        alert('Style analysis interface not found');
        return;
    }
    
    const text = styleText.value.trim();
    if (!text) {
        alert('Please enter some text to analyze.');
        return;
    }
    
    resultsDiv.innerHTML = '<p>🤖 AI is analyzing your writing style...</p>';
    
    try {
        const aiResponse = await callAI(text, 'style');
        
        const results = `
            <div class="style-section">
                <h5>🤖 AI Style Analysis:</h5>
                <div class="ai-response">${aiResponse.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        
        resultsDiv.innerHTML = results;
    } catch (error) {
        console.error('AI Style Error:', error);
        // Fallback to basic analysis
        analyzeStyle();
    }
}

// AI Creative Writing Assistant
async function getCreativeHelp() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found. Open the text editor first.');
        return;
    }
    
    const text = textEditor.value.trim();
    const prompt = prompt('What kind of creative help do you need? (e.g., "continue this scene", "develop this character", "overcome writer\'s block")');
    
    if (!prompt) return;
    
    const context = text ? `Current writing: "${text.substring(0, 200)}..."` : 'Starting new writing';
    
    try {
        const aiResponse = await callAI(prompt, 'creative', context);
        
        // Show response in a modal or new section
        showAIResponse('Creative Writing Help', aiResponse);
    } catch (error) {
        console.error('Creative AI Error:', error);
        alert('Creative assistance temporarily unavailable');
    }
}

// AI Character Development Help
async function getCharacterHelp() {
    const characters = document.querySelectorAll('.character-card');
    const characterList = Array.from(characters).map(card => 
        card.querySelector('h4').textContent
    ).join(', ');
    
    const prompt = prompt('What character development help do you need? (e.g., "develop backstory for Kennedy", "create dialogue for conflict scene")');
    
    if (!prompt) return;
    
    const context = characterList ? `Existing characters: ${characterList}` : 'Creating new characters';
    
    try {
        const aiResponse = await callAI(prompt, 'character', context);
        showAIResponse('Character Development Help', aiResponse);
    } catch (error) {
        console.error('Character AI Error:', error);
        alert('Character development assistance temporarily unavailable');
    }
}

// AI Plot Development Help
async function getPlotHelp() {
    const plotBeginning = document.getElementById('plot-beginning')?.value || '';
    const plotMiddle = document.getElementById('plot-middle')?.value || '';
    const plotEnd = document.getElementById('plot-end')?.value || '';
    
    const prompt = prompt('What plot help do you need? (e.g., "help with middle act", "resolve plot hole", "strengthen ending")');
    
    if (!prompt) return;
    
    const context = `Plot outline: Beginning: ${plotBeginning.substring(0, 100)}... Middle: ${plotMiddle.substring(0, 100)}... End: ${plotEnd.substring(0, 100)}...`;
    
    try {
        const aiResponse = await callAI(prompt, 'plot', context);
        showAIResponse('Plot Development Help', aiResponse);
    } catch (error) {
        console.error('Plot AI Error:', error);
        alert('Plot development assistance temporarily unavailable');
    }
}

// Show AI Response in Modal
function showAIResponse(title, response) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('ai-response-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ai-response-modal';
        modal.className = 'ai-modal hidden';
        modal.innerHTML = `
            <div class="ai-modal-content">
                <div class="ai-modal-header">
                    <h3 id="ai-modal-title">AI Assistant</h3>
                    <button class="close-btn" onclick="closeAIModal()">✖️</button>
                </div>
                <div class="ai-modal-body" id="ai-modal-body">
                    <p>Loading...</p>
                </div>
                <div class="ai-modal-footer">
                    <button class="btn-primary" onclick="copyAIResponse()">Copy Response</button>
                    <button class="btn-secondary" onclick="closeAIModal()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('ai-modal-title').textContent = title;
    document.getElementById('ai-modal-body').innerHTML = response.replace(/\n/g, '<br>');
    modal.classList.remove('hidden');
}

function closeAIModal() {
    const modal = document.getElementById('ai-response-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function copyAIResponse() {
    const responseText = document.getElementById('ai-modal-body').textContent;
    navigator.clipboard.writeText(responseText).then(() => {
        alert('✅ AI response copied to clipboard!');
    }).catch(() => {
        alert('❌ Failed to copy response');
    });
}

// Image Search Integration
async function searchImages(query, source = 'pexels') {
    try {
        const response = await fetch(`/api/image-search?query=${encodeURIComponent(query)}&source=${source}&per_page=6`);
        const data = await response.json();
        
        if (data.success) {
            return data.images;
        } else {
            console.error('Image Search Error:', data.error);
            return [];
        }
    } catch (error) {
        console.error('Image Search Request Error:', error);
        return [];
    }
}

// Character Image Search
async function searchCharacterImages() {
    const query = prompt('Search for character inspiration images (e.g., "young woman detective", "college student")');
    if (!query) return;
    
    try {
        const images = await searchImages(query, 'pexels');
        showImageResults('Character Inspiration', images);
    } catch (error) {
        alert('Image search temporarily unavailable');
    }
}

// Book Cover Image Search
async function searchBookCoverImages() {
    const query = prompt('Search for book cover inspiration (e.g., "mystery book cover", "suspense novel")');
    if (!query) return;
    
    try {
        const images = await searchImages(query, 'pexels');
        showImageResults('Book Cover Inspiration', images);
    } catch (error) {
        alert('Image search temporarily unavailable');
    }
}

// Show Image Search Results
function showImageResults(title, images) {
    let modal = document.getElementById('image-results-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-results-modal';
        modal.className = 'ai-modal hidden';
        modal.innerHTML = `
            <div class="ai-modal-content large">
                <div class="ai-modal-header">
                    <h3 id="image-modal-title">Image Search</h3>
                    <button class="close-btn" onclick="closeImageModal()">✖️</button>
                </div>
                <div class="ai-modal-body" id="image-modal-body">
                    <div class="image-grid" id="image-grid"></div>
                </div>
                <div class="ai-modal-footer">
                    <button class="btn-secondary" onclick="closeImageModal()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('image-modal-title').textContent = title;
    
    const imageGrid = document.getElementById('image-grid');
    if (images.length === 0) {
        imageGrid.innerHTML = '<p>No images found. Try a different search term.</p>';
    } else {
        imageGrid.innerHTML = images.map(img => `
            <div class="image-result">
                <img src="${img.thumbnail}" alt="${img.alt}" onclick="openImageFull('${img.url}')">
                <p>${img.alt}</p>
                <small>by ${img.photographer} (${img.source})</small>
            </div>
        `).join('');
    }
    
    modal.classList.remove('hidden');
}

function closeImageModal() {
    const modal = document.getElementById('image-results-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function openImageFull(url) {
    window.open(url, '_blank');
}
