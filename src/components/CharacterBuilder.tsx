import React from 'react';

const CharacterBuilder: React.FC = () => {
    const [characters, setCharacters] = React.useState([]);

    const addCharacter = () => {
        const newCharacter = { name: '', attributes: {} };
        setCharacters([...characters, newCharacter]);
    };

    return (
        <div>
            <h1>Character Builder</h1>
            <button onClick={addCharacter}>Add Character</button>
            <div>
                {characters.map((character, index) => (
                    <div key={index}>
                        <h2>Character {index + 1}</h2>
                        {/* Add more character fields as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterBuilder;
