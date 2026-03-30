import { describe, it, expect } from 'vitest';
import {
  calculateAugmentationAllowances,
  calculateAugmentationSelection,
  KSP_BASE_ALLOWANCES,
} from './augmentationAllowances';
import { Flaw, Feat } from '../types';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeFlaw(type: string): Flaw {
  return { type: type as Flaw['type'], description: '' };
}

function makeFeat(type: string): Feat {
  return { type: type as Feat['type'], description: '' };
}

// ── calculateAugmentationAllowances ─────────────────────────────────────────

describe('calculateAugmentationAllowances', () => {
  it('returns base allowances when no flaws or feats modify them', () => {
    const result = calculateAugmentationAllowances(makeFlaw('ghost'), makeFeat('marine'));
    expect(result).toEqual(KSP_BASE_ALLOWANCES);
  });

  it('reduces feat allowance by 1 when "perfect" flaw is selected', () => {
    const result = calculateAugmentationAllowances(makeFlaw('perfect'), makeFeat('marine'));
    expect(result.feats).toBe(0);
    expect(result.flaws).toBe(1);
    expect(result.cybermods).toBe(1);
    expect(result.mutations).toBe(1);
  });

  it('does not reduce feat allowance below 0 for "perfect"', () => {
    const result = calculateAugmentationAllowances(makeFlaw('perfect'), null);
    expect(result.feats).toBe(0);
  });

  it('adds 1 mutation for any "mutant-*" flaw variant', () => {
    const variants = [
      'mutant-agility',
      'mutant-presence',
      'mutant-strength',
      'mutant-toughness',
      'mutant-knowledge',
    ];
    for (const variant of variants) {
      const result = calculateAugmentationAllowances(makeFlaw(variant), null);
      expect(result.mutations).toBe(2);
    }
  });

  it('adds 2 cybermods for "priest-of-tech" feat', () => {
    const result = calculateAugmentationAllowances(null, makeFeat('priest-of-tech'));
    expect(result.cybermods).toBe(3);
    expect(result.mutations).toBe(1); // unaffected
  });

  it('adds 1 mutation for "x-person" feat', () => {
    const result = calculateAugmentationAllowances(null, makeFeat('x-person'));
    expect(result.mutations).toBe(2);
    expect(result.cybermods).toBe(1); // unaffected
  });

  it('stacks mutant flaw and x-person feat for +2 mutations total', () => {
    const result = calculateAugmentationAllowances(
      makeFlaw('mutant-agility'),
      makeFeat('x-person'),
    );
    expect(result.mutations).toBe(3); // base 1 + mutant +1 + x-person +1
  });

  it('stacks modifiers from additionalFlaws and additionalFeats', () => {
    const result = calculateAugmentationAllowances(
      makeFlaw('ghost'),
      makeFeat('marine'),
      [makeFlaw('perfect')],
      [makeFeat('x-person')],
    );
    expect(result.feats).toBe(0); // perfect in additionalFlaws
    expect(result.mutations).toBe(2); // x-person in additionalFeats
  });
});

// ── calculateAugmentationSelection ──────────────────────────────────────────

describe('calculateAugmentationSelection — non-KSP game', () => {
  it('returns zeroed-out result for 28-psalms', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('marine'),
      [],
      [],
      0,
      0,
      '28-psalms',
    );
    expect(result.isComplete).toBe(true);
    expect(result.feats.allowed).toBe(0);
    expect(result.incompleteItems).toHaveLength(0);
  });
});

describe('calculateAugmentationSelection — KSP', () => {
  const KSP = 'kill-sample-process';

  it('is incomplete when nothing is selected', () => {
    const result = calculateAugmentationSelection(null, null, [], [], 0, 0, KSP);
    expect(result.isComplete).toBe(false);
    expect(result.incompleteItems.some((i) => i.type === 'feats')).toBe(true);
    expect(result.incompleteItems.some((i) => i.type === 'flaws')).toBe(true);
    // Both cybermod and mutation limits are 1 with nothing selected
    expect(result.incompleteItems.some((i) => i.type === 'cybermods')).toBe(true);
    expect(result.incompleteItems.some((i) => i.type === 'mutations')).toBe(true);
  });

  it('is complete when primary flaw, feat, and one cybermod are selected', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('marine'),
      [],
      [],
      1, // one cybermod
      0,
      KSP,
    );
    // With 1 cybermod: mutation limit = 1 - 1 = 0, so mutations are full
    expect(result.cybermods).toEqual({ selected: 1, allowed: 1, isFull: true });
    expect(result.mutations).toEqual({ selected: 0, allowed: 0, isFull: true });
    expect(result.isComplete).toBe(true);
  });

  it('is complete when primary flaw, feat, and one mutation are selected', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('marine'),
      [],
      [],
      0,
      1, // one mutation
      KSP,
    );
    // With 1 mutation: cybermod limit = 1 - 1 = 0, so cybermods are full
    expect(result.mutations).toEqual({ selected: 1, allowed: 1, isFull: true });
    expect(result.cybermods).toEqual({ selected: 0, allowed: 0, isFull: true });
    expect(result.isComplete).toBe(true);
  });

  it('"perfect" flaw gives 0 feat allowance — complete without feat', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('perfect'),
      null, // no feat required
      [],
      [],
      1,
      0,
      KSP,
    );
    expect(result.feats.allowed).toBe(0);
    expect(result.feats.isFull).toBe(true);
    expect(result.isComplete).toBe(true);
  });

  it('"priest-of-tech" feat allows up to 3 cybermods', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('priest-of-tech'),
      [],
      [],
      3, // three cybermods
      0,
      KSP,
    );
    expect(result.cybermods).toEqual({ selected: 3, allowed: 3, isFull: true });
    // 3 cybermods → mutation limit = 1 - 3 = 0
    expect(result.mutations).toEqual({ selected: 0, allowed: 0, isFull: true });
    expect(result.isComplete).toBe(true);
  });

  it('"mutant" flaw + "x-person" feat allows 3 mutations', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('mutant-agility'),
      makeFeat('x-person'),
      [],
      [],
      0,
      3, // three mutations
      KSP,
    );
    // mutations allowed = 1(base) + 1(mutant) + 1(x-person) = 3
    // with 3 mutations, cybermod limit = 1 - 3 = 0
    expect(result.mutations).toEqual({ selected: 3, allowed: 3, isFull: true });
    expect(result.cybermods).toEqual({ selected: 0, allowed: 0, isFull: true });
    expect(result.isComplete).toBe(true);
  });

  it('reports over-limit when selected exceeds allowed', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('marine'),
      [],
      [],
      2, // 2 cybermods, allowed = 1 - (mutation>0? 0 : 0) = 1
      0,
      KSP,
    );
    expect(result.cybermods.selected).toBe(2);
    expect(result.cybermods.allowed).toBe(1);
    // isFull is selected >= allowed, so still true
    expect(result.cybermods.isFull).toBe(true);
    // Over-limit is now treated as incomplete (not just under-limit)
    expect(result.incompleteItems.some((i) => i.type === 'cybermods')).toBe(true);
    expect(result.isComplete).toBe(false);
  });

  it('Rejection mutation reduces cybermod allowance by 1', () => {
    // Base: 1 cybermod allowed, 1 mutation allowed
    // Select 1 mutation (Rejection) → cybermod trade-off: 1 - 1 = 0, then Rejection -1 → 0 (clamped)
    // But first, 0 mutations selected (we pass mutationCount=0, just mutationIds=['rejection'])
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('marine'),
      [],
      [],
      0, // no cybermods selected
      1, // 1 mutation selected (Rejection)
      KSP,
      ['rejection'],
    );
    // With 1 mutation: base cybermod allowance = 1, trade-off -1 = 0, Rejection -1 → 0 (clamped)
    expect(result.cybermods.allowed).toBe(0);
    expect(result.cybermods.isFull).toBe(true);
    expect(result.mutations.selected).toBe(1);
    expect(result.mutations.allowed).toBe(1);
    expect(result.isComplete).toBe(true);
  });

  it('Rejection with Priest of Tech: reduces cybermod allowance from 3 toward 0', () => {
    // Priest of Tech gives +2 cybermods → base=3
    // With 1 mutation: trade-off -1 = 2, Rejection -1 = 1 remaining
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('priest-of-tech'),
      [],
      [],
      1, // 1 cybermod selected
      1, // 1 mutation selected (Rejection)
      KSP,
      ['rejection'],
    );
    // cybermods base=3, trade-off -1 (mutation selected) = 2, Rejection -1 = 1
    expect(result.cybermods.allowed).toBe(1);
    expect(result.cybermods.selected).toBe(1);
    expect(result.cybermods.isFull).toBe(true);
    // mutations: base=1, trade-off -1 (cybermod selected) = 0, but we have 1 selected → over-limit? 
    // Actually: mutationAllowed = max(0, 1 - 1(cybermods)) = 0, but we have 1 mutation → over-limit
    // This case tests the interaction: with cybermods AND mutations both selected
    expect(result.mutations.selected).toBe(1);
    expect(result.mutations.allowed).toBe(0);
    expect(result.isComplete).toBe(false); // mutations over-limit
  });

  it('non-Rejection mutation does not reduce cybermod allowance', () => {
    const result = calculateAugmentationSelection(
      makeFlaw('ghost'),
      makeFeat('marine'),
      [],
      [],
      0,
      1, // 1 mutation (not Rejection)
      KSP,
      ['thick-skull'], // has stat mods but reducesCybermods is not set
    );
    // With 1 mutation: trade-off only — cybermod allowance = 1 - 1 = 0
    // No Rejection penalty on top
    expect(result.cybermods.allowed).toBe(0);
    expect(result.mutations.allowed).toBe(1);
    expect(result.isComplete).toBe(true);
  });
});
