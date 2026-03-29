import { AugmentationSelection, AugmentationItem } from '../types/augmentations';
import './AugmentationAllowanceBox.css';

export interface AugmentationAllowanceBoxProps {
  selection: AugmentationSelection;
  isKSP: boolean;
  variant?: 'compact' | 'detailed';
}

export function AugmentationAllowanceBox({
  selection,
  isKSP,
  variant = 'compact',
}: AugmentationAllowanceBoxProps) {
  if (!isKSP) return null;

  return (
    <div className={`augmentation-allowance-box ${variant}`}>
      <div className="box-header">
        <h4>Augmentations</h4>
      </div>

      <div className="allowances-grid">
        <AllowanceItem type="feats" label="Feats" item={selection.feats} variant={variant} />
        <AllowanceItem type="flaws" label="Flaws" item={selection.flaws} variant={variant} />
        <AllowanceItem
          type="cybermods"
          label="CyberMods"
          item={selection.cybermods}
          variant={variant}
        />
        <AllowanceItem
          type="mutations"
          label="Mutations"
          item={selection.mutations}
          variant={variant}
        />
      </div>

      {!selection.isComplete && (
        <div className="incomplete-indicator">
          <span className="warning-icon" aria-hidden="true">⚠️</span>
          <span className="incomplete-text">
            {selection.incompleteItems.length} augmentation(s) incomplete
          </span>
        </div>
      )}
    </div>
  );
}

interface AllowanceItemProps {
  type: 'feats' | 'flaws' | 'cybermods' | 'mutations';
  label: string;
  item: AugmentationItem;
  variant: 'compact' | 'detailed';
}

function AllowanceItem({ type, label, item, variant }: AllowanceItemProps) {
  const isOver = item.selected > item.allowed;
  const isFull = item.isFull;

  return (
    <div
      className={`allowance-item ${type} ${isOver ? 'over-limit' : ''} ${
        isFull ? 'full' : 'incomplete'
      }`}
    >
      {variant === 'compact' ? (
        <>
          <span className="label">{label}</span>
          <span className={`count ${isOver ? 'error' : ''}`}>
            {item.selected}/{item.allowed}
          </span>
        </>
      ) : (
        <>
          <span className="label">{label}</span>
          <div className="progress-bar-container">
            <progress
              value={item.selected}
              max={item.allowed}
              className={isOver ? 'over' : ''}
            />
          </div>
          <span className={`count ${isOver ? 'error' : ''}`}>
            {item.selected}/{item.allowed}
          </span>
          {isOver && (
            <span className="over-message">+{item.selected - item.allowed} over</span>
          )}
        </>
      )}
    </div>
  );
}

export default AugmentationAllowanceBox;
