# Guidelines for Agentic AI Collaboration

This document provides instructions for AI agents working on the forbidden-psalm-squad-builder project.

## Project Overview

- **Purpose**: Squad builder for Forbidden Psalm tabletop games
- **Tech Stack**: TypeScript, React, Vite, CSS
- **Deployment**: GitHub Pages at https://an-anagram-of-my-name.github.io/forbidden-psalm-squad-builder/
- **Repository**: https://github.com/an-anagram-of-my-name/forbidden-psalm-squad-builder

## Original MVP spec
- Create Squads of 5 Characters
- Customise the Characters according to setup rules
- - Character stats
  - Character feats and flaws
  - Character equipment
- Prepare Character Templates (also called Presets) that can be included into a Squad
- The final app version will be used for multiple similar games, but MVP is for a game named "28 Psalms"

## Data Persistence
Code uses localStorage with key 'forbidden-psalm-state'

## Project Structure
project/ 
├── src/ 
│ ├── App.tsx # Main React component 
│ ├── main.tsx # Entry point (NOT index.tsx) 
│ ├── App.css 
│ ├── index.css 
│ ├── components/ # Reusable UI components 
│ ├── types/ # TypeScript type definitions 
│ └── utils/ # Utility functions 
├── public/ # Static assets 
├── index.html # Main HTML file (at root only) 
├── vite.config.ts # Vite configuration 
├── package.json 
├── tsconfig.json 
└── .github/workflows/ # GitHub Actions

**Important**: Do NOT place application code files (App.tsx, main.tsx, etc.) at the root. All source code must be in `src/`.

## Key Configuration Details

- **Base Path**: `base: '/forbidden-psalm-squad-builder/'` in `vite.config.ts`
- **Entry Point**: `src/main.tsx` (referenced in `index.html` as `<script type="module" src="/src/main.tsx"></script>`)
- **HTML Entry**: `index.html` must be at the root with proper script tag
- **Build Output**: Deploys to `gh-pages` branch via GitHub Actions

## Before Making Changes

1. **Always verify current state** before making assertions
   - Check file locations and contents using available tools
   - Don't assume structure based on earlier conversations
   
2. **Use official documentation** as the source of truth
   - Cite Vite docs for configuration questions
   - Reference React/TypeScript best practices when uncertain

3. **Provide sources** when recommending changes
   - Include links to official docs or GitHub references
   - Be transparent about where guidance comes from

## Common Issues & Solutions

### Blank Page After Deployment
- Check that `index.html` has the script tag: `<script type="module" src="/src/main.tsx"></script>`
- Verify `vite.config.ts` has correct `base` path
- Ensure `src/main.tsx` exists as the entry point
- Check GitHub Pages is configured to deploy from `gh-pages` branch (Settings → Pages)

### Module Load Errors
- Don't use absolute paths starting with `/src` in index.html - Vite handles path rewriting
- Ensure no duplicate files exist at root and in `src/` simultaneously
- Check that all imports in components use correct relative paths

### GitHub Pages Not Updating
- Verify deployment workflow in `.github/workflows/deploy.yml`
- Check that `gh-pages` branch exists and GitHub Pages is configured to use it
- Wait for Actions workflow to complete before accessing the site

## Workflow for Making Changes

1. Create a pull request with proposed changes
2. Describe what is being changed and why
3. Reference this file and official documentation for guidance
4. Test changes in the build process
5. Wait for approval before merging

## When Working with the User

- Ask clarifying questions if project structure is ambiguous
- Verify file locations before suggesting changes
- Always check sources when recommending different approaches
- Provide references when contradicting previous advice
- If unsure, ask the user rather than making assertions

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production (creates dist/)
npm run deploy       # Build and deploy to gh-pages
npm test             # Run tests with vitest
npm run test:ui      # Run tests with UI
