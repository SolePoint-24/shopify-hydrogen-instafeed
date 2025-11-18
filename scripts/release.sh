#!/bin/bash

# Ensure the script exits on first error
set -e

# === CONFIG ===
VERSION_TYPE=$1 # patch | minor | major
TAG_PREFIX="v"

if [[ -z "$VERSION_TYPE" ]]; then
  echo "❌ Usage: ./release.sh [patch|minor|major]"
  exit 1
fi

# Step 1: Bump version
echo "📦 Bumping $VERSION_TYPE version..."
npm version "$VERSION_TYPE"

# Step 2: Get new version
VERSION=$(node -p "require('./package.json').version")
GIT_TAG="${TAG_PREFIX}${VERSION}"

# Step 3: Commit & tag
echo "🏷️ Creating git tag $GIT_TAG..."
git add package.json package-lock.json

# Step 4: Push tag and commit
echo "🚀 Pushing commit and tag to origin..."
git push origin main --tags

# Step 5: Publish to NPM
echo "📤 Publishing to NPM..."
npm run build
npm publish --access public

echo "✅ Published version $VERSION to NPM and pushed tag $GIT_TAG."
