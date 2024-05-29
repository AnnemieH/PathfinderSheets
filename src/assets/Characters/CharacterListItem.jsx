import { useEffect, useState } from "react"

export default function CharacterListItem( props )
{
    const [character, setCharacter] = useState({});

    useEffect ( () => {
        setCharacter(props.character);
    }, [props])

    // Format the race or add bespoke features to specific characters
    function formatRace ( input )
    {
        if ( character.characterID == 1 )
        {
            return (
                <span key={character.characterID + "," + character.race.raceID}>
                    <span key={character.characterID + "," + character.race.raceID + "strike"}className="strike">{input}</span>
                    &nbsp;Half-Human
                </span>
            );
        }
        else
        {
            return input;
        }
    }

    // If character is clicked, tell Character.jsx that this has been selected and place the fetched JSON in a raw object
    function selectCharacter ()
    {
        props.selectCharacter(character);
    }

    return (
        <>
        {/* Make sure that character has been set before doïng anything*/}
        { Object.values(character).length > 0 &&
            <div key={character.raw.characterID} value={character.raw.characterID} className="characterListItem" onClick={selectCharacter}>
                {character.raw.name} the {formatRace(character.raw.race.raceName)} 
                {character.derived.charClasses.map( charClass => (
                    <span key={character.raw.characterID + "," + charClass.id.classID}> 
                        {" " + charClass.charClass.className} 
                    </span>
                ))}
            </div>
        }
        </>
    )
}