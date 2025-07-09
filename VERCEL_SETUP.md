# 🚀 Vercel Environment Variables Setup

## Required Environment Variables

To enable AI and image features, add these environment variables in your Vercel dashboard:

### 1. OpenAI Integration
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Pexels Image Search
```
PEXELS_API_KEY=your_pexels_api_key_here
```

### 3. Pixabay Image Search
```
PIXABAY_API_KEY=your_pixabay_api_key_here
```

## How to Add in Vercel Dashboard

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add each variable:**
   - Name: `OPENAI_API_KEY`
   - Value: `[Use the OpenAI API key provided separately]`
   - Environment: Production, Preview, Development (select all)

4. **Repeat for all three API keys**

5. **Redeploy your application** after adding variables

## Features Enabled by API Keys

### 🤖 OpenAI Features
- **AI Grammar Check**: Professional editing suggestions
- **AI Style Analysis**: Writing improvement recommendations  
- **Creative Writing Help**: Story development assistance
- **Character Development**: Personality and dialogue suggestions
- **Plot Development**: Structure and pacing advice

### 🖼️ Image Search Features
- **Character Inspiration**: Find images for character visualization
- **Book Cover Ideas**: Search cover design inspiration
- **High-Quality Images**: Professional photography from Pexels/Pixabay
- **Free Resources**: OpenClipart integration (no API key needed)

## Fallback Behavior

If API keys are not configured:
- ✅ **Basic tools still work** (grammar analysis, character tracking, etc.)
- ⚠️ **AI features show fallback messages**
- ⚠️ **Image search will be unavailable**
- 🔄 **All local features remain fully functional**

## Security Notes

- 🔒 **API keys are server-side only** - never exposed to browser
- 🔒 **Environment variables are encrypted** in Vercel
- 🔒 **No API keys in source code** - only in environment
- 🔒 **Graceful degradation** when keys unavailable

## Testing the Setup

After deploying with environment variables:

1. **Test AI Grammar Check** - Should show detailed AI analysis
2. **Test Image Search** - Should display image results
3. **Check Console** - No API key errors should appear
4. **Verify Fallbacks** - Basic tools work without AI

The workspace will work perfectly with or without API keys - they just unlock premium AI and image features!
