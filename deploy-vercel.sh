#!/usr/bin/env bash
# Deploy frontend to Vercel. Run once: npx vercel login
set -e
cd "$(dirname "$0")/frontend"
echo "Deploying to Vercel from ./frontend..."
npx vercel --yes --prod
