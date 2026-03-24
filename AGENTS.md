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
