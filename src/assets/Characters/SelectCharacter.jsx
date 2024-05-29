import { useEffect, useState } from "react"
import CharacterListItem from "./CharacterListItem";
import { formatCharacter } from "./Functions/formatCharacter";

export default function SelectCharacter ( props )
{
    const [allCharacters, setAllCharacters] = useState ([]);


    useEffect ( () => {
        const url = "http://localhost:8080/character/all";

        fetch(url)
        .then ( res => res.json() )
        .then ( data => setAllCharacters( formatCharacters(data) ) );
    }, [])

    function formatCharacters ( charArray )
    {
        const characterArray = [];

        charArray.forEach( character => {
            characterArray.push(formatCharacter(character));
        });

        return characterArray
    }

    return (
        <div>
            <h2>Select Character: </h2>
            <br />
            {allCharacters.map( character => (
                <CharacterListItem key={character.raw.characterID} character={character} selectCharacter={props.selectCharacter}/>
            ))}
        </div>
    )
}