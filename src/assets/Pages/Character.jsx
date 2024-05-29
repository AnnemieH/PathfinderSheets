import { useEffect, useState } from "react"
import SelectCharacter from "../Characters/SelectCharacter";
import CharacterSheet from "../Characters/CharacterSheet";
import { formatCharacter } from "../Characters/Functions/formatCharacter";

export default function Character ()
{
    const [currentCharacter, setCurrentCharacter] = useState({});

    // Refresh the character
    function refreshCharacter()
    {
        const url = "http://localhost:8080/character/" + currentCharacter.raw.characterID;

        fetch(url)
        .then( res => res.json() )
        .then( data => selectCharacter(formatCharacter(data)) );
    }

    function selectCharacter ( selectedCharacter )
    {
        // Perform initial modifications to the character object

        setCurrentCharacter({...selectedCharacter});
    }

    return (
        <span id="character">
        { Object.values(currentCharacter).length === 0
        ? <SelectCharacter selectCharacter={selectCharacter} />
        : <CharacterSheet character={currentCharacter} refresh={refreshCharacter}/>
        }
        </span>
    )
}