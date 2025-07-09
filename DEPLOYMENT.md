# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from this directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (for first deployment)
   - What's your project's name? **enhanced-novel-crafter** (or your preferred name)
   - In which directory is your code located? **./**

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect the configuration

### Option 3: Deploy via Vercel Dashboard

1. **Create a ZIP file** of this project
2. **Visit [vercel.com](https://vercel.com)**
3. **Drag and drop** the ZIP file to deploy

## Environment Variables

No environment variables are required for basic functionality.

## Project Structure for Vercel

```
/
├── api/                          # Vercel serverless functions
│   ├── process-text.js          # Main text processing endpoint
│   ├── export-word.js           # Word document export endpoint
│   └── grammar-check.js         # Grammar checking endpoint
├── frontend/src/                # Static frontend files
│   ├── index.html              # Main HTML file
│   ├── app.js                  # Frontend JavaScript
│   └── styles.css              # CSS styles
├── utils/                      # Shared utilities for API routes
│   ├── grammar-detection-service.js
│   ├── formatting-preservation-service.js
│   ├── document-export-service.js
│   └── content-control-service.js
├── vercel.json                 # Vercel configuration
└── package.json               # Dependencies and scripts
```

## API Endpoints

Once deployed, your application will have these endpoints:

- `POST /api/process-text` - Process text with grammar checking and formatting preservation
- `POST /api/export-word` - Export text to Word document
- `POST /api/grammar-check` - Check grammar only

## Testing Locally

To test the Vercel deployment locally:

```bash
npm install
vercel dev
```

This will start a local Vercel development server at `http://localhost:3000`.

## Features

- ✅ Grammar detection and correction
- ✅ Formatting preservation
- ✅ Word document export
- ✅ Content control (no unwanted character generation)
- ✅ Serverless architecture optimized for Vercel
- ✅ Static frontend with API integration

## Live Demo

After deployment, your application will be available at:
`https://your-project-name.vercel.app`

## Support

If you encounter any issues during deployment, check:

1. **Vercel Logs**: Visit your project dashboard on Vercel to see deployment logs
2. **Function Logs**: Check the Functions tab for any runtime errors
3. **Build Logs**: Review the build process for any compilation errors

## Custom Domain

To add a custom domain:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Domains
3. Add your domain and follow the DNS configuration instructions
