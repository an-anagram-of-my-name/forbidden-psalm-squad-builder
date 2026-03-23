import React, { useState } from 'react';

const EquipmentSelector = () => {
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const handleEquipmentChange = (equipment) => {
    setSelectedEquipment((prev) => {
      if (prev.includes(equipment)) {
        return prev.filter((item) => item !== equipment);
      } else {
        return [...prev, equipment];
      }
    });
  };

  const equipmentList = ['Axe', 'Sword', 'Shield', 'Bow'];

  return (
    <div>
      <h2>Select Equipment</h2>
      <ul>
        {equipmentList.map((equipment) => (
          <li key={equipment}>
            <label>
              <input
                type="checkbox"
                checked={selectedEquipment.includes(equipment)}
                onChange={() => handleEquipmentChange(equipment)}
              />
              {equipment}
            </label>
          </li>
        ))}
      </ul>
      <h3>Selected Equipment:</h3>
      <ul>
        {selectedEquipment.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentSelector;