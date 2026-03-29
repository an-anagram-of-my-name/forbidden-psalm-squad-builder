import { Flaw, Feat } from '../types';
import { AugmentationAllowance, AugmentationSelection, AugmentationDeficiency } from '../types/augmentations';

/**
 * Base KSP augmentation allowances before any modifier is applied.
 */
export const KSP_BASE_ALLOWANCES: AugmentationAllowance = {
  feats: 1,
  flaws: 1,
  cybermods: 1,
  mutations: 1,
};

/**
 * Calculate the augmentation allowances for a KSP character based on their
 * selected flaws and feats.
 *
 * Rules:
 *   - Flaw #10 (Perfect):         −1 feat allowance
 *   - Flaw #18 (Mutant, any variant, groupId 'mutant'): +1 mutation allowance
 *   - Feat #3  (Priest of Tech):  +2 cybermod allowance
 *   - Feat #16 (X-Person):        +1 mutation allowance
 */
export function calculateAugmentationAllowances(
  primaryFlaw: Flaw | null,
  primaryFeat: Feat | null,
  additionalFlaws: Flaw[] = [],
  additionalFeats: Feat[] = [],
): AugmentationAllowance {
  const allowances = { ...KSP_BASE_ALLOWANCES };

  const allFlaws = primaryFlaw ? [primaryFlaw, ...additionalFlaws] : [...additionalFlaws];
  const allFeats = primaryFeat ? [primaryFeat, ...additionalFeats] : [...additionalFeats];

  // Flaw #10 (Perfect): −1 feat allowance
  if (allFlaws.some((f) => f.type === 'perfect')) {
    allowances.feats = Math.max(0, allowances.feats - 1);
  }

  // Flaw #18 (Mutant, any variant): +1 mutation allowance
  if (allFlaws.some((f) => f.type.startsWith('mutant-'))) {
    allowances.mutations += 1;
  }

  // Feat #3 (Priest of Tech): +2 cybermod allowance
  if (allFeats.some((f) => f.type === 'priest-of-tech')) {
    allowances.cybermods += 2;
  }

  // Feat #16 (X-Person): +1 mutation allowance
  if (allFeats.some((f) => f.type === 'x-person')) {
    allowances.mutations += 1;
  }

  return allowances;
}

/**
 * Calculate the complete augmentation selection state for a KSP character.
 *
 * Applies the cybermod/mutation trade-off:
 *   - If cybermods selected > 0: mutation allowance is reduced by cybermod count
 *   - If mutations selected > 0: cybermod allowance is reduced by mutation count
 *
 * Returns a zeroed-out, non-KSP result for any game other than
 * 'kill-sample-process'.
 */
export function calculateAugmentationSelection(
  primaryFlaw: Flaw | null,
  primaryFeat: Feat | null,
  additionalFlaws: Flaw[] | undefined,
  additionalFeats: Feat[] | undefined,
  cybermodCount: number,
  mutationCount: number,
  gameId: string,
): AugmentationSelection {
  // Only applies to KSP
  if (gameId !== 'kill-sample-process') {
    return {
      feats: { selected: 0, allowed: 0, isFull: false },
      flaws: { selected: 0, allowed: 0, isFull: false },
      cybermods: { selected: 0, allowed: 0, isFull: false },
      mutations: { selected: 0, allowed: 0, isFull: false },
      isComplete: false,
      incompleteItems: [],
    };
  }

  const allowances = calculateAugmentationAllowances(
    primaryFlaw,
    primaryFeat,
    additionalFlaws ?? [],
    additionalFeats ?? [],
  );

  // Apply cybermod/mutation trade-off
  let cybermodAllowed = Math.max(
    0,
    allowances.cybermods - (mutationCount > 0 ? mutationCount : 0),
  );
  let mutationAllowed = Math.max(
    0,
    allowances.mutations - (cybermodCount > 0 ? cybermodCount : 0),
  );

  // Count current selections
  const featCount = (primaryFeat ? 1 : 0) + (additionalFeats?.length ?? 0);
  const flawCount = (primaryFlaw ? 1 : 0) + (additionalFlaws?.length ?? 0);

  const selection: AugmentationSelection = {
    feats: {
      selected: featCount,
      allowed: allowances.feats,
      isFull: featCount >= allowances.feats,
    },
    flaws: {
      selected: flawCount,
      allowed: allowances.flaws,
      isFull: flawCount >= allowances.flaws,
    },
    cybermods: {
      selected: cybermodCount,
      allowed: cybermodAllowed,
      isFull: cybermodCount >= cybermodAllowed,
    },
    mutations: {
      selected: mutationCount,
      allowed: mutationAllowed,
      isFull: mutationCount >= mutationAllowed,
    },
    isComplete: false,
    incompleteItems: [],
  };

  // Identify deficiencies
  const incompleteItems: AugmentationDeficiency[] = [];

  if (selection.feats.selected < selection.feats.allowed) {
    incompleteItems.push({
      type: 'feats',
      selected: selection.feats.selected,
      allowed: selection.feats.allowed,
    });
  }
  if (selection.flaws.selected < selection.flaws.allowed) {
    incompleteItems.push({
      type: 'flaws',
      selected: selection.flaws.selected,
      allowed: selection.flaws.allowed,
    });
  }
  if (selection.cybermods.selected < selection.cybermods.allowed) {
    incompleteItems.push({
      type: 'cybermods',
      selected: selection.cybermods.selected,
      allowed: selection.cybermods.allowed,
    });
  }
  if (selection.mutations.selected < selection.mutations.allowed) {
    incompleteItems.push({
      type: 'mutations',
      selected: selection.mutations.selected,
      allowed: selection.mutations.allowed,
    });
  }

  selection.isComplete = incompleteItems.length === 0;
  selection.incompleteItems = incompleteItems;

  return selection;
}
