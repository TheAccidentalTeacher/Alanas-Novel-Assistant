#!/bin/bash

# Alana's Novel Assistant - Vercel CLI Deployment Script
# This script will deploy your app to Vercel using the CLI

echo "🚀 Deploying Alana's Novel Assistant to Vercel..."

# Check if user is logged in to Vercel
if ! vercel whoami >/dev/null 2>&1; then
    echo "📋 You need to log in to Vercel first"
    echo "Run: vercel login"
    echo "Then run this script again"
    exit 1
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should now be live at the URL shown above"
