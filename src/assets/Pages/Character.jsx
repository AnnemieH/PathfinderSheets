import { useEffect, useState } from "react"
import CharacterListItem from "../Characters/CharacterListItem";
import SelectCharacter from "../Characters/SelectCharacter";
import CharacterSheet from "../Characters/CharacterSheet";

export default function Character ()
{
    const [currentCharacter, setCurrentCharacter] = useState({});

    function selectCharacter ( selectedCharacter )
    {
        setCurrentCharacter(selectedCharacter);
    }

    return (
        <>
        { Object.values(currentCharacter).length === 0
        ? <SelectCharacter selectCharacter={selectCharacter} />
        : <CharacterSheet character={currentCharacter}/>
        }
        </>
    )
}