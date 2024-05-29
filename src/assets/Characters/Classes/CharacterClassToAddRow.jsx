import { useEffect, useState } from "react";
import CharacterArchetypesOfBaseClass from "./CharacterArchetypesOfBaseClass";


// PROPS
// base - the base class for the row
// archetypes - all archetypes for base class 
// TO DO add validation for archetypes and base
// addClass(classes, level) - a function to add an array of classes of a given level
// removeClasses(classes) - a function to remove an array of classes
export default function CharacterClassToAddRow ( props )
{
    const [level, setLevel] = useState(0);

    // Initial loading
    useEffect(() => {
        // Disable the add button
        document.getElementById("classAddButton").disabled = true;
    },[])

    function levelValidation ( level )
    {
        // Create a regex for validation
        const validationRegex = /^[0-9]+$/

        // Check if input is a number, if it's not, return false
        if ( !validationRegex.test(level) )
        {
            return false;
        }
        else 
        {
            // Now that we've verified we're dealing with a number, parse it as one and check that we're in allowed ranges
            const input = parseInt(level);

            // If it's not in the allowed range, return false
            if ( input < 0 || input > 20 )
            {
                return false;
            }
            // Everything's good, so return true
            else
            {
                return true;
            }
        }
    }

    function levelChanged ( event )
    {
        // Check whether we have a valid input, if we don't, revert it to an empty string
        if ( !levelValidation( event.target.value) )
        {
            event.target.value = "";
            document.getElementById("classAddButton").disabled = true;
        }
        else
        {
            document.getElementById("classAddButton").disabled = false;
        }

        setLevel(event.target.value);
    }

    function addClass ()
    {
        props.addClass([props.base].concat(props.archetypes), level);
    }

    return (
        <tr>
            <td>
                {props.base.className}
            </td>
            <td>
                <CharacterArchetypesOfBaseClass archetypes={props.archetypes} />
            </td>
            <td>
                <label htmlFor="level">Level: </label>
            </td>
            <td>
                <input type="text" id="level" name="level" size={2} onChange={levelChanged}/>
            </td>
            <td>
                <button id="classAddButton" onClick={addClass}>Add</button>
            </td>
        </tr>
    )
}