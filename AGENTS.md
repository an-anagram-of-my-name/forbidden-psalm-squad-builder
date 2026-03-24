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

## Component Architecture & User Flow

### Application Entry Point
**App.tsx** → Main orchestrator managing app state (squads, presets, currentSquadId)
- Manages localStorage persistence
- Delegates UI rendering to SquadBuilder

### Squad Management & Display
**SquadBuilder** → Main container component
- Displays squad selection/creation UI
- Renders CharacterGrid when a squad is active
- Passes squad data to child components

**CharacterGrid** → Lists all characters in the current squad
- Displays each character via CharacterSummary cards
- Handles character selection and navigation to detail view

**CharacterSummary** → Quick character overview card
- Shows: Name, tech level, stats (with flaw/feat modifiers applied), flaw/feat types, equipment count, slot usage
- Used in squad overview for at-a-glance character info
- **Important**: Must use `applyFlawFeatModifiers()` for stat display

### Character Creation Flow
**CharacterCreationFlow** → Four-step wizard guiding character creation

1. **Step 1: Stats Selection**
   - Component: `StatDistributionPicker`
   - User selects point distribution and assigns to stats
   - Stores base stats (no modifiers yet)

2. **Step 2: Flaws & Feats Selection**
   - Component: `FlawsAndFeatsPicker`
   - User selects one flaw and one feat
   - Displays **effective stats** (base + flaw/feat modifiers) in real-time preview
   - Preview updates as user selects/changes flaw/feat

3. **Step 3: Equipment Selection**
   - Component: `EquipmentPicker`
   - User selects weapons, armor, items, ammo
   - Displays **effective stats** accounting for flaw/feat modifiers
   - Slot capacity calculated using effective strength
   - Armor strength requirements checked against effective strength

4. **Step 4: Review & Finalization**
   - CharacterCreationFlow renders review card
   - Shows **effective stats** (base + flaw/feat modifiers)
   - User enters character name and creates character

### Data Flow for Stat Modifiers
```
Base Stats (from Step 1)
    ↓
+ Flaw Modifiers (from Step 2)
+ Feat Modifiers (from Step 2)
    ↓
= Effective Stats (displayed in Steps 2, 3, 4 and CharacterSummary)
```

**Utility Function**: `applyFlawFeatModifiers(baseStats, flaw, feat)` in `utils/stats.ts`
- Looks up flaw/feat data to find statModifiers
- Applies modifiers to base stats
- Used by: FlawsAndFeatsPicker, EquipmentPicker, CharacterCreationFlow Review, CharacterSummary

### Component Dependency Notes
- **FlawsAndFeatsPicker** receives: `stats` (base stats from Step 1)
- **EquipmentPicker** receives: `character` object with stats, flaw, feat
- **CharacterSummary** receives: `character` object with full data
- All components that display stats should use effective stats, not base stats

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
```

## Feature: Squad Management - Multiple Saved Squads

### Overview
Users should be able to save multiple squads and switch between them. Currently, the app supports only one squad being worked on at a time.

### User Stories

**Story 1: List and Switch Squads**
- A dropdown menu displays all saved squads with:
  - Squad name
  - Technology level
  - Date saved
- User can select any squad from the dropdown to load it
- The dropdown is accessible from any page in the app

**Story 2: Create New Squad**
- "New Squad" appears as the first item in the dropdown
- Clicking "New Squad" creates a fresh squad with default state
- Clears the current squad name and squad builder

**Story 3: Auto-Save on Switch**
- When user attempts to switch to a different squad, the app checks if current squad has unsaved changes
- If unsaved, current squad is automatically saved before loading the new one
- User receives visual feedback of the auto-save action

**Story 4: Prevent Duplicate Squad Names**
- Users cannot save a squad with a name that already exists
- When attempting to save with duplicate name:
  - Save button is disabled (visual indication)
  - Error message displays: "Squad name already exists"
  - Input field shows error state (e.g., red border, error text)
- Check for duplicates happens as user types in the squad name input

### Technical Implementation

**Data Structure**
```typescript
// src/types/index.ts (add/update)
interface Squad {
  id: string;              // UUID or timestamp-based unique identifier
  name: string;            // User-provided squad name
  techLevel: number;       // Selected technology level
  members: SquadMember[];  // Array of squad members
  dateSaved: string;       // ISO 8601 date string (e.g., "2026-03-24T10:30:00Z")
}

interface AppState {
  squads: Squad[];         // Array of all saved squads
  currentSquadId: string | null;  // ID of currently loaded squad
}
```

**localStorage Key**
- `'forbidden-psalm-state'` - stores the entire AppState with all squads

**UI Components**
- **Squad Dropdown**: 
  - Accessible from all pages
  - Shows "New Squad" as first option
  - Follows format: "Squad Name (Tech Level X) - 24/03/2026"
  - Location: Consider top navigation or header area

- **Squad Name Input**:
  - Existing element: `<input id="squad-name" type="text" class="squad-name-input">`
  - Add visual error state styling for duplicate names
  - Add error message element below input

- **Save Squad Button**:
  - Existing element: `<button class="btn-save">Save Squad</button>`
  - Disable when squad name is empty or duplicated
  - Add success feedback when save completes

**Implementation Steps**
1. Update `AppState` type to support multiple squads
2. Create helper functions:
   - `isSquadNameDuplicate(name: string, excludeId?: string): boolean`
   - `saveSquad(squad: Squad): void`
   - `loadSquad(squadId: string): void`
   - `createNewSquad(): Squad`
3. Add Squad Dropdown component
4. Update Squad Name input validation and styling
5. Update Save Squad button logic to:
   - Validate squad name (not empty, not duplicate)
   - Generate squad ID and dateSaved
   - Add/update squad in squads array
   - Persist to localStorage
6. Update App.tsx to handle squad switching with auto-save
7. Migrate existing squad data on first load (if any)

**Error States**
- Duplicate squad name: Show error message, disable save button, highlight input in red
- Empty squad name: Disable save button
- Successful save: Show confirmation message or toast

**Edge Cases**
- User has unsaved changes in current squad, clicks "New Squad" → auto-save current squad first
- User renames squad to a name that already exists → error state triggered
- User deletes all content from squad name input → clear error state, disable save
- localStorage quota exceeded → show error message to user

### Notes
- Deletion of squads is currently out of scope
- Duplicate squad names should be strictly prevented
- All squads persist via localStorage


## Feature: Multiple Ammo & Consumables per Character

### Overview
Currently, characters can select equipment once. However, in Forbidden Psalm, Ammo and Consumables should be stackable - a character can carry multiple instances of the same ammo type or consumable item. To keep interaction patterns consistent, Ammo and Consumables are managed together on a unified tab.

### Behavior Requirements

**Ammo & Consumables**: Stackable (multiple instances allowed)
- User can click the ammo/consumable card to add another instance (+1)
- Each click adds one more instance to equipment list
- Cost is cumulative (e.g., 2x Bandage = 2 credits)
- Slots are cumulative (e.g., 2x Bandage = 2 slots)
- Cannot add more instances if insufficient slots remaining
- Click the (X) delete icon in lower right corner to remove all instances of that item

**Weapons, Armor, Items**: Remain single-selection (toggle on/off)
- Can only equip one weapon type at a time
- Can only equip one armor piece at a time
- Can only have one instance of each item type

### UI Implementation: EquipmentPicker Card Design

**For Ammo/Consumables:**
```
┌──────────────────────────────┐
│ Bandage           [x2]       │
│ Cost: 1 cr  Slots: 1         │
│ Cures Bleeding               │
│                           ✗  │
│                          (X) │
└──────────────────────────────┘
```
- Instance count displayed in brackets next to name: `[x2]`
- (X) delete icon in lower right corner
- Card is clickable to add instances
- Clicking (X) removes all instances at once

**For Weapons, Armor, Items:**
- No delete icon
- No instance count
- Card toggles on/off with click (existing behavior)

### Tab Structure Changes

**Current tabs:** Weapons, Armor, Items, Ammo

**New tabs:** Weapons, Armor, Items, Ammo/Consumables

**Move to Ammo/Consumables tab:**
- All ammo items from `ammo28Psalms` (already in ammo tab)
- All consumable items from weapons arrays (Molotov, Black Powder Bomb, Grenade, Future Molotov)
  - Currently stored as Weapon type but should render with ammo/consumable interaction
  - Remove from weapons tab rendering
  - Add to ammo/consumables tab rendering

### Implementation Details

**EquipmentPicker.tsx Changes:**

1. **Tab name update:**
   - Change `'ammo'` tab label to `'Ammo/Consumables'`

2. **Consumables data handling:**
   - Create helper function to extract consumable items from weapon arrays
   - Render consumables alongside ammo in the ammo/consumables section
   - Example:
     ```typescript
     const consumables28Psalms = [
       ...pastTechWeapons28Psalms,
       ...futureTechWeapons28Psalms
     ].filter(w => ['molotov', 'black-powder-bomb', 'grenade', 'future-molotov'].includes(w.id));
     ```

3. **Card rendering logic:**
   - For ammo/consumable cards:
     - Count instances: `selectedEquipment.filter(eq => eq.id === equipment.id).length`
     - Render instance count in header: `{equipment.name} [x{count}]`
     - Add delete (X) button in lower right with onClick handler
   - For weapons/armor/items cards:
     - Keep existing render logic (no count, no delete button)

4. **Click handlers:**
   - `handleEquipmentToggle()`: 
     - For ammo/consumables: Always add a new instance (don't check `isSelected`)
     - For weapons/armor/items: Keep current toggle behavior
   - New `handleRemoveAll()`:
     - Remove all instances of a specific equipment by id
     - `setSelectedEquipment(selectedEquipment.filter(eq => eq.id !== equipment.id))`

5. **Slot validation:**
   - Existing slot capacity check already works for multiples
   - Disable add if `remainingSlots < equipment.slots`
   - Show disabled state on card

### User Workflow in Equipment Picker

1. User navigates to Ammo/Consumables tab
2. Clicks "Bow Ammo" card → adds one instance, displays as `Bow Ammo [x1]`
3. Clicks "Bow Ammo" card again → adds another instance, displays as `Bow Ammo [x2]`
4. Clicks (X) delete icon on "Bow Ammo" → removes all instances, reverts to no selection
5. If insufficient slots remain, "Bow Ammo" card becomes disabled (cannot click to add)
6. Confirms equipment selection → all ammo/consumable instances persist to character

### Edge Cases

- User adds 3x Bandage (3 slots), realizes they need a weapon, clicks (X) to remove all bandages
- User has 1 slot remaining, tries to add another Bandage (1 slot) → succeeds, now 0 slots
- User tries to add Bandage with 0 slots remaining → card is disabled, click has no effect
- User goes back from equipment step → selected ammo/consumables persist in EquipmentPicker state
- CharacterSummary displays all ammo/consumable instances in equipment list (e.g., "Bandage", "Bandage", "Bandage")

### No Data Structure Changes Needed

- Ammo and Consumable types already support multiple entries in Character.equipment array
- Each instance is stored as a separate equipment object with same id
- Cost and slot calculations work correctly with duplicates



