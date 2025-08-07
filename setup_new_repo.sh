#!/bin/bash

# Script to set up your new Git repository
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details

echo "🚀 Setting up your new Git repository..."
echo ""

# Get user input
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name: " REPO_NAME

# Update the remote URL
echo "📝 Updating remote URL..."
git remote set-url origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Verify the remote
echo "✅ Verifying remote configuration..."
git remote -v

# Push to the new repository
echo "🚀 Pushing to your new repository..."
git push -u origin main

echo ""
echo "🎉 Success! Your repository has been set up."
echo "📱 Your mobile app is now available at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📋 Next steps:"
echo "1. Clone this repository to your local machine"
echo "2. Install dependencies: npm install"
echo "3. Start the development server: npm start"
echo ""
echo "🔧 The app includes:"
echo "- React Native with Expo"
echo "- Navigation fixes for calendar functionality"
echo "- Complete mobile app for Gateway College Prep"
echo "- Error handling and loading states" 