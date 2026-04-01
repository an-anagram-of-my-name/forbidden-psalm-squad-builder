import React, { useState, useMemo } from 'react';
import { Character, Equipment, Item, Ammo, Armor, Weapon, Consumable, Drone } from '../types';
import { FlawData, FeatData } from '../types/featsandflaws28Psalms';
import { canUseArmor, calculateTotalCost } from '../utils/equipment';
import { applyFlawFeatModifiers, calculateFinalDerivedStats } from '../utils/stats';
import { getGameConfig } from '../types/games';
import './EquipmentPicker.css';

interface EquipmentPickerProps {
  character: Character;
  selectedEquipment: Equipment[];
  onEquipmentChange: (equipment: Equipment[]) => void;
  weaponsData?: {
    pastTech: Weapon[];
    futureTech: Weapon[];
  };
  armorData?: Armor[];
  itemsData?: Item[];
  ammoData?: Ammo[];
  consumablesData?: Consumable[];
  dronesData?: Drone[];
  flawsData?: FlawData[];
  featsData?: FeatData[];
  afterStats?: React.ReactNode;
}

type EquipmentTab = 'weapons' | 'armor' | 'items' | 'ammo-consumables' | 'drones';

const CONSUMABLE_IDS = ['molotov', 'black-powder-bomb', 'grenade', 'future-molotov'];

const EquipmentPicker: React.FC<EquipmentPickerProps> = ({ character, selectedEquipment, onEquipmentChange, weaponsData, armorData, itemsData, ammoData, consumablesData, dronesData, flawsData, featsData, afterStats }) => {
  const [activeTab, setActiveTab] = useState<EquipmentTab>('weapons');
  const config = getGameConfig(character.gameId);

  // Resolve data sources: use provided props, falling back to game config's equipment data
  const gameEquipment = config.equipmentData;
  const pastTechWeapons = weaponsData?.pastTech ?? gameEquipment.weapons.pastTech;
  const futureTechWeapons = weaponsData?.futureTech ?? gameEquipment.weapons.futureTech;
  const armorList = armorData ?? gameEquipment.armor;
  const itemsList = itemsData ?? gameEquipment.items;
  const ammoList = ammoData ?? gameEquipment.ammo;
  const consumablesList = consumablesData ?? gameEquipment.consumables;
  const dronesList = dronesData ?? gameEquipment.drones ?? [];

  const effectiveStats = useMemo(() => {
    return applyFlawFeatModifiers(character.stats, character.flaw, character.feat, character.gameId, flawsData, featsData);
  }, [character.stats, character.flaw, character.feat, character.gameId, flawsData, featsData]);

  // Calculate total slots used
  const slotsUsed = useMemo(() => {
    return selectedEquipment.reduce((total, eq) => total + eq.slots, 0);
  }, [selectedEquipment]);

  // Calculate slot capacity: 5 + Strength modifier (using effective stats)
  const slotCapacity = useMemo(() => {
    return 5 + effectiveStats.strength;
  }, [effectiveStats.strength]);

  const remainingSlots = slotCapacity - slotsUsed;

  // Filter equipment by tech level compatibility
  const canEquipTech = (equipTechLevel: string | null | undefined): boolean => {
    if (equipTechLevel === null || equipTechLevel === undefined) {
      return true; // Tech-agnostic equipment can always be equipped
    }
    if (character.techLevel === undefined) {
      return true; // No tech level restriction — show all equipment
    }
    if (character.techLevel === 'future-tech') {
      return true; // Future-tech characters can use anything
    }
    // Past-tech characters can only use past-tech equipment
    return equipTechLevel === 'past-tech';
  };

  // Get all available weapons (past-tech + future-tech if compatible), excluding consumables
  const availableWeapons = useMemo(() => {
    const allWeapons = [...pastTechWeapons, ...futureTechWeapons];
    return allWeapons.filter((weapon) => canEquipTech(weapon.techLevel) && !CONSUMABLE_IDS.includes(weapon.id));
  }, [character.techLevel, pastTechWeapons, futureTechWeapons]);

  // Get all available armor (all are tech-agnostic)
  const availableArmor = useMemo(() => {
    return armorList.filter((armor) => canEquipTech(armor.techLevel));
  }, [character.techLevel, armorList]);

  // Get all available items
  const availableItems = useMemo(() => {
    return itemsList.filter((item) => canEquipTech(item.techLevel));
  }, [character.techLevel, itemsList]);

  // Get all available ammo
  const availableAmmo = useMemo(() => {
    return ammoList.filter((ammo) => canEquipTech(ammo.techLevel));
  }, [character.techLevel, ammoList]);

  // Get all available consumables: weapon-array-derived (28P) + consumables data (game config)
  const availableConsumables = useMemo(() => {
    const weaponDerived = [...pastTechWeapons, ...futureTechWeapons].filter(
      (weapon) => canEquipTech(weapon.techLevel) && CONSUMABLE_IDS.includes(weapon.id)
    );
    const fromData = consumablesList.filter((c) => canEquipTech(c.techLevel));
    return [...weaponDerived, ...fromData];
  }, [character.techLevel, pastTechWeapons, futureTechWeapons, consumablesList]);

  // Get all available drones
  const availableDrones = useMemo(() => {
    return dronesList.filter((drone) => canEquipTech(drone.techLevel));
  }, [character.techLevel, dronesList]);

  const isAmmoOrConsumable = (equipment: Equipment): boolean => {
    return equipment.category === 'ammo' || equipment.category === 'consumable' || CONSUMABLE_IDS.includes(equipment.id);
  };

  const handleEquipmentToggle = (equipment: Equipment) => {
    if (isAmmoOrConsumable(equipment)) {
      // Ammo/consumables: always add a new instance (stackable)
      if (slotsUsed + equipment.slots <= slotCapacity) {
        onEquipmentChange([...selectedEquipment, equipment]);
      }
    } else {
      const isSelected = selectedEquipment.some((eq) => eq.id === equipment.id);
      if (isSelected) {
        onEquipmentChange(selectedEquipment.filter((eq) => eq.id !== equipment.id));
      } else {
        // Check if adding this equipment would exceed slot capacity
        if (slotsUsed + equipment.slots <= slotCapacity) {
          onEquipmentChange([...selectedEquipment, equipment]);
        }
      }
    }
  };

  // Toggle AI upgrade on a selected drone (+200 cost when isAI=true)
  const handleDroneAIToggle = (drone: Drone) => {
    const existing = selectedEquipment.find((eq) => eq.id === drone.id) as Drone | undefined;
    if (!existing) return;
    const updated = { ...existing, isAI: !existing.isAI, cost: existing.isAI ? drone.cost : drone.cost + 200 };
    onEquipmentChange(selectedEquipment.map((eq) => (eq.id === drone.id ? updated : eq)));
  };

  const handleRemoveAll = (equipment: Equipment) => {
    onEquipmentChange(selectedEquipment.filter((eq) => eq.id !== equipment.id));
  };

  const isEquipmentSelected = (equipment: Equipment) => {
    return selectedEquipment.some((eq) => eq.id === equipment.id);
  };

  const isArmorSelected = useMemo(() => {
    return selectedEquipment.some((eq) => eq.category === 'armor');
  }, [selectedEquipment]);

  const canAddMore = remainingSlots > 0;

  const tabs = useMemo((): EquipmentTab[] => {
    const base: EquipmentTab[] = ['weapons', 'armor', 'items', 'ammo-consumables'];
    return availableDrones.length > 0 ? [...base, 'drones'] : base;
  }, [availableDrones.length]);

  const renderEquipmentCard = (equipment: Equipment) => {
    const isSelected = isEquipmentSelected(equipment);
    const isStackable = isAmmoOrConsumable(equipment);
    const instanceCount = isStackable ? selectedEquipment.filter((eq) => eq.id === equipment.id).length : 0;

    let canAdd: boolean;
    let strengthFails = false;

    if (equipment.category === 'armor') {
      const requiredStr = (equipment as Armor).requiredStrength;
      strengthFails = requiredStr !== undefined && !canUseArmor(effectiveStats.strength, requiredStr);
      const blockedByOtherArmor = isArmorSelected && !isSelected;
      canAdd = !strengthFails && !blockedByOtherArmor;
    } else if (isStackable) {
      canAdd = slotsUsed + equipment.slots <= slotCapacity;
    } else {
      canAdd = canAddMore || isSelected;
    }

    return (
      <div
        key={equipment.id}
        className={`equipment-card ${isSelected || instanceCount > 0 ? 'selected' : ''} ${!canAdd ? 'disabled' : ''}`}
        onClick={() => {
          if (canAdd || (isSelected && !isStackable)) {
            handleEquipmentToggle(equipment);
          }
        }}
      >
        <div className="equipment-header">
          <div className="equipment-name">
            {equipment.name}
            {isStackable && instanceCount > 0 && <span className="instance-count"> [x{instanceCount}]</span>}
          </div>
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

          {equipment.category === 'drone' && (() => {
            const drone = equipment as Drone;
            return (
              <>
                {drone.hp != null && <div className="detail">HP: {drone.hp}</div>}
                {drone.av != null && <div className="detail">AV: {drone.av}</div>}
                {drone.slots > 0 && <div className="detail">Slots: {drone.slots}</div>}
                {drone.slots === 0 && <div className="detail">Slots: 0 (no slot cost)</div>}
                {drone.specialRules && <div className="detail special-rules">{drone.specialRules}</div>}
                {drone.statModifiers && Object.keys(drone.statModifiers).length > 0 && (
                  <div className="detail">
                    Stat mods:{' '}
                    {Object.entries(drone.statModifiers)
                      .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} ${v > 0 ? '+' : ''}${v}`)
                      .join(', ')}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {!isStackable && isSelected && <div className="checkmark">✓</div>}
        {isStackable && instanceCount > 0 && (
          <button
            className="remove-all-btn"
            title="Remove all"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveAll(equipment);
            }}
          >
            ✕
          </button>
        )}
        {equipment.category === 'drone' && isSelected && (equipment as Drone).allowAI && (
          <label
            className="drone-ai-label"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={!!(selectedEquipment.find((eq) => eq.id === equipment.id) as Drone | undefined)?.isAI}
              onChange={() => handleDroneAIToggle(equipment as Drone)}
            />
            {' '}Upgrade to AI Drone (+200 cr)
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="equipment-picker">
      <div className="picker-header">
        <h2>Select Equipment</h2>
      </div>

      <div className="current-stats">
        {config.statNames.map((stat) => (
          <div key={stat} className="stat-box">
            <div className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
            <div className="stat-value">{(effectiveStats[stat] ?? 0) > 0 ? `+${effectiveStats[stat] ?? 0}` : effectiveStats[stat] ?? 0}</div>
          </div>
        ))}
        <div className="current-stats-divider" />
        <div className="current-stats-derived">
          {(() => {
            const derived = calculateFinalDerivedStats(character.stats, character.flaw, character.feat, selectedEquipment, character.gameId, flawsData, featsData);
            return config.statNames
              .filter((stat) => !!config.derivedStatMap[stat])
              .map((stat) => {
                const derivedInfo = config.derivedStatMap[stat]!;
                return (
                  <div key={stat} className="stat-box derived">
                    <div className="stat-label">{derivedInfo.label}</div>
                    <div className="stat-value">{derived[derivedInfo.derivedKey]}</div>
                  </div>
                );
              });
          })()}
        </div>
        <div className="current-stats-divider" />
        <div className="stat-box cost">
          <div className="stat-label">CR</div>
          <div className="stat-value">{calculateTotalCost(selectedEquipment, ammoList)}</div>
        </div>
      </div>

      {afterStats}

      <div className="slot-info">
        <div className="slot-usage">
          {slotsUsed} / {slotCapacity} slots used
        </div>
        <div className={`slot-bar ${remainingSlots > 0 ? 'available' : 'full'}`}>
          <div className="slot-fill" style={{ width: `${(slotsUsed / slotCapacity) * 100}%` }}></div>
        </div>
      </div>

      <div className="picker-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'ammo-consumables' ? 'Ammo/Consumables' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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

        {activeTab === 'ammo-consumables' && (
          <div className="equipment-section">
            <h3>Ammo & Consumables</h3>
            <p className="ammo-note">Note: Ranged weapons include one free ammo stack</p>
            <div className="equipment-grid">
              {[...availableAmmo, ...availableConsumables].map((item) => renderEquipmentCard(item))}
            </div>
            {availableAmmo.length === 0 && availableConsumables.length === 0 && (
              <div className="no-equipment">No ammo or consumables available for your tech level</div>
            )}
          </div>
        )}

        {activeTab === 'drones' && (
          <div className="equipment-section">
            <h3>Drones</h3>
            <div className="equipment-grid">
              {availableDrones.map((drone) => renderEquipmentCard(drone))}
            </div>
            {availableDrones.length === 0 && (
              <div className="no-equipment">No drones available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentPicker;
