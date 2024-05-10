import { useEffect, useState } from "react";
import { totalCharacterLevel } from "../Characters/Functions/totalCharacterLevel";

export default function SkillRowRank ( props )
{
    const [currentCharacter, setCurrentCharacter] = useState({});
    const [skill, setSkill] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [ranks, setRanks] = useState(0);
    const [tempRanks, setTempRanks] = useState(0);

    // Set states from props if they are different
    useEffect( () => {
        if ( props.character.characterID !== currentCharacter.characterID )
        {
            setCurrentCharacter({...props.character});
        }

        if ( props.skill.skillID !== skill.skillID )
        {
            setSkill({...props.skill});
        }
    }, [props])

    // Change ranks whenever character changes
    useEffect( () => {
        if ( currentCharacter.skillRanks !== undefined )
        {
            setRanks(getSkillRanks());
        }
    }, [currentCharacter])

    // Whenever ranks changes, propagate it to SkillRow
    useEffect( () => {
        if ( currentCharacter.skillRanks !== undefined )
        {
            props.ranks(ranks);
        }
    }, [ranks])

    // Find the skill ranks of this character from this skill and propagate it to SkillRow
    function getSkillRanks ()
    {
        // Only run if we have a character
        if ( currentCharacter.skillRanks !== undefined )
        {
            const charSkill = currentCharacter.skillRanks.find( elem => elem.id.skillID == skill.skillID );

            if ( charSkill !== undefined )
            {
                return parseInt(charSkill.ranks);
            }
            else
            {
                return 0;
            }
        }
        else
        {
            return 0;
        }
    }
    
    // If we are not editing, set editing mode. Otherwise stay in editing mode
    function changeRanks ()
    {
        if ( !isEditing )
        {
            setIsEditing(!isEditing);
        }
    }

    function inputValidation ( event )
    {
        // Create a regex for validation
        const validationRegex = /^[0-9]+$/

        // Check if input is a number
        if ( !validationRegex.test(event.target.value) && event.target.value !== "" )
        {
            event.target.value = ranks;
        }
        else 
        {
            // Now that we've verified we're dealing with a number, parse it as one and check that we're in allowed ranges
            const input = parseInt(event.target.value);

            if ( input < 0 || input > totalCharacterLevel( currentCharacter ))
            {
                event.target.value = ranks;
            }
            // Everything's good, so keep track of this value in tempRanks
            else
            {
                setTempRanks(input);
            }
        }
        
    }

    function submit ()
    {
        // Propagate tempRanks up
        setRanks(tempRanks);

        // We are no longer editing so set isEditing to false
        setIsEditing(false);
    }

    // Change what is displayed depending on whether we're editing or not
    if ( isEditing )
    {
        return (
            <td onClick={changeRanks}>
                <input type="text" defaultValue={ranks} size={2} onChange={inputValidation}/>
                <button type="button" onClick={submit}>Submit</button>
            </td>
        )
    }
    else
    {
        return (
            <td onClick={changeRanks}>
                {ranks}
            </td>
        )        
    }
}