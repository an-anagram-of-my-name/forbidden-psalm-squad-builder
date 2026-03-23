import React, { useState } from 'react';
import { Equipment, EquipmentType } from '../types';
import './EquipmentPicker.css';

interface EquipmentPickerProps {
    onEquipmentSelected: (equipment: Equipment[]) => void;
    maxSelections?: number;
}

const equipmentOptions: Equipment[] = [
    {
        id: 'sword',
        name: 'Sword',
        type: 'weapon',
        description: 'A reliable melee weapon',
    },
    {
        id: 'rifle',
        name: 'Rifle',
        type: 'weapon',
        description: 'A ranged firearm',
    },
    {
        id: 'pistol',
        name: 'Pistol',
        type: 'weapon',
        description: 'A compact sidearm',
    },
    {
        id: 'grenade',
        name: 'Grenade',
        type: 'weapon',
        description: 'An explosive device',
    },
    {
        id: 'armor',
        name: 'Armor',
        type: 'gear',
        description: 'Body protection',
    },
    {
        id: 'shield',
        name: 'Shield',
        type: 'gear',
        description: 'Defensive equipment',
    },
    {
        id: 'backpack',
        name: 'Backpack',
        type: 'gear',
        description: 'Equipment storage',
    },
    {
        id: 'rope',
        name: 'Rope',
        type: 'gear',
        description: 'Utility rope and cord',
    },
    {
        id: 'medkit',
        name: 'Medical Kit',
        type: 'consumable',
        description: 'Medical supplies and first aid',
    },
    {
        id: 'rations',
        name: 'Rations',
        type: 'consumable',
        description: 'Food and water supplies',
    },
];

const EquipmentPicker: React.FC<EquipmentPickerProps> = ({ onEquipmentSelected, maxSelections = 5 }) => {
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

    const handleEquipmentToggle = (equipment: Equipment) => {
        const isSelected = selectedEquipment.some((eq) => eq.id === equipment.id);

        if (isSelected) {
            setSelectedEquipment(selectedEquipment.filter((eq) => eq.id !== equipment.id));
        } else {
            if (selectedEquipment.length < maxSelections) {
                setSelectedEquipment([...selectedEquipment, equipment]);
            }
        }
    };

    const handleConfirm = () => {
        onEquipmentSelected(selectedEquipment);
    };

    const groupedEquipment = equipmentOptions.reduce((acc, eq) => {
        if (!acc[eq.type]) {
            acc[eq.type] = [];
        }
        acc[eq.type].push(eq);
        return acc;
    }, {} as Record<EquipmentType, Equipment[]>);

    const equipmentTypes: EquipmentType[] = ['weapon', 'gear', 'consumable'];

    return (
        <div className="equipment-picker">
            <h2>Select Equipment</h2>
            <p className="selection-info">
                {selectedEquipment.length} / {maxSelections} selected
            </p>

            <div className="equipment-categories">
                {equipmentTypes.map((type) => (
                    <div key={type} className="equipment-category">
                        <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                        <div className="equipment-grid">
                            {groupedEquipment[type]?.map((equipment) => {
                                const isSelected = selectedEquipment.some((eq) => eq.id === equipment.id);
                                return (
                                    <div
                                        key={equipment.id}
                                        className={`equipment-card ${isSelected ? 'selected' : ''} ${
                                            selectedEquipment.length >= maxSelections && !isSelected ? 'disabled' : ''
                                        }`}
                                        onClick={() => handleEquipmentToggle(equipment)}
                                    >
                                        <div className="equipment-name">{equipment.name}</div>
                                        <div className="equipment-description">{equipment.description}</div>
                                        {isSelected && <div className="checkmark">✓</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={handleConfirm} className="btn-confirm">
                Confirm Equipment
            </button>
        </div>
    );
};

export default EquipmentPicker;
