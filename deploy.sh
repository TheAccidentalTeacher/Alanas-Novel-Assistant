#!/bin/bash

# Enhanced Novel Crafter - Deployment Script
# This script deploys the critical fixes to a production environment

echo "=== Enhanced Novel Crafter - Critical Fixes Deployment ==="
echo "Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js before proceeding."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm before proceeding."
    exit 1
fi

# Create deployment directory
DEPLOY_DIR="enhanced-novel-crafter-deploy"
echo "Creating deployment directory: $DEPLOY_DIR"
mkdir -p $DEPLOY_DIR

# Copy files to deployment directory
echo "Copying files to deployment directory..."
cp -r backend $DEPLOY_DIR/
cp -r frontend $DEPLOY_DIR/
cp -r tests $DEPLOY_DIR/
cp server.js $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp README.md $DEPLOY_DIR/

# Install dependencies
echo "Installing dependencies..."
cd $DEPLOY_DIR
npm install

# Run tests to verify fixes
echo "Running tests to verify fixes..."
npm test

# Check if tests passed
if [ $? -ne 0 ]; then
    echo "Error: Tests failed. Please fix the issues before deploying."
    exit 1
fi

# Create a zip file for distribution
echo "Creating distribution package..."
cd ..
zip -r enhanced-novel-crafter-fixes.zip $DEPLOY_DIR

echo "=== Deployment Complete ==="
echo "The fixes have been deployed to: $DEPLOY_DIR"
echo "A distribution package has been created: enhanced-novel-crafter-fixes.zip"
echo ""
echo "To start the server, run:"
echo "  cd $DEPLOY_DIR"
echo "  node server.js"
echo ""
echo "Then open a browser and navigate to http://localhost:3000"