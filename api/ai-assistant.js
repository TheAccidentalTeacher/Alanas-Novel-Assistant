// AI Writing Assistant API for Alana's Writing Workspace
// Provides OpenAI-powered writing help, grammar checking, and creative assistance

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, action, context } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(action)
          },
          {
            role: 'user',
            content: formatUserPrompt(action, text, context)
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return res.status(200).json({
      success: true,
      response: aiResponse,
      action: action
    });

  } catch (error) {
    console.error('AI Assistant Error:', error);
    return res.status(500).json({
      error: 'AI service temporarily unavailable',
      fallback: getFallbackResponse(action, text)
    });
  }
}

function getSystemPrompt(action) {
  const prompts = {
    'grammar': 'You are a professional editor helping novelist Alana Terry. Provide detailed grammar, spelling, and style corrections. Focus on clarity, flow, and professional writing standards. Be encouraging but thorough.',
    
    'style': 'You are a writing coach specializing in fiction. Analyze the writing style and provide specific suggestions for improvement. Focus on sentence variety, word choice, pacing, and narrative voice.',
    
    'plot': 'You are a story development expert helping with plot structure. Provide constructive feedback on plot development, character arcs, pacing, and story logic. Consider this is likely part of the Kennedy Stern series.',
    
    'character': 'You are a character development specialist. Help develop realistic, compelling characters with depth, motivation, and authentic dialogue. Consider consistency with existing characters if this is part of a series.',
    
    'creative': 'You are a creative writing assistant. Help brainstorm ideas, overcome writer\'s block, and develop scenes. Be inspiring and supportive while maintaining focus on quality storytelling.',
    
    'research': 'You are a research assistant for fiction writers. Provide accurate, helpful information for story details while considering creative liberty. Focus on authenticity that serves the story.'
  };
  
  return prompts[action] || prompts['creative'];
}

function formatUserPrompt(action, text, context) {
  switch (action) {
    case 'grammar':
      return `Please review this text for grammar, spelling, and style:\n\n"${text}"\n\nProvide specific corrections and suggestions for improvement.`;
      
    case 'style':
      return `Please analyze the writing style of this text:\n\n"${text}"\n\nProvide feedback on sentence structure, word choice, flow, and suggestions for enhancement.`;
      
    case 'plot':
      return `Please review this plot outline or story segment:\n\n"${text}"\n\nContext: ${context || 'Part of Kennedy Stern series'}\n\nProvide feedback on plot development, pacing, and story structure.`;
      
    case 'character':
      return `Please help develop this character or review character development:\n\n"${text}"\n\nContext: ${context || 'Character for Kennedy Stern series'}\n\nProvide suggestions for character depth, motivation, and authenticity.`;
      
    case 'creative':
      return `I need creative writing help with:\n\n"${text}"\n\nContext: ${context || 'Working on Kennedy Stern series'}\n\nPlease provide creative suggestions, ideas, or help with writer's block.`;
      
    case 'research':
      return `I need research help for my story:\n\n"${text}"\n\nContext: ${context || 'Research for Kennedy Stern series'}\n\nProvide accurate, story-relevant information.`;
      
    default:
      return `Please help me with this writing:\n\n"${text}"\n\nProvide constructive feedback and suggestions.`;
  }
}

function getFallbackResponse(action, text) {
  const fallbacks = {
    'grammar': 'AI grammar check is temporarily unavailable. Try the built-in grammar analysis tool for basic feedback.',
    'style': 'AI style analysis is temporarily unavailable. Use the style analysis tool for basic metrics.',
    'plot': 'AI plot assistance is temporarily unavailable. Try organizing your ideas in the plot outliner tool.',
    'character': 'AI character development is temporarily unavailable. Use the character tracker to organize character details.',
    'creative': 'AI creative assistance is temporarily unavailable. Try taking a break and returning to your writing with fresh eyes.',
    'research': 'AI research help is temporarily unavailable. Consider using traditional research methods or the research notes tool.'
  };
  
  return fallbacks[action] || 'AI assistance is temporarily unavailable. Please try again later.';
}
