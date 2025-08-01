#!/bin/bash

# Deployment script for timezone meeting app
set -e

echo "🚀 Starting deployment..."

# Navigate to app directory
cd /home/deploy/apps/timezone-meeting-app

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Restart PM2 process
echo "🔄 Restarting application..."
pm2 restart timezone-meeting-app

echo "✅ Deployment completed successfully!"
echo "🌐 Your app is running at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)" 