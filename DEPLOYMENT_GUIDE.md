# Alana's Novel Assistant - Vercel Deployment Guide

## Quick Manual Deployment Steps

### 1. Create GitHub Repository (if not already done)
1. Go to [GitHub](https://github.com) and create a new repository
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Novel Assistant ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Node.js project
5. **Important**: Set these configuration options:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave empty/default)
   - **Build Command**: Leave empty (we don't need a build step)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 3. Environment Variables (if needed)
Currently, your app doesn't require any environment variables, but if you add any later:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add any required variables

### 4. Custom Domain (Optional)
1. In your Vercel project settings, go to "Domains"
2. Add your custom domain if you have one

## Project Structure (Vercel-Optimized)

Your project is now structured for Vercel:

```
/
├── api/                          # Vercel API routes (serverless functions)
│   ├── process-text.js          # Text processing endpoint
│   ├── grammar-check.js         # Grammar checking endpoint
│   └── export-word.js           # Word export endpoint
├── frontend/src/                # Frontend files (served statically)
│   ├── index.html              # Main HTML file
│   ├── styles.css              # Styles
│   └── app.js                  # Frontend JavaScript
├── utils/                      # Shared utilities for API routes
│   ├── text-processing-service.js
│   ├── grammar-detection-service.js
│   ├── formatting-preservation-service.js
│   ├── document-export-service.js
│   ├── content-control-service.js
│   └── logger.js
├── vercel.json                 # Vercel configuration
├── package.json               # Dependencies and scripts
└── .gitignore                 # Git ignore file
```

## How It Works

1. **Frontend**: Served statically from `/frontend/src/`
2. **API**: Serverless functions in `/api/` folder
3. **Routing**: Configured in `vercel.json` to handle both static files and API routes
4. **Dependencies**: Only `docx` package needed for Word document generation

## Testing Your Deployment

After deployment, your app will be available at `https://your-project-name.vercel.app`

Test these endpoints:
- Main app: `https://your-project-name.vercel.app`
- Text processing: `https://your-project-name.vercel.app/api/process-text`
- Grammar check: `https://your-project-name.vercel.app/api/grammar-check`
- Word export: `https://your-project-name.vercel.app/api/export-word`

## Troubleshooting

### If deployment fails:
1. Check the build logs in Vercel dashboard
2. Ensure all file paths are correct
3. Verify `package.json` dependencies are properly installed

### If API routes don't work:
1. Check that files are in `/api/` folder
2. Verify each API file exports a default function
3. Check Vercel function logs in the dashboard

### If frontend doesn't load:
1. Ensure files are in `/frontend/src/` folder
2. Check that `vercel.json` routing is correct
3. Verify static file paths

## Next Steps After Deployment

1. Test all features thoroughly
2. Set up custom domain if desired
3. Monitor usage and performance in Vercel dashboard
4. Set up branch deployments for development
