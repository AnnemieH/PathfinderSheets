import { useEffect, useState } from "react"
import ClassTable from "./ClassTable";


export default function ClassList()
{
    const [totalClasses, setTotalClasses] = useState([]);

    // Read all the classes from the API
    useEffect(() =>
    {
    const url = "http://localhost:8080/class/allClasses";
    fetch( url )
    .then( res => res.json())
    .then (data => setTotalClasses( data ));
    }, []
    );

    return(
        <ul>
            { totalClasses.map( charClass => (
                <>
                <span key = {"skills" + charClass.classID}>
                    Skills: {charClass.skillRanks} + INT <br />
                    Class Skills: {charClass.classSkills.map( skill => (
                        <span key = {charClass.classID + "" + skill.id.skillID}>{skill.skill.skillName + "(" + skill.skill.attribute.shortName + ")"}  </span>
                    ))}
                </span>
                <li key = {"class" + charClass.classID} value = {charClass.classID}>{charClass.className} <ClassTable currClass={charClass}/></li>
                </>
            )) }
        </ul>
    );
}