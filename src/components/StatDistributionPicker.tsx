import React, { useState } from 'react';

const StatDistributionPicker = () => {
    const [distribution, setDistribution] = useState('');

    const handleChange = (event) => {
        setDistribution(event.target.value);
    };

    return (
        <div>
            <h2>Select Stat Distribution</h2>
            <select value={distribution} onChange={handleChange}>
                <option value="normal">Normal</option>
                <option value="uniform">Uniform</option>
                <option value="exponential">Exponential</option>
                <option value="poisson">Poisson</option>
            </select>
            <p>You selected: {distribution}</p>
        </div>
    );
};

export default StatDistributionPicker;