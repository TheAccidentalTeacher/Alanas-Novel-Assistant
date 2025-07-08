# Enhanced Novel Crafter - Installation Guide

This guide provides instructions for installing and deploying the Enhanced Novel Crafter critical fixes.

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Git (optional)

## Option 1: Standard Installation

1. **Clone or download the repository**

   ```bash
   git clone https://github.com/ninjatech/enhanced-novel-crafter.git
   # or unzip the provided zip file
   ```

2. **Navigate to the project directory**

   ```bash
   cd enhanced-novel-crafter
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run tests to verify fixes**

   ```bash
   npm test
   ```

5. **Start the server**

   ```bash
   node server.js
   ```

6. **Access the application**

   Open your browser and navigate to `http://localhost:3000`

## Option 2: Using the Deployment Script

1. **Make the deployment script executable**

   ```bash
   chmod +x deploy.sh
   ```

2. **Run the deployment script**

   ```bash
   ./deploy.sh
   ```

3. **Navigate to the deployment directory**

   ```bash
   cd enhanced-novel-crafter-deploy
   ```

4. **Start the server**

   ```bash
   node server.js
   ```

5. **Access the application**

   Open your browser and navigate to `http://localhost:3000`

## Option 3: Docker Installation

### Using Docker Compose (Recommended)

1. **Install Docker and Docker Compose**

   Follow the official installation guides:
   - [Docker](https://docs.docker.com/get-docker/)
   - [Docker Compose](https://docs.docker.com/compose/install/)

2. **Start the application**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**

   Open your browser and navigate to `http://localhost:3000`

### Using Docker without Compose

1. **Build the Docker image**

   ```bash
   docker build -t enhanced-novel-crafter .
   ```

2. **Run the Docker container**

   ```bash
   docker run -p 3000:3000 -d enhanced-novel-crafter
   ```

3. **Access the application**

   Open your browser and navigate to `http://localhost:3000`

## Integration with Existing Enhanced Novel Crafter Installation

To integrate these fixes with an existing installation:

1. **Backup your existing installation**

   ```bash
   cp -r /path/to/existing/installation /path/to/backup
   ```

2. **Copy the fixed service files**

   ```bash
   cp -r backend/services/* /path/to/existing/installation/backend/services/
   cp -r backend/utils/* /path/to/existing/installation/backend/utils/
   ```

3. **Update dependencies**

   ```bash
   cd /path/to/existing/installation
   npm install docx@7.8.2
   ```

4. **Restart your application**

   Follow your existing application's restart procedure.

## Troubleshooting

### Common Issues

1. **Port 3000 is already in use**

   Change the port in `server.js` and update any references to port 3000.

2. **Missing dependencies**

   If you encounter errors about missing dependencies, run:
   ```bash
   npm install
   ```

3. **Word export not working**

   Ensure the `docx` package is installed:
   ```bash
   npm install docx@7.8.2
   ```

4. **Tests failing**

   If tests are failing, check the error messages for specific issues. Most common issues are related to missing dependencies or environment configuration.

### Getting Help

If you encounter any issues not covered in this guide, please contact NinjaTech AI support at support@ninjatech.ai or open an issue on the GitHub repository.