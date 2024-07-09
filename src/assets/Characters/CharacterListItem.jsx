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

    // Choose which class name to display
    function className()
    {
        let highestLevelClass = {};
        highestLevelClass.level = 0;

        let highestLevelPrestige = {};
        highestLevelPrestige.level = 0;

        // Check if any of the classes are prestige. If so, choose that
        for ( const charClass of character.derived.charClasses )
        {
            // Keep track of the class with the highest level
            if ( charClass.level > highestLevelClass.level )
            {
                highestLevelClass = charClass;
            }

            // Keep track of prestige classes separately

            if ( charClass.charClass.isPrestige === true  && charClass.level > highestLevelPrestige.level )
            {
                highestLevelPrestige = charClass;
            }

        }

        // Return the highest level prestige class if it exists, otherwise return the highest level class
        if ( highestLevelPrestige.level > 0 )
        {
            return highestLevelPrestige.charClass.className;
        }
        else
        {
            return highestLevelClass.charClass.className;
        }
        
    }

    return (
        <>
        {/* Make sure that character has been set before doïng anything*/}
        { Object.values(character).length > 0 &&
            <div key={character.raw.characterID} value={character.raw.characterID} className="characterListItem" onClick={selectCharacter}>
                {character.raw.name} the {formatRace(character.raw.race.raceName) + " "} 
                {/* {character.derived.charClasses.map( charClass => (
                    <span key={character.raw.characterID + "," + charClass.id.classID}> 
                        {" " + charClass.charClass.className} 
                    </span>
                ))} */}
                {className()}
            </div>
        }
        </>
    )
}