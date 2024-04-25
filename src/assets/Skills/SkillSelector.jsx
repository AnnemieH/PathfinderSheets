import { useEffect, useState } from "react";

export default function SkillSelector( props )
{
    const [allSkills, setAllSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [initialValue, setInitialValue] = useState([]);

    // Save all skills in allSkills
    useEffect(() => {
        // Only run if allSkills is empty
        if ( allSkills.length === 0 )
        {
            const url = "http://localhost:8080/skill/allSkills";

            fetch(url)
            .then(res => res.json())
            .then(data => setAllSkills(reformatSkills(data).sort((a, b) => {
                if (a.id.skillID < b.id.skillID)
                {
                    return -1;
                }
            })));
        }
    }, [])

    // Once we have all skills, reformat them to look like the objects we expect
    function reformatSkills ( skillsInput )
    {
        let skills = [...skillsInput]

        skills.forEach( skill => {
            let newSkill = {};
            newSkill.skill = {...skill};
            newSkill.id = {};
            newSkill.id.skillID = skill.skillID;
            Object.assign(skill, newSkill)
            delete skill.attribute;
            delete skill.skillID;
            delete skill.skillName;
            delete skill.trainedOnly;
        });

        return skills;
    }

    useEffect ( () => {
        // Exchange the raw objects for Officiäl Skills(tm) which will be recognised by .includes
        const tempArray = [...props.init];

        for ( let i = 0; i < props.init.length; ++i )
        {
            tempArray[i] = allSkills.find( skill => skill.id.skillID == tempArray[i].id.skillID );
        }
        
        setInitialValue(tempArray)
    }, [props.init])

    // Update selectedSkills when given an initial value
    useEffect ( () => {
        // Check if initialValue differs by value from selectedSkills and only update selectedSkills if this is the case
        if ( JSON.stringify(initialValue) !== JSON.stringify(selectedSkills)  )
        {
            // We wish to select skills in initialValue that are not already selected and deselect selectedSkills that are not in initialValue
            // So we take the XOR
            let arrayXOR = initialValue.filter( skill => !selectedSkills.includes(skill) ).concat( selectedSkills.filter( skill => !initialValue.includes(skill) ) );
            selectSkills(arrayXOR);
        }
    }, [initialValue])

    // When selectedSkills changes, propagate it upwards
    useEffect (() => {
        props.classSkillsSelected ( selectedSkills );
    }, [selectedSkills])

    // Returns true is a skill has been selected, false otherwise
    function isSelected ( skill )
    {
        return selectedSkills.includes(skill);
    }

    function selectSkills ( skillArr )
    {
        // Deal with skills one at a time and sort them into arrays based on whether we want to add them or remove them
        let skillsToAdd = [];
        let skillsToRemove = [];

        skillArr.forEach( skill => {
            // Check to see if the clicked skill is already selected
            // If it is, remove it
            if ( selectedSkills.includes(skill) )
            {
                skillsToRemove.push(skill);
            }
            // If it has not been previously selected, select it
            else
            {
                skillsToAdd.push(skill);
            }
        });


        let filteredSkills = [...selectedSkills];
        filteredSkills = filteredSkills.filter( skill => !skillsToRemove.includes(skill) );
        filteredSkills = filteredSkills.concat( skillsToAdd );

        // Exchange the raw objects for Officiäl Skills(tm) which will be recognised by .includes
        for ( let i = 0; i < filteredSkills.length; ++i )
        {
            filteredSkills[i] = allSkills.find( skill => skill.id.skillID == filteredSkills[i].id.skillID );
        }

        setSelectedSkills(filteredSkills);
    }

    return (
        <table id={props.id}>
            <tbody>
                {allSkills.map(skill => (
                    <tr key={skill.id.skillID + "Row"} className={"ClassSkill " + isSelected(skill)}>
                        <td key={skill.id.skillID + "Cell"} value={skill.id.skillID} className="skillSelectorItem" onClick={() => selectSkills([skill])}>
                            {skill.skill.skillName}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}