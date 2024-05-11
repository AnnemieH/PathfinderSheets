import { useEffect, useState } from "react"
import { getModifier } from "../Attributes/getModifier";
import SkillRowRank from "./SkillRowRank";

export default function SkillRow ( props )
{
    const [skill, setSkill] = useState({});
    const [currentCharacter, setCurrentCharacter] = useState({});
    const [skillRanks, setSkillRanks] = useState(0);

    // Set states from props
    useEffect ( () => {
        setSkill({...props.skill});
        setCurrentCharacter({...props.character});
    }, [props]);

    // Find the attribute modifier of currentCharacter associated with skill
    function getAttributeModifier ()
    {
        // Only run if we have a character
        if ( currentCharacter.attributes !== undefined )
        {
            const attribute = currentCharacter.attributes.find( elem => elem.id.attributeID == skill.attribute.attributeID );

            if ( attribute !== undefined )
            {
                return getModifier(attribute.value);
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
    };

    // Find any bonuses associatied with skill
    // INCOMPLETE, DO LATER
    function getBonuses ()
    {
        return 0 + classSkillBonus();
    }

    // Total all the bonuses
    function total()
    {
        return skillRanks + getAttributeModifier() + getBonuses();
    }

    function isCurrentSkill ( testSkill )
    {
        return testSkill.id.skillID === skill.skillID;
    }

    function isClassSkillOfClass ( charClass )
    {
        return charClass.charClass.classSkills.some( isCurrentSkill );
    }

    // Returns true if skill is a class skill of any of currentCharacters classes
    // False otherwise
    function isClassSkill ()
    {
        let isFound = false;
        // Iterate through all classes of currentCharacter
        currentCharacter.charClasses.forEach(charClass => {

            const classSkills = charClass.charClass.classSkills;
            
            if ( isClassSkillOfClass ( charClass ) )
            {
                isFound = true;
            }
        });

        return isFound;
    }

    function classSkillBonus ()
    {
        // Make sure we don't run this before we have a character
        if ( currentCharacter.charClasses !== undefined )
        {
            // Only give the class skill bonus if the skill is both a class skill and has been trained
            if ( isClassSkill() && skillRanks > 0 )
            {
                return 3;
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

    // Set skill ranks for the first time
    function initRanks ( ranks )
    {
        setSkillRanks ( ranks );
    }

    // Set ranks in the row and propagate it upwards as a JSON to patch
    function changeRanks ( ranks )
    {
        setSkillRanks ( ranks );

        let idJSON = {};
        idJSON.characterID = currentCharacter.characterID;
        idJSON.skillID = skill.skillID;

        let joinJSON = {};
        joinJSON.id = idJSON;
        joinJSON.skill = skill;
        joinJSON.ranks = ranks;

        props.update(joinJSON);
    }

    return (
        <tr>
            <td>{skill.skillName}</td>
            <SkillRowRank character={currentCharacter} skill={skill} ranks={changeRanks} init={initRanks}/>
            <td>{getAttributeModifier()}</td>
            <td>{getBonuses()}</td>
            <td className="skillTotal">{total()}</td>
        </tr>
    );
};