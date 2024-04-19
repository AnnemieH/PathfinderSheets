import { useEffect, useState } from "react"

export default function BaseClassSelector ( props )
{
    const [allClasses, setAllClasses] = useState([]);
    const [baseClasses, setBaseClasses] = useState([]);


    // Load in all classes
    useEffect(() => {
        const url = "http://localhost:8080/class/allClasses";

        fetch(url)
        .then( res => res.json() )
        .then( data => setAllClasses(data) );
    }, []);

    // Once classes are loaded in, filter to those 
    // which are not themselves archetypes
    useEffect(() => 
    {
        // Check to see if allClasses has been set yet
        if ( allClasses.length !== 0 )
        {
            let base = [];


            allClasses.map((c) => 
            {
                if(!c.hasOwnProperty("archetypeID"))
                {
                    base.push(c);
                }
            })

            setBaseClasses(base);
        }
    }, [allClasses])

    // Handle a change in the baseClassSelector
    function baseClassChanged ( event )
    {
        // If the value is not an integer, clear base class in parent
        if ( isNaN(parseInt(event.target.value)))
        {
            props.baseClassSelected({})
        }
        // Otherwise set the base class in the parent to be the one selected here
        else
        {
            props.baseClassSelected(baseClasses.find((elem) => elem.classID == event.target.value))
        }
    }

    return (
        <select name="baseClassSelector" id="baseClassSelector" onChange={baseClassChanged}>
            <option value="placeholder">No archetype</option>
            {baseClasses.map(base => (
                <option key={base.classID} value={base.classID}>{base.className}</option>
            ))}
        </select>
    )
}