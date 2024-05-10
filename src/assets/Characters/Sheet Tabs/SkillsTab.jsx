import { useEffect, useState } from "react";
import SkillRow from "../../Skills/SkillRow";

export default function SkillsTab ( props )
{
    const [currentCharacter, setCurrentCharacter] = useState({});
    const [allSkills, setAllSkills] = useState([]);

    // Set up states when props changes
    useEffect ( () => {
        setCurrentCharacter(props.character);
    }, [props]);

    // Read in skills from the API
    useEffect ( () => {
        const url = "http://localhost:8080/skill/allSkills";

        fetch(url)
        .then ( res => res.json() )
        .then ( data => setAllSkills( data ));
    }, []);

    function update ( skillJSON )
    {
        let skillArray = [...currentCharacter.skillRanks];

        let isFound = false;
        
        // Check to see if the new skill is already in the character
        for ( let skill of skillArray )
        {
            // If skillJSON represents a skill in skillArray, update the ranks
            if ( skill.id.skillID == skillJSON.id.skillID )
            {
                skill.ranks = skillJSON.ranks;
                isFound = true;
            }
        }

        // If we have not found, add it to skillArray
        if ( isFound === false )
        {
            skillArray.push( skillJSON );
        }

        let finalJSON = {};
        finalJSON.skillRanks = skillArray;

        props.update(JSON.stringify(finalJSON));
    }

    return (
        <table>
            <thead>
                <tr>
                    <td>Skill</td>
                    <td>Ranks</td>
                    <td>Ability</td>
                    <td>Bonus</td>
                    <td>Total</td>
                </tr>
            </thead>
            <tbody>
                {allSkills.map( skill => (
                    <SkillRow key={skill.skillID} skill={skill} character={currentCharacter} update={update}/>
                ))}
            </tbody>
        </table>
    );
}