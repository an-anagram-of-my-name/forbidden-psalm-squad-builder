import React, { useState, useMemo } from 'react';
import { Character, Equipment, Item, Ammo, Armor, Weapon } from '../types';
import { items28Psalms, ammo28Psalms, armor28Psalms, pastTechWeapons28Psalms, futureTechWeapons28Psalms } from '../types/equipment28Psalms';
import { canUseArmor } from '../utils/equipment';
import './EquipmentPicker.css';

interface EquipmentPickerProps {
  character: Character;
  onEquipmentSelected: (equipment: Equipment[]) => void;
}

type EquipmentTab = 'weapons' | 'armor' | 'items' | 'ammo';

const EquipmentPicker: React.FC<EquipmentPickerProps> = ({ character, onEquipmentSelected }) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(character.equipment || []);
  const [activeTab, setActiveTab] = useState<EquipmentTab>('weapons');

  // Calculate total slots used
  const slotsUsed = useMemo(() => {
    return selectedEquipment.reduce((total, eq) => total + eq.slots, 0);
  }, [selectedEquipment]);

  // Calculate slot capacity: 5 + Strength modifier
  const slotCapacity = useMemo(() => {
    return 5 + character.stats.strength;
  }, [character.stats.strength]);

  const remainingSlots = slotCapacity - slotsUsed;

  // Filter equipment by tech level compatibility
  const canEquipTech = (equipTechLevel: string | null | undefined): boolean => {
    if (equipTechLevel === null || equipTechLevel === undefined) {
      return true; // Tech-agnostic equipment can always be equipped
    }
    if (character.techLevel === 'future-tech') {
      return true; // Future-tech characters can use anything
    }
    // Past-tech characters can only use past-tech equipment
    return equipTechLevel === 'past-tech';
  };

  // Get all available weapons (past-tech + future-tech if compatible)
  const availableWeapons = useMemo(() => {
    const allWeapons = [...pastTechWeapons28Psalms, ...futureTechWeapons28Psalms];
    return allWeapons.filter((weapon) => canEquipTech(weapon.techLevel));
  }, [character.techLevel]);

  // Get all available armor (all are tech-agnostic)
  const availableArmor = useMemo(() => {
    return armor28Psalms.filter((armor) => canEquipTech(armor.techLevel));
  }, [character.techLevel]);

  // Get all available items
  const availableItems = useMemo(() => {
    return items28Psalms.filter((item) => canEquipTech(item.techLevel));
  }, [character.techLevel]);

  // Get all available ammo
  const availableAmmo = useMemo(() => {
    return ammo28Psalms.filter((ammo) => canEquipTech(ammo.techLevel));
  }, [character.techLevel]);

  const handleEquipmentToggle = (equipment: Equipment) => {
    const isSelected = selectedEquipment.some((eq) => eq.id === equipment.id);

    if (isSelected) {
      setSelectedEquipment(selectedEquipment.filter((eq) => eq.id !== equipment.id));
    } else {
      // Check if adding this equipment would exceed slot capacity
      if (slotsUsed + equipment.slots <= slotCapacity) {
        setSelectedEquipment([...selectedEquipment, equipment]);
      }
    }
  };

  const handleConfirm = () => {
    onEquipmentSelected(selectedEquipment);
  };

  const handleClear = () => {
    setSelectedEquipment([]);
  };

  const isEquipmentSelected = (equipment: Equipment) => {
    return selectedEquipment.some((eq) => eq.id === equipment.id);
  };

  const isArmorSelected = useMemo(() => {
    return selectedEquipment.some((eq) => eq.category === 'armor');
  }, [selectedEquipment]);

  const canAddMore = remainingSlots > 0;

  const renderEquipmentCard = (equipment: Equipment) => {
    const isSelected = isEquipmentSelected(equipment);

    let canAdd: boolean;
    let strengthFails = false;

    if (equipment.category === 'armor') {
      const requiredStr = (equipment as Armor).requiredStrength;
      strengthFails = requiredStr !== undefined && !canUseArmor(character.stats.strength, requiredStr);
      const blockedByOtherArmor = isArmorSelected && !isSelected;
      canAdd = !strengthFails && !blockedByOtherArmor;
    } else {
      canAdd = canAddMore || isSelected;
    }

    return (
      <div
        key={equipment.id}
        className={`equipment-card ${isSelected ? 'selected' : ''} ${!canAdd ? 'disabled' : ''}`}
        onClick={() => {
          if (canAdd || isSelected) {
            handleEquipmentToggle(equipment);
          }
        }}
      >
        <div className="equipment-header">
          <div className="equipment-name">{equipment.name}</div>
          <div className="equipment-cost">{equipment.cost} cr</div>
        </div>

        <div className="equipment-details">
          {equipment.category === 'weapon' && (
            <>
              <div className="detail">Damage: {(equipment as Weapon).damage}</div>
              <div className="detail">Modifier: {(equipment as Weapon).modifier}</div>
              <div className="detail">Slots: {equipment.slots}</div>
              {(equipment as Weapon).specialRules.length > 0 && (
                <div className="detail special-rules">
                  {(equipment as Weapon).specialRules.join(', ')}
                </div>
              )}
            </>
          )}

          {equipment.category === 'armor' && (
            <>
              <div className="detail">AV: {(equipment as Armor).av}</div>
              <div className="detail">Slots: {equipment.slots}</div>
              {(equipment as Armor).specialRules && (
                <div className="detail special-rules">{(equipment as Armor).specialRules}</div>
              )}
              {strengthFails && (
                <div className="detail requirement">Requires {(equipment as Armor).requiredStrength}+ Strength</div>
              )}
            </>
          )}

          {equipment.category === 'item' && (
            <>
              <div className="detail">{(equipment as Item).ability}</div>
              <div className="detail">Slots: {equipment.slots}</div>
            </>
          )}

          {equipment.category === 'ammo' && (
            <>
              <div className="detail">Shots: {(equipment as Ammo).shots}</div>
              <div className="detail">Slots: {equipment.slots}</div>
            </>
          )}
        </div>

        {isSelected && <div className="checkmark">✓</div>}
      </div>
    );
  };

  return (
    <div className="equipment-picker">
      <div className="picker-header">
        <h2>Select Equipment</h2>
        <div className="slot-info">
          <div className="slot-usage">
            {slotsUsed} / {slotCapacity} slots used
          </div>
          <div className={`slot-bar ${remainingSlots > 0 ? 'available' : 'full'}`}>
            <div className="slot-fill" style={{ width: `${(slotsUsed / slotCapacity) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="picker-tabs">
        {(['weapons', 'armor', 'items', 'ammo'] as EquipmentTab[]).map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="picker-content">
        {activeTab === 'weapons' && (
          <div className="equipment-section">
            <h3>Weapons</h3>
            <div className="equipment-grid">
              {availableWeapons.map((weapon) => renderEquipmentCard(weapon))}
            </div>
            {availableWeapons.length === 0 && (
              <div className="no-equipment">No weapons available for your tech level</div>
            )}
          </div>
        )}

        {activeTab === 'armor' && (
          <div className="equipment-section">
            <h3>Armor</h3>
            <div className="equipment-grid">
              {availableArmor.map((armor) => renderEquipmentCard(armor))}
            </div>
            {availableArmor.length === 0 && (
              <div className="no-equipment">No armor available</div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="equipment-section">
            <h3>Items</h3>
            <div className="equipment-grid">
              {availableItems.map((item) => renderEquipmentCard(item))}
            </div>
            {availableItems.length === 0 && (
              <div className="no-equipment">No items available for your tech level</div>
            )}
          </div>
        )}

        {activeTab === 'ammo' && (
          <div className="equipment-section">
            <h3>Ammo</h3>
            <p className="ammo-note">Note: Ranged weapons include one free ammo stack</p>
            <div className="equipment-grid">
              {availableAmmo.map((ammo) => renderEquipmentCard(ammo))}
            </div>
            {availableAmmo.length === 0 && (
              <div className="no-equipment">No ammo available for your tech level</div>
            )}
          </div>
        )}
      </div>

      <div className="picker-footer">
        <button onClick={handleClear} className="btn-clear">
          Clear All
        </button>
        <button onClick={handleConfirm} className="btn-confirm">
          Confirm Equipment
        </button>
      </div>
    </div>
  );
};

export default EquipmentPicker;
