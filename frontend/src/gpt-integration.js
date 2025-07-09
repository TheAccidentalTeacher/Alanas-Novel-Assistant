// GPT API integration for Alana's Writing Tools
// This will be loaded after app.js

// GPT API configuration
const GPT_CONFIG = {
    apiKey: '', // Will be set by user
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7
};

// Initialize GPT functionality
function initializeGPT() {
    // Check if API key is stored
    const savedKey = localStorage.getItem('alana-gpt-api-key');
    if (savedKey) {
        GPT_CONFIG.apiKey = savedKey;
        showGPTFeatures();
    } else {
        showAPIKeySetup();
    }
}

// Show API key setup interface
function showAPIKeySetup() {
    const setupHTML = `
        <div id="gpt-setup" class="gpt-setup">
            <div class="setup-card">
                <h3>🤖 Enable AI Writing Assistant</h3>
                <p>Enter your OpenAI API key to unlock advanced writing features:</p>
                <ul>
                    <li>AI-powered grammar and style checking</li>
                    <li>Plot development assistance</li>
                    <li>Character development suggestions</li>
                    <li>Writing block breakthrough</li>
                    <li>Scene and dialogue improvement</li>
                </ul>
                <div class="api-key-form">
                    <input type="password" id="gpt-api-key" placeholder="Enter your OpenAI API key (sk-...)">
                    <button class="btn-primary" onclick="saveAPIKey()">Enable AI Features</button>
                </div>
                <p class="setup-note">Your API key is stored locally and never shared. You can remove it anytime.</p>
            </div>
        </div>
    `;
    
    // Add to page if not already there
    if (!document.getElementById('gpt-setup')) {
        document.body.insertAdjacentHTML('beforeend', setupHTML);
    }
}

// Save API key and enable features
function saveAPIKey() {
    const keyInput = document.getElementById('gpt-api-key');
    const apiKey = keyInput.value.trim();
    
    if (!apiKey.startsWith('sk-')) {
        alert('Please enter a valid OpenAI API key (starts with sk-)');
        return;
    }
    
    GPT_CONFIG.apiKey = apiKey;
    localStorage.setItem('alana-gpt-api-key', apiKey);
    
    // Remove setup interface
    const setupDiv = document.getElementById('gpt-setup');
    if (setupDiv) {
        setupDiv.remove();
    }
    
    showGPTFeatures();
    alert('✅ AI writing features enabled!');
}

// Show GPT-powered features in tools
function showGPTFeatures() {
    // Add AI buttons to text editor
    addAIButtonsToTextEditor();
    
    // Add AI features to grammar checker
    enhanceGrammarChecker();
    
    // Add AI features to character tracker
    enhanceCharacterTracker();
    
    // Add AI features to plot outliner
    enhancePlotOutliner();
    
    // Add creative writing assistant
    addCreativeWritingAssistant();
}

// Add AI buttons to text editor toolbar
function addAIButtonsToTextEditor() {
    const toolbar = document.querySelector('.editor-toolbar');
    if (!toolbar || toolbar.querySelector('.ai-btn')) return; // Already added
    
    const aiButtons = `
        <button class="toolbar-btn ai-btn" onclick="improveWriting()">🤖 Improve Writing</button>
        <button class="toolbar-btn ai-btn" onclick="continueStory()">✨ Continue Story</button>
        <button class="toolbar-btn ai-btn" onclick="checkGrammarAI()">📝 AI Grammar Check</button>
    `;
    
    toolbar.insertAdjacentHTML('beforeend', aiButtons);
}

// Enhance grammar checker with AI
function enhanceGrammarChecker() {
    const grammarInterface = document.querySelector('.grammar-interface .input-section');
    if (!grammarInterface || grammarInterface.querySelector('.ai-grammar-btn')) return;
    
    const aiGrammarButton = `
        <button class="btn-secondary ai-grammar-btn" onclick="analyzeGrammarAI()">🤖 AI Grammar Analysis</button>
    `;
    
    grammarInterface.insertAdjacentHTML('beforeend', aiGrammarButton);
}

// Add AI features to character tracker
function enhanceCharacterTracker() {
    const characterForm = document.querySelector('.character-form');
    if (!characterForm || characterForm.querySelector('.ai-character-btn')) return;
    
    const aiCharacterButton = `
        <button class="btn-secondary ai-character-btn" onclick="developCharacterAI()">🤖 AI Character Development</button>
    `;
    
    characterForm.insertAdjacentHTML('beforeend', aiCharacterButton);
}

// Add AI features to plot outliner
function enhancePlotOutliner() {
    const plotActions = document.querySelector('.plot-actions');
    if (!plotActions || plotActions.querySelector('.ai-plot-btn')) return;
    
    const aiPlotButton = `
        <button class="btn-secondary ai-plot-btn" onclick="developPlotAI()">🤖 AI Plot Development</button>
    `;
    
    plotActions.insertAdjacentHTML('beforeend', aiPlotButton);
}

// Add creative writing assistant tool
function addCreativeWritingAssistant() {
    const toolInterface = document.getElementById('tool-interface');
    if (!toolInterface || document.getElementById('ai-assistant-tool')) return;
    
    const aiAssistantHTML = `
        <div id="ai-assistant-tool" class="tool-content hidden">
            <div class="tool-header">
                <h3>🤖 AI Writing Assistant</h3>
                <button class="close-btn" onclick="closeTool()">✖️ Close</button>
            </div>
            <div class="ai-assistant-interface">
                <div class="ai-input-section">
                    <h4>Ask Your AI Writing Assistant</h4>
                    <textarea id="ai-prompt" placeholder="Ask anything about your story: 'How should Kennedy react to this situation?' or 'What's a good way to end this chapter?'"></textarea>
                    <button class="btn-primary" onclick="askAIAssistant()">Ask AI</button>
                </div>
                <div class="ai-response-section">
                    <h4>AI Response</h4>
                    <div id="ai-response">
                        <p class="placeholder-text">Ask your AI assistant any writing question above.</p>
                    </div>
                </div>
                <div class="ai-presets">
                    <h4>Quick AI Assists</h4>
                    <div class="preset-buttons">
                        <button class="preset-btn" onclick="quickAIAssist('plot-twist')">Plot Twist Ideas</button>
                        <button class="preset-btn" onclick="quickAIAssist('character-conflict')">Character Conflicts</button>
                        <button class="preset-btn" onclick="quickAIAssist('scene-transition')">Scene Transitions</button>
                        <button class="preset-btn" onclick="quickAIAssist('dialogue-improvement')">Improve Dialogue</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    toolInterface.insertAdjacentHTML('beforeend', aiAssistantHTML);
    
    // Add to tool menu
    const aiToolButton = `
        <button class="tool-btn" onclick="showTool('ai-assistant')">🤖 AI Assistant</button>
    `;
    
    // Find a good place to add it (maybe in Writing & Editing section)
    const writingSection = document.querySelector('.tool-category .tool-buttons');
    if (writingSection) {
        writingSection.insertAdjacentHTML('beforeend', aiToolButton);
    }
}

// AI-powered writing improvement
async function improveWriting() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found');
        return;
    }
    
    const selectedText = getSelectedText(textEditor) || textEditor.value.slice(-500); // Last 500 chars if no selection
    if (!selectedText.trim()) {
        alert('Please select text to improve or write something first.');
        return;
    }
    
    const prompt = `Please improve this writing for a Kennedy Stern mystery novel. Make it more engaging, clear, and well-paced while maintaining the author's voice:\n\n"${selectedText}"`;
    
    const response = await callGPTAPI(prompt);
    if (response) {
        showAIResponse('Writing Improvement', response, selectedText);
    }
}

// AI story continuation
async function continueStory() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found');
        return;
    }
    
    const currentText = textEditor.value.slice(-1000); // Last 1000 characters for context
    if (!currentText.trim()) {
        alert('Please write something first for the AI to continue from.');
        return;
    }
    
    const prompt = `Continue this Kennedy Stern mystery story in Alana Terry's style. Keep the tone consistent and advance the plot naturally:\n\n"${currentText}"`;
    
    const response = await callGPTAPI(prompt);
    if (response) {
        showAIResponse('Story Continuation', response);
    }
}

// AI grammar checking
async function checkGrammarAI() {
    const textEditor = document.getElementById('main-text-editor');
    if (!textEditor) {
        alert('Text editor not found');
        return;
    }
    
    const text = textEditor.value.trim();
    if (!text) {
        alert('Please write something first.');
        return;
    }
    
    const prompt = `Please check this text for grammar, spelling, and style issues. Provide specific corrections and suggestions:\n\n"${text}"`;
    
    const response = await callGPTAPI(prompt);
    if (response) {
        showAIResponse('Grammar & Style Check', response);
    }
}

// AI grammar analysis for grammar tool
async function analyzeGrammarAI() {
    const grammarText = document.getElementById('grammar-text');
    const resultsDiv = document.getElementById('grammar-results');
    
    if (!grammarText || !resultsDiv) {
        alert('Grammar checker interface not found');
        return;
    }
    
    const text = grammarText.value.trim();
    if (!text) {
        alert('Please enter text to analyze.');
        return;
    }
    
    resultsDiv.innerHTML = '<p>🤖 AI is analyzing your text...</p>';
    
    const prompt = `Analyze this text for grammar, style, readability, and provide detailed writing feedback with specific suggestions for improvement:\n\n"${text}"`;
    
    const response = await callGPTAPI(prompt);
    if (response) {
        resultsDiv.innerHTML = `
            <div class="ai-grammar-results">
                <h5>🤖 AI Grammar & Style Analysis:</h5>
                <div class="ai-feedback">${response.replace(/\n/g, '<br>')}</div>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = '<p>❌ Failed to get AI analysis. Please try again.</p>';
    }
}

// AI character development
async function developCharacterAI() {
    const nameInput = document.getElementById('char-name');
    const roleSelect = document.getElementById('char-role');
    const descriptionInput = document.getElementById('char-description');
    
    if (!nameInput) {
        alert('Character form not found');
        return;
    }
    
    const name = nameInput.value.trim();
    const role = roleSelect.value;
    const existingDescription = descriptionInput.value.trim();
    
    if (!name) {
        alert('Please enter a character name first.');
        return;
    }
    
    const prompt = `Develop a detailed character profile for "${name}", a ${role} in a Kennedy Stern mystery novel. ${existingDescription ? `Building on this existing description: "${existingDescription}"` : ''} Include personality traits, background, motivations, potential story arcs, and how they might interact with other characters.`;
    
    const response = await callGPTAPI(prompt);
    if (response) {
        descriptionInput.value = response;
        alert('✅ AI has enhanced your character description!');
    }
}

// AI plot development
async function developPlotAI() {
    const beginning = document.getElementById('plot-beginning')?.value || '';
    const middle = document.getElementById('plot-middle')?.value || '';
    const end = document.getElementById('plot-end')?.value || '';
    
    const currentPlot = `Beginning: ${beginning}\nMiddle: ${middle}\nEnd: ${end}`;
    
    const prompt = `Help develop this Kennedy Stern mystery plot. Suggest improvements, add tension, resolve plot holes, and make it more engaging:\n\n${currentPlot}`;
    
    const response = await callGPTAPI(prompt);
    if (response) {
        showAIResponse('Plot Development Suggestions', response);
    }
}

// AI writing assistant
async function askAIAssistant() {
    const promptInput = document.getElementById('ai-prompt');
    const responseDiv = document.getElementById('ai-response');
    
    if (!promptInput || !responseDiv) {
        alert('AI assistant interface not found');
        return;
    }
    
    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
        alert('Please enter a question for the AI assistant.');
        return;
    }
    
    responseDiv.innerHTML = '<p>🤖 AI is thinking...</p>';
    
    const contextPrompt = `You are a writing assistant helping Alana Terry with her Kennedy Stern mystery novels. Answer this writing question: "${userPrompt}"`;
    
    const response = await callGPTAPI(contextPrompt);
    if (response) {
        responseDiv.innerHTML = `
            <div class="ai-assistant-response">
                <div class="ai-text">${response.replace(/\n/g, '<br>')}</div>
            </div>
        `;
    } else {
        responseDiv.innerHTML = '<p>❌ Failed to get AI response. Please try again.</p>';
    }
}

// Quick AI assists
async function quickAIAssist(type) {
    const prompts = {
        'plot-twist': 'Generate 3 creative plot twist ideas for a Kennedy Stern mystery novel.',
        'character-conflict': 'Suggest interesting character conflicts and tensions for a mystery story.',
        'scene-transition': 'Provide smooth scene transition techniques for mystery novels.',
        'dialogue-improvement': 'Give tips for writing more natural and engaging dialogue in mystery novels.'
    };
    
    const prompt = prompts[type];
    if (!prompt) return;
    
    const response = await callGPTAPI(prompt);
    if (response) {
        showAIResponse('AI Quick Assist', response);
    }
}

// Call GPT API
async function callGPTAPI(prompt) {
    if (!GPT_CONFIG.apiKey) {
        alert('Please set up your OpenAI API key first.');
        showAPIKeySetup();
        return null;
    }
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: GPT_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional writing assistant helping Alana Terry with her Kennedy Stern mystery novels. Provide helpful, specific, and actionable writing advice.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: GPT_CONFIG.maxTokens,
                temperature: GPT_CONFIG.temperature
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('GPT API Error:', error);
        alert('Failed to get AI response. Please check your API key and internet connection.');
        return null;
    }
}

// Show AI response in a modal or dedicated area
function showAIResponse(title, response, originalText = '') {
    const modal = document.createElement('div');
    modal.className = 'ai-response-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="this.closest('.ai-response-modal').remove()">✖️</button>
            </div>
            <div class="modal-body">
                ${originalText ? `<div class="original-text"><h4>Original:</h4><p>${originalText}</p></div>` : ''}
                <div class="ai-suggestion">
                    <h4>AI Suggestion:</h4>
                    <div class="ai-text">${response.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="copyToClipboard('${response.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
                    <button class="btn-secondary" onclick="this.closest('.ai-response-modal').remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Utility functions
function getSelectedText(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return textarea.value.substring(start, end);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Copied to clipboard!');
    });
}

// Remove API key (if user wants to)
function removeAPIKey() {
    if (confirm('Remove OpenAI API key and disable AI features?')) {
        localStorage.removeItem('alana-gpt-api-key');
        GPT_CONFIG.apiKey = '';
        location.reload(); // Refresh to remove AI features
    }
}

// Initialize GPT features when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGPT);
} else {
    initializeGPT();
}

console.log('🤖 GPT integration loaded!');
