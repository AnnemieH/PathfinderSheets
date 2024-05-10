import { useEffect, useState } from "react"
import CharacterListItem from "./CharacterListItem";

export default function SelectCharacter ( props )
{
    const [allCharacters, setAllCharacters] = useState ([]);


    useEffect ( () => {
        const url = "http://localhost:8080/character/all";

        fetch(url)
        .then ( res => res.json() )
        .then ( data => setAllCharacters( data ) );
    }, [])

    return (
        <div>
            <h2>Select Character: </h2>
            <br />
            {allCharacters.map( character => (
                <CharacterListItem key={character.characterID} character={character} selectCharacter={props.selectCharacter}/>
            ))}
        </div>
    )
}