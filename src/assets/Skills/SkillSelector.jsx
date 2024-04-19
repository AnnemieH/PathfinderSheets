import { useEffect, useState } from "react"

export default function SkillSelector( props )
{
    const [allSkills, setAllSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // Save all skills in allSkills
    useEffect(() => {   
        const url = "http://localhost:8080/skill/allSkills";

        fetch(url)
        .then(res => res.json())
        .then(data => setAllSkills(data.sort((a, b) => {
            if (a.skillID < b.skillID)
            {
                return -1;
            }
        })));
    }, [])

    // When selectedSkills changes, propagate it upwards
    useEffect (() => {
        props.classSkillsSelected ( selectedSkills );
    }, [selectedSkills])

    // Returns true is a skill has been selected, false otherwise
    function isSelected ( skill )
    {
        return selectedSkills.includes(skill);
    }

    function selectSkill ( skill )
    {
        // Check to see if the clicked skill is already selected
        // If it is, remove it
        if ( selectedSkills.includes(skill) )
        {
            let temp = selectedSkills.slice();
            temp.splice(selectedSkills.indexOf(skill), 1);


            setSelectedSkills(temp);
        }
        // If it has not been previously selected, select it
        else
        {
            setSelectedSkills(selectedSkills.concat(skill));   
        }
    }

    return (
        <table id={props.id}>
            <tbody>
                {allSkills.map(skill => (
                    <tr key={skill.skillID + "Row"} className={"ClassSkill " + isSelected(skill)}>
                        <td key={skill.skillID + "Cell"} value={skill.skillID} className="skillSelectorItem" onClick={() => selectSkill(skill)}>
                            {skill.skillName}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}