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
- There should be a maximum of five characters in a squad - this is enforced by the app
- **Rule**: Both "+ Add Character" and "Add First Character" buttons must be `disabled` when `squad.characters.length >= 5`, with a tooltip: "Squad has reached the maximum of 5 characters"

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

## Screenshot Testing with Playwright

Agents have access to a Playwright browser tool for taking screenshots and verifying UI changes. The following patterns and pitfalls have been learned from using it in this project.

### Starting the Dev Server

Before taking screenshots, start the Vite dev server in the background:

```bash
npm run dev -- --port 5173 --host 0.0.0.0 &
```

Then navigate to the app:

```
http://localhost:5173/forbidden-psalm-squad-builder/
```

### Screenshots Output Location

Screenshots taken with the `browser_take_screenshot` tool are saved to:

```
/tmp/playwright-logs/<filename>.png
```

Example call:
```
browser_take_screenshot(filename="my-screenshot.png")
```

### How App State Works (Important)

The app uses **React state** as its source of truth and **writes to** `localStorage` on every state change:

```
React State (in memory)  →  saves to  →  localStorage['forbidden-psalm-state']
                         ←  loads from ←  on page mount
```

**Consequence**: If you write directly to `localStorage` via `browser_evaluate` and then reload the page, the React app will load your injected state on mount. However, if you write to `localStorage` while the app is already running (without reloading), the React state in memory will **not** reflect the new `localStorage` contents—it will still hold the old state, and it will overwrite `localStorage` again on the next state change.

### The Correct Way to Set Up Test State

**Option A — Inject state then navigate (most reliable)**:
1. Write the desired state to `localStorage` via `browser_evaluate`
2. Navigate to the app URL (this causes a fresh page load, triggering the mount effect)

```js
// Step 1: Set localStorage
await page.evaluate(() => {
  localStorage.setItem('forbidden-psalm-state', JSON.stringify({ ... }));
});

// Step 2: Navigate to reload the app (this triggers the mount useEffect)
await page.goto('http://localhost:5173/forbidden-psalm-squad-builder/');
```

**Note**: Calling `window.location.reload()` inside `browser_evaluate` causes a navigation that immediately destroys the execution context, resulting in an error (`Execution context was destroyed`). This is expected — the reload still happens; just ignore the error and wait for the page to settle.

**Option B — Use the UI (most accurate)**:
Walk through the app's UI as a user would: select tech level, create characters step by step. This is slower but guarantees the app state is exactly what the UI would produce, with no risk of schema mismatches.

### localStorage State Schema

The full state stored at key `'forbidden-psalm-state'`:

```typescript
{
  presets: CharacterPreset[];   // character templates
  squads: Squad[];              // saved squads
  currentSquadId: string | null;
}
```

In TypeScript, a `Squad`'s `createdAt` and `updatedAt` fields are typed as `Date`, but when the state is serialized to JSON for localStorage (via `JSON.stringify`), those dates are stored as ISO 8601 strings. When constructing raw JSON for localStorage injection (as below), use ISO date strings for these fields. A minimal example:

```json
{
  "presets": [],
  "squads": [{
    "id": "test-1",
    "name": "Test Squad",
    "techLevel": "past-tech",
    "characters": [],
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z",
    "dateSaved": "2026-01-01T00:00:00Z"
  }],
  "currentSquadId": "test-1"
}
```

### Waiting for the App to Load

After navigation, always wait for a known element before interacting or taking screenshots:

```js
// Wait for the squad builder heading
await page.waitForSelector('h1');
// or use the Playwright tool:
browser_wait_for(text="Squad Builder")
```

### Accessing the Print View

The print view (`SquadPrintView`) is rendered as an overlay triggered by clicking the **🖨 Print Squad** button in `SquadBuilder`. To screenshot it:
1. Ensure the squad has at least one character
2. Click the Print Squad button (it only appears when there are characters)
3. The overlay renders inline on the same page — take the screenshot immediately

### Common Pitfalls

| Pitfall | What Happens | Fix |
|---------|-------------|-----|
| Setting `localStorage` while app is running (no reload) | App's React state overwrites `localStorage` on next change | Always reload after setting `localStorage` |
| Calling `window.location.reload()` inside `browser_evaluate` | "Execution context was destroyed" error | Ignore the error; use `browser_wait_for` to wait for reload |
| Navigating before `localStorage` is written | App loads with empty/default state | Write `localStorage` first, then navigate |
| Trying to inject state with wrong schema | App silently falls back to empty state | Match the persisted `localStorage` shape (including ISO date strings for Date fields) |
| Screenshots saved outside allowed output dir | Tool error | Always use a bare filename — files land in `/tmp/playwright-logs/` |

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



## Feature: Character Presets

### Overview
Character Presets allow users to create and manage individual character templates independent of squads. Each preset is a complete, standalone character with its own stats, flaws, feats, equipment, and tech level. Presets can be created from scratch or loaded and modified, providing a reusable library of character builds.

### Key Concepts
- **Presets** are standalone characters (CharacterPreset type) not associated with any squad
- **Presets are tech-agnostic** - each preset selects and stores its own tech level
- **Presets use full creation flow** - all 4 steps required with no steps skipped (Stats → Flaws/Feats → Equipment → Review)
- **No preset limit** - users can create unlimited character presets
- **No autosave** - presets are only saved on explicit user action (unlike squads which autosave)

### UI Components

#### App Nav Bar (Top Level - Modified)
- **Squad Dropdown**: List of all saved squads (existing functionality)
- **New Squad Button**: Opens squad tech level selector (existing functionality)
- **Preset Dropdown**: List of all saved presets, sorted by name
- **New Character Template Button**: Opens character creation flow for new preset

Both Squad and Preset controls are visible simultaneously in the nav bar.

#### Tech Level Selection in StatDistributionPicker (New)
- **Compact Tech Level Control**: Mini version of TechLevelSelector integrated into StatDistributionPicker
  - Size: Much smaller than the full TechLevelSelector used for squads
  - Placement: Above or alongside stat distribution buttons
  - User must select tech level before or alongside stat distribution
  - Selection persists through the entire character creation flow
  - Tech level affects available equipment in the Equipment step

### User Workflows

#### Creating a New Preset
1. User clicks "New Character Template" button in top nav
2. Taken to Stats step of CharacterCreationFlow in preset mode
3. Selects tech level (past-tech or future-tech) using compact picker
4. Selects stat distribution (+3,+1,0,-3 or +2,+2,-1,-2)
5. Continues through Flaws/Feats → Equipment → Review steps normally
6. On Review step: enters character name
7. Clicks "Create Preset" button
8. Preset is saved to `appState.presets` with:
   - Generated ID (timestamp-based)
   - Character name as preset name
   - Current timestamp (createdAt/updatedAt)

#### Editing an Existing Preset
1. User selects preset from Preset Dropdown in top nav
2. **Directly loads to Review step** with all preset data pre-filled
3. Can click "Back" to revisit and modify:
   - Tech level selection
   - Stat distribution
   - Flaws/Feats
   - Equipment
   - Character name
4. Can navigate forward/backward through all steps
5. On Review step: can change character name
6. Clicks "Update Preset" button
7. Preset is updated in `appState.presets` with new timestamp

#### Using a Preset in a Squad
- From Preset Dropdown, user can potentially copy a preset
- (Out of scope for this feature - potential future enhancement)

### Implementation Details

**CharacterCreationFlow Modifications:**
- Add `mode` prop: `'squad' | 'preset'` (default: 'squad')
- When `mode === 'preset'`:
  - `techLevel` prop becomes optional
  - Tech level is selectable via StatDistributionPicker picker
  - Final button text: "Create Preset" (new) or "Update Preset" (editing)
  - Initial step can optionally start at Review for editing presets
  - URL or state parameter determines if loading for edit
- When `mode === 'squad'`:
  - `techLevel` prop is required (existing behavior)
  - Final button text: "Create Character" (existing)

**StatDistributionPicker Modifications:**
- Add optional `mode` prop: `'squad' | 'preset'` (default: 'squad')
- Add optional `selectedTechLevel` prop for preset editing
- Add optional `onTechLevelSelected` callback
- When `mode === 'preset'`:
  - Render compact tech level picker (mini buttons or radio buttons, not full TechLevelSelector)
  - Display tech level selector before or alongside distribution buttons
  - Both tech level and stat distribution must be selected to proceed

**App.tsx Changes:**
- Import PresetFlow component
- Add state management:
  - `currentPresetId: string | null` to track editing preset
  - `presetMode: 'new' | 'edit'` to distinguish new vs. editing
- Add handlers:
  - `handleNewPreset()` - open new preset creation flow
  - `handleLoadPreset(presetId: string)` - load preset for editing
  - `handleSavePreset(preset: CharacterPreset)` - save new or updated preset to appState.presets
  - `handleCancelPreset()` - close preset flow
- Render PresetFlow component when in preset mode
- Pass presets list to PresetDropdown

**New Components:**
- `PresetDropdown.tsx` - Similar to SquadDropdown
  - List all presets from `appState.presets`
  - "New Character Template" button to create new preset
  - Click preset to load for editing
- `PresetFlow.tsx` - Container component
  - Manages preset mode (new vs. edit)
  - Renders CharacterCreationFlow with `mode='preset'`
  - Handles save/cancel actions
  - For edit mode: pre-populates CharacterCreationFlow state with preset data
  - Starts at Review step for editing presets

### Data Flow
- Presets stored in `AppState.presets` (localStorage persisted)
- Each preset: `id`, `name`, `stats`, `flaw`, `feat`, `equipment`, `techLevel`, `createdAt`, `updatedAt`
- Presets never added to squads (remain separate)
- Presets can be duplicated or used as templates for squad characters (future feature)

### Edge Cases
- **Creating new preset**: All 4 steps required, tech level must be selected
- **Editing preset**: Direct access to Review step, but can modify any field by backing up
- **Tech level independence**: Each preset has its own tech level, independent of any squad
- **Duplicate names**: Presets can have same names as squads or other presets (separate namespaces)
- **Delete preset**: Show confirmation, permanently removes from `appState.presets`
- **No autosave**: User must explicitly save changes (modal or confirmation on discard)

### Differences from Squad Characters
| Aspect | Squad Character | Preset |
|--------|-----------------|--------|
| Tech Level | Inherited from squad | Self-selected |
| Autosave | Yes, on changes | No, manual save only |
| Creation Flow | Full 4 steps | Full 4 steps |
| Starting Step | Stats | Stats (new) or Review (editing) |
| Storage | In squad.characters | In appState.presets |
| Editing Entry | Via squad → character | Direct from Preset Dropdown |



## Feature: Edit Squad Characters

### Overview
Characters in a squad can now be edited inline. Users can click an "Edit" button on any character card to open the character creation flow at the Review step, make changes to any aspect of the character (stats, flaws, feats, equipment, name), and save the updated character back to the squad. This mirrors the existing preset editing workflow but applies to squad members.

### Key Concepts
- **Edit Mode**: Character editing starts at the Review step with all character data pre-populated
- **Tech Level is Locked**: The character's tech level cannot be changed (it's fixed to the squad's tech level)
- **One at a Time**: Only one character can be edited at a time; editing a second character cancels the first
- **Unsaved Changes Tracking**: Edits to a character mark the squad as unsaved (triggers autosave on navigation away)
- **State Preservation**: All character data persists through the edit flow, allowing users to navigate back through steps to modify any field

### UI Components

#### CharacterSummary Changes (Modified)
- **Display**: Unchanged - still shows stats, traits, equipment summary
- **Controls Below Summary**: Two buttons side-by-side:
  - **Edit Button** (primary action): Opens character editor at Review step
  - **Remove Button** (secondary action): Deletes character from squad

#### SquadBuilder Character Grid (Modified)
- **Character Cards Layout**: Each character displayed in grid with summary card + buttons
- **Buttons Container**: `.character-actions` div below card contains Edit and Remove buttons
- **Conditional Rendering**: 
  - When no character is being edited: show all character cards with Edit/Remove buttons
  - When one character is being edited: hide character grid, show CharacterCreationFlow overlay
  - Character being edited is no longer visible in the grid (replaced by editor)

#### CharacterCreationFlow for Edit Mode (Modified)
- Existing component already supports edit mode for presets
- For character editing: pass `initialCharacter` prop (new prop alongside `initialPreset`)
- Behavior matches preset editing but with squad-specific logic
- Header updates to show "Edit Character: [CharacterName]"
- Tech level remains hidden/read-only (locked to squad's tech level)

### State Management in SquadBuilder

**New State Variables:**
```typescript
const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
```

**New Handlers:**
- `handleEditCharacter(character: Character)`: Opens editor for character
  - Sets `editingCharacterId`
  - Shows CharacterCreationFlow
- `handleCharacterUpdated(updatedCharacter: Character)`: Saves edited character
  - Replaces old character in squad with updated version
  - Marks squad as unsaved
  - Closes editor (`setEditingCharacterId(null)`)
  - Shows success message
- `handleCancelEdit()`: Closes editor without saving
  - Clears `editingCharacterId`
  - Returns to character grid view

### User Workflows

#### Editing an Existing Character
1. User clicks "Edit" button on character card in grid
2. Character grid disappears, CharacterCreationFlow opens at Review step
3. All character data pre-filled (name, stats, flaw, feat, equipment)
4. User can:
   - Change character name directly
   - Click "Back" to navigate to Equipment step and modify equipped items
   - Click "Back" again to modify Flaws/Feats
   - Click "Back" again to modify Stats and tech level (tech level selector hidden/disabled)
5. User navigates back to Review step with all changes intact
6. Clicks "Update Character" button
7. Character is updated in squad with new data
8. Editor closes, character grid re-displays with updated character card
9. Squad marked as unsaved (if not already)
10. Brief success message: "Character updated"

#### Canceling an Edit
1. During edit, user clicks "Cancel" button
2. Unsaved changes discarded (no confirmation needed for edits - only prompt on squad navigation away)
3. Editor closes, character grid returns
4. Character remains unchanged in squad

#### Editing Multiple Characters Sequentially
1. User edits Character A and saves
2. Grid returns with Character A updated
3. User immediately clicks Edit on Character B
4. Character B editor opens at Review step
5. Previous edit state is completely cleared

### Implementation Details

**CharacterSummary.tsx Modifications:**
- Add `onEdit?: (character: Character) => void` to props
- Render Edit button conditionally (only if `onEdit` callback provided)
- Keep Remove button rendering unchanged
- New button group styling with `.character-actions` container

**SquadBuilder.tsx Modifications:**
- Add `editingCharacterId: string | null` state
- Add three handler functions (see State Management section above)
- Modify character grid rendering (lines 324-336):
  - Wrap each character card in `.character-item` with Edit + Remove buttons
  - Use `.character-actions` container for buttons side-by-side
- Add conditional rendering:
  - If `editingCharacterId === null`: show character grid
  - If `editingCharacterId !== null`: show CharacterCreationFlow in modal/overlay
- Pass `onEdit={handleEditCharacter}` to CharacterSummary components
- Render CharacterCreationFlow when editing:
  ```typescript
  {editingCharacterId && (
    <div className="character-edit-overlay">
      <CharacterCreationFlow
        mode="squad"
        techLevel={squad.techLevel}
        initialCharacter={squad.characters.find(c => c.id === editingCharacterId)}
        onCharacterUpdated={handleCharacterUpdated}
        onCancel={handleCancelEdit}
      />
    </div>
  )}
  ```

**CharacterCreationFlow.tsx Modifications:**
- Add `initialCharacter?: Character | null` prop to interface
- Add `onCharacterUpdated?: (character: Character) => void` callback
- Detect edit mode: `const isEditingCharacter = !!initialCharacter && mode === 'squad'`
- When editing character (squad mode):
  - Start at Review step: `isEditingCharacter ? 'review' : 'stats'`
  - Pre-fill state from `initialCharacter`
  - Keep `selectedTechLevel` from squad (read from `techLevel` prop, not user-selectable)
  - Hide or disable tech level selector in Stats step
  - Button text on Review: "Update Character" (instead of "Create Character")
- Update `handleCreateCharacter`:
  ```typescript
  if (isEditingCharacter) {
    const updatedCharacter: Character = {
      ...initialCharacter!,
      name: characterName.trim(),
      stats,
      flaw,
      feat,
      equipment,
      // techLevel stays the same (from prop)
    };
    onCharacterUpdated?.(updatedCharacter);
  } else {
    // existing new character logic
  }
  ```

**CSS Changes:**

New styles in `SquadBuilder.css`:
```css
.character-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-edit-character {
  flex: 1;
  padding: 8px 16px;
  background-color: #4CAF50; /* or your primary color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-edit-character:hover {
  background-color: #45a049;
  opacity: 0.9;
}

.btn-edit-character:active {
  transform: scale(0.98);
}

.character-edit-overlay {
  position: relative;
  z-index: 10;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}
```

Updates to `CharacterCreationFlow.css`:
- Add styling for read-only/disabled tech level selector in edit mode
- Ensure Review step header shows "Edit Character: [Name]" when editing
- Keep footer buttons sticky (from previous enhancement)

### Edge Cases

**Tech Level Selector Behavior in Edit Mode:**
- In Stats step while editing: tech level selector shown but disabled
- Visual indication: grayed out, tooltip: "Tech level is locked to squad's tech level"
- Attempting to proceed skips tech level selection (already have it from squad)

**Character Deletion While Editing:**
- Not possible: cannot delete a character that's currently being edited
- Could add safeguard: disable Remove button while any character is being edited

**Squad Navigation During Edit:**
- If user navigates away from squad while editing: lose edit changes (no warning, similar to new character creation)
- Edit state cleared on squad switch

**Duplicate Character Names:**
- Allowed: multiple characters in same squad can have same name (unlike squad names)
- No validation needed

**Empty Squad Name with Edited Character:**
- User can edit character without squad having a valid name
- Squad still needs valid name to save (existing behavior unchanged)

### Differences from Preset Editing

| Aspect | Preset Editing | Character Editing |
|--------|----------------|-------------------|
| Starting Step | Review | Review |
| Tech Level | User-selectable | Locked to squad's tech level |
| Pre-filled Data | All preset fields | All character fields |
| Button Text | "Update Preset" | "Update Character" |
| Success Message | "Preset updated" | "Character updated" |
| State Reset | On new preset load | On grid return |
| Squad Impact | N/A (presets separate) | Marks squad unsaved |

### Testing Scenarios

1. **Basic Edit**: Edit character name, verify changes saved
2. **Multi-step Edit**: Navigate back through steps, modify stats, verify all changes persist
3. **Sequential Edits**: Edit multiple characters one after another
4. **Cancel Edit**: Start editing, click Cancel, verify no changes saved
5. **Unsaved Changes**: Edit character, switch squads (no warning, changes lost)
6. **Auto-save**: Edit character and save, navigate away, verify squad auto-saved
7. **Tech Level Lock**: Verify tech level cannot be changed during edit
8. **Equipment Changes**: Edit character equipment (add/remove items), verify slots still validated



## Feature: Character Creation Wizard Footer Pattern

### Overview
The Character Creation Flow is a multi-step wizard that guides users through creating or editing characters. This spec defines the standardized footer pattern for the wizard, ensuring all action buttons are consistently visible and accessible throughout the flow, preventing accidental clicks on underlying content and maintaining predictable UX.

### Key Concepts
- **Unified Footer**: All step-specific action buttons (Confirm/Next buttons) are consolidated in a single sticky footer
- **Persistent Visibility**: The footer remains visible and accessible at all times, regardless of content height or scroll position
- **No Overlap**: Content scrolls beneath the footer but doesn't get hidden behind it; footer has sufficient viewport space
- **Consistent Button Hierarchy**: All steps use the same button layout pattern with consistent positioning and styling
- **Step-Aware Rendering**: Footer buttons conditionally render based on current step to show only relevant actions

### Wizard Structure

#### Overall Layout
```
┌─────────────────────────────────┐
│      flow-header                │  (fixed height, always visible)
│  (title + step indicator)       │
├─────────────────────────────────┤
│                                 │
│      flow-content               │  (scrollable, has bottom padding)
│    (step-specific content)      │  (padding = footer height + buffer)
│                                 │
│   [content scrolls up beneath]  │
├─────────────────────────────────┤
│      flow-footer                │  (sticky, always visible at bottom)
│    (all action buttons)         │
└─────────────────────────────────┘
```

#### flow-header
- Height: fixed
- Content: Page title, step indicator (1. Stats, 2. Flaws & Feats, etc.)
- Behavior: Always visible at top
- Styling: Dark background, white text

#### flow-content
- Height: flexible, grows with content
- Content: Current step's main UI (pickers, forms, grids)
- Scrolling: Vertical scroll enabled when content exceeds available space
- **Padding-bottom**: Calculated to equal footer height + buffer (prevents content from being hidden behind sticky footer)
- Behavior: User scrolls through content; footer remains visible above scrolling

#### flow-footer (Sticky)
- Position: `sticky` (not fixed)
- Bottom: `0` (sticks to bottom of visible area while content scrolls)
- Z-index: `10` (above content)
- Height: Fixed (approximately 60-80px depending on button count)
- Content: Action buttons for current step
- Styling: Light background with top border, centered button layout
- Scrolling: Stays in place as content scrolls; moves with viewport

### Button Layout by Step

All buttons appear in the sticky footer, organized left-to-right:

**Step 1: Stats Distribution**
```
[Cancel]  [Confirm Stats →]
```
- Cancel: Red/danger (discard changes, exit flow)
- Confirm Stats: Primary action (proceed to next step)
- No Back button (first step)

**Step 2: Flaws & Feats**
```
[Cancel]  [Back]  [Confirm Selection →]
```
- Cancel: Red/danger
- Back: Gray (return to previous step)
- Confirm Selection: Primary action

**Step 3: Equipment**
```
[Cancel]  [Back]  [Clear All]  [Confirm Equipment →]
```
- Cancel: Red/danger
- Back: Gray
- Clear All: Secondary action (remove all equipped items)
- Confirm Equipment: Primary action

**Step 4: Review**
```
[Cancel]  [Back]  [Create/Update Character]
```
- Cancel: Red/danger
- Back: Gray
- Create Character (new) / Update Character (edit): Primary action, green/success color
- No additional secondary actions

### Implementation Details

**CharacterCreationFlow.tsx Changes:**

1. **Restructure picker components** to remove their built-in action buttons:
   - StatDistributionPicker: Remove button, return selected stats via callback only
   - FlawsAndFeatsPicker: Remove button, return selections via callback only
   - EquipmentPicker: Remove Clear All and Confirm buttons, move to footer

2. **Update callback signatures**:
   - `onStatsSelected(stats)`: Called when stats selected (no button click needed)
   - `onSelectFlawAndFeat(flaw, feat)`: Called when selections made
   - `onEquipmentSelected(equipment)`: Called when equipment finalized
   - Add new handler: `onClearAllEquipment()` for Clear All action

3. **Update flow-footer rendering logic**:
   ```typescript
   const handleConfirmStats = () => {
     if (stats) {
       handleStatsSelected(stats);
     }
   };

   const handleConfirmFlawFeat = () => {
     if (flaw && feat) {
       handleFlawAndFeatSelected(flaw, feat);
     }
   };

   const handleConfirmEquipment = () => {
     handleEquipmentSelected(equipment);
   };

   // In footer:
   {currentStep === 'stats' && (
     <button onClick={handleConfirmStats} className="btn-confirm btn-confirm-stats">
       Confirm Stats →
     </button>
   )}
   {currentStep === 'flaws-feats' && (
     <button onClick={handleConfirmFlawFeat} className="btn-confirm btn-confirm-flaws">
       Confirm Selection →
     </button>
   )}
   {currentStep === 'equipment' && (
     <>
       <button onClick={handleClearAllEquipment} className="btn-secondary">
         Clear All
       </button>
       <button onClick={handleConfirmEquipment} className="btn-confirm btn-confirm-equipment">
         Confirm Equipment →
       </button>
     </>
   )}
   ```

4. **Add state to track selections**:
   - Stats picker doesn't auto-advance; user confirms via button
   - Same for Flaws/Feats and Equipment
   - Only Review step has auto-transition (when character created)

**CharacterCreationFlow.css Changes:**

```css
.flow-content {
    flex: 1;
    padding: 40px 20px;
    padding-bottom: 120px;  /* Footer height (~60px) + buffer (60px) */
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    overflow-y: auto;
}

.flow-footer {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 20px;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
    position: sticky;
    bottom: 0;
    z-index: 10;
    min-height: 60px;
    flex-wrap: wrap;  /* Allow buttons to wrap on small screens */
}

.btn-confirm {
    padding: 12px 30px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-confirm:hover:not(:disabled) {
    background-color: #45a049;
}

.btn-confirm:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-secondary {
    padding: 12px 30px;
    font-size: 16px;
    background-color: #666;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-secondary:hover {
    background-color: #555;
}
```

**Picker Component Changes:**

Each picker (StatDistributionPicker, FlawsAndFeatsPicker, EquipmentPicker) removes its own action buttons:
- Remove `onStatsSelected` button from StatDistributionPicker
- Remove `onSelectFlawAndFeat` button from FlawsAndFeatsPicker
- Remove `Clear All` and `Confirm Equipment` buttons from EquipmentPicker
- Remove related CSS for removed buttons
- Pickers still render content; buttons moved to footer

### User Workflows

#### Creating a Character - Stats Step
1. User sees Stats step with options and no buttons visible
2. User selects stat distribution (e.g., +3,+1,0,-3)
3. In sticky footer at bottom, user clicks "Confirm Stats →" button
4. Flow advances to Flaws & Feats step
5. Footer updates to show Cancel, Back, and "Confirm Selection →"

#### Creating a Character - Equipment Step
1. User navigates to Equipment step
2. Footer shows: [Cancel] [Back] [Clear All] [Confirm Equipment →]
3. User can click "Clear All" to remove all equipment without confirming
4. User adds/removes equipment as desired
5. Clicks "Confirm Equipment →" to proceed to Review

#### Editing a Preset - Equipment Step (Same Pattern)
1. User editing preset sees pre-populated equipment
2. Modifies equipment selections
3. Clicks "Clear All" to reset if needed
4. Clicks "Confirm Equipment →" to proceed
5. Same UX as creating new character

### Benefits

1. **Visibility**: Never lose action buttons; always know what to click
2. **Consistency**: Same button locations across all steps
3. **Accessibility**: Buttons remain in viewport; no need to scroll to find them
4. **Prevention**: Eliminates accidental clicks on underlying content (e.g., SquadBuilder's "Save Squad" button)
5. **Clarity**: Footer buttons clearly indicate available actions for current step

### Edge Cases

**Small Screens / Mobile:**
- Footer buttons may wrap to multiple lines (enabled via `flex-wrap: wrap`)
- Padding-bottom adjusted to accommodate wrapped buttons
- Content still scrollable and footer remains sticky

**Tall Step Content:**
- Stats step: Relatively compact, rarely scrolls
- Flaws & Feats: Large list of options, may scroll significantly
- Equipment: Very tall with many items, definitely scrolls
- Padding-bottom ensures footer never hides content in any case

**Disabled Buttons:**
- "Confirm" buttons disabled until required fields selected (e.g., stats not selected)
- Visual feedback: disabled style (gray, no hover effect)
- Clear indication to user that step is incomplete

**Button Click Timing:**
- No race conditions: button click triggers step handler
- Handler advances to next step or performs action
- Footer re-renders with new buttons for new step

### Testing Scenarios

1. **Tall Content**: Equipment step scrolls significantly; footer remains visible and buttons clickable
2. **Small Screens**: Buttons wrap correctly without overflow
3. **Disabled States**: Confirm button disabled until selections made; re-enables when valid
4. **Step Navigation**: Forward and back navigation works; footer buttons update per step
5. **Footer Never Hidden**: Scroll to bottom of any step; footer always at bottom and visible
6. **No Content Overlap**: Scroll to bottom; content last item not hidden behind footer
7. **Character Summary Cards**: SquadBuilder character cards not accidentally clickable when viewing CharacterCreationFlow

### Backward Compatibility

- Existing picker components refactored to remove buttons
- No external API changes (callbacks remain same)
- Improved UX, no breaking changes for existing features


## Feature: Display Derived Stats Throughout Character Creation and Summary

### Overview
Characters have three derived stats (HP, Movement, Equipment Slots) that are calculated from primary stats (Toughness, Agility, Strength respectively). Currently only Equipment Slots is displayed. This feature adds HP and Movement display throughout the character creation wizard and character summary, showing the derived values as users make selections and keeping derived stats visually associated with their source primary stats.

### Data Model

**Primary Stats:**
- Agility
- Presence
- Strength
- Toughness

**Derived Stats** (calculated from primary stats):
- **HP** = 8 + Toughness (Toughness → HP)
- **Movement** = 5 + Agility (Agility → Movement)
- **Equipment Slots** = 5 + Strength (Strength → Slots)

**Additional Modifiers:**
- Flaws may modify primary stats (e.g., "Too Many Teeth" applies -2 Presence)
- Feats may modify primary stats (e.g., "Marine" may apply modifiers)
- Derived stats recalculate based on modified primary stats

### Visual Design

#### Primary Stat Box
```
┌─────────────┐
│ AGI         │
│ +2          │
└─────────────┘
```
- Background: White/Light gray
- Border: 1px solid #ddd
- Font: Regular weight
- Used for primary stats only

#### Derived Stat Box (New)
```
┌─────────────┐
│ MOV         │
│ 7           │
└─────────────┘
```
- Background: Very light blue (#E8F0F8 or similar - not bright)
- Border: 1px solid #b8d4e8
- Font: Regular weight
- Slightly smaller than primary stat boxes (optional)
- Used for derived stats only

#### Stat Assignment Container
```
┌────────────────────────────────────────────┐
│ [Label] [Selector]     [Derived Stat Box]  │
│ "Agility"  [+3 +1 0 -3]    [MOV 7]        │
└────────────────────────────────────────────┘
```
- Flex container with proper spacing
- Selector controls (buttons/dropdowns) in middle
- Derived stat box on right
- Used in StatDistributionPicker

### Component Changes

#### 1. StatDistributionPicker

**New Layout Structure:**
```
STAT ASSIGNMENT AREA
├─ Stat Assignment 1: Agility
│  ├─ Label: "Agility"
│  ├─ Selector: [+3] [+1] [0] [-3]
│  └─ Derived: [MOV 7]
├─ Stat Assignment 2: Presence
│  ├─ Label: "Presence"
│  ├─ Selector: [+3] [+1] [0] [-3]
│  └─ Derived: [--] (no derived stat)
├─ Stat Assignment 3: Strength
│  ├─ Label: "Strength"
│  ├─ Selector: [+3] [+1] [0] [-3]
│  └─ Derived: [SLOTS 7]
└─ Stat Assignment 4: Toughness
   ├─ Label: "Toughness"
   ├─ Selector: [+3] [+1] [0] [-3]
   └─ Derived: [HP 10]
```

**Functionality:**
- For each stat, display label, selector, and corresponding derived stat box (if applicable)
- Derived stat values update in real-time as user assigns modifiers
- Use `calculateDerivedStats(stats)` utility function to compute derived values
- Display derived stat boxes for:
  - Agility → Movement
  - Strength → Equipment Slots
  - Toughness → HP
- Presence has no derived stat; either show empty box or omit

**CSS Class Usage:**
- `.stat-box`: Primary stat boxes (existing, unchanged)
- `.stat-box.derived`: Derived stat boxes (new, blue-tinted)
- `.stat-assignment`: Container for label + selector + derived stat (new)
- `.stat-assignment-label`: Label text styling (new)
- `.stat-assignment-selector`: Selector controls area (new)

**CSS to Add:**
```css
.stat-box.derived {
    background-color: #E8F0F8;
    border-color: #b8d4e8;
}

.stat-assignment {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    margin: 5px 0;
    background-color: #fafafa;
    border-radius: 4px;
}

.stat-assignment-label {
    min-width: 80px;
    font-weight: 500;
    color: #333;
}

.stat-assignment-selector {
    display: flex;
    gap: 8px;
    flex: 1;
}

.stat-assignment-selector button {
    padding: 8px 12px;
    min-width: 45px;
    /* existing button styles */
}
```

#### 2. FlawsAndFeatsPicker

**Current Stats Display Update:**
- Existing `.current-stats` row already displays all primary stats
- Add derived stats to this same row
- Insert a visual separator between primary and derived stats

**New Layout:**
```
PRIMARY STATS                   │ DERIVED STATS
[AGI +2] [PRE +1] [STR 0] [TOU -3]  │  [MOV 7] [SLOTS 5] [HP 8]
```

**Implementation:**
- Keep existing primary stats display
- Add derived stat boxes after a separator
- Use flex gap and `::after` pseudo-element or simple `<div>` spacer for separator
- Recalculate and display derived stats based on current selections

**Separator Styling:**
```css
.current-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
}

.current-stats-divider {
    width: 2px;
    height: 40px;
    background-color: #ccc;
    margin: 0 10px;
}

.current-stats-derived {
    display: flex;
    gap: 10px;
}
```

**HTML Structure:**
```tsx
<div className="current-stats">
  {/* Primary stats */}
  <div className="stat-box">...</div>
  {/* Repeat for all 4 primary stats */}
  
  {/* Separator */}
  <div className="current-stats-divider" />
  
  {/* Derived stats */}
  <div className="current-stats-derived">
    <div className="stat-box derived">...</div>
    {/* Repeat for all 3 derived stats */}
  </div>
</div>
```

#### 3. EquipmentPicker

**Apply Same Pattern as FlawsAndFeatsPicker:**
- Current stats row at top already displays primary stats
- Add derived stats with separator using same pattern
- Derived stat boxes shown with blue-tinted styling

#### 4. Review Step

**Stats Review Card Update:**
```
STATS (in review-section-card)
├─ Agility: +2          Movement: 7
├─ Presence: +1         [no derived]
├─ Strength: 0          Slots: 5
└─ Toughness: -3        HP: 8
```

**Implementation:**
- Modify stats list display in review-section-card
- Show primary stat and corresponding derived stat on same line
- Use 2-column layout within the card:
  - Left: Primary stat name and value
  - Right: Derived stat name and value (if applicable)

**CSS:**
```css
.stats-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px 10px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.stats-list li {
    padding: 8px 0;
    font-size: 16px;
    color: #333;
    border-bottom: none;
    display: flex;
    justify-content: space-between;
}

.stats-list li.derived {
    font-size: 14px;
    color: #666;
}
```

**HTML Structure:**
```tsx
<ul className="stats-list">
  <li>Agility: +2</li>
  <li className="derived">Movement: 7</li>
  
  <li>Presence: +1</li>
  <li className="derived">---</li>
  
  <li>Strength: 0</li>
  <li className="derived">Slots: 5</li>
  
  <li>Toughness: -3</li>
  <li className="derived">HP: 8</li>
</ul>
```

#### 5. CharacterSummary

**Updated Stats Grid Layout:**
```
┌─────────────┬─────────────┐
│ AGI         │ MOV         │
│ +2          │ 7           │
└─────────────┴─────────────┘
┌─────────────┬─────────────┐
│ PRE         │ ---         │
│ +1          │             │
└─────────────┴─────────────┘
┌─────────────┬─────────────┐
│ STR         │ SLOTS       │
│ 0           │ 5           │
└─────────────┴─────────────┘
┌─────────────┬─────────────┐
│ TOU         │ HP          │
│ -3          │ 8           │
└─────────────┴─────────────┘
```

**Implementation:**
- Change grid from 4 columns to 2 columns
- Each row contains primary stat + derived stat pair
- Primary stat boxes: existing white styling
- Derived stat boxes: blue-tinted styling
- Order: Agility/Movement, Presence/---, Strength/Slots, Toughness/HP

**CSS:**
```css
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    min-width: 70px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.stat-box.derived {
    background-color: #E8F0F8;
    border-color: #b8d4e8;
}

.stat-box.placeholder {
    background-color: #f5f5f5;
    border-color: #e0e0e0;
    color: #999;
}

.stat-name {
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
```

### Utility Functions

**Existing (Use These):**
- `calculateDerivedStats(stats: Stats): DerivedStats`
  - Returns: `{ hp: number, movement: number, equipmentSlots: number }`
  - Already implemented in `utils/stats.ts`
  - Use this to get derived stat values

**New Helper (Optional):**
```typescript
export function getDerivedStatValue(
  stat: 'agility' | 'presence' | 'strength' | 'toughness',
  primaryStats: Stats,
  flaw: Flaw | null,
  feat: Feat | null
): number | null {
  const effectiveStats = applyFlawFeatModifiers(primaryStats, flaw, feat);
  const derived = calculateDerivedStats(effectiveStats);
  
  switch (stat) {
    case 'agility': return derived.movement;
    case 'strength': return derived.equipmentSlots;
    case 'toughness': return derived.hp;
    case 'presence': return null; // No derived stat
  }
}
```

### Color Palette for Derived Stats

**Primary Stat Boxes:**
- Background: #ffffff (white)
- Border: #ddd
- Text: #333

**Derived Stat Boxes:**
- Background: #E8F0F8 (very light blue)
- Border: #b8d4e8 (light blue)
- Text: #333

**Alternative if #E8F0F8 too bright:**
- Background: #EFF4F9
- Border: #c5d9e8

### Real-Time Updates

**StatDistributionPicker:**
- Derived stat values update immediately as user selects modifiers
- No need to wait for step confirmation
- User sees impact of choices in real-time

**FlawsAndFeatsPicker:**
- After user selects flaw/feat, recalculate derived stats
- Display updated values in current-stats row
- Account for stat modifiers from flaw/feat

**EquipmentPicker:**
- Derived stats remain static during equipment selection
- No equipment affects primary stats or derived stats
- Display values from current character state

**Review:**
- Display final derived stat values
- Calculate using final selected stats + flaw/feat modifiers

### Testing Scenarios

1. **StatDistributionPicker**: Select different modifiers; verify derived stats update immediately
2. **Flaw Impact**: Select flaw with stat modifier; verify primary and derived stats update in FlawsAndFeatsPicker
3. **All Screens**: Verify derived stats appear consistently (correct color, correct values)
4. **Review Match**: Derived stats in Review match what was shown in earlier steps
5. **CharacterSummary**: Derived stats display correctly for saved characters
6. **Edge Cases**: Presence has no derived stat; ensure UI handles gracefully

### Files to Modify

- `src/components/StatDistributionPicker.tsx` - Add derived stat display
- `src/components/StatDistributionPicker.css` - Add derived stat and assignment container styling
- `src/components/FlawsAndFeatsPicker.tsx` - Add derived stats to current-stats row
- `src/components/FlawsAndFeatsPicker.css` - Add separator and derived stat styling
- `src/components/EquipmentPicker.tsx` - Add derived stats to current-stats row (same pattern as FlawsAndFeatsPicker)
- `src/components/EquipmentPicker.css` - Add separator and derived stat styling
- `src/components/CharacterCreationFlow.tsx` - Update Review step stats display
- `src/components/CharacterCreationFlow.css` - Update stats-list and review layout
- `src/components/CharacterSummary.tsx` - Update stats grid layout
- `src/components/CharacterSummary.css` - Update stats-grid to 2-column layout

### Backward Compatibility

- No breaking changes to component APIs
- Derived stats are display-only enhancements
- Existing stat selection logic unchanged
- Equipment Slots already displayed; HP and Movement are additions

## Feature: Apply Equipment Modifiers to Derived Stats

### Overview
Equipment items (primarily armor) can apply modifiers to derived stats. Currently, `Homemade` armor has a `-1 movement` modifier that is defined in the equipment data but not applied to the final Movement stat displayed to users. This feature ensures that all equipment-based modifiers (movement, HP, equipment slots) are properly calculated and applied to derived stats throughout the character creation flow and summary.

### Problem Statement
- Equipment types already support optional modifier properties (`movementModifier` on Armor)
- The derived stats calculation chain handles base stats → flaw/feat modifiers → derived stats
- **Gap**: Equipment modifiers are not applied to derived stats, so Homemade armor's `-1 movement` is ignored
- `getCharacterMovement()` in `utils/equipment.ts` exists but is not integrated into the derived stats calculation pipeline
- Users don't see equipment penalties reflected in their final Movement stat

### Data Model

**Equipment Modifier Properties** (already exist in types):
- `Armor` interface (line 82 in src/types/index.ts): `movementModifier?: number`
- Other equipment types (Weapon, Item, Ammo, Consumable) may support modifiers in future

**Future-Proofing for Other Modifiers**:
- HP modifiers (e.g., armor that provides +2 HP or penalties)
- Equipment Slots modifiers (e.g., harness that adds +1 slot)
- Future derived stat modifiers for game expansions

### Stat Modifier Calculation Chain

**Current (Incomplete)**:
```
Base Stats (from Step 1)
    ↓
+ Flaw/Feat Modifiers (from Step 2) via applyFlawFeatModifiers()
    ↓
= Effective Stats (modified primary stats)
    ↓
calculateDerivedStats(effectiveStats)
    ↓
= Derived Stats (HP, Movement, Slots)
    ↓
X STOP - Equipment modifiers not applied
```

**New (Complete)**:
```
Base Stats (from Step 1)
    ↓
+ Flaw/Feat Modifiers (from Step 2) via applyFlawFeatModifiers()
    ↓
= Effective Stats (modified primary stats)
    ↓
calculateDerivedStats(effectiveStats)
    ↓
= Base Derived Stats (HP, Movement, Slots)
    ↓
+ Equipment Modifiers (from Step 3) via calculateFinalDerivedStats()
    ↓
= Final Derived Stats (with all modifiers applied)
```

### Implementation Details

#### 1. Type System (types/index.ts)

**No type changes needed** - Armor already has `movementModifier?: number` (line 82)

**Future Enhancement** (out of scope for this feature, but designed for):
```typescript
// Optional: Add modifier support to other equipment types
export interface Weapon extends BaseEquipment {
  // ... existing properties
  movementModifier?: number;
  hpModifier?: number;
  slotsModifier?: number;
}

export interface Item extends BaseEquipment {
  // ... existing properties
  movementModifier?: number;
  hpModifier?: number;
  slotsModifier?: number;
}
```

#### 2. Utility Functions (utils/stats.ts)

**Add new function** `calculateFinalDerivedStats()`:

```typescript
/**
 * Calculate final derived stats with all modifiers applied.
 * 
 * Chain:
 * 1. Base stats
 * 2. Apply flaw/feat modifiers to primary stats
 * 3. Calculate base derived stats from modified primary stats
 * 4. Apply equipment modifiers to derived stats
 * 5. Return final derived stats
 * 
 * @param baseStats - Base stats from Step 1 (before any modifiers)
 * @param flaw - Selected flaw (Step 2)
 * @param feat - Selected feat (Step 2)
 * @param equipment - Selected equipment (Step 3)
 * @returns Final DerivedStats with all modifiers applied
 */
export function calculateFinalDerivedStats(
  baseStats: Stats,
  flaw: Flaw | null,
  feat: Feat | null,
  equipment: Equipment[]
): DerivedStats {
  // Step 1: Apply flaw/feat modifiers to primary stats
  const effectiveStats = applyFlawFeatModifiers(baseStats, flaw, feat);
  
  // Step 2: Calculate base derived stats from modified primary stats
  const derived = calculateDerivedStats(effectiveStats);
  
  // Step 3: Sum equipment modifiers for each derived stat
  const equipmentModifiers = {
    movement: 0,
    hp: 0,
    equipmentSlots: 0,
  };
  
  equipment.forEach((item) => {
    if (item.movementModifier) {
      equipmentModifiers.movement += item.movementModifier;
    }
    if (item.hpModifier) {
      equipmentModifiers.hp += item.hpModifier;
    }
    if (item.slotsModifier) {
      equipmentModifiers.equipmentSlots += item.slotsModifier;
    }
  });
  
  // Step 4: Apply equipment modifiers to derived stats
  return {
    hp: derived.hp + equipmentModifiers.hp,
    movement: derived.movement + equipmentModifiers.movement,
    equipmentSlots: derived.equipmentSlots + equipmentModifiers.equipmentSlots,
  };
}
```

**Deprecate/Update existing function** `getCharacterMovement()` in utils/equipment.ts:

Current implementation (lines 26-35) only accounts for armor penalties. Mark as deprecated since `calculateFinalDerivedStats()` is now the source of truth:

```typescript
/**
 * @deprecated Use calculateFinalDerivedStats() instead.
 * This only handles armor penalties and is not part of the stat modification chain.
 */
export function getCharacterMovement(baseMovement: number, equippedItems: Equipment[]): number {
    // ... existing implementation unchanged for backward compatibility
}
```

#### 3. Component Changes

**EquipmentPicker.tsx**:
- After user selects equipment, display final derived stats using `calculateFinalDerivedStats()`
- Current stats row shows: base stats + flaw/feat modifiers + equipment modifiers
- Example: If Agility is +2 and Homemade armor is equipped:
  - Base Movement: 5 + 2 = 7
  - Homemade modifier: -1
  - Final Movement: 7 - 1 = 6

**CharacterCreationFlow.tsx (Review Step)**:
- Display final derived stats using `calculateFinalDerivedStats()`
- Shows complete calculation accounting for all modifiers

**CharacterSummary.tsx**:
- Display final derived stats using `calculateFinalDerivedStats()`
- Uses full equipment list from saved character
- Shows actual in-game stat values

#### 4. Data Flow Example

**Scenario**: Character with Agility +2, wearing Homemade armor

**Stats Step (Step 1)**:
- User assigns: Agility +2
- Base stats: agility: 2
- Base derived: movement = 5 + 2 = 7
- Display: "Movement: 7"

**Flaws & Feats Step (Step 2)**:
- User selects flaw: "Weak Bones" (no agility modifier)
- Effective stats: agility: 2 (no change)
- Effective derived: movement = 5 + 2 = 7
- Display: "Movement: 7"

**Equipment Step (Step 3)**:
- User equips: Homemade armor (movementModifier: -1)
- Call `calculateFinalDerivedStats(baseStats, flaw, feat, equipment)`
- Final derived: movement = 7 + (-1) = 6
- Display: "Movement: 6" with note: "Base 7, Homemade -1"

**Review Step (Step 4)**:
- Display final derived stats: movement = 6

**CharacterSummary** (saved character):
- Display final derived stats: movement = 6
- Accounts for all modifiers: base + flaw/feat + equipment

### Usage Pattern

**In Components**:

```typescript
// When displaying final stats (EquipmentPicker, Review, CharacterSummary)
const finalDerived = calculateFinalDerivedStats(
  character.stats,
  character.flaw,
  character.feat,
  selectedEquipment  // Current equipment selection
);

// Display finalDerived.movement instead of base movement
// Show breakdown if desired: Base {derived.movement} + Equipment {equipmentModifiers.movement}
```

**Before Equipment Step** (Stats, Flaws & Feats):
```typescript
// Use existing functions for incomplete picture
const effectiveStats = applyFlawFeatModifiers(baseStats, flaw, feat);
const derived = calculateDerivedStats(effectiveStats);
// Display derived.movement (equipment not selected yet, so no modifiers)
```

### Behavioral Requirements

1. **Real-Time Updates**: Movement (and other derived stats) update immediately when equipment is selected/deselected in EquipmentPicker
2. **Negative Modifiers**: Modifiers are applied as-is (negative for penalties, positive for bonuses)
3. **Multiple Equipment**: All equipped items contribute their modifiers (e.g., 2 armor pieces each -1 movement = -2 total)
4. **Zero Modifiers**: Equipment without modifiers has no effect on derived stats
5. **Consistency**: Same calculation used everywhere (Stats display, Review, CharacterSummary)

### Display Requirements

**Show Equipment Impact** (Optional enhancement - UX improvement):

Consider showing breakdown in tooltips or parentheses:
```
Movement: 6 (Base 7 - Homemade 1)
HP: 10 (Base 10)
Slots: 7 (Base 7)
```

Or just final values with hover tooltips showing modifiers.

### Edge Cases

1. **No Equipment**: Modifiers sum to 0, final = base
2. **Multiple Modifiers Same Type**: Sum all contributions
3. **Conflicting Modifiers**: Sum algebraically (e.g., +1 and -2 = -1 net)
4. **Equipment Without Modifiers**: Ignored in calculation
5. **Null Equipment Array**: Treat as empty array (no modifiers)

### Testing Scenarios

1. **Base Only**: No flaw/feat/equipment → final derived = base derived
2. **Flaw/Feat Only**: Equipment is empty → final derived accounts for stat modifiers but not equipment
3. **Equipment Only**: Homemade armor selected with base stats → movement reduced by 1
4. **Complete Chain**: All modifiers applied → final movement = base + flaw/feat modifiers + equipment modifiers
5. **Multiple Equipment Modifiers**: Items with movement penalties (future: if Items get movementModifier support) → penalties stack correctly
6. **Persistence**: Saved character displays final derived stats correctly in CharacterSummary
7. **Modification**: Changing equipment in CharacterSummary recalculates if edit feature is used

### Backward Compatibility

- `calculateDerivedStats()` unchanged (still used for intermediate calculations)
- `getCharacterMovement()` deprecated but still works
- Existing stat displays updated to use new calculation
- No breaking changes to component APIs

### Files to Modify

1. **src/utils/stats.ts**
   - Add `calculateFinalDerivedStats()` function
   - Mark `getCharacterMovement()` as deprecated (if used elsewhere)

2. **src/components/EquipmentPicker.tsx**
   - Use `calculateFinalDerivedStats()` when displaying current stats
   - Show final movement accounting for equipped armor

3. **src/components/CharacterCreationFlow.tsx**
   - Use `calculateFinalDerivedStats()` in Review step

4. **src/components/CharacterSummary.tsx**
   - Use `calculateFinalDerivedStats()` for final stat display

### Future Enhancements (Out of Scope)

- Add `hpModifier` and `slotsModifier` to Weapon, Item, Consumable types
- Support equipment that grants bonuses (+1 movement boots, etc.)
- UI breakdown showing modifier sources
- Equipment modifier requirements (e.g., "Can't use this armor if Toughness < 2")
- Stacking limits (e.g., "Movement can't go below 1" safety floor)

### Success Criteria

✅ Homemade armor's `-1 movement` is reflected in EquipmentPicker display
✅ Final Movement stat in Review step accounts for equipment modifiers
✅ CharacterSummary displays correct Movement with equipment modifiers applied
✅ All tests pass for complete stat calculation chain
✅ No regression in existing stat calculations
✅ Code is extensible for future modifier types (HP, Slots modifiers on other equipment)

## Feature: Generate Printable Squad Sheet

### Overview
Allow users to generate a printable page for any loaded squad. The page should display all characters with their complete information in a format optimized for A4 landscape printing in full color. Includes an HP tracking bar for use during gameplay.

### Requirements

#### Page Layout
- **Orientation**: Landscape
- **Format**: A4 proportions (1:1.414 aspect ratio)
- **Color**: Full color support
- **Content**: All characters on one page

#### Character Information Display

For each character, display in an organized layout:

**1. Character Name**
- Large, prominent heading

**2. Base Stats**
- Agility, Presence, Strength, Toughness
- Formatted clearly (table or grid)

**3. Derived Stats**
- HP (number value, e.g., "6")
- Movement
- Equipment Slots
- Include calculation note if equipment modifiers are present

**4. HP Tracking Bar** ⭐ NEW
- **Visual Format**: Horizontal or vertical bar made of circles and a skull icon
- **Composition**: Exactly HP elements total
  - (HP - 1) empty circles: One per HP point minus one
  - Exactly 1 skull & crossbones (☠️) icon: Replaces the final element
  
- **Purpose**: Players fill in circles with pencil *after* printing to track damage during gameplay
  
- **Example Layouts** (all shown empty in app):
  - 5 HP character: `[○○○○��]` (4 circles, 1 skull = 5 total)
  - 6 HP character: `[○○○○○☠]` (5 circles, 1 skull = 6 total)
  - 7 HP character: `[○○○○○○☠]` (6 circles, 1 skull = 7 total)
  - 11 HP character: `[○○○○○○○○○○☠]` (10 circles, 1 skull = 11 total)
  
- **Size Constraints**:
  - Minimum HP: 5 (5 elements: 4 circles + 1 skull)
  - Maximum HP: 11 (11 elements: 10 circles + 1 skull)
  - Total elements = exactly HP value
  
- **Printable Aspect**:
  - Large enough to mark off during gameplay (pen/pencil friendly)
  - Circles should be approximately 0.3-0.4 inches each
  - Printed with clear borders/outlines for marking
  - All circles appear empty in print (player fills as they take damage)
  - Use contrasting outline style for visibility

**5. Flaw Information**
- Flaw name (bold/prominent)
- Full description/effects

**6. Feat Information**
- Feat name (bold/prominent)
- Full description/effects

**7. Equipment List**
- **Armor Section** (highlighted/prominent background color):
  - Position: First in equipment list
  - **AV stat must be prominent** (large font, bold, or color-highlighted)
  - Armor name
  - All other armor properties (slots, cost, special rules if present)
  - Movement modifier (if applicable)
  
- **Other Equipment** (weapons, items, ammo, consumables):
  - Organized by category or in single list
  - Name, slots, cost, relevant special properties
  
- **Exclusions**: No ID numbers displayed (e.g., don't show `id: "armor-001"`)

#### Data to Include

**From Character Object**:
- character.name
- character.stats (agility, presence, strength, toughness)
- character.flaw.type + description (from flaws28Psalms lookup)
- character.feat.type + description (from feats28Psalms lookup)
- character.equipment[] - all items with full details (from equipment data)
- character.techLevel (relevant context)

**From Derived Stats**:
- hp (maximum HP only, for display and HP bar sizing)
- movement
- equipmentSlots

**From Flaws/Feats Data**:
- Look up flaw/feat full information from data files
- Include complete descriptions for printing

**From Equipment Data**:
- All equipment properties except IDs
- Include special rules, requirements, modifiers

#### Visual Design Considerations

**HP Tracking Bar**:
- Exactly HP elements total: (HP - 1) circles + 1 skull
- All circles appear empty (unfilled) in the printed version
- Clear visual distinction with outlined circles (not filled)
- Empty positions: Hollow/outlined only with white fill
- Final position: Skull & crossbones icon (☠️)
- Spacing: Evenly spaced, borders around each circle
- **Print-Friendly**:
  - High contrast outlines for clarity
  - Sized appropriately for pen marking (not too small)
  - Borders strong enough to be visible and writable over
  - Player fills circles with pencil to mark damage taken

**Armor Highlighting**:
- Distinct background color (e.g., light gold/yellow, or different shade)
- AV displayed prominently:
  - Larger font than other stats
  - Bold or color-emphasized
  - Clear label "AV: X"

**Typography**:
- Clean, readable fonts
- Appropriate hierarchy (character name > sections > details)
- Good contrast for printing

**Spacing**:
- Compact but readable layout
- Logical grouping of related information
- Margins suitable for binding/reading
- **HP Bar Spacing**: Reserve space proportional to max HP (5-11 total elements)

**Colors**:
- Professional, printer-friendly palette
- Sufficient contrast for black & white fallback
- HP bar: High contrast outlines (dark outline, white/empty fill)
- Optional: Use tech-level theming (e.g., different color for past-tech vs future-tech)

#### Printing Features

**Browser Print Dialog**:
- Trigger via standard browser print functionality (Ctrl+P / Cmd+P)
- Use CSS media queries to optimize for print
- Remove UI chrome (buttons, sidebars, etc.) from print view
- Ensure background colors and images print correctly

**Print CSS**:
- A4 landscape page size specification
- Proper margins
- Page break handling between characters
- Print-specific font sizes for readability
- HP bar rendering with clear borders (all empty)

#### Component Architecture

**New Components**:
- `SquadPrintView.tsx` - Main print view component
  - Displays full squad in print layout
  - Uses print-friendly styles
  - Integrates character print layout
  
- `CharacterPrintCard.tsx` - Single character print layout
  - Displays all character information in print format
  - Self-contained, reusable for each character
  - Handles equipment organization and highlighting
  
- `HPTrackingBar.tsx` - HP tracking bar component
  - Takes: maxHP (number)
  - Renders exactly maxHP positions: (maxHP - 1) empty circles and 1 skull icon
  - All circles always appear empty (no fill)
  - Can be reused for interactive HP tracking in future

**New Styles**:
- `SquadPrintView.css` - Layout and page structure for print
- `CharacterPrintCard.css` - Character-specific print styles
- `HPTrackingBar.css` - HP bar styling (circles, outlines, borders)
- Possibly: `print.css` - Global print media queries

**Integration**:
- Add "Print Squad" button to SquadBuilder component
- Button triggers print view or opens new window/modal with print view
- Alternatively: Add print icon/button in squad display area
- Use React Router or state management to handle print view mode

#### Data Flow

1. User has squad loaded in SquadBuilder
2. User clicks "Print Squad" button
3. Print view opens (modal, new tab, or full-page mode)
4. Print view fetches/uses current squad data:
   - Squad name
   - List of characters in squad
   - For each character:
     - Stats, flaw, feat, equipment
     - Calculate derived stats (including max HP)
5. Print view looks up full descriptions:
   - Flaws from flaws28Psalms
   - Feats from feats28Psalms
   - Equipment details from equipment data sources
6. CharacterPrintCard renders for each character:
   - All stats and information
   - HPTrackingBar component with maxHP value (displays empty circles + skull)
7. User prints via browser print dialog (Ctrl+P)
8. Optimized A4 landscape layout is printed with all HP bars empty and ready for player to mark damage with pencil

#### Interaction Patterns

**Option 1: Modal/Overlay Print View**
```
SquadBuilder
  ├─ [Print Squad] button
  └─ SquadPrintView (modal, overlay, or full page)
     └─ CharacterPrintCard[] (one per character)
        └─ HPTrackingBar (shows (HP-1) circles + 1 skull)
```

**Option 2: New Route/Tab**
```
/squad/:id/print route
- Dedicated print view page
- Can open in new tab for separate print dialog
- Cleaner separation of concerns
```

**Option 3: In-Page Print View**
```
SquadBuilder with display mode toggle
- Toggle between "Edit" and "Print Preview" mode
- Print preview shows printable layout
- Print button triggers browser print
```

#### File Organization

**New Files**:
- `src/components/SquadPrintView.tsx`
- `src/components/SquadPrintView.css`
- `src/components/CharacterPrintCard.tsx`
- `src/components/CharacterPrintCard.css`
- `src/components/HPTrackingBar.tsx`
- `src/components/HPTrackingBar.css`

**Modified Files**:
- `src/components/SquadBuilder.tsx` - Add print button
- `src/index.css` or new `src/print.css` - Global print styles

#### HPTrackingBar Component Specification

**Props**:
```typescript
interface HPTrackingBarProps {
  maxHP: number;        // Maximum HP (5-11)
  orientation?: 'horizontal' | 'vertical';  // Default: horizontal
}
```

**Rendering Logic**:
1. Create exactly maxHP total positions
2. Render (maxHP - 1) empty circles
3. Render 1 skull icon as final position
4. Total elements = maxHP
5. Space evenly across available width/height
6. Each position has visible border
7. All circles appear empty (white fill, dark outline)

**Example Renders** (all empty in app):
- maxHP = 5: `[○○○○☠]` (4 circles, 1 skull = 5 total)
- maxHP = 6: `[○○○○○☠]` (5 circles, 1 skull = 6 total)
- maxHP = 11: `[○○○○○○○○○○☠]` (10 circles, 1 skull = 11 total)

**CSS Styling**:
```css
.hp-tracking-bar {
  display: flex;
  gap: 4px;
  align-items: center;
  margin: 12px 0;
}

.hp-position {
  width: 32px;  /* Approximately 0.4 inches at 80 DPI */
  height: 32px;
  border: 2px solid #333;
  border-radius: 50%;  /* circles */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: #ffffff;
}

.hp-position.skull {
  font-size: 24px;
  background-color: #ffffff;
}

@media print {
  .hp-tracking-bar {
    gap: 6px;
  }
  
  .hp-position {
    width: 28px;
    height: 28px;
    border: 2px solid #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

#### CSS Media Query (Print)

```css
@media print {
  /* Hide non-print elements */
  body > * { display: none; }
  #print-root { display: block; }
  
  /* Page setup */
  @page {
    size: A4 landscape;
    margin: 0.5in;
  }
  
  /* Optimize fonts and spacing for print */
  body {
    font-size: 11pt;
    line-height: 1.4;
  }
  
  /* Character cards */
  .character-print-card {
    page-break-inside: avoid;
    page-break-after: always;
  }
  
  /* HP bar - ensure crisp rendering */
  .hp-tracking-bar {
    margin: 16px 0;
  }
  
  .hp-position {
    width: 28px;
    height: 28px;
    border: 2px solid #000;
    background-color: #ffffff;
  }
  
  /* Ensure colors print */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
  }
}
```

#### Functional Requirements

- ✅ Display all characters in current squad
- ✅ Show base and derived stats for each character
- ✅ Show HP value (e.g., "6")
- ✅ Show HP tracking bar with (HP - 1) circles and 1 skull
- ✅ HP bar contains exactly HP elements total
- ✅ All circles appear empty (unfilled) - player fills with pencil during play
- ✅ Last element is skull & crossbones icon
- ✅ Show full flaw description (not just type)
- ✅ Show full feat description (not just type)
- ✅ List all equipment with full details
- ✅ Armor first in equipment list
- ✅ Armor AV stat prominent/highlighted
- ✅ No ID numbers in output
- ✅ A4 landscape page format
- ✅ Full color support
- ✅ Professional, readable layout
- ✅ Proper pagination for multiple characters
- ✅ HP bar is print-friendly with clear borders for pencil marking

#### Non-Functional Requirements

- Performance: Print view should render quickly even with large squads
- Usability: Simple one-click printing
- Compatibility: Works with standard browser print dialog
- Accessibility: Print layout readable and printable in grayscale
- Print Quality: HP bars render crisply with visible borders for pencil marking

#### Testing Scenarios

1. **Single Character Squad**: Print displays cleanly with all sections including empty HP bar
2. **Multi-Character Squad**: Multiple characters page-break correctly with HP bars
3. **Equipment Variety**: Different equipment types display appropriately
4. **Armor Highlighting**: Armor section stands out with AV prominent
5. **HP Bar Rendering**:
   - 5 HP character: Bar shows 4 circles + 1 skull (5 total)
   - 6 HP character: Bar shows 5 circles + 1 skull (6 total)
   - 11 HP character: Bar shows 10 circles + 1 skull (11 total)
   - All circles appear empty/unfilled with clear outlines
6. **Data Lookups**: Flaw/feat descriptions retrieved and displayed correctly
7. **Print Layout**: Page breaks between characters, no orphaned sections
8. **Color Printing**: Colors appear correctly when printed in color
9. **Print Dialog**: Browser print dialog opens with correct settings
10. **HP Bar Printability**: Borders are visible and clear for pencil marking

#### Future Enhancements (Out of Scope)

- Interactive HP tracking during app usage (not print-based)
- PDF export directly (without browser print dialog)
- Custom themes/templates
- Watermarks or branding
- Squad summary page before character details
- Character portrait/icon support
- QR codes or reference numbers
- Multi-column layout options
- Customizable print settings (font size, spacing, etc.)
- Dynamic HP tracking in print view (clicking to mark damage)

#### Success Criteria

✅ Squad print sheet can be generated with one click
✅ All required information is displayed for each character
✅ HP tracking bar displays exactly (HP - 1) circles and 1 skull
✅ HP bar total elements equals character's max HP value
✅ HP bar uses empty circles with skull icon
✅ All circles appear empty in print - ready for player to mark with pencil
✅ HP bar is large enough and clear enough for pencil marking during gameplay
✅ Armor is highlighted with prominent AV display
✅ Layout is optimized for A4 landscape printing
✅ Output is professional and suitable for tabletop gaming reference
✅ No IDs or internal data exposed
✅ Characters are properly paginated
✅ HP bars print with visible borders and high contrast for pencil marking

## Feature: Add Characters to Squad from Presets

### Overview
Allow users to add saved character presets directly to a squad during the squad building process. This provides a quick way to populate squads with pre-built characters, improving workflow efficiency when building multiple squads.

### Requirements

#### UI Changes to SquadBuilder

**Section Header Button Addition**:
- Next to existing "+ Add Character" button, add a new "+ From Preset" button
- Both buttons in the same section-header area
- Buttons side-by-side or stacked layout (design choice)

**Button States**:
- "+ From Preset" button is **disabled** when squad already has 5 members
- Show tooltip when disabled: "Squad has reached the maximum of 5 characters"
- "+ From Preset" button is enabled when squad has fewer than 5 members

#### Preset Picker Modal/View

**New Component: PresetCharacterPicker**
- Opens as a modal overlay when "+ From Preset" button is clicked
- Displays all saved presets from the `presets` prop
- Tech-level filtering: Hide presets with incompatible tech-level (doesn't match squad tech-level)
- Uses CharacterSummary components for each preset display
- CharacterSummary components rendered at **smaller scale** (visually zoomed out) to fit more on screen
  - Suggested: 70-80% of normal size, or CSS transform: scale(0.75)
  - Allow for compact grid display

**Selection Behavior**:
- User clicks on a preset's CharacterSummary to select it
- Clicking adds that preset to the squad as a new character
- Modal closes immediately after selection
- Squad updates with new character
- Squad's character count and total cost update

**Character Conversion**:
- When preset is selected, convert CharacterPreset to Character:
  - Copy all fields: name, stats, flaw, feat, equipment
  - Set character.techLevel to squad's techLevel (consistency check - already matching due to filtering)
  - Generate new character.id (Date.now().toString())
  - Character joins squad with all preset configuration intact

#### CharacterSummary Component Changes

**Remove Item Count Display**:
- Delete the "Items:" line that shows `character.equipment.length` (lines 81-84 in current code)
- This frees up space in the summary card

**Add Equipment List (Names Only)**:
- Replace the removed "Items:" row with a full equipment list
- Display all equipment by **name only** (no costs, no additional properties)
- Format as a simple list of names:
  - Vertical list with one item per line
  - Or comma-separated inline list (design choice)
  - Example: "Sword, Shield, First Aid Kit" or separate lines
- Keep existing "Cost:" and "Slots:" rows below the equipment list

**Updated Equipment Section Looks Like**:
```
Equipment
- Sword
- Shield  
- First Aid Kit
Cost: 25 cr
Slots: 3 / 7
```

Or inline:
```
Equipment
Sword, Shield, First Aid Kit
Cost: 25 cr
Slots: 3 / 7
```

#### Data Flow

1. User clicks "+ From Preset" button in SquadBuilder
2. PresetCharacterPicker modal opens
3. Modal receives:
   - `presets`: CharacterPreset[] - all available presets
   - `squadTechLevel`: TechLevel - current squad's tech level
   - `onSelectPreset`: (preset: CharacterPreset) => void - callback on selection
   - Optional: `isDisabled`: boolean - if squad is full (disable entire picker or show message)
4. Modal filters presets by tech-level (only show matches)
5. Renders each matching preset as a smaller CharacterSummary
6. User clicks a preset's summary
7. `onSelectPreset` callback fired with selected preset
8. SquadBuilder converts preset to character and adds to squad
9. Modal closes
10. Squad display updates (character count, total cost)

#### Component Architecture

**Modified Components**:
- `SquadBuilder.tsx`:
  - Add "+ From Preset" button next to "+ Add Character"
  - Add `showPresetPicker` state
  - Add `handleSelectPresetForSquad` function to convert preset to character
  - Pass presets and squad.techLevel to PresetCharacterPicker
  
- `CharacterSummary.tsx`:
  - Remove item count display (lines 81-84)
  - Add equipment list display (names only)
  - Adjust CSS for compact layout with equipment list

**New Component**:
- `PresetCharacterPicker.tsx`:
  - Modal/overlay component
  - Displays presets filtered by tech-level
  - Uses CharacterSummary at smaller scale
  - Clickable preset items
  - Close button/background click to dismiss
  
- `PresetCharacterPicker.css`:
  - Modal styling
  - Grid/flex layout for preset cards
  - Scale/zoom styling for CharacterSummary
  - Responsive sizing

#### Implementation Details

**Preset Filtering**:
```typescript
const compatiblePresets = presets.filter(p => p.techLevel === squadTechLevel);
```

**Preset to Character Conversion**:
```typescript
const presetToCharacter = (preset: CharacterPreset): Character => {
  return {
    id: Date.now().toString(),
    name: preset.name,
    stats: preset.stats,
    flaw: preset.flaw,
    feat: preset.feat,
    equipment: preset.equipment,
    techLevel: preset.techLevel,
  };
};
```

**CharacterSummary Props Enhancement** (optional, for reusability):
```typescript
interface CharacterSummaryProps {
  character: Character;
  scale?: number;  // Optional: apply transform scale
  showEquipmentList?: boolean;  // Optional: show equipment names
}
```

**CSS Scale Example**:
```css
.character-summary.compact {
  transform: scale(0.75);
  transform-origin: top left;
}
```

#### UI/UX Considerations

**Preset Picker Modal**:
- Clear title: "Select a Character Preset"
- Tech-level indicator in filter feedback: "Showing 3 of 5 presets (Past-Tech)"
- Empty state if no compatible presets: "No compatible presets for this tech-level"
- Grid layout to maximize visible presets (3-4 columns suggested)
- Each preset card clickable (entire CharacterSummary clickable)
- Visual feedback on hover (cursor: pointer, background highlight)

**CharacterSummary at Smaller Scale**:
- Rendered at 70-80% of normal size
- Text remains readable
- All information visible but compact
- Maintains layout integrity (no wrapping issues)
- Grid spacing: compact but not cramped

**Integration with Squad Builder**:
- Buttons consistent styling with existing "+ Add Character" button
- Picker modal overlays existing content
- Clear close options (X button, Cancel, click outside)
- No scroll jump or layout shift when modal opens

#### State Management

**SquadBuilder adds**:
```typescript
const [showPresetPicker, setShowPresetPicker] = useState(false);

const handleSelectPresetForSquad = (preset: CharacterPreset) => {
  if (!squad) return;
  
  const newCharacter = presetToCharacter(preset);
  const alignedCharacter: Character = {
    ...newCharacter,
    techLevel: squad.techLevel,
  };
  
  setSquad({
    ...squad,
    characters: [...squad.characters, alignedCharacter],
    updatedAt: new Date(),
  });
  setIsSaved(false);
  setShowPresetPicker(false);
};
```

#### Functional Requirements

- ✅ "+ From Preset" button visible next to "+ Add Character"
- ✅ Button disabled when squad has 5 members
- ✅ Clicking opens preset picker modal
- ✅ Modal shows only presets with matching tech-level
- ✅ Presets displayed as smaller CharacterSummary components
- ✅ User can click preset to add to squad
- ✅ Modal closes after selection
- ✅ New character added to squad with all preset data
- ✅ Squad character count updates
- ✅ Squad total cost updates
- ✅ CharacterSummary displays full equipment list (names only)
- ✅ CharacterSummary no longer shows item count
- ✅ Presets with incompatible tech-level are hidden

#### Non-Functional Requirements

- Performance: Preset picker renders quickly even with many presets
- Usability: Clear visual feedback on interaction
- Consistency: New character integrates seamlessly with squad
- Accessibility: Modal keyboard navigation (Escape to close, etc.)

#### Testing Scenarios

1. **Button Visibility**: "+ From Preset" button appears in section-header alongside "+ Add Character"
2. **Button Disabled State**: Button disabled when squad has exactly 5 members
3. **Preset Picker Opens**: Clicking button opens modal with preset list
4. **Tech-Level Filtering**: Only presets matching squad tech-level are shown
5. **Empty State**: If no compatible presets, show helpful message
6. **Multiple Presets**: Several presets display in compact grid layout
7. **Compact Sizing**: CharacterSummary components render at smaller scale, readable
8. **Selection**: Clicking preset adds character to squad
9. **Modal Closes**: Picker closes immediately after selection
10. **Squad Updates**: Character count and total cost reflect new member
11. **Equipment Display**: New character in summary shows equipment list (names)
12. **No Item Count**: "Items:" count removed from CharacterSummary
13. **Multiple Additions**: Can add multiple presets (up to 5 total)
14. **Persistence**: Added preset character persists when squad is saved

#### Edge Cases

- Squad with 5 members: Button disabled, no action on click
- No compatible presets: Modal shows empty state
- Preset with no equipment: Equipment section empty/minimal
- Preset with many equipment items: Equipment list wraps appropriately
- Squad with mixed origin characters: Presets and manually-created characters coexist
- Tech-level mismatch: Presets filtered out, not shown in picker

#### Files to Modify

1. **src/components/SquadBuilder.tsx**:
   - Add `showPresetPicker` state
   - Add "+ From Preset" button in section-header
   - Add `handleSelectPresetForSquad` handler
   - Render PresetCharacterPicker modal when `showPresetPicker` is true

2. **src/components/CharacterSummary.tsx**:
   - Remove item count display (lines 81-84)
   - Add equipment list display (names only)
   - Optional: Add `scale` prop for sizing control

3. **src/components/CharacterSummary.css**:
   - Update layout to accommodate equipment list
   - Add optional `.compact` scale style

#### Files to Create

1. **src/components/PresetCharacterPicker.tsx**:
   - New modal component for preset selection
   - Props: presets, squadTechLevel, onSelectPreset, onCancel
   - Filters and displays compatible presets
   - Handles preset selection click

2. **src/components/PresetCharacterPicker.css**:
   - Modal styling and layout
   - Grid layout for preset cards
   - CharacterSummary scale styling
   - Responsive design

#### Future Enhancements (Out of Scope)

- Sorting/filtering presets in picker (by cost, power level, etc.)
- Search presets by name
- Preview detailed stats before adding
- Batch add multiple presets
- Preset categories/folders
- Duplicate preset in modal for immediate editing
- Drag-and-drop reordering after adding to squad

#### Success Criteria

✅ "+ From Preset" button is visible and functional
✅ Button disabled when squad has 5 members
✅ Preset picker modal displays only compatible presets
✅ Presets rendered at compact size with full information
✅ User can select and add preset to squad
✅ Squad updates correctly with new character
✅ CharacterSummary shows equipment list (names only)
✅ Item count removed from CharacterSummary
✅ Modal closes after selection
✅ No breaking changes to existing functionality

## Feature: Delete Squad

### Overview
Users can delete an existing squad and all its associated characters. The feature includes a confirmation dialog to prevent accidental deletion, and navigates the user to the landing page after successful deletion.

### Key Concepts
- **Destructive Action**: Deletion is permanent and cannot be undone
- **Confirmation Required**: User must confirm deletion via YES/NO dialog
- **Cascading Deletion**: All characters in the squad are deleted along with the squad
- **No Impact on Other Data**: Deleting a squad does not affect other squads, characters in other squads, or presets
- **Landing Page Return**: After deletion, user is redirected to the application's landing page

### UI Components

#### Squad Builder Footer (Modified)
- **Layout**: Flex container with left-aligned and right-aligned sections
- **Left Section**: "Delete Squad" button (red/danger styling)
- **Right Section**: Existing buttons (Save Squad, Print Squad, etc.)
- **Button Styling**:
  - Background: Red or #d32f2f (danger color)
  - Text: "Delete Squad"
  - Hover state: Darker red with opacity change
  - Size: Consistent with other footer buttons

#### Delete Confirmation Modal (New)
- **Title**: "Delete Squad?"
- **Message**: "Are you sure you want to delete '[Squad Name]'? This action cannot be undone. All characters in this squad will be permanently deleted."
- **Buttons**:
  - "NO" (secondary, left-aligned) - close modal without action
  - "YES" (danger/red, right-aligned) - confirm deletion

### State Management in SquadBuilder

**New Handler:**
- `handleDeleteSquad()`: Opens confirmation modal
  - Sets state to show modal
  - Passes squad name to modal for display

- `handleConfirmDelete()`: Executes squad deletion
  - Removes squad from `appState.squads`
  - Removes all characters associated with this squad
  - Updates `currentSquadId` to null (or loads previous squad if available)
  - Navigates to landing page
  - Shows success message (optional toast)

- `handleCancelDelete()`: Closes modal without action
  - Clears modal state
  - Returns to squad view

### User Workflow

#### Deleting a Squad
1. User has a squad loaded in SquadBuilder
2. User clicks "Delete Squad" button in footer (left-aligned, red)
3. Confirmation modal appears with squad name and warning message
4. User clicks "NO":
   - Modal closes
   - User remains in SquadBuilder with squad unchanged
5. User clicks "YES":
   - Squad is permanently deleted from localStorage
   - All characters in squad are deleted
   - App navigates to landing page
   - Brief success message: "Squad deleted successfully"

### Implementation Details

**SquadBuilder.tsx Changes:**
- Add `showDeleteModal` state:
  ```typescript
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  ```

- Add handlers:
  ```typescript
  const handleDeleteSquad = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!squad) return;
    
    // Remove squad from state
    const updatedSquads = appState.squads.filter(s => s.id !== squad.id);
    
    // Update app state (remove squad and set currentSquadId to null)
    const newAppState = {
      ...appState,
      squads: updatedSquads,
      currentSquadId: null,
    };
    
    // Persist to localStorage
    saveToLocalStorage(newAppState);
    
    // Show success message
    showSuccessMessage('Squad deleted successfully');
    
    // Navigate to landing page
    setShowDeleteModal(false);
    navigate('/');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  ```

- Modify footer rendering to add Delete button (left-aligned):
  ```typescript
  <footer className="squad-builder-footer">
    <div className="footer-left">
      {squad && (
        <button 
          className="btn-delete-squad"
          onClick={handleDeleteSquad}
        >
          Delete Squad
        </button>
      )}
    </div>
    <div className="footer-right">
      {/* Existing buttons: Save Squad, Print Squad, etc. */}
    </div>
  </footer>
  ```

- Render DeleteConfirmationModal when `showDeleteModal` is true:
  ```typescript
  {showDeleteModal && (
    <DeleteConfirmationModal
      squadName={squad?.name || 'Squad'}
      onConfirm={handleConfirmDelete}
      onCancel={handleCancelDelete}
    />
  )}
  ```

**SquadBuilder.css Changes:**

```css
.squad-builder-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-top: 1px solid #ddd;
  gap: 15px;
}

.footer-left {
  display: flex;
  gap: 10px;
}

.footer-right {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-delete-squad {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s, opacity 0.3s;
}

.btn-delete-squad:hover {
  background-color: #b71c1c;
  opacity: 0.9;
}

.btn-delete-squad:active {
  transform: scale(0.98);
}

.btn-delete-squad:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}
```

**DeleteConfirmationModal.tsx (New Component):**

```typescript
import React from 'react';
import './DeleteConfirmationModal.css';

interface DeleteConfirmationModalProps {
  squadName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  squadName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirmation">
        <h2>Delete Squad?</h2>
        <p>
          Are you sure you want to delete <strong>'{squadName}'</strong>? This action cannot be undone. 
          All characters in this squad will be permanently deleted.
        </p>
        <div className="modal-buttons">
          <button 
            className="btn-secondary btn-cancel"
            onClick={onCancel}
          >
            NO
          </button>
          <button 
            className="btn-danger btn-confirm"
            onClick={onConfirm}
          >
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );
};
```

**DeleteConfirmationModal.css (New Stylesheet):**

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

.modal-content h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 22px;
}

.modal-content p {
  margin: 0 0 25px 0;
  color: #666;
  line-height: 1.5;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-confirm {
  background-color: #d32f2f;
  color: white;
}

.btn-confirm:hover {
  background-color: #b71c1c;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Data Flow

1. **Before Deletion:**
   - Squad exists in `appState.squads`
   - Characters exist in `appState` (either in squad or elsewhere)
   - `currentSquadId` points to the squad being deleted

2. **On Confirmation:**
   - Squad object removed from `appState.squads`
   - All characters that belonged to this squad are deleted
   - `currentSquadId` set to null
   - localStorage updated with new state
   - Navigation to landing page ('/')

3. **After Deletion:**
   - Squad no longer exists in app
   - All its characters permanently deleted
   - User sees landing page with remaining squads (if any)

### Edge Cases

**Multiple Squads:**
- User deletes Squad A (of 3 squads) → Squad A removed, Squads B and C remain
- User can still access remaining squads

**Single Squad:**
- User deletes only squad → App navigates to landing page with no squads
- User can create a new squad

**Squad with Many Characters:**
- All characters in the squad are deleted together with squad
- No orphaned character data left behind

**Unsaved Changes:**
- If squad has unsaved changes, they are still deleted (no warning needed, consistent with new character creation behavior per AGENTS.md)
- Deletion is explicit and destructive

### Functional Requirements

- ✅ "Delete Squad" button visible in SquadBuilder footer
- ✅ Button is left-aligned, other footer buttons remain right-aligned
- ✅ Button is red/danger color
- ✅ Button is only visible when squad exists
- ✅ Clicking opens confirmation modal with squad name
- ✅ Modal has "NO" and "YES, DELETE" buttons
- ✅ "NO" closes modal without action
- ✅ "YES, DELETE" deletes squad and all characters
- ✅ After deletion, navigate to landing page
- ✅ Squad removed from localStorage
- ✅ All characters in squad removed from localStorage
- ✅ Other squads and characters unaffected
- ✅ Success message shown after deletion (optional)

### Testing Scenarios

1. **Basic Delete**: Delete a squad, verify it's gone and user redirected
2. **Confirmation Dialog**: Modal appears with correct squad name
3. **Cancel Delete**: Click NO, remain in SquadBuilder with squad intact
4. **Multiple Squads**: Delete one, verify others remain accessible
5. **Character Deletion**: Verify all characters in deleted squad are removed
6. **Landing Page**: After deletion, user sees landing page
7. **Empty State**: Delete only squad, app shows no squads available
8. **Button Visibility**: Delete button only shows when squad exists
9. **Button Styling**: Red color, left-aligned in footer

### Files to Modify

1. **src/components/SquadBuilder.tsx**:
   - Add `showDeleteModal` state
   - Add `handleDeleteSquad`, `handleConfirmDelete`, `handleCancelDelete` handlers
   - Modify footer layout to support left-aligned button
   - Render DeleteConfirmationModal

2. **src/components/SquadBuilder.css**:
   - Update `.squad-builder-footer` layout with flexbox
   - Add `.footer-left` and `.footer-right` styles
   - Add `.btn-delete-squad` styles

### Files to Create

1. **src/components/DeleteConfirmationModal.tsx**:
   - Reusable confirmation modal component

2. **src/components/DeleteConfirmationModal.css**:
   - Modal styling with animation

### Non-Functional Requirements

- Performance: Deletion is instant (no loading time)
- Usability: Clear confirmation prevents accidental deletion
- Consistency: Follows existing button and modal patterns in app
- Accessibility: Modal keyboard navigation (Escape to close, Tab between buttons)

### Success Criteria

✅ Squad can be deleted with one click + confirmation
✅ Confirmation modal clearly indicates what will be deleted
✅ All associated data removed from localStorage
✅ User redirected to landing page after deletion
✅ Other squads/characters/presets unaffected
✅ Button styling clearly indicates destructive action
✅ No breaking changes to existing functionality

## Feature: Random Feat and Flaw Selection

### Overview
Enable users to randomly select feats and flaws in the FlawsAndFeatsPicker component. This provides a quick way to explore different character builds and adds variety to character creation without requiring manual selection.

### Key Concepts
- **Unweighted Random Selection**: Each feat and flaw has an equal probability of being selected
- **No Lock-In**: Random selections can be overridden with manual selections at any time
- **Dynamic Feat/Flaw Lists**: Randomization works regardless of the number of available feats/flaws
- **Independent Randomization**: Feat and flaw buttons operate independently
- **Clear Feedback**: Visual indication of which option was randomly selected

### UI Components

#### FlawsAndFeatsPicker (Modified)
- **Random Feat Button**: "🎲 Random Feat" or similar icon button next to feat selection
- **Random Flaw Button**: "🎲 Random Flaw" or similar icon button next to flaw selection
- **Button Placement**: Above each selection grid
- **Button Styling**:
  - Icon-based or text-based button
  - Consistent with existing component styling
  - Clear hover state indicating interactivity

### Button Behavior

**Random Feat Button:**
- When clicked: Selects a random feat from `feats28Psalms` array
- Updates feat selection state
- Triggers re-render to display selected feat
- User can still click any feat to change selection

**Random Flaw Button:**
- When clicked: Selects a random flaw from `flaws28Psalms` array
- Updates flaw selection state
- Triggers re-render to display selected flaw
- User can still click any flaw to change selection

### Implementation Details

**FlawsAndFeatsPicker.tsx Changes:**

1. **New Helper Functions:**
   ```typescript
   const getRandomFeat = (): Feat => {
     const randomIndex = Math.floor(Math.random() * feats28Psalms.length);
     return feats28Psalms[randomIndex];
   };

   const getRandomFlaw = (): Flaw => {
     const randomIndex = Math.floor(Math.random() * flaws28Psalms.length);
     return flaws28Psalms[randomIndex];
   };
   ```

2. **New Handler Functions:**
   ```typescript
   const handleRandomFeat = () => {
     const randomFeat = getRandomFeat();
     setSelectedFeat(randomFeat);
     onSelectFlawAndFeat(selectedFlaw, randomFeat);
   };

   const handleRandomFlaw = () => {
     const randomFlaw = getRandomFlaw();
     setSelectedFlaw(randomFlaw);
     onSelectFlawAndFeat(randomFlaw, selectedFeat);
   };
   ```

3. **Button Rendering:**
   - Add random feat button above feat selection grid:
     ```typescript
     <div className="feat-section">
       <h3>Select a Feat</h3>
       <button 
         className="btn-random"
         onClick={handleRandomFeat}
         title="Select a random feat"
       >
         🎲
       </button>
       {/* Existing feat grid rendering */}
     </div>
     ```

   - Add random flaw button above flaw selection grid:
     ```typescript
     <div className="flaw-section">
       <h3>Select a Flaw</h3>
       <button 
         className="btn-random"
         onClick={handleRandomFlaw}
         title="Select a random flaw"
       >
         🎲
       </button>
       {/* Existing flaw grid rendering */}
     </div>
     ```

**FlawsAndFeatsPicker.css Changes:**

```css
.feat-section,
.flaw-section {
  margin-bottom: 30px;
}

.feat-section h3,
.flaw-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.btn-random {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  margin-bottom: 12px;
  border-radius: 4px;
  transition: background-color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-random:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.btn-random:active {
  transform: scale(0.95);
}

/* Tooltip on hover */
.btn-random[title] {
  cursor: help;
}
```

### Randomization Logic

**Equal Probability:**
- Use `Math.floor(Math.random() * array.length)` to generate index
- Every feat/flaw has exactly `1 / array.length` probability of selection
- No bias toward any particular option

**Dynamic Array Handling:**
- Randomization works with any number of feats/flaws
- Automatically adapts if feat/flaw lists are modified or extended
- No hardcoded assumptions about list length

### User Workflow

#### Randomizing a Feat
1. User clicks "🎲" button above "Select a Feat" section
2. A random feat is selected from available feats
3. Selected feat is highlighted (existing highlight behavior)
4. Current stats preview updates to show feat modifiers
5. User can click any other feat to change selection
6. User can click random button again to select a different random feat

#### Randomizing a Flaw
1. User clicks "🎲" button above "Select a Flaw" section
2. A random flaw is selected from available flaws
3. Selected flaw is highlighted
4. Current stats preview updates to show flaw modifiers
5. User can click any other flaw to change selection
6. User can click random button again to select a different random flaw

#### Mixed Manual and Random Selection
1. User clicks random feat button → random feat selected
2. User manually clicks a different feat → feat changes (no lock-in)
3. User clicks random flaw button → random flaw selected
4. User can continue modifying selections freely

### Edge Cases

**Single Feat/Flaw:**
- If only one feat available, clicking random always selects it (still valid)
- Same for flaws

**Empty Lists:**
- Should not occur in normal usage (game always has feats/flaws)
- If it does, handle gracefully (no error, button disabled or hidden)

**Rapid Clicks:**
- Multiple rapid clicks select new random options each time
- No debouncing needed (selection is instant)

**Same Random Selection Twice:**
- User can click random button twice and get same option
- This is statistically valid and not a bug

### Functional Requirements

- ✅ Random feat button visible above feat selection section
- ✅ Random flaw button visible above flaw selection section
- ✅ Each button has clear hover state
- ✅ Clicking random feat selects random feat from list
- ✅ Clicking random flaw selects random flaw from list
- ✅ Each feat has equal probability of selection
- ✅ Each flaw has equal probability of selection
- ✅ Works with any number of feats/flaws
- ✅ Random selections can be overridden manually
- ✅ No lock-in behavior
- ✅ Selected option updates UI immediately

### Testing Scenarios

1. **Random Feat Selection**: Click random feat button, verify a feat is selected
2. **Random Flaw Selection**: Click random flaw button, verify a flaw is selected
3. **Manual Override**: Click random, then manually select different option
4. **Stats Update**: Verify current-stats row updates after random selection
5. **Multiple Random Clicks**: Click random button multiple times, verify different options
6. **Probability**: Random multiple times, verify all options are selected over time
7. **Manual After Random**: Randomly select feat, manually select flaw (independent)
8. **Independent Selection**: Random feat doesn't affect flaw selection
9. **Hover State**: Buttons show hover feedback
10. **Accessibility**: Buttons have clear title/aria-label attributes

### Files to Modify

1. **src/components/FlawsAndFeatsPicker.tsx**:
   - Add `getRandomFeat()` helper function
   - Add `getRandomFlaw()` helper function
   - Add `handleRandomFeat()` handler
   - Add `handleRandomFlaw()` handler
   - Add random feat button above feat section
   - Add random flaw button above flaw section

2. **src/components/FlawsAndFeatsPicker.css**:
   - Add `.btn-random` button styling
   - Add `.feat-section` and `.flaw-section` styling
   - Add hover/active states for random button

### Non-Functional Requirements

- Performance: Random selection is instant (no noticeable lag)
- UX: Clear visual feedback on button interaction
- Accessibility: Buttons have tooltips/aria-labels
- Code: Logic is simple and maintainable

### Success Criteria

✅ Random feat button works correctly
✅ Random flaw button works correctly
✅ Each feat has equal probability of selection
✅ Each flaw has equal probability of selection
✅ Randomization works with dynamic list sizes
✅ Random selections can be overridden manually
✅ No lock-in behavior
✅ UI updates immediately after random selection
✅ Buttons have clear hover/active states
✅ No breaking changes to existing functionality


## Feature: Equipment Cost Display & Free Ammo Stack

### Overview
Two related enhancements to the Equipment step of character creation:
1. Display the total CR (credit) cost of selected equipment in the `current-stats` bar of EquipmentPicker
2. Ranged weapons that include a free first ammo stack should have that ammo's cost credited (subtracted) from the total equipment cost

### Part 1: Total Equipment Cost in current-stats

#### Visual Design

The `current-stats` bar in EquipmentPicker currently shows:

```
PRIMARY STATS                    │ DERIVED STATS
[AGI +2] [PRE +1] [STR 0] [TOU -3]  │  [MOV 7] [SLOTS 5] [HP 8]
```

After this change:

```
PRIMARY STATS                    │ DERIVED STATS               │ COST
[AGI +2] [PRE +1] [STR 0] [TOU -3]  │  [MOV 7] [SLOTS 5] [HP 8]  │  [CR 42]
```

#### Cost Stat Box (New)
```
┌─────────────┐
│ CR          │
│ 42          │
└─────────────┘
```
- Background: Light yellow (`#FFF8E1`)
- Border: `1px solid #F0E0A0`
- Same dimensions as other stat boxes
- Label: "CR"
- Value: Total cost from `calculateTotalCost(selectedEquipment)` minus free ammo credits (see Part 2)

#### Implementation

**EquipmentPicker.tsx Changes:**
- Import `calculateTotalCost` from `utils/equipment`
- After the `current-stats-derived` div, add:
  - A second `<div className="current-stats-divider" />`
  - A `<div className="stat-box cost">` containing label "CR" and the total cost value

**HTML Structure:**
```tsx
<div className="current-stats">
  {/* Primary stats (existing) */}
  <div className="current-stats-divider" />
  <div className="current-stats-derived">
    {/* MOV, SLOTS, HP (existing) */}
  </div>
  {/* NEW: second divider and cost box */}
  <div className="current-stats-divider" />
  <div className="stat-box cost">
    <div className="stat-label">CR</div>
    <div className="stat-value">{totalCost}</div>
  </div>
</div>
```

**CSS Changes (EquipmentPicker.css and/or CharacterCreationFlow.css):**
```css
.stat-box.cost {
    background-color: #FFF8E1;
    border-color: #F0E0A0;
}
```

**Scope:** Only add the cost box to `EquipmentPicker.tsx`. The `FlawsAndFeatsPicker` and `StatDistributionPicker` do not have equipment context and should not display cost.

### Part 2: Free First Ammo Stack for Ranged Weapons

#### Game Rule
Ranged weapons include one free stack of their compatible ammo. The cost of that first ammo stack should not count toward the character's total equipment cost. The EquipmentPicker already displays the note "Ranged weapons include one free ammo stack" (line ~307), but the cost credit is not currently implemented.

#### Approach: Cost Credit (Option A — smallest code change)

Modify `calculateTotalCost()` in `src/utils/equipment.ts` to detect ranged weapons with `includesAmmoId`, look up the matching ammo's cost from ammo data, and subtract it once per qualifying weapon.

**Why this approach:**
- Only 1 utility function changes (`calculateTotalCost`)
- No component changes needed (EquipmentPicker already calls this function)
- No data changes needed (weapon data already has `includesAmmoId`)
- No new UI logic or auto-select behavior

**Other approaches considered and rejected:**
- **(b) Reduce weapon costs in data**: Would require changing 14+ weapon `cost` fields, and displayed costs wouldn't match the rulebook
- **(c) Separate free ammo data entry with auto-select**: Would require new data entries, new selection state management, new UI for auto-adding/removing ammo — significantly more code

#### Implementation

**src/utils/equipment.ts Changes:**

Update `calculateTotalCost()`:

```typescript
import { Equipment, Weapon, Ammo } from '../types';
import { ammo28Psalms } from '../types/equipment28Psalms';

export function calculateTotalCost(equippedItems: Equipment[]): number {
    const baseCost = equippedItems.reduce((total, item) => total + item.cost, 0);

    // Credit the cost of one free ammo stack per ranged weapon with includesAmmoId
    let ammoCredit = 0;
    equippedItems.forEach((item) => {
        if (item.category === 'weapon') {
            const weapon = item as Weapon;
            if (weapon.includesAmmoId) {
                const includedAmmo = ammo28Psalms.find(a => a.id === weapon.includesAmmoId);
                if (includedAmmo) {
                    ammoCredit += includedAmmo.cost;
                }
            }
        }
    });

    return Math.max(0, baseCost - ammoCredit);
}
```

**Key Behaviors:**
- For each ranged weapon with `includesAmmoId`, the cost of one stack of that ammo type is subtracted from the total
- The ammo cost is looked up from `ammo28Psalms` data (not hardcoded)
- The credit applies whether or not the user has actually selected ammo — the weapon price includes one ammo stack by rule
- Total cost is floored at 0 (can never go negative)
- If a weapon's `includesAmmoId` doesn't match any ammo entry (data error), no credit is applied
- Multiple ranged weapons each contribute their own ammo credit independently

#### Data Reference

Ranged weapons with `includesAmmoId` (from `equipment28Psalms.ts`):

| Weapon | includesAmmoId | Ammo to Credit |
|--------|---------------|----------------|
| Bow | bow-ammo | Bow Ammo |
| Crossbow | crossbow-ammo | Crossbow Ammo |
| Revolver | revolver-ammo | Revolver Ammo |
| Pistol | pistol-ammo | Pistol Ammo |
| Rifle | space-rifle-ammo | Space Rifle Ammo |
| Plas-mar | plasma-cell-ammo | Plasma Cell Ammo |
| Pulse Rifle | pulse-rifle-ammo | Pulse Rifle Ammo |
| Shotgun | shotgun-ammo | Shotgun Ammo |
| Molten Slug Gun | revolver-ammo | Revolver Ammo |
| Flamethrower | flame-ammo | Flame Ammo |
| Laser | laser-ammo | Laser Ammo |

### Edge Cases

- **No equipment selected**: Cost displays as 0 CR
- **Only melee weapons**: No ammo credit applied, cost is sum of weapon costs
- **Ranged weapon with no ammo selected**: Credit still applies (weapon price includes the ammo by rule)
- **Multiple ranged weapons**: Each weapon contributes its own ammo credit
- **Two weapons sharing same ammoTypeId** (e.g., Revolver and Molten Slug Gun both use `revolver-ammo`): Each gets its own credit (both weapons include a free stack)
- **Ammo without a matching weapon**: No credit — credits are weapon-driven, not ammo-driven

### Testing Scenarios

1. **Cost Display**: Select equipment, verify CR stat-box appears with correct total
2. **Cost Updates**: Add/remove equipment, verify CR value updates in real-time
3. **Free Ammo Credit — Ranged Weapon**: Select a Bow (cost 5), verify total cost is `5 - bow_ammo_cost`
4. **Free Ammo Credit — Multiple Ranged**: Select Bow + Rifle, verify both ammo costs credited
5. **No Credit — Melee Weapon**: Select Sword, verify full cost shown (no credit)
6. **No Credit — No Weapon**: Select only armor/items, verify full cost shown
7. **Floor at Zero**: Edge case where credits exceed base cost → shows 0 CR
8. **Visual Styling**: Cost box is light yellow, separated by vertical divider from derived stats
9. **Existing tests**: Update `equipment.test.ts` to cover ammo credit scenarios

### Files to Modify

1. **src/utils/equipment.ts**
   - Update `calculateTotalCost()` to subtract free ammo credits
   - Import `ammo28Psalms` from equipment data

2. **src/components/EquipmentPicker.tsx**
   - Import `calculateTotalCost` from `utils/equipment`
   - Add second divider and cost stat-box after derived stats in `current-stats`

3. **src/components/EquipmentPicker.css** (or CharacterCreationFlow.css)
   - Add `.stat-box.cost` styling (light yellow background, gold border)

4. **src/utils/equipment.test.ts** (or create if not present)
   - Add tests for free ammo credit in `calculateTotalCost()`
   - Test: ranged weapon credits ammo cost
   - Test: melee weapon no credit
   - Test: multiple ranged weapons each credit independently
   - Test: floor at 0

### Backward Compatibility

- `calculateTotalCost()` signature is unchanged (same input/output types)
- Existing callers automatically get the ammo credit behavior
- No breaking changes to component APIs
- No data structure changes needed

### Success Criteria

✅ CR stat-box appears in EquipmentPicker `current-stats` bar, to the right of derived stats, separated by a vertical divider
✅ CR stat-box has light yellow background styling
✅ Total cost updates in real-time as equipment is added/removed
✅ Ranged weapons with `includesAmmoId` have one free ammo stack's cost credited
✅ Credit is per-weapon, not per-ammo-type
✅ Total cost is never negative
✅ Existing equipment selection behavior is unchanged
✅ All tests pass

## Feature: Game Selector, Routing & New Storage Key

### Overview
Add a game selection screen as the first thing users see. Thread `gameId` through all state. Use a new localStorage key. Show the current game name in the header with a "back to games" control. Selecting "Kill Sample Process" shows a placeholder for now.

### Key Concepts
- **GameId**: `'28-psalms' | 'kill-sample-process'` — discriminator for all game-specific data
- **GameConfig**: Registry of per-game configuration (display name, whether tech level applies, etc.)
- **New localStorage key**: `'squad-builder-state'` replaces `'forbidden-psalm-state'` — no migration of old data
- **Game-scoped squads/presets**: Each squad and preset stores its own `gameId`; UI filters by current game

### Data Structure Changes

**New type `GameId`** in `src/types/index.ts`:
```typescript
export type GameId = '28-psalms' | 'kill-sample-process';
```

**New file `src/types/games.ts`**:
```typescript
import { GameId } from './index';

export interface GameConfig {
  id: GameId;
  displayName: string;
  shortName: string;
  hasTechLevel: boolean;
}

const GAME_CONFIGS: Record<GameId, GameConfig> = {
  '28-psalms': {
    id: '28-psalms',
    displayName: '28 Psalms',
    shortName: '28P',
    hasTechLevel: true,
  },
  'kill-sample-process': {
    id: 'kill-sample-process',
    displayName: 'Kill Sample Process',
    shortName: 'KSP',
    hasTechLevel: false,
  },
};

export function getGameConfig(gameId: GameId): GameConfig {
  return GAME_CONFIGS[gameId];
}

export function getAllGameConfigs(): GameConfig[] {
  return Object.values(GAME_CONFIGS);
}
```

**Modified `AppState`** in `src/types/index.ts`:
```typescript
export interface AppState {
  presets: CharacterPreset[];
  squads: Squad[];
  currentSquadId: string | null;
  currentGameId: GameId | null;
}
```

**Modified `Squad`** — add `gameId`, make `techLevel` optional:
```typescript
export interface Squad {
  id: string;
  name: string;
  characters: Character[];
  gameId: GameId;
  techLevel?: TechLevel;  // optional: KSP squads won't have one
  createdAt: Date;
  updatedAt: Date;
  dateSaved?: string;
}
```

**Modified `Character`** — add `gameId`, make `techLevel` optional:
```typescript
export interface Character {
  id: string;
  name: string;
  stats: Stats;
  flaw: Flaw;
  feat: Feat;
  equipment: Equipment[];
  gameId: GameId;
  techLevel?: TechLevel;
}
```

**Modified `CharacterPreset`** — add `gameId`, make `techLevel` optional:
```typescript
export interface CharacterPreset {
  id: string;
  name: string;
  stats: Stats;
  flaw: Flaw;
  feat: Feat;
  equipment: Equipment[];
  gameId: GameId;
  techLevel?: TechLevel;
  createdAt: Date;
  updatedAt: Date;
}
```

### New Component: GameSelector

**File: `src/components/GameSelector.tsx`** + `GameSelector.css`

- Grid of game cards (one per game in `getAllGameConfigs()`)
- Each card shows: game display name, short description
- Clicking a card calls `onGameSelected(gameId)`
- Visual style: cards similar to TechLevelSelector but for games
- "Kill Sample Process" card is visually dimmed (coming soon)

### App.tsx Changes

- **New constant**: `STORAGE_KEY = 'squad-builder-state'` (replaces `'forbidden-psalm-state'`)
- **New state**: `currentGameId` tracked inside `appState.currentGameId`
- **Rendering logic**:
  - When `appState.currentGameId` is `null` → render `GameSelector`
  - When `appState.currentGameId === 'kill-sample-process'` → render a simple placeholder with "← Change Game" button
  - When `appState.currentGameId === '28-psalms'` → render existing `SquadBuilder` (filtered to that game's squads/presets)
- **New handler**: `handleGameSelected(gameId)` — sets `appState.currentGameId`, clears `currentSquadId`
- **New handler**: `handleChangeGame()` — sets `appState.currentGameId` to `null`
- **Filter squads/presets**: Pass only squads/presets matching `appState.currentGameId` to `SquadBuilder`
- **Pass `gameId`** to `SquadBuilder` as a new prop

### SquadBuilder Changes

- **New prop**: `gameId: GameId`
- **New prop**: `onChangeGame: () => void`
- **Header**: Show `squad-builder-header-title` with "← Change Game" button and title "Squad Builder — {displayName}"
- **Squad creation**: When creating a new squad, set `squad.gameId = gameId`
- **Tech level selector**: Only show `TechLevelSelector` when `getGameConfig(gameId).hasTechLevel` is true
- **KSP squads**: When `hasTechLevel` is false, a `useEffect` auto-creates a squad without tech level and advances to `squad-builder` view
- **Characters created in squad**: Set `character.gameId = gameId` and `character.techLevel = squad.techLevel` (if applicable)

### SquadDropdown Changes
- Already receives filtered squads from App.tsx, so no filtering changes needed inside the component
- `formatTechLevel()` updated to accept `string | undefined` — omits tech level info from option label when not present

### PresetCharacterPicker Changes
- `squadTechLevel` prop changed from `TechLevel` to `TechLevel | undefined`
- When `squadTechLevel` is undefined, all presets are shown (no filtering)

### CharacterCreationFlow Changes
- New optional prop `gameId?: GameId` (used in preset mode to store `gameId` on created preset)
- Preset creation includes `gameId: gameId ?? initialPreset?.gameId ?? '28-psalms'`
- Character creation (squad mode) includes `gameId: gameId ?? '28-psalms'` — overridden by SquadBuilder

### PresetFlow Changes
- New required prop `gameId: GameId` — passed to `CharacterCreationFlow`

### localStorage Schema Change

**Old key**: `'forbidden-psalm-state'`  
**New key**: `'squad-builder-state'`

No migration. Old data remains in `'forbidden-psalm-state'` and is ignored. The new schema adds `currentGameId`:

```json
{
  "presets": [],
  "squads": [],
  "currentSquadId": null,
  "currentGameId": null
}
```

Squads and presets now include `gameId` field. Squads loaded from old data without `gameId` will not match any `currentGameId` filter and will be invisible until the user recreates them.

### CSS Changes

**`src/App.css`** — new `.game-placeholder` and `.btn-change-game` styles for the KSP placeholder screen

**`src/components/GameSelector.css`** — new file; dark gradient background, game cards similar to TechLevelSelector

**`src/components/SquadBuilder.css`** — new `.squad-builder-header-title`, `.btn-change-game-header` styles

### Success Criteria

✅ Game selector shown on first visit (or when `currentGameId` is null)
✅ Selecting "28 Psalms" loads the full squad builder
✅ Selecting "Kill Sample Process" shows a placeholder
✅ "← Change Game" button returns to the game selector from any game screen
✅ New localStorage key `'squad-builder-state'` used throughout
✅ `Squad`, `Character`, and `CharacterPreset` all carry `gameId`
✅ `techLevel` is optional on all three (required only for 28-Psalms)
✅ `AppState` carries `currentGameId`
✅ Squads/presets filtered by `currentGameId` before being passed to SquadBuilder
✅ SquadBuilder header shows game display name
✅ All TypeScript types updated and build passes
✅ All existing tests pass



## Feature: Multi-Game Support (28 Psalms and Kill Sample Process)

### Overview
The app now supports multiple games with game selection at startup. Two games are currently available: 28 Psalms (28P) and Kill Sample Process (KSP). Game-specific data (stats, feats, flaws, equipment) is properly routed through the app based on the selected game.

### Key Concepts
- **GameId**: Discriminator for routing game-specific data (`'28-psalms' | 'kill-sample-process'`)
- **GameConfig**: Registry containing stats, distributions, equipment per game
- **Game-Scoped Data**: Squads and characters now carry `gameId` field
- **Current Issue**: `gameId` not passed to `CharacterCreationFlow` in squad mode, causing 28P content to display for KSP characters

### Data Structure Changes
- New `GameId` type in `src/types/index.ts`
- New `src/types/games.ts` with `GameConfig` interface
- `AppState` now tracks `currentGameId`
- `Squad`, `Character`, `CharacterPreset` all carry `gameId` field
- `techLevel` made optional (KSP squads don't use it)

### Components Modified

**App.tsx**
- Game selection landing page
- Routes between games
- Manages `currentGameId` in state

**SquadBuilder.tsx**
- Accepts `gameId` prop
- Game-scoped squad operations
- Conditional tech-level display (28P only)
- **CRITICAL**: When rendering `CharacterCreationFlow` in squad mode around line 455, must pass `gameId` prop:
  ```tsx
  <CharacterCreationFlow
    gameId={gameId}  // ← MISSING - MUST ADD
    techLevel={squad.techLevel}
    onCharacterCreated={handleCharacterCreated}
    onCancel={() => setShowCharacterCreation(false)}
  />
```
  StatDistributionPicker, FlawsAndFeatsPicker, EquipmentPicker

    Accept gameId prop
    Route to game-specific data:
        28P: feats28Psalms, flaws28Psalms, equipment28Psalms
        KSP: featsKSP, flawsKSP, equipmentKSP (when available)

CharacterCreationFlow

    New gameId prop
    Computes resolvedGameId from prop or defaults to '28-psalms'
    Passes gameId to all child pickers
    BUG: When gameId not provided, defaults to 28P

PresetFlow

    Accepts gameId during preset creation
    Presets scoped to their game

Critical Bug Identified

Location: SquadBuilder.tsx, ~line 455

Problem: When rendering CharacterCreationFlow for squad character creation, the gameId prop is NOT passed. This causes the flow to default to '28-psalms' regardless of squad's actual game.

Current (WRONG):
```TSX

<CharacterCreationFlow
  techLevel={squad.techLevel}
  onCharacterCreated={handleCharacterCreated}
  onCancel={() => setShowCharacterCreation(false)}
/>
```
Should Be (CORRECT):
```TSX

<CharacterCreationFlow
  gameId={gameId}
  techLevel={squad.techLevel}
  onCharacterCreated={handleCharacterCreated}
  onCancel={() => setShowCharacterCreation(false)}
/>
```
Symptoms:

    In Stats Picker: Only 28P statlines shown, not KSP statlines
    In Stats Picker: Only 28P stats available (missing Knowledge stat for KSP)
    In Flaws & Feats Picker: Shows 28P feats/flaws, not KSP ones
    In Equipment Picker: Shows 28P equipment, not KSP equipment

Root Cause: resolvedGameId in CharacterCreationFlow computes as:
TypeScript

const resolvedGameId = gameId || (mode === 'squad' ? squad.gameId : currentGameId || '28-psalms');

When gameId prop missing, it falls back to next condition. In squad mode, this should use squad's gameId, but without passing it explicitly, this chain fails.
Storage

    localStorage key: 'squad-builder-state'
    Includes currentGameId field
    Backward compatible: old key 'forbidden-psalm-state' ignored (not migrated)

Success Criteria

    ✅ Game selection works at app startup
    ✅ Switching games loads correct squads and presets
    ✅ 28P squads show 28P content
    ✅ KSP squads show KSP content
    ✅ Character creation uses correct game data
    ⚠️ NEEDS FIX: KSP character creation currently shows 28P content (gameId prop missing)
    ✅ Stat distributions correct per game
    ✅ Feats/Flaws correct per game
    ✅ Equipment correct per game
    ✅ Tech level hidden for KSP squads

Next Steps

    Add gameId prop to CharacterCreationFlow call in SquadBuilder.tsx line ~455
    Test KSP character creation pathway to verify correct game data displays
    Verify stat distributions (KSP uses Knowledge, 28P does not)
    Verify feats/flaws load from correct game dataset
    Verify equipment loads from correct game dataset

## **Feature: KSP Cybermods Selection**

### Overview
For Kill Sample Process (KSP) characters, users select cybermods during character creation. Cybermods are equipment-like augmentations with a CR cost that contribute to the augmentation allowance system. Selection occurs between Flaws & Feats and Equipment steps. Each selected cybermod can be marked as FLAWED via checkbox. The feature is skipped entirely for non-KSP games.

### Key Concepts
- **Cybermod Selection**: Multi-select UI between steps 2 and 3 of character creation
- **Skipped for Non-KSP**: CybermodPicker only renders when `gameId === 'kill-sample-process'`
- **Flawed State**: Each selected cybermod has a checkbox to mark it FLAWED (per game rules)
- **Stats-Box Display**: Like EquipmentPicker, displays current stats and costs
- **Allowance Integration**: Selected count tracked in augmentation allowance system
- **No Stat Modifiers**: Cybermods themselves don't modify primary stats; any abilities included in descriptions

### Data Structure

**Cybermod Data** (`src/types/cybermodsKSP.ts`):
```typescript
export interface CybermodData {
  id: string;           // Unique identifier (e.g., 'edward', 'wrist-mobility')
  number: number;       // Display number (1-12)
  name: string;
  cost: number;         // CR cost
  description: string;  // Full description including weapon stats if applicable
  canBeFlawed: boolean; // All KSP cybermods can be flawed
}

export interface SelectedCybermod {
  id: string;
  name: string;
  cost: number;
  isFlawed: boolean;    // Checkbox state
}
```
Full Cybermod List (12 cybermods):

    Edward — 250 creds — Arm-mounted Katana
    Wrist mounted mobility device — 300 creds — Grappling hook (1D6, Ranged 6, Agility)
    BM BIOCHIP — 200 creds — Reroll failed Guts tests
    Circuit Level Gateway — 300 creds — -3 to hacking attempts against
    Network uplink — 300 creds — Reroll failed Knowledge tests
    Heads Up Display — 200 creds — +1 shoot with Cyber weapons
    Lazer eye — 200 creds — 1D6 damage, Ranged 6, Presence
    Go Go Gadget — 200 creds — Ignore terrain < 4 inches
    Iron Lung — 300 creds — Ignore Gas and Smoke effects
    Hidden Carry — 100 creds + weapon cost — Install Ranged+Cyber weapon outside equipment slots
    Tazer Hands — 250 creds — Recharge by moving 3 inches
    Auto injector — 350 creds — First downed: Toughness test to heal 1D4

UI Components

CybermodPicker Component (src/components/CybermodPicker.tsx):

    Step position: Between Flaws & Feats (step 2) and Equipment (step 3)
    Header: "Select Cybermods"
    Stats Box Row (like EquipmentPicker):
        Primary stats + separator + Derived stats + separator + Cost box (CR)
        Displays current character stats and total cybermod cost
    Multiselect Grid:
        Card per cybermod
        Clickable to toggle selection (add/remove)
        Show cost for each cybermod
        Description text (shorter or tooltip)
        Flawed Checkbox: Each card shows checkbox "Mark as Flawed"
        Allowance Display: "X/Y cybermods selected" (e.g., "2/1 cybermods") during selection
        When full: remaining cards disabled or visual indication
    No Primary Action Buttons: Confirm via footer (CharacterCreationFlow handles step navigation)

CSS Styling (src/components/CybermodPicker.css):

    Card layout similar to EquipmentPicker
    Flawed checkbox positioned in card corner
    Cost prominently displayed
    Selected state: highlight border or background tint
    Disabled state when allowance full

Character Creation Flow Integration

CharacterCreationFlow.tsx Changes:

    New Step Type: Add 'cybermods' to CreationStep type
    Step Order: ['stats', 'flaws-feats', 'cybermods', 'equipment', 'review']
    Conditional Rendering: Only show cybermods step if gameId === 'kill-sample-process'
    State Management:
        Add selectedCybermods: SelectedCybermod[] state
        Track which cybermods are selected and their flawed status
    Navigation:
        From Flaws & Feats → advance to Cybermods (or Equipment if non-KSP)
        From Cybermods → advance to Equipment
        Back button returns to Flaws & Feats
    Augmentation Validation:
        canSave logic updated to require complete cybermods (if KSP)
        Check: cybermodCount >= cybermodAllowance (existing allowance system applies)

Step Header Update:

    Stats/Flaws/Cybermods/Equipment/Review indicators update
    Show "3. Cybermods" when in KSP mode

Data Flow

    User Enters Cybermods Step (KSP only):
        Stats and Flaws & Feats already selected
        CybermodPicker displays all 12 cybermods
        Allowance calculated: e.g., "Select 1-2 cybermods"

    User Selects Cybermod:
        Click cybermod card to toggle selection
        Add to selectedCybermods array
        Check flawed checkbox if applicable
        Stats-box shows updated total cost (sum of selected costs)

    User Marks as Flawed (Optional):
        For each selected cybermod, checkbox toggles isFlawed flag
        Stored in SelectedCybermod.isFlawed
        Displayed in Review step and saved character

    User Advances to Equipment:
        Selected cybermods passed to handleConfirmCybermods
        Advance to Equipment step
        Cybermod selection persists if user backs up

    User Reviews:
        Review step shows selected cybermods with flawed status
        Can back up to modify cybermods

    User Saves Character:
        Cybermods converted to strings for storage in character.cybermods[]
        Store as array of cybermod IDs + flawed status
        Example: character.cybermods = ['edward', 'network-uplink']
        Flawed status stored separately or in metadata

Files to Create

    src/types/cybermodsKSP.ts:
        CybermodData interface
        SelectedCybermod interface
        cybermodsKSP array with all 12 cybermods

    src/components/CybermodPicker.tsx:
        Multi-select cybermod picker component
        Props: gameId, selectedCybermods, onCybermodsChange, flawed state handlers
        Stats-box display (reuse existing stat-box styling)
        Allowance feedback

    src/components/CybermodPicker.css:
        Card grid layout
        Checkbox styling
        Selected/disabled states
        Stats-box styling

Files to Modify

    src/types/index.ts:
        Update Character interface to include cybermods?: SelectedCybermod[] field
        Update CharacterPreset similarly

    src/components/CharacterCreationFlow.tsx:
        Add 'cybermods' to step order for KSP
        Conditional render CybermodPicker when step is 'cybermods' and gameId === 'kill-sample-process'
        Add handlers: handleCybermodsChange, handleConfirmCybermods
        Update step navigation logic
        Skip cybermods step for 28 Psalms games

    src/components/CharacterCreationFlow.css:
        Update step indicator to show cybermods step (when applicable)

    src/utils/augmentationAllowances.ts:
        No changes: existing cybermod allowance tracking already works
        System already checks cybermodCount vs cybermodAllowance

Edge Cases

    Non-KSP Games: Entire cybermods step skipped; no UI shown
    All Cybermods Flawed: User marks all selections as flawed; all can be flawed (all canBeFlawed true)
    Allowance = 0: Cybermod grid disabled or hidden
    Back to Flaws & Feats: Cybermod selection persists
    Forward to Equipment: Cybermod selections maintained
    Review Step: Display selected cybermods with flawed indicators

Testing Scenarios

    KSP Game: Cybermods step visible between Flaws and Equipment
    Non-KSP Game: Cybermods step skipped entirely
    Select Cybermod: Click card, toggles selection
    Mark Flawed: Checkbox toggles, saved state
    Stats-Box Update: Cost updates as cybermods selected/deselected
    Allowance Feedback: "X/Y" indicator shows current selection vs allowance
    Full Allowance: Remaining cards disabled when limit reached
    Back Navigation: Selections persist returning from Equipment
    Save Character: Cybermods stored in character.cybermods array
    Display Flawed: Review and saved characters show flawed status

Behavioral Requirements

    ✅ Cybermods step only appears for KSP game
    ✅ Multi-select: user can select 0 to N cybermods (up to allowance)
    ✅ Each cybermod has flawed checkbox
    ✅ Stats-box displays current cost total
    ✅ Allowance tracker shows X/Y selection
    ✅ Step navigation includes cybermods in correct position
    ✅ Selections persist through back/forward navigation
    ✅ Flawed status persists and displays in Review

Success Criteria

✅ Cybermods step renders for KSP, skipped for 28 Psalms
✅ All 12 cybermods display with names, costs, descriptions
✅ Each cybermod can be toggled selected/unselected
✅ Selected cybermods show in Review and saved character
✅ Each cybermod has flawed checkbox
✅ Flawed status visible in Review and saved character
✅ Total CR cost displays in stats-box
✅ Allowance system prevents over-selection
✅ Step navigation works correctly
✅ Non-KSP games skip cybermods entirely



## **Feature: KSP Mutations Selection**

### Overview
For Kill Sample Process (KSP) characters, users select mutations during character creation. Mutations are genetic modifications that can permanently alter base stats (Strength, Agility, Intellect, Presence, Guts, Knowledge) and provide special abilities or effects. Selection occurs after Cybermods and before Equipment. Each selected mutation applies its stat modifications to the character's base stats. The feature is skipped entirely for non-KSP games (28 Psalms).

### Key Concepts
- **Mutation Selection**: Single or multi-select UI after Cybermods step
- **Skipped for Non-KSP**: MutationPicker only renders when `gameId === 'kill-sample-process'`
- **Stat Modifications**: Mutations modify base stats (not equipment-based modifiers)
- **Real-time Stat Updates**: Stats-box shows live updates as mutations are selected/deselected
- **Ability Descriptions**: Each mutation includes description of effects and stat changes
- **No CR Cost**: Mutations do not consume CR or augmentation allowance
- **Step Position**: Between Cybermods (step 3) and Equipment (step 4)

### Data Structure

**Mutation Data** (`src/types/mutationsKSP.ts`):
```typescript
export interface StatModifier {
  strength?: number;      // -2 to +2
  agility?: number;
  intellect?: number;
  presence?: number;
  guts?: number;
  knowledge?: number;
}

export interface MutationData {
  id: string;             // Unique identifier (e.g., 'adrenaline-surge', 'iron-skin')
  number: number;         // Display number
  name: string;
  description: string;    // Full description of effects and abilities
  statMods: StatModifier; // Base stat modifications
  canBeFlawed?: boolean;  // If applicable per game rules
}

export interface SelectedMutation {
  id: string;
  name: string;
  statMods: StatModifier;
  isFlawed?: boolean;     // If mutations can be flawed
}
```
Full Mutation List (12 mutations):

1. X-ray

    Effect: Crewmember can target models that are behind 1 inch or less thick terrain with ranged weapons.
    Drawback: -3 to attack models in line of sight.
    Stat Mods: -3 to ranged attacks against visible targets
    Trigger Type: Passive (always applies)

2. Xeno

    Effect: Blood is replaced with acid. Whenever crewmember takes damage, any model within 1 inch takes 1 damage that ignores armor.
    Drawback: Cannot be healed by Trauma Kits.
    Stat Mods: None (passive retaliation effect)
    Trigger Type: Reaction (when damage taken)

3. Thick Skull

    Effect: Immune to being Dazed and Stunned.
    Drawback: -1 Presence and -2 Knowledge.
    Stat Mods: -1 Presence, -2 Knowledge
    Trigger Type: Passive (status immunity)

4. Hairy Eyes

    Effect: Hair grows from the crewmember's eyes.
    Drawback: -1 to all Presence tests.
    Stat Mods: -1 Presence
    Trigger Type: Passive (appearance change, affects tests)

5. Croc

    Effect: Gains a bite attack (Strength, 1D6) and +1 Natural Armor that stacks with Armor.
    Drawback: Cannot use hacking Programmes.
    Stat Mods: None (grants natural armor + bite action)
    Trigger Type: Action (bite attack option in combat)

6. Mustela gulo

    Effect: Heals 1 damage per round. Gains a Claw Attack (Agility, 1D4).
    Drawback: All other crewmembers in same crew refuse to heal them as they are rude.
    Stat Mods: None (passive healing + claw action)
    Trigger Type: Passive (healing) + Action (claw attack)

7. Precog

    Effect: Sees the future and when targeted by an attack can move 6 inches in any direction. If this move moves them out of range the attack fails.
    Drawback: Whenever it uses this ability must make a Guts check. It starts to ponder free will vs predetermination.
    Stat Mods: None (reactive ability)
    Trigger Type: Reaction (when attacked, spend action + Guts test)

8. Telekinetic

    Effect: Can move an item or model 3 inches as an action.
    Drawback: Easier to shoot. Those targeting them gain +3 to ranged attacks. Their head grows in size!
    Stat Mods: +3 difficulty to shoot at (opponent gains +3 ranged attacks)
    Trigger Type: Action (move object/model)

9. Cat Eyes

    Effect: Ignores Darkness condition.
    Drawback: -6 to attack models with a torch.
    Stat Mods: -6 ranged/melee attacks against torch-wielding targets
    Trigger Type: Passive (vision immunity, accuracy penalty)

10. Boneitis

    Effect: Totally fine.
    Drawback: If crewmember ever Fumbles any Toughness test they are immediately killed.
    Stat Mods: None (hidden drawback: instant death on fumble)
    Trigger Type: Passive (deadly drawback condition)

11. Rejection

    Effect: Model is immune to Disease and Poisons.
    Drawback: All CyberMods are lost.
    Stat Mods: Removes all selected cybermods (CR cost recovered)
    Trigger Type: Permanent (disables cybermods if selected)

12. Mutable Form

    Effect: Ignores the effects of Critical hits dealt to them.
    Drawback: At the start of each Scenario roll a D6 and apply result:
            Strength and Presence are swapped.
            Agility and Knowledge are swapped.
            This Mutation is lost and roll a new Mutation.
            Gains the benefit of another random Mutation for this Scenario.
            Must pick one additional Mutation to gain the benefit and drawback of for this Scenario.
            Legs become gel-like and suffers -4 Agility this Scenario.
    Stat Mods: Variable (depends on D6 roll each scenario)
    Trigger Type: Passive (critical immunity) + Scenario start (random effect roll)


UI Components

MutationPicker Component (src/components/MutationPicker.tsx):

    Step position: After Cybermods (step 3), before Equipment (step 4)
    Header: "Select Mutations"
    Stats Box Row (showing real-time stat updates):
        Primary stats (STR, AGI, INT, PRE) + separator + Derived stats (GTS, KNW, derived calculations) + separator + Cost box (CR - displays N/A since mutations have no cost)
        Displays current character stats including mutation modifiers
        Shows base stats vs. modified stats if applicable
    Multiselect Grid:
        Card per mutation
        Clickable to toggle selection (add/remove)
        Display name and brief description
        Stat Mod Badge: Show stat changes on each card (e.g., "+2 AGI, +1 GTS")
        Flawed Checkbox (if applicable): Toggle "Mark as Flawed" per game rules
        Selection Feedback: Visual indication of selected mutations
    Real-time Stat Updates: Stats-box updates immediately when mutations selected/deselected

CSS Styling (src/components/MutationPicker.css):

    Card layout similar to CybermodPicker
    Stat mod badge prominently displayed (color-coded if positive/negative)
    Selected state: highlight border or background tint
    Stats-box styling (reuse from EquipmentPicker/CybermodPicker)
    Stat change indicators in stats-box (show base → modified)

Character Creation Flow Integration

CharacterCreationFlow.tsx Changes:

    New Step Type: Add 'mutations' to CreationStep type
    Step Order: ['stats', 'flaws-feats', 'cybermods', 'mutations', 'equipment', 'review']
    Conditional Rendering: Only show mutations step if gameId === 'kill-sample-process'
    State Management:
        Add selectedMutations: SelectedMutation[] state
        Track which mutations are selected and their flawed status (if applicable)
    Stat Calculation Integration:
        Update base stats calculation to include mutation modifiers
        Formula: finalStat = baseStat + equipmentMods + mutationMods + flawMods
        Stats-box reflects mutations in real-time
    Navigation:
        From Cybermods → advance to Mutations (or Equipment if non-KSP)
        From Mutations → advance to Equipment
        Back button returns to Cybermods
    Validation:
        No allowance limit on mutations (unlimited selection unless game rules specify otherwise)
        All mutations can coexist
        Stat modifications stack (e.g., selecting 2 mutations with +1 Strength each = +2 total)

Step Header Update:

    Stats/Flaws/Cybermods/Mutations/Equipment/Review indicators update
    Show "4. Mutations" when in KSP mode

Data Flow

    User Enters Mutations Step (KSP only):
        Stats, Flaws & Feats, and Cybermods already selected
        MutationPicker displays all available mutations
        Stats-box shows current stats (with cybermod/equipment mods but before mutations)

    User Selects Mutation:
        Click mutation card to toggle selection
        Add to selectedMutations array
        Stats-box immediately updates to show new base stats with mutation mods applied
        All derived stats (ARMOR, MELEE, SHOOT, etc.) recalculate
        Display shows "+2 STR" type badges on card

    User Marks as Flawed (If Applicable):
        For each selected mutation, checkbox toggles isFlawed flag (if mutations can be flawed)
        Stored in SelectedMutation.isFlawed
        Displayed in Review step and saved character

    User Advances to Equipment:
        Selected mutations passed to handleConfirmMutations
        Base stats now include mutation modifiers
        Advance to Equipment step
        Mutation selection persists if user backs up

    User Modifies Equipment:
        Equipment modifiers stack on top of base stats (which now include mutations)
        Stats-box reflects combined: base + mutations + equipment mods
        Example: STR 6 (base) + 1 (mutation) + 1 (equipment) = 8 final

    User Reviews:
        Review step shows selected mutations with stat modifications
        Shows final stats reflecting all modifiers (mutations + equipment)
        Can back up to modify mutations

    User Saves Character:
        Mutations converted to array for storage in character.mutations[]
        Store as array of mutation IDs
        Example: character.mutations = ['adrenaline-surge', 'iron-skin']
        Flawed status stored separately if applicable
        Character object includes final stats (all modifiers applied)

Files to Create

    src/types/mutationsKSP.ts:
        StatModifier interface
        MutationData interface
        SelectedMutation interface
        mutationsKSP array with all mutations (to be defined)

    src/components/MutationPicker.tsx:
        Multi-select mutation picker component
        Props: gameId, selectedMutations, onMutationsChange, currentStats, flawed state handlers
        Stats-box display with real-time updates (reuse existing stat-box styling)
        Stat mod badges on each mutation card
        Real-time stat calculation integration

    src/components/MutationPicker.css:
        Card grid layout
        Stat mod badge styling (color-coded for clarity)
        Checkbox styling (if mutations can be flawed)
        Selected/disabled states
        Stats-box styling with stat change indicators

Files to Modify

    src/types/index.ts:
        Update Character interface to include mutations?: SelectedMutation[] field
        Update CharacterPreset similarly
        Ensure stat calculation includes mutation modifiers

    src/components/CharacterCreationFlow.tsx:
        Add 'mutations' to step order for KSP
        Conditional render MutationPicker when step is 'mutations' and gameId === 'kill-sample-process'
        Add handlers: handleMutationsChange, handleConfirmMutations
        Update stat calculation: Include mutation modifiers in base stats
        Update step navigation logic
        Skip mutations step for 28 Psalms games
        Pass currentStats prop to MutationPicker for display

    src/components/CharacterCreationFlow.css:
        Update step indicator to show mutations step (when applicable)

    src/utils/statCalculations.ts (or similar):
        Add applyMutationMods(baseStats, mutations) function
        Integration point: mutations modify base stats before equipment mods are applied
        Ensure derived stats recalculate with new base values

Stat Modification Rules

    Base Stat Range: 1-10 (before mutations)
    Mutation Range: -2 to +2 per mutation per stat
    Multiple Mutations: Modifiers stack (e.g., +1 STR + +1 STR = +2 STR)
    Maximum Cap: Enforce any game rules about stat caps (if applicable)
    Derived Stats: Recalculate ARMOR, MELEE, SHOOT, HACK, DODGE, THROW based on new base stats
    Equipment Mods: Applied after mutations (mutations modify base, equipment modifies the result)

Edge Cases

    Non-KSP Games: Entire mutations step skipped; no UI shown
    No Mutations Selected: Valid state; user can proceed with unmodified base stats
    Multiple Mutations Selected: All stat modifiers apply and stack
    Stat Overflow: If mutations push stat above cap, enforce cap or display warning
    Back to Cybermods: Mutation selection persists
    Forward to Equipment: Mutation selections maintained; base stats now include mods
    Equipment + Mutations: Stats stack correctly (equipment mods apply to mutation-modified base)
    Review Step: Display selected mutations with stat changes and final stats

Testing Scenarios

    KSP Game: Mutations step visible after Cybermods, before Equipment
    Non-KSP Game: Mutations step skipped entirely
    Select Mutation: Click card, toggles selection
    Stat Update: Stats-box immediately reflects mutation stat mods
    Multiple Mutations: Select 2+ mutations, stats stack correctly
    Equipment Stacking: Add equipment, ensure stats combine (base + mutations + equipment)
    Derived Stats: ARMOR, MELEE, SHOOT, etc. recalculate with mutation mods
    Mark Flawed (if applicable): Checkbox toggles, saved state
    Back Navigation: Selections persist returning from Equipment
    Save Character: Mutations stored in character.mutations array
    Review Display: Shows selected mutations and final stats with all mods

Behavioral Requirements

    ✅ Mutations step only appears for KSP game
    ✅ Multi-select: user can select 0 to N mutations (unlimited or per game rules)
    ✅ Each mutation displays name, description, and stat changes
    ✅ Stats-box updates in real-time as mutations selected/deselected
    ✅ Derived stats recalculate with mutation modifiers
    ✅ Selected mutations show in Review and saved character
    ✅ Mutations can be flawed (if applicable per game rules)
    ✅ Stat modifiers stack across multiple mutations
    ✅ Equipment mods apply on top of mutation-modified base stats
    ✅ Step navigation includes mutations in correct position

Success Criteria

✅ Mutations step renders for KSP, skipped for 28 Psalms
✅ All mutations display with names, descriptions, and stat mods
✅ Each mutation can be toggled selected/unselected
✅ Selected mutations show in Review and saved character
✅ Stat-box updates in real-time as mutations selected
✅ Derived stats recalculate with mutation modifiers
✅ Mutations stack correctly (multiple mutations' stat mods combine)
✅ Equipment mods apply on top of mutation-modified base stats
✅ Final stats reflect all modifiers (mutations + equipment + flaws)
✅ Step navigation works correctly
��� Non-KSP games skip mutations entirely
Dependencies

    Requires existing stat calculation system in CharacterCreationFlow
    Depends on equipment modifier system to ensure proper stacking (mutations before equipment)
    Requires stat-box display component from CybermodPicker/EquipmentPicker for reuse



## KSP Weapons System

### Overview
KSP weapons differ from 28 Psalms in several key ways:
- **No tech levels** — all weapons are available at any tech level
- **Handedness matters** — weapons are 1-handed (1 slot) or 2-handed (2 slots)
- **Damage format** — typically DX notation ("D6", "D8"), special cases: "-" for non-lethal, "∞" for game-ending effects
- **Special rules** — stored as string array, kept exactly as written ("Ranged 6", "Reload", etc.)
- **Stat modifiers** — each weapon modifies a specific stat (Strength, Agility, Presence, Knowledge, Toughness, GTS)

### Weapon Categories
1. **One-Handed Ranged** (4 weapons) ✅
2. **One-Handed Melee** (~5-7 weapons) — *Pending*
3. **Two-Handed Ranged** (~5-7 weapons) — *Pending*
4. **Two-Handed Melee** (~5-7 weapons) — *Pending*
5. **Consumables** (8 items) — *Pending*

### Weapon Interface

```typescript
export interface Weapon extends BaseEquipment {
  category: 'weapon';
  damage: string; // "D6", "D8", "D10", "-", "∞"
  modifier: StatName; // stat this weapon modifies
  specialRules: string[]; // e.g., ["Ranged", "Reload 5", "Cyber"]
  slots: number; // 1 or 2 (one-handed vs two-handed)
  isTwoHanded: boolean; // true if 2 slots
  isRanged?: boolean; // Inferred from "Ranged" in specialRules
  // NO techLevel in KSP
}
```

### Implementation Notes

- **Handedness Determination:** Section headers in source data indicate handedness (e.g., "One-Handed Ranged")
  - One-handed → `slots: 1`, `isTwoHanded: false`
  - Two-handed → `slots: 2`, `isTwoHanded: true`

- **Ranged Detection:** Set `isRanged: true` if:
  - "Ranged" keyword in specialRules, OR
  - "Reload" keyword in specialRules (indicates ammo-based weapon)
  - Melee weapons will have `isRanged: false`

- **Special Rules Preservation:** Keep special rules exactly as written:
  - "Reload 5", "Reload 6", "Reload" (not translated)
  - "Ranged 6" (range + ranged in one rule)
  - "Cyber" keyword preserved

- **Damage Values:**
  - Standard: "D6", "D8", "D10", "D12", "D20"
  - Special: "-" (non-lethal, usually paired with Tazer)
  - Extreme: "∞" (ΑΩ Bomb — destroys world)

- **Cost Offset for Ammo:** Future enhancement
  - Each ranged weapon should offset cost of 1 stack of ammo
  - Implementation deferred until ammo system is finalized

### Data Organization

```typescript
// src/types/equipmentKSP.ts

// Organized by category and handedness
export const weaponsKSP1HandedRanged: Weapon[] = [ ... ];
export const weaponsKSP1HandedMelee: Weapon[] = [ ... ];
export const weaponsKSP2HandedRanged: Weapon[] = [ ... ];
export const weaponsKSP2HandedMelee: Weapon[] = [ ... ];

// Consolidated export for game config
export const allWeaponsKSP = [
  ...weaponsKSP1HandedRanged,
  ...weaponsKSP1HandedMelee,
  ...weaponsKSP2HandedRanged,
  ...weaponsKSP2HandedMelee,
];
```

### Future Work

- [ ] Add remaining melee and two-handed weapons
- [ ] Create ammo system (see Ammo section)
- [ ] Implement ammo cost offset for ranged weapons
- [ ] Add weapon attachment logic for drones (Military Drone can equip any weapon)
- [ ] EquipmentPicker validation: prevent 2-handed weapons if insufficient slots
