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
