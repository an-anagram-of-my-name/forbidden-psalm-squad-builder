/**
 * Augmentation allowance and selection types for Kill Sample Process (KSP).
 *
 * KSP characters can have multiple feats, flaws, CyberMods, and Mutations,
 * each governed by dynamic limits that depend on other selections.
 */

/**
 * AugmentationAllowance: How many of each augmentation type a character is
 * allowed to have.
 *
 * Base limits (KSP):
 *   - 1 feat, 1 flaw, 1 cybermod, 1 mutation
 *
 * Modifiers:
 *   - Flaw #10 (Perfect):         −1 feat allowance
 *   - Flaw #18 (Mutant, any):     +1 mutation allowance
 *   - Feat #3  (Priest of Tech):  +2 cybermod allowance
 *   - Feat #16 (X-Person):        +1 mutation allowance
 *
 * Trade-off (applied after modifiers):
 *   - If cybermods selected > 0:  mutation allowance −= cybermod count
 *   - If mutations selected > 0:  cybermod allowance −= mutation count
 */
export interface AugmentationAllowance {
  feats: number;
  flaws: number;
  cybermods: number;
  mutations: number;
}

/**
 * AugmentationItem: Current state of one augmentation type.
 */
export interface AugmentationItem {
  /** How many the character currently has selected. */
  selected: number;
  /** How many they are allowed to have. */
  allowed: number;
  /** True when selected >= allowed. */
  isFull: boolean;
}

/**
 * AugmentationDeficiency: A single incomplete augmentation entry.
 */
export type AugmentationDeficiency =
  | { type: 'feats'; selected: number; allowed: number }
  | { type: 'flaws'; selected: number; allowed: number }
  | { type: 'cybermods'; selected: number; allowed: number }
  | { type: 'mutations'; selected: number; allowed: number };

/**
 * AugmentationSelection: Complete state of all augmentations for a character.
 */
export interface AugmentationSelection {
  feats: AugmentationItem;
  flaws: AugmentationItem;
  cybermods: AugmentationItem;
  mutations: AugmentationItem;
  /** True when every augmentation type is at its allowed maximum. */
  isComplete: boolean;
  /** List of augmentation types that still need to be filled. */
  incompleteItems: AugmentationDeficiency[];
}
